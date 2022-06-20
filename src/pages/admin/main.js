import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from "@/pages/admin/router"
import store from '@/store/index'
import iView from 'iview'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import 'iview/dist/styles/iview.css'
import '@/styles/index.less'

Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(iView);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router: router,
  store: store,
  beforeCreate() {
    Vue.prototype.$bus = this
  }
}).$mount('#admin')
