import _ from 'lodash'
import mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'

const initialState = {
  permissionEntities: [],
  applications: [],
  applicationsCount: 0,
  vendorRoles: [],
  vendorRolesCount: [],
  userVendorRoles: [],
  userVendorRolesCount: [],
  samlUsers: [],
  samlUsersCount: 0,
  merakiUsers: [],
  merakiUsersCount: 0,
  merakiOrganizationUsers: [],
  merakiOrganizationUsersCount: 0
}

export default {
  namespaced: true,

  initialState: _.cloneDeep(initialState),

  state: initialState,

  getters,

  actions,

  mutations
}
