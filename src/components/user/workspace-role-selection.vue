<template lang="pug">
  .workspace-role-selection
    <!-- Workspace provided from parent -->
    .workspace-role-selection__administrator-switch(
      v-if="isStaticMode"
    )
      label {{ forInvitation ? $t('v2.user.inviteAsAdministrator'): $t('v2.user.administrator') }}:
      base-switch(
        v-model="isAdministrator"
      )

    <!-- Workspace not provided from parent, select workspace  -->
    v-layout.workspace-role-selection__workspace-selection(
      row wrap
      v-else
    )
      v-flex(xs12 md6 lg4)
        label {{ $t('v2.user.selectWorkspace') }}
        base-select(
          v-model="selectedWorkspace"
          :items="workspaceOptions"
          :validations="{ required: true }"
          :search-enabled="true"
          :search-placeholder="$t('v2.user.selectWorkspace')"
        )
      v-flex(xs12 md6 lg4)
        label {{ forInvitation ? $t('v2.user.inviteAsAdministrator'): $t('v2.user.administrator') }}
        base-switch(
          v-model="isAdministrator"
        )

    <!-- Custom role selection for selected workspace -->
    .workspace-role-selection__custom-role-selection(
      v-if="!isAdministrator && selectedWorkspace"
    )
      label {{ $t('v2.user.customAccess') }}
      workspace-detail-role-selection(
        v-model="customRoleSelections"
        :workspace-roles="nonAdminRoleOptions"
        :workspace="selectedWorkspace"
        :mode="mode"
      )
</template>

<script>
import BaseSwitch from '@/components/v2/base-switch/base-switch.vue'
import BaseSelect from '@/components/v2/base-select/base-select.vue'
import WorkspaceDetailRoleSelection from '@/components/user/workspace-detail-role-selection'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'workspace-role-selection',
  components: {
    BaseSwitch,
    BaseSelect,
    WorkspaceDetailRoleSelection
  },
  props: {
    workspace: {
      type: Number,
      required: false
    },
    userRoles: {
      type: Array,
      required: false
    },
    forInvitation: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: 'workspace'
    }
  },
  data: function () {
    return {
      roles: [],
      customRoleSelections: [],
      selectedWorkspace: null,
      isAdministrator: true,
      system_role_types: {
        administrator: 'administrator'
      }
    }
  },
  mounted () {
    if (this.workspace) {
      this.selectedWorkspace = this.workspace
    }

    this.setInitialUserRoles()

    // Emit selection on mount
    this.onSelectionChange()
  },
  computed: {
    ...mapGetters('layout', ['userWorkspaces']),
    workspaceOptions () {
      return this.userWorkspaces.map(workspace => {
        return {
          key: workspace.id,
          name: workspace.name
        }
      })
    },
    roleOptions () {
      return this.roles
    },
    nonAdminRoleOptions () {
      return this.roles.filter(role => {
        return role.system_role_type !== this.system_role_types.administrator
      })
    },
    administratorRole () {
      return this.roles.filter(role => {
        return role.system_role_type === this.system_role_types.administrator
      })[0]
    },
    isStaticMode () {
      // If workspace is provided as a prop, view is in static mode
      return !!this.workspace
    }
  },
  watch: {
    selectedWorkspace: {
      handler: function () {
        // Fetch workspace roles
        this.fetchWorkspaceRoles()

        // Clear custom role node selections on workspace change
        if (!this.isStaticMode) {
          this.customRoleSelections.forEach(roleSelection => {
            this.$set(roleSelection.node, 'id', null)
          })
        }

        this.onSelectionChange()
      }
    },
    customRoleSelections: {
      handler: function () {
        this.onSelectionChange()
      },
      deep: true
    },
    isAdministrator: {
      handler: function () {
        this.onSelectionChange()
      }
    },
    roles: {
      handler: function () {
        // Emit selection after roles is loaded
        this.onSelectionChange()
      }
    },
    userRoles: {
      handler: function () {
        // Set initial user roles
        this.setInitialUserRoles()
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('administration', ['fetchRoles']),
    fetchWorkspaceRoles () {
      const filters = {
        page_size: 0,
        workspace: this.selectedWorkspace,
        node_types: 'workspace'
      }
      this.fetchRoles(filters).then(response => {
        this.$set(this, 'roles', response.data.data)
      })
    },
    setInitialUserRoles () {
      if (this.userRoles) {
        this.customRoleSelections = this.userRoles.map(userRole => {
          return {
            role: {
              ...userRole.role
            },
            node: {
              ...userRole.node
            }
          }
        })

        if (this.workspace) {
          this.isAdministrator = this.userRoles.filter(userRole => {
            return userRole.role.system_role_type === this.system_role_types.administrator &&
              (userRole.node && userRole.node.id === this.workspace)
          }).length > 0
        }
      }
    },
    onSelectionChange () {
      let roles
      if (this.isAdministrator) {
        roles = [{
          node: { id: this.selectedWorkspace },
          role: { id: this.administratorRole.id }
        }]
      } else {
        roles = this.customRoleSelections
      }

      this.$emit('selectionChange', {
        workspace: this.selectedWorkspace,
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

    &__administrator-switch {
      label {
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 15px;
        line-height: 30px;
        color: $text-dark;
        margin-right: 18px;
      }
    }

    &__workspace-selection {
      label {
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 30px;
        color: $text-medium;
      }

      .flex:first-child {
        margin-right: 30px;
      }
    }

    &__custom-role-selection {
      margin-top: 38px;

      label {
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 15px;
        line-height: 22px;
        color: $text-medium;
      }
    }
  }

</style>
