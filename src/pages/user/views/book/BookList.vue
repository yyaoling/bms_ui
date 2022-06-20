<template>
  <Row type="flex" :gutter="18">
    <Col :span="19">
      <Panel shadow>
        <div slot="title">书籍列表</div>
        <div slot="extra">
          <ul class="filter">
            <li>
              <i-switch size="large" @on-change="handleTagsVisible">
                <span slot="open">标签</span>
                <span slot="close">标签</span>
              </i-switch>
            </li>
            <li>
              <Input
                placeholder="书名、作者、简介..."
                v-model="query.keyWord"
                @on-enter="filterByKeyword"
                @on-click="filterByKeyword"
                icon="ios-search-strong">
              </Input>
            </li>
            <li>
              <Button type="info" @click="onReset">
                <Icon type="refresh"></Icon>
                重置
              </Button>
            </li>
          </ul>
        </div>
        <Table
            style="width: 100%; font-size: 16px;"
            :columns="bookTableColumns"
            :data="bookList"
            :loading="loadings.table"
            disabled-hover
        ></Table>
      </Panel>
      <Pagination
        :total="total"
        :page-size.sync="query.limit"
        @on-change="getBookList"
        @on-page-size-change="getBookList"
        :current.sync="query.page"
        :show-sizer="true"
      ></Pagination>
    </Col>
    <Col :span="5">
      <Panel :padding="10">
        <div slot="title" class="taglist-title">标签</div>
        <Button
          v-for="tag in tagList"
          :key="tag"
          @click="filterByTag(tag)"
          type="ghost"
          :disabled="query.tag === tag"
          shape="circle"
          class="tag-btn"
        >{{ tag }}</Button>
      </Panel>
    </Col>
  </Row>
</template>

<script>
import Panel from "@/pages/user/components/Panel";
import Pagination from "@/pages/user/components/Pagination";
import {
  getBookList,
  getBookCount,
  getTagList,
} from "@/pages/user/api";

export default {
  name: "BookList",
  components: {
    Panel: Panel,
    Pagination: Pagination,
  },
  data() {
    return {
      tagList: [],
      bookTableColumns: [
        {
          title: 'ISBN',
          key: 'isbn',
          width: 150,
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
          width: 350,
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
                padding: '2px 0',
                overflowX: 'auto',
                textAlign: 'left',
                width: '100%'
              }
            }, params.row.title)
          }
        },
        {
          title: '作者',
          key: 'author',
        },
        {
          title: '出版社',
          key: 'publisher',
        }
      ],
      bookList: [],
      total: 0,
      loadings: {
        table: true,
        tag: true,
      },
      query: {
        keyWord: '',
        tag: '',
        page: 1,
        limit: 10,
      }
    }
  },
  methods: {
    handleTagsVisible(value) {
      if (value) {
        this.bookTableColumns.push({
          title: '标签',
          align: 'center',
          render: (h, params) => {
            let tags = []
            params.row.tags.forEach(tag => {
              tags.push(h('Tag', {}, tag))
            })
            return h('div', {
              style: {
                margin: '8px 0'
              }
            }, tags)
          }
        })
      } else {
        this.bookTableColumns.splice(this.bookTableColumns.length - 1, 1)
      }
    },
    async getBookList() {
      this.loadings.table = true;
      let resBookCount = await getBookCount(this.query.keyWord, this.query.tag);
      let resBookList = await getBookList(this.query.keyWord, this.query.tag, this.query.page, this.query.limit);
      this.total = resBookCount.data;
      this.bookList = resBookList.data;
      this.loadings.table = false;
    },
    async getTagList() {
      this.loadings.tag = true;
      let resTagList = await getTagList();
      this.tagList = resTagList.data;
      this.loadings.tag = false;
    },
    filterByKeyword() {
      this.query.page = 1;
      this.getBookList();
    },
    filterByTag(tag) {
      this.query.page = 1;
      this.query.tag = tag;
      this.getBookList();
    },
    onReset() {
      this.query.keyWord = '';
      this.query.tag = '';
      this.query.page = 1;
      this.getBookList();
    },
  },
  mounted() {
    this.query.keyWord = this.$route.query.keyWord;
    this.getBookList();
    this.getTagList();
  }
}
</script>

<style lang="less" scoped>
.taglist-title {
  margin-left: -10px;
  margin-bottom: -10px;
}

.tag-btn {
  margin-right: 5px;
  margin-bottom: 10px;
}

#pick-one {
  margin-top: 10px;
}
</style>
