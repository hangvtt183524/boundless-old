import axios from 'axios'
import * as types from './mutation-types'

const API_URL = process.env.VUE_APP_API_URL

export const fetchPermissionEntities = ({ commit, dispatch, state }, filters) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/permission-entity/`, { params: { page_size: 0, ...filters } }).then(response => {
      commit(types.SET_PERMISSION_ENTITIES, response.data.data)

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchApplications = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/access-control/saml-target-organization/`, { params: filters }).then(response => {
      const results = filters.hasOwnProperty('page_size') && filters.page_size === 0
        ? response.data.data : response.data.data.results
      const count = filters.hasOwnProperty('page_size') && filters.page_size === 0
        ? response.data.data.length : response.data.data.count

      commit(types.SET_APPLICATIONS, results)
      commit(types.SET_APPLICATIONS_COUNT, count)

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const getUserApplicationLoginForm = ({ commit, dispatch, state }, { workspaceId, applicationId }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/access-control/saml-target-organization/${applicationId}/login/`).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const getUserACL = ({ commit, dispatch, state }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/access-control/user-acl/`).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchVendorRoles = ({ commit, dispatch, state }, filters) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/vendor-role/`, { params: filters }).then(response => {
      const results = filters.hasOwnProperty('page_size') && filters.page_size === 0
        ? response.data.data : response.data.data.results
      const count = filters.hasOwnProperty('page_size') && filters.page_size === 0
        ? response.data.data.length : response.data.data.count

      commit(types.SET_VENDOR_ROLES, { items: results, filters })
      commit(types.SET_VENDOR_ROLES_COUNT, count)

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchVendorRole = ({ commit, dispatch, state }, { id, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/vendor-role/${id}/`, { params: filters }).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const createVendorRole = ({ commit, dispatch, state }, data) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/vendor-role/`, data).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const updateVendorRole = ({ commit, dispatch, state }, { id, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${API_URL}/vendor-role/${id}/`, data).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const deleteVendorRole = ({ commit, dispatch, state }, { id }) => {
  return new Promise((resolve, reject) => {
    axios.delete(`${API_URL}/vendor-role/${id}/`).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const updateVendorRoleInList = ({ commit, dispatch, state }, vendorRole) => {
  commit(types.UPDATE_VENDOR_ROLE_IN_LIST, vendorRole)
}

export const updateUserVendorRoleInList = ({ commit, dispatch, state }, userVendorRole) => {
  commit(types.UPDATE_USER_VENDOR_ROLE_IN_LIST, userVendorRole)
}

export const fetchUserVendorRoles = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/access-control/user-vendor-role/`, { params: filters }).then(response => {
      commit(types.SET_USER_VENDOR_ROLES, { items: response.data.data.results, filters })
      commit(types.SET_USER_VENDOR_ROLES_COUNT, response.data.data.count)

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchUserVendorRole = ({ commit, dispatch, state }, { workspaceId, id, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/access-control/user-vendor-role/${id}/`, { params: filters }).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const createUserVendorRole = ({ commit, dispatch, state }, { workspaceId, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/${workspaceId}/access-control/user-vendor-role/`, data).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const updateUserVendorRole = ({ commit, dispatch, state }, { workspaceId, id, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${API_URL}/workspace/${workspaceId}/access-control/user-vendor-role/${id}/`, data).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const deleteUserVendorRole = ({ commit, dispatch, state }, { workspaceId, id }) => {
  return new Promise((resolve, reject) => {
    axios.delete(`${API_URL}/workspace/${workspaceId}/access-control/user-vendor-role/${id}/`).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const removeUserFromUserVendorRole = ({ commit, dispatch, state }, { workspaceId, id, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/${workspaceId}/access-control/user-vendor-role/${id}/user-removal/`, data).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const configureSAMLIDP = ({ commit, dispatch, state }, { workspaceId, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/${workspaceId}/access-control/saml-idp-configuration/`, data).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const disconnectSAMLIDP = ({ commit, dispatch, state }, { workspaceId, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/${workspaceId}/access-control/saml-idp-configuration/removal/`, data).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchSAMLUsers = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/access-control/saml-user/`, { params: filters }).then(response => {
      const results = filters.hasOwnProperty('page_size') && filters.page_size === 0
        ? response.data.data : response.data.data.results
      const count = filters.hasOwnProperty('page_size') && filters.page_size === 0
        ? response.data.data.length : response.data.data.count

      commit(types.SET_SAML_USERS, { items: results, filters })
      commit(types.SET_SAML_USERS_COUNT, count)

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const removeSAMLUser = ({ commit, dispatch, state }, { workspaceId, id }) => {
  return new Promise((resolve, reject) => {
    axios.delete(`${API_URL}/workspace/${workspaceId}/access-control/saml-user/${id}/`).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchSAMLUserOrganizations = ({ commit, dispatch, state }, { workspaceId, id }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/access-control/saml-user/${id}/connected-organizations/`).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const assignSAMLUserToACLs = ({ commit, dispatch, state }, { workspaceId, id, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/${workspaceId}/access-control/saml-user/${id}/vendor-role-assignment/`, data).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const inviteSAMLUser = ({ commit, dispatch, state }, { workspaceId, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/${workspaceId}/access-control/saml-user/invitation/`, data).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchMerakiUsers = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  const noCommit = filters.noCommit
  delete filters.noCommit

  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/user/`, { params: filters }).then(response => {
      if (!noCommit) {
        const results = filters.hasOwnProperty('page_size') && filters.page_size === 0
          ? response.data.data : response.data.data.results
        const count = filters.hasOwnProperty('page_size') && filters.page_size === 0
          ? response.data.data.length : response.data.data.count

        commit(types.SET_MERAKI_USERS, { items: results, filters })
        commit(types.SET_MERAKI_USERS_COUNT, count)
      }

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchMerakiUser = ({ commit, dispatch, state }, { workspaceId, id }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/user/${id}/`).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const updateMerakiUserOrganizations = ({ commit, dispatch, state }, { workspaceId, id, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${API_URL}/workspace/${workspaceId}/meraki/user/${id}/organizations/`, data).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchMerakiUserConnectedOrganizations = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/user/connected-organizations/`, { params: filters }).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchMerakiOrganizationUsers = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/organization-user/`, { params: filters }).then(response => {
      commit(types.SET_MERAKI_ORGANIZATION_USERS, { items: response.data.data.results, filters })
      commit(types.SET_MERAKI_ORGANIZATION_USERS_COUNT, response.data.data.count)

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchMerakiOrganizationUser = ({ commit, dispatch, state }, { workspaceId, id }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/organization-user/${id}/`).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const inviteMerakiOrganizationUsers = ({ commit, dispatch, state }, { workspaceId, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/${workspaceId}/meraki/organization-user/invitation/`, data).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const deleteMerakiOrganizationUsers = ({ commit, dispatch, state }, { workspaceId, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/${workspaceId}/meraki/organization-user/removal/`, data).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const updateMerakiOrganizationUser = ({ commit, dispatch, state }, { workspaceId, id, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${API_URL}/workspace/${workspaceId}/meraki/organization-user/${id}/`, data).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const deleteMerakiOrganizationUser = ({ commit, dispatch, state }, { workspaceId, id }) => {
  return new Promise((resolve, reject) => {
    axios.delete(`${API_URL}/workspace/${workspaceId}/meraki/organization-user/${id}/`).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const resendMerakiOrganizationUserInvitation = ({ commit, dispatch, state }, { workspaceId, id }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/${workspaceId}/meraki/organization-user/${id}/invitation-message/`).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchMerakiOrganizationUserInvitationExistingPairs = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/organization-user/existing-pairs/`, { params: filters }).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}
