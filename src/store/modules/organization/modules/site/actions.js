import axios from 'axios'
import router from '@/router'
import * as types from './mutation-types'

const API_URL = process.env.VUE_APP_API_URL

export const fetchSiteOptions = ({ commit, state }) => {
  return new Promise((resolve, reject) => {
    axios.options(`${API_URL}/site/`).then((response) => {
      commit(types.SET_SITE_OPTIONS, response.data)
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const createSite = ({ commit, dispatch, state }, payload) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/site/`, payload).then((response) => {
      resolve(response)

      // Re-fetch current organization as setup state might have changed
      dispatch('organization/fetchOrganization', router.currentRoute.params.orgId, { root: true })
    }).catch((err) => {
      reject(err)
    })
  })
}

export const updateSite = ({ commit, state }, { id, ...payload }) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${API_URL}/site/${id}/`, payload).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const updateGroup = ({ commit, state }, { id, ...payload }) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${API_URL}/group/${id}/`, payload).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const fetchSiteData = ({ commit, state }, siteId) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/site/${siteId}/`).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const fetchGroupData = ({ commit, state }, id) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/group/${id}/`).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const fetchGroupOrgData = ({ commit, state }, id) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/site/?ancestor=${id}`).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}
