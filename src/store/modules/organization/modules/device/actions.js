import axios from 'axios'
import router from '@/router'

import * as types from './mutation-types'

const API_URL = process.env.VUE_APP_API_URL

export const fetchMerakiOrgs = ({ commit, state }, orgId) => {
  const url = `${API_URL}/organization/${orgId}/import/meraki/organizations/`
  return new Promise((resolve, reject) => {
    axios.get(url).then((response) => {
      commit(types.SET_MERAKI_ORGS, response.data.data)
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const fetchDevices = ({ commit, state }, filters) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/device/`, { params: filters }).then((response) => {
      commit(types.SET_ALL_DEVICES, {
        allDevices: response.data.data.results,
        filters
      })
      commit(types.SET_ALL_DEVICES_COUNT, response.data.data.count)

      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const getDeviceIds = ({ commit, state }, filters) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/device/ids/`, { params: filters }).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const downloadDevices = ({ commit, state }, { type, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/device.${type}`, { params: filters }).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const fetchDevice = ({ commit, state }, deviceId) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/device/${deviceId}/`).then((response) => {
      commit(types.SET_DEVICE, response.data.data)
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const fetchDeviceVendors = ({ commit, state }) => {
  const url = `${API_URL}/devicevendor/`
  return new Promise((resolve, reject) => {
    axios.get(url).then((response) => {
      commit(types.SET_DEVICE_VENDORS, response.data.data)
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const fetchDeviceImportOptions = ({ commit, state }, orgId) => {
  return new Promise((resolve, reject) => {
    axios.options(
      `${API_URL}/organization/${orgId}/import/custom/load/`
    ).then((response) => {
      commit(types.SET_DEVICE_IMPORT_OPTIONS, response.data)
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const createDevice = ({ commit, dispatch, state }, payload) => {
  const url = `${API_URL}/device/`
  return new Promise((resolve, reject) => {
    axios.post(url, payload).then((response) => {
      resolve(response)

      // Re-fetch current organization as setup state might have changed
      dispatch('organization/fetchOrganization', router.currentRoute.params.orgId, { root: true })
    }).catch((err) => {
      reject(err)
    })
  })
}

export const updateDevice = ({ commit, state }, { id, ...payload }) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${API_URL}/device/${id}/`, payload).then((response) => {
      commit(types.SET_DEVICE, response.data.data)
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const merakiApiImport = ({ commit, dispatch, state }, { orgId, ...payload }) => {
  const url = `${API_URL}/organization/${orgId}/import/meraki/load/`
  return new Promise((resolve, reject) => {
    axios.post(url, payload).then((response) => {
      resolve(response)

      // Re-fetch current organization as setup state might have changed
      dispatch('organization/fetchOrganization', router.currentRoute.params.orgId, { root: true })
    }).catch((err) => {
      reject(err)
    })
  })
}

export const deleteSelectedDevices = ({ commit, dispatch, state }, { deviceIds }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/device/bulk-delete/`, { ids: deviceIds }).then((response) => {
      resolve(response)

      // Re-fetch current organization as setup state might have changed
      dispatch('organization/fetchOrganization', router.currentRoute.params.orgId, { root: true })
    }).catch((err) => {
      reject(err)
    })
  })
}

export const removeSelectedDevice = ({ commit, dispatch, state }, { deviceIds }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/device/bulk-remove-from-site/`, { ids: deviceIds }).then((response) => {
      resolve(response)

      // Re-fetch current organization as setup state might have changed
      dispatch('organization/fetchOrganization', router.currentRoute.params.orgId, { root: true })
    }).catch((err) => {
      reject(err)
    })
  })
}

export const deleteDevice = ({ commit, dispatch, state }, deviceId) => {
  return new Promise((resolve, reject) => {
    axios.delete(`${API_URL}/device/${deviceId}/`).then((response) => {
      resolve(response)

      // Re-fetch current organization as setup state might have changed
      dispatch('organization/fetchOrganization', router.currentRoute.params.orgId, { root: true })
    }).catch((err) => {
      reject(err)
    })
  })
}

export const moveSelectedDevices = ({ commit, state }, { targetNode, deviceIds }) => {
  return new Promise((resolve, reject) => {
    axios.post(
      `${API_URL}/node/bulk-move/`,
      {
        target: targetNode,
        ids: deviceIds
      }
    ).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const addTagsSelectedDevices = ({ commit, state }, { tags, deviceIds }) => {
  return new Promise((resolve, reject) => {
    axios.post(
      `${API_URL}/device/bulk-add-tags/`,
      {
        tags,
        ids: deviceIds
      }
    ).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const csvXlsImport = ({ commit, dispatch, state }, { orgId, formData }) => {
  const url = `${API_URL}/organization/${orgId}/import/custom/load/`
  return new Promise((resolve, reject) => {
    axios.post(url, formData).then((response) => {
      resolve(response)

      // Re-fetch current organization as setup state might have changed
      dispatch('organization/fetchOrganization', router.currentRoute.params.orgId, { root: true })
    }).catch((err) => {
      reject(err)
    })
  })
}
