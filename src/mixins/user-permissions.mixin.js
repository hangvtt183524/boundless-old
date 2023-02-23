import { mapGetters } from 'vuex'

import CurrentProductSelectionsMixin from '@/mixins/current-product-selections.mixin'

const UserPermissionsMixin = {

  mixins: [
    CurrentProductSelectionsMixin
  ],

  computed: {
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('layout', ['selectedWorkspace', 'selectedOrganization', 'selectedNode', 'userWorkspaces',
      'userWorkspaceOrganizations', 'userOrganizationNodes']),

    systemRoleTypes () {
      return {
        organizationAdministrator: 'administrator',
        developer: 'developer'
      }
    },
    userActions () {
      // Construct a map of user's actions on each node
      const userActions = {}
      const userRoles = this.currentUser.roles ? this.currentUser.roles : []

      userRoles.forEach(userRole => {
        if (userActions.hasOwnProperty(userRole.node)) {
          userRole.role_details.actions.forEach(actionData => {
            const actionType = actionData.action.type
            if (userActions[userRole.node].indexOf(actionType) === -1) {
              userActions[userRole.node].push(actionType)
            }
          })
        } else {
          if (!userRole.role_details || !userRole.role_details.actions) {
            return
          }
          userActions[userRole.node] = userRole.role_details.actions.map(actionData => actionData.action.type)
        }
      })

      return userActions
    },
    isPlatformAdministrator () {
      if (!this.currentUser.roles) {
        return false
      }

      return this.currentUser.roles.find(
        item => item.role_details.system_role_type === this.systemRoleTypes.developer
      ) !== undefined
    },
    isWorkspaceAdministrator () {
      if (!this.currentUser.roles || !this.workspaceId) {
        return false
      }

      return this.currentUser.roles.find(
        item => item.role_details.system_role_type === this.systemRoleTypes.administrator &&
          item.node_details.id === this.workspaceId
      ) !== undefined
    }
  },
  methods: {
    getNodeById (nodeId) {
      // Find node either from list of selected organization nodes, or from list of workspaces
      return this.userOrganizationNodes.find(node => node.id === nodeId) ||
        this.userWorkspaces.find(node => node.id === nodeId) ||
        this.userWorkspaceOrganizations.find(node => node.id === nodeId)
    },
    hasDirectPermissionOnNode (action, nodeId) {
      return this.userActions.hasOwnProperty(nodeId) && this.userActions[nodeId].indexOf(action) > -1
    },
    hasPermission (action, nodeId) {
      if (this.hasDirectPermissionOnNode(action, nodeId)) {
        return true
      } else {
        if (nodeId) {
          // Try to see if we have permission on parent level
          const nodeItem = this.getNodeById(nodeId)
          if (nodeItem) {
            let nodeParent
            if (nodeItem.type === 'workspace') {
              // Workspaces have no parent, use null by default for them
              nodeParent = null
            } else if (nodeItem.type === 'organization') {
              // For organizations, use parent_workspace as parent
              nodeParent = this.userWorkspaceOrganizations.find(node => node.id === nodeId).parent_workspace
            } else {
              nodeParent = nodeItem.parent
            }

            return this.hasPermission(action, nodeParent)
          } else {
            // Current node is not found, probably not loaded yet. Try with a global permission
            return this.hasPermission(action, null)
          }
        } else {
          // If node id is null, it means we have no parent anymore
          return false
        }
      }
    },
    hasAnyOrganizationPermission () {
      return this.userOrganizationNodes && this.userOrganizationNodes.length > 0
    },
    isMenuItemPermitted (menuItem) {
      // Check if menu item is only allowed for global managers
      if (menuItem.permission_sets) {
        // Multiple set of actions actions can be provided for a menu item. Each set should be ORred, and each item
        // in a set should be ANDed

        // Get comparison node id for type defined in menu item
        let nodeId
        if (menuItem.permission_scope) {
          if (menuItem.permission_scope === 'workspace') {
            nodeId = this.selectedWorkspace ? this.selectedWorkspace.id : null
          } else if (menuItem.permission_scope === 'organization') {
            nodeId = this.selectedOrganization ? this.selectedOrganization.id : null
          } else if (menuItem.permission_scope === 'node') {
            nodeId = this.selectedNode ? this.selectedNode.id : null
          }
        } else {
          // No permission scope defined. Use workspace id.
          nodeId = this.selectedWorkspace ? this.selectedWorkspace.id : null
        }

        let hasPermission = false
        menuItem.permission_sets.forEach(permissionSet => {
          let isPermissionSetPasses = true
          permissionSet.forEach(action => {
            isPermissionSetPasses = (isPermissionSetPasses && this.hasPermission(action, nodeId))
          })

          hasPermission = hasPermission || isPermissionSetPasses
        })

        if (!hasPermission) {
          return false
        }
      }

      return true
    },
    isProductPermitted (product) {
      if (!product.product_permission_sets) {
        // No product permission sets defined, return true directly
        return true
      }

      // If an organization product, check for organization id. Otherwise check for workspace id
      const permissionCheckNodeId = this.organizationProducts.indexOf(product.identifier) > -1
        ? this.organizationId
        : this.workspaceId

      let hasPermission = false
      product.product_permission_sets.forEach(permissionSet => {
        let isPermissionSetPasses = true
        permissionSet.forEach(action => {
          isPermissionSetPasses = isPermissionSetPasses && (
            // Must have permission defined on workspace / organization or global level
            this.hasDirectPermissionOnNode(action, permissionCheckNodeId) ||
            this.hasDirectPermissionOnNode(action, null)
          )
        })

        hasPermission = hasPermission || isPermissionSetPasses
      })

      return hasPermission
    }
  }
}

export default UserPermissionsMixin
