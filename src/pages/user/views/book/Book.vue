<template>
  <div class="flex-container">
    <div id="book-comment">
      <div id="book-main">
        <Panel :padding="40" shadow>
          <div slot="title">{{ book.title }}</div>
          <div v-if="isAuthenticated" slot="extra">
            <div v-if="applied != null">
              <div v-if="applied">
                <Alert show-icon closable>
                  你的申请正在审核，请耐心等待
                </Alert>
              </div>
              <div v-else>
                <Button v-if="!borrowed && book.stock > 0" type="primary" @click="handleApplyForBorrow">申请借阅</Button>
                <Button v-if="borrowed" type="primary" @click="handleApplyForRenew">申请续借</Button>
                <Button
                    v-if="borrowed"
                    type="primary"
                    @click="handleApplyForReturn"
                    style="margin-left: 10px"
                >申请归还</Button>
              </div>
            </div>
          </div>
          <div id="book-content" class="markdown-body" v-katex>
            <p v-if="book.introduction" class="title">内容简介</p>
            <p v-if="book.introduction" class="content" v-html="book.introduction"></p>
            <p v-if="book.authorIntroduction" class="title">作者简介</p>
            <p v-if="book.authorIntroduction" class="content" v-html="book.authorIntroduction"></p>
          </div>
        </Panel>
      </div>

      <div v-if="comments.length" id="comment-main">
        <Panel :padding="40" shadow>
          <div slot="title">评论</div>
          <div id="comment-content" class="markdown-body" v-katex>
            <Alert v-for="comment in comments" :key="comment.item1">
              <a @click="goUserHome(comment.item2)">{{ comment.item2 }}</a>
              {{ comment.item4 | timeFormater }}
              <template slot="desc">{{ comment.item3 }}</template>
            </Alert>
          </div>
        </Panel>
      </div>
    </div>

    <div id="right-column">
      <Card style="width:300px">
        <div slot="title" class="header">
          <Icon type="ios-book"></Icon>
          <span class="card-title">封面</span>
        </div>
        <div style="text-align: center">
<!--          <img src="../../../../assets/s11276847.jpg" style="width: 120px">-->
          <img :src="book.coverImage" style="width: 120px" referrerPolicy="no-referrer">
        </div>
      </Card>
      <Card id="info">
        <div slot="title" class="header">
          <Icon type="information-circled"></Icon>
          <span class="card-title">书籍信息</span>
        </div>
        <ul>
          <li>
            <p>ISBN码</p>
            <p>{{ book.isbn }}</p>
          </li>
          <li>
            <p>书名</p>
            <p>{{ book.title }}</p>
          </li>
          <li>
            <p>作者</p>
            <p>{{ book.author }}</p>
          </li>
          <li v-if="book.translator">
            <p>译者</p>
            <p>{{ book.translator }}</p>
          </li>
          <li>
            <p>出版社</p>
            <p>{{ book.publisher }}</p>
          </li>
          <li>
            <p>出版年月</p>
            <p>{{ book.publishDatetime | timeFormater('YYYY-MM') }}</p>
          </li>
          <li>
            <p>页数</p>
            <p>{{ book.pageNumber }}</p>
          </li>
          <li>
            <p>库存</p>
            <p>{{ book.stock - book.borrowed }}</p>
          </li>
          <li>
            <p>标签</p>
            <p>
              <Poptip trigger="hover" placement="left-end" style="">
                <a>显示</a>
                <span slot="content">
                  <Tag v-for="tag in book.tags" :key="tag">{{ tag }}</Tag>
                </span>
              </Poptip>
            </p>
          </li>
          <li>
            <p>评分</p>
            <p>
              <span v-if="raterCount">
                {{ rate }}
                <a @click="graphVisible = !graphVisible">查看详情</a>
              </span>
              <span v-else>
                暂无评分
              </span>
            </p>
          </li>
        </ul>
      </Card>
    </div>

    <Modal v-model="graphVisible">
      <div id="pieChart-detail">
        <ECharts :option="pie" :init-options="pieInitOpts"></ECharts>
      </div>
      <div slot="footer">
        <Button type="ghost" @click="graphVisible=false">关闭</Button>
      </div>
    </Modal>

    <Modal v-model="applyForBorrowVisible">
      <div slot="header" class="modal-title">申请借阅</div>
      <Form>
        <FormItem label="借阅时间">
          <Select v-model="borrowTime" size="large">
            <Option v-for="item in timeList" :value="item" :key="item">{{ item }} 天</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="applyForBorrow" :loading="loadingBorrowBtn">提交申请</Button>
      </div>
    </Modal>

    <Modal v-model="applyForRenewVisible">
      <div slot="header" class="modal-title">申请续借</div>
      <Form>
        <FormItem label="借阅时间">
          <Select v-model="renewTime" size="large">
            <Option v-for="item in timeList" :value="item" :key="item">{{ item }} 天</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="applyForRenew" :loading="loadingRenewBtn">提交申请</Button>
      </div>
    </Modal>

    <Modal v-model="applyForReturnVisible">
      <div slot="header" class="modal-title">申请归还</div>
      <Form>
        <FormItem label="评分">
          <Rate show-text v-model="score"></Rate>
        </FormItem>
        <FormItem label="评论">
          <Input
              v-model="comment"
              type="textarea"
              :autosize="{ minRows: 5, maxRows: 10 }"
              placeholder="请输入评论"
          ></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="applyForReturn" :loading="loadingReturnBtn">提交申请</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  getBook,
  getCommentList,
  getScoreList,
  checkRecordExists,
  applyForBorrow,
  getRecord,
  applyForRenew,
  checkApplicationExists,
  applyForReturn,
  checkBookExists,
} from "@/pages/user/api";
import Panel from "@/pages/user/components/Panel";
import { mapState, mapGetters } from 'vuex';
import { pie } from './chartData';
import dayjs from 'dayjs';

export default {
  name: "Book",
  components: {
    Panel: Panel,
  },
  data() {
    return {
      book: {
        isbn: '',
        title: '',
        author: '',
        translator: '',
        publisher: '',
        publishDateTime: '',
        pageNumber: 0,
        introduction: '',
        authorIntroduction: '',
        coverImage: '',
        stock: 0,
        borrowed: 0,
        tags: [],
      },
      comments: [],
      scores: [],
      record: { },

      applied: null,
      borrowed: false,
      borrowTime: 30,
      renewTime: 30,
      timeList: [30, 60, 90, 180, 360],

      applyForBorrowVisible: false,
      loadingBorrowBtn: false,

      applyForRenewVisible: false,
      loadingRenewBtn: false,

      applyForReturnVisible: false,
      loadingReturnBtn: false,
      score: null,
      comment: null,

      raterCount: 0,
      rate: 0,
      graphVisible: false,
      pie: pie,
      pieInitOpts: {
        width: '500',
        height: '480',
      }
    }
  },
  filters: {
    timeFormater(value, str = 'YYYY-MM-DD HH:mm:ss') {
      return dayjs(value).format(str)
    },
  },
  methods: {
    goUserHome(userName) {
      this.$router.push({
        name: 'user-home',
        params: {
          userName: userName,
        }
      })
    },
    calculateScore() {
      let sumRate = 0;
      for (let i = 0; i < this.scores.length; i++) {
        this.raterCount = this.raterCount + this.scores[i];
        sumRate = sumRate + (i + 1) * this.scores[i];
      }
      if (0 != this.raterCount) {
        this.rate = sumRate / this.raterCount;
        this.rate = this.rate.toFixed(1);
      }
    },
    initPieData() {
      let pieData = [
        { name: 'bad', value: this.scores[0] },
        { name: 'disappoint', value: this.scores[1] },
        { name: 'normal', value: this.scores[2] },
        { name: 'satisfied', value: this.scores[3] },
        { name: 'amazing', value: this.scores[4] }
      ];
      this.pie.series[0].data = pieData;
    },
    handleApplyForBorrow() {
      this.applyForBorrowVisible = true;
    },
    handleApplyForRenew() {
      this.applyForRenewVisible = true;
    },
    handleApplyForReturn() {
      this.applyForReturnVisible = true;
    },
    async applyForBorrow() {
      this.loadingBorrowBtn = true;
      let resApply = await applyForBorrow({
        userName: this.user.userName,
        isbn: this.book.isbn,
        borrowDateTime: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS'),
        expectDateTime: dayjs().add(this.borrowTime, 'day').format('YYYY-MM-DDTHH:mm:ss.SSS'),
      });
      if (resApply.status === 201) {
        this.$Message.success('申请成功，等待审核');
        this.applied = true;
        this.applyForBorrowVisible = false;
      } else {
        this.$Message.error('申请失败');
      }
      this.loadingBorrowBtn = false;
    },
    async applyForRenew() {
      this.loadingRenewBtn = true;
      let resApply = await applyForRenew({
        rid: this.record.rid,
        userName: this.user.userName,
        isbn: this.book.isbn,
        borrowDateTime: dayjs(this.record.borrowDateTime).format('YYYY-MM-DDTHH:mm:ss.SSS'),
        expectDateTime: dayjs(this.record.expectDateTime).add(this.renewTime, 'day').format('YYYY-MM-DDTHH:mm:ss.SSS'),
      });
      if (resApply.status === 201) {
        this.$Message.success('申请成功，等待审核');
        this.applied = true;
        this.applyForRenewVisible = false;
      } else {
        this.$Message.error('申请失败');
      }
      this.loadingRenewBtn = false;
    },
    async applyForReturn() {
      this.loadingReturnBtn = true;
      let resApply = await applyForReturn({
        rid: this.record.rid,
        userName: this.user.userName,
        isbn: this.book.isbn,
        score: this.score,
        comment: this.comment
      });
      if (resApply.status === 201) {
        this.$Message.success('申请成功，等待审核');
        this.applied = true;
        this.applyForReturnVisible = false;
      } else {
        this.$Message.error('申请失败');
      }
      this.loadingReturnBtn = false;
    },
    async init(isbn) {
      Promise.all([
        await getBook(isbn),
        await getCommentList(isbn),
        await getScoreList(isbn)
      ]).then(res => {
        this.book = res[0].data;
        this.comments = res[1].data;
        this.scores = res[2].data;
        this.calculateScore();
        this.initPieData();
      });
      if (this.isAuthenticated) {
        Promise.all([
          await checkApplicationExists(this.user.userName, isbn),
          await checkRecordExists(this.user.userName, isbn),
        ]).then(async res => {
          this.applied = res[0].data;
          this.borrowed = res[1].data;
          if (this.borrowed) {
            let resRecord = await getRecord(this.user.userName, this.book.isbn);
            this.record = resRecord.data;
          }
        });
      }
    }
  },
  computed: {
    ...mapGetters('user', ['isAuthenticated']),
    ...mapState('user', ['user']),
  },
  mounted() {
    let isbn = this.$route.params.isbn;
    checkBookExists(isbn).then(res => {
      if (res.data === true) {
        this.init(isbn);
      } else {
        this.$router.push({
          name: 'not-found',
        })
      }
    })
  }
}
</script>

<style lang="less" scoped>
.card-title {
  margin-left: 8px;
}

.flex-container {
  #book-comment {
    flex-direction: column;
    #book-main {
      margin-right: 18px;
    }
    #comment-main {
      margin-top: 18px;
      margin-right: 18px;
    }
  }
  #right-column {
    flex: none;
    width: 300px;
  }
}

#book-content, #comment-content {
  margin-top: -50px;
  .title {
    font-size: 20px;
    font-weight: 400;
    margin: 25px 0 8px 0;
    color: #3091f2;
    .copy {
      padding-left: 8px;
    }
  }
  p.content {
    margin-left: 25px;
    margin-right: 20px;
    font-size: 15px
  }
  .sample {
    align-items: stretch;
    &-input, &-output {
      width: 50%;
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      margin-right: 5%;
    }
    pre {
      flex: 1 1 auto;
      align-self: stretch;
      border-style: solid;
      background: transparent;
    }
  }
}

#info {
  margin-bottom: 20px;
  margin-top: 20px;
  ul {
    list-style-type: none;
    li {
      border-bottom: 1px dotted #e9eaec;
      margin-bottom: 10px;
      p {
        display: inline-block;
      }
      p:first-child {
        width: 90px;
      }
      p:last-child {
        float: right;
      }
    }
  }
}

.fl-right {
  float: right;
}

#pieChart {
  .echarts {
    height: 250px;
    width: 210px;
  }
  #detail {
    position: absolute;
    right: 10px;
    top: 10px;
  }
}

#pieChart-detail {
  margin-top: 20px;
  width: 500px;
  height: 480px;
}

.modal {
  &-title {
    font-size: 18px;
    font-weight: 600;
  }
}
</style>
