<template lang="pug">
  .user-management-detail-page.page-content
    .user-management-detail-page__header
      .user-management-detail-page__header__back-link-container
        v-icon.user-management-detail-page__header__back-link-container__back-icon(
          @click="onBackClick"
        ) keyboard_backspace
      h4.user-management-detail-page__header__page-title
        | {{ $t('v2.access.manageUserOrganizations') }}
        span(
          v-if="user.email"
        ) / {{ user.name }} ({{user.email}})

      .user-management-detail-page__header__actions
        base-button.base-button--green.user-management-detail-page__header__actions__action(
          @click="onUpdateAccessClick"
          :disabled="!isValueChanged"
        )
          | {{ $t('v2.access.updateUserAccess') }}

    .user-management-detail-page__content
      .user-management-detail-page__content__description
        | {{ $t('v2.access.userAccessUpdateDescription') }}

      v-layout.user-management-detail-page__content__row(row wrap)
        v-flex.user-management-detail-page__content__column.users-column(xs12 lg6)
          .user-management-detail-page__content__column__header
            .user-management-detail-page__content__column__header__title
              | {{ $t('v2.access.currentOrganizations') }}

          .user-management-detail-page__content__column__list
            user-organization-permission-list(
              v-model="userOrganizations"
              :loading="loading"
            )

        v-flex.user-management-detail-page__content__column.organizations-column(xs12 lg6)
          .user-management-detail-page__content__column__header
            .user-management-detail-page__content__column__header__title
              | {{ $t('v2.access.availableOrganizations') }}

          .user-management-detail-page__content__column__list
            table-multi-add.table-multi-add--fill-height(
              :items="organizationOptions"
              @add="onOrganizationAdd"
              :empty-state-message="$t('v2.access.userMemberOfAllOrganizations')"
              :add-action-tooltip="$t('v2.access.addToOrganization')"
            )

    .user-management-detail-page__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )

    user-access-update-confirm-modal(
      ref="confirmModal"
      :user="user"
      :added-organizations="addedOrganizations"
      :removed-organizations="removedOrganizations"
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
import UserAccessUpdateConfirmModal from './user-access-update-confirm-modal'
import JobTrackingModal from '@/components/v2/job-tracking-modal/job-tracking-modal.vue'
import UserOrganizationPermissionList from './user-organization-permission-list'
import TableMultiAdd from '@/components/v2/table-multi-add/table-multi-add'

export default {
  name: 'invitation',
  components: {
    TableMultiAdd,
    UserOrganizationPermissionList,
    UserAccessUpdateConfirmModal,
    BaseButton,
    JobTrackingModal
  },
  mixins: [
    UserPermissionsMixin,
    CurrentNodeSelectionsMixin,
    ProductOrganizationsMixin
  ],
  props: {
    merakiUserId: {
      type: Number,
      required: true
    }
  },
  data: function () {
    return {
      accessTypes: {
        full: 'full',
        readOnly: 'read-only',
        enterprise: 'enterprise',
        none: 'none'
      },
      loading: false,
      user: {},
      userOrganizations: [],
      originalUserOrganizations: []
    }
  },
  mounted () {
    // Fetch user details
    this.fetchMerakiUser({ workspaceId: this.workspaceId, id: this.merakiUserId }).then(response => {
      this.user = response.data.data
    })

    // Fetch user organizations
    this.fetchUserOrganizations()
  },
  computed: {
    organizationOptions () {
      return this.accessControlOrganizations.map(workspaceOrganization => {
        const merakiOrganization = workspaceOrganization.meraki_organization
        return {
          key: merakiOrganization.id,
          name: merakiOrganization.name
        }
      }).filter(option =>
        // Filter-out the ones already added to user
        this.userOrganizations.map(userOrganization => userOrganization.organization).indexOf(option.key) === -1
      )
    },
    isValueChanged () {
      return !_.isEqual(this.userOrganizations, this.originalUserOrganizations)
    },
    addedOrganizations () {
      return this.userOrganizations.filter(
        userOrganization => this.originalUserOrganizations.map(
          item => item.organization
        ).indexOf(userOrganization.organization) === -1
      )
    },
    removedOrganizations () {
      return this.originalUserOrganizations.filter(
        userOrganization => this.userOrganizations.map(
          item => item.organization
        ).indexOf(userOrganization.organization) === -1
      )
    }
  },
  methods: {
    ...mapActions('workspace/access', ['fetchMerakiUser', 'fetchMerakiOrganizationUsers',
      'updateMerakiUserOrganizations']),
    getEmptyUserOrganizationItem (organizationId) {
      const organizationItem = this.organizationOptions.find(option => option.key === organizationId)
      const workspaceOrganizationItem = this.userWorkspaceOrganizations.find(
        workspaceOrganization => (workspaceOrganization.meraki_organization) &&
          workspaceOrganization.meraki_organization.id === organizationId
      )

      return {
        organization: organizationId,
        organization_name: organizationItem.name,
        base_organization_id: workspaceOrganizationItem.id,
        access: this.accessTypes.full,
        networks: [],
        tags: []
      }
    },
    fetchUserOrganizations () {
      let filters = {
        page_size: 0,
        page: 1,
        workspaceId: this.workspaceId,
        user: this.merakiUserId
      }

      this.loading = true
      this.fetchMerakiOrganizationUsers(filters).then(response => {
        this.userOrganizations = response.data.data
        this.originalUserOrganizations = _.cloneDeep(response.data.data)
      }).finally(() => {
        this.loading = false
      })
    },
    onOrganizationAdd (organizationIds) {
      organizationIds.forEach(organizationId => {
        this.userOrganizations.push(this.getEmptyUserOrganizationItem(organizationId))
      })
    },
    onUpdateAccessClick () {
      this.$refs.confirmModal.open().then(confirm => {
        if (confirm) {
          this.loading = true
          this.updateMerakiUserOrganizations({
            workspaceId: this.workspaceId,
            id: this.merakiUserId,
            organizations: this.userOrganizations
          }).then(response => {
            this.$refs.jobTrackingModal.open(
              response.data.data.id,
              this.$t('v2.access.updatingUserAccess'),
              this.$t('v2.access.updatingUserAccessDescription')
            ).then(success => {
              if (success) {
                global.toastr['success'](this.$t('v2.access.successfullyUpdatedUserAccess'), this.$t('general.success'))

                // Go back to listing page
                this.$router.push({ name: 'UserManagementList' })
              } else {
                global.toastr['error'](this.$t('v2.access.failedToUpdateUserAccess'), this.$t('general.error'))
              }
            })
          }).catch(() => {
            global.toastr['error'](this.$t('v2.access.failedToUpdateUserAccess'), this.$t('general.error'))
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

.user-management-detail-page {
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
  .user-management-detail-page {
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
          height: calc(100% - 45px);

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
      }
    }
  }
}
</style>
