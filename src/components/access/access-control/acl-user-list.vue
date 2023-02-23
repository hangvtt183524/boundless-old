<template lang="pug">
  .acl-user-list
    .acl-user-list__header
      search-input.acl-user-list__header__search-input(
        v-model="search"
        :placeholder="$t('general.search')"
      )

    .acl-user-list__list
      base-table.acl-user-list__table(
        :items="filteredAclUsers"
        :headers="tableHeaders"
        item-key="email"
        :sortable="false"
        :multi-selectable="true"
        :select-on-row-click="true"
        :actions="tableActions"
        actions-label=" "
        :actions-head-more="actionsHeadMore"
        always-editable
        @actionClick="onTableActionClick"
        @itemInput="onTableItemInput"
        @rowSelectionChange="onRowSelectionChange"
        @headMoreInput="onTableHeadMoreInput"
      )

</template>

<script>
import BaseTable from '@/components/v2/base-table/base-table'
import SearchInput from '@/components/v2/search-input/search-input'
import ClickActionHeaderCell from '@/components/v2/base-table/column-components/click-action-header-cell'
import { booleanFormatter } from '@/utils/global-cell-formatters'

export default {
  name: 'acl-user-list',
  components: {
    SearchInput,
    BaseTable
  },
  props: {
    userVendorRole: {
      type: Object,
      required: true
    },
    existingUsers: {
      type: Array,
      default: () => []
    },
    usersToMigrate: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      search: null,
      tableHeaders: [
        {
          text: this.$t('general.user'),
          value: 'email',
          formatter: (value, item) => {
            return `${item.full_name} <${item.email}>`
          }
        },
        {
          text: this.$t('v2.access.existingUser'),
          value: 'is_existing_user',
          formatter: booleanFormatter
        },
        {
          text: this.$t('v2.access.migrateUser'),
          value: 'to_be_migrated',
          type: Boolean,
          component: 'check_box',
          editable: true,
          hidden: (value, item) => {
            return !item.is_existing_user
          }
        }
      ],
      tableActions: [
        {
          icon: '$vuetify.icons.delete',
          type: 'remove',
          tooltip: this.$t('v2.access.removeUserFromACL')
        }
      ],
      selectedUsers: []
    }
  },
  computed: {
    aclUsers () {
      const existingUserEmails = this.existingUsers.map(user => user.email)
      return this.userVendorRole.connected_users.map(user => {
        return {
          ...user,
          is_existing_user: existingUserEmails.indexOf(user.email) > -1,
          to_be_migrated: this.usersToMigrate.indexOf(user.email) > -1
        }
      }).sort((first, second) => {
        if (first.is_existing_user && !second.is_existing_user) {
          return 1
        } else if (second.is_existing_user && !first.is_existing_user) {
          return -1
        }

        return 0
      })
    },
    filteredAclUsers () {
      return !this.search
        ? this.aclUsers
        : this.aclUsers.filter(user => user.email.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
    },
    actionsHeadMore () {
      return {
        component: ClickActionHeaderCell,
        props: {
          icon: 'remove_circle_outline',
          text: this.$t('general.removeSelected'),
          disabled: this.selectedUsers.length === 0
        }
      }
    }
  },
  methods: {
    onRowSelectionChange (selectedRows) {
      this.selectedUsers = selectedRows
    },
    onTableActionClick (action, tableItem) {
      if (action === 'remove') {
        this.$emit('userRemove', [tableItem.email])
      }
    },
    onTableHeadMoreInput (header, event) {
      if (header.value === '_actions' && event.action === 'click') {
        // Remove all selected items
        this.$emit('userRemove', this.selectedUsers.map(user => user.email))
      }
    },
    onTableItemInput (tableItem, field, value) {
      if (field === 'to_be_migrated') {
        if (value && this.usersToMigrate.indexOf(tableItem.email) === -1) {
          this.$emit('migrateUsersUpdate', [ ...this.usersToMigrate, tableItem.email ])
        } else if (!value && this.usersToMigrate.indexOf(tableItem.email) > -1) {
          this.$emit('migrateUsersUpdate', this.usersToMigrate.filter(email => email !== tableItem.email))
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.acl-user-list {
  position: relative;
  border: 1px solid $gray-light;
  height: 100%;

  &__header {
    height: 40px;
    overflow: hidden;

    .base-text-input ::v-deep {
      input {
        height: 40px;
        color: $text-dark;
        border: none;
        padding: 9px 54px 9px 35px;
        border-radius: 0;

        &:focus {
          border-color: $green-light;
        }
      }
    }
  }

  &__list {
    position: relative;
    height: calc(100% - 40px);
    overflow: hidden;

    .base-table {
      height: 100%;
    }
  }
}

</style>
