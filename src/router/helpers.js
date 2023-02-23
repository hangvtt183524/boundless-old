import store from '../store'
import Ls from '@/services/ls'

const getWorkspaceId = function (route) {
  // Try to get from store, route parameters or local storage
  return store.getters['layout/selectedWorkspace'].id ||
    route.params.workspaceId ||
    Number.parseInt(Ls.getJson('layout.state', {}).workspace)
}

export const checkWorkspaceApiKey = function (to, from, next) {
  if (store.getters['workspace/hasApiKeys'] === null) {
    // Api key state not fetched yet, fetch it first
    const workspaceId = getWorkspaceId(to)
    if (!workspaceId) {
      return next()
    }

    return store.dispatch('workspace/retrieveWorkspaceSetupStatus', { id: workspaceId }).then(() => {
      // hasApiKeys value set at this point
      return checkWorkspaceApiKey(to, from, next)
    }).catch(() => {
      // Could not fetch api key status, proceed to page
      return next()
    })
  }

  if (store.getters['workspace/hasApiKeys']) {
    // Has api keys
    return next()
  } else {
    // Does not have api keys
    const menu = store.getters['layout/menu']
    const activeProductIndex = store.getters['layout/activeProductIndex']
    let productName = menu[activeProductIndex].translation
    if (productName === 'network_management') {
      productName = 'automation'
    }
    return next({ name: 'ExternalApiKeysSetup', params: { nextPage: to.name, workspaceId: to.params.workspaceId, waitImportCompletion: true, backButtonHidden: true, productName: productName } })
  }
}
