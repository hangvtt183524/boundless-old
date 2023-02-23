import _ from 'lodash'
import mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'

const initialState = {
  campaigns: [],
  campaignDetails: {},
  newCampaign: {
    name: '',
    splashPage: '',
    group: '',
    wifi: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    acceptTerms: false,
    active: false
  }
}

export default {
  namespaced: true,

  initialState: _.cloneDeep(initialState),

  state: initialState,

  getters,

  actions,

  mutations
}
