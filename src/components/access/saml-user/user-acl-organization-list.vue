<template lang="pug">
  .user-acl-organization-list
    .user-acl-organization-list__header
      v-layout(row wrap)
        v-flex(xs6 md4 lg3 xl2)
          search-input.base-text-input--small.user-acl-organization-list__header__search-input(
            :placeholder="$t('general.search')"
            v-model="search"
          )

    base-table(
      :items="paginatedOrganizations"
      :headers="tableHeaders"
      :custom-pagination="pagination"
      sortable
      @pageLinkClick="onTablePageLinkClick"
      @pageSizeInput="onTablePageSizeInput"
    )

</template>

<script>
import BaseTable from '@/components/v2/base-table/base-table'
import EmptyState from '@/components/v2/empty-state/empty-state'
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import SearchInput from '@/components/v2/search-input/search-input'

export default {
  name: 'user-acl-organization-list',
  components: {
    BaseTable,
    SearchInput,
    EmptyState
  },
  mixins: [
    UserPermissionsMixin,
    CurrentNodeSelectionsMixin
  ],
  props: {
    organizations: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      search: '',
      page: 1,
      pageSize: 20,
      tableHeaders: [
        {
          text: this.$t('general.organization'),
          value: 'name'
        }
      ]
    }
  },
  computed: {
    filteredOrganizations () {
      if (!this.search) {
        // No search query
        return this.organizations
      }

      return this.organizations.filter(organization => {
        return organization.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1
      })
    },
    paginatedOrganizations () {
      return this.filteredOrganizations.slice((this.pagination.page - 1) * this.pagination.pageSize, this.pagination.page * this.pagination.pageSize)
    },
    pagination () {
      return {
        page: this.page,
        pageSize: this.pageSize,
        total: this.filteredOrganizations.length
      }
    }
  },
  watch: {
    search: {
      handler: function () {
        // Reset page number on search query change
        this.page = 1
      },
      deep: true
    }
  },
  methods: {
    onTablePageLinkClick (pageNumber) {
      this.page = pageNumber
    },
    onTablePageSizeInput (pageSize) {
      this.pageSize = pageSize

      // Reset page number
      this.page = 1
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.user-acl-organization-list {
  background-color: $white;
  position: relative;
  min-height: 100px;

  &__header {
    margin-bottom: 20px;
  }
}
</style>
