import * as types from './mutation-types'
// import axios from 'axios'
// import router from '@/router'

// const API_URL = process.env.VUE_APP_API_URL

export const selectItem = ({ commit, dispatch, state }, index) => {
  console.log(index)
  commit(types.SELECT_ITEM, index)
}

export const setPage = ({ commit, dispatch, state }, page) => {
  commit(types.SET_PAGE, page)
}

// export const deleteFile = ({ commit, dispatch, state }, file) => {
//   let currentOrg = router.currentRoute.params.orgId
//   return new Promise((resolve, reject) => {
//     axios.delete(`${API_URL}/organization/${currentOrg}/asset/${file.id}`).then((response) => {
//       console.log(response)
//       resolve(response)
//       commit(types.DELETE_FILE, file)
//     }).catch(err => {
//       reject(err)
//     })
//   })
// }
