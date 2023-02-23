import * as types from './mutation-types'

const mutations = {
  [types.SET_VISITORS] (state, visitors) {
    state.visitors = visitors
  },
  [types.SET_VISITOR_DETAILS] (state, visitorDetails) {
    state.visitorDetails = visitorDetails
  }
}

export default mutations
