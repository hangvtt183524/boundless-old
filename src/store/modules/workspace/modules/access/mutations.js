import * as types from './mutation-types'
import Vue from 'vue'

const mutations = {

  [types.SET_PERMISSION_ENTITIES] (state, items) {
    state.permissionEntities = items
  },

  [types.SET_APPLICATIONS] (state, items) {
    state.applications = items
  },

  [types.SET_APPLICATIONS_COUNT] (state, count) {
    state.applicationsCount = count
  },

  [types.SET_VENDOR_ROLES] (state, { items, filters }) {
    if (filters.page && filters.page > 1) {
      items.forEach(item => {
        state.vendorRoles.push(item)
      })
    } else {
      // First page
      state.vendorRoles = items
    }
  },

  [types.SET_VENDOR_ROLES_COUNT] (state, count) {
    state.vendorRolesCount = count
  },

  [types.SET_USER_VENDOR_ROLES] (state, { items, filters }) {
    if (filters.page && filters.page > 1) {
      items.forEach(item => {
        state.userVendorRoles.push(item)
      })
    } else {
      // First page
      state.userVendorRoles = items
    }
  },

  [types.SET_USER_VENDOR_ROLES_COUNT] (state, count) {
    state.userVendorRolesCount = count
  },

  [types.SET_SAML_USERS] (state, { items, filters }) {
    if (filters.page && filters.page > 1) {
      items.forEach(item => {
        state.samlUsers.push(item)
      })
    } else {
      // First page
      state.samlUsers = items
    }
  },

  [types.SET_SAML_USERS_COUNT] (state, count) {
    state.samlUsersCount = count
  },

  [types.UPDATE_VENDOR_ROLE_IN_LIST] (state, item) {
    const index = state.vendorRoles.findIndex(listItem => listItem.id === item.id)

    if (index > -1) {
      Vue.set(state.vendorRoles, index, item)
    } else {
      state.vendorRoles.push(item)
    }
  },

  [types.UPDATE_USER_VENDOR_ROLE_IN_LIST] (state, item) {
    const index = state.userVendorRoles.findIndex(listItem => listItem.id === item.id)

    if (index > -1) {
      Vue.set(state.userVendorRoles, index, item)
    } else {
      state.userVendorRoles.push(item)
    }
  },

  [types.SET_MERAKI_USERS] (state, { items, filters }) {
    if (filters.page && filters.page > 1) {
      items.forEach(item => {
        state.merakiUsers.push(item)
      })
    } else {
      // First page
      state.merakiUsers = items
    }
  },

  [types.SET_MERAKI_USERS_COUNT] (state, count) {
    state.merakiUsersCount = count
  },

  [types.SET_MERAKI_ORGANIZATION_USERS] (state, { items, filters }) {
    if (filters.page && filters.page > 1) {
      items.forEach(item => {
        state.merakiOrganizationUsers.push(item)
      })
    } else {
      // First page
      state.merakiOrganizationUsers = items
    }
  },

  [types.SET_MERAKI_ORGANIZATION_USERS_COUNT] (state, count) {
    state.merakiOrganizationUsersCount = count
  }

}

export default mutations
