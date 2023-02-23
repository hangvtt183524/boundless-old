import axios from 'axios'

import * as types from './mutation-types'

const API_URL = process.env.VUE_APP_API_URL

export const fetchVisitors = ({ commit, state }, { nodeId, ...filters }) => {
  const url = `${API_URL}/node/${nodeId}/visitor/`
  return new Promise((resolve, reject) => {
    axios.get(url, { params: filters }).then((response) => {
      commit(types.SET_VISITORS, response.data.data.results)
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const downloadVisitors = ({ commit, state }, { nodeId, type, ...filters }) => {
  const url = `${API_URL}/node/${nodeId}/visitor.${type}`
  return new Promise((resolve, reject) => {
    axios.get(url, { params: filters, responseType: 'blob' }).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const fetchVisitorDetails = ({ commit, state }, { nodeId, visitorId }) => {
  const url = `${API_URL}/node/${nodeId}/visitor/${visitorId}/`
  return new Promise((resolve, reject) => {
    axios.get(url).then((response) => {
      commit(types.SET_VISITOR_DETAILS, response.data.data)
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const deleteVisitor = ({ commit, state }, { nodeId, visitorId }) => {
  const url = `${API_URL}/node/${nodeId}/visitor/${visitorId}/`
  return new Promise((resolve, reject) => {
    axios.delete(url).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}
