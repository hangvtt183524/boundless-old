import _ from 'lodash'
import * as actions from './actions'

const initialState = {
}

export default {
  namespaced: true,

  initialState: _.cloneDeep(initialState),

  state: initialState,

  actions
}
