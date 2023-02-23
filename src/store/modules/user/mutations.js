import Ls from '@/services/ls'
import * as types from './mutation-types'

const mutations = {
  [types.SET_ALL_USERS] (state, { users, filters }) {
    if (filters.hasOwnProperty('page') && filters.page !== 1) {
      // Loading next page, push results to existing state
      users.forEach(result => {
        state.allUsers.push(result)
      })
    } else {
      state.allUsers = users
    }
  },
  [types.SET_ALL_USERS_COUNT] (state, count) {
    state.allUsersCount = count
  },
  [types.SET_USER] (state, user) {
    state.user = user
  },
  [types.SET_CURRENT_USER] (state, user) {
    state.currentUser = {
      ...user,
      roles: user.user_roles
    }
    // This will be used in change email verification
    Ls.set('currentUserEmail', user.email)
  },
  [types.SET_CURRENT_USER_ROLES] (state, userRoles) {
    state.currentUser = {
      ...state.currentUser,
      roles: userRoles
    }
  },
  [types.SET_USER_OPTIONS] (state, options) {
    state.userOptions = options
  },
  [types.UPDATE_CURRENT_USER] (state, data) {
    const { profile, ...user } = data
    if (!global._.isEmpty(user)) {
      state.currentUser = Object.assign({}, state.currentUser, user)
    }
    if (!global._.isEmpty(profile)) {
      state.currentUser.profile = Object.assign({}, state.currentUser.profile, profile)
    }
  },
  [types.SET_CONTACT_DIALOG_FLAG] (state, flag) {
    state.showContactFlag = flag
  }
}

export default mutations
