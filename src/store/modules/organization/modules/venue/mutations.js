import * as types from './mutation-types'

const mutations = {

  [types.UPDATE_TREE] (state, tree) {
    state.currentOrgTree = tree
  },

  [types.UPDATE_SELECTED_ITEMS] (state, item) {
    state.selectedItems = item
  },

  [types.TOGGLE_DELETE_DIALOG] (state) {
    state.showDeleteDialog = !state.showDeleteDialog
  },

  [types.TOGGLE_MOVE_DIALOG] (state) {
    state.showMoveDialog = !state.showMoveDialog
  },

  [types.UPDATE_TREE_LOADING] (state, loading) {
    state.isTreeLoading = loading
  },

  [types.UPDATE_ADD_USER_DIALOG] (state, modalState) {
    state.showAddUserDialog = modalState
  },

  [types.UPDATE_ADD_GROUP_DIALOG] (state, modalState) {
    state.showAddGroupDialog = modalState
  },

  [types.SET_ALL_NOTES] (state, allNodes) {
    state.allNodes = allNodes
  }
}

export default mutations
