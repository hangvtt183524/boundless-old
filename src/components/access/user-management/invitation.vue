<template lang="pug">
  .user-management-invitation-page.page-content
    .user-management-invitation-page__header
      .user-management-invitation-page__header__back-link-container
        v-icon.user-management-invitation-page__header__back-link-container__back-icon(
          @click="onBackClick"
        ) keyboard_backspace
      h4.user-management-invitation-page__header__page-title
        | {{ $t('v2.access.addUsersToMerakiOrganizations') }}
      .user-management-invitation-page__header__actions
        base-button.base-button--green.user-management-invitation-page__header__actions__action(
          @click="onInviteClick"
          :disabled="!isValid"
        )
          | {{ $t('v2.access.inviteUsers') }}

    .user-management-invitation-page__content
      .user-management-invitation-page__content__description
        | {{ $t('v2.access.userInvitationDescription') }}

      v-layout.user-management-invitation-page__content__row(row wrap)
        v-flex.user-management-invitation-page__content__column.users-column(xs12 lg6)
          .user-management-invitation-page__content__column__header
            .user-management-invitation-page__content__column__header__title
              | {{ $t('v2.access.inviteNewUsersToOrganizations') }}
            .user-management-invitation-page__content__column__header__sub-header
              user-invitation-form(
                @addUserClick="onAddUserClick"
              )

          .user-management-invitation-page__content__column__list
            user-invitation-list(
              v-model="users"
            )

        v-flex.user-management-invitation-page__content__column.organizations-column(xs12 lg6)
          .user-management-invitation-page__content__column__header
            .user-management-invitation-page__content__column__header__title
              | {{ $t('v2.merakiCommon.selectOrganizations') }}
            .user-management-invitation-page__content__column__header__sub-header.sub-title
              | {{ $t('v2.access.checkBoxToAllowAccess') }}

          .user-management-invitation-page__content__column__list
            table-multi-select.table-multi-select--fill-height(
              v-model="organizations"
              :items="organizationOptions"
            )

    .user-management-invitation-page__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )

    user-invitation-confirm-modal(
      ref="confirmModal"
      :users="users"
      :organizations="selectedOrganizations"
      :workspace-id="workspaceId"
    )

    job-tracking-modal(
      display-post-run-messages
      ref="jobTrackingModal"
    )

</template>

<script>
import { mapActions } from 'vuex'
import BaseButton from '@/components/v2/base-button/base-button'
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import ProductOrganizationsMixin from '@/mixins/product-organizations.mixin'
import UserInvitationList from './user-invitation-list'
import TableMultiSelect from '@/components/v2/table-multi-select/table-multi-select'
import UserInvitationForm from './user-invitation-form'
import UserInvitationConfirmModal from './user-invitation-confirm-modal'
import JobTrackingModal from '@/components/v2/job-tracking-modal/job-tracking-modal.vue'

export default {
  name: 'invitation',
  components: {
    UserInvitationConfirmModal,
    UserInvitationForm,
    TableMultiSelect,
    UserInvitationList,
    BaseButton,
    JobTrackingModal
  },
  mixins: [
    UserPermissionsMixin,
    CurrentNodeSelectionsMixin,
    ProductOrganizationsMixin
  ],
  props: {
    selectedUsers: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data: function () {
    return {
      accessTypes: {
        full: 'full',
        readOnly: 'read-only',
        enterprise: 'enterprise'
      },
      loading: false,
      users: [],
      organizations: []
    }
  },
  mounted () {
    this.selectedUsers.forEach(user => {
      this.users.push({
        name: user.name,
        email: user.email,
        access: this.accessTypes.full,
        networks: [],
        tags: []
      })
    })
  },
  computed: {
    organizationOptions () {
      return this.accessControlOrganizations.map(workspaceOrganization => {
        const merakiOrganization = workspaceOrganization.meraki_organization
        return {
          key: merakiOrganization.id,
          name: merakiOrganization.name
        }
      })
    },
    selectedOrganizations () {
      return this.organizationOptions.filter(option => this.organizations.indexOf(option.key) > -1)
    },
    isValid () {
      return this.users.length > 0 && this.organizations.length > 0
    }
  },
  methods: {
    ...mapActions('workspace/access', ['inviteMerakiOrganizationUsers']),
    onAddUserClick (user) {
      if (this.users.find(item => item.email === user.email)) {
        // Already added a user with same email
        global.toastr['error'](this.$t('v2.access.userWithEmailExists'), this.$t('general.error'))
        return false
      }

      this.users.push({
        ...user,
        access: this.accessTypes.full,
        networks: [],
        tags: []
      })
    },
    onInviteClick () {
      this.$refs.confirmModal.open().then(confirm => {
        if (confirm) {
          this.loading = true
          this.inviteMerakiOrganizationUsers({
            workspaceId: this.workspaceId,
            users: this.users,
            organizations: this.organizations
          }).then(response => {
            this.$refs.jobTrackingModal.open(
              response.data.data.id,
              this.$t('v2.access.invitingUsers'),
              this.$t('v2.access.invitingUsersDescription')
            ).then(success => {
              if (success) {
                global.toastr['success'](this.$t('v2.access.successfullySentInvitations'), this.$t('general.success'))

                // Go back to meraki user listing page
                this.$router.push({ name: 'UserManagementList' })
              }
            })
          }).catch(() => {
            global.toastr['error'](this.$t('v2.access.failedToSendInvitations'), this.$t('general.error'))
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    onBackClick () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";
@import "styles/v2/base.scss";

.user-management-invitation-page {
  background-color: $white;
  position: relative;

  &__header {
    height: 60px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    padding: 0 30px 0 0;
    overflow: hidden;

    &__back-link-container {
      float: left;
      width: 60px;
      line-height: 60px;
      border-right: 1px solid $gray-xlight;
      text-align: center;

      &__back-icon {
        color: $blue-reserve;
        line-height: 60px;
      }
    }

    &__page-title {
      margin-left: 33px;
      line-height: 60px;
      letter-spacing: 1px;
      float: left;
    }

    &__actions {
      float: right;

      &__action {
        margin: 10px 0 0 13px;
        width: 180px;
      }
    }
  }

  &__content {
    box-sizing: border-box;
    padding: 24px 30px;

    &__description {
      line-height: 24px;
      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      color: $text-medium;
      margin-bottom: 40px;
      margin-top: 20px;
    }

    &__column {
      &__header {
        margin-bottom: 20px;

        &__title {
          line-height: 24px;
          font-family: Fira Sans;
          font-style: normal;
          font-weight: 600;
          font-size: 14px;
          color: $text-medium;
          margin-bottom: 20px;
        }

        &__sub-header {
          &.sub-title {
            line-height: 41px;
            font-family: Fira Sans;
            font-style: normal;
            font-weight: normal;
            font-size: 14px;
            color: $text-medium;
          }
        }
      }

      &:not(:last-child) {
        margin-bottom: 40px;
      }
    }
  }

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

@media (min-width: 1264px) {
  .user-management-invitation-page {
    &__content {
      height: calc(100vh - 180px);

      &__row {
        height: calc(100% - 84px);
      }

      &__column {
        height: 100%;

        &__list {
          height: calc(100% - 165px);

          .user-invitation-list {
            height: 100%;
          }
        }

        &:first-child {
          padding-right: 20px;
        }

        &:last-child {
          padding-left: 20px;
        }

        &.organizations-column {
          .user-management-invitation-page__content__column__header {
            &__title {
              padding-top: 79px;
            }

            margin-bottom: 0;
          }
        }
      }
    }
  }
}
</style>
