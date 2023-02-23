import _ from 'lodash'
import mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'
import * as modules from './modules'

const initialState = {
  organizations: [],
  selectedOrgPermissions: [],
  splashPages: []
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
