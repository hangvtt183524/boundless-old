<template lang="pug">
  .saml-user-list.page-content
    .saml-user-list__header
      search-input.base-text-input--small.saml-user-list__header__search-input(
        :placeholder="$t('general.search')"
        v-model="search"
      )

      .saml-user-list__header__actions
        base-button(
          @click="onInviteUserClick"
        ).base-button--green.saml-user-list__header__actions__action
          | {{ $t('v2.access.addSamlUsers') }}

    .saml-user-list__content
      perfect-scrollbar.saml-user-list__content__scroll-holder(
        :options="{ suppressScrollX: true }"
      )
        .saml-user-list__content__table-container
          base-table.saml-user-list__content__template-table(
            :items="samlUsers"
            :headers="tableHeaders"
            :is-external-sort="true"
            :is-expandable="true"
            :expand-tooltip="$t('v2.access.viewACLs')"
            :actions="tableActions"
            @actionClick="onTableActionClick"
            @loadMore="onScrollEnd"
            @sortOrderChange="onSortOrderChange"
          )
            template(
              v-slot:row-expand-area='props'
            )
              .saml-user-list__content__template-table__user-acls
                user-acl-list(
                  :user-id="props.props.item.id"
                  :user-email="props.props.item.email"
                )

    .saml-user-list__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )

    user-remove-confirm-modal(
      ref="confirmModal"
      :workspace-id="workspaceId"
    )

    user-acl-assignment-modal(
      ref="aclAssignmentModal"
      :workspace-id="workspaceId"
    )

    user-invitation-modal(
      ref="invitationModal"
      :workspace-id="workspaceId"
    )

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import BaseTable from '@/components/v2/base-table/base-table.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import SearchInput from '@/components/v2/search-input/search-input'
import UserAclList from './user-acl-list'
import UserRemoveConfirmModal from './user-remove-confirm-modal'
import UserAclAssignmentModal from './user-acl-assignment-modal'
import UserInvitationModal from './user-invitation-modal'
import UserStatusCell from '@/components/user/status-cell'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

export default {
  name: 'saml-user-list',
  components: {
    UserInvitationModal,
    UserAclAssignmentModal,
    UserRemoveConfirmModal,
    UserAclList,
    SearchInput,
    BaseTable,
    BaseButton
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
          value: 'profile.full_name',
          sortable: true,
          sortKey: 'profile__first_name'
        },
        {
          text: this.$t('general.email'),
          value: 'email',
          sortable: true
        },
        {
          text: this.$t('general.status'),
          value: 'is_pending_invitation',
          cellComponent: UserStatusCell,
          sortable: false
        },
        {
          text: this.$t('v2.access.organizationCount'),
          value: 'organization_count',
          sortable: false
        },
        {
          text: this.$t('v2.access.aclCount'),
          value: 'vendor_role_count',
          sortable: false
        }
      ],
      tableActions: [
        {
          icon: 'add_box',
          type: 'add',
          tooltip: this.$t('v2.access.addToACLs')
        },
        {
          icon: '$vuetify.icons.delete',
          type: 'remove',
          tooltip: this.$t('v2.user.deleteUser')
        }
      ]
    }
  },
  mounted () {
    this.fetchUsers()
  },
  computed: {
    ...mapGetters('workspace/access', ['samlUsers', 'samlUsersCount']),
    pageCount () {
      return Math.ceil(this.samlUsersCount / this.pageSize)
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
    ...mapActions('workspace/access', ['fetchSAMLUsers', 'removeSAMLUser']),
    fetchUsers () {
      const filters = {
        workspaceId: this.workspaceId,
        page_size: this.pageSize,
        page: this.page,
        search: this.search,
        ordering: this.ordering
      }

      this.loading = true
      this.fetchSAMLUsers(filters).finally(() => {
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
    onTableActionClick (actionType, item) {
      if (actionType === 'add') {
        this.addUserToACLs(item)
      } else if (actionType === 'remove') {
        this.removeUser(item)
      }
    },
    onInviteUserClick () {
      this.$refs.invitationModal.open().then(confirm => {
        if (confirm) {
          // Re-fetch users
          this.fetchUsers()
        }
      })
    },
    addUserToACLs (user) {
      this.$refs.aclAssignmentModal.open(
        user
      ).then(confirm => {
        if (confirm) {
          // Re-fetch users
          this.fetchUsers()
        }
      })
    },
    removeUser (user) {
      this.$refs.confirmModal.open(
        user
      ).then(confirm => {
        if (confirm) {
          this.loading = true
          this.removeSAMLUser({
            workspaceId: this.workspaceId,
            id: user.id
          }).then(response => {
            // Re-fetch users
            this.fetchUsers()

            global.toastr['success'](this.$t('v2.access.samlUserRemoveSuccess'), this.$t('general.success'))
          }).catch(() => {
            global.toastr['error'](this.$t('v2.access.samlUserRemoveFailure'), this.$t('general.error'))
          }).finally(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.saml-user-list {
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
        margin-top: 10px;
        padding: 0 20px;
      }
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
      height: 100%;

      &__user-acls {
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
