import service from 'axios'
import { Message } from 'element-ui'
import errorCode from '@/const/errorCode'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import store from '@/store/'

service.defaults.timeout = 30000
// 返回其他状态吗
service.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500 // 默认的
}
// 跨域请求，允许保存cookie
service.defaults.withCredentials = true
// NProgress Configuration
NProgress.configure({
  showSpinner: false
})

// HTTPrequest拦截
service.interceptors.request.use(config => {
  NProgress.start() // start progress bar
  const isToken = (config.headers || {}).isToken === false
  let token = store.getters.access_token
  if (token && !isToken) {
    config.headers['Authorization'] = 'Bearer ' + token // token
  }

  // 获取每次操作的时间
  let current_Time = new Date().getTime();
  // let login_time = store.getters.login_time
  let expires_in = store.getters.expires_in
  let refresh_time = store.getters.refresh_time

  if (!refresh_time == '' && !expires_in == '') {
    // 后面每次刷新
    let time_contrast = current_Time - refresh_time
    if (time_contrast >  Number(expires_in)/2) {
      this.store.dispatch('RefreshToken')
    }
  }

  return config
}, error => {
  return Promise.reject(error)
})

// HTTPresponse拦截
service.interceptors.response.use(res => {
  NProgress.done()
  const status = Number(res.status) || 200
  const message = res.data.msg || errorCode[status] || errorCode['default']
  if (status === 401) {
    store.dispatch('FedLogOut').then(() => {
      router.push({ path: '/login' })
    })
    return
  }
  if (status !== 200 || res.data.code === 0) {
    Message({
      message: message,
      type: 'error'
    })
    return Promise.reject(new Error(message))
  }
  // 无效token 失效功能
  debugger
  if (status === 200 && res.data.code === 7) {
    
    store.dispatch('FedLogOut').then(() => {
      router.push({ path: '/login' })
    })
    return
  }
  return res
}, error => {
  NProgress.done()
  return Promise.reject(new Error(error))
})

export default service
