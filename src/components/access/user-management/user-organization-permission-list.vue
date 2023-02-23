<template lang="pug">
  .user-organization-permission-list
    .user-organization-permission-list__options
      .user-organization-permission-list__options__header
        search-input.user-organization-permission-list__options__header__search-input(
          v-model="search"
          :placeholder="$t('general.search')"
        )

      .user-organization-permission-list__options__list
        base-table.user-organization-permission-list__options__list__table(
          :items="displayedOrganizations"
          :headers="headers"
          :sortable="false"
          :always-editable="true"
          :multi-selectable="true"
          :actions="actions"
          actions-label=" "
          :actions-head-more="actionsHeadMore"
          @actionClick="onTableActionClick"
          @rowSelectionChange="onRowSelectionChange"
          @headMoreInput="onTableHeadMoreInput"
          @itemInput="onTableItemInput"
        )
        .list-empty-state(
          v-if="!loading && !(this.value && this.value.length > 0)"
        )
          .list-empty-state__message
            | {{ $t('v2.access.noOrganizationsSelected') }}

    user-organization-permissions-modal(
      ref="permissionsModal"
    )

</template>

<script>
import BaseTable from '@/components/v2/base-table/base-table'
import SearchInput from '@/components/v2/search-input/search-input'
import ClickActionHeaderCell from '@/components/v2/base-table/column-components/click-action-header-cell'
import UserOrganizationPermissionsModal from './user-organization-permissions-modal'

export default {
  name: 'user-organization-permission-list',
  components: {
    UserOrganizationPermissionsModal,
    SearchInput,
    BaseTable
  },
  props: {
    value: {
      type: Array,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      search: '',
      headers: [
        {
          text: this.$t('general.name'),
          value: 'organization_name',
          editable: false
        },
        {
          text: this.$t('v2.access.privilege'),
          value: 'access',
          editable: true,
          type: String,
          options: ['full', 'read-only', 'enterprise', 'none'].map(option => {
            return {
              key: option,
              name: option.charAt(0).toUpperCase() + option.slice(1) // Capitalized
            }
          }),
          validations: {
            required: true
          }
        }
      ],
      actions: [
        {
          icon: '$vuetify.icons.delete',
          type: 'remove',
          tooltip: this.$t('v2.access.removeFromOrganization')
        },
        {
          icon: '$vuetify.icons.edit',
          type: 'permissions',
          tooltip: this.$t('v2.access.setDetailedPermissions')
        }
      ],
      selectedOrganizations: []
    }
  },
  computed: {
    displayedOrganizations () {
      if (!this.search) {
        return this.value
      }

      return this.value.filter(item => item.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
    },
    actionsHeadMore () {
      return {
        component: ClickActionHeaderCell,
        props: {
          icon: 'remove_circle_outline',
          text: this.$t('general.removeSelected'),
          disabled: this.selectedOrganizations.length === 0
        }
      }
    }
  },
  methods: {
    onRowSelectionChange (selectedRows) {
      this.selectedOrganizations = selectedRows
    },
    onTableActionClick (action, tableItem) {
      if (action === 'remove') {
        this.$emit('input', this.value.filter(item => item !== tableItem))
      } else if (action === 'permissions') {
        this.showOrganizationUserPermissionDetailsModal(tableItem)
      }
    },
    showOrganizationUserPermissionDetailsModal (tableItem) {
      this.$refs.permissionsModal.open(
        tableItem,
        tableItem.base_organization_id
      ).then(updatedUserOrganization => {
        if (updatedUserOrganization) {
          // Update user organization in list
          this.$emit('input', this.value.map(userOrganization => {
            if (userOrganization === tableItem) {
              return updatedUserOrganization
            }

            return userOrganization
          }))
        }
      })
    },
    onTableHeadMoreInput (header, event) {
      if (header.value === '_actions' && event.action === 'click') {
        // Remove all selected items
        this.$emit('input', this.value.filter(item => this.selectedOrganizations.indexOf(item) === -1))
      }
    },
    onTableItemInput (tableItem, field, value) {
      this.$emit('input', this.value.map(userOrganization => {
        if (userOrganization === tableItem) {
          const updatedUserOrganization = {
            ...userOrganization,
            [field]: value
          }

          // If set to full or enterprise permissions for organization, clear network / tag level permissions
          if (field === 'access' && (value === 'full' || value === 'enterprise')) {
            updatedUserOrganization.tags = []
            updatedUserOrganization.networks = []
          }

          return updatedUserOrganization
        }

        return userOrganization
      }))
    }
  }
}
</script>

<style lang="scss" scoped>

@import "styles/v2/colors.scss";
@import "styles/v2/base.scss";

.user-organization-permission-list {
  height: 100%;

  &__options {
    border: 1px solid $gray-light;
    height: 100%;

    &__header {
      height: 40px;
      overflow: hidden;

      .base-text-input ::v-deep {
        input {
          height: 40px;
          color: $text-dark;
          border: none;
          padding: 9px 54px 9px 35px;
          border-radius: 0;

          &:focus {
            border-color: $green-light;
          }
        }

      }
    }

    &__list {
      position: relative;
      height: calc(100% - 40px);
      overflow: hidden;

      &__table {
        height: 100%;
      }
    }
  }
}

</style>
