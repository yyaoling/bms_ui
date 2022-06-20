export default {
  namespaced: true,
  actions: {
    changeModalStatus(context, value) {
      context.commit('CHANGE_MODAL_STATUS', value);
    }
  },
  mutations: {
    CHANGE_MODAL_STATUS(state, value) {
      state.modalStatus = value;
    }
  },
  state: {
    modalStatus: {
      mode: 'login',
      visible: false,
      title: '登录',
    }
  },
  getters: {

  }
}
