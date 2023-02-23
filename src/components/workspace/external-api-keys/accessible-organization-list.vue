<template lang="pug">
  .workspace-external-api-key-accessible-organization-list
    base-table(
      :items="organizations"
      :headers="tableHeaders"
      :custom-pagination="pagination"
      :sortable="true"
      @pageLinkClick="onTablePageLinkClick"
      @pageSizeInput="onTablePageSizeInput"
      @sortOrderChange="onSortOrderChange"
    )

    .workspace-external-api-key-accessible-organization-list__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )

</template>

<script>
import BaseTable from '@/components/v2/base-table/base-table'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import { mapActions } from 'vuex'

export default {
  name: 'workspace-external-api-key-accessible-organization-list',
  components: {
    BaseTable
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  props: {
    apiKeyId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      loading: false,
      pagination: {
        page: 1,
        pageSize: 5,
        total: 0
      },
      ordering: 'name',
      organizations: [],
      tableHeaders: [
        {
          text: this.$t('general.name'),
          value: 'name'
        },
        {
          text: this.$t('v2.workspaces.externalApiKeys.organizationAccess'),
          value: 'access',
          formatter: (value) => {
            return value.charAt(0).toUpperCase() + value.slice(1) // Capitalized
          }
        }
      ]
    }
  },
  mounted () {
    this.fetchApiKeyOrganizations()
  },
  methods: {
    ...mapActions('workspace', ['fetchWorkspaceExternalApiKeyOrganizations']),
    fetchApiKeyOrganizations () {
      let filters = {
        page_size: this.pagination.pageSize,
        page: this.pagination.page,
        ordering: this.ordering,
        workspaceId: this.workspaceId,
        id: this.apiKeyId
      }

      this.loading = true
      this.fetchWorkspaceExternalApiKeyOrganizations(filters).then(response => {
        this.$set(this, 'organizations', response.data.data.results)
        this.$set(this.pagination, 'total', response.data.data.count)
      }).finally(() => {
        this.loading = false
      })
    },
    onTablePageLinkClick (pageNumber) {
      this.$set(this.pagination, 'page', pageNumber)
      this.fetchApiKeyOrganizations()
    },
    onTablePageSizeInput (pageSize) {
      this.$set(this.pagination, 'pageSize', pageSize)

      // Reset page number
      this.$set(this.pagination, 'page', 1)

      this.fetchApiKeyOrganizations()
    },
    onSortOrderChange (ordering) {
      this.ordering = ordering

      // Reset page number
      this.$set(this.pagination, 'page', 1)

      this.fetchApiKeyOrganizations()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .workspace-external-api-key-accessible-organization-list {
    position: relative;

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
