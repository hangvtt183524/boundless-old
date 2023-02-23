import * as types from './mutation-types'
import Vue from 'vue'

const mutations = {

  [types.UPDATE_MERAKI_TEMPLATES] (state, { items, filters }) {
    if (filters.hasOwnProperty('page') && filters.page !== 1) {
      // Loading next page, push results to existing state
      items.forEach(result => {
        state.merakiTemplates.push(result)
      })
    } else {
      state.merakiTemplates = items
    }
  },

  [types.UPDATE_MERAKI_TEMPLATES_COUNT] (state, count) {
    state.merakiTemplatesCount = count
  },

  [types.UPDATE_MERAKI_TEMPLATE_IN_LIST] (state, item) {
    const index = state.merakiTemplates.findIndex(listItem => listItem.id === item.id)

    if (index > -1) {
      Vue.set(state.merakiTemplates, index, item)
    } else {
      state.merakiTemplates.push(item)
    }
  },

  [types.UPDATE_TRAFFIC_SHAPING_APPLICATION_CATEGORIES] (state, items) {
    state.trafficShapingApplicationCategories = items
  },

  [types.UPDATE_TRAFFIC_SHAPING_DSCP_TAGS] (state, items) {
    state.trafficShapingDscpTags = items
  },

  [types.UPDATE_CONTENT_FILTERING_CATEGORIES] (state, items) {
    state.contentFilteringCategories = items
  },

  [types.UPDATE_L7_APPLICATION_CATEGORIES] (state, l7ApplicationCategories) {
    state.l7ApplicationCategories = l7ApplicationCategories
  },

  [types.UPDATE_MERAKI_NETWORK_CREATION_FLOWS] (state, { items, filters }) {
    if (filters.hasOwnProperty('page') && filters.page !== 1) {
      // Loading next page, push results to existing state
      items.forEach(result => {
        state.merakiNetworkCreationFlows.push(result)
      })
    } else {
      state.merakiNetworkCreationFlows = items
    }
  },

  [types.UPDATE_MERAKI_NETWORK_CREATION_FLOWS_COUNT] (state, count) {
    state.merakiNetworkCreationFlowsCount = count
  },

  [types.UPDATE_MERAKI_NETWORK_CREATION_STEPS] (state, { items, filters }) {
    if (filters.hasOwnProperty('page') && filters.page !== 1) {
      // Loading next page, push results to existing state
      items.forEach(result => {
        state.merakiNetworkCreationSteps.push(result)
      })
    } else {
      state.merakiNetworkCreationSteps = items
    }
  },

  [types.UPDATE_MERAKI_SECURITY_COMPLIANCE_RULE_SETS] (state, { items, filters }) {
    if (filters.hasOwnProperty('page') && filters.page !== 1) {
      // Loading next page, push results to existing state
      items.forEach(result => {
        state.merakiSecurityComplianceRuleSets.push(result)
      })
    } else {
      state.merakiSecurityComplianceRuleSets = items
    }
  },

  [types.UPDATE_MERAKI_SECURITY_COMPLIANCE_RULE_SETS_COUNT] (state, count) {
    state.merakiSecurityComplianceRuleSetsCount = count
  },

  [types.UPDATE_MERAKI_NAME_COMPLIANCE_CHECKS] (state, { items, filters }) {
    if (filters.hasOwnProperty('page') && filters.page !== 1) {
      // Loading next page, push results to existing state
      items.forEach(result => {
        state.merakiNameComplianceChecks.push(result)
      })
    } else {
      state.merakiNameComplianceChecks = items
    }
  },

  [types.UPDATE_MERAKI_NAME_COMPLIANCE_CHECKS_COUNT] (state, count) {
    state.merakiNameComplianceChecksCount = count
  },

  [types.UPDATE_MERAKI_NAME_COMPLIANCE_RULE_SETS] (state, { items, filters }) {
    if (filters.hasOwnProperty('page') && filters.page !== 1) {
      // Loading next page, push results to existing state
      items.forEach(result => {
        state.merakiNameComplianceRuleSets.push(result)
      })
    } else {
      state.merakiNameComplianceRuleSets = items
    }
  },

  [types.UPDATE_MERAKI_NAME_COMPLIANCE_RULE_SETS_COUNT] (state, count) {
    state.merakiNameComplianceRuleSetsCount = count
  },

  [types.UPDATE_MERAKI_NAME_COMPLIANCE_RULE_SET_ALERT_COUNTS] (state, { ruleSetId, count }) {
    // If rule set with provided id is currently in store, update its count
    const ruleSet = state.merakiNameComplianceRuleSets.find(item => item.id === ruleSetId)
    if (ruleSet) {
      Vue.set(ruleSet, 'check_count', count)
    }
  },

  [types.UPDATE_MERAKI_CONFIGURATION_COMPLIANCE_CHECKS] (state, { items, filters }) {
    if (filters.hasOwnProperty('page') && filters.page !== 1) {
      // Loading next page, push results to existing state
      items.forEach(result => {
        state.merakiConfigurationComplianceChecks.push(result)
      })
    } else {
      state.merakiConfigurationComplianceChecks = items
    }
  },

  [types.UPDATE_MERAKI_CONFIGURATION_COMPLIANCE_CHECKS_COUNT] (state, count) {
    state.merakiConfigurationComplianceChecksCount = count
  },

  [types.UPDATE_MERAKI_CONFIGURATION_COMPLIANCE_RULE_SETS] (state, { items, filters }) {
    if (filters.hasOwnProperty('page') && filters.page !== 1) {
      // Loading next page, push results to existing state
      items.forEach(result => {
        state.merakiConfigurationComplianceRuleSets.push(result)
      })
    } else {
      state.merakiConfigurationComplianceRuleSets = items
    }
  },

  [types.UPDATE_MERAKI_CONFIGURATION_COMPLIANCE_RULE_SETS_COUNT] (state, count) {
    state.merakiConfigurationComplianceRuleSetsCount = count
  },

  [types.UPDATE_MERAKI_TAGS] (state, { merakiTags, filters }) {
    if (filters.page > 1) {
      state.merakiTags.data.results = [
        ...state.merakiTags.data.results.slice(0, filters.page_size * (filters.page - 1)),
        ...merakiTags.data.results
      ]
    } else {
      state.merakiTags = merakiTags
    }
    state.merakiTagFilter = filters
  },

  [types.UPDATE_MERAKI_TAGGABLE_RESOURCES] (state, { merakiTaggableResources, filters }) {
    if (filters.page > 1) {
      state.merakiTaggableResources.data.results = [
        ...state.merakiTaggableResources.data.results.slice(0, filters.page_size * (filters.page - 1)),
        ...merakiTaggableResources.data.results
      ]
    } else {
      state.merakiTaggableResources = merakiTaggableResources
    }
    state.merakiTaggableResourcesFilter = filters
  },

  [types.UPDATE_MERAKI_TAGGABLE_RESOURCES_FOR_ATAG] (state, { merakiTaggableResourcesForATag, filters }) {
    if (filters.page > 1) {
      state.merakiTaggableResourcesForATag.data.results = [
        ...state.merakiTaggableResourcesForATag.data.results.slice(0, filters.page_size * (filters.page - 1)),
        ...merakiTaggableResourcesForATag.data.results
      ]
    } else {
      state.merakiTaggableResourcesForATag = merakiTaggableResourcesForATag
    }
  },

  [types.UPDATE_MERAKI_NETWORK_BASES] (state, { items, filters }) {
    if (filters.hasOwnProperty('page') && filters.page !== 1) {
      // Loading next page, push results to existing state
      items.forEach(result => {
        state.merakiNetworkBases.push(result)
      })
    } else {
      state.merakiNetworkBases = items
    }
  },

  [types.UPDATE_MERAKI_NETWORK_BASES_COUNT] (state, count) {
    state.merakiNetworkBasesCount = count
  },

  [types.UPDATE_MERAKI_CLIENTS] (state, { clients, filters }) {
    if (filters.hasOwnProperty('page') && filters.page !== 1) {
      // Loading next page, push results to existing state
      clients.forEach(result => {
        state.merakiClients.push(result)
      })
    } else {
      state.merakiClients = clients
    }
  },

  [types.UPDATE_MERAKI_CLIENTS_COUNT] (state, count) {
    state.merakiClientsCount = count
  },

  [types.UPDATE_MERAKI_CLIENT_EVENTS] (state, { items, filters }) {
    if (filters.hasOwnProperty('page') && filters.page !== 1) {
      // Loading next page, push results to existing state
      items.forEach(result => {
        state.merakiClientEvents.push(result)
      })
    } else {
      state.merakiClientEvents = items
    }
  },

  [types.UPDATE_MERAKI_CLIENT_EVENTS_COUNT] (state, count) {
    state.merakiClientEventsCount = count
  },

  [types.UPDATE_MERAKI_CLIENT_TRAFFIC_HISTORY] (state, { items, filters }) {
    if (filters.hasOwnProperty('page') && filters.page !== 1) {
      // Loading next page, push results to existing state
      items.forEach(result => {
        state.merakiClientTrafficHistory.push(result)
      })
    } else {
      state.merakiClientTrafficHistory = items
    }
  },

  [types.UPDATE_MERAKI_CLIENT_TRAFFIC_HISTORY_COUNT] (state, count) {
    state.merakiClientTrafficHistoryCount = count
  },

  [types.UPDATE_MERAKI_CLIENT_USAGE_HISTORY] (state, { items, filters }) {
    if (filters.hasOwnProperty('page') && filters.page !== 1) {
      // Loading next page, push results to existing state
      items.forEach(result => {
        state.merakiClientUsageHistory.push(result)
      })
    } else {
      state.merakiClientUsageHistory = items
    }
  },

  [types.UPDATE_MERAKI_CLIENT_USAGE_HISTORY_COUNT] (state, count) {
    state.merakiClientUsageHistoryCount = count
  },

  [types.UPDATE_MERAKI_CLIENT_LATENCY_HISTORY] (state, { items, filters }) {
    if (filters.hasOwnProperty('page') && filters.page !== 1) {
      // Loading next page, push results to existing state
      items.forEach(result => {
        state.merakiClientLatencyHistory.push(result)
      })
    } else {
      state.merakiClientLatencyHistory = items
    }
  },

  [types.UPDATE_MERAKI_CLIENT_LATENCY_HISTORY_COUNT] (state, count) {
    state.merakiClientLatencyHistoryCount = count
  },

  [types.UPDATE_MERAKI_MONITORING_DEVICES] (state, { items, filters }) {
    if (filters.hasOwnProperty('page') && filters.page !== 1) {
      // Loading next page, push results to existing state
      items.forEach(result => {
        state.merakiMonitoringDevices.push(result)
      })
    } else {
      state.merakiMonitoringDevices = items
    }
  },

  [types.UPDATE_MERAKI_MONITORING_DEVICES_COUNT] (state, count) {
    state.merakiMonitoringDevicesCount = count
  },

  [types.UPDATE_MERAKI_DEVICE_CONNECTION_HISTORY] (state, { items, filters }) {
    if (filters.hasOwnProperty('page') && filters.page !== 1) {
      // Loading next page, push results to existing state
      items.forEach(result => {
        state.merakiDeviceConnectionHistory.push(result)
      })
    } else {
      state.merakiDeviceConnectionHistory = items
    }
  },

  [types.UPDATE_MERAKI_DEVICE_CONNECTION_HISTORY_COUNT] (state, count) {
    state.merakiDeviceConnectionHistoryCount = count
  },

  [types.UPDATE_MERAKI_DEVICE_LATENCY_HISTORY] (state, { items, filters }) {
    if (filters.hasOwnProperty('page') && filters.page !== 1) {
      // Loading next page, push results to existing state
      items.forEach(result => {
        state.merakiDeviceLatencyHistory.push(result)
      })
    } else {
      state.merakiDeviceLatencyHistory = items
    }
  },

  [types.UPDATE_MERAKI_DEVICE_LATENCY_HISTORY_COUNT] (state, count) {
    state.merakiDeviceLatencyHistoryCount = count
  },

  [types.UPDATE_MERAKI_MONITORING_SWITCH_PORTS] (state, { items, filters }) {
    state.merakiMonitoringSwitchPorts = items
  },

  [types.UPDATE_MERAKI_MONITORING_SWITCH_PORTS_COUNT] (state, count) {
    state.merakiMonitoringSwitchPortsCount = count
  },

  [types.UPDATE_MERAKI_MONITORING_SWITCH_PORTS_NETWORKS] (state, { items, filters }) {
    state.merakiMonitoringSwitchPortsNetworks = items
  },

  [types.UPDATE_MERAKI_MONITORING_SWITCH_PORTS_NETWORKS_COUNT] (state, count) {
    state.merakiMonitoringSwitchPortsNetworksCount = count
  },

  [types.UPDATE_MERAKI_MONITORING_SWITCH_PORTS_DEVICES] (state, { items, filters }) {
    state.merakiMonitoringSwitchPortsDevices = items
  },

  [types.UPDATE_MERAKI_MONITORING_SWITCH_PORTS_DEVICES_COUNT] (state, count) {
    state.merakiMonitoringSwitchPortsDevicesCount = count
  },

  [types.UPDATE_DASHBOARD_ENTITIES] (state, { items, filters }) {
    if (filters.hasOwnProperty('page') && filters.page !== 1) {
      // Loading next page, push results to existing state
      items.forEach(result => {
        state.dashboardEntities.push(result)
      })
    } else {
      state.dashboardEntities = items
    }
  },

  [types.UPDATE_DASHBOARDS] (state, { items, filters }) {
    if (filters.hasOwnProperty('page') && filters.page !== 1) {
      // Loading next page, push results to existing state
      items.forEach(result => {
        state.dashboards.push(result)
      })
    } else {
      state.dashboards = items
    }
  },

  [types.UPDATE_DASHBOARDS_COUNT] (state, count) {
    state.dashboardsCount = count
  },

  [types.UPDATE_DASHBOARD_PARAMETER_OPTIONS] (state, { name, organization, status, options }) {
    const existingOptions = state.dashboardParameterOptions.find(
      option => option.name === name && option.organization === organization
    )
    if (existingOptions) {
      state.dashboardParameterOptions.splice(state.dashboardParameterOptions.indexOf(existingOptions), 1, {
        name,
        organization,
        status,
        options
      })
    } else {
      state.dashboardParameterOptions.push({
        name,
        organization,
        status,
        options
      })
    }
  },

  [types.UPDATE_USER_DASHBOARDS] (state, { nodeId, items }) {
    Vue.set(state.userDashboards, nodeId, items)
  },

  [types.UPDATE_ASSOCIATED_DEVICES] (state, associatedDevices) {
    state.associatedDevices = associatedDevices
  },

  [types.UPDATE_ASSOCIATED_DEVICES_COUNT] (state, count) {
    state.associatedDevicesCount = count
  }

}

export default mutations
