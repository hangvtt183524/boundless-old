import * as types from './mutation-types'

const mutations = {

  [types.SELECT_ITEM] (state, index) {
    let seletedItem = state.page.container.children.find(item => item.id === index)
    state.seletedItem = seletedItem
  },
  [types.SET_PAGE] (state, page) {
    state.page = page
  }
}

export default mutations
