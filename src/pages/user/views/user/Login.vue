<template>
  <div>
    <Form ref="formLogin" :model="formLogin" :rules="ruleLogin">
      <FormItem prop="userName">
        <Input
          type="text"
          v-model="formLogin.userName"
          placeholder="用户名"
          size="large"
        >
          <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="password">
        <Input
          type="password"
          v-model="formLogin.password"
          placeholder="密码"
          size="large"
          @on-enter="handleLogin"
        >
          <Icon type="ios-locked-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
    </Form>
    <div class="footer">
      <Button
        type="primary"
        @click="handleLogin"
        class="btn"
        long
        :loading="btnLoginLoading"
        >登录</Button
      >
      <a @click.stop="handleBtnClick('register', '注册')">还没账号，立即注册</a>
      <a @click.stop="goResetPassword" style="float: right">忘记密码?</a>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { login, getUserInfo, getToken } from "@/pages/user/api";

export default {
  name: "Login",
  data() {
    return {
      btnLoginLoading: false,
      formLogin: {
        userName: "",
        password: "",
      },
      ruleLogin: {
        userName: [
          {
            required: true,
            trigger: "blur",
            message: "用户名不能为空",
          },
        ],
        password: [
          {
            required: true,
            trigger: "blur",
            message: "密码不能为空",
          },
          {
            min: 6,
            max: 20,
            trigger: "change",
            message: "密码的长度为6到20位",
          },
        ],
      },
    };
  },
  methods: {
    ...mapActions("modal", ["changeModalStatus"]),
    ...mapActions("user", ["setUser", "setToken"]),
    goResetPassword() {
      this.changeModalStatus({ visible: false });
      this.$router.push({ name: "apply-reset-password" });
    },
    handleBtnClick(mode, title) {
      this.changeModalStatus({
        mode: mode,
        title: title,
        visible: true,
      });
    },
    handleLogin() {
      this.$refs["formLogin"].validate(async (valid) => {
        if (valid) {
          this.btnLoginLoading = true;
          let resLogin = await login(
            this.formLogin.userName,
            this.formLogin.password
          );
          if (resLogin.data === true) {
            let resUserInfo = await getUserInfo(this.formLogin.userName);
            let resToken = await getToken(
              this.formLogin.userName,
              this.formLogin.password
            );
            if (resUserInfo.data.isDisabled) {
              this.$Message.error("该用户已被禁用");
            } else {
              this.setToken(resToken.data);
              this.setUser(resUserInfo.data);
              this.$Message.success("登录成功");
              this.changeModalStatus({
                visible: false,
              });
            }
          } else {
            this.$Message.error("用户名或密码错误");
          }
          this.btnLoginLoading = false;
        }
      });
    },
  },
  computed: {
    ...mapState("modal", ["modalStatus"]),
    visible: {
      get() {
        return this.modalStatus.visible;
      },
      set(value) {
        this.changeModalStatus({
          visible: value,
        });
      },
    },
  },
};
</script>

<style lang="less" scoped>
.footer {
  overflow: auto;
  margin-top: 20px;
  margin-bottom: -15px;
  text-align: left;
  .btn {
    margin: 0 0 15px 0;
    &:last-child {
      margin: 0;
    }
  }
}
</style>
