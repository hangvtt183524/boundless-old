import * as types from './mutation-types'

const mutations = {
  [types.SET_WORKSPACE_USERS] (state, { users, filters }) {
    if (filters.hasOwnProperty('page') && filters.page !== 1) {
      // Loading next page, push results to existing state
      users.forEach(result => {
        state.workspaceUsers.push(result)
      })
    } else {
      state.workspaceUsers = users
    }
  },
  [types.SET_WORKSPACE_USERS_COUNT] (state, count) {
    state.workspaceUsersCount = count
  }
}

export default mutations
