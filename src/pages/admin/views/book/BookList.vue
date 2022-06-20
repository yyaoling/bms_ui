<template>
  <div class="flex-container">
    <div id="main">
      <Panel shadow>
        <div slot="title">图书列表</div>
        <div slot="extra">
          <ul class="filter">
            <li>
              <Input v-model="query.isbn" placeholder="ISBN" @on-enter="getBookList"></Input>
            </li>
            <li>
              <Input v-model="query.keyWord" placeholder="书名、作者、简介..." @on-enter="getBookList"></Input>
            </li>
            <li>
              <Button type="info" icon="refresh" @click="getBookList">刷新</Button>
            </li>
            <li>
              <Button type="info" icon="plus-round" @click="$router.push({ name: 'book-add' })">添加图书</Button>
            </li>
          </ul>
        </div>
        <Table
          stripe
          :disabled-hover="true"
          :columns="columns"
          :data="books"
          :loading="loadingTable"
        ></Table>
        <Pagination
          :total="total"
          :page-size.sync="query.limit"
          @on-change="getBookList"
          @on-page-size-change="getBookList"
          :current.sync="query.page"
          :show-sizer="true"
        ></Pagination>
      </Panel>
    </div>
  </div>
</template>

<script>
import {
  getBookCount,
  getBookList,
  getBook,
  checkBookExists,
  deleteBook
} from "@/pages/admin/api";
import Panel from "@/pages/admin/components/Panel";
import Pagination from "@/pages/admin/components/Pagination";
import dayjs from "dayjs";

export default {
  name: "BookList",
  components: {
    Panel: Panel,
    Pagination: Pagination,
  },
  data() {
    return {
      columns: [
        {
          title: 'ISBN码',
          align: 'center',
          key: 'isbn',
        },
        {
          title: '书名',
          align: 'center',
          key: 'title',
        },
        {
          title: '作者',
          align: 'center',
          key: 'author',
        },
        {
          title: '译者',
          align: 'center',
          render: (h, params) => {
            if (params.row.translator) {
              return h('span', params.row.translator);
            } else {
              return h('span', '---');
            }
          }
        },
        {
          title: '出版社',
          align: 'center',
          key: 'publisher',
        },
        {
          title: '出版年月',
          align: 'center',
          render: (h, params) => {
            return h('span', dayjs(params.row.publishDateTime).format('YYYY-MM'));
          }
        },
        {
          title: '库存',
          align: 'center',
          key: 'stock',
        },
        {
          title: '已借阅数量',
          align: 'center',
          key: 'borrowed',
        },
        {
          title: '操作',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  color: '#57a3f3',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.$router.push({
                      name: 'book-edit',
                      query: {
                        isbn: params.row.isbn
                      }
                    })
                  }
                }
              }, '修改信息'),
              h('span', {
                style: {
                  color: '#57a3f3',
                  cursor: 'pointer',
                  marginLeft: '10px'
                },
                on: {
                  click: () => {
                    this.deleteBook(params.row.isbn);
                  }
                }
              }, '删除'),
            ])
          }
        }
      ],
      loadingTable: false,
      books: [],
      total: 0,
      query: {
        keyWord: '',
        isbn: '',
        tag: '',
        page: 1,
        limit: 10,
      }
    }
  },
  methods: {
    async getBookList() {
      this.loadingTable = true;
      if (this.query.isbn) {
        this.books = [];
        await checkBookExists(this.query.isbn).then(async resCheck => {
          if (resCheck.data === true) {
            let resBook = await getBook(this.query.isbn);
            this.books.push(resBook.data);
            this.total = 1;
          } else {
            this.total = 0;
          }
        })
      } else {
        let resBookCount = await getBookCount(this.query.keyWord, this.query.tag);
        let resBookList = await getBookList(this.query.keyWord, this.query.tag, this.query.page, this.query.limit);
        this.total = resBookCount.data;
        this.books = resBookList.data;
      }
      this.loadingTable = false;
    },
    async deleteBook(isbn) {
      let resDelete = await deleteBook(isbn);
      if (resDelete.status === 204) {
        this.$Message.success('操作成功');
        await this.getBookList();
      } else {
        this.$Message.error('操作失败');
      }
    }
  },
  mounted() {
    this.query.isbn = this.$route.query.isbn;
    this.getBookList();
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

.modal {
  &-title {
    font-size: 18px;
    font-weight: 600;
  }
}
</style>
