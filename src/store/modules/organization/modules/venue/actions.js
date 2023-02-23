import * as types from './mutation-types'
import axios from 'axios'
import router from '@/router'

const API_URL = process.env.VUE_APP_API_URL

export const fetchCurrentOrgTree = ({ commit, dispatch, state }, filters) => {
  let currentOrg = router.currentRoute.params.orgId

  if (!filters) {
    filters = {
      types: 'organization,group,site'
    }
  }
  const url = `${API_URL}/node/tree/?id=${currentOrg}`
  return new Promise((resolve, reject) => {
    axios.get(url, { params: filters }).then((response) => {
      resolve(response)
      commit(types.UPDATE_TREE, response.data.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export const addGroup = ({ commit, dispatch, state }, group) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/group/`, group).then((response) => {
      return dispatch('fetchCurrentOrgTree')
    }).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const addSite = ({ commit, dispatch, state }, group) => {
  // commit(types.ADD_GROUP, group)
}

export const updateSelectedItems = ({ commit, dispatch, state }, items) => {
  commit(types.UPDATE_SELECTED_ITEMS, items)
}

export const selectAll = ({ commit, dispatch, getters }) => {
  commit(types.UPDATE_SELECTED_ITEMS, getters.flatList)
}

export const deselectAll = ({ commit, dispatch, getters }) => {
  commit(types.UPDATE_SELECTED_ITEMS, [])
}

export const moveSelectedItems = ({ commit, getters, dispatch }, targetNode) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/node/bulk-move/`, {
      target: targetNode,
      ids: getters.selectedItems.map(item => item.id)
    }).then((response) => {
      console.log(response)
      return dispatch('fetchCurrentOrgTree')
    }).then((response) => {
      dispatch('deselectAll')
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const deleteSelectedSites = ({ commit, getters, dispatch }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/site/bulk-delete/`, {
      ids: getters.selectedItems.map(item => item.id)
    }).then((response) => {
      return dispatch('fetchCurrentOrgTree')
    }).then((response) => {
      dispatch('deselectAll')
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const deleteSelectedGroups = ({ commit, getters, dispatch }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/group/bulk-delete/`, {
      ids: getters.selectedItems.map(item => item.id)
    }).then((response) => {
      return dispatch('fetchCurrentOrgTree')
    }).then((response) => {
      dispatch('deselectAll')
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const deleteSelectedDevices = ({ commit, getters, dispatch }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/device/bulk-delete/`, {
      ids: getters.selectedItems.map(item => item.id)
    }).then((response) => {
      return dispatch('fetchCurrentOrgTree')
    }).then((response) => {
      dispatch('deselectAll')
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const deleteSelectedFloors = ({ commit, getters, dispatch }) => {
  return new Promise((resolve, reject) => {
    axios.delete(`${API_URL}/floor/bulk-delete/`, {
      ids: getters.selectedItems.map(item => item.id)
    }).then((response) => {
      return dispatch('fetchCurrentOrgTree')
    }).then((response) => {
      dispatch('deselectAll')
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const toggleDeleteDialog = ({ commit, getters }) => {
  commit(types.TOGGLE_DELETE_DIALOG)
}

export const toggleMoveDialog = ({ commit, getters }) => {
  commit(types.TOGGLE_MOVE_DIALOG)
}

export const setTreeLoading = ({ commit, getters }, loading) => {
  commit(types.UPDATE_TREE_LOADING, loading)
}

export const setAddUserDialog = ({ commit, getters }, modalState) => {
  commit(types.UPDATE_ADD_USER_DIALOG, modalState)
}

export const setAddGroupDialog = ({ commit, getters }, modalState) => {
  commit(types.UPDATE_ADD_GROUP_DIALOG, modalState)
}
