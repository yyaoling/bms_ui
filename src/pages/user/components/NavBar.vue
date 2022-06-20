<template>
  <div id="header">
    <Menu theme="light" mode="horizontal" @on-select="handleRoute" :active-name="activeMenu" class="user-menu">
      <div class="logo"><span>PM&P课题组图书管理系统</span></div>
      <Menu-item name="/">
        <Icon type="home"></Icon>
        首页
      </Menu-item>
      <Menu-item name="/book">
        <Icon type="ios-keypad"></Icon>
        书籍
      </Menu-item>
      <Submenu v-if="isAuthenticated" name="application">
        <template slot="title">
          <Icon type="podium"></Icon>
          我的申请
        </template>
        <Menu-item name="/borrow-application">借阅申请</Menu-item>
        <Menu-item name="/renew-application">续借申请</Menu-item>
        <Menu-item name="/return-application">归还申请</Menu-item>
      </Submenu>
      <Menu-item v-if="isAuthenticated" name="/record">
        <Icon type="ios-folder"></Icon>
        借阅记录
      </Menu-item>
      <template v-if="!isAuthenticated">
        <div class="btn-menu">
          <Button
            type="ghost"
            ref="loginBtn"
            shape="circle"
            @click="handleBtnClick('login', '登录')"
          >登录</Button>
          <Button
            type="ghost"
            ref="registerBtn"
            shape="circle"
            @click="handleBtnClick('register', '注册')"
            style="margin-left: 5px;"
          >注册</Button>
        </div>
      </template>
      <template v-else>
        <Dropdown class="drop-menu" @on-click="handleRoute" placement="bottom" trigger="click">
          <Button type="text" class="drop-menu-title">
            {{ user.userName }}
            <Icon type="arrow-down-b"></Icon>
          </Button>
          <Dropdown-menu slot="list">
            <Dropdown-item :name="'/user-home/' + user.userName">我的主页</Dropdown-item>
            <Dropdown-item name="/record">借阅记录</Dropdown-item>
            <Dropdown-item v-if="isAdminRole" name="/admin">后台管理</Dropdown-item>
            <Dropdown-item name="/setting/profile">我的设置</Dropdown-item>
            <Dropdown-item divided name="/logout">退出</Dropdown-item>
          </Dropdown-menu>
        </Dropdown>
      </template>
    </Menu>
    <Modal v-model="modalVisible" :width="400">
      <div slot="header" class="modal-title">{{ modalStatus.title }}</div>
      <component :is="modalStatus.mode" v-if="modalVisible"></component>
      <div slot="footer" style="display: none;"></div>
    </Modal>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import Login from "@/pages/user/views/user/Login";
import Register from "@/pages/user/views/user/Register";
export default {
  name: "NavBar",
  components: {
    Login: Login,
    Register: Register,
  },
  methods: {
    ...mapActions('modal', ['changeModalStatus']),
    ...mapActions('user', ['initToken', 'initUser']),
    handleRoute (route) {
      if (route && route.indexOf('admin') < 0) {
        this.$router.push(route)
      } else {
        window.open('/admin/')
      }
    },
    handleBtnClick(mode, title) {
      this.changeModalStatus({
        mode: mode,
        visible: true,
        title: title,
      });
    }
  },
  computed: {
    ...mapGetters('user', ['isAuthenticated', 'isAdminRole']),
    ...mapState('modal', ['modalStatus']),
    ...mapState('user', ['user', 'token']),
    activeMenu() {
      return '/' + this.$route.path.split('/')[1]
    },
    modalVisible: {
      get() {
        return this.modalStatus.visible;
      },
      set(value) {
        this.changeModalStatus({
          visible: value,
        });
      }
    }
  },
  mounted() {
    this.initToken();
    if (this.token) {
      this.initUser();
    }
  }
}
</script>

<style lang="less" scoped>
#header {
  min-width: 300px;
  position: fixed;
  top: 0;
  left: 0;
  height: auto;
  width: 100%;
  z-index: 1000;
  background-color: #fff;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
  .user-menu {
    background: #fdfdfd;
  }

  .logo {
    margin-left: 2%;
    margin-right: 2%;
    font-size: 20px;
    float: left;
    line-height: 60px;
  }

  .drop-menu {
    float: right;
    margin-right: 30px;
    position: absolute;
    right: 10px;
    &-title {
      font-size: 18px;
    }
  }
  .btn-menu {
    font-size: 16px;
    float: right;
    margin-right: 10px;
  }
}

.modal {
  &-title {
    font-size: 18px;
    font-weight: 600;
  }
}
</style>
