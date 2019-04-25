import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import tagsView from './modules/tagsView'
import tags from './modules/tags'
import common from './modules/common'
import getters from './getters'


Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    common,
    app,
    user,
    tags,
    tagsView,
  },
  getters
})

export default store
