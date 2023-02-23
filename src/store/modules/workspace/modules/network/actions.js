import axios from 'axios'
import * as types from './mutation-types'

const API_URL = process.env.VUE_APP_API_URL

export const createMerakiTemplate = ({ commit, dispatch, state }, { workspaceId, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/${workspaceId}/meraki/template/`, data).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const createMerakiTemplateFromSource = ({ commit, dispatch, state }, { workspaceId, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/${workspaceId}/meraki/template/from-source/`, data).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const updateMerakiTemplate = ({ commit, dispatch, state }, { workspaceId, templateId, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${API_URL}/workspace/${workspaceId}/meraki/template/${templateId}/`, data).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const deployMerakiTemplate = ({ commit, dispatch, state }, { workspaceId, templateId, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/${workspaceId}/meraki/template/${templateId}/deployment/`, data).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchMerakiTemplates = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/template/`, { params: filters }).then((response) => {
      commit(types.UPDATE_MERAKI_TEMPLATES, {
        items: response.data.data.results,
        filters: filters
      })
      commit(types.UPDATE_MERAKI_TEMPLATES_COUNT, response.data.data.count)

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchMerakiTemplate = ({ commit, dispatch, state }, { workspaceId, templateId }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/template/${templateId}/`).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const deleteMerakiTemplate = ({ commit, dispatch, state }, { workspaceId, templateId }) => {
  return new Promise((resolve, reject) => {
    axios.delete(`${API_URL}/workspace/${workspaceId}/meraki/template/${templateId}`).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const updateMerakiTemplateInList = ({ commit, dispatch, state }, merakiTemplate) => {
  commit(types.UPDATE_MERAKI_TEMPLATE_IN_LIST, merakiTemplate)
}

export const fetchMerakiTemplateFieldSuggestions = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/template/field-suggestions/`, { params: filters }).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchTrafficShapingApplicationCategories = ({ commit, dispatch, state }, { workspaceId }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/template/traffic-shaping-application-categories/`).then((response) => {
      commit(types.UPDATE_TRAFFIC_SHAPING_APPLICATION_CATEGORIES, response.data.data.results)
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchTrafficShapingDscpTags = ({ commit, dispatch, state }, { workspaceId }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/template/traffic-shaping-dscp-tags/`).then((response) => {
      commit(types.UPDATE_TRAFFIC_SHAPING_DSCP_TAGS, response.data.data.results)
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchContentFilteringCategories = ({ commit, dispatch, state }, { workspaceId }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/template/content-filtering-categories/`).then((response) => {
      commit(types.UPDATE_CONTENT_FILTERING_CATEGORIES, response.data.data.results)
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchL7ApplicationCategories = ({ commit, dispatch, state }, { workspaceId }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/template/l7-application-categories/`).then((response) => {
      commit(types.UPDATE_L7_APPLICATION_CATEGORIES, response.data.data.results)
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchLongRunningJob = ({ commit, dispatch, state }, { workspaceId, jobId }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/job/${jobId}/`).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const updateLongRunningJob = ({ commit, dispatch, state }, { workspaceId, jobId, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${API_URL}/workspace/${workspaceId}/meraki/job/${jobId}/`, data).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const getMerakiEntities = ({ commit, state }, { workspaceId, entityType, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/entity/${entityType}/`, { params: filters }).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const getMerakiExternalEntities = ({ commit, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/${workspaceId}/meraki/external-entity/`, null, { params: filters }).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchMerakiNetworkCreationSteps = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/network-creation-step/`, { params: filters }).then((response) => {
      let items
      if (filters.hasOwnProperty('page_size') && filters.page_size === 0) {
        items = response.data.data
      } else {
        items = response.data.data.results
      }

      commit(types.UPDATE_MERAKI_NETWORK_CREATION_STEPS, {
        items: items,
        filters: filters
      })

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const createMerakiNetworkCreationFlow = ({ commit, dispatch, state }, { workspaceId, formData }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/${workspaceId}/meraki/network-creation-flow/`, formData).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const updateMerakiNetworkCreationFlow = ({ commit, dispatch, state }, { workspaceId, flowId, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${API_URL}/workspace/${workspaceId}/meraki/network-creation-flow/${flowId}/`, data).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const executeMerakiNetworkCreationFlow = ({ commit, dispatch, state }, { workspaceId, flowId, formData }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/${workspaceId}/meraki/network-creation-flow/${flowId}/execution/`, formData).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchMerakiNetworkCreationFlows = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/network-creation-flow/`, { params: filters }).then((response) => {
      commit(types.UPDATE_MERAKI_NETWORK_CREATION_FLOWS, {
        items: response.data.data.results,
        filters: filters
      })
      commit(types.UPDATE_MERAKI_NETWORK_CREATION_FLOWS_COUNT, response.data.data.count)

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchMerakiNetworkCreationFlow = ({ commit, dispatch, state }, { workspaceId, flowId }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/network-creation-flow/${flowId}/`).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchMerakiNetworkCreationFlowColumns = ({ commit, dispatch, state }, { workspaceId, flowId }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/network-creation-flow/${flowId}/columns/`).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const deleteMerakiNetworkCreationFlow = ({ commit, dispatch, state }, { workspaceId, flowId }) => {
  return new Promise((resolve, reject) => {
    axios.delete(`${API_URL}/workspace/${workspaceId}/meraki/network-creation-flow/${flowId}`).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const downloadMerakiNetworkCreationFlowInputFile = ({ commit, dispatch, state }, { workspaceId, flowId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/network-creation-flow/${flowId}/input-file/`, {
      responseType: 'blob',
      params: filters
    }).then((response) => {
      const a = document.createElement('a')
      a.href = URL.createObjectURL(response.data)

      let fileName = `flow-${flowId}`
      if (filters.execution) {
        fileName = `${fileName}-${filters.execution}`
      }

      a.download = response.headers['content-type'] === 'text/csv' ? `${fileName}.csv` : `${fileName}.xlsx`
      a.click()

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchMerakiSecurityComplianceRuleSets = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/security-compliance-rule-set/`, { params: filters }).then((response) => {
      commit(types.UPDATE_MERAKI_SECURITY_COMPLIANCE_RULE_SETS, {
        items: response.data.data.results,
        filters: filters
      })
      commit(types.UPDATE_MERAKI_SECURITY_COMPLIANCE_RULE_SETS_COUNT, response.data.data.count)

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const retrieveMerakiSecurityComplianceRuleSet = ({ commit, dispatch, state }, { workspaceId, id }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/security-compliance-rule-set/${id}/`).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const createMerakiSecurityComplianceRuleSet = ({ commit, dispatch, state }, { workspaceId, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/${workspaceId}/meraki/security-compliance-rule-set/`, data).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const updateMerakiSecurityComplianceRuleSet = ({ commit, dispatch, state }, { workspaceId, id, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${API_URL}/workspace/${workspaceId}/meraki/security-compliance-rule-set/${id}/`, data).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const deleteMerakiSecurityComplianceRuleSet = ({ commit, dispatch, state }, { workspaceId, id }) => {
  return new Promise((resolve, reject) => {
    axios.delete(`${API_URL}/workspace/${workspaceId}/meraki/security-compliance-rule-set/${id}/`).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchMerakiSecurityComplianceChecks = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/network-security-compliance-check/`, { params: filters }).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const retrieveMerakiSecurityComplianceCheck = ({ commit, dispatch, state }, { workspaceId, complianceCheckId }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/network-security-compliance-check/${complianceCheckId}/`).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const updateMerakiSecurityComplianceCheck = ({ commit, dispatch, state }, { workspaceId, complianceCheckId, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${API_URL}/workspace/${workspaceId}/meraki/network-security-compliance-check/${complianceCheckId}/`, data).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchMerakiNameComplianceChecks = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/entity-name-compliance-check/`, { params: filters }).then((response) => {
      commit(types.UPDATE_MERAKI_NAME_COMPLIANCE_CHECKS, {
        items: response.data.data.results,
        filters: filters
      })
      commit(types.UPDATE_MERAKI_NAME_COMPLIANCE_CHECKS_COUNT, response.data.data.count)

      if (filters.rule_set && filters.is_dismissed === false && !filters.search) {
        // We fetched all alerts. Update alert count for rule set in store
        commit(types.UPDATE_MERAKI_NAME_COMPLIANCE_RULE_SET_ALERT_COUNTS, {
          ruleSetId: filters.rule_set,
          count: response.data.data.count
        })
      }

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const retrieveMerakiNameComplianceCheck = ({ commit, dispatch, state }, { workspaceId, complianceCheckId }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/entity-name-compliance-check/${complianceCheckId}/`).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const updateMerakiNameComplianceCheck = ({ commit, dispatch, state }, { workspaceId, complianceCheckId, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${API_URL}/workspace/${workspaceId}/meraki/entity-name-compliance-check/${complianceCheckId}/`, data).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const updateMerakiNameComplianceCheckName = ({ commit, dispatch, state }, { workspaceId, complianceCheckId, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${API_URL}/workspace/${workspaceId}/meraki/entity-name-compliance-check/${complianceCheckId}/name/`, data).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchMerakiNameComplianceRuleSets = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/name-compliance-rule-set/`, { params: filters }).then((response) => {
      commit(types.UPDATE_MERAKI_NAME_COMPLIANCE_RULE_SETS, {
        items: response.data.data.results,
        filters: filters
      })
      commit(types.UPDATE_MERAKI_NAME_COMPLIANCE_RULE_SETS_COUNT, response.data.data.count)

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const retrieveMerakiNameComplianceRuleSet = ({ commit, dispatch, state }, { workspaceId, id }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/name-compliance-rule-set/${id}/`).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const createMerakiNameComplianceRuleSet = ({ commit, dispatch, state }, { workspaceId, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/${workspaceId}/meraki/name-compliance-rule-set/`, data).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const updateMerakiNameComplianceRuleSet = ({ commit, dispatch, state }, { workspaceId, id, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${API_URL}/workspace/${workspaceId}/meraki/name-compliance-rule-set/${id}/`, data).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const deleteMerakiNameComplianceRuleSet = ({ commit, dispatch, state }, { workspaceId, id }) => {
  return new Promise((resolve, reject) => {
    axios.delete(`${API_URL}/workspace/${workspaceId}/meraki/name-compliance-rule-set/${id}/`).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const uploadMerakiNameComplianceRuleOptions = ({ commit, dispatch, state }, { workspaceId, id, formData }) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${API_URL}/workspace/${workspaceId}/meraki/name-compliance-rule-set/${id}/name-options/`, formData).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const uploadMerakiNameComplianceRulePatternElementOptions = ({ commit, dispatch, state }, { workspaceId, id, formData }) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${API_URL}/workspace/${workspaceId}/meraki/name-compliance-rule-set/${id}/pattern-element-name-options/`, formData).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const duplicateMerakiNameComplianceRuleSet = ({ commit, dispatch, state }, { workspaceId, id }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/${workspaceId}/meraki/name-compliance-rule-set/${id}/duplication/`).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchMerakiConfigurationComplianceRuleSets = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/configuration-compliance-rule-set/`, { params: filters }).then((response) => {
      commit(types.UPDATE_MERAKI_CONFIGURATION_COMPLIANCE_RULE_SETS, {
        items: response.data.data.results,
        filters: filters
      })
      commit(types.UPDATE_MERAKI_CONFIGURATION_COMPLIANCE_RULE_SETS_COUNT, response.data.data.count)

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const retrieveMerakiConfigurationComplianceRuleSet = ({ commit, dispatch, state }, { workspaceId, id }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/configuration-compliance-rule-set/${id}/`).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const createMerakiConfigurationComplianceRuleSet = ({ commit, dispatch, state }, { workspaceId, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/${workspaceId}/meraki/configuration-compliance-rule-set/`, data).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const updateMerakiConfigurationComplianceRuleSet = ({ commit, dispatch, state }, { workspaceId, id, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${API_URL}/workspace/${workspaceId}/meraki/configuration-compliance-rule-set/${id}/`, data).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const deleteMerakiConfigurationComplianceRuleSet = ({ commit, dispatch, state }, { workspaceId, id }) => {
  return new Promise((resolve, reject) => {
    axios.delete(`${API_URL}/workspace/${workspaceId}/meraki/configuration-compliance-rule-set/${id}/`).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchMerakiConfigurationComplianceChecks = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/configuration-compliance-check/`, { params: filters }).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const retrieveMerakiConfigurationComplianceCheck = ({ commit, dispatch, state }, { workspaceId, complianceCheckId }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/configuration-compliance-check/${complianceCheckId}/`).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const updateMerakiConfigurationComplianceCheck = ({ commit, dispatch, state }, { workspaceId, complianceCheckId, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${API_URL}/workspace/${workspaceId}/meraki/configuration-compliance-check/${complianceCheckId}/`, data).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchTags = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/tag/`, { params: filters }).then((response) => {
      commit(types.UPDATE_MERAKI_TAGS, {
        merakiTags: response.data,
        filters: filters
      })
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchTagIds = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/tag/ids/`, { params: filters }).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const downloadTags = ({ commit, dispatch, state }, { workspaceId, workspaceName, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/entity-tag/`, {
      responseType: 'blob',
      headers: {
        Accept: 'text/csv'
      },
      params: filters
    }).then((response) => {
      var a = document.createElement('a')
      a.href = URL.createObjectURL(response.data)
      a.download = `${workspaceName.toLowerCase().replace(' ', '_')}_tags.csv`
      a.click()

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const replaceTag = ({ commit, dispatch, state }, { workspaceId, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/${workspaceId}/meraki/tag/replacement/`, data).then(async (response) => {
      await fetchTags({ commit, dispatch, state }, { workspaceId, ...state.merakiTagFilter, page: 1 })
      await fetchTaggableResources({ commit, dispatch, state }, { workspaceId, ...state.merakiTaggableResourcesFilter, page: 1 })
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const removeTag = ({ commit, dispatch, state }, { workspaceId, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/${workspaceId}/meraki/tag/removal/`, data).then(async (response) => {
      await fetchTags({ commit, dispatch, state }, { workspaceId, ...state.merakiTagFilter, page: 1 })
      await fetchTaggableResources({ commit, dispatch, state }, { workspaceId, ...state.merakiTaggableResourcesFilter, page: 1 })
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchTagSuggestions = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/tag/suggestions/`, { params: filters }).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchTaggableResources = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/taggable-resource/`, { params: filters }).then((response) => {
      commit(types.UPDATE_MERAKI_TAGGABLE_RESOURCES, {
        merakiTaggableResources: response.data,
        filters: filters
      })
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchTaggableResourceIds = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/taggable-resource/ids/`, { params: filters }).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const addTagsToTaggableResources = ({ commit, dispatch, state }, { workspaceId, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/${workspaceId}/meraki/taggable-resource/bulk-tag-addition/`, data).then(async (response) => {
      await fetchTaggableResources({ commit, dispatch, state }, { workspaceId, ...state.merakiTaggableResourcesFilter, page: 1 })
      await fetchTags({ commit, dispatch, state }, { workspaceId, ...state.merakiTagFilter, page: 1 })
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const removeTagsFromTaggableResources = ({ commit, dispatch, state }, { workspaceId, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/${workspaceId}/meraki/taggable-resource/bulk-tag-removal/`, data).then(async (response) => {
      await fetchTaggableResources({ commit, dispatch, state }, { workspaceId, ...state.merakiTaggableResourcesFilter, page: 1 })
      await fetchTags({ commit, dispatch, state }, { workspaceId, ...state.merakiTagFilter, page: 1 })
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchTaggableResourcesForATag = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/taggable-resource/`, { params: filters }).then((response) => {
      commit(types.UPDATE_MERAKI_TAGGABLE_RESOURCES_FOR_ATAG, {
        merakiTaggableResourcesForATag: response.data,
        filters: filters
      })
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const dismissSimilarTag = ({ commit, dispatch, state }, { workspaceId, tagId, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/${workspaceId}/meraki/tag/${tagId}/similarity-dismissal/`, data).then(async (response) => {
      await fetchTags({ commit, dispatch, state }, { workspaceId, ...state.merakiTagFilter, page: 1 })
      await fetchTaggableResources({ commit, dispatch, state }, { workspaceId, ...state.merakiTaggableResourcesFilter, page: 1 })
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchMerakiNetworkBases = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/network-base/`, { params: filters }).then((response) => {
      commit(types.UPDATE_MERAKI_NETWORK_BASES, {
        items: response.data.data.results,
        filters: filters
      })
      commit(types.UPDATE_MERAKI_NETWORK_BASES_COUNT, response.data.data.count)

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const cloneMerakiNetworks = ({ commit, dispatch, state }, { workspaceId, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/${workspaceId}/meraki/network-base/clone/`, data).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchMerakiClients = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/client/`, { params: filters }).then((response) => {
      commit(types.UPDATE_MERAKI_CLIENTS, {
        clients: response.data.data.results,
        filters: filters
      })
      commit(types.UPDATE_MERAKI_CLIENTS_COUNT, response.data.data.count)

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const downloadMerakiClients = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/${workspaceId}/meraki/client/export/`, null, { params: filters }).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchMerakiClient = ({ commit, dispatch, state }, { workspaceId, clientId }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/client/${clientId}/`).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchMerakiClientEvents = ({ commit, dispatch, state }, { workspaceId, clientId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/client/${clientId}/events/`, { params: filters }).then((response) => {
      commit(types.UPDATE_MERAKI_CLIENT_EVENTS, {
        items: response.data.data.results,
        filters: filters
      })
      commit(types.UPDATE_MERAKI_CLIENT_EVENTS_COUNT, response.data.data.count)

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchMerakiClientTrafficHistory = ({ commit, dispatch, state }, { workspaceId, clientId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/client/${clientId}/traffic-history/`, { params: filters }).then((response) => {
      commit(types.UPDATE_MERAKI_CLIENT_TRAFFIC_HISTORY, {
        items: response.data.data.results,
        filters: filters
      })
      commit(types.UPDATE_MERAKI_CLIENT_TRAFFIC_HISTORY_COUNT, response.data.data.count)

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchMerakiClientUsageHistory = ({ commit, dispatch, state }, { workspaceId, clientId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/client/${clientId}/usage-history/`, { params: filters }).then((response) => {
      commit(types.UPDATE_MERAKI_CLIENT_USAGE_HISTORY, {
        items: response.data.data.results,
        filters: filters
      })
      commit(types.UPDATE_MERAKI_CLIENT_USAGE_HISTORY_COUNT, response.data.data.count)

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchMerakiClientLatencyHistory = ({ commit, dispatch, state }, { workspaceId, clientId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/client/${clientId}/latency-history/`, { params: filters }).then((response) => {
      commit(types.UPDATE_MERAKI_CLIENT_LATENCY_HISTORY, {
        items: response.data.data.results,
        filters: filters
      })
      commit(types.UPDATE_MERAKI_CLIENT_LATENCY_HISTORY_COUNT, response.data.data.count)

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchMerakiMonitoringDevices = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/device-monitoring/`, { params: filters }).then((response) => {
      commit(types.UPDATE_MERAKI_MONITORING_DEVICES, {
        items: response.data.data.results,
        filters: filters
      })
      commit(types.UPDATE_MERAKI_MONITORING_DEVICES_COUNT, response.data.data.count)

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const downloadMerakiMonitoringDevices = ({ commit, dispatch, state }, { workspaceId, workspaceName, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/device-monitoring/`, {
      responseType: 'blob',
      headers: {
        Accept: 'text/csv'
      },
      params: {
        ...filters,
        page_size: 0
      }
    }).then((response) => {
      var a = document.createElement('a')
      a.href = URL.createObjectURL(response.data)
      a.download = `${workspaceName.toLowerCase().replace(' ', '_')}_devices.csv`
      a.click()

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const retrieveMerakiMonitoringDevice = ({ commit, dispatch, state }, { workspaceId, deviceId }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/device-monitoring/${deviceId}/`).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchMerakiDeviceConnectionHistory = ({ commit, dispatch, state }, { workspaceId, deviceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/device-monitoring/${deviceId}/connection-history/`, { params: filters }).then((response) => {
      commit(types.UPDATE_MERAKI_DEVICE_CONNECTION_HISTORY, {
        items: response.data.data.results,
        filters: filters
      })
      commit(types.UPDATE_MERAKI_DEVICE_CONNECTION_HISTORY_COUNT, response.data.data.count)

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchMerakiDeviceLatencyHistory = ({ commit, dispatch, state }, { workspaceId, deviceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/device-monitoring/${deviceId}/latency-history/`, { params: filters }).then((response) => {
      commit(types.UPDATE_MERAKI_DEVICE_LATENCY_HISTORY, {
        items: response.data.data.results,
        filters: filters
      })
      commit(types.UPDATE_MERAKI_DEVICE_LATENCY_HISTORY_COUNT, response.data.data.count)

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const moveDevices = ({ commit, dispatch, state }, { workspaceId, ...payload }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/${workspaceId}/meraki/device/move/`, payload).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchMerakiMonitoringSwitchPorts = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/switch-port-monitoring/`, { params: filters }).then((response) => {
      commit(types.UPDATE_MERAKI_MONITORING_SWITCH_PORTS, {
        items: response.data.data.results,
        filters: filters
      })
      commit(types.UPDATE_MERAKI_MONITORING_SWITCH_PORTS_COUNT, response.data.data.count)

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchMerakiMonitoringSwitchPortsNetworks = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/switch-port-monitoring/networks/`, { params: filters }).then((response) => {
      commit(types.UPDATE_MERAKI_MONITORING_SWITCH_PORTS_NETWORKS, {
        items: response.data.data.results,
        filters: filters
      })
      commit(types.UPDATE_MERAKI_MONITORING_SWITCH_PORTS_NETWORKS_COUNT, response.data.data.count)

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchMerakiMonitoringSwitchPortsDevices = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/switch-port-monitoring/devices/`, { params: filters }).then((response) => {
      commit(types.UPDATE_MERAKI_MONITORING_SWITCH_PORTS_DEVICES, {
        items: response.data.data.results,
        filters: filters
      })
      commit(types.UPDATE_MERAKI_MONITORING_SWITCH_PORTS_DEVICES_COUNT, response.data.data.count)

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchMerakiMonitoringSwitchPortsOrganizations = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/switch-port-monitoring/organizations/`, { params: filters }).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchDashboardEntities = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/dashboard-entity/`, { params: filters }).then((response) => {
      commit(types.UPDATE_DASHBOARD_ENTITIES, {
        items: (filters.page_size === 0 ? response.data.data : response.data.data.results),
        filters: filters
      })

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const createDashboard = ({ commit, dispatch, state }, { workspaceId, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/${workspaceId}/dashboard/`, data).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const updateDashboard = ({ commit, dispatch, state }, { workspaceId, id, ...data }) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${API_URL}/workspace/${workspaceId}/dashboard/${id}/`, data).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchDashboards = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/dashboard/`, { params: filters }).then((response) => {
      commit(types.UPDATE_DASHBOARDS, {
        items: response.data.data.results,
        filters: filters
      })
      commit(types.UPDATE_DASHBOARDS_COUNT, response.data.data.count)

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchDashboard = ({ commit, dispatch, state }, { workspaceId, id }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/dashboard/${id}/`).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const deleteDashboard = ({ commit, dispatch, state }, { workspaceId, id }) => {
  return new Promise((resolve, reject) => {
    axios.delete(`${API_URL}/workspace/${workspaceId}/dashboard/${id}/`).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchDashboardParameterOptions = ({ commit, dispatch, state }, { workspaceId, id, isRootParameter, widgetId, operationId, parameter, ...filters }) => {
  if (isRootParameter) {
    commit(types.UPDATE_DASHBOARD_PARAMETER_OPTIONS, {
      name: parameter,
      organization: filters.organization,
      status: 'loading',
      options: []
    })
  }

  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/dashboard/${id}/widget/${widgetId}/operation/${operationId}/${parameter}/options/`, { params: filters }).then((response) => {
      if (isRootParameter) {
        commit(types.UPDATE_DASHBOARD_PARAMETER_OPTIONS, {
          name: parameter,
          organization: filters.organization,
          status: 'loaded',
          options: response.data.data
        })
      }

      resolve(response)
    }).catch(err => {
      if (isRootParameter) {
        commit(types.UPDATE_DASHBOARD_PARAMETER_OPTIONS, {
          name: parameter,
          organization: filters.organization,
          status: 'failed',
          options: []
        })
      }

      reject(err)
    })
  })
}

export const fetchUserDashboards = ({ commit, dispatch, state }, { workspaceId }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/user-dashboard/`, { params: { page_size: 0 } }).then((response) => {
      commit(types.UPDATE_USER_DASHBOARDS, {
        workspaceId,
        items: response.data.data
      })

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchUserDashboard = ({ commit, dispatch, state }, { workspaceId, id }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/user-dashboard/${id}/`).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const getUserDashboardWidgetData = ({ commit, dispatch, state }, { workspaceId, id, widgetId, operationId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/user-dashboard/${id}/widget/${widgetId}/operation/${operationId}/`, { params: filters }).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const performUserDashboardWidgetOperation = ({ commit, dispatch, state }, { workspaceId, id, widgetId, operationId, filters, data }) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/workspace/${workspaceId}/user-dashboard/${id}/widget/${widgetId}/operation/${operationId}/`, data, { params: filters }).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchMerakiTargetSuggestions = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/target-suggestion/`, { params: filters }).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchDevices = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/device/`, { params: filters }).then((response) => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const fetchAssociatedDevices = ({ commit, dispatch, state }, { workspaceId, ...filters }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/workspace/${workspaceId}/meraki/device/associated-entities/`, { params: filters }).then((response) => {
      commit(types.UPDATE_ASSOCIATED_DEVICES, response.data.data.results)
      commit(types.UPDATE_ASSOCIATED_DEVICES_COUNT, response.data.data.count)

      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const updateDevice = ({ commit, state }, { workspaceId, deviceId, ...payload }) => {
  const url = `${API_URL}/workspace/${workspaceId}/meraki/device/${deviceId}/`
  return new Promise((resolve, reject) => {
    axios.patch(url, payload).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const sendDeviceCommand = ({ commit, state }, { workspaceId, deviceId, ...payload }) => {
  const url = `${API_URL}/workspace/${workspaceId}/meraki/device/${deviceId}/command/`
  return new Promise((resolve, reject) => {
    axios.post(url, payload).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const disassociateDevice = ({ commit, state }, { workspaceId, deviceId }) => {
  const url = `${API_URL}/workspace/${workspaceId}/meraki/device/${deviceId}/disassociation/`
  return new Promise((resolve, reject) => {
    axios.post(url).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const updateDeviceNetwork = ({ commit, state }, { workspaceId, deviceId, ...payload }) => {
  const url = `${API_URL}/workspace/${workspaceId}/meraki/device/${deviceId}/network/`
  return new Promise((resolve, reject) => {
    axios.patch(url, payload).then((response) => {
      resolve(response)
    }).catch((err) => {
      reject(err)
    })
  })
}
