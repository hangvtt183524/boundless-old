<template lang="pug">
  .organization-role-selection
    <!-- Organization provided from parent -->
    .organization-role-selection__administrator-switch(
      v-if="isStaticMode"
    )
      label {{ $t('v2.user.organizationAdministrator') }}:
      base-switch(
        v-model="isOrganizationAdministrator"
      )

    <!-- Organization not provided from parent, select organization  -->
    v-layout.organization-role-selection__organization-selection(
      row wrap
      v-else
    )
      v-flex(xs12 md6 lg4)
        label {{ $t('v2.user.selectOrganization') }}
        base-select(
          v-model="selectedOrganization"
          :items="organizationOptions"
          :validations="{ required: true }"
          :search-enabled="true"
          :search-placeholder="$t('v2.user.selectOrganization')"
        )
      v-flex(xs12 md6 lg6)
        label {{ $t('v2.user.organizationAdministrator') }}
        base-switch(
          v-model="isOrganizationAdministrator"
        )

    <!-- Custom role selection for selected organization -->
    .organization-role-selection__custom-role-selection(
      v-if="!isOrganizationAdministrator && selectedOrganization"
    )
      label {{ $t('v2.user.customAccess') }}
      organization-detail-role-selection(
        v-model="customRoleSelections"
        :workspace-roles="nonOrgAdminRoleOptions"
        :organization="selectedOrganization"
        :workspace="selectedWorkspace.id"
      )
</template>

<script>
import BaseSwitch from '@/components/v2/base-switch/base-switch.vue'
import BaseSelect from '@/components/v2/base-select/base-select.vue'
import OrganizationDetailRoleSelection from '@/components/user/organization-detail-role-selection'
import { mapGetters } from 'vuex'

export default {
  name: 'organization-role-selection',
  components: {
    BaseSwitch,
    BaseSelect,
    OrganizationDetailRoleSelection
  },
  props: {
    organization: {
      type: Number,
      required: false
    },
    workspaceRoles: {
      type: Array,
      required: true
    },
    userRoles: {
      type: Array,
      required: false
    }
  },
  data: function () {
    return {
      roles: [],
      customRoleSelections: [],
      selectedOrganization: null,
      selectedOrganizationNodes: [],
      isOrganizationAdministrator: true,
      system_role_types: {
        administrator: 'administrator'
      }
    }
  },
  mounted () {
    this.$set(this, 'roles', this.workspaceRoles)

    if (this.organization) {
      this.selectedOrganization = this.organization
    }

    this.setInitialUserRoles()

    // Emit selection on mount
    this.onSelectionChange()
  },
  computed: {
    ...mapGetters('layout', ['selectedWorkspace', 'userWorkspaceOrganizations']),
    organizationOptions () {
      return this.userWorkspaceOrganizations.map(organization => {
        return {
          key: organization.id,
          name: organization.name
        }
      })
    },
    roleOptions () {
      return this.roles
    },
    nonOrgAdminRoleOptions () {
      return this.roles.filter(role => {
        return role.system_role_type !== 'administrator'
      })
    },
    administratorRole () {
      return this.roles.filter(role => {
        return role.system_role_type === 'administrator'
      })[0]
    },
    isStaticMode () {
      // If organization is provided as a prop, view is in static mode
      return !!this.organization
    }
  },
  watch: {
    selectedOrganization: {
      handler: function () {
        // Clear custom role node selections on organization change
        if (!this.isStaticMode) {
          this.customRoleSelections.forEach(roleSelection => {
            this.$set(roleSelection.node, 'id', null)
          })
        }

        this.onSelectionChange()
      }
    },
    workspaceRoles: {
      handler: function () {
        if (this.workspaceRoles) {
          this.$set(this, 'roles', this.workspaceRoles)
        }
      },
      deep: true
    },
    customRoleSelections: {
      handler: function () {
        this.onSelectionChange()
      },
      deep: true
    },
    isOrganizationAdministrator: {
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

        if (this.organization) {
          this.isOrganizationAdministrator = this.userRoles.filter(userRole => {
            return userRole.role.system_role_type === this.system_role_types.administrator &&
              (userRole.node && userRole.node.id === this.organization)
          }).length > 0
        }
      }
    },
    onSelectionChange () {
      let roles
      if (this.isOrganizationAdministrator) {
        roles = [{
          node: { id: this.selectedOrganization },
          role: { id: this.administratorRole.id }
        }]
      } else {
        roles = this.customRoleSelections
      }

      this.$emit('selectionChange', {
        organization: this.selectedOrganization,
        roles: roles
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/base.scss";
  @import "styles/v2/colors.scss";

  .organization-role-selection {

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

    &__organization-selection {
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
