<template lang="pug">
  .user-detail-page.page-content
    .user-detail-page__header
      .user-detail-page__header__back-link-container
        v-icon.user-detail-page__header__back-link-container__back-icon(
          @click="onBackClick"
        ) keyboard_backspace
      h4.user-detail-page__header__page-title
        | {{ user.profile.full_name }}
      .user-detail-page__header__actions
        base-button.base-button--green.user-detail-page__header__actions__action(
          @click="onSaveClick"
          :disabled="!(isValueChanged && isValid)"
        )
          | {{ $t('general.saveChanges') }}

    .user-detail-page__content
      v-layout(row wrap).user-detail-page__content__user-panel
        v-flex(xs12 md6 lg4).user-detail-page__content__user-info-section
          user-profile-info(
            :user="user"
            :mode="mode"
            :name-update-data="userNameUpdateData"
            @nameEditStateChange="onNameEditStateChange"
            @firstNameInput="onFirstNameInput"
            @lastNameInput="onLastNameInput"
            @removeUserClick="onRemoveUserClick"
          )
          user-invitation-info(
            :user="user"
            :mode="mode"
            :password-update-data="userPasswordUpdateData"
            @passwordEditStateChange="onPasswordEditStateChange"
            @passwordInput="onPasswordInput"
            @loadingStateChange="loading = $event"
            @invitationRemoval="onInvitationRevokeSuccess"
            @disableTfaClick="onDisableTfaClick"
          )

        v-flex(xs12 md6 lg8).user-detail-page__content__role-section(
          v-if="hasPermission('workspace_users__edit_role', permissionCheckNodeId) && !isPendingInvitation"
          v-show="user && user.id"
        )
          workspace-organization-role-selection(
            v-if="mode === modes.workspace"
            :workspace="parseInt(workspaceId)"
            :user-roles="user.user_roles"
            @selectionChange="onUserRoleSelectionChange"
            ref="workspaceRoleSelection"
          )
          internal-role-selection(
            v-if="mode === modes.internal"
            :user-roles="user.user_roles"
            @selectionChange="onUserRoleSelectionChange"
            @addToWorkspaceClick="onAddToWorkspaceClick"
            ref="internalRoleSelection"
          )
      v-layout(row wrap)
        v-flex(xs12)
          activity-log(
            v-if="hasPermission('audit_logs__view', permissionCheckNodeId)"
            :user-id="parseInt(userId)"
            :ancestor-id="activityLogAncestorId"
            :page-size="5"
          )

    .user-detail-page__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )

    confirm-modal(
      ref="confirmModal"
    )

    discard-confirm-modal(
      ref="discardConfirmModal"
      hide-save-and-exit
    )

</template>
<script>
import { mapActions } from 'vuex'
import _ from 'lodash'
import CurrentUserMixin from '@/mixins/current-user.mixin'
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import NodeSelectionsMixin from '@/mixins/node-selections.mixin'
import UnsavedLeaveWarningMixin from '@/mixins/unsaved-leave-warning.mixin'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import UserProfileInfo from './user-profile-info.vue'
import UserInvitationInfo from './user-invitation-info.vue'
import ActivityLog from '../activity-log/activity-log'
import InternalRoleSelection from './internal-role-selection'
import WorkspaceOrganizationRoleSelection from './workspace-organization-role-selection'
import ConfirmModal from '@/components/v2/confirm-modal/confirm-modal'
import DiscardConfirmModal from '@/components/v2/discard-confirm-modal/discard-confirm-modal'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  props: {
    userId: {
      type: [String, Number]
    },
    mode: {
      type: String,
      default: 'workspace'
    }
  },
  mixins: [
    CurrentUserMixin,
    UserPermissionsMixin,
    NodeSelectionsMixin,
    UnsavedLeaveWarningMixin
  ],
  components: {
    WorkspaceOrganizationRoleSelection,
    InternalRoleSelection,
    ActivityLog,
    BaseButton,
    UserProfileInfo,
    UserInvitationInfo,
    ConfirmModal,
    DiscardConfirmModal
  },
  data () {
    return {
      loading: false,
      modes: {
        internal: 'internal',
        workspace: 'workspace'
      },
      user: {
        profile: {},
        user_roles: []
      },
      userRoles: [],
      userPasswordUpdateData: {
        isEditing: false,
        value: '',
        updateErrors: []
      },
      userNameUpdateData: {
        isEditing: false,
        firstName: '',
        lastName: '',
        updateErrors: []
      }
    }
  },
  mounted () {
    this.fetchUserData()
  },
  computed: {
    isValid () {
      let isValid = true

      this.userRoles.forEach(roleData => {
        if (roleData.role.id === null || (roleData.node && roleData.node.id === null)) {
          isValid = false
        }
      })

      if (this.userNameUpdateData.isEditing && !(this.userNameUpdateData.firstName && this.userNameUpdateData.lastName)) {
        isValid = false
      }

      if (this.userPasswordUpdateData.isEditing && !this.userPasswordUpdateData.value) {
        isValid = false
      }

      return isValid
    },
    isRolesChanged () {
      return !_.isEqual(
        _.sortBy(this.user.user_roles.map(userRole => {
          return {
            node: {
              id: userRole.node ? userRole.node.id : null
            },
            role: {
              id: userRole.role.id
            }
          }
        }), (item) => item.node.id),
        _.sortBy(this.userRoles.map(userRole => {
          return {
            node: {
              id: userRole.node ? userRole.node.id : null
            },
            role: {
              id: userRole.role.id
            }
          }
        }), (item) => item.node.id)
      )
    },
    isUserProfileChanged () {
      return (this.userNameUpdateData.isEditing &&
        (this.userNameUpdateData.firstName !== this.user.profile.first_name ||
          this.userNameUpdateData.lastName !== this.user.profile.last_name))
    },
    isUserPasswordChanged () {
      return this.userPasswordUpdateData.isEditing && this.userPasswordUpdateData.value
    },
    isValueChanged () {
      return this.isRolesChanged || this.isUserPasswordChanged || this.isUserPasswordChanged
    },
    isPendingInvitation () {
      let invitationDetail = this.user.invitation_details
      if (Array.isArray(invitationDetail)) {
        invitationDetail = invitationDetail[0]
      }
      return !!invitationDetail && !invitationDetail.is_accepted
    },
    permissionCheckNodeId () {
      return this.workspaceId
    },
    activityLogAncestorId () {
      if (this.mode === this.modes.workspace) {
        return this.workspaceId
      } else {
        return null
      }
    }
  },
  methods: {
    ...mapActions('user', ['fetchUser', 'updateUser', 'deleteUser', 'deactivateUserTfa', 'updateUserPassword']),
    ...mapActions('organization/user', ['fetchOrganizationUser', 'updateOrganizationUser']),
    ...mapActions('workspace/user', ['fetchWorkspaceUser', 'updateWorkspaceUser']),
    onPasswordInput (value) {
      this.$set(this.userPasswordUpdateData, 'value', value)
    },
    onPasswordEditStateChange () {
      this.$set(this.userPasswordUpdateData, 'isEditing', !this.userPasswordUpdateData.isEditing)
    },
    onFirstNameInput (value) {
      this.$set(this.userNameUpdateData, 'firstName', value)
    },
    onLastNameInput (value) {
      this.$set(this.userNameUpdateData, 'lastName', value)
    },
    onNameEditStateChange () {
      this.$set(this.userNameUpdateData, 'isEditing', !this.userNameUpdateData.isEditing)
    },
    fetchUserData () {
      let fetchMethod
      let params

      if (this.mode === this.modes.workspace) {
        fetchMethod = this.fetchWorkspaceUser
        params = {
          workspaceId: this.workspaceId,
          userId: this.userId
        }
      } else {
        fetchMethod = this.fetchUser
        params = this.userId
      }

      this.loading = true
      fetchMethod(params).then(response => {
        this.$set(this, 'user', response.data.data)
        this.$set(this, 'userRoles', JSON.parse(JSON.stringify(response.data.data.user_roles)))
        this.$set(this.userNameUpdateData, 'firstName', this.user.profile.first_name)
        this.$set(this.userNameUpdateData, 'lastName', this.user.profile.last_name)
      }).finally(() => {
        this.loading = false
      })
    },
    onSaveClick () {
      if (!this.isValid) {
        return false
      }

      if (this.isRolesChanged || this.isUserProfileChanged) {
        this.updateUserProfile()
      }

      if (this.isUserPasswordChanged) {
        this.updateWorkspaceUserPassword()
      }
    },
    updateUserProfile () {
      const params = {
        userId: this.userId
      }

      if (this.isRolesChanged) {
        params['user_roles'] = this.userRoles

        EventTracker.sendEvent(EVENT_NAMES.USER_ACCESS_MODIFIED)
      }

      if (this.isUserProfileChanged) {
        params['profile'] = {
          first_name: this.userNameUpdateData.firstName,
          last_name: this.userNameUpdateData.lastName
        }
      }

      let updateMethod
      if (this.mode === this.modes.workspace) {
        updateMethod = this.updateWorkspaceUser
        params['workspaceId'] = this.workspaceId
      } else {
        updateMethod = this.updateUser
      }

      this.loading = true
      updateMethod(params).then(response => {
        this.$set(this, 'user', response.data.data)
        this.$set(this, 'userRoles', JSON.parse(JSON.stringify(response.data.data.user_roles)))
        this.$set(this.userNameUpdateData, 'firstName', this.user.profile.first_name)
        this.$set(this.userNameUpdateData, 'lastName', this.user.profile.last_name)

        // Reset profile update state
        this.$set(this.userNameUpdateData, 'isEditing', false)

        global.toastr['success'](this.$t('general.dataSaveSuccess'), this.$t('general.success'))
      }).catch(() => {
        global.toastr['error'](this.$t('general.dataSaveFailure'), this.$t('general.error'))
      }).finally(() => {
        this.loading = false
      })
    },
    updateWorkspaceUserPassword () {
      this.loading = true
      this.updateUserPassword({
        userId: this.userId,
        password: this.userPasswordUpdateData.value
      }).then(response => {
        this.$set(this.userPasswordUpdateData, 'updateErrors', [])
        global.toastr['success'](this.$t('v2.user.successUpdatingPassword'), this.$t('general.success'))
        this.$set(this.userPasswordUpdateData, 'isEditing', false)
        this.$set(this.userPasswordUpdateData, 'value', null)
      }).catch(err => {
        this.$set(this.userPasswordUpdateData, 'updateErrors', err.response.data.error.detail.password || [])
        global.toastr['error'](this.$t('v2.user.failedUpdatingPassword'), this.$t('general.error'))
      }).finally(() => {
        this.loading = false
      })
    },
    onRemoveUserClick () {
      if (this.mode === this.modes.workspace) {
        this.removeUserFromWorkspace()
      } else {
        this.removeUserFromSystem()
      }
    },
    removeUserFromSystem () {
      this.$refs.confirmModal.open(
        this.$t('errors.warning'),
        this.$t('v2.user.removeFromSystemConfirmation').replace('{username}', '<b>' + this.user.profile.full_name + '</b>')
      ).then(confirm => {
        if (confirm) {
          this.loading = true
          this.deleteUser(this.userId).then(response => {
            // Go to previous page
            this.onBackClick()

            global.toastr['success'](this.$t('v2.user.removeFromSystemSuccess'), this.$t('general.success'))
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    removeUserFromWorkspace () {
      this.$refs.confirmModal.open(
        this.$t('errors.warning'),
        this.$t('v2.user.removeFromWorkspaceConfirmation').replace('{username}', '<b>' + this.user.profile.full_name + '</b>')
      ).then(confirm => {
        if (confirm) {
          this.loading = true
          this.updateWorkspaceUser({
            workspaceId: this.workspaceId,
            userId: this.userId,
            user_roles: []
          }).then(response => {
            // Go to previous page
            this.onBackClick()

            global.toastr['success'](this.$t('v2.user.removeFromWorkspaceSuccess'), this.$t('general.success'))
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    onDisableTfaClick () {
      this.$refs.confirmModal.open(
        this.$t('errors.warning'),
        this.$t('v2.user.tfaDisableConfirmation')
      ).then(confirm => {
        if (confirm) {
          this.loading = true
          this.deactivateUserTfa({
            userId: this.userId
          }).then(response => {
            this.$set(this, 'user', response.data.data)

            global.toastr['success'](this.$t('v2.user.tfaDisableSuccess'), this.$t('general.success'))
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    onAddToOrganizationClick (organizationUserRoles) {
      // Add organization user roles on top of existing user roles, and save
      this.loading = true
      this.updateUser({
        userId: this.userId,
        user_roles: this.user.user_roles.concat(organizationUserRoles)
      }).then(response => {
        this.$set(this, 'user', response.data.data)
        this.$set(this, 'userRoles', JSON.parse(JSON.stringify(response.data.data.user_roles)))

        // Instruct internal role selection component to close organization role add view
        this.$refs.internalRoleSelection.closeAddToOrganizationView()
      }).finally(() => {
        this.loading = false
      })
    },
    onAddToWorkspaceClick (workspaceUserRoles) {
      // Add workspace user roles on top of existing user roles, and save
      this.loading = true
      this.updateUser({
        userId: this.userId,
        user_roles: this.user.user_roles.concat(workspaceUserRoles)
      }).then(response => {
        this.$set(this, 'user', response.data.data)
        this.$set(this, 'userRoles', JSON.parse(JSON.stringify(response.data.data.user_roles)))

        // Instruct internal role selection component to close organization role add view
        this.$refs.internalRoleSelection.closeAddToWorkspaceView()
      }).finally(() => {
        this.loading = false
      })
    },
    onInvitationRevokeSuccess () {
      if (this.mode === this.modes.workspace) {
        // Go to previous page
        this.onBackClick()
      }
    },
    onBackClick () {
      this.$router.go(-1)
    },
    onUserRoleSelectionChange (roleSelections) {
      this.$set(this, 'userRoles', roleSelections.roles)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";
  @import "styles/v2/base.scss";

  .user-detail-page {
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
      padding: 44px 40px;
      box-sizing: border-box;

      &__user-panel {
        padding-bottom: 40px;
        border-bottom: 3px solid $gray-xlight;
      }

      &__user-info-section {
        border-bottom: 1px solid $gray-xlight;
        padding-bottom: 50px;

        @media (min-width: 992px) {
          padding-right: 50px;
          border-bottom: 0;
          padding-bottom: 0;
          border-right: 3px solid $gray-xlight;
        }
      }

      &__role-section {
        @media (min-width: 992px) {
          padding-left: 38px;
        }
      }

      .activity-log {
        margin-top: 27px;
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
</style>
