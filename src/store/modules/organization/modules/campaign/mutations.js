import * as types from './mutation-types'

const mutations = {
  [types.UPDATE_CAMPAIGNS] (state, campaigns) {
    state.campaigns = campaigns
  },
  [types.SET_CAMPAIGN_DETAILS] (state, campaignDetails) {
    state.campaignDetails = campaignDetails
  }
}

export default mutations
