import _ from 'lodash'
import mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'

const initialState = {
  files: [],
  filesCount: 0,
  filesFilter: {}
}

export default {
  namespaced: true,

  initialState: _.cloneDeep(initialState),

  state: initialState,

  getters,

  actions,

  mutations
}
