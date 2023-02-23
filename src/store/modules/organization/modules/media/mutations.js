import * as types from './mutation-types'

const mutations = {

  [types.UPDATE_FILES] (state, { files, filesCount, filters }) {
    if (filters.page > 1) {
      state.files = [
        ...state.files.slice(0, filters.page_size * (filters.page - 1)),
        ...files
      ]
    } else {
      state.files = [...files]
    }
    state.filesCount = filesCount
    state.filesFilter = filters
  }
}

export default mutations
