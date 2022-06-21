<template>
  <Panel :padding="30" class="container">
    <div slot="title" class="center">重置密码</div>
    <template v-if="!successApply">
      <Form :model="formResetPassword" ref="formResetPassword">
        <Form-item prop="email">
          <Input
            v-model="formResetPassword.email"
            placeholder="输入用户邮箱"
            size="large"
          >
            <Icon type="ios-email-outline" slot="prepend"></Icon>
          </Input>
        </Form-item>
        <Form-item prop="captcha" style="margin-bottom: 10px">
          <div class="captcha">
            <div class="captcha-code">
              <Input
                v-model="formResetPassword.captcha"
                placeholder="输入验证码"
                size="large"
              >
                <Icon type="ios-lightbulb-outline" slot="prepend"></Icon>
              </Input>
            </div>
          </div>
        </Form-item>
      </Form>
      <Button
        type="primary"
        @click="sendEmail"
        class="btn"
        :loading="btnLoading"
        >发送验证码
      </Button>
      <Button
        type="primary"
        @click="resetPassword"
        class="btn"
        :loading="btnLoading"
        >重置密码
      </Button>
    </template>
    <template v-else>
      <Alert type="success" show-icon>
        成功
        <span slot="desc"> </span>
      </Alert>
    </template>
  </Panel>
</template>
<script>
import {
  checkEmailExists,
  sendEmailCode,
  resetPassword,
} from "@/pages/user/api/index";
import Panel from "@/pages/user/components/Panel.vue";

export default {
  components: {
    Panel,
  },
  data() {
    const CheckEmailExist = (rule, value, callback) => {};
    return {
      emailCaptcha: "",
      successApply: false,
      btnLoading: false,
      formResetPassword: {
        email: "",
        captcha: "",
      },
    };
  },
  mounted() {
    this.$Message.config({
      top: 100, // 距离顶部
      duration: 3, // 持续时间
    });
  },
  methods: {
    async resetPassword() {
      //表格填写的验证码
      if (this.formResetPassword.captcha) {
        if (this.formResetPassword.captcha == this.emailCaptcha) {
          const resetPasswordRes = await resetPassword(
            this.formResetPassword.email
          );
          //console.log(resetPasswordRes)
          //重置成功
          if (resetPasswordRes.status == 200) {
            this.$Message.success("重置密码成功，初始密码为123456！");
          }
        }else{
          this.$Message.error("验证码错误，请重新输入！");
        }
      }
    },

    async sendEmail() {
      //邮箱不为空
      if (this.formResetPassword.email !== "") {
        const checkEmailRes = await checkEmailExists(
          this.formResetPassword.email
        );
        //console.log(checkEmailRes.data)
        //邮箱存在
        if (checkEmailRes.data) {
          const getEmailCodeRes = await sendEmailCode(
            this.formResetPassword.email
          );
          //console.log(getEmailCodeRes)
          //给邮箱发邮件
          if (getEmailCodeRes.status == 200) {
            //得到邮箱的验证码
            this.emailCaptcha = getEmailCodeRes.data;
            //console.log( this.emailCaptcha)
          }
        }else{
          this.$Message.error("没有与该邮箱对应的用户，请重新输入");
        }
      } else {
        this.$Message.error("请输入用户邮箱");
      }
      ///const res = await getCaptchaSrc();
    },
  },
};
</script>

<style scoped lang="less">
.container {
  width: 450px;
  margin: auto;
  .center {
    text-align: center;
  }
  .btn {
    margin-top: 18px;
    text-align: center;
  }
}
</style>
