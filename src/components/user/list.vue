<template lang='pug'>
  .user-list-page.page-content(
    data-test="user-list"
  )
    .user-list-page__header
      search-input.base-text-input--small.user-list-page__header__search-input(
        v-if="hasPermission('workspace_users__list', permissionCheckNodeId)"
        :placeholder="$t('v2.user.searchUsers')"
        v-model="search"
      )
      .base-text-input--small.user-list-page__header__actions
        router-link(
          to="invitation"
          append
          v-if="hasPermission('workspace_users__invite', permissionCheckNodeId)"
        )
          base-button.base-button--green.user-list-page__header__actions__invite-button
            | {{ $t('v2.user.inviteUser') }}
        base-button.base-button--blue.user-list-page__header__actions__download-button(
          v-if="mode === modes.internal"
          @click="onDownloadClick"
        )
          | {{ $t('general.csv') }}
    .user-list-page__content
      base-table.user-list-page__content__user-table(
        v-if="hasPermission('workspace_users__list', permissionCheckNodeId)"
        class="rules-table"
        :items="users"
        :headers="tableHeaders"
        :actions="tableActions"
        :is-external-sort="true"
        @actionClick="onUserTableActionClick"
        @loadMore="onScrollEnd"
        @sortOrderChange="onSortOrderChange"
      )
    .user-list-page__loading-indicator(
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
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import NodeSelectionsMixin from '@/mixins/node-selections.mixin'
import CurrentUserMixin from '@/mixins/current-user.mixin'
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'

import BaseTable from '@/components/v2/base-table/base-table.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input.vue'
import UserStatusCell from './status-cell'

import { dateTimeFormatter } from '@/utils/global-cell-formatters'
import SearchInput from '../v2/search-input/search-input'
import ConfirmModal from '@/components/v2/confirm-modal/confirm-modal'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'user-list',
  mixins: [
    NodeSelectionsMixin,
    CurrentUserMixin,
    UserPermissionsMixin
  ],
  components: {
    ConfirmModal,
    SearchInput,
    BaseTable,
    BaseButton,
    BaseTextInput
  },
  props: {
    mode: {
      type: String,
      default: 'workspace'
    }
  },
  data () {
    return {
      search: '',
      loading: false,
      modes: {
        internal: 'internal',
        workspace: 'workspace'
      },
      internalTableHeaders: [
        {
          text: this.$t('general.name'),
          value: 'profile.full_name',
          sortKey: 'profile__first_name'
        },
        {
          text: this.$t('general.email'),
          value: 'email'
        },
        {
          text: this.$t('v2.user.scope'),
          value: 'internal_role',
          formatter: this.scopeCellFormatter,
          sortable: false
        },
        {
          text: this.$t('general.status'),
          value: 'is_pending_invitation',
          cellComponent: UserStatusCell,
          sortable: false
        },
        {
          text: this.$t('v2.user.lastConnected'),
          value: 'last_login',
          formatter: dateTimeFormatter
        }
      ],
      workspaceTableHeaders: [
        {
          text: this.$t('general.name'),
          value: 'profile.full_name',
          sortKey: 'profile__first_name'
        },
        {
          text: this.$t('general.email'),
          value: 'email'
        },
        {
          text: this.$t('general.status'),
          value: 'is_pending_invitation',
          cellComponent: UserStatusCell,
          sortable: false
        },
        {
          text: this.$t('v2.user.lastConnected'),
          value: 'last_login',
          formatter: dateTimeFormatter
        }
      ],
      system_role_types: {
        administrator: 'administrator'
      },
      page: 1,
      pageSize: 50,
      ordering: null
    }
  },
  mounted () {
    this.initialize()
  },
  computed: {
    ...mapGetters('user', ['currentUser', 'allUsers', 'allUsersCount']),
    ...mapGetters('workspace/user', ['workspaceUsers', 'workspaceUsersCount']),
    workspaceUserList () {
      return this.workspaceUsers.map(user => {
        return {
          ...user,
          is_pending_invitation: user.user_roles.length === 0 && user.invitation_details !== null &&
            user.invitation_details.is_accepted === false
        }
      })
    },
    internalUserList () {
      return this.allUsers.map(user => {
        return {
          ...user,
          is_pending_invitation: user.user_roles.length === 0 && user.invitation_details.filter(invitation => {
            return invitation.is_accepted === false
          }).length > 0,
          internal_role: user.user_roles.filter(userRole => {
            return userRole.node === null
          })[0]
        }
      })
    },
    users () {
      if (this.mode === this.modes.workspace) {
        return this.workspaceUserList
      } else {
        return this.internalUserList
      }
    },
    pageCount () {
      if (this.mode === this.modes.workspace) {
        return Math.ceil(this.workspaceUsersCount / this.pageSize)
      } else {
        return Math.ceil(this.allUsersCount / this.pageSize)
      }
    },
    permissionCheckNodeId () {
      return this.workspaceId
    },
    tableActions () {
      // Construct table actions taking user permissions into account
      const tableActions = []

      if (this.hasPermission('workspace_users__view', this.permissionCheckNodeId)) {
        tableActions.push({
          icon: '$vuetify.icons.edit',
          type: 'edit'
        })
      }

      if (this.hasPermission('workspace_users__edit_role', this.permissionCheckNodeId)) {
        tableActions.push({
          icon: '$vuetify.icons.delete',
          type: 'remove'
        })
      }

      return tableActions
    },
    tableHeaders () {
      if (this.mode === this.modes.workspace) {
        return this.workspaceTableHeaders
      } else {
        return this.internalTableHeaders
      }
    },
    profile () {
      return this.currentUser.profile
    }
  },
  watch: {
    search: {
      handler: function () {
        // Reset page number
        this.page = 1

        // Re-fetch users after search change
        this.fetchUsers()

        EventTracker.sendEvent(EVENT_NAMES.USER_LIST_SEARCHED)
      },
      deep: true
    },
    '$route' (to, from) {
      // Re-initialize on route change, necessary as 2 different routes use this component
      this.initialize()
    }
  },
  methods: {
    ...mapActions('user', ['fetchAllUsers', 'resendInvitation', 'cancelInvitation', 'updateUser', 'cancelInvitation',
      'deleteUser', 'downloadAllUsers']
    ),
    ...mapActions('workspace/user', ['fetchWorkspaceUsers', 'getWorkspaceUserIds', 'updateWorkspaceUser']),
    initialize () {
      this.$set(this, 'page', 1)

      if (this.hasPermission('workspace_users__list', this.permissionCheckNodeId)) {
        this.fetchUsers()
      }
    },
    fetchUsers () {
      let filters = {
        page_size: this.pageSize,
        page: this.page,
        search: this.search
      }

      if (this.ordering) {
        filters.ordering = this.ordering
      }

      this.loading = true
      if (this.mode === this.modes.workspace) {
        filters.workspaceId = this.workspaceId

        this.fetchWorkspaceUsers(filters).finally(() => {
          this.loading = false
        })
      } else {
        this.fetchAllUsers(filters).finally(() => {
          this.loading = false
        })
      }
    },
    scopeCellFormatter (value) {
      if (!value) {
        return this.$t('v2.user.regularUser')
      }

      return this.$t('v2.user.internalUser') + ': ' + value.role.title
    },
    onScrollEnd () {
      if (this.page < this.pageCount && !this.loading) {
        this.$set(this, 'page', this.page + 1)
        this.fetchUsers()
      }
    },
    onSortOrderChange (ordering) {
      this.ordering = ordering

      // Reset page number
      this.page = 1

      this.fetchUsers()
    },
    onUserTableActionClick (actionType, item) {
      if (actionType === 'edit') {
        if (this.mode === this.modes.workspace) {
          this.$router.push({ name: 'UserDetail', params: { userId: item.id } })
        } else {
          this.$router.push({ name: 'InternalUserDetail', params: { userId: item.id } })
        }
      } else if (actionType === 'remove') {
        if (this.mode === this.modes.workspace) {
          if (item.is_pending_invitation) {
            this.revokeUserInvitation(item)
          } else {
            this.removeUserFromWorkspace(item)
          }
        } else {
          this.removeUserFromSystem(item)
        }
      }
    },
    removeUserFromSystem (user) {
      this.$refs.confirmModal.open(
        this.$t('errors.warning'),
        this.$t('v2.user.removeFromSystemConfirmation').replace('{username}', '<b>' + user.profile.full_name + '</b>')
      ).then(confirm => {
        if (confirm) {
          this.loading = true
          this.deleteUser(user.id).then(response => {
            // Re-fetch users
            this.fetchUsers()

            global.toastr['success'](this.$t('v2.user.removeFromSystemSuccess'), this.$t('general.success'))
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    removeUserFromWorkspace (user) {
      this.$refs.confirmModal.open(
        this.$t('errors.warning'),
        this.$t('v2.user.removeFromWorkspaceConfirmation').replace('{username}', '<b>' + user.profile.full_name + '</b>')
      ).then(confirm => {
        if (confirm) {
          this.loading = true
          this.updateWorkspaceUser({
            workspaceId: this.workspaceId,
            userId: user.id,
            user_roles: []
          }).then(response => {
            // Re-fetch users
            this.fetchUsers()

            global.toastr['success'](this.$t('v2.user.removeFromWorkspaceSuccess'), this.$t('general.success'))
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    revokeUserInvitation (user) {
      this.$refs.confirmModal.open(
        this.$t('errors.warning'),
        this.$t('v2.user.revokeInvitationConfirmation').replace('{username}', '<b>' + user.profile.full_name + '</b>')
      ).then(confirm => {
        if (confirm) {
          this.loading = true
          this.cancelInvitation(user.invitation_details.id).then((response) => {
            // Re-fetch users
            this.fetchUsers()

            global.toastr['success'](this.$t('v2.user.revokeInvitationSuccess'), this.$t('general.success'))
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    onDownloadClick () {
      this.downloadAllUsers()
    }
  }
}
</script>

<style scoped lang="scss">
  @import "styles/v2/colors.scss";

  .user-list-page {
    background-color: $white;
    position: relative;

    &__header {
      height: 60px;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
      padding: 0 30px;
      overflow: hidden;

      &__search-input {
        float: left;
        margin-top: 15px;
      }

      &__actions {
        float: right;

        .base-button {
          margin-left: 10px;
        }

        &__invite-button {
          margin-top: 10px;
          padding: 0 45px;
        }

        &__download-button {
          padding: 0;
          min-width: 80px;
          text-transform: uppercase;
        }
      }
    }

    &__content {
      padding: 24px 30px;
      box-sizing: border-box;
      height: calc(100vh - 180px);

      &__scroll-area {
        height: 100%;
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
