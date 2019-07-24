import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/base.css'
import './assets/fonts/iconfont.css'
import './plugins/element.js'
import './api/index.js'
import TreeTable from 'vue-table-with-tree-grid'

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
