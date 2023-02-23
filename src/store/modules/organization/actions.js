import axios from 'axios'
import * as types from './mutation-types'
import Ls from '@/services/ls'

const API_URL = process.env.VUE_APP_API_URL
const ORG_LIST_URL = `${API_URL}/organization/`

export const fetchOrganizations = ({ commit, dispatch, state }, task) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/node/organizations/`).then((response) => {
      // User is not associated with any organization by default
      // unless user was invited, so we need to return an empty list
      let organizations = response.data.data || []
      if (organizations.length > 0) {
        organizations.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase())
      }
      commit(types.UPDATE_ORGANIZATIONS, organizations)
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchOrganization = ({ commit, dispatch, state }, orgId) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/organization/${orgId}/`, { suppressErrors: true }).then((response) => {
      commit(types.UPDATE_SINGLE_ORGANIZATION, response.data.data)

      // If fetched currently selected organization, update local selected organization data
      dispatch('layout/updateSelectedOrganization', response.data.data, { root: true })

      resolve(response)
    }).catch(err => {
      if (err && err.response && err.response.data && err.response.data.error &&
        err.response.data.error.status === 404) {
        // Clear organization from layout state and on 404 errors
        Ls.updateInJson('layout.state', 'organization', null)
      }

      reject(err)
    })
  })
}

export const createOrganization = ({ commit, dispatch, state }, organization) => {
  return new Promise((resolve, reject) => {
    axios.post(ORG_LIST_URL, organization).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const updateOrganization = ({ commit, dispatch, state }, data) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${ORG_LIST_URL}${data.id}/`, data).then(response => {
      // If updated currently selected organization, update local selected organization data
      dispatch('layout/updateSelectedOrganization', response.data.data, { root: true })

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const createEmailValidation = ({ commit, dispatch, state }, { orgId, data }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${ORG_LIST_URL}${orgId}/emailvalidation/`, data).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchEmailValidation = ({ commit, dispatch, state }, id) => {
  return new Promise((resolve, reject) => {
    axios.get(`${ORG_LIST_URL}${id}/emailvalidation/`).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const deleteOrganization = ({ commit, dispatch, state }, orgId) => {
  return new Promise((resolve, reject) => {
    axios.delete(`${ORG_LIST_URL}${orgId}/`).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const exportOrganization = ({ commit, dispatch, state }, orgId) => {
  return new Promise((resolve, reject) => {
    axios.post(`${ORG_LIST_URL}${orgId}/gdpr-export/`).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const sendTestEmail = ({ state }, { orgId, ...payload }) => {
  let id = orgId
  if (!id) {
    id = state.selectedOrganization.id
  }
  return new Promise((resolve, reject) => {
    axios.post(`${ORG_LIST_URL}${id}/test-email/`, payload).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const sendTestSms = ({ state }, { orgId, ...payload }) => {
  let id = orgId
  if (!id) {
    id = state.selectedOrganization.id
  }
  return new Promise((resolve, reject) => {
    axios.post(`${ORG_LIST_URL}${id}/test-sms/`, payload).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const loadArubaDevices = ({ state }, { orgId, ...payload }) => {
  let id = orgId
  if (!id) {
    id = state.selectedOrganization.id
  }
  return new Promise((resolve, reject) => {
    axios.post(`${ORG_LIST_URL}${id}/import/aruba/load/`, payload).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchSplashPages = ({ commit, dispatch, state }, { orgId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${ORG_LIST_URL}${orgId}/splashpage/`, { params: filters }).then((response) => {
      const results = filters.page_size === 0 ? response.data.data : response.data.data.results

      commit(types.SET_SPLASH_PAGES, results)
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const deleteSplashPage = ({ commit, state }, { orgId, id }) => {
  return new Promise((resolve, reject) => {
    axios.delete(`${ORG_LIST_URL}${orgId}/splashpage/${id}/`).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const cloneSplashPage = ({ commit, state }, { orgId, id, name }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${ORG_LIST_URL}${orgId}/splashpage/duplicate_page/${id}/`, { params: name }).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const deleteSelectedSplashPages = ({ commit, state }, { orgId, splashPageIds }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${ORG_LIST_URL}${orgId}/splashpage/bulk-delete/`, {
      ids: splashPageIds
    }).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const removeSelectedUsers = ({ commit, state }, { orgId, userIds }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${ORG_LIST_URL}${orgId}/user/bulk-delete/`, {
      ids: userIds
    }).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const getOrganizationSuggestions = ({ commit, dispatch, state }, { ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/organization/suggestions/`, { params: filters }).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}
