import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store'
import Cookies from 'js-cookie' // 存储用户端数据在本地
import 'normalize.css/normalize.css'// 提高样式兼容

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'

import i18n from './lang'
import './icons'
import './errorLog'
import './permission'

import dataV from '@jiaminghi/data-view'
Vue.use(dataV)

//{{item | myFilterA | myFilterB}}
//filters: {}
import * as filters from './filters'

Vue.use(Element, {
	size: Cookies.get('size') || 'medium',
	i18n: (key, value) => i18n.t(key, value)
})

// 注册全局过滤器
Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key])
})
//阻止生产环境的消息
Vue.config.productionTip = false

Vue.config.productionTip = false

new Vue({
  router,
	store,
	Cookies,
	i18n,
  render: h => h(App),
}).$mount('#app')
