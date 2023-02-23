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
    this.fetchConfigurationComplianceChecks()
  },
  computed: {
    tableHeaders () {
      const tableHeaders = [
        {
          text: this.$t('v2.merakiClients.network'),
          value: 'meraki_network.name',
          width: '200px',
          sortKey: 'meraki_network__name'
        },
        {
          text: this.$t('v2.securityCompliance.nonCompliantFields'),
          value: 'non_compliant_fields',
          width: '400px',
          formatter: this.nonCompliantFieldsFormatter,
          sortable: false
        },
        {
          text: this.$t('v2.securityCompliance.lastUpdated'),
          value: 'updated_at',
          formatter: dateTimeFormatter
        }
      ]

      tableHeaders.splice(0, 0, {
        text: this.$t('general.organization'),
        value: 'organization_name'
      })

      return tableHeaders
    }
  },
  watch: {
    search: {
      handler () {
        // Reset page number
        this.$set(this.pagination, 'page', 1)

        this.fetchConfigurationComplianceChecks()
      }
    }
  },
  methods: {
    ...mapActions('workspace/network', ['fetchMerakiConfigurationComplianceChecks', 'updateMerakiConfigurationComplianceCheck']),
    fetchConfigurationComplianceChecks () {
      let filters = {
        page_size: this.pagination.pageSize,
        page: this.pagination.page,
        search: this.search,
        workspaceId: this.workspaceId,
        rule_set: this.ruleSetId,
        is_dismissed: false
      }

      if (this.ordering) {
        filters.ordering = this.ordering
      }

      this.loading = true
      this.fetchMerakiConfigurationComplianceChecks(filters).then(response => {
        this.$set(this, 'checks', response.data.data.results)

        this.$set(this.pagination, 'total', response.data.data.count)
      }).finally(() => {
        this.loading = false
      })
    },
    onTablePageLinkClick (pageNumber) {
      this.$set(this.pagination, 'page', pageNumber)
      this.fetchConfigurationComplianceChecks()
    },
    onTablePageSizeInput (pageSize) {
      this.$set(this.pagination, 'pageSize', pageSize)

      // Reset page number
      this.$set(this.pagination, 'page', 1)

      this.fetchConfigurationComplianceChecks()
    },
    onSortOrderChange (ordering) {
      this.$set(this, 'ordering', ordering)

      // Reset page number
      this.$set(this.pagination, 'page', 1)

      this.fetchConfigurationComplianceChecks()
    },
    nonCompliantFieldsFormatter (value) {
      return value.map(field => {
        return this.$t(`v2.configurationCompliance.fields.${field.field}`)
      }).join(', ')
    },
    onActionClick (actionType, item) {
      if (actionType === 'details') {
        this.$router.push({ name: 'ConfigurationComplianceCheckDetail', params: { complianceCheckId: item.id } })
      } else if (actionType === 'dismiss') {
        this.dismissComplianceCheck(item)
      }
    },
    dismissComplianceCheck (item) {
      this.loading = true
      this.updateMerakiConfigurationComplianceCheck({
        workspaceId: this.workspaceId,
        complianceCheckId: item.id,
        is_dismissed: true
      }).then(response => {
        global.toastr['success'](this.$t('v2.securityCompliance.complianceCheckDismissSuccess'), this.$t('general.success'))

        // Refresh the list
        this.fetchConfigurationComplianceChecks()
      }).catch(() => {
        global.toastr['error'](this.$t('v2.securityCompliance.complianceCheckDismissFailure'), this.$t('general.error'))
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style src="./compliance-check-list.scss" lang="scss" scoped></style>
