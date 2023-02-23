import _ from 'lodash'
import mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'

const initialState = {
  allUsers: [],
  allUsersCount: 0,
  user: {},
  currentUser: {
    permissions: [],
    roles: []
  },
  userOptions: {},

  showContactFlag: false
}

export default {
  namespaced: true,

  initialState: _.cloneDeep(initialState),

  state: initialState,

  getters,

  actions,

  mutations
}
