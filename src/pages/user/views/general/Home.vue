<template>
  <Row type="flex" :gutter="18">
    <Col :span="18">
      <Panel :padding="40" shadow>
        <Row type="flex" justify="center">
          <Col :span="12">
            <Input v-model="keyWord" size="large" @on-enter="goSearch">
              <Select v-model="selected" slot="prepend" style="width: 80px">
                <Option value="keyWord">关键字</Option>
                <Option value="ISBN">ISBN</Option>
              </Select>
              <Button
                slot="append"
                icon="ios-search-strong"
                @click="goSearch"
              ></Button>
            </Input>

            <!-- 实现轮播图功能 -->
            <div v-if="showCarousel">
              <!--        :width="320"
                :height="334" -->
              <carousel-3d
                :autoplayTimeout="3000"
                :display="5"
                :animationSpeed="1000"
                :controlsVisible="true"
              >
                <slide
                  v-for="(bookInfo, index) in bookList"
                  :key="index"
                  :index="index"
                >
                  <!-- <el-tooltip placement="top">
                    <div slot="content">{{ 123 }}</div>
                    <el-button>Top center</el-button> -->
                    <img
                      :src="bookInfo.coverImage"
                      height="270px"
                      referrerPolicy="no-referrer"
                      @mouseleave="leaveShow"
                      @mouseenter="enterShow(bookInfo)"
                      @mousemove="updateXY"
                    />
                  <!-- </el-tooltip> -->
                </slide>
              </carousel-3d>
            </div>
            <!-- 悬浮窗口 -->
            <div v-show="seen" :style="positionStyle">
              {{ bookInfo.introduction }}
            </div>
          </Col>
        </Row>
      </Panel>
    </Col>
    <Col :span="6">
      <Panel shadow>
        <div slot="title" class="rank-list-title">借阅排名</div>
        <Table
          style="width: 100%; font-size: 16px"
          :columns="rankTableColumns"
          :data="books"
          :loading="loadingRank"
          disabled-hover
        ></Table>
      </Panel>
    </Col>
  </Row>
</template>

<script>
import Panel from "@/pages/user/components/Panel";
import { getRank } from "@/pages/user/api";

export default {
  name: "Home",
  components: {
    Panel: Panel,
  },
  data() {
    return {
      seen: false,
      x: 0,
      y: 0,
      bookInfo: {},
      positionStyle: { top: "20px", left: "20px" },
      showCarousel: false,
      bookList: [],
      rank: 10,
      books: [],
      keyWord: "",
      selected: "keyWord",

      loadingRank: false,
      rankTableColumns: [
        {
          title: "书名",
          width: 230,
          render: (h, params) => {
            return h(
              "Button",
              {
                props: {
                  type: "text",
                  size: "large",
                },
                on: {
                  click: () => {
                    this.$router.push({
                      name: "book-details",
                      params: {
                        isbn: params.row.isbn,
                      },
                    });
                  },
                },
                style: {
                  padding: "2px 0",
                  overflowX: "auto",
                  textAlign: "left",
                  width: "100%",
                },
              },
              params.row.title
            );
          },
        },
        {
          title: "作者",
          key: "author",
        },
      ],
    };
  },
  methods: {
    updateXY(event) {
      this.x = event.pageX;
      this.y = event.pageY;
      this.positionStyle = {
        top: this.y - 164 + "px",
        left: this.x - 374 + "px",
      };
    },
    leaveShow() {
      this.seen = false;
    },
    enterShow(bookInfo) {
      this.bookInfo = bookInfo;
      this.seen = true;
    },
    goSearch() {
      if (this.keyWord !== "") {
        if (this.selected === "ISBN") {
          this.$router.push({
            name: "book-details",
            params: {
              isbn: this.keyWord,
            },
          });
        } else {
          this.$router.push({
            name: "book-list",
            query: {
              keyWord: this.keyWord,
            },
          });
        }
      }
    },
  },
  async mounted() {
    this.loadingRank = true;
    let resRank = await getRank(this.rank);
    this.books = resRank.data;

    //console.log(this.books)
    //获取轮播图的数据
    resRank = await getRank(5);
    this.bookList = resRank.data;
    //console.log(this.bookList)
    this.loadingRank = false;
    this.showCarousel = true;
  },
};
</script>

<style lang="less" scoped>
.rank-list-title {
  margin-left: -10px;
  margin-bottom: -10px;
}

.logo {
  margin-left: 2%;
  margin-right: 2%;
  font-size: 30px;
  float: left;
  line-height: 200px;
}
</style>
