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
    showFullScren: getStore({ name: 'showFullScren' }),
    showMenu: getStore({ name: 'showMenu' }),
    website: website
  },
  actions: {},
  mutations: {
    SET_SHADE: (state, active) => {
      state.isShade = active
    },
    SET_COLLAPSE_LOGOUT: (state) => {
      state.isCollapse = true
    },
    SET_COLLAPSE: (state) => {
      state.isCollapse = !state.isCollapse
    },
    SET_FULLSCREN: (state) => {
      state.isFullScren = !state.isFullScren
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
    SET_THEME: (state, color) => {
      state.theme = color
      setStore({
        name: 'theme',
        content: state.theme
      })
    }
  }
}
export default common
