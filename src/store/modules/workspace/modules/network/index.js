import _ from 'lodash'
import mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'
import defaultContentFilteringCategories from './data/default-content-filtering-categories.json'

const initialState = {
  merakiTemplates: [],
  merakiTemplatesCount: 0,
  trafficShapingApplicationCategories: [],
  trafficShapingDscpTags: [],
  contentFilteringCategories: [],
  defaultContentFilteringCategories: defaultContentFilteringCategories,
  l7ApplicationCategories: [],
  merakiNetworkCreationFlows: [],
  merakiNetworkCreationFlowsCount: 0,
  merakiNetworkCreationSteps: [],
  merakiSecurityComplianceRuleSets: [],
  merakiSecurityComplianceRuleSetsCount: 0,
  merakiNameComplianceRuleSets: [],
  merakiNameComplianceRuleSetsCount: 0,
  merakiNameComplianceChecks: [],
  merakiNameComplianceChecksCount: 0,
  merakiConfigurationComplianceRuleSets: [],
  merakiConfigurationComplianceRuleSetsCount: 0,
  merakiConfigurationComplianceChecks: [],
  merakiConfigurationComplianceChecksCount: 0,
  merakiTags: [],
  merakiTagFilter: {},
  merakiTaggableResourcesForATag: [],
  merakiTaggableResources: [],
  merakiTaggableResourcesFilter: {},
  merakiNetworkBases: [],
  merakiNetworkBasesCount: 0,
  merakiClients: [],
  merakiClientsCount: 0,
  merakiClientEvents: [],
  merakiClientEventsCount: 0,
  merakiClientTrafficHistory: [],
  merakiClientTrafficHistoryCount: 0,
  merakiClientUsageHistory: [],
  merakiClientUsageHistoryCount: 0,
  merakiClientLatencyHistory: [],
  merakiClientLatencyHistoryCount: 0,
  merakiMonitoringDevices: [],
  merakiMonitoringDevicesCount: 0,
  merakiDeviceConnectionHistory: [],
  merakiDeviceConnectionHistoryCount: 0,
  merakiDeviceLatencyHistory: [],
  merakiDeviceLatencyHistoryCount: 0,
  merakiMonitoringSwitchPorts: [],
  merakiMonitoringSwitchPortsCount: 0,
  merakiMonitoringSwitchPortsNetworks: [],
  merakiMonitoringSwitchPortsNetworksCount: 0,
  merakiMonitoringSwitchPortsDevices: [],
  merakiMonitoringSwitchPortsDevicesCount: 0,
  associatedDevices: [],
  associatedDevicesCount: 0,
  dashboardEntities: [],
  dashboards: [],
  dashboardsCount: 0,
  dashboardParameterOptions: [],
  userDashboards: {}
}

export default {
  namespaced: true,

  initialState: _.cloneDeep(initialState),

  state: initialState,

  getters,

  actions,

  mutations
}
