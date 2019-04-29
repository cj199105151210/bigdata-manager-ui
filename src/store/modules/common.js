import { getStore, removeStore, setStore } from '@/utils/store'
import website from '@/const/website'

const common = {

  state: {
    isCollapse: true, // 左侧菜单收缩 true的时候收起来
    isFullScren: true,
    isShade: false,
    screen: -1,
    isLock: getStore({ name: 'isLock' }) || false,
    showTag: getStore({ name: 'showTag' }),
    showCollapse: getStore({ name: 'showCollapse' }), 
    showMenu: getStore({ name: 'showMenu' }),
    website: website
  },
  actions: {},
  mutations: {
    SET_COLLAPSE_LOGOUT: (state) => {
      state.isCollapse = true
    },
    SET_COLLAPSE: (state) => {
      state.isCollapse = !state.isCollapse
    },
    SET_SHOWCOLLAPSE: (state, active) => {
      state.showCollapse = active
      setStore({
        name: 'showCollapse',
        content: state.showCollapse
      })
    },
    SET_SHOWTAG: (state, active) => {
      state.showTag = active
      setStore({
        name: 'showTag',
        content: state.showTag
      })
    },
    SET_SHOWMENU: (state, active) => {
      state.showMenu = active
      setStore({
        name: 'showMenu',
        content: state.showMenu
      })
    },
    SET_SCREEN: (state, screen) => {
      state.screen = screen
    },
  }
}
export default common
