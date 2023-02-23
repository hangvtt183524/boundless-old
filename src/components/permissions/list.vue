<template lang="pug">
  .role-list-page.page-content
    .role-list-page__header
      search-input.base-text-input--small.role-list-page__header__search-input(
        v-if="hasPermission('roles__list', permissionCheckNodeId)"
        :placeholder="$t('v2.permissions.searchRoles')"
        v-model="search"
      )
      base-button.base-button--green.role-list-page__header__create-button(
        v-if="hasPermission('roles__create', permissionCheckNodeId)"
        @click="onCreateRoleClick"
      )
        | {{ $t('v2.permissions.createCustomRole') }}
    .role-list-page__content
      perfect-scrollbar.role-list-page__content__scroll-holder(
        :options="{ suppressScrollX: true }"
      )
        .role-list-page__content__table-container
          base-table.role-list-page__content__global-roles-table(
            v-if="hasPermission('roles__list', permissionCheckNodeId)"
            :items="globalRoles"
            :headers="globalRolesHeaders"
            :actions="globalRolesTableActions"
            @actionClick="onRolesTableActionClick"
            initial-sort-key="title"
          )
        .role-list-page__content__table-container(
          v-if="mode === modes.workspace"
        )
          base-table.role-list-page__content__custom-roles-table(
            v-if="hasPermission('roles__list', permissionCheckNodeId)"
            :items="customRoles"
            :headers="customRolesHeaders"
            :actions="customRolesTableActions"
            @actionClick="onRolesTableActionClick"
            initial-sort-key="title"
          )

    .role-list-page__loading-indicator(
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
import { mapActions, mapGetters } from 'vuex'
import BaseTable from '@/components/v2/base-table/base-table.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import SearchInput from '../v2/search-input/search-input'
import ConfirmModal from '@/components/v2/confirm-modal/confirm-modal'

import { dateTimeFormatter } from '@/utils/global-cell-formatters'

import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'role-list',
  components: {
    SearchInput,
    BaseTable,
    BaseButton,
    ConfirmModal
  },
  mixins: [
    UserPermissionsMixin,
    CurrentNodeSelectionsMixin
  ],
  props: {
    mode: {
      type: String,
      default: 'workspace'
    }
  },
  data: function () {
    return {
      loading: false,
      modes: {
        internal: 'internal',
        workspace: 'workspace'
      },
      search: ''
    }
  },
  mounted () {
    if (this.hasPermission('roles__list', this.permissionCheckNodeId)) {
      this.fetchRoleList()
    }
  },
  computed: {
    ...mapGetters('administration', ['roles']),
    globalRoles () {
      return this.roles.filter(role => {
        return role.workspace === null
      }).sort((a, b) => {
        // Sort so that system roles come first, then global roles
        return (a.system_role_type === null) - (b.system_role_type === null) ||
          (b.workspace === null) - (a.workspace === null) ||
          -(a.id > b.id) || +(a.id < b.id)
      })
    },
    customRoles () {
      return this.roles.filter(role => {
        return this.mode === this.modes.workspace && role.workspace === parseInt(this.workspaceId)
      })
    },
    globalRolesHeaders () {
      const headers = [
        {
          text: this.$t('v2.permissions.globalRoles'),
          value: 'title'
        },
        {
          text: this.$t('general.description'),
          value: 'description'
        },
        {
          text: this.$t('v2.permissions.assignedToUsers'),
          value: 'use_count'
        }
      ]

      return headers
    },
    customRolesHeaders () {
      const headers = [
        {
          text: this.$t('v2.permissions.customRoles'),
          value: 'title'
        },
        {
          text: this.$t('general.description'),
          value: 'description'
        },
        {
          text: this.$t('v2.permissions.assignedToUsers'),
          value: 'use_count'
        },
        {
          text: this.$t('wifi.createdOn'),
          value: 'created_at',
          formatter: dateTimeFormatter
        }
      ]

      return headers
    },
    customRolesTableActions () {
      // Construct table actions taking user permissions into account
      const tableActions = []

      if (this.hasPermission('roles__view', this.permissionCheckNodeId)) {
        tableActions.push({
          icon: '$vuetify.icons.edit',
          type: 'edit'
        })
      }

      if (this.hasPermission('roles__delete', this.permissionCheckNodeId)) {
        tableActions.push({
          icon: '$vuetify.icons.delete',
          type: 'remove'
        })
      }

      return tableActions
    },
    globalRolesTableActions () {
      let tableActions = this.mode === this.modes.internal ? [
        {
          icon: '$vuetify.icons.edit',
          type: 'edit'
        },
        {
          icon: '$vuetify.icons.delete',
          type: 'remove',
          displayCondition: function (row) {
            return row.system_role_type === null
          }
        }
      ] : [
        {
          icon: 'visibility',
          type: 'edit',
          tooltip: this.$t('v2.permissions.viewRolePermissions')
        }
      ]

      if (!this.hasPermission('roles__view', this.permissionCheckNodeId)) {
        tableActions = tableActions.filter(action => {
          return action.type !== 'edit'
        })
      }

      if (!this.hasPermission('roles__delete', this.permissionCheckNodeId)) {
        tableActions = tableActions.filter(action => {
          return action.type !== 'remove'
        })
      }

      return tableActions
    },
    permissionCheckNodeId () {
      return this.mode === this.modes.internal ? null : this.workspaceId
    }
  },
  watch: {
    search: {
      handler: function () {
        // Reset page number
        this.page = 1

        // Re-fetch roles after search change
        this.fetchRoleList()

        EventTracker.sendEvent(EVENT_NAMES.ROLE_LIST_SEARCHED)
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('administration', ['fetchRoles', 'deleteRole']),
    fetchRoleList () {
      let filters = {
        page_size: 0,
        search: this.search
      }

      if (this.mode === this.modes.workspace) {
        filters['workspace'] = this.workspaceId
      } else {
        filters['workspace'] = 0
      }

      this.loading = true
      this.fetchRoles(filters).finally(() => {
        this.loading = false
      })
    },
    onRolesTableActionClick (actionType, item) {
      if (actionType === 'edit') {
        if (this.mode === this.modes.workspace) {
          this.$router.push({ name: 'RoleDetail', params: { roleId: item.id } })
        } else {
          this.$router.push({ name: 'InternalRoleDetail', params: { roleId: item.id } })
        }
      } else if (actionType === 'remove') {
        this.removeRole(item)
      }
    },
    onCreateRoleClick () {
      if (this.mode === this.modes.workspace) {
        this.$router.push({ name: 'NewRole' })
      } else {
        this.$router.push({ name: 'NewInternalRole' })
      }

      EventTracker.sendEvent(EVENT_NAMES.CUSTOM_ROLE_STARTED)
    },
    removeRole (role) {
      this.$refs.confirmModal.open(
        this.$t('errors.warning'),
        this.$t('v2.permissions.removeRoleConfirmation').replace('{rolename}', '<b>' + role.title + '</b>')
      ).then(confirm => {
        if (confirm) {
          this.loading = true
          this.deleteRole(role.id).then(response => {
            // Re-fetch roles
            this.fetchRoleList()

            global.toastr['success'](this.$t('v2.permissions.removeRoleSuccess'), this.$t('general.success'))
          }).catch(() => {
            this.loading = false
          })

          EventTracker.sendEvent(EVENT_NAMES.CUSTOM_ROLE_DELETED)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .role-list-page {
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

      &__create-button {
        float: right;
        margin-top: 10px;
        padding: 0 45px;
      }
    }

    &__content {
      box-sizing: border-box;
      height: calc(100vh - 180px);

      &__scroll-holder {
        height: 100%;
      }

      &__table-container {
        padding: 30px;

        &:first-child {
          border-bottom: 3px solid $gray-xlight;
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
</style>
