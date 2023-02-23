import axios from 'axios'
import * as types from './mutation-types'

const API_URL = process.env.VUE_APP_API_URL

export const inviteUser = ({ commit, dispatch, state }, data) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/invite/`, data).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const checkInvitation = ({ commit, dispatch, state }, params) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/invite/validity/`, { params }).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const acceptInvitation = ({ commit, dispatch, state }, data) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/invite/acceptances/`, data).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const resendInvitation = ({ commit, dispatch, state }, id) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/invite/${id}/messages/`).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const cancelInvitation = ({ commit, dispatch, state }, id) => {
  return new Promise((resolve, reject) => {
    axios.delete(`${API_URL}/invite/${id}/`).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchAllUsers = ({ commit, dispatch, state }, { ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/user/`, { params: filters }).then(response => {
      const users = response.data.data.results.map(user => {
        if (user.invitation_details && user.invitation_details.length > 0) {
          user.inviteName = user.invitation_details[0].created_by
          user.inviteState = 'Pending'
        } else {
          user.inviteState = 'Completed'
        }
        return user
      })
      commit(types.SET_ALL_USERS, {
        users,
        filters
      })
      commit(types.SET_ALL_USERS_COUNT, response.data.data.count)
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchUser = ({ commit, dispatch, state }, userId) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/user/${userId}/`).then(response => {
      commit(types.SET_USER, response.data.data)
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const updateUser = ({ commit, dispatch, state }, { userId, ...payload }) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${API_URL}/user/${userId}/`, payload).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const updateUserPassword = ({ commit, dispatch, state }, { userId, ...payload }) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${API_URL}/user/${userId}/password/`, payload).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchCurrentUser = ({ commit, dispatch, state }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/me/`).then(response => {
      commit(types.SET_CURRENT_USER, response.data.data)
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchUserRoles = ({ commit, dispatch, state }, userId) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/user-role/?user=${userId}&page_size=0`).then(response => {
      if (userId === state.currentUser.id) {
        commit(types.SET_CURRENT_USER_ROLES, response.data.data)
      }
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const removeRoleFromUser = ({ commit, dispatch, state }, userRoleId) => {
  return new Promise((resolve, reject) => {
    axios.delete(`${API_URL}/user-role/${userRoleId}/`).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const updateCurrentUser = ({ commit, dispatch, state }, data) => {
  let userId = state.currentUser.id
  if (data.id) {
    userId = data.id
  }

  return new Promise((resolve, reject) => {
    axios.patch(`${API_URL}/user/${userId}/`, data).then(response => {
      commit(types.UPDATE_CURRENT_USER, response.data.data)
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchUserOptions = ({ commit, dispatch, state }) => {
  return new Promise((resolve, reject) => {
    const userId = state.currentUser.id
    axios.options(`${API_URL}/user/${userId}/`).then(response => {
      commit(types.SET_USER_OPTIONS, response.data)
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const updateUserEmail = ({ commit, dispatch, state }, data) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/me/email/`, data).then(response => {
      commit(types.UPDATE_CURRENT_USER, data)
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const changePassword = ({ commit, dispatch, state }, data) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/me/password/`, data).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const generateBoundlessKey = ({ commit, dispatch, state }, data) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/me/apikey/generate/`).then(response => {
      const data = {
        profile: {
          boundless_api_key: response.data.data
        }
      }
      commit(types.UPDATE_CURRENT_USER, data)
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const deleteBoundlessKey = ({ commit, dispatch, state }, data) => {
  return new Promise((resolve, reject) => {
    axios.delete(`${API_URL}/me/apikey/delete/`).then(response => {
      const data = {
        profile: {
          boundless_api_key: ''
        }
      }
      commit(types.UPDATE_CURRENT_USER, data)
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const verifyEmail = ({ commit, dispatch, state }, data) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/me/email/verification/`, data).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const resendVerificationMessage = ({ commit, dispatch, state }, data) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/me/email/verification/message/`, data).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const setContactDialogFlag = ({ commit, dispatch, state }, flag) => {
  commit(types.SET_CONTACT_DIALOG_FLAG, flag)
}

export const assignRoleUser = ({ commit, dispatch, state }, data) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/user-role/`, data).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const deleteUser = ({ commit, dispatch, state }, id) => {
  return new Promise((resolve, reject) => {
    axios.delete(`${API_URL}/user/${id}/`).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchUserTfaSecret = ({ commit, dispatch, state }, userId) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/user/${userId}/tfa-secret/`).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const generateUserTfaVerificationCode = ({ commit, dispatch, state }, userId) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/user/${userId}/tfa-verification-code/`).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const verifyUserTfaSettings = ({ commit, dispatch, state }, { userId, ...payload }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/user/${userId}/tfa-verification/`, payload).then(response => {
      commit(types.UPDATE_CURRENT_USER, response.data.data)
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const deactivateUserTfa = ({ commit, dispatch, state }, { userId }) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${API_URL}/user/${userId}/tfa-deactivation/`).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const downloadAllUsers = ({ commit, dispatch, state }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/user/`, {
      responseType: 'blob',
      headers: {
        Accept: 'text/csv'
      }
    }).then((response) => {
      var a = document.createElement('a')
      a.href = URL.createObjectURL(response.data)
      a.download = `users.csv`
      a.click()

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}
