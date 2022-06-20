<template>
  <div id="header">
    <Menu
      theme="light"
      mode="horizontal"
      @on-select="handleRoute"
      :active-name="activeMenu"
      class="user-menu"
    >
      <div class="logo"><span>PM&P课题组图书管理系统</span></div>
      <Menu-item name="/">
        <Icon type="home"></Icon>
        首页
      </Menu-item>
      <Submenu name="application">
        <template slot="title">
          <Icon type="podium"></Icon>
          申请管理
        </template>
        <Menu-item name="/borrow-application">借阅申请</Menu-item>
        <Menu-item name="/renew-application">续借申请</Menu-item>
        <Menu-item name="/return-application">归还申请</Menu-item>
      </Submenu>
      <Menu-item v-show="isSuperAdmin" name="/user">
        <Icon type="person-stalker"></Icon>
        用户管理
      </Menu-item>
      <Menu-item v-show="isSuperAdmin" name="/book">
        <Icon type="ios-bookmarks"></Icon>
        图书管理
      </Menu-item>
      <Menu-item v-show="isSuperAdmin" name="/record">
        <Icon type="ios-folder"></Icon>
        借阅管理
      </Menu-item>
      <Menu-item v-show="isSuperAdmin" name="/addbookonline">
        <Icon type="ios-folder"></Icon>
        在线添加
      </Menu-item>
      <Dropdown
        class="drop-menu"
        @on-click="handleRoute"
        placement="bottom"
        trigger="click"
      >
        <Button type="text" class="drop-menu-title">
          {{ user.userName }}
          <Icon type="arrow-down-b"></Icon>
        </Button>
        <Dropdown-menu slot="list">
          <Dropdown-item name="/logout">退出</Dropdown-item>
        </Dropdown-menu>
      </Dropdown>
    </Menu>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  name: "Navbar",
  methods: {
    ...mapActions("user", ["initToken", "initUser"]),
    handleRoute(route) {
      this.$router.push(route);
    },
  },
  computed: {
    ...mapGetters("user", ["isSuperAdmin"]),
    ...mapState("user", ["user", "token"]),
    activeMenu() {
      return "/" + this.$route.path.split("/")[1];
    },
  },
  mounted() {
    this.initToken();
    if (this.token) {
      this.initUser();
    }
  },
};
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
