<template lang="pug">
  .switch-port-list
    base-table(
      :items="merakiMonitoringSwitchPorts"
      :headers="tableHeaders"
      :custom-pagination="pagination"
      :is-external-sort="true"
      @sortOrderChange="onSortOrderChange"
      @pageLinkClick="onTablePageLinkClick"
      @pageSizeInput="onTablePageSizeInput"
    )

    .switch-port-list__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import BaseTable from '@/components/v2/base-table/base-table'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

export default {
  name: 'switch-port-list',
  components: {
    BaseTable
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  props: {
    merakiDeviceId: {
      type: Number,
      required: false
    }
  },
  data () {
    return {
      loading: false,
      ordering: '-info__power_usage',
      pagination: {
        page: 1,
        pageSize: 5,
        total: 0
      },
      tableHeaders: [
        {
          text: this.$t('v2.merakiTemplates.portId'),
          value: 'number'
        },
        {
          text: this.$t('v2.merakiSwitchPorts.portVlan'),
          value: 'info.lldp.portVlan',
          sortable: false
        },
        {
          text: this.$t('general.name'),
          value: 'name'
        },
        {
          text: this.$t('general.status'),
          value: 'info.status',
          sortKey: 'info__status'
        },
        {
          text: this.$t('v2.merakiSwitchPorts.powerUsage'),
          value: 'info.power_usage',
          sortKey: 'info__power_usage',
          formatter: (value) => {
            return `${Math.round(value * 10) / 10} Wh`
          }
        },
        {
          text: this.$t('v2.merakiSwitchPorts.systemName'),
          value: 'info.lldp.systemName',
          sortable: false
        }
      ]
    }
  },
  mounted () {
    this.fetchSwitchPorts()
  },
  computed: {
    ...mapGetters('workspace/network', ['merakiMonitoringSwitchPorts'])
  },
  methods: {
    ...mapActions('workspace/network', ['fetchMerakiMonitoringSwitchPorts']),
    getBaseFilters () {
      return {
        workspaceId: this.workspaceId
      }
    },
    fetchSwitchPorts () {
      let filters = this.getBaseFilters()

      filters.page_size = this.pagination.pageSize
      filters.page = this.pagination.page

      if (this.merakiDeviceId) {
        filters.meraki_device = this.merakiDeviceId
      }

      if (this.ordering) {
        filters.ordering = this.ordering
      }

      this.loading = true
      this.fetchMerakiMonitoringSwitchPorts(filters).then(response => {
        this.pagination.total = response.data.data.count
      }).finally(() => {
        this.loading = false
      })
    },
    onTablePageLinkClick (pageNumber) {
      this.pagination.page = pageNumber
      this.fetchSwitchPorts()
    },
    onTablePageSizeInput (pageSize) {
      this.pagination.pageSize = pageSize

      // Reset page number
      this.pagination.page = 1

      this.fetchSwitchPorts()
    },
    onSortOrderChange (ordering) {
      this.ordering = ordering

      // Reset page number
      this.pagination.page = 1

      this.fetchSwitchPorts()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.switch-port-list {
  background-color: $white;
  position: relative;
  min-height: 100px;

  &__title {
    line-height: 40px;
    font-family: Fira Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    color: $text-dark;
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
