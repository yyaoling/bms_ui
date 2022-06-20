import Vue from 'vue'
import Vuex from 'vuex'
import user from "@/store/user";
import modal from "@/store/modal";

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user: user,
    modal: modal,
  }
})
