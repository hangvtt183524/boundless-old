import * as types from './mutation-types'

const mutations = {
  [types.SET_SITE_OPTIONS] (state, siteOptions) {
    state.siteOptions = siteOptions
  }
}

export default mutations
