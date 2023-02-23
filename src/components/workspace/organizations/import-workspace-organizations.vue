<template lang="pug">
  .import-workspace-organizations.page-content

    .import-workspace-organizations__header
      h4.import-workspace-organizations__header__page-title
        | {{ $t('v2.workspaces.organizations.importMerakiOrganizations') }}

      search-input.base-text-input--small.import-workspace-organizations__header__search-input(
        :placeholder="$t('v2.workspaces.organizations.searchOrganizations')"
        v-model="search"
      )

      .base-text-input--small.import-workspace-organizations__header__actions
        base-button.base-button--green.import-workspace-organizations__header__actions__action(
          @click="onImportClick"
          :disabled="selectedOrganizations.length === 0"
        )
          | {{ $t('general.import') }}

      .base-text-input--small.import-workspace-organizations__header__options
        base-check-box(
          v-model="importWithStrictSynchronization"
          :label="$t('v2.workspaces.organizations.importWithStrictSynchronization')"
        )

    .import-workspace-organizations__content
      perfect-scrollbar.import-workspace-organizations__content__scroll-holder(
        :options="{ suppressScrollX: true }"
      )
        .import-workspace-organizations__content__view-all-link(
          @click="toggleViewAll"
        )
          | {{ viewAll ? $t('v2.workspaces.organizations.hideManagedOrganizations') : $t('v2.workspaces.organizations.viewAllOrganizations') }}

        .import-workspace-organizations__content__table-container
          base-table.import-workspace-organizations__content__template-table(
            :items="manageableOrganizations"
            :headers="tableHeaders"
            :custom-pagination="pagination"
            :multi-selectable="true"
            :total-selectable="true"
            :selectable-row-filter="selectableRowFilter"
            :is-total-selected="isTotalOrganizationsSelected"
            select-on-row-click
            sortable
            :is-external-sort="true"
            :max-select-count="maxOrganizationCount"
            :page-size-options="[15, 30, 50]"
            @pageLinkClick="onTablePageLinkClick"
            @pageSizeInput="onTablePageSizeInput"
            @sortOrderChange="onSortOrderChange"
            @rowSelectionChange="onRowSelectionChange"
            @totalSelectionChange="onTotalSelectionChange"
          )

    .import-workspace-organizations__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )

    job-tracking-modal(
      :persistent="true"
      display-post-run-messages
      ref="jobTrackingModal"
    )

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import BaseTable from '@/components/v2/base-table/base-table.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import BaseCheckBox from '@/components/v2/base-check-box/base-check-box'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

import SearchInput from '@/components/v2/search-input/search-input'
import JobTrackingModal from '@/components/v2/job-tracking-modal/job-tracking-modal.vue'
import { booleanFormatter } from '@/utils/global-cell-formatters'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'import-workspace-organizations',
  components: {
    SearchInput,
    BaseTable,
    BaseButton,
    BaseCheckBox,
    JobTrackingModal
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  data () {
    return {
      maxOrganizationCount: 5,
      search: '',
      loading: false,
      selectedOrganizations: [],
      importWithStrictSynchronization: false,
      isTotalOrganizationsSelected: false,
      pagination: {
        page: 1,
        pageSize: 30,
        total: 0
      },
      ordering: 'name',
      viewAll: false,
      selectableRowFilter: function (row) {
        // Organization must not be connected to at least one of the products
        return !row.is_imported ||
          (
            row.manager_workspace &&
            row.manager_workspace.id === this.workspaceId &&
            ['network_management'].filter(productKey => row.connected_products.indexOf(productKey) === -1).length > 0
          )
      }.bind(this),
      products: ['network_management']
    }
  },
  mounted () {
    this.fetchManageableOrganizations()
  },
  computed: {
    ...mapGetters('workspace', ['manageableOrganizations']),
    tableHeaders () {
      const headers = [
        {
          text: this.$t('general.name'),
          value: 'name'
        }
      ]

      if (this.viewAll) {
        headers.splice(1, 0, {
          text: this.$t('v2.workspaces.organizations.isImported'),
          value: 'is_imported',
          formatter: booleanFormatter
        })

        headers.splice(2, 0, {
          text: this.$t('v2.workspaces.organizations.managedBy'),
          value: 'manager_workspace',
          formatter: this.managerWorkspaceCellFormatter,
          sortable: false
        })
      }

      return headers
    }
  },
  watch: {
    search: {
      handler: function () {
        // Reset page number
        this.pagination.page = 1

        // Set total selection to false when search / filters change
        this.isTotalOrganizationsSelected = false

        this.fetchManageableOrganizations()
      },
      deep: true
    },
    viewAll: {
      handler: function (newValue) {
        // Reset page number
        this.pagination.page = 1

        this.fetchManageableOrganizations()
      }
    }
  },
  methods: {
    ...mapActions('workspace', ['fetchWorkspaceManageableOrganizations', 'fetchWorkspaceManageableOrganizationsIds']),
    ...mapActions('workspace/organization', ['importWorkspaceMerakiOrganizations']),
    ...mapActions('workspace/network', ['fetchLongRunningJob']),
    ...mapActions('layout', ['fetchUserWorkspaceOrganizations']),
    getFilters () {
      return {
        page_size: this.pagination.pageSize,
        page: this.pagination.page,
        ordering: this.ordering,
        search: this.search,
        workspaceId: this.workspaceId,
        id: this.selectedApiKey
      }
    },
    fetchManageableOrganizations () {
      const filters = this.getFilters()
      if (!this.viewAll) {
        filters.inactive_products = this.products
        filters.is_imported_external = false
      }

      this.loading = true
      this.fetchWorkspaceManageableOrganizations(filters).then(response => {
        this.$set(this.pagination, 'total', response.data.data.count)
      }).finally(() => {
        this.loading = false
      })
    },
    onTablePageLinkClick (pageNumber) {
      this.$set(this.pagination, 'page', pageNumber)
      this.fetchManageableOrganizations()
    },
    onTablePageSizeInput (pageSize) {
      this.$set(this.pagination, 'pageSize', pageSize)

      // Reset page number
      this.$set(this.pagination, 'page', 1)

      this.fetchManageableOrganizations()
    },
    onSortOrderChange (ordering) {
      this.ordering = ordering

      // Reset page number
      this.$set(this.pagination, 'page', 1)

      this.fetchManageableOrganizations()
    },
    onRowSelectionChange (selectedRows) {
      this.selectedOrganizations = selectedRows
    },
    onTotalSelectionChange (isTotalSelected) {
      this.isTotalOrganizationsSelected = isTotalSelected
    },
    onImportJobFinish () {
      // Refresh organization list
      this.fetchManageableOrganizations()

      // Re-fetch Workspace organizations and user root nodes
      this.fetchUserWorkspaceOrganizations({ workspaceId: this.workspaceId })
    },
    onImportClick () {
      this.loading = true
      if (this.isTotalOrganizationsSelected) {
        // Total selected. Get ids first, then import organizations with those ids
        this.fetchWorkspaceManageableOrganizationsIds({
          ...this.getFilters(),
          inactive_products: this.products,
          is_imported_external: false
        }).then(response => {
          this.importOrganizations(response.data.data)
        })
      } else {
        this.importOrganizations(this.selectedOrganizations.map(item => item.id))
      }
    },
    importOrganizations (organizationIds) {
      this.loading = true
      this.importWorkspaceMerakiOrganizations({
        workspaceId: this.workspaceId,
        workspace_api_key_organizations: organizationIds,
        products: this.products,
        strict_synchronization: this.importWithStrictSynchronization
      }).then(response => {
        this.$refs.jobTrackingModal.open(
          response.data.data.id,
          this.$t('organization.connectionProgressTitle'),
          this.$t('organization.connectionProgressDescription')
        ).then(() => {
          this.onImportJobFinish()
        })

        EventTracker.sendEvent(EVENT_NAMES.ORGANIZATION_IMPORTED, {
          count: organizationIds.length,
          strict: this.importWithStrictSynchronization
        })
      }).finally(() => {
        this.loading = false
      })
    },
    toggleViewAll () {
      this.viewAll = !this.viewAll
    },
    managerWorkspaceCellFormatter (value, item) {
      return value.name ? value.name : ''
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .import-workspace-organizations {
    background-color: $white;
    position: relative;

    &__header {
      height: 60px;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
      padding: 0 30px;
      overflow: hidden;

      &__page-title {
        float: left;
        font-family: Fira Sans;
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        line-height: 60px;
      }

      &__api-key-selection {
        float: left;
        width: 280px;

        margin-top: 15px;
        margin-right: 10px;
        padding: 0 20px;
      }

      &__search-input {
        float: left;
        margin-top: 15px;
        margin-left: 20px;
      }

      &__options {
        float: right;

        .base-check-box {
          margin-top: 20px;
        }
      }

      &__actions {
        float: right;
        margin-left: 20px;

        .base-button {
          margin-top: 10px;
          margin-left: 10px;
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

      &__import-errors {
        margin: 10px 30px;

        &__organization {
          margin-bottom: 5px;

          &__name {
            font-weight: bold;
            margin-right: 5px;
          }
        }
      }

      &__view-all-link {
        margin: 10px 0 10px 30px;

        display: inline-block;
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 15px;
        line-height: 20px;
        text-align: left;
        color: $green-medium;
        cursor: pointer;

        text-decoration-line: underline;
      }

      &__table-container {
        padding: 0 30px 30px 30px;
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
