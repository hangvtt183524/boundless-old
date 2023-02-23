import * as types from './mutation-types'
import axios from 'axios'
import router from '@/router'

const API_URL = process.env.VUE_APP_API_URL

export const addFile = ({ commit, state }, { orgId, ...payload }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/organization/${orgId}/asset/`, payload).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const addFileFromUrl = ({ commit, state }, { orgId, ...payload }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/organization/${orgId}/asset/from-url/`, payload).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const uploadCropped = ({ commit, state }, { orgId, id, ...payload }) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${API_URL}/organization/${orgId}/asset/${id}/upload-cropped/`, payload).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const uploadFileS3 = ({ commit, state }, { url, data }) => {
  return new Promise((resolve, reject) => {
    axios.post(url, data, { headers: { 'Content-Type': 'multipart/form-data', Authorization: '' } }).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const fetchFiles = ({ commit, dispatch, state }, { orgId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/organization/${orgId}/asset/`, { params: filters }).then((response) => {
      commit(types.UPDATE_FILES, { files: response.data.data.results, filesCount: response.data.data.count, filters: filters })
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const getFileIds = ({ commit }, { orgId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/organization/${orgId}/asset/ids/`, { params: filters }).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const updateFile = ({ commit, dispatch, state }, { id, ...payload }) => {
  let currentOrg = router.currentRoute.params.orgId
  return new Promise((resolve, reject) => {
    axios.patch(`${API_URL}/organization/${currentOrg}/asset/${id}/`, payload).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const deleteFile = ({ commit, dispatch, state }, file) => {
  let currentOrg = router.currentRoute.params.orgId
  return new Promise((resolve, reject) => {
    axios.delete(`${API_URL}/organization/${currentOrg}/asset/${file.id}`).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const deleteFiles = ({ commit, dispatch, state }, { fileIds }) => {
  let currentOrg = router.currentRoute.params.orgId
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/organization/${currentOrg}/asset/bulk-delete/`, {
      ids: fileIds
    }).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}
