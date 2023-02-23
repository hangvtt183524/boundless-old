import Vue from 'vue'
import Vuex from 'vuex'

import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

import administration from './modules/administration'
import auth from './modules/auth'
import builder from './modules/builder'
import workspace from './modules/workspace'
import organization from './modules/organization'
import user from './modules/user'
import layout from './modules/layout'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state,
  getters,
  mutations,
  actions,

  modules: {
    administration,
    auth,
    builder,
    user,
    layout,
    workspace,
    organization
  }
})
