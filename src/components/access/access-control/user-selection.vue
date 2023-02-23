<template lang="pug">
  .user-selection
    .user-selection__header
      v-layout(row wrap)
        v-flex(xs6 lg8 xl9)
          .user-selection__header__title
            | {{ $t('v2.access.aclUserSelectionTitle') }}
          .user-selection__header__description
            | {{ $t('v2.access.aclUserSelectionDescription') }}
        v-flex(xs6 lg4 xl3)
          base-button.base-button--blue(
            @click="onAddNewUsersClick"
          ) {{ $t('v2.access.clickToAddNewUsers') }}

    .user-selection__content
      v-layout.user-selection__content__row.bottom-row(row wrap)
        v-flex.user-selection__content__column.bottom-column(xs6 lg4 xl3)
          .user-selection__content__column__title
            | {{ $t('v2.access.selectUsersToAddToAcl') }}
          .user-selection__content__column__content
            table-multi-select.table-multi-select--fill-height(
              v-show="!loading"
              :value="selectedUserOptions"
              @input="onUserOptionsInput"
              :items="filteredUserOptions"
              :empty-state-message="$t('v2.access.noAvailableUsers')"
            )

            .user-selection__content__column__content__loading-indicator(
              v-if="loading"
            )
              v-progress-circular(
                :size="50"
                indeterminate
                color="#15ac2f"
              )

        v-flex.user-selection__content__column.bottom-column(xs6 lg8 xl9)
          .user-selection__content__column__title
            | {{ $t('v2.access.theseUsersWillHaveAclApplied') }}
          .user-selection__content__column__content
            acl-user-list(
              :user-vendor-role="userVendorRole"
              :existing-users="existingUsers"
              :users-to-migrate="usersToMigrate"
              @userRemove="onUserRemove"
              @migrateUsersUpdate="$emit('migrateUsersUpdate', $event)"
            )

    acl-user-invite-modal(
      ref="inviteModal"
    )

</template>

<script>
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import BaseButton from '@/components/v2/base-button/base-button'
import TableMultiSelect from '@/components/v2/table-multi-select/table-multi-select'
import AclUserList from './acl-user-list'
import AclUserInviteModal from './acl-user-invite-modal'

export default {
  name: 'user-selection',
  components: {
    AclUserInviteModal,
    AclUserList,
    TableMultiSelect,
    BaseButton
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  props: {
    value: {
      type: Array,
      required: true
    },
    userVendorRole: {
      type: Object,
      required: true
    },
    existingUsers: {
      type: Array,
      default: () => []
    },
    existingSamlUsers: {
      type: Array,
      default: () => []
    },
    usersToMigrate: {
      type: Array,
      default: () => []
    },
    parentOrganizations: {
      type: Array,
      default: () => []
    }
  },
  data: function () {
    return {
      loading: false,
      search: null,
      headers: [
        {
          text: this.$t('general.name'),
          value: 'profile.full_name'
        },
        {
          text: this.$t('general.email'),
          value: 'email'
        }
      ],
      selectionTableActions: [
        {
          icon: '$vuetify.icons.delete',
          type: 'remove'
        }
      ]
    }
  },
  computed: {
    userOptions () {
      // Existing organization administrators + existing workspace SAML users
      const existingUserEmails = this.existingUsers.map(user => user.email)
      return this.existingUsers.map(user => {
        return {
          key: user.meraki_id,
          name: `${user.name} <${user.email}>`,
          email: user.email,
          user_name: user.name
        }
      }).concat(this.existingSamlUsers.filter(user => existingUserEmails.indexOf(user.email) === -1).map(user => {
        return {
          key: user.id,
          name: `${user.profile.full_name} <${user.email}>`,
          email: user.email,
          user_name: user.profile.full_name
        }
      }))
    },
    filteredUserOptions () {
      return this.search
        ? this.userOptions.filter(
          option => option.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
            option.email.toLowerCase().indexOf(this.search.toLowerCase()) > -1
        )
        : this.userOptions
    },
    selectedUserOptions () {
      const selectedUserEmails = this.value.map(item => item.email)
      return this.userOptions.filter(item => selectedUserEmails.indexOf(item.email) > -1).map(item => item.key)
    }
  },
  methods: {
    onUserOptionsInput (userIds) {
      const currentUserSelection = this.userOptions.filter(item => userIds.indexOf(item.key) > -1)
      const deSelectedUserIds = this.selectedUserOptions.filter(item => userIds.indexOf(item) === -1)
      const deSelectedUserOptions = this.userOptions.filter(item => deSelectedUserIds.indexOf(item.key) > -1)
      const existingUserEmails = this.value.map(user => user.email)

      this.$emit('input', [
        ...this.value.filter(user => deSelectedUserOptions.map(item => item.email).indexOf(user.email) === -1),
        ...currentUserSelection.filter(user => existingUserEmails.indexOf(user.email) === -1).map(user => {
          return {
            email: user.email,
            full_name: user.user_name
          }
        })
      ])
    },
    onAddNewUsersClick () {
      this.$refs.inviteModal.open().then(addedUsers => {
        if (addedUsers) {
          const existingUserEmails = this.value.map(user => user.email)
          this.$emit('input', [
            ...this.value,
            ...addedUsers.filter(user => existingUserEmails.indexOf(user.email) === -1).map(user => {
              return {
                email: user.email,
                full_name: `${user.first_name} ${user.last_name}`
              }
            })
          ])
        }
      })
    },
    onUserAdd (userIds) {
      const existingUserEmails = this.value.map(user => user.email)
      this.$emit('input', [
        ...this.value,
        ...this.merakiUsers.filter(
          user => userIds.indexOf(user.id) > -1 && existingUserEmails.indexOf(user.email) === -1
        ).map(user => {
          return {
            email: user.email,
            full_name: user.name
          }
        })
      ])
    },
    onUserRemove (userEmails) {
      this.$emit('input', this.value.filter(user => userEmails.indexOf(user.email) === -1))
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.user-selection {
  &__header {
    &__title {
      font-family: Fira Sans;
      font-style: normal;
      font-weight: 600;
      font-size: 20px;
      line-height: 25px;
      color: $blue-dark;
    }

    &__description {
      margin-top: 20px;

      line-height: 24px;
      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      color: $text-medium;
    }

    .base-button {
      padding: 0 20px;
      float: right;
    }
  }

  &__content {
    margin-top: 40px;

    .action-column {
      position: relative;
      min-height: 160px;

      .base-button {
        padding: 0 20px;
        position: absolute;
        left: 0;
        bottom: 0;
      }
    }

    &__row {
      margin-top: 40px;
    }

    &__column {
      &__title {
        line-height: 24px;
        font-family: Fira Sans;
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        color: $text-medium;
        white-space: nowrap;
      }

      &__content {
        margin-top: 10px;
        position: relative;

        &__loading-indicator {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(255, 255, 255, 0.6);
        }
      }

      &:first-child {
        padding-right: 20px;
      }

      &:last-child {
        padding-left: 20px;
      }
    }
  }
}

@media only screen and (min-width: 1264px) {
  .user-selection {
    height: 100%;

    &__content {
      height: calc(100% - 108px);
      &__row.bottom-row {
        height: 100%;
      }

      &__column.bottom-column {
        height: 100%;

        .user-selection__content__column__content {
          height: calc(100% - 34px);
        }
      }
    }
  }
}

</style>
