<template lang="pug">
  .switch-port-network-list
    perfect-scrollbar.switch-port-network-list__scroll-holder
      base-table(
        :items="merakiMonitoringSwitchPortsNetworks"
        :headers="tableHeaders"
        :is-external-sort="true"
        :is-expandable="true"
        :expand-on-row-click="true"
        @loadMore="onScrollEnd"
        @sortOrderChange="onSortOrderChange"
      )
        template(
          v-slot:row-expand-area='props'
        )
          .switch-port-network-list__devices
            switch-port-device-list(
              :meraki-network-id="props.props.item.id"
            )

    .switch-port-network-list__loading-indicator(
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
import SwitchPortDeviceList from './device-list'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

export default {
  name: 'switch-port-network-list',
  components: {
    SwitchPortDeviceList,
    BaseTable
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  props: {
    merakiNetworkId: {
      type: Number,
      required: false
    },
    search: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      loading: false,
      ordering: '-power_usage',
      page: 1,
      pageSize: 50,
      tableHeaders: [
        {
          text: this.$t('v2.merakiClients.networkName'),
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
          text: this.$t('v2.merakiSwitchPorts.deviceCount'),
          value: 'device_count'
        }
      ]
    }
  },
  mounted () {
    this.fetchSwitchPortsNetworks()
  },
  computed: {
    ...mapGetters('workspace/network', ['merakiMonitoringSwitchPortsNetworks',
      'merakiMonitoringSwitchPortsNetworksCount']),
    pageCount () {
      return Math.ceil(this.merakiMonitoringSwitchPortsNetworksCount / this.pageSize)
    }
  },
  watch: {
    search: {
      handler: function () {
        // Reset page number
        this.page = 1

        // Re-fetch networks after search change
        this.fetchSwitchPortsNetworks()
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('workspace/network', ['fetchMerakiMonitoringSwitchPortsNetworks']),
    getBaseFilters () {
      return {
        workspaceId: this.workspaceId
      }
    },
    fetchSwitchPortsNetworks () {
      let filters = this.getBaseFilters()

      filters.page_size = this.pageSize
      filters.page = this.page

      if (this.merakiNetworkId) {
        filters.meraki_network = this.merakiNetworkId
      }

      if (this.ordering) {
        filters.ordering = this.ordering
      }

      if (this.search) {
        filters.search = this.search
      }

      this.loading = true
      this.fetchMerakiMonitoringSwitchPortsNetworks(filters).finally(() => {
        this.loading = false
      })
    },
    onScrollEnd () {
      if (this.page < this.pageCount && !this.loading) {
        this.page = this.page + 1
        this.fetchSwitchPortsNetworks()
      }
    },
    onSortOrderChange (ordering) {
      this.ordering = ordering

      // Reset page number
      this.page = 1

      this.fetchSwitchPortsNetworks()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.switch-port-network-list {
  background-color: $white;
  position: relative;
  height: 100%;

  &__scroll-holder {
    height: 100%;
  }

  &__devices {
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
