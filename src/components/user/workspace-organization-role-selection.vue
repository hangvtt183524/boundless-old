<template lang="pug">
  .workspace-role-selection(
    v-show="roles.length > 0"
  )
    .workspace-role-selection__existing-role-view(
      v-show="!isAddToOrganizationVisible"
    )
      <!-- Organization level role selection -->
      base-table.workspace-role-selection__organization-role-table(
        :items="userOrganizationWorkspaceRoles"
        :headers="userOrganizationRolesTableHeaders"
        :actions="userOrganizationRolesTableActions"
        :is-expandable="true"
        :sortable="false"
        :always-editable="true"
        :expandable-row-filter="roleTableExpandableRowFilter"
        @actionClick="onRoleTableActionClick"
        @itemInput="onRoleTableItemInput"
        ref="organizationRoleTable"
      )
        template(
          v-slot:row-expand-area='props'
        )
          .workspace-role-selection__organization-role-table__detail-role-selection
            label {{ $t('v2.user.customAccess') }}
            workspace-detail-role-selection(
              v-if="props.props.item.id === workspace"
              v-model="props.props.item.roles"
              :workspace="props.props.item.id"
              :workspace-roles="roles"
              mode="workspace"
            )
            organization-detail-role-selection(
              v-if="props.props.item.id !== workspace"
              v-model="props.props.item.roles"
              :organization="props.props.item.id"
              :workspace="workspace"
              :workspace-roles="roles"
              mode="workspace"
            )
      span.workspace-role-selection__add-role-trigger(
        @click="onAddRoleClick"
      ) + {{ $t('v2.user.addToWorkspaceOrganization') }}

</template>

<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import { booleanFormatter } from '@/utils/global-cell-formatters'
import BaseTable from '@/components/v2/base-table/base-table'
import BaseSwitch from '@/components/v2/base-switch/base-switch.vue'
import BaseSelect from '@/components/v2/base-select/base-select.vue'
import OrganizationDetailRoleSelection from '@/components/user/organization-detail-role-selection'
import AddUserToOrganization from './add-user-to-organization'
import WorkspaceDetailRoleSelection from './workspace-detail-role-selection'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

export default {
  name: 'workspace-organization-role-selection',
  components: {
    WorkspaceDetailRoleSelection,
    AddUserToOrganization,
    BaseTable,
    BaseSwitch,
    BaseSelect,
    OrganizationDetailRoleSelection
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  props: {
    workspace: {
      type: Number,
      required: true
    },
    userRoles: {
      type: Array,
      required: false
    },
    workspaceRoles: {
      type: Array,
      required: false
    }
  },
  data: function () {
    return {
      roles: [],
      userOrganizationWorkspaceRoles: [],
      userOrganizationRolesTableActions: [
        {
          icon: '$vuetify.icons.delete',
          type: 'remove'
        }
      ],
      system_role_types: {
        administrator: 'administrator'
      },
      nodeTypes: {
        global: 'global',
        organization: 'organization',
        group: 'group',
        site: 'site',
        workspace: 'workspace'
      },
      isAddToOrganizationVisible: false
    }
  },
  mounted () {
    if (this.workspaceRoles) {
      this.roles = _.cloneDeep(this.workspaceRoles)
    } else {
      this.fetchWorkspaceRoles()
    }

    if (this.userRoles) {
      this.setInitialUserRoles()
    }

    // Emit selection on mount
    this.onSelectionChange()
  },
  computed: {
    ...mapGetters('layout', ['userWorkspaceOrganizations']),
    administratorRole () {
      return this.roles.filter(role => {
        return role.system_role_type === this.system_role_types.administrator
      })[0]
    },
    activeRootNodesIds () {
      return this.userOrganizationWorkspaceRoles.map(item => item.id)
    },
    rootNodeOptions () {
      return [{
        key: this.selectedWorkspace.id,
        name: `Workspace: ${this.selectedWorkspace.name}`,
        disabled: this.activeRootNodesIds.indexOf(this.selectedWorkspace.id) > -1
      }].concat(this.userWorkspaceOrganizations.map(organization => {
        return {
          key: organization.id,
          name: organization.name,
          disabled: this.activeRootNodesIds.indexOf(organization.id) > -1
        }
      }))
    },
    userOrganizationRolesTableHeaders () {
      return [
        {
          text: this.$t('general.name'),
          value: 'id',
          editable: true,
          options: this.rootNodeOptions
        },
        {
          text: this.$t('v2.user.administrator'),
          value: 'isAdministrator',
          editable: true,
          type: Boolean,
          formatter: booleanFormatter,
          hidden: (value, item) => {
            return !item.id
          }
        }
      ]
    }
  },
  watch: {
    userRoles: {
      handler: function () {
        this.setInitialUserRoles()
      },
      deep: true
    },
    userOrganizationWorkspaceRoles: {
      handler: function () {
        this.onSelectionChange()

        this.normalizeRoleAdministratorFlags()
      },
      deep: true
    },
    roles: {
      handler: function () {
        // Emit selection after roles is loaded
        this.onSelectionChange()
      }
    }
  },
  methods: {
    ...mapActions('administration', ['fetchRoles']),
    fetchWorkspaceRoles () {
      const filters = {
        page_size: 0,
        workspace: this.workspace
      }
      this.fetchRoles(filters).then(response => {
        this.$set(this, 'roles', response.data.data)
      })
    },
    setInitialUserRoles () {
      // Set organization level role selections
      const userOrganizationWorkspaceRoles = []
      this.userRoles.forEach(userRole => {
        const roleRootNodeData = userRole.organization ? {
          id: userRole.organization.id,
          name: userRole.organization.name
        } : {
          id: userRole.node.id,
          name: userRole.node.name
        }

        const existingItem = userOrganizationWorkspaceRoles.filter(roleData => {
          return roleData.id === roleRootNodeData.id
        })[0]

        if (existingItem) {
          existingItem.roles.push({
            node: {
              ...userRole.node
            },
            role: {
              ...userRole.role
            }
          })
        } else {
          userOrganizationWorkspaceRoles.push({
            id: roleRootNodeData.id,
            isAdministrator: false,
            roles: [{
              role: {
                ...userRole.role
              },
              node: {
                ...userRole.node
              }
            }]
          })
        }
      })

      // Sort so that workspace roles come first, then organization roles
      userOrganizationWorkspaceRoles.sort((a, b) => {
        return (b.id === this.workspace) - (a.id === this.workspace) ||
          -(a.id > b.id) || +(a.id < b.id)
      })

      // Set administrator flag for each role data
      userOrganizationWorkspaceRoles.forEach(roleData => {
        if (roleData.roles.filter(userRole => userRole.role.system_role_type === this.system_role_types.administrator).length > 0) {
          roleData.isAdministrator = true
        }
      })

      this.$set(this, 'userOrganizationWorkspaceRoles', userOrganizationWorkspaceRoles)
    },
    normalizeRoleAdministratorFlags () {
      if (!this.administratorRole) {
        return
      }

      this.userOrganizationWorkspaceRoles.forEach(roleData => {
        if (roleData.roles.filter(userRole => userRole.role.id === this.administratorRole.id && userRole.node.id === roleData.id).length > 0) {
          this.$set(roleData, 'isAdministrator', true)
        } else {
          this.$set(roleData, 'isAdministrator', false)
        }
      })
    },
    roleTableExpandableRowFilter (item) {
      return !!item.id
    },
    onRoleTableItemInput (item, field, value) {
      this.$set(item, field, value)

      if (field === 'id') {
        // If root node changes, clear roles and expand row
        this.$set(item, 'roles', [{
          node: {
            id: value
          },
          role: {
            id: null
          }
        }])

        this.$refs.organizationRoleTable.expandRow(item)
      } else if (field === 'isAdministrator') {
        if (item.isAdministrator) {
          // If item is updated to be administrator, set its roles accordingly
          this.$set(item, 'roles', [{
            node: { id: item.id },
            role: { id: this.administratorRole.id }
          }])
        } else {
          // If item is updated not to be administrator, remove such role if exists
          this.$set(item, 'roles', item.roles.filter(userRole => {
            return !(userRole.node.id === item.id &&
              userRole.role.id === this.administratorRole.id)
          }))

          // Expand row
          this.$refs.organizationRoleTable.expandRow(item)
        }
      }
    },
    onRoleTableActionClick (actionType, item) {
      if (actionType === 'remove') {
        this.userOrganizationWorkspaceRoles.splice(this.userOrganizationWorkspaceRoles.indexOf(item), 1)
      }
    },
    onAddRoleClick () {
      this.userOrganizationWorkspaceRoles.push({
        id: null,
        isAdministrator: false,
        roles: []
      })
    },
    onSelectionChange () {
      let roles = []

      // Get organization-level roles
      this.userOrganizationWorkspaceRoles.forEach(roleData => {
        roleData.roles.forEach(nodeRole => {
          roles.push({
            role: nodeRole.role,
            node: nodeRole.node
          })
        })

        // Add empty selection if no roles present
        if (roleData.roles.length === 0) {
          roles.push({
            role: {
              id: null
            },
            node: {
              id: roleData.id
            }
          })
        }
      })

      this.$emit('selectionChange', {
        roles: roles
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/base.scss";
  @import "styles/v2/colors.scss";

  .workspace-role-selection {
    position: relative;

    label {
      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 36px;
      color: $text-medium;
    }

    &__organization-role-table {
      margin-top: 28px;

      &__detail-role-selection {
        background-color: $gray-xlight;
        padding: 23px 40px;
      }
    }

    &__add-role-trigger {
      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 15px;
      line-height: 35px;
      text-decoration-line: underline;
      color: $green-medium;
      cursor: pointer;
    }
  }
</style>
