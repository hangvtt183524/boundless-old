<template lang="pug">
  .switch-port-device-list
    base-table(
      :items="merakiMonitoringSwitchPortsDevices"
      :headers="tableHeaders"
      :custom-pagination="pagination"
      :is-external-sort="true"
      :is-expandable="true"
      :expand-on-row-click="true"
      @sortOrderChange="onSortOrderChange"
      @pageLinkClick="onTablePageLinkClick"
      @pageSizeInput="onTablePageSizeInput"
    )
      template(
        v-slot:row-expand-area='props'
      )
        .switch-port-device-list__switch-ports
          switch-port-list(
            :meraki-device-id="props.props.item.id"
          )

    .switch-port-device-list__loading-indicator(
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
import SwitchPortList from './switch-port-list'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

export default {
  name: 'switch-port-device-list',
  components: {
    SwitchPortList,
    BaseTable
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  props: {
    merakiNetworkId: {
      type: Number,
      required: false
    }
  },
  data () {
    return {
      loading: false,
      ordering: '-power_usage',
      pagination: {
        page: 1,
        pageSize: 5,
        total: 0
      },
      tableHeaders: [
        {
          text: this.$t('v2.merakiClients.deviceName'),
          value: 'name'
        },
        {
          text: this.$t('v2.merakiSwitchPorts.powerUsage'),
          value: 'power_usage',
          sortKey: 'power_usage',
          formatter: (value) => {
            return `${Math.round(value * 10) / 10} Wh`
          }
        },
        {
          text: this.$t('v2.merakiSwitchPorts.switchPortCount'),
          value: 'switch_port_count'
        }
      ]
    }
  },
  mounted () {
    this.fetchSwitchPortsDevices()
  },
  computed: {
    ...mapGetters('workspace/network', ['merakiMonitoringSwitchPortsDevices'])
  },
  methods: {
    ...mapActions('workspace/network', ['fetchMerakiMonitoringSwitchPortsDevices']),
    getBaseFilters () {
      return {
        workspaceId: this.workspaceId
      }
    },
    fetchSwitchPortsDevices () {
      let filters = this.getBaseFilters()

      filters.page_size = this.pagination.pageSize
      filters.page = this.pagination.page

      if (this.merakiNetworkId) {
        filters.meraki_network = this.merakiNetworkId
      }

      if (this.ordering) {
        filters.ordering = this.ordering
      }

      this.loading = true
      this.fetchMerakiMonitoringSwitchPortsDevices(filters).then(response => {
        this.pagination.total = response.data.data.count
      }).finally(() => {
        this.loading = false
      })
    },
    onTablePageLinkClick (pageNumber) {
      this.pagination.page = pageNumber
      this.fetchSwitchPortsDevices()
    },
    onTablePageSizeInput (pageSize) {
      this.pagination.pageSize = pageSize

      // Reset page number
      this.pagination.page = 1

      this.fetchSwitchPortsDevices()
    },
    onSortOrderChange (ordering) {
      this.ordering = ordering

      // Reset page number
      this.pagination.page = 1

      this.fetchSwitchPortsDevices()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.switch-port-device-list {
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

  &__switch-ports {
    padding: 20px;
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
