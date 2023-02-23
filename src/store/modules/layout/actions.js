import axios from 'axios'
import * as types from './mutation-types'
import Ls from '@/services/ls'
const API_URL = process.env.VUE_APP_API_URL

export const fetchUserWorkspaces = ({ commit, dispatch, state }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/related/`, { params: { page_size: 0 } }).then((response) => {
      commit(types.UPDATE_USER_WORKSPACES, response.data.data)

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchUserWorkspaceOrganizations = ({ commit, dispatch, state }, { workspaceId }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/organization/`, { params: { page_size: 0 }, suppressErrors: true }).then(response => {
      commit(types.UPDATE_USER_WORKSPACE_ORGANIZATIONS, response.data.data)
      commit(types.UPDATE_USER_WORKSPACE_ORGANIZATIONS_LOAD_STATE, true)
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchUserOrganizationNodes = ({ commit, state }, { orgId, filters }) => {
  let params = filters
  if (!params) {
    params = {
      layout: 'tree',
      types: 'organization,group,site'
    }
  }

  const url = `${API_URL}/node/tree/?id=${orgId}`
  return new Promise((resolve, reject) => {
    axios.get(url, { params: params, suppressErrors: true }).then((response) => {
      commit(types.UPDATE_USER_ORGANIZATION_NODES, response.data.data)
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const selectWorkspace = ({ commit, dispatch, state }, workspace) => {
  Ls.updateInJson('layout.state', 'workspace', workspace.id)

  // Clear workspace-dependent state
  commit(types.RESET)

  commit(types.SELECT_WORKSPACE, workspace)
  commit(types.UPDATE_SELECTED_WORKSPACE_STATE, false)
  commit(types.UPDATE_USER_WORKSPACE_ORGANIZATIONS_LOAD_STATE, false)

  // Reset workspace state on workspace change
  dispatch('workspace/resetWorkspaceState', {}, { root: true })

  // Get full workspace object in background
  dispatch('workspace/retrieveWorkspace', { id: workspace.id }, { root: true }).then(response => {
    // Check that the selected workspace is still the same. It may have been changed if this request takes long.
    if (workspace.id === state.selectedWorkspace.id) {
      commit(types.SELECT_WORKSPACE, response.data.data)
      commit(types.UPDATE_SELECTED_WORKSPACE_STATE, true)
    }
  })
}

export const selectOrganization = ({ commit, dispatch, state }, organization) => {
  // Save current organization to local storage
  Ls.updateInJson('layout.state', 'organization', organization.id)

  commit(types.SELECT_ORGANIZATION, organization)
  commit(types.UPDATE_SELECTED_ORGANIZATION_STATE, false)

  // Get full organization object in background
  dispatch('organization/fetchOrganization', organization.id, { root: true }).then(response => {
    // Check that the selected organization is still the same. It may have been changed if this request takes long.
    if (organization.id === state.selectedOrganization.id) {
      commit(types.SELECT_ORGANIZATION, response.data.data)
      commit(types.UPDATE_SELECTED_ORGANIZATION_STATE, true)

      // If selected workspace is not organization's parent workspace, update selected workspace
      if (state.selectedWorkspace.id !== response.data.data.parent_workspace) {
        dispatch('layout/selectWorkspace', { id: response.data.data.parent_workspace }, { root: true })
      }
    }
  })
}

export const selectNode = ({ commit, dispatch, state }, node) => {
  commit(types.SELECT_NODE, node)
  commit(types.UPDATE_SELECTED_NODE_STATE, false)

  // Get full node object in background
  dispatch('organization/node/retrieveNode', { nodeId: node.id }, { root: true }).then(response => {
    // Check that the selected organization is still the same. It may have been changed if this request takes long.
    if (node.id === state.selectedNode.id) {
      // If selected node is not a member of selected organization, select organization root node
      if (state.userOrganizationNodes.map(node => node.id).indexOf(response.data.data.id) === -1 &&
        response.data.data.id !== state.selectedOrganization.id) {
        // Set correction field to true so that watcher on mainLayout can detect correction and redirect to new node page
        dispatch('layout/selectNode', { id: state.selectedOrganization.id, correction: true }, { root: true })
      } else {
        commit(types.SELECT_NODE, response.data.data)
        commit(types.UPDATE_SELECTED_NODE_STATE, true)
      }
    }
  })
}

export const updateSelectedOrganization = ({ commit, dispatch, state }, organization) => {
  if (organization.id === state.selectedOrganization.id) {
    commit(types.SELECT_ORGANIZATION, organization)
  }

  // Update in list as well
  commit(types.UPDATE_ORGANIZATION_IN_LIST, organization)
}

export const updateSelectedNode = ({ commit, dispatch, state }, node) => {
  if (node.id === state.selectedNode.id) {
    commit(types.SELECT_NODE, node)
  }
}

export const updateSelectedWorkspace = ({ commit, dispatch, state }, workspace) => {
  if (workspace.id === state.selectedWorkspace.id) {
    commit(types.SELECT_WORKSPACE, workspace)
  }

  // Update in list as well
  commit(types.UPDATE_WORKSPACE_IN_LIST, workspace)
}

export const clearWorkspaceSelections = ({ commit, dispatch, state }) => {
  Ls.updateInJson('layout.state', 'workspace', null)

  commit(types.SELECT_WORKSPACE, { id: null })
}

export const clearOrganizationSelections = ({ commit, dispatch, state }) => {
  Ls.updateInJson('layout.state', 'organization', null)

  commit(types.SELECT_ORGANIZATION, { id: null })
  commit(types.SELECT_NODE, { })
}

export const setActiveProductIndex = ({ commit, dispatch, state }, index) => {
  Ls.updateInJson('layout.state', 'activeProductIndex', index)

  commit(types.SET_ACTIVE_PRODUCT_INDEX, index)
}

export const updateRootNodeInList = ({ commit, dispatch, state }, node) => {

}
