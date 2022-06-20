<template>
  <div class="flex-container">
    <div id="main">
      <Panel shadow>
        <div slot="title">归还申请</div>
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
                  <Dropdown-item name="0">审核中</Dropdown-item>
                  <Dropdown-item name="1">审核通过</Dropdown-item>
                  <Dropdown-item name="2">审核不通过</Dropdown-item>
                </Dropdown-menu>
              </Dropdown>
            </li>
            <li>
              <Input v-model="query.keyWord" placeholder="ISBN码、书名、作者..." @on-enter="handleQueryChange"></Input>
            </li>
            <li>
              <Button type="info" icon="refresh" @click="getApplicationList">刷新</Button>
            </li>
          </ul>
        </div>
        <Table
            stripe
            :disabled-hover="true"
            :columns="columns"
            :data="applications"
            :loading="loadingTable"
        ></Table>
        <Pagination
            :total="total"
            :page-size.sync="query.limit"
            @on-change="getApplicationList"
            @on-page-size-change="getApplicationList"
            :current.sync="query.page"
            :show-sizer="true"
        ></Pagination>
      </Panel>
    </div>
  </div>
</template>

<script>
import Panel from "@/pages/user/components/Panel";
import Pagination from "@/pages/user/components/Pagination";
import {
  getReturnApplicationCount,
  getReturnApplicationList,
  deleteReturnApplication,
} from "@/pages/user/api";
import dayjs from "dayjs";
import {mapState} from "vuex";

export default {
  name: "ReturnApplicationList",
  components: {
    Panel: Panel,
    Pagination: Pagination,
  },
  data() {
    return {
      columns: [
        {
          title: 'ID',
          align: 'center',
          width: 280,
          key: 'aid',
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
                    name: 'user-home',
                    params: {
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
                    name: 'book-details',
                    params: {
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
                    name: 'book-details',
                    params: {
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
                  color: 'yellow'
                }
              }, '审核中')
            } else if (params.row.state === 1) {
              return h('Tag', {
                props: {
                  color: 'green'
                }
              }, '审核通过')
            } else {
              return h('Tag', {
                props: {
                  color: 'red'
                }
              }, '审核不通过')
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
            if (params.row.state === 0) {
              return h('span', {
                style: {
                  color: '#57a3f3',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.deleteApplication(params.row.aid);
                  }
                }
              }, '撤销申请')
            } else {
              return h('span', '---');
            }
          }
        },
      ],
      loadingTable: false,
      applications: [],
      total: 0,
      query: {
        keyWord: '',
        state: null,
        page: 1,
        limit: 10,
      },
    }
  },
  computed: {
    ...mapState('user', ['user']),
    stateText() {
      if (this.query.state === '0') return '审核中';
      else if (this.query.state === '1') return '审核通过';
      else if (this.query.state === '2') return '审核不通过';
      else return '所有状态';
    },
  },
  methods: {
    async getApplicationList() {
      this.loadingTable = true;
      let resReturnApplicationCount = await getReturnApplicationCount(
          this.query.keyWord, this.user.userName, this.query.state);
      let resReturnApplicationList = await getReturnApplicationList(
          this.query.keyWord, this.user.userName, this.query.state, this.query.page, this.query.limit
      );
      this.total = resReturnApplicationCount.data;
      this.applications = resReturnApplicationList.data;
      this.loadingTable = false;
    },
    async deleteApplication(aid) {
      let resDelete = await deleteReturnApplication(aid);
      if (resDelete.status === 204) {
        this.$Message.success('撤销成功');
        await this.getApplicationList();
      } else {
        this.$Message.error('撤销失败');
      }
    },
    handleStateChange(state) {
      this.query.page = 1;
      this.query.state = state;
      this.getApplicationList();
    },
    handleQueryChange() {
      this.query.page = 1;
      this.getApplicationList();
    },
  },
  mounted() {
    this.getApplicationList();
  }
}
</script>

<style scoped>

</style>
