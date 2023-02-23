import store from '@/store'

const vuexStore = store

const proceed = (to, next, permissions) => {
  const orgId = to.params.orgId
  let roles = []
  to.matched.forEach(route => {
    if (route.meta.roles) {
      roles = route.meta.roles
    }
  })
  if (!permissions || !roles.some(r => permissions.indexOf(r) >= 0)) {
    return next({ name: 'WifiAnalytics', params: { orgId: orgId, nodeId: orgId } })
  }
}

export const checkPermissions = (to, from, next) => {
  // Used in checking if user has proper role in router path
  if (to.matched.some(m => m.meta.roles)) {
    if (!vuexStore.getters['organization/selectedOrgPermissions'].length) {
      // Wait for the user to be loaded so we can check the permissions
      const unwatch = vuexStore.watch(() => vuexStore.getters['organization/selectedOrgPermissions'], permissions => {
        console.log('watch permission and check permissions after loading', unwatch)
        // should watch only once so just doing unwatch after first detection
        unwatch()
        proceed(to, next, permissions)
      })
    } else {
      proceed(to, next, vuexStore.getters['organization/selectedOrgPermissions'])
    }
  }
}
