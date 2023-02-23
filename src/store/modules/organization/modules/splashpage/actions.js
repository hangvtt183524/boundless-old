import axios from 'axios'

import * as types from './mutation-types'

const API_URL = process.env.VUE_APP_API_URL

export const fetchSplashPageOptions = ({ commit }, orgId) => {
  return new Promise((resolve, reject) => {
    axios.options(`${API_URL}/organization/${orgId}/splashpage/`).then(response => {
      commit(types.SET_SPLASH_PAGE_OPTIONS, response.data)
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const getSplashPageIds = ({ commit }, { orgId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/organization/${orgId}/splashpage/ids/`, { params: filters }).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const createSplashPage = ({ commit, state }, { orgId, payload }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/organization/${orgId}/splashpage/`, payload).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const sendProjectData = ({ commit, state }, payload) => {
  const formData = new FormData()

  for (let key of Object.keys(payload)) {
    if (payload[key]) {
      if (Array.isArray(payload[key])) {
        for (let val in payload[key]) {
          formData.append(`${key}[]`, val)
        }
      } else {
        formData.append(key, payload[key])
      }
    }
  }
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/project/`, formData).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const selectSplashTemplateType = ({ commit, dispatch, state }, templateType) => {
  commit(types.UPDATE_TEMPLATE_TYPE, templateType)
}
