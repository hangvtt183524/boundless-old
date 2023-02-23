import _ from 'lodash'
import mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'

const initialState = {
  selectedItems: [],
  showDeleteDialog: false,
  showMoveDialog: false,
  isTreeLoading: false,
  showAddUserDialog: false,
  showAddGroupDialog: false,
  currentOrgTree: [],
  selectedNode: null,
  allNodes: []
  // currentOrgTree: {
  // children: [
  //   {
  //     id: 1,
  //     name: 'Etam Group',
  //     icon: 'business_center',
  //     type: 'organization',
  //     selected: false,
  //     depth: 0,
  //     children: [
  //       {
  //         id: 3,
  //         name: 'Etam France',
  //         icon: 'folder',
  //         type: 'group',
  //         depth: 1,
  //         selected: false,
  //         children: [
  //           {id: 4, name: 'file 1', icon: 'place', depth: 2, type: 'site', selected: false},
  //           {id: 5, name: 'file 3', icon: 'place', depth: 2, type: 'site', selected: false},
  //           {id: 6, name: 'file 3', icon: 'place', depth: 2, type: 'site', selected: false},
  //           {id: 7, name: 'file 4', icon: 'place', depth: 2, type: 'site', selected: false}
  //         ]
  //       },
  //       {
  //         id: 10,
  //         name: 'Etam Romania',
  //         icon: 'folder',
  //         type: 'group',
  //         selected: false,
  //         depth: 1,
  //         children: []
  //       }
  //     ]
  //   }
  // ]
  // }
}

export default {
  namespaced: true,

  initialState: _.cloneDeep(initialState),

  state: initialState,

  getters,

  actions,

  mutations
}
