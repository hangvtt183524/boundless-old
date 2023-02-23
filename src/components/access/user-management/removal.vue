<template lang="pug">
  .user-management-removal-page.page-content
    .user-management-removal-page__header
      .user-management-removal-page__header__back-link-container
        v-icon.user-management-removal-page__header__back-link-container__back-icon(
          @click="onBackClick"
        ) keyboard_backspace
      h4.user-management-removal-page__header__page-title
        | {{ $t('v2.access.removeUsersFromOrganizations') }}
      .user-management-removal-page__header__actions
        base-button.base-button--danger.user-management-removal-page__header__actions__action(
          @click="onDeleteClick"
          :disabled="!isValid"
        )
          | {{ $t('general.remove') }}

    .user-management-removal-page__content
      .user-management-removal-page__content__description
        | {{ $t('v2.access.userRemovalDescription') }}

      v-layout.user-management-removal-page__content__row(row wrap)
        v-flex.user-management-removal-page__content__column.users-column(xs12 lg6)
          .user-management-removal-page__content__column__list
            user-removal-list(
              v-model="users"
            )

        v-flex.user-management-removal-page__content__column.organizations-column(xs12 lg6)
          .user-management-removal-page__content__column__list
            table-multi-select.table-multi-select--fill-height(
              v-model="organizations"
              :items="organizationOptions"
            )

    .user-management-removal-page__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )

    user-removal-confirm-modal(
      ref="confirmModal"
      :users="users"
      :organizations="selectedOrganizations"
    )

    job-tracking-modal(
      display-post-run-messages
      ref="jobTrackingModal"
    )

</template>

<script>
import _ from 'lodash'
import { mapActions } from 'vuex'
import BaseButton from '@/components/v2/base-button/base-button'
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import ProductOrganizationsMixin from '@/mixins/product-organizations.mixin'
import UserRemovalList from './user-removal-list'
import TableMultiSelect from '@/components/v2/table-multi-select/table-multi-select'
import UserRemovalConfirmModal from './user-removal-confirm-modal'
import JobTrackingModal from '@/components/v2/job-tracking-modal/job-tracking-modal.vue'

export default {
  name: 'invitation',
  components: {
    UserRemovalList,
    UserRemovalConfirmModal,
    TableMultiSelect,
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
      loading: false,
      users: [],
      organizations: [],
      connectedOrganizations: []
    }
  },
  mounted () {
    this.users = _.cloneDeep(this.selectedUsers)

    this.fetchConnectedOrganizations()
  },
  computed: {
    organizationOptions () {
      return this.accessControlOrganizations.filter(
        // Filter to meraki-setup organizations those are connected to users
        workspaceOrganization => this.connectedOrganizations.indexOf(workspaceOrganization.meraki_organization.id) > -1
      ).map(workspaceOrganization => {
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
    ...mapActions('workspace/access', ['deleteMerakiOrganizationUsers', 'fetchMerakiUserConnectedOrganizations']),
    fetchConnectedOrganizations () {
      this.loading = true
      this.fetchMerakiUserConnectedOrganizations({
        workspaceId: this.workspaceId,
        meraki_users: this.users.map(user => user.id)
      }).then(response => {
        this.connectedOrganizations = response.data.data.organizations
      }).finally(() => {
        this.loading = false
      })
    },
    onDeleteClick () {
      this.$refs.confirmModal.open().then(confirm => {
        if (confirm) {
          this.loading = true
          this.deleteMerakiOrganizationUsers({
            workspaceId: this.workspaceId,
            users: this.users.map(user => user.id),
            organizations: this.organizations
          }).then(response => {
            this.$refs.jobTrackingModal.open(
              response.data.data.id,
              this.$t('v2.access.deletingUsers'),
              this.$t('v2.access.deletingUsersDescription')
            ).then(success => {
              if (success) {
                global.toastr['success'](this.$t('v2.access.successfullyDeletedUsers'), this.$t('general.success'))

                // Go back to meraki user listing page
                this.$router.push({ name: 'UserManagementList' })
              } else {
                global.toastr['error'](this.$t('v2.access.failedToDeleteUsers'), this.$t('general.error'))
              }
            })
          }).catch(() => {
            global.toastr['error'](this.$t('v2.access.failedToDeleteUsers'), this.$t('general.error'))
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

.user-management-removal-page {
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
            color: $gray-light;
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
  .user-management-removal-page {
    &__content {
      height: calc(100vh - 180px);

      &__row {
        height: calc(100% - 84px);
      }

      &__column {
        height: 100%;

        &__header {
          &__sub-header {
            height: 100px;
          }
        }

        &__list {
          height: 100%;

          .user-removal-list {
            height: 100%;
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
}
</style>
