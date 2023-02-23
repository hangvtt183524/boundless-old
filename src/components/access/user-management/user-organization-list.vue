<template lang="pug">
  .user-organization-list
    .user-organization-list__header
      v-layout(row wrap)
        v-flex(xs6 md4 lg3 xl2)
          search-input.base-text-input--small.user-management-list__header__search-input(
            :placeholder="$t('v2.access.searchByOrganization')"
            v-model="search"
          )

    base-table(
      :items="organizationUsers"
      :headers="tableHeaders"
      :custom-pagination="pagination"
      :is-external-sort="true"
      :actions="tableActions"
      @actionClick="onTableActionClick"
      @sortOrderChange="onSortOrderChange"
      @pageLinkClick="onTablePageLinkClick"
      @pageSizeInput="onTablePageSizeInput"
    )

    .user-organization-list__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )

    single-user-removal-confirm-modal(
      ref="confirmModal"
    )

</template>

<script>
import { mapActions } from 'vuex'
import BaseTable from '@/components/v2/base-table/base-table'
import SearchInput from '@/components/v2/search-input/search-input'
import SingleUserRemovalConfirmModal from './single-user-removal-confirm-modal'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

export default {
  name: 'user-organization-list',
  components: {
    SingleUserRemovalConfirmModal,
    BaseTable,
    SearchInput
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  props: {
    merakiUserId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      loading: false,
      search: '',
      ordering: 'organization__name',
      pagination: {
        page: 1,
        pageSize: 20,
        total: 0
      },
      tableHeaders: [
        {
          text: this.$t('general.organization'),
          value: 'organization_name',
          sortKey: 'organization__name'
        },
        {
          text: this.$t('v2.access.privilege'),
          value: 'access',
          cellClass: 'capitalize'
        },
        {
          text: this.$t('v2.access.accountStatus'),
          value: 'account_status',
          cellClass: 'capitalize'
        }
      ],
      tableActions: [
        {
          icon: 'send',
          type: 'resend_invitation',
          tooltip: this.$t('v2.access.resendInvitation'),
          displayCondition: (item) => {
            return item.account_status === 'unverified' || item.account_status === 'pending'
          }
        },
        {
          icon: '$vuetify.icons.edit',
          type: 'edit'
        },
        {
          icon: '$vuetify.icons.delete',
          type: 'remove'
        }
      ],
      organizationUsers: [],
      hasOrganizationUsers: null
    }
  },
  mounted () {
    this.fetchOrganizationUsers()
  },
  watch: {
    search: {
      handler: function () {
        // Reset page number
        this.$set(this.pagination, 'page', 1)

        // Re-fetch applications after search change
        this.fetchOrganizationUsers()
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('workspace/access', ['fetchMerakiOrganizationUsers', 'deleteMerakiOrganizationUser',
      'resendMerakiOrganizationUserInvitation']),
    fetchOrganizationUsers () {
      let filters = {
        page_size: this.pagination.pageSize,
        page: this.pagination.page,
        workspaceId: this.workspaceId,
        search: this.search,
        user: this.merakiUserId
      }

      if (this.ordering) {
        filters.ordering = this.ordering
      }

      this.loading = true
      this.fetchMerakiOrganizationUsers(filters).then(response => {
        this.$set(this, 'organizationUsers', response.data.data.results)
        this.$set(this.pagination, 'total', response.data.data.count)

        this.hasOrganizationUsers = response.data.data.count > 0
      }).finally(() => {
        this.loading = false
      })
    },
    onTablePageLinkClick (pageNumber) {
      this.$set(this.pagination, 'page', pageNumber)
      this.fetchOrganizationUsers()
    },
    onTablePageSizeInput (pageSize) {
      this.$set(this.pagination, 'pageSize', pageSize)

      // Reset page number
      this.$set(this.pagination, 'page', 1)

      this.fetchOrganizationUsers()
    },
    onSortOrderChange (ordering) {
      this.$set(this, 'ordering', ordering)

      // Reset page number
      this.$set(this.pagination, 'page', 1)

      this.fetchOrganizationUsers()
    },
    onTableActionClick (actionType, item) {
      if (actionType === 'edit') {
        this.$router.push({ name: 'UserManagementOrganizationUserDetail',
          params: { ownerOrganizationId: item.base_organization_id, merakiOrganizationUserId: item.id } })
      } else if (actionType === 'remove') {
        this.deleteOrganizationUser(item)
      } else if (actionType === 'resend_invitation') {
        this.resendInvitation(item)
      }
    },
    deleteOrganizationUser (organizationUser) {
      this.$refs.confirmModal.open(
        organizationUser
      ).then(confirm => {
        if (confirm) {
          this.loading = true
          this.deleteMerakiOrganizationUser({
            workspaceId: this.workspaceId,
            id: organizationUser.id
          }).then(response => {
            // Re-fetch users
            this.fetchOrganizationUsers()

            global.toastr['success'](this.$t('v2.access.organizationUserSuccessfullyDeleted'), this.$t('general.success'))
          }).catch(err => {
            // Display Meraki errors if any
            const error = err.response.data.error
            if (error.messages.find(errorMessage => errorMessage.code === 'meraki_api_error')) {
              error.messages.forEach(errorMessage => {
                if (errorMessage.code === 'meraki_api_error') {
                  global.toastr['error'](errorMessage.message, this.$t('general.error'))
                }
              })
            } else {
              global.toastr['error'](this.$t('v2.access.organizationUserDeleteFailed'), this.$t('general.error'))
            }
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    resendInvitation (organizationUser) {
      this.loading = true
      this.resendMerakiOrganizationUserInvitation({
        workspaceId: this.workspaceId,
        id: organizationUser.id
      }).then(response => {
        // Re-fetch users
        this.fetchOrganizationUsers()

        const userAccountStatus = response.data.data.user_account_status
        if (userAccountStatus === 'ok') {
          // User already joined the organization
          global.toastr['success'](this.$t('v2.access.userSuccessfullyJoinedOrganization'), this.$t('general.success'))
        } else {
          global.toastr['success'](this.$t('v2.access.invitationSuccessfullyResent'), this.$t('general.success'))
        }
      }).catch(err => {
        // Display Meraki errors if any
        const error = err.response.data.error
        if (error.messages.find(errorMessage => errorMessage.code === 'meraki_api_error')) {
          error.messages.forEach(errorMessage => {
            if (errorMessage.code === 'meraki_api_error') {
              global.toastr['error'](errorMessage.message, this.$t('general.error'))
            }
          })
        } else {
          global.toastr['error'](this.$t('v2.access.failedToResendInvitation'), this.$t('general.error'))
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.user-organization-list {
  background-color: $white;
  position: relative;
  min-height: 100px;

  &__header {
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
