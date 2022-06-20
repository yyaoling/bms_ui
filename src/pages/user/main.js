import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from '@/pages/user/router'
import store from '@/store/index'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import '@/styles/index.less'
import katex from "@/plugins/katex"
import "echarts"
import ECharts from 'vue-echarts'
import Carousel3d from "vue-carousel-3d";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
Vue.use(Carousel3d);
Vue.use(VueRouter);
Vue.use(iView);
Vue.use(katex);

Vue.component('ECharts', ECharts)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router: router,
  store: store,
}).$mount('#app')
