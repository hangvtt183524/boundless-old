import _ from 'lodash'
import mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'

const initialState = {
  merakiNetworks: [],
  associatedSites: [],
  associatedSitesCount: 0,
  merakiConfigTemplates: [],
  merakiNetworkBases: [],
  firewallRuleSets: [],
  merakiOrganizations: [],
  merakiAdmins: [],
  merakiDevices: [],
  merakiMatchedDevices: [],
  merakiSkippedDevices: [],
  associatedDevices: [],
  associatedDevicesCount: 0
}

export default {
  namespaced: true,

  initialState: _.cloneDeep(initialState),

  state: initialState,

  getters,

  actions,

  mutations
}
