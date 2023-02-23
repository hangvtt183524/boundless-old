// Mixin providing condition methods for menu item display statuses

import { mapGetters } from 'vuex'
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

export default {
  mixins: [
    UserPermissionsMixin,
    CurrentNodeSelectionsMixin
  ],

  computed: {
    ...mapGetters('layout', ['activeProductIndex', 'selectedOrganization']),
    ...mapGetters('workspace/network', ['userDashboards'])
  },

  methods: {
    checkMenuItemConditions (menuItem) {
      if (menuItem.conditions && menuItem.conditions.length) {
        for (let i = 0; i < menuItem.conditions.length; i++) {
          const condition = menuItem.conditions[i]
          const method = typeof condition === 'object' ? condition.method : condition
          const methodArguments = typeof condition === 'object' ? (condition.arguments || []) : []

          if (typeof condition === 'object' && condition.environments &&
            condition.environments.indexOf(process.env.VUE_APP_MODE) === -1) {
            // Condition is limited to environments and that list doesn't contain current environment
            continue
          }

          if (!this[method] || !this[method](...(methodArguments))) {
            return false
          }
        }
      }

      return true
    },

    isMenuItemVisible (menuItem) {
      // Check permissions
      if (!this.isMenuItemPermitted(menuItem)) {
        return false
      }

      // Check allowed product settings
      if (typeof menuItem['allowed_products'] !== 'undefined') {
        if (menuItem['allowed_products'].indexOf(this.menu[this.activeProductIndex].translation) === -1) {
          return false
        }
      }

      // Check display conditions
      if (!this.checkMenuItemConditions(menuItem)) {
        return false
      }

      // For Menu items that has no route in themselves, if non of current item's children is visible, hide current
      // item as well
      if (!menuItem.route) {
        let children = []

        if (menuItem.type === 'product') {
          children = menuItem.subgroups
        } else if (menuItem.type === 'subgroup') {
          children = menuItem.submenu
        }

        // If menu item has tabs, add tabs into children list
        if (menuItem.tabs) {
          children = children.concat(menuItem.tabs)
        }

        if (children.length > 0) {
          let isAnyChildMenuItemVisible = false
          for (let i = 0; i < children.length; i++) {
            isAnyChildMenuItemVisible = isAnyChildMenuItemVisible || this.isMenuItemVisible(children[i])

            if (isAnyChildMenuItemVisible) {
              // Once this goes through, no need to check other items
              break
            }
          }

          if (!isAnyChildMenuItemVisible) {
            return false
          }
        }
      }

      return true
    },

    isTabHeaderVisible (tab) {
      // Check permissions
      if (!this.isMenuItemPermitted(tab)) {
        return false
      }

      // Check display conditions
      if (!this.checkMenuItemConditions(tab)) {
        return false
      }

      return true
    },

    isMerakiSetup () {
      return this.selectedOrganization ? this.selectedOrganization.is_connected_to_meraki : false
    },

    isMerakiNotSetup () {
      return !this.isMerakiSetup()
    },

    restrictedToWorkspaces (workspaceIds) {
      return workspaceIds.indexOf(this.workspaceId) > -1
    },

    restrictedToOrganizations (organizationIds) {
      return organizationIds.indexOf(this.organizationId) > -1
    },

    hasDashboards () {
      return this.userDashboards[this.workspaceId] && this.userDashboards[this.workspaceId].length > 0
    },

    isGlobal () {
      return this.isPlatformAdministrator
    },

    isNotGlobal () {
      return !this.isPlatformAdministrator
    },

    hasMultipleWorkspaces () {
      return this.userWorkspaces.length > 1
    },

    hasSelectedOrganization () {
      return this.selectedOrganization && !!this.selectedOrganization.id
    },

    alwaysHidden () {
      return false
    }
  }
}
