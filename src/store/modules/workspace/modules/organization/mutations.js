import * as types from './mutation-types'
import Vue from 'vue'

const mutations = {

  [types.SET_WORKSPACE_ORGANIZATIONS] (state, organizations) {
    state.workspaceOrganizations = organizations
  },

  [types.REMOVE_WORKSPACE_ORGANIZATION] (state, workspaceOrganizationId) {
    const existingWorkspaceOrganization = state.workspaceOrganizations.find(item => {
      return item.id === parseInt(workspaceOrganizationId)
    })
    if (existingWorkspaceOrganization) {
      state.workspaceOrganizations.splice(state.workspaceOrganizations.indexOf(existingWorkspaceOrganization), 1)
    }
  },

  [types.UPDATE_WORKSPACE_ORGANIZATION_IN_LIST] (state, organization) {
    const workspaceOrganization = state.workspaceOrganizations.find(workspaceOrganization => workspaceOrganization.id === organization.id)
    if (workspaceOrganization) {
      // Update workspace organization name and Meraki organization data
      Vue.set(workspaceOrganization, 'name', organization.name)
      Vue.set(workspaceOrganization, 'meraki_organization', organization.meraki_organization)
    }
  }

}

export default mutations
