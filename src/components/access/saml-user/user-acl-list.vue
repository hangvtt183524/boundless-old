<template lang="pug">
  .user-acl-list
    .user-acl-list__header
      v-layout(row wrap)
        v-flex(xs6 md4 lg3 xl2)
          search-input.base-text-input--small.user-acl-list__header__search-input(
            :placeholder="$t('v2.access.searchByAclOrOrganization')"
            v-model="search"
          )

    base-table(
      :items="userVendorRoles"
      :headers="tableHeaders"
      :custom-pagination="pagination"
      :is-external-sort="true"
      :actions="tableActions"
      :is-expandable="true"
      :expand-tooltip="$t('v2.access.viewOrganizations')"
      @actionClick="onTableActionClick"
      @sortOrderChange="onSortOrderChange"
      @pageLinkClick="onTablePageLinkClick"
      @pageSizeInput="onTablePageSizeInput"
    )
      template(
        v-slot:row-expand-area='props'
      )
        .user-acl-list__user-acl-organizations
          user-acl-organization-list(
            :organizations="getACLOrganizations(props.props.item)"
          )

    .user-acl-list__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )

    user-remove-from-acl-confirm-modal(
      ref="confirmModal"
    )

</template>

<script>
import _ from 'lodash'
import { mapActions } from 'vuex'
import BaseTable from '@/components/v2/base-table/base-table'
import EmptyState from '@/components/v2/empty-state/empty-state'
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import SearchInput from '@/components/v2/search-input/search-input'
import UserRemoveFromAclConfirmModal from './user-remove-from-acl-confirm-modal'
import UserAclOrganizationList from './user-acl-organization-list'

export default {
  name: 'user-acl-list',
  components: {
    UserAclOrganizationList,
    UserRemoveFromAclConfirmModal,
    BaseTable,
    SearchInput,
    EmptyState
  },
  mixins: [
    UserPermissionsMixin,
    CurrentNodeSelectionsMixin
  ],
  props: {
    userId: {
      type: Number,
      required: true
    },
    userEmail: {
      type: String,
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
          text: this.$t('v2.access.organizationCount'),
          value: 'targets',
          formatter: (value) => {
            return _.uniq(value.map(target => target.meraki_organization_name)).length
          }
        },
        {
          text: this.$t('v2.access.permissions'),
          value: 'vendor_role_name'
        }
      ],
      userVendorRoles: []
    }
  },
  mounted () {
    this.fetchUserACLs()
  },
  watch: {
    search: {
      handler: function () {
        // Reset page number
        this.$set(this.pagination, 'page', 1)

        // Re-fetch applications after search change
        this.fetchUserACLs()
      },
      deep: true
    }
  },
  computed: {
    tableActions () {
      // Construct table actions taking user permissions into account
      const tableActions = []

      if (this.hasPermission('access_control__assign_vendor_roles', this.workspaceId)) {
        tableActions.push({
          icon: '$vuetify.icons.edit',
          type: 'edit',
          tooltip: this.$t('v2.access.editPermissions')
        })

        tableActions.push({
          icon: '$vuetify.icons.delete',
          type: 'remove',
          tooltip: this.$t('v2.access.removeUserFromACL')
        })
      }

      return tableActions
    }
  },
  methods: {
    ...mapActions('workspace/access', ['fetchUserVendorRoles', 'removeUserFromUserVendorRole']),
    fetchUserACLs () {
      let filters = {
        page_size: this.pagination.pageSize,
        page: this.pagination.page,
        workspaceId: this.workspaceId,
        search: this.search,
        user: this.userId
      }

      if (this.ordering) {
        filters.ordering = this.ordering
      }

      this.loading = true
      this.fetchUserVendorRoles(filters).then(response => {
        this.$set(this, 'userVendorRoles', response.data.data.results)
        this.$set(this.pagination, 'total', response.data.data.count)
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
        // Open vendor role detail screen
        this.$router.push({ name: 'AccessVendorRoleDetail', params: { vendorRoleId: item.vendor_role } })
      } else if (actionType === 'remove') {
        this.removeUserFromACL(item)
      }
    },
    removeUserFromACL (acl) {
      this.$refs.confirmModal.open(
        this.userEmail, acl
      ).then(confirm => {
        if (confirm) {
          this.loading = true
          this.removeUserFromUserVendorRole({
            workspaceId: this.workspaceId,
            id: acl.id,
            user: this.userId
          }).then(response => {
            // Re-fetch user ACLs
            this.fetchUserACLs()

            global.toastr['success'](this.$t('v2.access.userRemoveFromACLSuccess'), this.$t('general.success'))
          }).catch(() => {
            global.toastr['error'](this.$t('v2.access.userRemoveFromACLFailure'), this.$t('general.error'))
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    getACLOrganizations (acl) {
      return _.uniq(acl.targets.map(target => target.meraki_organization.name)).map(organizationName => {
        return {
          name: organizationName
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.user-acl-list {
  background-color: $white;
  position: relative;
  min-height: 100px;

  &__header {
    margin-bottom: 20px;
  }

  &__user-acl-organizations {
    min-height: 80px;
    padding: 20px;
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
