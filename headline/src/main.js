import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'amfe-flexible'
import 'highlight.js/styles/default.css' // 代码高亮的样式

import './utils/VantComponent'
import diretivesObj from './utils/directive'
import './utils/console'          // 去掉打印语句


Vue.use(diretivesObj)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
