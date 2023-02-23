import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL

export const fetchCameras = ({ commit }, nodeId) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/device/`, { params: { type: 'camera', ancestor: nodeId } }).then(response => {
      resolve(response.data.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchCameraAnalytics = ({ commit }, { id, startDateTime, endDateTime }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/camera/${id}/analytics/`, { params: { start_time: startDateTime, end_time: endDateTime } }).then(response => {
      resolve(response.data.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchCameraLive = ({ commit }, cameraId) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/camera/${cameraId}/live/`).then(response => {
      resolve(response.data.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchCameraDailyOverview = ({ commit }, cameraId) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/camera/${cameraId}/daily-overview/`).then(response => {
      resolve(response.data.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchCameraSnapshot = ({ commit }, cameraId) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/camera/${cameraId}/snapshot/`).then(response => {
      resolve(response.data.data)
    }).catch(err => {
      reject(err)
    })
  })
}
