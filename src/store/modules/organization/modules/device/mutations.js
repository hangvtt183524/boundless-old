import * as types from './mutation-types'

const mutations = {
  [types.SET_MERAKI_ORGS] (state, merakiOrgs) {
    state.merakiOrgs = merakiOrgs
  },
  [types.SET_DEVICE_VENDORS] (state, deviceVendors) {
    state.deviceVendors = deviceVendors
  },
  [types.SET_DEVICE] (state, device) {
    state.device = device
  },
  [types.SET_DEVICE_IMPORT_OPTIONS] (state, deviceImportOptions) {
    state.deviceImportOptions = deviceImportOptions
  },
  [types.SET_ALL_DEVICES] (state, { allDevices, filters }) {
    if (filters.hasOwnProperty('page') && filters.page !== 1) {
      // Loading next page, push results to existing state
      allDevices.forEach(result => {
        state.allDevices.push(result)
      })
    } else {
      state.allDevices = allDevices
    }
  },
  [types.SET_ALL_DEVICES_COUNT] (state, count) {
    state.allDevicesCount = count
  }
}

export default mutations
