import * as types from './mutation-types'

const mutations = {
  [types.SET_SPLASH_PAGE_OPTIONS] (state, splashPageOptions) {
    state.splashPageOptions = splashPageOptions
  },

  [types.UPDATE_TEMPLATE_TYPE] (state, templateType) {
    state.selectedSplashTemplateType = templateType
  }

}

export default mutations
