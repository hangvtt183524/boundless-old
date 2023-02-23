import axios from 'axios'
import * as types from './mutation-types'

const API_URL = process.env.VUE_APP_API_URL

export const fetchAllWorkspaceOrganizations = ({ commit, dispatch, state }, { workspaceId }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/organization/`, { params: { page_size: 0 } }).then(response => {
      commit(types.SET_WORKSPACE_ORGANIZATIONS, response.data.data)
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const removeWorkspaceOrganization = ({ commit, dispatch, state }, { workspaceId, workspaceOrganizationId }) => {
  return new Promise((resolve, reject) => {
    axios.delete(`${API_URL}/workspace/${workspaceId}/organization/${workspaceOrganizationId}/`).then((response) => {
      commit(types.REMOVE_WORKSPACE_ORGANIZATION, workspaceOrganizationId)
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const getMerakiOrganizationAvailability = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/organization/meraki-organization-availability/`, { params: filters }).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const importWorkspaceMerakiOrganizations = ({ commit, dispatch, state }, { workspaceId, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/${workspaceId}/organization/meraki-organizations/`, data).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const importWorkspaceExternalMerakiOrganizations = ({ commit, dispatch, state }, { workspaceId, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/${workspaceId}/organization/meraki-organizations/external/`, data).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const createWorkspaceMerakiOrganizations = ({ commit, dispatch, state }, { workspaceId, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/${workspaceId}/organization/meraki-organization-creation/`, data).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const cloneWorkspaceMerakiOrganization = ({ commit, dispatch, state }, { workspaceId, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/${workspaceId}/organization/meraki-organization-clone/`, data).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const updateWorkspaceOrganizationInList = ({ commit, dispatch, state }, organization) => {
  commit(types.UPDATE_WORKSPACE_ORGANIZATION_IN_LIST, organization)
}

export const bulkDeleteOrganizationsFromSystem = ({ commit, dispatch, state }, { workspaceId, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/${workspaceId}/organization/bulk-delete-from-system/`, data).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}
