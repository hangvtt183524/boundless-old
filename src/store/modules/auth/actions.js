import * as types from './mutation-types'
import axios from 'axios'
import Ls from '@/services/ls'
import router from '@/router'
import { EventTracker } from '@/services/event-tracker'

const API_URL = process.env.VUE_APP_API_URL

export const login = ({ commit, dispatch, state }, data) => {
  return new Promise((resolve, reject) => {
    axios.post(API_URL + '/signin/', data).then((response) => {
      let token = response.data.data.token
      let tfaMode = response.data.data.tfa_mode

      if (tfaMode) {
        commit(types.AUTH_2FA, { tfaMode, token })
      } else {
        Ls.set('auth.token', token)
        commit(types.AUTH_SUCCESS, token)
      }

      resolve(response)
    }).catch(err => {
      commit(types.AUTH_ERROR, err)

      // If error reason is email not being verified yet, set registered email in store
      if (err.response && err.response.data && err.response.data.error && err.response.data.error.detail &&
        err.response.data.error.detail.code === 'account_email_not_verified') {
        commit(types.SET_REGISTERED_EMAIL, data.email)
      }

      Ls.remove('auth.token')
      reject(err)
    })
  })
}

export const login2fa = ({ commit, dispatch, state }, data) => {
  return new Promise((resolve, reject) => {
    axios.post(API_URL + '/signin/2fa/', data).then((response) => {
      let token = response.data.data.token
      Ls.set('auth.token', token)
      commit(types.AUTH_SUCCESS, token)
      resolve(response)
    }).catch(err => {
      commit(types.AUTH_ERROR, err)
      Ls.remove('auth.token')
      reject(err)
    })
  })
}

export const loginSaml = ({ commit, dispatch, state }, data) => {
  return new Promise((resolve, reject) => {
    axios.post(API_URL + '/signin/saml/', data).then((response) => {
      let token = response.data.data.token
      Ls.set('auth.token', token)
      commit(types.AUTH_SUCCESS, token)
      resolve(response)
    }).catch(err => {
      commit(types.AUTH_ERROR, err)
      Ls.remove('auth.token')
      reject(err)
    })
  })
}

export const loginAuthToken = ({ commit, dispatch, state }, data) => {
  return new Promise((resolve, reject) => {
    axios.post(API_URL + '/signin/auth-token/', data).then((response) => {
      let token = response.data.data.token
      let tfaMode = response.data.data.tfa_mode

      if (tfaMode) {
        commit(types.AUTH_2FA, { tfaMode, token })
      } else {
        Ls.set('auth.token', token)
        commit(types.AUTH_SUCCESS, token)
      }

      resolve(response)
    }).catch(err => {
      commit(types.AUTH_ERROR, err)

      // If error reason is email not being verified yet, set registered email in store
      if (err.response && err.response.data && err.response.data.error && err.response.data.error.detail &&
        err.response.data.error.detail.code === 'account_email_not_verified') {
        commit(types.SET_REGISTERED_EMAIL, data.email)
      }

      Ls.remove('auth.token')
      reject(err)
    })
  })
}

export const resend2fa = ({ commit, dispatch, state }, data) => {
  return new Promise((resolve, reject) => {
    axios.post(API_URL + '/signin/2fa/message/', data).then((response) => {
      let token = response.data.data.token
      commit(types.AUTH_2FA, { tfaMode: state.tfaMode, token })
      resolve(response)
    }).catch(err => {
      commit(types.AUTH_ERROR, err)
      Ls.remove('auth.token')
      reject(err)
    })
  })
}

export const refreshToken = ({ commit, dispatch, state }) => {
  return new Promise((resolve, reject) => {
    let data = {
      token: Ls.get('auth.token')
    }
    console.log('REFRESH ACTION')
    axios.post(API_URL + '/signin/refresh/', data).then((response) => {
      let token = response.data.data.token
      Ls.set('auth.token', token)
      commit(types.REFRESH_SUCCESS, token)
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const logout = ({ commit, dispatch, state }, user) => {
  return new Promise((resolve, reject) => {
    commit(types.AUTH_LOGOUT)
    Ls.remove('auth.token')
    Ls.remove('currentUserEmail')
    router.push({ name: 'login' })

    // Clear event tracker session on log out
    EventTracker.clearSession()

    resolve()
  })
}

export const unsetUser = ({ commit, dispatch, state }) => {
  return new Promise((resolve, reject) => {
    commit(types.AUTH_LOGOUT)
    Ls.remove('auth.token')
    Ls.remove('currentUserEmail')
    resolve()
  })
}

export const signup = ({ commit, dispatch, state }, data) => {
  return new Promise((resolve, reject) => {
    axios.post(API_URL + '/signup/', data).then((response) => {
      // We remove `organization` from local storage
      // because this org may be from another user
      // and we don't want it to be loaded when the user
      // first signed up.
      Ls.remove('organization')

      if (response.data.data.pending_email_verification) {
        // User pending email verification. Set email in store for.
        commit(types.SET_REGISTERED_EMAIL, data.email)
      } else {
        // Registration complete. Log the user in
        let token = response.data.data.token
        Ls.set('auth.token', token)

        commit(types.AUTH_SUCCESS, token)
      }

      resolve(response)
    }).catch(err => {
      commit(types.AUTH_ERROR, err)
      Ls.remove('auth.token')
      reject(err)
    })
  })
}

export const sendResetLink = ({ commit, dispatch, state }, data) => {
  return new Promise((resolve, reject) => {
    axios.post(API_URL + '/signin/send-reset-email/', data).then((response) => {
      console.log(response)
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const resetPassword = ({ commit, dispatch, state }, data) => {
  return new Promise((resolve, reject) => {
    axios.post(API_URL + '/signin/reset/', data).then((response) => {
      console.log(response)
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchNodeIdentityProviders = ({ commit, dispatch, state }, workspaceSlug) => {
  return new Promise((resolve, reject) => {
    axios.get(API_URL + '/workspace/identity-providers/' + workspaceSlug + '/').then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const createWebsocketConnectionToken = ({ commit, dispatch, state }, data) => {
  return new Promise((resolve, reject) => {
    axios.post(API_URL + '/websocket-connection-token/', data).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}
