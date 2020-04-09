import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tab_active: "home", // 底部标签栏选中项
    no_navbar: false, // 是否隐藏顶部标题栏
    no_toolbar: true, // 是否隐藏底部栏
  },
  mutations: {},
  actions: {},
  modules: {}
});