import * as types from './mutation-types'

const mutations = {

  [types.AUTH_SUCCESS] (state, token) {
    state.token = token
    state.status = 'success'
  },

  [types.AUTH_2FA] (state, { tfaMode, token }) {
    state.tfaMode = tfaMode
    state.tfaToken = token
    state.status = ''
    state.token = ''
  },

  [types.AUTH_LOGOUT] (state) {
    state.token = null
  },

  [types.AUTH_ERROR] (state) {
    state.token = ''
    state.status = 'error'
  },

  [types.REFRESH_SUCCESS] (state, token) {
    state.token = token
    state.status = 'success'
  },

  [types.SET_REGISTERED_EMAIL] (state, email) {
    state.registeredEmail = email
  }

}

export default mutations
