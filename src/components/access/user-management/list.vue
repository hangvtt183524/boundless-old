<template lang="pug">
  .user-management-list.page-content
    .user-management-list__header
      search-input.base-text-input--small.user-management-list__header__search-input(
        :placeholder="$t('general.search')"
        v-model="search"
      )

      .user-management-list__header__actions
        base-button(
          @click="onAddUsersClick"
        ).base-button--green.user-management-list__header__actions__action.user-management-list__header__actions__invite-button
          | {{ $t('v2.access.addUsersToOrganizations') }}

        base-button(
          @click="onDeleteUsersClick"
          :disabled="selectedUsers.length === 0"
        ).base-button--blue.user-management-list__header__actions__action.user-management-list__header__actions__delete-button
          v-icon $vuetify.icons.delete

    .user-management-list__content
      .user-management-list__content__table-container
        base-table.user-management-list__content__template-table(
          :items="merakiUsers"
          :headers="tableHeaders"
          :is-external-sort="true"
          :is-expandable="true"
          :total-items="merakiUsersCount"
          :multi-selectable="true"
          :total-selectable="true"
          :is-total-selected="isTotalSelected"
          :actions="tableActions"
          @actionClick="onTableActionClick"
          @loadMore="onScrollEnd"
          @sortOrderChange="onSortOrderChange"
          @rowSelectionChange="onRowSelectionChange"
          @totalSelectionChange="onTotalSelectionChange"
        )
          template(
            v-slot:row-expand-area='props'
          )
            .user-management-list__content__template-table__user-organizations
              user-organization-list(
                :meraki-user-id="props.props.item.id"
              )

    .user-management-list__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )

    // Initial white screen to show while state parameters are being loaded
    empty-state.user-vendor-role-list__empty-state(
      v-if="isUsersLoaded === false"
    )

    // No users
    empty-state.application-list__empty-state(
      v-if="isUsersLoaded === true && !this.search &&  this.merakiUsers.length === 0"
      :header-text="$t('v2.access.manageMerakiUserBase')"
      :message-text="$t('v2.access.manageMerakiUserBaseDescription')"
      :actions="[{key: 'configure', text: $t('v2.access.getStarted')}]"
      @actionClick="onEmptyStateActionClick"
    )

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import BaseTable from '@/components/v2/base-table/base-table.vue'
import BaseButton from '@/components/v2/base-button/base-button'
import SearchInput from '@/components/v2/search-input/search-input'
import EmptyState from '@/components/v2/empty-state/empty-state'
import UserOrganizationList from './user-organization-list'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

export default {
  name: 'user-management-list',
  components: {
    UserOrganizationList,
    SearchInput,
    BaseTable,
    BaseButton,
    EmptyState
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  data () {
    return {
      search: '',
      loading: false,
      ordering: 'email',
      page: 1,
      pageSize: 50,
      tableHeaders: [
        {
          text: this.$t('general.name'),
          value: 'name',
          sortable: true
        },
        {
          text: this.$t('general.email'),
          value: 'email',
          sortable: true
        },
        {
          text: this.$t('v2.access.organizationCount'),
          value: 'organization_count',
          sortable: true
        }
      ],
      tableActions: [
        {
          icon: '$vuetify.icons.edit',
          type: 'edit'
        }
      ],
      isTotalSelected: false,
      selectedUsers: [],
      isUsersLoaded: false
    }
  },
  mounted () {
    this.fetchUsers()
  },
  computed: {
    ...mapGetters('workspace/access', ['merakiUsers', 'merakiUsersCount']),
    pageCount () {
      return Math.ceil(this.merakiUsersCount / this.pageSize)
    }
  },
  watch: {
    search: {
      handler: function () {
        // Reset page number
        this.page = 1

        // Re-fetch applications after search change
        this.fetchUsers()
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('workspace/access', ['fetchMerakiUsers']),
    ...mapActions('workspace', ['retrieveWorkspaceSetupStatus']),
    fetchUsers (pageSize, page) {
      const filters = {
        workspaceId: this.workspaceId,
        page_size: pageSize !== undefined ? pageSize : this.pageSize,
        page: page !== undefined ? page : this.page,
        search: this.search,
        ordering: this.ordering
      }

      this.loading = true
      return this.fetchMerakiUsers(filters).then(() => {
        this.isUsersLoaded = true
      }).finally(() => {
        this.loading = false
      })
    },
    onScrollEnd () {
      if (this.page < this.pageCount && !this.loading) {
        this.page = this.page + 1
        this.fetchUsers()
      }
    },
    onSortOrderChange (ordering) {
      this.ordering = ordering

      // Reset page number
      this.page = 1

      this.fetchUsers()
    },
    onRowSelectionChange (selectedRows) {
      this.selectedUsers = selectedRows
    },
    onTotalSelectionChange (isTotalSelected) {
      this.isTotalSelected = isTotalSelected
    },
    onTableActionClick (actionType, item) {
      if (actionType === 'edit') {
        this.$router.push({ name: 'UserManagementUserDetail', params: { merakiUserId: item.id } })
      }
    },
    onAddUsersClick () {
      this.$router.push({ name: 'UserManagementInvitation', params: { selectedUsers: this.selectedUsers } })
    },
    onDeleteUsersClick () {
      if (this.isTotalSelected) {
        // Fetch all users first, then open removal page with those users
        this.fetchUsers(0, 1).then(() => {
          this.openUserRemovalPage()
        })
      } else {
        // Directly open removal page with current selections
        this.openUserRemovalPage()
      }
    },
    openUserRemovalPage () {
      this.$router.push({ name: 'UserManagementRemoval', params: { selectedUsers: this.selectedUsers } })
    },
    onEmptyStateActionClick (actionType) {
      if (actionType === 'configure') {
        // Check if we have api keys, redirect to organization import page if so. Otherwise, redirect to api key setup page
        this.retrieveWorkspaceSetupStatus({ id: this.workspaceId }).then(response => {
          if (response.data.data.is_set_up) {
            this.$router.push({ name: 'AccessApplicationConfiguration' })
          } else {
            this.$router.push({
              name: 'ExternalApiKeysSetup',
              params: { nextPage: 'AccessApplicationConfiguration', productName: 'access', waitImportCompletion: true }
            })
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.user-management-list {
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

      a {
        display: inline-block;
      }

      .base-button {
        margin-left: 10px;
        margin-top: 10px;
      }

      &__invite-button {
        padding: 0 45px;
      }

      &__delete-button {
        .v-icon {
          color: $white;
          font-size: 16px;
          position: relative;
          top: 2px;
        }
      }
    }
  }

  &__content {
    padding: 24px 30px;
    box-sizing: border-box;
    height: calc(100vh - 180px);

    &__table-container {
      height: 100%;
    }

    &__template-table {
      height: 100%;
      &__user-organizations {
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
