import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL

export const fetchVouchers = ({ commit, dispatch, state }, { nodeId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/node/${nodeId}/wifi-batch-access-code/`, { params: filters }).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const createVoucher = ({ commit, state }, data) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/node/${data.node}/wifi-batch-access-code/`, data).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const updateVoucher = ({ commit, state }, { id, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${API_URL}/node/${data.node}/wifi-batch-access-code/${id}/`, data).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const deleteVoucher = ({ commit, dispatch, state }, { nodeId, id }) => {
  return new Promise((resolve, reject) => {
    axios.delete(`${API_URL}/node/${nodeId}/wifi-batch-access-code/${id}/`).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchVoucherCodes = ({ commit, dispatch, state }, { nodeId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/node/${nodeId}/wifi-access-code/`, { params: filters }).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const downloadVoucherCodes = ({ commit, dispatch, state }, { nodeId, type, ...filters }) => {
  const downloadType = type === 0 ? 'csv' : 'xlsx'

  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/node/${nodeId}/wifi-access-code.${downloadType}`, { params: filters, responseType: 'blob' }).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}
