import * as types from './mutation-types'
import apiService from '@/api/api.service'

const actions = {

  bootstrap ({ commit, dispatch }) {
    return dispatch('user/fetchCurrentUser')
  },

  setGroupAndSiteFileStructure ({ commit }, payload) {
    commit(types.UPDATE_GROUP_SITE_STRUCTURE, payload)
  },

  fetchWifiAuthorizationListing ({ commit }) {
    return apiService.callApi(window.location.origin + '/data/wifi_authorizations_listings.json', 'get').then((response) => {
      commit(types.UPDATE_WIFI_AUTHORIZATION_LISTING, response.data)
    })
  },

  fetchCountries ({ commit }) {
    apiService.callApi(window.location.origin + '/data/countries.json', 'get').then((response) => {
      const countries = global._.sortBy(response.data, country => country.name)
      commit(types.UPDATE_COUNTRIES, countries)
    })
  },

  setIsMobile: ({ commit }) => {
    const isMobile = window.matchMedia('only screen and (max-width: 767px)').matches
    commit(types.UPDATE_IS_MOBILE, isMobile)
  },

  setPointerIsTouch: ({ commit }, payload) => {
    commit(types.UPDATE_POUNTER_IS_TOUCH, payload)
  },

  setWindowSize: ({ commit }, payload) => {
    commit(types.UPDATE_WINDOW_SIZE, payload)
  },

  setActivityIndicator ({ commit }, payload) {
    commit(types.UPDATE_ACTIVITY_INDICATOR, payload)
  }

}

export default actions
