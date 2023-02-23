import axios from 'axios'
import * as types from './mutation-types'

const API_URL = process.env.VUE_APP_API_URL

export const fetchCampaigns = ({ commit }, { orgId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/organization/${orgId}/campaign/`, { params: filters }).then((response) => {
      commit(types.UPDATE_CAMPAIGNS, response.data.data.results)
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const getCampaignIds = ({ commit }, { orgId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/organization/${orgId}/campaign/ids/`, { params: filters }).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const deleteCampaigns = ({ commit }, { orgId, campaignId }) => {
  return new Promise((resolve, reject) => {
    axios.delete(`${API_URL}/organization/${orgId}/campaign/${campaignId}/`).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const fetchCampaignDetails = ({ commit }, { orgId, campaignId }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/organization/${orgId}/campaign/${campaignId}/`).then((response) => {
      commit(types.SET_CAMPAIGN_DETAILS, response.data.data)
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const createCampaign = ({ commit, state }, { orgId, ...payload }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/organization/${orgId}/campaign/`, payload).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const updateCampaign = ({ commit, state }, { orgId, id, ...payload }) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${API_URL}/organization/${orgId}/campaign/${id}/`, payload).then((response) => {
      commit(types.SET_CAMPAIGN_DETAILS, response.data.data)
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const deleteSelectedCampaigns = ({ commit, state }, { orgId, campaignIds }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/organization/${orgId}/campaign/bulk-delete/`, { ids: campaignIds }).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}
