import * as types from './mutation-types'

const mutations = {

  [types.UPDATE_ORGANIZATIONS] (state, organizations) {
    state.organizations = organizations
  },

  [types.UPDATE_SINGLE_ORGANIZATION] (state, organization) {
    // Update single organization within list of organizations, if exists
    const organizationInstance = state.organizations.filter(organizationItem => {
      return organizationItem.id === organization.id
    })[0]
    if (organizationInstance) {
      state.organizations.splice(state.organizations.indexOf(organizationInstance), 1, organization)
    }
  },

  [types.SET_SELECTED_ORG_PERMISSIONS] (state, selectedOrgPermissions) {
    state.selectedOrgPermissions = selectedOrgPermissions
  },

  [types.SET_SPLASH_PAGES] (state, splashPages) {
    state.splashPages = splashPages
  }

}

export default mutations
