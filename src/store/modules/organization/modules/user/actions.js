import axios from 'axios'
import * as types from './mutation-types'

const API_URL = process.env.VUE_APP_API_URL

export const fetchOrgUsers = ({ commit, dispatch, state }, { orgId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/organization/${orgId}/user/`, { params: filters }).then(response => {
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
      commit(types.SET_ORG_USERS, {
        users,
        filters
      })
      commit(types.SET_ORG_USERS_COUNT, count)
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const getOrgUserIds = ({ commit, dispatch, state }, { orgId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/organization/${orgId}/user/ids/`, { params: filters }).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchOrganizationUser = ({ commit, dispatch, state }, { orgId, userId }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/organization/${orgId}/user/${userId}/`).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const updateOrganizationUser = ({ commit, dispatch, state }, { orgId, userId, ...payload }) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${API_URL}/organization/${orgId}/user/${userId}/`, payload).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchNodeUsers = ({ commit, dispatch, state }, { nodeId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/node/${nodeId}/user/`, { params: filters }).then(response => {
      commit(types.SET_ORG_USERS, {
        users: response.data.data.results,
        filters
      })
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}
