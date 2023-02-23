import _ from 'lodash'
import mutations from './mutations'
import Ls from '@/services/ls'
import * as actions from './actions'
import * as getters from './getters'

import menu from '@/components/layout/menu.js'
import toolbarMenu from '@/components/layout/menu-toolbar.js'

const initialState = {
  userWorkspaces: [],
  userWorkspaceOrganizations: [],
  userOrganizationNodes: [],
  selectedWorkspace: {
    id: null
  },
  selectedOrganization: {
    id: null
  },
  selectedNode: {},
  userWorkspaceOrganizationsFetched: false,
  selectedWorkspaceDataFetched: false,
  selectedOrganizationDataFetched: false,
  selectedNodeDataFetched: false,
  activeProductIndex: Number.isInteger(Ls.getJson('layout.state', {}).activeProductIndex)
    ? Ls.getJson('layout.state', {}).activeProductIndex : 1,
  menu: menu,
  toolbarMenu: toolbarMenu
}

export default {
  namespaced: true,

  initialState: _.cloneDeep(initialState),
  state: initialState,
  getters,
  actions,
  mutations
}
