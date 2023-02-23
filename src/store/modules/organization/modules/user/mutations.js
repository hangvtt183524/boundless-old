import * as types from './mutation-types'

const mutations = {
  [types.SET_ORG_USERS] (state, { users, filters }) {
    if (filters.hasOwnProperty('page') && filters.page !== 1) {
      // Loading next page, push results to existing state
      users.forEach(result => {
        state.orgUsers.push(result)
      })
    } else {
      state.orgUsers = users
    }
  },
  [types.SET_ORG_USERS_COUNT] (state, count) {
    state.orgUsersCount = count
  }
}

export default mutations
