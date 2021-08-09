import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
// 初始化 EventBus 事件总线
Vue.prototype.$bus = new Vue()
// 每个Vue实例的原型对象上都有$emit和$on
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
