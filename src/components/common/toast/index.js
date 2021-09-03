import Toast from "./Toast";
const obj = {};
obj.install = function(Vue) {
  //   console.log(Toast.$el); //undefind
  //   document.body.appendChild(Toast.$el);
  // 1.创建组件构造器
  const toastConstructor = Vue.extend(Toast);
  //2. 根据组件构造器，用new的方式创建一个组件对象
  const toast = new toastConstructor();
  // 3.将组件对象手动挂载到某个元素上
  toast.$mount(document.createElement("div"));
  // 4.toast.$el此时就是创建的div
  document.body.appendChild(toast.$el);
  Vue.prototype.$toast = toast;
};
export default obj;
