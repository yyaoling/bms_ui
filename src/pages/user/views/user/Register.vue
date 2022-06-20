<template>
  <div>
    <Form ref="formRegister" :model="formRegister" :rules="ruleRegister">
      <FormItem prop="userName">
        <Input
            type="text"
            v-model="formRegister.userName"
            placeholder="用户名"
            size="large"
        >
          <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="email">
        <Input
            v-model="formRegister.email"
            placeholder="电子邮箱"
            size="large"
        >
          <Icon type="ios-email-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="password">
        <Input
            type="password"
            v-model="formRegister.password"
            placeholder="密码"
            size="large"
        >
          <Icon type="ios-locked-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="passwordAgain">
        <Input
            type="password"
            v-model="formRegister.passwordAgain"
            placeholder="确认密码"
            size="large"
        >
          <Icon type="ios-locked-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
    </Form>
    <div class="footer">
      <Button
          type="primary"
          @click="handleRegister"
          class="btn"
          long
          :loading="btnRegisterLoading"
      >注册</Button>
      <Button
          type="ghost"
          @click="switchMode('login', '登录')"
          class="btn"
          long
      >已经注册？现在登录！</Button>
    </div>
  </div>
</template>

<script>
import {
  checkUserNameExists,
  checkEmailExists,
  register
} from "@/pages/user/api";
import { mapActions } from "vuex";

export default {
  name: "Register",
  data() {
    const checkUserNameNotExists = async(rule, value, callback) => {
      let resUserNameExists = await checkUserNameExists(this.formRegister.userName);
      if (resUserNameExists.data === true) {
        callback(new Error('该用户名已存在'));
      }
      callback();
    };
    const checkEmailNotExists = async(rule, value, callback) => {
      let resEmailExists = await checkEmailExists(this.formRegister.email);
      if (resEmailExists.data === true) {
        callback(new Error('该电子邮箱地址已存在'));
      }
      callback();
    };
    const checkPassword = (rule, value, callback) => {
      if (this.formRegister.password !== '') {
        this.$refs.formRegister.validateField('passwordAgain');
      }
      callback();
    };
    const checkAgainPassword = (rule, value, callback) => {
      if (value !== this.formRegister.password) {
        callback(new Error('密码不匹配'));
      }
      callback();
    }
    return {
      btnRegisterLoading: false,
      formRegister: {
        userName: '',
        password: '',
        passwordAgain: '',
        email: '',
      },
      ruleRegister: {
        userName: [
          {
            required: true,
            trigger: 'blur',
            message: '用户名不能为空',
          },
          {
            validator: checkUserNameNotExists,
            trigger: 'blur',
          },
        ],
        email: [
          {
            required: true,
            trigger: 'blur',
            message: '邮箱不能为空',
          },
          {
            type: 'email',
            trigger: 'blur',
            message: '邮箱格式不正确',
          },
          {
            validator: checkEmailNotExists,
            trigger: 'blur',
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
          },
          {
            validator: checkPassword,
            trigger: 'blur',
          }
        ],
        passwordAgain: [
          {
            required: true,
            trigger: 'blur',
            message: '确认密码不能为空',
          },
          {

            validator: checkAgainPassword,
            trigger: 'change',
          }
        ],
      }
    }
  },
  methods: {
    ...mapActions('modal', ['changeModalStatus']),
    switchMode(mode, title) {
      this.changeModalStatus({
        mode: mode,
        visible: true,
        title: title,
      })
    },
    handleRegister() {
      this.$refs['formRegister'].validate(async(valid) => {
        if (valid) {
          this.btnRegisterLoading = true;
          let formData = Object.assign({ }, this.formRegister);
          delete formData['passwordAgain'];
          let resRegister = await register(formData);
          if (resRegister.status === 201) {
            this.$Message.success('注册成功');
            this.switchMode('login', '登录');
          } else {
            this.$Message.error('注册失败');
          }
          this.btnRegisterLoading = false;
        }
      })
    }
  }
}
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
