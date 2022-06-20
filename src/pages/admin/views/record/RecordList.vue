<template>
  <div class="flex-container">
    <div id="main">
      <Panel shadow>
        <div slot="title">借阅记录</div>
        <div slot="extra">
          <ul class="filter">
            <li>
              <Dropdown @on-click="handleStateChange">
                <span>
                  {{ stateText }}
                  <Icon type="arrow-down-b"></Icon>
                </span>
                <Dropdown-menu slot="list">
                  <Dropdown-item name="">所有状态</Dropdown-item>
                  <Dropdown-item name="0">未归还</Dropdown-item>
                  <Dropdown-item name="1">已归还</Dropdown-item>
                </Dropdown-menu>
              </Dropdown>
            </li>
            <li>
              <Input v-model="query.userName" placeholder="用户名" @on-enter="handleQueryChange"></Input>
            </li>
            <li>
              <Input v-model="query.keyWord" placeholder="ISBN码、书名、作者..." @on-enter="handleQueryChange"></Input>
            </li>
            <li>
              <Button type="info" icon="refresh" @click="getRecordList">刷新</Button>
            </li>
          </ul>
        </div>
        <Table
          stripe
          :disabled-hover="true"
          :columns="columns"
          :data="records"
          :loading="loadingTable"
        ></Table>
        <Pagination
          :total="total"
          :page-size.sync="query.limit"
          @on-change="getRecordList"
          @on-page-size-change="getRecordList"
          :current.sync="query.page"
          :show-sizer="true"
        ></Pagination>
      </Panel>
    </div>
  </div>
</template>

<script>
import Panel from "@/pages/admin/components/Panel";
import Pagination from "@/pages/admin/components/Pagination";
import {
  getRecordCount,
  getRecordList,
  deleteRecord,
} from "@/pages/admin/api";
import dayjs from "dayjs";

export default {
  name: "RecordList",
  components: {
    Panel: Panel,
    Pagination: Pagination
  },
  data() {
    return {
      columns: [
        {
          title: 'ID',
          align: 'center',
          width: 260,
          key: 'rid',
        },
        {
          title: '用户名',
          align: 'center',
          render: (h, params) => {
            return h('a', {
              style: {
                'display': 'inline-block',
                'max-width': '150px'
              },
              on: {
                click: () => {
                  this.$router.push({
                    name: 'user-list',
                    query: {
                      userName: params.row.userName
                    }
                  })
                }
              }
            }, params.row.userName)
          }
        },
        {
          title: 'ISBN',
          align: 'center',
          render: (h, params) => {
            return h('Button', {
              props: {
                type: 'text',
                size: 'large'
              },
              on: {
                click: () => {
                  this.$router.push({
                    name: 'book-list',
                    query: {
                      isbn: params.row.isbn
                    }
                  })
                }
              },
              style: {
                padding: '2px 0'
              }
            }, params.row.isbn)
          }
        },
        {
          title: '书名',
          align: 'center',
          render: (h, params) => {
            return h('span', {
              style: {
                color: '#57a3f3',
                cursor: 'pointer'
              },
              on: {
                click: () => {
                  this.$router.push({
                    name: 'book-list',
                    query: {
                      isbn: params.row.isbn
                    }
                  })
                }
              }
            }, params.row.title)
          }
        },
        {
          title: '状态',
          align: 'center',
          render: (h, params) => {
            if (params.row.state === 0) {
              return h('Tag', {
                props: {
                  color: 'red'
                }
              }, '未归还')
            } else {
              return h('Tag', {
                props: {
                  color: 'green'
                }
              }, '已归还')
            }
          }
        },
        {
          title: '借阅时间',
          align: 'center',
          render: (h, params) => {
            return h('span', dayjs(params.row.borrowDateTime).format('YYYY-MM-DD HH:mm:ss'))
          }
        },
        {
          title: '归还时间',
          align: 'center',
          render: (h, params) => {
            if (params.row.state === 0) {
              return h('span', '---');
            } else {
              return h('span', dayjs(params.row.returnDateTime).format('YYYY-MM-DD HH:mm:ss'))
            }
          }
        },
        {
          title: '应归还时间',
          align: 'center',
          render: (h, params) => {
            return h('span', dayjs(params.row.expectDateTime).format('YYYY-MM-DD HH:mm:ss'))
          }
        },
        {
          title: '操作',
          align: 'center',
          render: (h, params) => {
            if (params.row.state) {
              return h('span', {
                style: {
                  color: '#57a3f3',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.deleteRecord(params.row.rid);
                  }
                }
              }, '删除')
            } else {
              return h('span', '---');
            }
          }
        }
      ],
      loadingTable: false,
      records: [],
      total: 0,
      query: {
        keyWord: '',
        userName: '',
        state: null,
        page: 1,
        limit: 10,
      },
    }
  },
  computed: {
    stateText() {
      if (this.query.state === '0') return '未归还';
      else if (this.query.state === '1') return '已归还';
      else return '所有状态';
    },
  },
  methods: {
    async deleteRecord(rid) {
      let resDelete = await deleteRecord(rid);
      if (resDelete.status === 204) {
        this.$Message.success('操作成功');
        await this.getRecordList();
      } else {
        this.$Message.error('操作失败');
      }
    },
    async getRecordList() {
      this.loadingTable = true;
      let resRecordCount = await getRecordCount(this.query.keyWord, this.query.userName, this.query.state);
      let resRecordList = await getRecordList(
        this.query.keyWord, this.query.userName, this.query.state, this.query.page, this.query.limit);
      this.total = resRecordCount.data;
      this.records = resRecordList.data;
      this.loadingTable = false;
    },
    handleStateChange(state) {
      this.query.page = 1;
      this.query.state = state;
      this.getRecordList();
    },
    handleQueryChange() {
      this.query.page = 1;
      this.getRecordList();
    },
  },
  mounted() {
    this.getRecordList();
  }
}
</script>

<style lang="less" scoped>
.ivu-btn-text {
  color: #57a3f3;
}

.flex-container {
  #main {
    flex: auto;
    margin-right: 18px;
    .filter {
      margin-right: -10px;
    }
  }
  #contest-menu {
    flex: none;
    width: 210px;
  }
}
</style>
