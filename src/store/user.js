import Cookie from 'js-cookie';
export default {
  namespaced: true,
  actions: {
    setUser(context, value) {
      context.commit('SET_USER', value);
    },
    clearUser(context) {
      context.commit('CLEAR_USER');
    },
    initUser(context) {
      context.commit('INIT_USER');
    },
    setToken(context, value) {
      context.commit('SET_TOKEN', value);
    },
    clearToken(context) {
      context.commit('CLEAR_TOKEN');
    },
    initToken(context) {
      context.commit('INIT_TOKEN');
    }
  },
  mutations: {
    SET_USER(state, value) {
      state.user = value;
      Cookie.set('user', JSON.stringify(value));
    },
    CLEAR_USER(state) {
      state.user = { };
      Cookie.remove('user');
    },
    INIT_USER(state) {
      state.user = JSON.parse(Cookie.get('user')) || { };
    },
    SET_TOKEN(state, value) {
      state.token = value;
      Cookie.set('token', value);
    },
    CLEAR_TOKEN(state) {
      state.token = '';
      Cookie.remove('token');
    },
    INIT_TOKEN(state) {
      state.token = Cookie.get('token') || '';
    }
  },
  state: {
    user: { },
    token: '',
  },
  getters: {
    isAuthenticated(state) {
      return !!state.user.userName;
    },
    isAdminRole(state) {
      return state.user.role === 2 || state.user.role === 3;
    },
    isSuperAdmin(state) {
      return state.user.role === 3;
    },
  }
}
