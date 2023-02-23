import _ from 'lodash'
import mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'
import * as modules from './modules'

const initialState = {
  workspaces: [],
  workspacesCount: 0,
  pendingWorkspaceInvitationId: null,
  externalApiKeys: [],
  externalApiKeysCount: 0,
  externalApiKeyOrganizations: [],
  externalApiKeyOrganizationsCount: 0,
  manageableOrganizations: [],
  manageableOrganizationsCount: 0,
  activityLogs: [],
  activityLogsCount: 0,
  userSecurityChecks: {},
  hasApiKeys: null
}

export default {
  namespaced: true,

  initialState: _.cloneDeep(initialState),
  state: initialState,
  getters,
  actions,
  mutations,

  modules
}
