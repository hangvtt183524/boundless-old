<template lang="pug">
  .user-invitation-list
    base-table(
      :items="value"
      :headers="tableHeaders"
      :sortable="false"
      :always-editable="true"
      :actions="tableActions"
      @actionClick="onTableActionClick"
      @itemInput="onTableItemInput"
    )
    .user-invitation-list__empty-state(
      v-if="value.length === 0"
    )
      v-icon.user-invitation-list__empty-state__icon arrow_upward
      .user-invitation-list__empty-state__text
        | {{ $t('v2.access.inviteUsersToOrganizations') }}

    user-organization-permissions-modal(
      ref="permissionsModal"
    )

</template>

<script>
import BaseTable from '@/components/v2/base-table/base-table'
import UserOrganizationPermissionsModal from './user-organization-permissions-modal'

export default {
  name: 'user-invitation-list',
  components: {
    UserOrganizationPermissionsModal,
    BaseTable
  },
  props: {
    value: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      tableHeaders: [
        {
          text: this.$t('general.user'),
          value: 'name',
          formatter: (value, item) => {
            return `${item.name} <${item.email}>`
          },
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
      tableActions: [
        {
          icon: '$vuetify.icons.delete',
          type: 'remove'
        },
        {
          icon: '$vuetify.icons.edit',
          type: 'permissions',
          tooltip: this.$t('v2.access.setDetailedPermissions')
        }
      ]
    }
  },
  methods: {
    onTableActionClick (action, tableItem) {
      if (action === 'remove') {
        this.$emit('input', this.value.filter(item => item !== tableItem))
      } else if (action === 'permissions') {
        this.showOrganizationUserPermissionDetailsModal(tableItem)
      }
    },
    showOrganizationUserPermissionDetailsModal (tableItem) {
      this.$refs.permissionsModal.open(
        tableItem
      ).then(updatedUser => {
        if (updatedUser) {
          // Update user organization in list
          this.$emit('input', this.value.map(user => {
            if (user === tableItem) {
              return updatedUser
            }

            return user
          }))
        }
      })
    },
    onTableItemInput (tableItem, field, value) {
      this.$emit('input', this.value.map(user => {
        if (user === tableItem) {
          const updatedUser = {
            ...user,
            [field]: value
          }

          // If set to full or enterprise permissions for organization, clear network / tag level permissions
          if (field === 'access' && (value === 'full' || value === 'enterprise')) {
            updatedUser.tags = []
            updatedUser.networks = []
          }

          return updatedUser
        }

        return user
      }))
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.user-invitation-list {
  position: relative;

  &__empty-state {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    background-color: $white;

    &__icon {
      margin-top: 80px;
      font-size: 64px;
    }

    &__text {
      width: 80%;
      margin: 30px auto;

      line-height: 24px;
      font-family: Fira Sans;
      font-style: normal;
      font-weight: 600;
      font-size: 18px;
      color: $text-medium;
    }
  }
}

</style>
