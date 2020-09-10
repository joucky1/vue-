import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '../common/icon/iconfont.css'
import './common/css/clear.css'
import './mock'

import VueResource from 'vue-resource'

Vue.config.productionTip = false

new Vue({
  router,
  VueResource,
  store,
  render: h => h(App)
}).$mount('#app')
