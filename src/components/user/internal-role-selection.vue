<template lang="pug">
  .internal-role-selection(
    v-show="roles.length > 0"
  )
    .internal-role-selection__internal-switch
      v-layout(
        row wrap
      )
        v-flex(xs4 md3 lg2)
          label {{ $t('v2.user.internalUser') }}:
        v-flex(xs4 md6 lg4)
          base-switch(
            v-model="isInternalUser"
          )
        v-flex(xs4 md3 lg6)
          .internal-role-selection__add-to-organization-button-container(
            :class="{'internal-role-selection__add-to-organization-button-container--active': isAddToWorkspaceVisible}"
          )
            .internal-role-selection__add-to-organization-button(
              @click="onAddToWorkspaceClick"
            ) {{ $t('v2.user.addToWorkspace') }}

    transition( name="slide")
      .internal-role-selection__existing-role-view(
        v-show="!isAddToWorkspaceVisible"
      )
        <!-- Internal role selection -->
        v-layout.internal-role-selection__internal-role-select(
          row wrap
          v-show="isInternalUser"
        )
          v-flex(xs4 md3 lg2)
            label {{ $t('general.role') }}:
          v-flex(xs8 md6 lg4)
            base-select(
              v-model="selectedInternalRole"
              :items="internalRoleOptions"
              :validations="{ required: true }"
              :search-enabled="true"
              :search-placeholder="$t('v2.user.selectRole')"
            )

        <!-- Organization level role selection -->
        base-table.internal-role-selection__organization-role-table(
          v-show="!isInternalUser"
          :items="userOrganizationWorkspaceRoles"
          :headers="userOrganizationRolesTableHeaders"
          :actions="userOrganizationRolesTableActions"
          :is-expandable="true"
          :sortable="false"
          :always-editable="true"
          @actionClick="onOrganizationRoleTableActionClick"
          @itemInput="onOrganizationRoleTableItemInput"
          ref="organizationRoleTable"
        )
          template(
            v-slot:row-expand-area='props'
          )
            .internal-role-selection__organization-role-table__detail-role-selection
              label {{ $t('v2.user.customAccess') }}
              organization-detail-role-selection(
                v-if="props.props.item.nodeType === nodeTypes.organization"
                v-model="props.props.item.roles"
                :organization="props.props.item.rootNodeId"
                :workspace="props.props.item.parentWorkspaceId"
                mode="internal"
              )
              workspace-detail-role-selection(
                v-if="props.props.item.nodeType === nodeTypes.workspace"
                v-model="props.props.item.roles"
                :workspace="props.props.item.rootNodeId"
                mode="internal"
              )

    transition( name="slide")
      .internal-role-selection__add-role-view(
        v-show="isAddToWorkspaceVisible"
      )
        add-user-to-workspace(
          @addClick="onAddToWorkspaceSaveClick"
          @cancelClick="onAddToWorkspaceCancelClick"
          ref="addToWorkspace"
        )

</template>

<script>
import { mapActions } from 'vuex'
import { booleanFormatter } from '@/utils/global-cell-formatters'
import BaseTable from '@/components/v2/base-table/base-table'
import BaseSwitch from '@/components/v2/base-switch/base-switch.vue'
import BaseSelect from '@/components/v2/base-select/base-select.vue'
import OrganizationDetailRoleSelection from '@/components/user/organization-detail-role-selection'
import WorkspaceDetailRoleSelection from './workspace-detail-role-selection'
import AddUserToWorkspace from './add-user-to-workspace'

export default {
  name: 'internal-role-selection',
  components: {
    AddUserToWorkspace,
    BaseTable,
    BaseSwitch,
    BaseSelect,
    OrganizationDetailRoleSelection,
    WorkspaceDetailRoleSelection
  },
  props: {
    userRoles: {
      type: Array,
      required: false
    }
  },
  data: function () {
    return {
      roles: [],
      isInternalUser: false,
      selectedInternalRole: null,
      userOrganizationWorkspaceRoles: [],
      userOrganizationRolesTableHeaders: [
        {
          text: this.$t('general.name'),
          value: 'rootNodeName'
        },
        {
          text: this.$t('wifi.type'),
          value: 'nodeType',
          formatter: (value) => {
            return value.charAt(0).toUpperCase() + value.slice(1)
          }
        },
        {
          text: this.$t('v2.user.administrator'),
          value: 'isAdministrator',
          editable: true,
          type: Boolean,
          formatter: booleanFormatter
        }
      ],
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
        workspace: 'workspace',
        organization: 'organization',
        group: 'group',
        site: 'site'
      },
      isAddToWorkspaceVisible: false
    }
  },
  mounted () {
    this.fetchGlobalRoles()
    this.setInitialUserRoles()

    // Emit selection on mount
    this.onSelectionChange()
  },
  computed: {
    internalRoleOptions () {
      return this.roles.filter(role => {
        return role.allowed_node_types.indexOf(this.nodeTypes.global) > -1
      }).map(role => {
        return {
          key: role.id,
          name: role.title
        }
      }).sort((first, second) => {
        if (first.name.toLowerCase() > second.name.toLowerCase()) {
          return 1
        } else if (second.name.toLowerCase() > first.name.toLowerCase()) {
          return -1
        }

        return 0
      })
    },
    administratorRole () {
      return this.roles.filter(role => {
        return role.system_role_type === 'administrator'
      })[0]
    }
  },
  watch: {
    userRoles: {
      handler: function () {
        this.setInitialUserRoles()
      },
      deep: true
    },
    internalRoleOptions: {
      handler: function () {
        this.setInitialUserRoles()
      },
      deep: true
    },
    userOrganizationWorkspaceRoles: {
      handler: function () {
        this.onSelectionChange()
      },
      deep: true
    },
    isInternalUser: {
      handler: function () {
        this.onSelectionChange()
      }
    },
    selectedInternalRole: {
      handler: function () {
        this.onSelectionChange()
      }
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
    fetchGlobalRoles () {
      const filters = {
        page_size: 0,
        organization: 0
      }
      this.fetchRoles(filters).then(response => {
        this.$set(this, 'roles', response.data.data)
      })
    },
    setInitialUserRoles () {
      // Set internal role selection
      const userInternalRole = this.userRoles.filter(userRole => {
        return userRole.node === null
      })[0]

      if (userInternalRole) {
        this.selectedInternalRole = userInternalRole.role.id
        this.isInternalUser = true
      }

      // Set organization / workspace level role selections
      const userOrganizationWorkspaceRoles = []
      this.userRoles.filter(userRole => {
        return userRole.node !== null
      }).forEach(userRole => {
        const roleRootNodeData = userRole.organization ? {
          id: userRole.organization.id,
          name: userRole.organization.name,
          nodeType: this.nodeTypes.organization,
          parentWorkspaceId: userRole.organization.parent_workspace
        } : {
          id: userRole.node.id,
          name: userRole.node.name,
          nodeType: this.nodeTypes.workspace,
          parentWorkspaceId: userRole.node.id
        }

        const existingItem = userOrganizationWorkspaceRoles.filter(roleData => {
          return roleData.rootNodeId === roleRootNodeData.id
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
            rootNodeId: roleRootNodeData.id,
            rootNodeName: roleRootNodeData.name,
            parentWorkspaceId: roleRootNodeData.parentWorkspaceId,
            nodeType: roleRootNodeData.nodeType,
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
        return (b.nodeType === this.nodeTypes.workspace) - (a.nodeType === this.nodeTypes.workspace) ||
          -(a.id > b.id) || +(a.id < b.id)
      })

      // Set administrator flag for each role data
      userOrganizationWorkspaceRoles.forEach(roleData => {
        if (roleData.roles.filter(userRole => {
          return userRole.role.system_role_type === this.system_role_types.administrator
        }).length > 0) {
          roleData.isAdministrator = true
        }
      })

      this.$set(this, 'userOrganizationWorkspaceRoles', userOrganizationWorkspaceRoles)
    },
    onOrganizationRoleTableItemInput (item, field, value) {
      this.$set(item, field, value)

      if (item.isAdministrator) {
        // If item is updated to be administrator, set its roles accordingly
        this.$set(item, 'roles', [{
          node: { id: item.rootNodeId },
          role: { id: this.administratorRole.id }
        }])
      } else {
        // If item is updated not to be administrator, remove such role if exists
        this.$set(item, 'roles', item.roles.filter(userRole => {
          return !(userRole.node.id === item.rootNodeId && userRole.role.id === this.administratorRole.id)
        }))

        // Expand row
        this.$refs.organizationRoleTable.expandRow(item)
      }
    },
    onOrganizationRoleTableActionClick (actionType, item) {
      if (actionType === 'remove') {
        this.userOrganizationWorkspaceRoles.splice(this.userOrganizationWorkspaceRoles.indexOf(item), 1)
      }
    },
    onAddToWorkspaceClick () {
      if (this.isAddToWorkspaceVisible) {
        this.closeAddToWorkspaceView()
      } else {
        this.isAddToWorkspaceVisible = true
      }
    },
    closeAddToWorkspaceView () {
      this.isAddToWorkspaceVisible = false

      if (!this.isAddToWorkspaceVisible) {
        this.$refs.addToWorkspace.reset()
      }
    },
    onAddToWorkspaceSaveClick (userRoles) {
      this.$emit('addToWorkspaceClick', userRoles)
    },
    onAddToWorkspaceCancelClick () {
      this.isAddToWorkspaceVisible = false
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
      })

      // Add internal role, if any
      if (this.isInternalUser) {
        roles.push({
          node: null,
          role: { id: this.selectedInternalRole }
        })
      }

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

  .internal-role-selection {
    &__internal-switch {
      height: 60px;
    }

    &__add-to-organization-button-container {
      float: right;
      padding: 0 22px;
      height: 60px;

      &--active {
        background-color: $gray-xlight;
      }
    }

    &__add-to-organization-button {
      cursor: pointer;
      display: inline-block;

      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 15px;
      line-height: 30px;
      text-decoration-line: underline;
      color: $blue-reserve;
    }

    label {
      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 36px;
      color: $text-medium;
    }

    &__internal-role-select {
      margin-top: 15px;

      label {
        line-height: 40px;
      }
    }

    &__organization-role-table {
      margin-top: 28px;

      &__detail-role-selection {
        background-color: $gray-xlight;
        padding: 23px 40px;
      }
    }

    .slide-enter-active {
      transition-duration: 0.5s;
      transition-timing-function: cubic-bezier(.25,.8,.5,1);
    }

    .slide-leave-active {
      transition-duration: 0.2s;
      transition-timing-function: cubic-bezier(.25,.8,.5,1);
    }

    .slide-enter-to, .slide-leave {
      max-height: 240px;
      overflow: hidden;
    }

    .slide-enter, .slide-leave-to {
      overflow: hidden;
      max-height: 0;
    }
  }
</style>
