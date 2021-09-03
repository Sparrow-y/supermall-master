import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import tosat from "./components/common/toast/index";

import VueLazyLoad from "vue-lazyload";
import FastClick from "fastclick";

Vue.config.productionTip = false;
// 添加事件总线对象
Vue.prototype.$bus = new Vue();
//  安装toast插件
Vue.use(tosat);
// 移动端300ms延迟
FastClick.attach(document.body);
// 图片懒加载插件
Vue.use(VueLazyLoad, {});
new Vue({
  render: h => h(App),
  router,
  store
}).$mount("#app");
