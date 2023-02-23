import * as types from './mutation-types'

const mutations = {
  [types.UPDATE_ROLES] (state, roles) {
    state.roles = roles
  },

  [types.UPDATE_TOTAL_ROLES] (state, roles) {
    state.totalRoles = roles
  },

  [types.UPDATE_ACTIONS] (state, actions) {
    state.actions = actions
  },

  [types.UPDATE_SUMMARIES] (state, summaries) {
    state.summaries = summaries
  }
}

export default mutations
