<template lang="pug">
  .used-acl-list
    .used-acl-list__title
      | {{ $t('v2.access.roleBeingUsedBy') }}

    base-table(
      :items="userVendorRoles"
      :headers="tableHeaders"
      :custom-pagination="pagination"
      :is-external-sort="true"
      :actions="tableActions"
      @actionClick="onTableActionClick"
      @sortOrderChange="onSortOrderChange"
      @pageLinkClick="onTablePageLinkClick"
      @pageSizeInput="onTablePageSizeInput"
    )

    // Initial white screen to show while state parameters are being loaded
    empty-state.used-acl-list__empty-state(
      v-if="hasUsedACLs === null"
    )

    // Has no acls using this role
    empty-state.used-acl-list__empty-state(
      v-if="hasUsedACLs === false"
      :message-text="$t('v2.access.createACLUsingRole')"
      :actions="[{key: 'create', text: $t('v2.access.createACL'), internalLink: createPage, query: { vendorRole: vendorRoleId }}]"
    )

    .used-acl-list__loading-indicator(
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
import { mapActions } from 'vuex'
import BaseTable from '@/components/v2/base-table/base-table'
import EmptyState from '@/components/v2/empty-state/empty-state'
import RemovalConfirmModal from '../access-control/removal-confirm-modal'
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

export default {
  name: 'used-acl-list',
  components: {
    BaseTable,
    EmptyState,
    RemovalConfirmModal
  },
  mixins: [
    UserPermissionsMixin,
    CurrentNodeSelectionsMixin
  ],
  props: {
    vendorRoleId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      loading: false,
      search: '',
      ordering: null,
      pagination: {
        page: 1,
        pageSize: 20,
        total: 0
      },
      tableHeaders: [
        {
          text: this.$t('v2.access.acl'),
          value: 'name'
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
      userVendorRoles: [],
      hasUsedACLs: null
    }
  },
  mounted () {
    this.fetchUsedACLs()
  },
  computed: {
    tableActions () {
      // Construct table actions taking user permissions into account
      const tableActions = []

      if (this.hasPermission('access_control__assign_vendor_roles', this.workspaceId)) {
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
    },
    createPage () {
      return 'NewAccessUserVendorRole'
    }
  },
  methods: {
    ...mapActions('workspace/access', ['fetchUserVendorRoles', 'deleteUserVendorRole']),
    fetchUsedACLs () {
      let filters = {
        page_size: this.pagination.pageSize,
        page: this.pagination.page,
        workspaceId: this.workspaceId,
        vendor_role: this.vendorRoleId
      }

      if (this.ordering) {
        filters.ordering = this.ordering
      }

      this.loading = true
      this.fetchUserVendorRoles(filters).then(response => {
        this.$set(this, 'userVendorRoles', response.data.data.results)
        this.$set(this.pagination, 'total', response.data.data.count)

        this.hasUsedACLs = response.data.data.count > 0
      }).finally(() => {
        this.loading = false
      })
    },
    onTablePageLinkClick (pageNumber) {
      this.$set(this.pagination, 'page', pageNumber)
      this.fetchUsedACLs()
    },
    onTablePageSizeInput (pageSize) {
      this.$set(this.pagination, 'pageSize', pageSize)

      // Reset page number
      this.$set(this.pagination, 'page', 1)

      this.fetchUsedACLs()
    },
    onSortOrderChange (ordering) {
      this.$set(this, 'ordering', ordering)

      // Reset page number
      this.$set(this.pagination, 'page', 1)

      this.fetchUsedACLs()
    },
    onTableActionClick (actionType, item) {
      if (actionType === 'edit') {
        this.$router.push({ name: 'AccessUserVendorRoleDetail', params: { userVendorRoleId: item.id } })
      } else if (actionType === 'remove') {
        this.removeUserVendorRole(item)
      }
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
            this.fetchUsedACLs()

            global.toastr['success'](this.$t('v2.access.removeUserVendorRoleSuccess'), this.$t('general.success'))

            this.$emit('aclDelete')
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.used-acl-list {
  background-color: $white;
  position: relative;
  min-height: 100px;

  &__title {
    line-height: 40px;
    font-family: Fira Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    color: $text-dark;
    margin-bottom: 20px;
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
