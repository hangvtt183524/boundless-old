import axios from 'axios'

import * as types from './mutation-types'

const API_URL = process.env.VUE_APP_API_URL

export const fetchOrganizationNodes = ({ commit, state }, { orgId, filters }) => {
  /*
    Fetches Nodes for an organization
    You can change the filters by passing filters in the payload.
  */
  let params = filters
  if (!params) {
    params = {
      layout: 'flat',
      types: 'organization,group,site'
    }
  }

  const url = `${API_URL}/node/tree/?id=${orgId}`
  return new Promise((resolve, reject) => {
    axios.get(url, { params: params }).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const retrieveNode = ({ commit, state }, { nodeId }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/node/${nodeId}/`, { suppressErrors: true }).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const updateNode = ({ commit, dispatch, state }, { nodeId, ...payload }) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${API_URL}/node/${nodeId}/`, payload).then(response => {
      // If updated currently selected node, update local selected node data
      dispatch('layout/updateSelectedNode', response.data.data, { root: true })

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchAnalytics = ({ commit, state }, { nodeId, timeLine }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/node/${nodeId}/metrics/`, { params: { period: timeLine } }).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const removeSelectedUsers = ({ commit, state }, { nodeId, userIds }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/node/${nodeId}/user/bulk-delete/`, {
      ids: userIds
    }).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

// export const setSelectedNodePermissions = ({ commit, dispatch, state }, nodeId) => {
//   return new Promise((resolve, reject) => {
//     axios.get(`${API_URL}/node/${nodeId}/permissions/`).then((response) => {
//       commit(types.SET_SELECTED_NODE_PERMISSIONS, response.data.data)
//       resolve(response)
//     }).catch(err => {
//       reject(err)
//     })
//   })
// }

export const fetchsSponsorRequestList = ({ commit, dispatch, state }, { nodeId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/node/${nodeId}/sponsor-authorization-request/`, { params: filters }).then((response) => {
      const data = response.data.data.results.map(item => {
        item.visitor = `${item.first_name} ${item.last_name} <${item.visitor_email}>`
        return item
      })
      commit(types.SET_SPONSOR_REQUEST_LIST, data)
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const deleteSponsorRequests = ({ commit }, { nodeId, sponsorRequestId }) => {
  return new Promise((resolve, reject) => {
    axios.delete(`${API_URL}/node/${nodeId}/sponsor-authorization-request/${sponsorRequestId}/`).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}
