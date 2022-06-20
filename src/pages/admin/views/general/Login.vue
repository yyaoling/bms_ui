<template>
  <Form
      :model="formLogin"
      :rules="ruleLogin"
      ref="formLogin"
      label-position="left"
      :label-width="0"
      class="login-container"
  >
    <h3 class="title">登录</h3>
    <FormItem prop="userName">
      <Input
          type="text"
          v-model="formLogin.userName"
          placeholder="用户名"
          size="large"
      ></Input>
    </FormItem>
    <FormItem prop="password">
      <Input
          type="password"
          v-model="formLogin.password"
          placeholder="密码"
          size="large"
      ></Input>
    </FormItem>
    <Form-item>
      <Button type="primary" long @click="handleLogin" :loading="btnLoginLoading">登录</Button>
    </Form-item>
  </Form>

</template>

<script>
import {
  login,
  getToken,
  getUserInfo,
  checkUserExists,
} from "@/pages/admin/api";
import { mapActions } from 'vuex';

export default {
  name: "Login",
  data() {
    return {
      btnLoginLoading: false,
      formLogin: {
        userName: '',
        password: '',
      },
      ruleLogin: {
        userName: [
          {
            required: true,
            trigger: 'blur',
            message: '用户名不能为空',
          },
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            message: '密码不能为空',
          },
          {
            min: 6,
            max: 20,
            trigger: 'change',
            message: '密码的长度为6到20位',
          }
        ]
      },
    }
  },
  methods: {
    ...mapActions('user', ['setUser', 'setToken']),
    handleLogin() {
      this.$refs['formLogin'].validate(async(valid) => {
        if (valid) {
          this.btnLoginLoading = true;
          let resLogin = await login(this.formLogin.userName, this.formLogin.password);
          if (resLogin.data === true) {
            let resUserInfo = await getUserInfo(this.formLogin.userName);
            if (resUserInfo.data.isDisabled) {
              this.$Message.error('该用户已被禁用');
            } else {
              if (resUserInfo.data.role === 1) {
                this.$Message.error('登录失败，权限不足');
              }  else {
                this.setUser(resUserInfo.data);
                let resToken = await getToken(this.formLogin.userName, this.formLogin.password);
                this.setToken(resToken.data);
                this.$Message.success('登录成功');
                await this.$router.push({
                  name: 'home',
                })
              }
            }
          } else {
            this.$Message.error('用户名或密码错误');
          }
          this.btnLoginLoading = false;
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
.login-container {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .remember {
    margin: 0px 0px 35px 0px;
  }
}
</style>
