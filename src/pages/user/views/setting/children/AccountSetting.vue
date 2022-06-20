<template>
  <div class="setting-main">
    <div class="flex-container">
      <div class="left">
        <p class="section-title">更改密码</p>
        <Form class="setting-content" ref="formPassword" :model="formPassword" :rules="rulePassword">
          <FormItem label="旧密码" prop="oldPassword">
            <Input v-model="formPassword.oldPassword" type="password"></Input>
          </FormItem>
          <FormItem label="新密码" prop="newPassword">
            <Input v-model="formPassword.newPassword" type="password"></Input>
          </FormItem>
          <FormItem label="确认密码" prop="againPassword">
            <Input v-model="formPassword.againPassword" type="password"></Input>
          </FormItem>
          <FormItem v-if="visible.passwordAlert">
            <Alert type="success">你需要在 {{ this.second }} 秒后重新登录</Alert>
          </FormItem>
          <Button type="primary" @click="changePassword" :loading="loading.btnPassword">更新密码</Button>
        </Form>
      </div>
      <div class="middle separator"></div>
      <div class="right">
        <p class="section-title">更新邮箱</p>
        <Form class="setting-content" ref="formEmail" :model="formEmail" :rules="ruleEmail">
          <FormItem label="密码" prop="password">
            <Input v-model="formEmail.password" type="password"></Input>
          </FormItem>
          <FormItem label="旧邮箱">
            <Input v-model="formEmail.oldEmail" disabled></Input>
          </FormItem>
          <FormItem label="新邮箱" prop="newEmail">
            <Input v-model="formEmail.newEmail"></Input>
          </FormItem>
          <Button type="primary" @click="changeEmail" :loading="loading.btnEmail">更改邮箱</Button>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {
  login,
  updatePassword,
  checkEmailExists,
  updateEmail
} from "@/pages/user/api";

export default {
  name: "AccountSetting",
  data() {
    const oldPasswordCheck = [
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
      },
    ];
    const checkAgainPassword = (rule, value, callback) => {
      if (value !== this.formPassword.newPassword) {
        callback(new Error('密码不匹配'));
      }
      callback();
    };
    const checkNewPassword = (rule, value, callback) => {
      if (this.formPassword.oldPassword !== '') {
        if (this.formPassword.oldPassword === this.formPassword.newPassword) {
          callback(new Error('旧密码与新密码相同'));
        } else {
          this.$refs.formPassword.validateField('againPassword');
        }
      }
      callback();
    };
    return {
      loading: {
        btnPassword: false,
        btnEmail: false,
      },
      visible: {
        passwordAlert: false,
        emailAlert: false,
      },
      formPassword: {
        oldPassword: '',
        newPassword: '',
        againPassword: '',
      },
      formEmail: {
        password: '',
        oldEmail: '',
        newEmail: '',
      },
      rulePassword: {
        oldPassword: oldPasswordCheck,
        newPassword: [
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
          },
          {
            validator: checkNewPassword,
            trigger: 'blur',
          }
        ],
        againPassword: [
          {
            required: true,
            validator: checkAgainPassword,
            trigger: 'change'
          }
        ]
      },
      ruleEmail: {
        password: oldPasswordCheck,
        newEmail: [
          {
            required: true,
            trigger: 'blur',
            message: '邮箱不能为空',
          },
          {
            type: 'email',
            trigger: 'blur',
            message: '邮箱格式不正确',
          }
        ]
      },
      second: 0,
    }
  },
  computed: {
    ...mapState('user', ['user']),
  },
  methods: {
    ...mapActions('user', ['setUser', 'clearUser', 'clearToken']),
    changePassword() {
      this.$refs['formPassword'].validate(async(valid) => {
        if (valid) {
          this.loading.btnPassword = true;
          let resCheck = await login(this.user.userName, this.formPassword.oldPassword);
          if (resCheck.data === true) {
            let resUpdatePassword = await updatePassword(this.user.userName, this.formPassword.newPassword);
            if (resUpdatePassword.status === 200) {
              this.visible.passwordAlert = true;
              this.$Message.success('更新密码成功');
              this.clearToken();
              this.clearUser();
              this.second = 5;
              setInterval(() => {
                this.second = this.second - 1;
              }, 1000)
              setTimeout(() => {
                clearInterval();
                this.visible.passwordAlert = false;
                this.$router.push({
                  name: 'logout',
                });
              }, 5000);
            } else {
              this.$Message.error('更新密码失败');
            }
          }
          this.loading.btnPassword = false;
        }
      })
    },
    changeEmail() {
      this.$refs['formEmail'].validate(async(valid) => {
        if (valid) {
          this.loading.btnPassword = true;
          let resCheck = await login(this.user.userName, this.formEmail.password);
          if (resCheck.data === true) {
            let resCheckEmail = await checkEmailExists(this.formEmail.newEmail);
            if (resCheckEmail.data === false) {
              let resUpdateEmail = await updateEmail(this.user.userName, this.formEmail.newEmail);
              if (resUpdateEmail.status === 200) {
                this.visible.emailAlert = true;
                this.$Message.success('更新邮箱成功');
                this.$refs.formEmail.resetFields();
                this.setUser(resUpdateEmail.data);
              } else {
                this.$Message.error('更新邮箱失败');
              }
            } else {
              this.$Message.error('邮箱已存在');
            }
          }
          this.loading.btnPassword = false;
        }
      })
    },
  },
  mounted() {
    this.formEmail.oldEmail = this.user.email;
  }
}
</script>

<style lang="less" scoped>
.flex-container {
  justify-content: flex-start;
  .left {
    flex: 1 0;
    width: 250px;
    padding-right: 5%;
  }
  > .middle {
    flex: none;
  }
  .right {
    flex: 1 0;
    width: 250px;
  }
}
</style>
