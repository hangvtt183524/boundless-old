import * as types from './mutation-types'
import Vue from 'vue'
import _ from 'lodash'
import layoutStore from './index'

const mutations = {

  [types.RESET] (state) {
    const initialState = _.cloneDeep(layoutStore.initialState)
    const dynamicFields = ['userWorkspaceOrganizations']
    dynamicFields.forEach(field => {
      state[field] = initialState[field]
    })
  },

  [types.UPDATE_USER_WORKSPACES] (state, items) {
    state.userWorkspaces = items
  },

  [types.UPDATE_USER_WORKSPACE_ORGANIZATIONS] (state, items) {
    state.userWorkspaceOrganizations = items
  },

  [types.UPDATE_USER_ORGANIZATION_NODES] (state, items) {
    state.userOrganizationNodes = items
  },

  [types.SELECT_WORKSPACE] (state, workspace) {
    state.selectedWorkspace = workspace
  },

  [types.SELECT_ORGANIZATION] (state, organization) {
    state.selectedOrganization = organization
  },

  [types.SELECT_NODE] (state, node) {
    state.selectedNode = node
  },

  [types.UPDATE_USER_WORKSPACE_ORGANIZATIONS_LOAD_STATE] (state, value) {
    state.userWorkspaceOrganizationsFetched = value
  },

  [types.UPDATE_SELECTED_WORKSPACE_STATE] (state, value) {
    state.selectedWorkspaceDataFetched = value
  },

  [types.UPDATE_SELECTED_ORGANIZATION_STATE] (state, value) {
    state.selectedOrganizationDataFetched = value
  },

  [types.UPDATE_SELECTED_NODE_STATE] (state, value) {
    state.selectedNodeDataFetched = value
  },

  [types.UPDATE_WORKSPACE_IN_LIST] (state, workspace) {
    const index = state.userWorkspaces.findIndex(listItem => listItem.id === workspace.id)

    if (index > -1) {
      Vue.set(state.userWorkspaces, index, {
        ...state.userWorkspaces[index],
        name: workspace.name
      })
    }
  },

  [types.UPDATE_ORGANIZATION_IN_LIST] (state, organization) {
    const index = state.userWorkspaceOrganizations.findIndex(listItem => listItem.id === organization.id)

    if (index > -1) {
      Vue.set(state.userWorkspaceOrganizations, index, {
        ...state.userWorkspaceOrganizations[index],
        name: organization.name
      })
    }
  },

  [types.SET_ACTIVE_PRODUCT_INDEX] (state, index) {
    state.activeProductIndex = index
  }

}

export default mutations
