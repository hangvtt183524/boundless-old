<template lang="pug">
  .user-vendor-role-list.page-content
    .user-vendor-role-list__header
      search-input.base-text-input--small.user-vendor-role-list__header__search-input(
        :placeholder="$t('general.search')"
        v-model="search"
      )
      base-button.base-button--green.user-vendor-role-list__header__create-button(
        v-if="hasPermission('access_control__assign_vendor_roles', workspaceId)"
        @click="onCreateUserVendorRoleClick"
      )
        | {{ $t('v2.access.createAccessControlList') }}

    .user-vendor-role-list__content
      perfect-scrollbar.user-vendor-role-list__content__scroll-holder(
        :options="{ suppressScrollX: true }"
      )
        .user-vendor-role-list__content__table-container
          base-table.user-vendor-role-list__content__template-table(
            :items="userVendorRoles"
            :headers="tableHeaders"
            :actions="tableActions"
            @loadMore="onScrollEnd"
            @actionClick="onTableActionClick"
            @itemAction="onTableItemAction"
            :sortable="false"
          )

    // Initial white screen to show while state parameters are being loaded
    empty-state.user-vendor-role-list__empty-state(
      v-if="(hasACLs === null || !currentUser.id)"
      :loading="loading"
    )

    empty-state.user-vendor-role-list__empty-state(
      v-if="hasACLs === false && hasPermission('access_control__assign_vendor_roles', workspaceId)"
      :header-text="$t('v2.access.createYourFirstACL')"
      :message-text="$t('v2.access.createYourFirstACLDescription')"
      :actions="[{key: 'create', text: $t('v2.access.createAccessControlList')}]"
      :loading="loading"
      @actionClick="onEmptyStateActionClick"
    )

    .user-vendor-role-list__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )

    removal-confirm-modal(
      ref="confirmModal"
    )

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import BaseTable from '@/components/v2/base-table/base-table.vue'
import InlineEditCell from '@/components/v2/base-table/column-components/inline-edit-cell'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import SearchInput from '@/components/v2/search-input/search-input'
import EmptyState from '@/components/v2/empty-state/empty-state'
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import RemovalConfirmModal from './removal-confirm-modal'

export default {
  name: 'user-vendor-role-list',
  components: {
    RemovalConfirmModal,
    SearchInput,
    BaseTable,
    BaseButton,
    EmptyState
  },
  mixins: [
    UserPermissionsMixin,
    CurrentNodeSelectionsMixin
  ],
  data () {
    return {
      search: '',
      loading: false,
      page: 1,
      pageSize: 50,
      tableHeaders: [
        {
          text: this.$t('general.name'),
          value: 'name',
          cellComponent: InlineEditCell
        },
        {
          text: this.$t('general.description'),
          value: 'description',
          componentProps: {
            maxDisplayCharacters: 40
          },
          cellComponent: InlineEditCell
        },
        {
          text: this.$t('v2.access.permissionsRole'),
          value: 'vendor_role_name'
        },
        {
          text: this.$t('v2.access.currentUsers'),
          value: 'user_count'
        },
        {
          text: this.$t('wifi.createdBy'),
          value: 'created_by'
        }
      ],
      hasACLs: null
    }
  },
  mounted () {
    this.fetchUserRoles()
  },
  computed: {
    ...mapGetters('workspace/access', ['userVendorRoles', 'userVendorRolesCount']),
    pageCount () {
      return Math.ceil(this.vendorRolesCount / this.pageSize)
    },
    tableActions () {
      // Construct table actions taking user permissions into account
      const tableActions = []

      if (this.hasPermission('access_control__assign_vendor_roles', this.workspaceId)) {
        // For global / read-only vendor roles
        tableActions.push({
          icon: '$vuetify.icons.edit',
          type: 'edit',
          tooltip: this.$t('v2.access.modifyAcl')
        })

        tableActions.push({
          icon: '$vuetify.icons.delete',
          type: 'remove',
          tooltip: this.$t('v2.access.deleteAcl')
        })
      }

      return tableActions
    }
  },
  watch: {
    search: {
      handler: function () {
        // Reset page number
        this.page = 1

        // Re-fetch applications after search change
        this.fetchUserRoles()
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('workspace/access', ['fetchUserVendorRoles', 'deleteUserVendorRole', 'updateUserVendorRole',
      'updateUserVendorRoleInList']),
    ...mapActions('workspace', ['retrieveWorkspaceSetupStatus']),
    fetchUserRoles () {
      const filters = {
        workspaceId: this.workspaceId,
        page_size: this.pageSize,
        page: this.page,
        search: this.search
      }

      this.loading = true
      this.fetchUserVendorRoles(filters).then((response) => {
        this.hasACLs = response.data.data.count > 0
      }).finally(() => {
        this.loading = false
      })
    },
    onScrollEnd () {
      if (this.page < this.pageCount && !this.loading) {
        this.page = this.page + 1
        this.fetchUserRoles()
      }
    },
    onTableActionClick (actionType, item) {
      if (actionType === 'edit') {
        this.$router.push({ name: 'AccessUserVendorRoleDetail', params: { userVendorRoleId: item.id } })
      } else if (actionType === 'remove') {
        this.removeUserVendorRole(item)
      }
    },
    onCreateUserVendorRoleClick () {
      this.$router.push({ name: 'NewAccessUserVendorRole' })
    },
    removeUserVendorRole (userVendorRole) {
      this.$refs.confirmModal.open(userVendorRole).then(confirm => {
        if (confirm) {
          this.loading = true
          this.deleteUserVendorRole({
            workspaceId: this.workspaceId,
            id: userVendorRole.id
          }).then(response => {
            // Re-fetch roles
            this.fetchUserRoles()

            global.toastr['success'](this.$t('v2.access.removeUserVendorRoleSuccess'), this.$t('general.success'))
          })
        }
      })
    },
    onTableItemAction (item, field, value) {
      if (value.type === 'update') {
        this.updateTableItem({
          ...item,
          [field]: value.value
        })
      }
    },
    updateTableItem (userVendorRole) {
      this.loading = true
      this.updateUserVendorRole({
        workspaceId: this.workspaceId,
        ...userVendorRole
      }).then(response => {
        // Update item in store
        this.updateUserVendorRoleInList(response.data.data)
      }).finally(() => {
        this.loading = false
      })
    },
    onEmptyStateActionClick (actionType) {
      if (actionType === 'create') {
        // Check if we have api keys, redirect to acl creation page if so. Otherwise, redirect to api key setup page
        this.retrieveWorkspaceSetupStatus({ id: this.workspaceId }).then(response => {
          if (response.data.data.is_set_up) {
            this.$router.push({ name: 'NewAccessUserVendorRole' })
          } else {
            this.$router.push({ name: 'ExternalApiKeysSetup', params: { nextPage: 'NewAccessUserVendorRole', productName: 'access' } })
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .user-vendor-role-list {
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
      padding: 24px 30px;
      box-sizing: border-box;
      height: calc(100vh - 180px);

      &__scroll-holder {
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
