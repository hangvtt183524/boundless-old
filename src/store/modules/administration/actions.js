// import axios from 'axios'
import axios from 'axios'
import * as types from './mutation-types'

const API_URL = process.env.VUE_APP_API_URL

export const fetchOrgSummaries = ({ commit, dispatch, state }, { filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/organization/summary/`, { params: filters }).then(response => {
      commit(types.UPDATE_SUMMARIES, response.data.data.results)
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const createRole = ({ commit, state }, { ...payload }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/role/`, payload).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const updateRole = ({ commit, state }, { id, ...payload }) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${API_URL}/role/${id}/`, payload).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const deleteRole = ({ commit, state }, roleId) => {
  return new Promise((resolve, reject) => {
    axios.delete(`${API_URL}/role/${roleId}/`).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const fetchRoles = ({ commit }, filters) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/role/`, { params: filters }).then((response) => {
      let roles
      if (filters.hasOwnProperty('page_size') && filters.page_size === 0) {
        roles = response.data.data
      } else {
        roles = response.data.data.results
      }

      commit(types.UPDATE_ROLES, roles)
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const fetchRole = ({ commit }, { roleId }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/role/${roleId}`).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const fetchActions = ({ commit }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/action/`, { params: { page_size: 0 } }).then((response) => {
      commit(types.UPDATE_ACTIONS, response.data.data)
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const fetchRoleUsers = ({ commit }, { roleId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/user-role/?role=${roleId}`, { params: filters }).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}
