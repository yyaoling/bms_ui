<template>
  <div class="container">
    <div class="avatar-container">
<!--      <img class="avatar" src="../../../../assets/default.png">-->
      <img class="avatar" :src="user.avatarImage">
    </div>
    <Card :padding="100">
      <div v-if="user">
        <p style="margin-top: -10px">
          <span class="emphasis">{{ user.userName }}</span>
          <span v-if="user.sex" style="margin-left: 10px">
            <Icon v-if="user.sex === 1" type="male" color="#3399FF" size="20"></Icon>
            <Icon v-if="user.sex === 2" type="female" color="#FF69B4" size="20"></Icon>
          </span>
        </p>
        <p v-if="user.id">{{ user.id }}</p>
        <p v-if="user.major">{{ user.major }}</p>
        <hr id="split" />
        <div class="flex-container">
          <div class="left">
            <p>已借阅图书数量</p>
            <p class="emphasis">{{ user.borrowed }}</p>
          </div>
          <div class="middle">
            <p>未归还图书数量</p>
            <p class="emphasis">{{ books.length }}</p>
          </div>
          <div class="right">
            <p>诚信值</p>
            <p class="emphasis">{{ user.integrity }}</p>
          </div>
        </div>
        <div id="books">
          <div v-if="books.length">未归还图书列表</div>
          <div class="btns">
            <div class="book-btn" v-for="book in books" :key="book.isbn">
              <Button type="ghost" @click="goBook(book.isbn)">{{ book.title }}</Button>
            </div>
          </div>
        </div>
        <div id="icons">
          <a :href="'mailto:' + user.email">
            <Icon class="icon" type="ios-email-outline" :size="30"></Icon>
          </a>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import {
  getUserInfo,
  getRecordNotReturn
} from "@/pages/user/api";

export default {
  name: "UserHome",
  data() {
    return {
      userName: '',
      user: { },
      recordCount: 0,
      books: [],
    }
  },
  methods: {
    goBook(isbn) {
      this.$router.push({
        name: 'book-details',
        params: {
          isbn: isbn
        }
      });
    }
  },
  async mounted() {
    this.userName = this.$route.params.userName;
    let resUserInfo = await getUserInfo(this.userName);
    this.user = resUserInfo.data;
    if (this.user) {
      let resNotReturn = await getRecordNotReturn('', this.userName);
      this.books = resNotReturn.data;
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  position: relative;
  width: 75%;
  margin: 170px auto;
  text-align: center;
  p {
    margin-top: 8px;
    margin-bottom: 8px;
  }
  .avatar-container {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    z-index: 1;
    top: -90px;
    .avatar {
      width: 140px;
      height: 140px;
      border-radius: 50%;
      box-shadow: 0 1px 1px 0;
    }
  }
  .emphasis {
    font-size: 20px;
    font-weight: 600;
  }
  #split {
    margin: 20px auto;
    width: 90%;
  }
  .flex-container {
    margin-top: 30px;
    padding: 20px;
    .left {
      flex: 1 1;
    }
    .middle {
      flex: 1 1;
      border-left: 1px solid #999;
      border-right: 1px solid #999;
    }
    .right {
      flex: 1 1;
    }
  }
  #books {
    margin-top: 40px;
    padding-left: 30px;
    padding-right: 30px;
    font-size: 18px;
    .btns {
      margin-top: 15px;
      .book-btn {
        display: inline-block;
        margin: 5px;
      }
    }
  }
  #icons {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translate(-50%);
    .icon {
      padding-left: 20px;
    }
  }
}
</style>
