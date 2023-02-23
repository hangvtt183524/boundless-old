<template lang="pug">
  .vendor-role-list.page-content
    .vendor-role-list__header
      search-input.base-text-input--small.vendor-role-list__header__search-input(
        :placeholder="$t('general.search')"
        v-model="search"
      )
      base-button.base-button--green.vendor-role-list__header__create-button(
        v-if="hasPermission('access_control__create_vendor_role', workspaceId)"
        @click="onCreateVendorRoleClick"
      )
        | {{ $t('v2.access.createNewRole') }}

    .vendor-role-list__content
      perfect-scrollbar.vendor-role-list__content__scroll-holder(
        :options="{ suppressScrollX: true }"
      )
        .vendor-role-list__content__table-container
          base-table.vendor-role-list__content__template-table(
            :items="sortedVendorRoles"
            :headers="tableHeaders"
            :actions="tableActions"
            :is-expandable="true"
            :expand-tooltip="$t('v2.access.viewACLs')"
            :row-clickable="true"
            :sortable="false"
            @loadMore="onScrollEnd"
            @actionClick="onTableActionClick"
            @rowClick="onRowClick"
            ref="permissionsTable"
          )
            template(
              v-slot:row-expand-area='props'
            )
              .vendor-role-list__content__template-table__user-vendor-roles
                used-acl-list(
                  :vendor-role-id="props.props.item.id"
                  @aclDelete="onUsedAclDelete(props.props.item)"
                )

    .vendor-role-list__loading-indicator(
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
import SearchInput from '@/components/v2/search-input/search-input'
import ConfirmModal from '@/components/v2/confirm-modal/confirm-modal'
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import UsedAclList from './used-acl-list'

export default {
  name: 'vendor-role-list',
  components: {
    UsedAclList,
    SearchInput,
    BaseTable,
    BaseButton,
    ConfirmModal
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
          value: 'name'
        },
        {
          text: this.$t('v2.access.aclUsage'),
          value: 'use_count'
        }
      ]
    }
  },
  mounted () {
    this.fetchRoles()
  },
  computed: {
    ...mapGetters('workspace/access', ['vendorRoles', 'vendorRolesCount']),
    sortedVendorRoles () {
      // Display global vendor roles first
      return [...this.vendorRoles].sort((first, second) => {
        if (first.owner && !second.owner) {
          return 1
        } else if (second.owner && !first.owner) {
          return -1
        }

        return 0
      })
    },
    pageCount () {
      return Math.ceil(this.vendorRolesCount / this.pageSize)
    },
    tableActions () {
      // Construct table actions taking user permissions into account
      const tableActions = []

      if (this.hasPermission('access_control__view_vendor_role', this.workspaceId)) {
        tableActions.push({
          icon: '$vuetify.icons.edit',
          type: 'edit',
          tooltip: this.$t('v2.access.editPermissions')
        })
      }

      if (this.hasPermission('access_control__create_vendor_role', this.workspaceId)) {
        tableActions.push({
          icon: 'file_copy',
          type: 'duplicate',
          tooltip: this.$t('v2.access.duplicatePermissions')
        })
      }

      if (this.hasPermission('access_control__delete_vendor_role', this.workspaceId)) {
        tableActions.push({
          icon: '$vuetify.icons.delete',
          type: 'remove',
          disabled: (item) => {
            return item.use_count !== 0
          },
          tooltip: (item) => {
            return item.use_count !== 0 ? this.$t('v2.access.deleteACLsFirst') : this.$t('v2.access.deletePermissions')
          },
          displayCondition: (item) => {
            return !!item.workspace
          }
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
        this.fetchRoles()
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('workspace/access', ['fetchVendorRoles', 'deleteVendorRole', 'createVendorRole']),
    fetchRoles () {
      const filters = {
        page_size: this.pageSize,
        page: this.page,
        search: this.search,
        workspace: this.workspaceId
      }

      this.loading = true
      this.fetchVendorRoles(filters).finally(() => {
        this.loading = false
      })
    },
    onScrollEnd () {
      if (this.page < this.pageCount && !this.loading) {
        this.page = this.page + 1
        this.fetchRoles()
      }
    },
    onTableActionClick (actionType, item) {
      if (actionType === 'edit') {
        this.$router.push({ name: 'AccessVendorRoleDetail', params: { vendorRoleId: item.id } })
      } else if (actionType === 'remove') {
        this.removeVendorRole(item)
      } else if (actionType === 'duplicate') {
        this.duplicateVendorRole(item)
      }
    },
    onRowClick (row) {
      // Toggle row expand state
      this.$refs.permissionsTable.onExpandClick(row)
    },
    onCreateVendorRoleClick () {
      this.$router.push({ name: 'NewAccessVendorRole' })
    },
    removeVendorRole (vendorRole) {
      this.$refs.confirmModal.open(
        this.$t('errors.warning'),
        this.$t('v2.access.removeVendorRoleConfirmation').replace('{rolename}', '<b>' + vendorRole.name + '</b>')
      ).then(confirm => {
        if (confirm) {
          this.loading = true
          this.deleteVendorRole({ id: vendorRole.id }).then(response => {
            // Re-fetch roles
            this.fetchRoles()

            global.toastr['success'](this.$t('v2.access.removeVendorRoleSuccess'), this.$t('general.success'))
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    duplicateVendorRole (vendorRole) {
      this.$refs.confirmModal.open(
        this.$t('errors.warning'),
        this.$t('v2.access.vendorRoleDuplicateConfirmation').replace('{rolename}', '<b>' + vendorRole.name + '</b>')
      ).then(confirm => {
        if (confirm) {
          this.loading = true
          const duplicateVendorRole = {
            ...vendorRole,
            workspace: this.workspaceId,
            name: `Copy of ${vendorRole.name}`
          }
          delete duplicateVendorRole.id

          this.createVendorRole(duplicateVendorRole).then(() => {
            // Re-fetch roles
            this.fetchRoles()

            global.toastr['success'](this.$t('v2.access.duplicateVendorRoleSuccess'), this.$t('general.success'))
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    onUsedAclDelete (role) {
      role.use_count--
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.vendor-role-list {
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

    &__template-table {
      &__user-vendor-roles {
        min-height: 120px;
        padding: 20px;
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
