import Vue from "vue";
import Framework7 from "framework7/framework7.esm.bundle";
import Framework7Vue from "framework7-vue";
import App from "./App.vue";
import store from "./store";


import "./styles/index.less";

Framework7.use(Framework7Vue);
Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");