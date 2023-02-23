import { flattenTree, sortNodesAndChildren } from '@/utils/functions'

export const currentOrgTree = (state) => {
  // Clone the tree and sort nodes to make sure sites always come last
  let tempArray = JSON.parse(JSON.stringify(state.currentOrgTree))
  return sortNodesAndChildren(tempArray)
}

export const flatList = (state) => {
  let flatTree = []

  state.currentOrgTree.forEach((item) => {
    flattenTree(item, 'children', flatTree)
  })

  flatTree = flatTree.filter(n => true)
  return global._.sortBy(flatTree, [(o) => { return o.level }])
}

export const selectedItems = (state) => state.selectedItems
export const showDeleteDialog = (state) => state.showDeleteDialog
export const showMoveDialog = (state) => state.showMoveDialog
export const showAddUserDialog = (state) => state.showAddUserDialog
export const showAddGroupDialog = (state) => state.showAddGroupDialog
export const isTreeLoading = (state) => state.isTreeLoading
export const selectedNode = (state) => state.selectedNode
export const allNodes = (state) => state.allNodes
