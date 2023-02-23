import * as types from './mutation-types'
import workspaceStore from './index'
import _ from 'lodash'
import Vue from 'vue'

const mutations = {

  [types.RESET] (state) {
    const initialState = _.cloneDeep(workspaceStore.initialState)
    const dynamicFields = ['externalApiKeys', 'externalApiKeysCount', 'externalApiKeyOrganizations',
      'externalApiKeyOrganizationsCount', 'activityLogs', 'activityLogsCount', 'userSecurityChecks', 'hasApiKeys']
    dynamicFields.forEach(field => {
      state[field] = initialState[field]
    })
  },

  [types.UPDATE_WORKSPACES] (state, { items, filters }) {
    if (filters.hasOwnProperty('page') && filters.page !== 1) {
      // Loading next page, push results to existing state
      items.forEach(result => {
        state.workspaces.push(result)
      })
    } else {
      state.workspaces = items
    }
  },

  [types.UPDATE_WORKSPACES_COUNT] (state, count) {
    state.workspacesCount = count
  },

  [types.SET_PENDING_INVITATION_ID] (state, invitationId) {
    state.pendingWorkspaceInvitationId = invitationId
  },

  [types.UPDATE_EXTERNAL_API_KEYS] (state, { items, filters }) {
    if (filters.hasOwnProperty('page') && filters.page !== 1) {
      // Loading next page, push results to existing state
      items.forEach(result => {
        state.externalApiKeys.push(result)
      })
    } else {
      state.externalApiKeys = items
    }
  },

  [types.UPDATE_EXTERNAL_API_KEYS_COUNT] (state, count) {
    state.externalApiKeysCount = count
  },

  [types.UPDATE_EXTERNAL_API_KEY_IN_LIST] (state, item) {
    const itemIndex = state.externalApiKeys.findIndex(listItem => listItem.id === item.id)

    // Update the node in the root nodes list
    Vue.set(state.externalApiKeys, itemIndex, item)
  },

  [types.UPDATE_EXTERNAL_API_KEY_ORGANIZATIONS] (state, items) {
    state.externalApiKeyOrganizations = items
  },

  [types.UPDATE_EXTERNAL_API_KEY_ORGANIZATIONS_COUNT] (state, count) {
    state.externalApiKeyOrganizationsCount = count
  },

  [types.UPDATE_MANAGEABLE_ORGANIZATIONS] (state, items) {
    state.manageableOrganizations = items
  },

  [types.UPDATE_MANAGEABLE_ORGANIZATIONS_COUNT] (state, count) {
    state.manageableOrganizationsCount = count
  },

  [types.UPDATE_ACTIVITY_LOGS] (state, activityLogs) {
    state.activityLogs = activityLogs
  },

  [types.UPDATE_ACTIVITY_LOGS_COUNT] (state, count) {
    state.activityLogsCount = count
  },

  [types.UPDATE_USER_SECURITY_CHECKS] (state, checkStatus) {
    state.userSecurityChecks = checkStatus
  },

  [types.UPDATE_API_KEY_STATUS] (state, checkStatus) {
    state.hasApiKeys = checkStatus
  }

}

export default mutations
