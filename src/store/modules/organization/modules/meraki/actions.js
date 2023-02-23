import axios from 'axios'
import router from '@/router'

import * as types from './mutation-types'

const API_URL = process.env.VUE_APP_API_URL

export const fetchApiKeyOrganizations = ({ commit, dispatch, state }, { ...data }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/meraki/api-key-organization/`, data).then((response) => {
      commit(types.UPDATE_MERAKI_ORGANIZATIONS, response.data)
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const synchronizeMerakiOrganization = ({ commit, state }, { organizationId, ...payload }) => {
  const url = `${API_URL}/organization/${organizationId}/meraki/organization/synchronization/`
  return new Promise((resolve, reject) => {
    axios.post(url, payload).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const deRegisterMerakiOrganization = ({ commit, dispatch, state }, { organizationId, ...payload }) => {
  const url = `${API_URL}/organization/${organizationId}/meraki/organization/de-registration/`
  return new Promise((resolve, reject) => {
    axios.post(url, payload).then((response) => {
      resolve(response)

      // Re-fetch current organization as settings state might have changed
      dispatch('organization/fetchOrganization', router.currentRoute.params.orgId, { root: true })
    }).catch((err) => {
      reject(err)
    })
  })
}

export const setMerakiOrganizationStrictSynchronization = ({ commit, dispatch, state }, { organizationId, ...payload }) => {
  const url = `${API_URL}/organization/${organizationId}/meraki/organization/strict-synchronization/`
  return new Promise((resolve, reject) => {
    axios.patch(url, payload).then((response) => {
      // store.dispatch('organization/updateMerakiOrganizationStrictSynchronization', response.data.data.strict_synchronization)

      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const fetchMerakiAdmins = ({ commit, dispatch, state }, { organizationId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/organization/${organizationId}/meraki/organization/administrators/`, { params: filters }).then((response) => {
      commit(types.UPDATE_MERAKI_ADMINS, response.data)
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchNetworks = ({ commit, dispatch, state }, { organizationId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/organization/${organizationId}/meraki/network/`, { params: filters }).then((response) => {
      commit(types.UPDATE_MERAKI_NETWORKS, {
        merakiNetworks: response.data,
        filters: filters
      })
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchAssociatedSites = ({ commit, dispatch, state }, { organizationId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/organization/${organizationId}/meraki/network/associated-entities/`, { params: filters }).then((response) => {
      commit(types.UPDATE_ASSOCIATED_SITES, response.data.data.results)
      commit(types.UPDATE_ASSOCIATED_SITES_COUNT, response.data.data.count)

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchConfigTemplates = ({ commit, dispatch, state }, { organizationId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/organization/${organizationId}/meraki/network/`, { params: filters }).then((response) => {
      commit(types.UPDATE_MERAKI_NETWORKS, {
        merakiNetworks: response.data,
        filters: filters
      })
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchNetworkBases = ({ commit, dispatch, state }, { organizationId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/organization/${organizationId}/meraki/network-base/`, { params: filters }).then((response) => {
      commit(types.UPDATE_MERAKI_NETWORK_BASES, {
        merakiNetworkBases: response.data,
        filters: filters
      })
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchNetworkBasesSimple = ({ commit, dispatch, state }, { organizationId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/organization/${organizationId}/meraki/network-base/simple/`, { params: filters }).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchNetworkSSIDs = ({ commit, dispatch, state }, { organizationId, networkId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/organization/${organizationId}/meraki/network/${networkId}/ssid/`, { params: filters }).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const bulkUpdateNetworkSSIDs = ({ commit, dispatch, state }, { organizationId, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${API_URL}/organization/${organizationId}/meraki/ssid/bulk/`, data.payload).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const configureWifiForSSIDs = ({ commit, dispatch, state }, { organizationId, ...payload }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/organization/${organizationId}/meraki/ssid/wifi-configuration/`, payload).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const synchronizeNetworkSSIDs = ({ commit, dispatch, state }, { organizationId, networkId }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/organization/${organizationId}/meraki/network/${networkId}/ssid/synchronization/`).then((response) => {
      commit(types.UPDATE_NETWORK_BASE_SSIDS, {
        networkId: networkId,
        ssids: response.data.data
      })
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const getNetworkAlertSettings = ({ commit, dispatch, state }, { organizationId, networkId }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/organization/${organizationId}/meraki/network-base/${networkId}/alert-settings/`).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const deployAlertsSettings = ({ commit, state }, { organizationId, ...payload }) => {
  const url = `${API_URL}/organization/${organizationId}/meraki/alert/deployment/`
  return new Promise((resolve, reject) => {
    axios.post(url, payload).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const saveHttpServers = ({ commit, state }, { organizationId, networkId, ...payload }) => {
  const url = `${API_URL}/organization/${organizationId}/meraki/network/${networkId}/http-server/`
  return new Promise((resolve, reject) => {
    axios.post(url, payload).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}
