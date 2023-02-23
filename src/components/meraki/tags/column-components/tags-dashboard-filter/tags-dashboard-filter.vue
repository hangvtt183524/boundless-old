<template lang='pug'>
  .filters-container
    .network-filter(@click="onClickNetworkFilter")
      base-check-box.base-check-box--small.ml-4(v-model='networkFilter', @input='onChangeFilter')
      span.ml-2 {{ $t('tags.filterNetworks') }}
    base-filter.device-filter(v-model='deviceFilter', @input='onChangeFilter')
    .switch-ports-filter(@click="onClickSwitchPortsFilter")
      base-check-box.base-check-box--small.ml-4(v-model='switchPortsFilter', @input='onChangeFilter')
      span.ml-2 {{ $t('tags.filterSwitchPorts') }}
</template>

<script>

import BaseFilter from '../../../../v2/base-filter/base-filter'
import BaseCheckBox from '../../../../v2/base-check-box/base-check-box'

export default {
  props: {
    objectTypes: {
      type: Array
    }
  },
  components: {
    BaseFilter,
    BaseCheckBox
  },
  data () {
    const deviceFilter = {
      id: 1,
      name: this.$t('tags.filterDevices'),
      ssids: [
        {
          id: 1,
          name: 'MS - Switches',
          value: 'switch'
        },
        {
          id: 2,
          name: 'MR - Routers',
          value: 'access_point'
        },
        {
          id: 3,
          name: 'MX - Security',
          value: 'security_appliance'
        },
        {
          id: 4,
          name: 'MV - Cameras',
          value: 'camera'
        }
      ]
    }
    return {
      deviceId: -1,
      networkFilter: false,
      deviceFilter,
      switchPortsFilter: false
    }
  },
  watch: {
    objectTypes (newVal) {
      if (newVal.indexOf('network') !== -1) {
        this.networkFilter = true
      }
      if (newVal.indexOf('switch_port') !== -1) {
        this.switchPortsFilter = true
      }

      this.deviceFilter.ssids.forEach(ssid => {
        ssid.selected = (newVal.indexOf(ssid.value) !== -1)
        if (ssid.selected) {
          this.deviceFilter.selected = true
        }
      })
    }
  },
  computed: {

  },
  methods: {
    onClickNetworkFilter () {
      this.networkFilter = !this.networkFilter
      this.onChangeFilter()
    },
    onClickSwitchPortsFilter () {
      this.switchPortsFilter = !this.switchPortsFilter
      this.onChangeFilter()
    },
    onChangeFilter () {
      const filterList = []
      if (this.networkFilter) {
        filterList.push('network')
      }
      if (this.switchPortsFilter) {
        filterList.push('switch_port')
      }
      if (this.deviceFilter.selected) {
        this.deviceFilter.ssids.forEach(ssid => {
          if (ssid.selected) {
            filterList.push(ssid.value)
          }
        })
      }
      this.$emit('change', filterList)
    }
  }
}
</script>

<style src="./tags-dashboard-filter.scss" lang="scss" scoped></style>
