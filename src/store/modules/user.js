import { getStore, setStore } from '@/utils/store'
import { isURL } from '@/utils/validate'
import { login, logout, getInfo, getMenu,refreshToken } from '@/api/login'
import { deepClone, encryption, handleImg } from '@/utils/util'
import webiste from '@/const/website'


function addPath(ele, first) {
  const propsConfig = webiste.menu.props
  const propsDefault = {
    label: propsConfig.label || 'label',
    path: propsConfig.path || 'path',
    icon: propsConfig.icon || 'icon',
    children: propsConfig.children || 'children'
  }
  const isChild = ele[propsDefault.children] && ele[propsDefault.children].length !== 0
  if (!isChild && first) {
    ele[propsDefault.path] = ele[propsDefault.path] + '/index'
    return
  }
  ele[propsDefault.children].forEach(child => {
    if (!isURL(child[propsDefault.path])) {
      child[propsDefault.path] = `${ele[propsDefault.path]}/${child[propsDefault.path] ? child[propsDefault.path] : 'index'}`
    }
    addPath(child)
  })
}

const user = {
  state: {
    avatar: '', // 用户头像
    userInfo: {}, // 用户信息
    permissions: {}, // 用户权限
    roles: [],    // 角色
    isInitial: true, //  是否修改过密码true 是初始密码
    show_index: getStore({ // 一级导航所在下标
      name: 'show_index'
    }) || '-1',
    menu: getStore({   //  菜单列表
      name: 'menu'
    }) || [],
    menuAll: [],
    refresh_time:'', // 登录或者刷新token的时间
    expires_in: getStore({
      name: 'expires_in'
    }) || '',
    access_token: getStore({
      name: 'access_token'
    }) || '',
    refresh_token: getStore({
      name: 'refresh_token'
    }) || ''
  },

  mutations: {
    SET_LOGIN_TIME:(state, login_time) => {
      state.login_time = login_time
      setStore({
        name: 'login_time',
        content: state.login_time,
        type: 'session'
      })
    },
    SET_REFRESH_TIME:(state, refresh_time) => {
      state.refresh_time = refresh_time
      setStore({
        name: 'refresh_time',
        content: state.refresh_time,
        type: 'session'
      })
    },
    SET_ACCESS_TOKEN: (state, access_token) => {
      state.access_token = access_token
      setStore({
        name: 'access_token',
        content: state.access_token,
        type: 'session'
      })
    },
    SET_EXPIRES_IN: (state, expires_in) => {
      state.expires_in = expires_in
      setStore({
        name: 'expires_in',
        content: state.expires_in,
        type: 'session'
      })
    },
    SET_REFRESH_TOKEN: (state, rfToken) => {
      state.refresh_token = rfToken
      setStore({
        name: 'refresh_token',
        content: state.refresh_token,
        type: 'session'
      })
    },

    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_SHOW_INDEX: (state, show_index) => {
      state.show_index = show_index
      setStore({
        name: 'show_index',
        content: state.show_index,
        type: 'session'
      })
    },
    SET_MENU: (state, menu) => {
      state.menu = menu
      setStore({
        name: 'menu',
        content: state.menu,
        type: 'session'
      })
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo
    },
    SET_USER_ISINITIAL: (state, isInitial) => {
      state.isInitial = isInitial
    },
    SET_PERMISSIONS: (state, permissions) => {
      const list = {}
      for (let i = 0; i < permissions.length; i++) {
        list[permissions[i]] = true
      }
      state.permissions = list
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      // 加密处理
      const user = encryption({
        data: userInfo,
        key: 'bigsbigsbigsbigs',
        param: ['password']
      })
      return new Promise((resolve, reject) => {
        login(user.username, user.password, user.code, user.randomStr).then(response => {
          const data = response.data
          if (response.status == 200) {
            let login_time = new Date().getTime();
            commit('SET_ACCESS_TOKEN', data.access_token)
            commit('SET_REFRESH_TOKEN', data.refresh_token)
            commit('SET_EXPIRES_IN', data.expires_in)
            commit('SET_REFRESH_TIME', Number(login_time))
            resolve()
          }
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then((res) => {
          const data = res.data.data || {}
          commit('SET_USER_INFO', data.sysUser)
          commit('SET_AVATAR', data.sysUser.avatar)
          commit('SET_ROLES', data.roles || [])
          commit('SET_PERMISSIONS', data.permissions || [])
          commit('SET_USER_ISINITIAL',data.isInitial)
          resolve(data)
        }).catch((err) => {
          reject()
        })
      })
    },

    // 获取系统菜单
    GetMenu({ commit, state }) {
      return new Promise(resolve => {
        getMenu().then((res) => {
          const data = res.data.data
          let menu = deepClone(data)
          menu.forEach(ele => {
            addPath(ele)
          })
          commit('SET_MENU', menu)

          // 判断是否是第一次登陆
          if (getStore({ name: 'show_index' }) == undefined) {
            commit('SET_SHOW_INDEX', -1)
          } else {
            commit('SET_SHOW_INDEX', getStore({ name: 'show_index' }))
          }
          resolve(menu)
        })
      })
    },
    // 刷新token
    RefreshToken({ commit, state }) {
      return new Promise((resolve, reject) => {
        refreshToken(state.refresh_token).then(response => {
          const data = response.data
          let refresh_time = new Date().getTime();
          commit('SET_ACCESS_TOKEN', data.access_token)
          commit('SET_REFRESH_TOKEN', data.refresh_token)
          commit('SET_EXPIRES_IN', data.expires_in)
          commit('SET_REFRESH_TIME', Number(refresh_time))
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_MENU', [])
          commit('SET_PERMISSIONS', [])
          commit('SET_USER_INFO', {})
          commit('SET_ACCESS_TOKEN', '')
          commit('SET_REFRESH_TOKEN', '')
          commit('SET_EXPIRES_IN', '')
          commit('SET_ROLES', [])
          commit('SET_SHOW_INDEX', -1)
          commit('SET_COLLAPSE_LOGOUT')
          commit('SET_USER_ISINITIAL',true)
          commit('SET_REFRESH_TIME', '')
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 注销session
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_MENU', [])
          commit('SET_PERMISSIONS', [])
          commit('SET_USER_INFO', {})
          commit('SET_ACCESS_TOKEN', '')
          commit('SET_REFRESH_TOKEN', '')
          commit('SET_EXPIRES_IN', '')
          commit('SET_ROLES', [])
          commit('SET_SHOW_INDEX', -1)
          commit('SET_COLLAPSE_LOGOUT')
          commit('SET_USER_ISINITIAL',true)
          commit('SET_REFRESH_TIME', '')
        resolve()
      })
    },
  }
}

export default user
