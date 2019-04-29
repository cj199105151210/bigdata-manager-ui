import Vue from 'vue'
import VueQuillEditor from 'vue-quill-editor'
import BaiduMap from 'vue-baidu-map'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// avue 是基于element-ui 进行的二次封装ui框架
import Avue from '@smallwei/avue'
import '@smallwei/avue/lib/theme-chalk/index.css'
import 'swiper/dist/css/swiper.min.css'
import basicContainer from './components/basic-container/main'

import App from './App'
import store from '@/store'
import router from './router/router'
import '@/permission' // permission control

import * as filters from './filters' // global filters

import { validatenull } from '@/utils/validate'
Vue.prototype.validatenull = validatenull

/** 引入字体图标* */
import './styles/common.scss' // 基础样式
// 注册全局容器
Vue.component('basicContainer', basicContainer)

Vue.use(ElementUI)
Vue.use(Avue)
Vue.use(VueQuillEditor)
Vue.use(BaiduMap, {
  ak: '2OobiThLziiqOjO1CPbtnlGjjeb9v2Hw'
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
