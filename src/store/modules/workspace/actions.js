import axios from 'axios'
import * as types from './mutation-types'
import Ls from '@/services/ls'

const API_URL = process.env.VUE_APP_API_URL

export const resetWorkspaceState = ({ commit, dispatch, state }) => {
  // To be called when workspace changes, clears workspace-specific state data
  commit(types.RESET)
}

export const clearWorkspaceSetupStatus = ({ commit, dispatch, state }) => {
  commit(types.UPDATE_API_KEY_STATUS, null)
}

export const fetchWorkspaces = ({ commit, dispatch, state }, { ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/`, { params: filters }).then((response) => {
      commit(types.UPDATE_WORKSPACES, {
        items: response.data.data.results,
        filters: filters
      })
      commit(types.UPDATE_WORKSPACES_COUNT, response.data.data.count)

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const retrieveWorkspace = ({ commit, dispatch, state }, { id }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${id}/`, { suppressErrors: true }).then((response) => {
      resolve(response)
    }).catch(err => {
      if (err && err.response && err.response.data && err.response.data.error &&
        err.response.data.error.status === 404) {
        // Clear workspace from layout state and on 404 errors
        Ls.updateInJson('layout.state', 'workspace', null)
      }

      reject(err)
    })
  })
}

export const retrieveWorkspaceSetupStatus = ({ commit, dispatch, state }, { id }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${id}/setup-status/`).then((response) => {
      commit(types.UPDATE_API_KEY_STATUS, response.data.data.is_set_up)

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const createWorkspace = ({ commit, dispatch, state }, { ...data }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/`, data).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const updateWorkspace = ({ commit, dispatch, state }, { id, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${API_URL}/workspace/${id}/`, data).then((response) => {
      // If updated currently selected workspace, update local selected workspace data
      dispatch('layout/updateSelectedWorkspace', response.data.data, { root: true })

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const updateWorkspaceLogo = ({ commit, dispatch, state }, { id, formData }) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${API_URL}/workspace/${id}/logo/`, formData).then((response) => {
      // If updated currently selected workspace, update local selected workspace data
      dispatch('layout/updateSelectedWorkspace', response.data.data, { root: true })

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const deleteWorkspaceLogo = ({ commit, dispatch, state }, { id }) => {
  return new Promise((resolve, reject) => {
    axios.delete(`${API_URL}/workspace/${id}/logo/`).then((response) => {
      // If updated currently selected workspace, update local selected workspace data
      dispatch('layout/updateSelectedWorkspace', response.data.data, { root: true })

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const deleteWorkspace = ({ commit, dispatch, state }, { id }) => {
  return new Promise((resolve, reject) => {
    axios.delete(`${API_URL}/workspace/${id}/`).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const getWorkspaceSuggestions = ({ commit, dispatch, state }, { ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/suggestions/`, { params: filters }).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const setPendingInvitationId = ({ commit, dispatch, state }, invitationId) => {
  commit(types.SET_PENDING_INVITATION_ID, invitationId)
}

export const fetchWorkspaceExternalApiKeys = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/external-api-key/`, { params: filters }).then((response) => {
      commit(types.UPDATE_EXTERNAL_API_KEYS, {
        items: (filters.page_size === 0 ? response.data.data : response.data.data.results),
        filters: filters
      })
      commit(types.UPDATE_EXTERNAL_API_KEYS_COUNT, (filters.page_size === 0 ? response.data.data.length : response.data.data.count))

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const retrieveWorkspaceExternalApiKey = ({ commit, dispatch, state }, { workspaceId, id }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/external-api-key/${id}/`).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const createWorkspaceExternalApiKey = ({ commit, dispatch, state }, { workspaceId, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/${workspaceId}/external-api-key/`, data).then((response) => {
      // Reset api key setup status
      commit(types.UPDATE_API_KEY_STATUS, null)

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const updateWorkspaceExternalApiKey = ({ commit, dispatch, state }, { workspaceId, id, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${API_URL}/workspace/${workspaceId}/external-api-key/${id}/`, data).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const deleteWorkspaceExternalApiKey = ({ commit, dispatch, state }, { workspaceId, id }) => {
  return new Promise((resolve, reject) => {
    axios.delete(`${API_URL}/workspace/${workspaceId}/external-api-key/${id}/`).then((response) => {
      // Reset api key setup status
      commit(types.UPDATE_API_KEY_STATUS, null)

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchWorkspaceExternalApiKeyOrganizations = ({ commit, dispatch, state }, { workspaceId, id, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/external-api-key/${id}/organization/`, { params: filters }).then((response) => {
      commit(types.UPDATE_EXTERNAL_API_KEY_ORGANIZATIONS, response.data.data.results)
      commit(types.UPDATE_EXTERNAL_API_KEY_ORGANIZATIONS_COUNT, (filters.page_size === 0 ? response.data.data.length : response.data.data.count))

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchWorkspaceExternalApiKeyOrganizationIds = ({ commit, dispatch, state }, { workspaceId, id, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/external-api-key/${id}/organization/ids/`, { params: filters }).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const refreshWorkspaceExternalApiKeyOrganizations = ({ commit, dispatch, state }, { workspaceId, id }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/${workspaceId}/external-api-key/${id}/organization/`).then((response) => {
      commit(types.UPDATE_EXTERNAL_API_KEY_IN_LIST, response.data.data)

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchWorkspaceManageableOrganizations = ({ commit, dispatch, state }, { workspaceId, id, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/manageable-organization/`, { params: filters }).then((response) => {
      commit(types.UPDATE_MANAGEABLE_ORGANIZATIONS, (filters.page_size === 0 ? response.data.data : response.data.data.results))
      commit(types.UPDATE_MANAGEABLE_ORGANIZATIONS_COUNT, (filters.page_size === 0 ? response.data.data.length : response.data.data.count))

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchWorkspaceManageableOrganizationsIds = ({ commit, dispatch, state }, { workspaceId, id, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/manageable-organization/ids/`, { params: filters }).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchWorkspaceUserSecurityChecks = ({ commit, dispatch, state }, workspaceId) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/user-security-checks/`).then((response) => {
      commit(types.UPDATE_USER_SECURITY_CHECKS, response.data.data)
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const clearWorkspaceUserSecurityChecks = ({ commit, dispatch, state }) => {
  commit(types.UPDATE_USER_SECURITY_CHECKS, {})
}

export const fetchActivityLogs = ({ commit, dispatch, state }, { filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/action-log/`, { params: filters }).then(response => {
      const results = response.data.data.results.map(item => {
        item.node_name = item.entities && item.entities.length && item.entities[0].node ? item.entities[0].node.name : ''
        return item
      })

      commit(types.UPDATE_ACTIVITY_LOGS, results)
      commit(types.UPDATE_ACTIVITY_LOGS_COUNT, response.data.data.count)
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}
