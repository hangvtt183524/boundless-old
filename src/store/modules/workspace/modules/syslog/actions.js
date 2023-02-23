import axios from 'axios'
import * as types from './mutation-types'

const API_URL = process.env.VUE_APP_API_URL

export const fetchSyslogServers = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/syslog-server/`, { params: { page_size: 0, ...filters } }).then(response => {
      commit(types.SET_SYSLOG_SERVERS, response.data.data)

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const retrieveSyslogServer = ({ commit, dispatch, state }, { workspaceId, id }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/syslog-server/${id}/`).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const createSyslogServer = ({ commit, state }, { workspaceId, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/${workspaceId}/syslog-server/`, data).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const updateSyslogServer = ({ commit, state }, { workspaceId, id, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${API_URL}/workspace/${workspaceId}/syslog-server/${id}/`, data).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const terminateSyslogServer = ({ commit, state }, { workspaceId, id, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/${workspaceId}/syslog-server/${id}/termination/`, data).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const rebootSyslogServer = ({ commit, state }, { workspaceId, id, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/${workspaceId}/syslog-server/${id}/reboot/`, data).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const getSyslogFileUrls = ({ commit, dispatch, state }, { workspaceId, id, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/syslog-server/${id}/files/`, { params: filters }).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const downloadSyslogServerTLSCertificate = ({ commit, dispatch, state }, { workspaceId, id }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/syslog-server/${id}/tls-certificate/`, {
      responseType: 'blob'
    }).then(response => {
      const a = document.createElement('a')
      a.href = URL.createObjectURL(response.data)
      a.download = `syslog.crt`
      a.click()

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const getWorkspaceSyslogActivity = ({ commit, dispatch, state }, { workspaceId, id, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/syslog-server/${id}/activity/`, { params: filters }).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}
