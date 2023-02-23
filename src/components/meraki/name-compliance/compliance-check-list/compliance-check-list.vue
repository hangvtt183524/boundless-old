<template lang="pug">
  .compliance-check-list
    base-table(
      :items="checks"
      :headers="tableHeaders"
      :actions="tableActions"
      :custom-pagination="pagination"
      :is-external-sort="true"
      @sortOrderChange="onSortOrderChange"
      @pageLinkClick="onTablePageLinkClick"
      @pageSizeInput="onTablePageSizeInput"
      @actionClick="onActionClick"
      @itemAction="onTableItemAction"
    )

    .compliance-check-list__loading-indicator(
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
import { mapActions } from 'vuex'
import { dateTimeFormatter } from '@/utils/global-cell-formatters'
import CheckNameCell from '../column-components/check-name-cell'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

export default {
  name: 'compliance-check-list',
  components: {
    BaseTable
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  props: {
    ruleSetId: {
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
        pageSize: 5,
        total: 0
      },
      checks: [],
      tableActions: [
        {
          icon: 'visibility',
          type: 'details'
        },
        {
          icon: '$vuetify.icons.delete',
          type: 'dismiss',
          displayCondition: (item) => {
            return !item.is_dismissed
          }
        }
      ]
    }
  },
  mounted () {
    this.fetchNameComplianceChecks()
  },
  watch: {
    search: {
      handler () {
        // Reset page number
        this.$set(this.pagination, 'page', 1)

        this.fetchNameComplianceChecks()
      }
    }
  },
  computed: {
    tableHeaders () {
      const tableHeaders = [
        {
          text: this.$t('wifi.type'),
          value: 'entity_type',
          formatter: this.entityTypeFormatter
        },
        {
          text: this.$t('v2.nameCompliance.parent'),
          value: 'parent_name',
          width: '200px',
          sortable: false
        },
        {
          text: this.$t('general.name'),
          value: 'name',
          width: '200px',
          cellComponent: CheckNameCell,
          componentProps: {
            workspaceId: this.workspaceId
          }
        },
        {
          text: this.$t('v2.securityCompliance.lastUpdated'),
          value: 'updated_at',
          formatter: dateTimeFormatter
        }
      ]

      tableHeaders.splice(0, 0, {
        text: this.$t('general.organization'),
        value: 'organization_name',
        sortKey: 'meraki_organization__name'
      })

      return tableHeaders
    }
  },
  methods: {
    ...mapActions('workspace/network', ['fetchMerakiNameComplianceChecks', 'updateMerakiNameComplianceCheck']),
    fetchNameComplianceChecks () {
      let filters = {
        page_size: this.pagination.pageSize,
        page: this.pagination.page,
        search: this.search,
        workspaceId: this.workspaceId,
        rule_set: this.ruleSetId,
        is_dismissed: false,
        ordering: 'meraki_organization__name,entity_type'
      }

      if (this.ordering) {
        filters.ordering = `${this.ordering},entity_type`
      }

      this.loading = true
      this.fetchMerakiNameComplianceChecks(filters).then(response => {
        this.$set(this, 'checks', response.data.data.results)
        this.$set(this.pagination, 'total', response.data.data.count)
      }).finally(() => {
        this.loading = false
      })
    },
    onTablePageLinkClick (pageNumber) {
      this.$set(this.pagination, 'page', pageNumber)
      this.fetchNameComplianceChecks()
    },
    onTablePageSizeInput (pageSize) {
      this.$set(this.pagination, 'pageSize', pageSize)

      // Reset page number
      this.$set(this.pagination, 'page', 1)

      this.fetchNameComplianceChecks()
    },
    onSortOrderChange (ordering) {
      this.$set(this, 'ordering', ordering)

      // Reset page number
      this.$set(this.pagination, 'page', 1)

      this.fetchNameComplianceChecks()
    },
    onActionClick (actionType, item) {
      if (actionType === 'details') {
        this.$router.push({ name: 'NameComplianceCheckDetail', params: { complianceCheckId: item.id } })
      } else if (actionType === 'dismiss') {
        this.dismissComplianceCheck(item)
      }
    },
    onTableItemAction (item, field, value) {
      if (field === 'name' && value.success) {
        // Name updated for a check entry, re-fetch items
        this.fetchNameComplianceChecks()
      }
    },
    dismissComplianceCheck (item) {
      this.loading = true
      this.updateMerakiNameComplianceCheck({
        workspaceId: this.workspaceId,
        complianceCheckId: item.id,
        is_dismissed: true
      }).then(response => {
        global.toastr['success'](this.$t('v2.securityCompliance.complianceCheckDismissSuccess'), this.$t('general.success'))

        // Refresh the list
        this.fetchNameComplianceChecks()
      }).catch(() => {
        global.toastr['error'](this.$t('v2.securityCompliance.complianceCheckDismissFailure'), this.$t('general.error'))
      }).finally(() => {
        this.loading = false
      })
    },
    entityTypeFormatter (value) {
      return this.$t('v2.nameCompliance.entityTypes.' + value)
    }
  }
}
</script>

<style src="./compliance-check-list.scss" lang="scss" scoped></style>
