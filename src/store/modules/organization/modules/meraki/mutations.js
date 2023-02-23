import * as types from './mutation-types'

const mutations = {

  [types.UPDATE_MERAKI_ORGANIZATIONS] (state, merakiOrganizations) {
    state.merakiOrganizations = merakiOrganizations
  },

  [types.UPDATE_MERAKI_ADMINS] (state, merakiAdmins) {
    state.merakiAdmins = merakiAdmins
  },

  [types.UPDATE_MERAKI_NETWORKS] (state, { merakiNetworks, filters }) {
    // API response structure is different when page size is 0
    if (filters.hasOwnProperty('page_size') && filters.page_size === 0) {
      state.merakiNetworks = {
        data: {
          results: merakiNetworks.data
        }
      }
    } else if (filters.hasOwnProperty('page') && filters.page !== 1) {
      // Loading next page, push results to existing state
      if (state.merakiNetworks && state.merakiNetworks.data) {
        merakiNetworks.data.results.forEach(result => {
          state.merakiNetworks.data.results.push(result)
        })
      } else {
        state.merakiNetworks = merakiNetworks
      }
    } else {
      state.merakiNetworks = merakiNetworks
    }
  },

  [types.UPDATE_ASSOCIATED_SITES] (state, associatedSites) {
    state.associatedSites = associatedSites
  },

  [types.UPDATE_ASSOCIATED_SITES_COUNT] (state, count) {
    state.associatedSitesCount = count
  },

  [types.UPDATE_MERAKI_CONFIG_TEMPLATES] (state, { merakiConfigTemplates, filters }) {
    // API response structure is different when page size is 0
    if (filters.hasOwnProperty('page_size') && filters.page_size === 0) {
      state.merakiConfigTemplates = {
        data: {
          results: merakiConfigTemplates.data
        }
      }
    } else {
      state.merakiConfigTemplates = merakiConfigTemplates
    }
  },

  [types.UPDATE_MERAKI_NETWORK_BASES] (state, { merakiNetworkBases, filters }) {
    // API response structure is different when page size is 0
    if (filters.hasOwnProperty('page_size') && filters.page_size === 0) {
      state.merakiNetworkBases = {
        data: {
          results: merakiNetworkBases.data
        }
      }
    } else {
      state.merakiNetworkBases = merakiNetworkBases
    }
  },

  [types.UPDATE_MERAKI_DEVICES] (state, { merakiDevices, filters }) {
    // API response structure is different when page size is 0
    if (filters.hasOwnProperty('page_size') && filters.page_size === 0) {
      state.merakiDevices = {
        data: {
          results: merakiDevices.data
        }
      }
    } else {
      state.merakiDevices = merakiDevices
    }
  },

  [types.UPDATE_MERAKI_MATCHED_DEVICES] (state, { merakiMatchedDevices, filters }) {
    // API response structure is different when page size is 0
    if (filters.hasOwnProperty('page_size') && filters.page_size === 0) {
      state.merakiMatchedDevices = {
        data: {
          results: merakiMatchedDevices.data
        }
      }
    } else {
      state.merakiMatchedDevices = merakiMatchedDevices
    }
  },

  [types.UPDATE_MERAKI_SKIPPED_DEVICES] (state, { merakiSkippedDevices, filters }) {
    // API response structure is different when page size is 0
    if (filters.hasOwnProperty('page_size') && filters.page_size === 0) {
      state.merakiSkippedDevices = {
        data: {
          results: merakiSkippedDevices.data
        }
      }
    } else {
      state.merakiSkippedDevices = merakiSkippedDevices
    }
  },

  [types.UPDATE_ASSOCIATED_DEVICES] (state, associatedDevices) {
    state.associatedDevices = associatedDevices
  },

  [types.UPDATE_ASSOCIATED_DEVICES_COUNT] (state, count) {
    state.associatedDevicesCount = count
  },

  [types.UPDATE_NETWORK_BASE_SSIDS] (state, { networkId, ssids }) {
    const existingNetworkBase = state.merakiNetworkBases.data.results.filter(networkBase => {
      return networkBase.network_id === networkId
    })[0]

    if (existingNetworkBase) {
      existingNetworkBase.ssids = ssids
    }
  }
}

export default mutations
