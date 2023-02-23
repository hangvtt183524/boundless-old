import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL

export const fetchTicketings = ({ commit, dispatch, state }, { nodeId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/node/${nodeId}/wifi-ticket/`, { params: filters }).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const createTicketing = ({ commit, state }, data) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/node/${data.node}/wifi-ticket/`, data).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const updateTicketing = ({ commit, state }, { id, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${API_URL}/node/${data.node}/wifi-ticket/${id}/`, data).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const deleteTicketing = ({ commit, dispatch, state }, { nodeId, id }) => {
  return new Promise((resolve, reject) => {
    axios.delete(`${API_URL}/node/${nodeId}/wifi-ticket/${id}/`).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const resendTicketing = ({ commit, state }, { nodeId, id }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/node/${nodeId}/wifi-ticket/${id}/messages/`).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}
