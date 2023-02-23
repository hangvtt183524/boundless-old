<template lang="pug">
  .vendor-role-selection(
    :class="{'vendor-role-selection--no-existing-roles': vendorRoleOptions.length === 0}"
  )
    v-layout.vendor-role-selection__row(
      row wrap
    )
      v-flex.vendor-role-selection__header-column(xs12 md6 lg3 xl2)
        base-switch(
          v-show="vendorRoleOptions.length > 0"
          v-model="useExistingVendorRole"
          :yes-label="$t('v2.access.existingRole')"
          :no-label="$t('v2.access.newRole')"
        )

        base-select(
          v-if="useExistingVendorRole"
          :value="value"
          :items="vendorRoleOptions"
          @input="$emit('input', $event)"
          :label="$t('v2.access.selectRoleToApply')"
          :placeholder="$t('v2.access.selectPermissions')"
        )

        base-text-input(
          v-if="!useExistingVendorRole"
          v-model="vendorRole.name"
          :label="$t('v2.access.enterNameToSavePermissionsAs')"
          :placeholder="$t('v2.access.roleName')"
          :validations="{ required: true }"
        )
      v-flex.vendor-role-selection__header-column(xs12 lg9 xl10)
        base-multi-select.base-multi-select--nowrap(
          v-if="!useExistingVendorRole || value"
          v-model="vendorRole.hidden_sections"
          :items="sectionOptions"
          :label="$t('v2.access.selectSectionsToHide')"
        )

    v-layout.vendor-role-selection__row.network-selection-row(row wrap)
      v-flex.vendor-role-selection__column(xs12)
        role-access-selection(
          v-if="!useExistingVendorRole || value"
          :key="useExistingVendorRole"
          :value="getVendorPermissions(vendor)"
          @input="onVendorPermissionsInput(vendor, $event)"
          :vendor="vendor"
          :is-existing-role="useExistingVendorRole"
        )

</template>

<script>
import { mapGetters } from 'vuex'
import BaseTable from '@/components/v2/base-table/base-table'
import BaseSelect from '@/components/v2/base-select/base-select'
import BaseSwitch from '@/components/v2/base-switch/base-switch'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import RoleAccessSelection from '../permissions/role-access-selection'
import BaseMultiSelect from '@/components/v2/base-multi-select/base-multi-select'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

export default {
  name: 'vendor-role-selection',
  components: {
    RoleAccessSelection,
    BaseTable,
    BaseSelect,
    BaseSwitch,
    BaseTextInput,
    BaseMultiSelect
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data: function () {
    return {
      loading: false,
      vendor: 'meraki', // Fixed for now
      fullAccessValue: 'full',
      useExistingVendorRole: true,
      vendorRole: {},
      sectionOptions: ['help', 'search', 'view_all_networks', 'create_networks'].map(item => {
        return {
          key: item,
          name: this.$t(`v2.access.sections.${item}`)
        }
      })
    }
  },
  computed: {
    ...mapGetters('workspace/access', ['vendorRoles']),
    vendorRoleOptions () {
      return this.vendorRoles.map(item => {
        return {
          key: item.id,
          name: item.name
        }
      })
    },
    selectedVendorRole () {
      return this.vendorRoles.find(item => item.id === this.value)
    }
  },
  watch: {
    value: {
      handler: function (newVal, oldVal) {
        if (newVal !== oldVal && this.vendorRoles.length > 0) {
          // Set vendorRole object on selection change
          if (newVal) {
            this.$set(this, 'vendorRole', {
              ...this.selectedVendorRole
            })

            // May happen on new vendor role creating through this wizard
            if (!this.useExistingVendorRole) {
              this.useExistingVendorRole = true
            }
          }
        }
      },
      immediate: true
    },
    vendorRoles () {
      // Set vendorRole when roles finish loading, if an initial value is set
      if (this.value) {
        this.$set(this, 'vendorRole', {
          ...this.selectedVendorRole
        })
      }

      if (this.vendorRoleOptions.length === 0) {
        // If no available vendor role option exists, set default value of vendor role selection to "create new"
        this.useExistingVendorRole = false
      }
    },
    useExistingVendorRole (newVal) {
      if (newVal) {
        if (this.value) {
          // If an existing role is selected, set it as vendorRole
          this.$set(this, 'vendorRole', {
            ...this.selectedVendorRole
          })
        } else {
          // Re-set vendor role otherwise
          this.$set(this, 'vendorRole', {})
        }
      } else {
        // De-select selected vendor role, if any
        this.$emit('input', null)

        // If set to create new vendor role, initialize empty vendor role object as vendorRole
        this.$set(this, 'vendorRole', this.getEmptyVendorRole())
      }
    },
    vendorRole: {
      handler: function () {
        this.$emit('vendorRoleDataChange', this.vendorRole)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getEmptyVendorRole () {
      return {
        name: '',
        permissions: [],
        hidden_sections: this.sectionOptions.map(option => option.key), // All selected by default
        workspace: this.workspaceId
      }
    },
    getVendorPermissions (vendor) {
      // TODO: Remove code duplication with vendor role detail screen here
      const vendorPermissions = this.vendorRole.permissions
        ? this.vendorRole.permissions.find(rootEntity => rootEntity.key === vendor)
        : null

      return vendorPermissions || {
        key: vendor,
        access: this.fullAccessValue,
        children: []
      }
    },
    onVendorPermissionsInput (vendor, value) {
      // TODO: Remove code duplication with vendor role detail screen here
      const existingPermissions = (this.vendorRole.permissions ? this.vendorRole.permissions : [])
      let updatedPermissions

      if (value && value.children && value.children.length > 0) {
        // Entity selected
        updatedPermissions = existingPermissions.find(child => child.key === value.key)
          ? existingPermissions.map(rootEntity => {
            return rootEntity.key === vendor ? value : rootEntity
          })
          : existingPermissions.concat([value])
      } else {
        // Entity de-selected
        updatedPermissions = existingPermissions.filter(child => child.key !== vendor)
      }

      // If root entity already part of permission selection value, replace it with new value.
      // Otherwise add it to permissions
      this.$set(this.vendorRole, 'permissions', updatedPermissions)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.vendor-role-selection {

  .base-switch-container {
    margin-bottom: 10px;
  }

  &__row:not(:last-child) {
    padding-bottom: 30px;
    margin-bottom: 30px;
    border-bottom: 3px solid $gray-xlight;
  }
}

@media only screen and (min-width: 1264px) {
  .vendor-role-selection {
    height: 100%;

    &__header-column:last-child {
      padding-left: 30px;
      padding-top: 40px;
    }

    &__row.network-selection-row {
      height: calc(100% - 183px);

      .vendor-role-selection__column {
        height: 100%;
      }
    }

    &--no-existing-roles {
      .vendor-role-selection__header-column:last-child {
        padding-top: 0;
      }
    }
  }
}

</style>
