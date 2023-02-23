import axios from 'axios'
import * as types from './mutation-types'

const API_URL = process.env.VUE_APP_API_URL

export const fetchWorkspaceUsers = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/user/`, { params: filters }).then(response => {
      const results = filters.hasOwnProperty('page_size') && filters.page_size === 0
        ? response.data.data : response.data.data.results
      const count = filters.hasOwnProperty('page_size') && filters.page_size === 0
        ? response.data.data.length : response.data.data.count

      const users = results.map(user => {
        if (user.invitation_details) {
          user.inviteName = user.invitation_details.created_by
          user.inviteState = 'Pending'
        } else {
          user.inviteState = ''
        }
        return user
      })
      commit(types.SET_WORKSPACE_USERS, {
        users,
        filters
      })
      commit(types.SET_WORKSPACE_USERS_COUNT, count)
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const getWorkspaceUserIds = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/user/ids/`, { params: filters }).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchWorkspaceUser = ({ commit, dispatch, state }, { workspaceId, userId }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/user/${userId}/`).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const updateWorkspaceUser = ({ commit, dispatch, state }, { workspaceId, userId, ...payload }) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${API_URL}/workspace/${workspaceId}/user/${userId}/`, payload).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}
