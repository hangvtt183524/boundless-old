import * as types from './mutation-types'

const mutations = {
  [types.SET_SELECTED_NODE_PERMISSIONS] (state, permissions) {
    state.selectedNodePermissions = permissions
  },
  [types.SET_ALL_NODES] (state, nodes) {
    state.allNodes = nodes
  },
  [types.SET_SPONSOR_REQUEST_LIST] (state, sponsors) {
    state.sponsorRequestList = sponsors
  }
}

export default mutations
