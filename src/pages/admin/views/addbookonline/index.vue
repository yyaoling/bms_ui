<template>
  <div class="flex-container">
    <div id="main">
      <Panel shadow>
        <div slot="title">在线添加</div>
        <div slot="extra">
          <ul class="filter">
            <li>
              <Input
                v-model="formBook.isbn"
                placeholder="ISBN"
                @on-enter="getBookInfo"
              ></Input>
            </li>
            <li>
              <Button type="info" icon="plus-round" @click="chanageVisible"
                >重置信息</Button
              >
            </li>
          </ul>
        </div>
        <div slot="main-body">
          <AddBook
            :form="formBook"
            v-if="dialog_visible"
            :chanageVisible="chanageVisible"
          ></AddBook>
        </div>
      </Panel>
    </div>
  </div>
</template>
<script>
import Panel from "@/pages/admin/components/Panel";
import AddBook from "./AddBook.vue";
import { serchBookOnline } from "@/pages/admin/api";
export default {
  name: "AddBookOnline",
  components: {
    Panel: Panel,
    AddBook,
  },
  data() {
    return {
      dialog_visible: false,
      isbn: "",
      formBook: {
        isbn: "",
        title: "",
        author: "",
        translator: "",
        publisher: "",
        publishDateTime: "",
        pageNumber: null,
        introduction: "",
        authorIntroduction: "",
        coverImage: "",
        stock: 0,
        tags: [],
      },
      formBookNull: {
        isbn: "",
        title: "",
        author: "",
        translator: "",
        publisher: "",
        publishDateTime: "",
        pageNumber: null,
        introduction: "",
        authorIntroduction: "",
        coverImage: "",
        stock: 0,
        tags: [],
      },
    };
  },
  methods: {
    chanageVisible() {
      this.formBook = this.formBookNull;
      this.dialog_visible = !this.dialog_visible;
    },
    getBookInfo() {
      this.dialog_visible = true;
      this.fetchData();
    },
    async fetchData() {
      const res = (await serchBookOnline(this.formBook.isbn)).data;
      // console.log(res)
      //ret为0代表获取成功
      if (res.ret == 0) {
        const data = res.data;
        //console.log(data)
        //处理书籍详情
        this.formBook.isbn = data.id;
        this.formBook.title = data.name;
        this.formBook.author = data.author;
        this.formBook.translator = data.translator;
        this.formBook.publisher = data.publishing;
        this.formBook.publishDateTime = data.published;
        this.formBook.pageNumber = data.pages;
        this.formBook.introduction = data.description;
        this.formBook.authorIntroduction = data.authorIntro;
        this.formBook.coverImage = data.photoUrl;
        // console.log(this.formBook)
      }
    },
  },
};
</script>

<style scoped lang="less">
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