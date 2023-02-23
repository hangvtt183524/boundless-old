<template lang="pug">
  .wifi-setup-ssid-list
    v-layout(row wrap)
      v-flex(
        xs6 md4 lg3
        v-for="(ssid, index) of network.ssids"
        :key="ssid.id"
      )
        wifi-setup-ssid-item(
          :value="network.ssids[index]"
          @input="onSsidInput"
          :selected="isSsidSelected(ssid)"
          @click="onSsidItemClick"
        )
</template>

<script>
import WifiSetupSsidItem from './wifi-setup-ssid-item.vue'

export default {
  name: 'wifi-setup-ssid-list',
  components: {
    WifiSetupSsidItem
  },
  props: {
    network: {
      type: Object,
      required: true
    },
    value: {
      type: Array,
      required: true
    }
  },
  methods: {
    isSsidSelected (ssid) {
      return this.value.filter(selection => {
        return selection.id === ssid.id
      }).length > 0
    },
    onSsidItemClick (ssid) {
      let newSelections
      if (this.isSsidSelected(ssid)) {
        // De-select ssid
        newSelections = this.value.filter(selection => {
          return selection.id !== ssid.id
        })
      } else {
        // Select ssid
        newSelections = this.value.concat([ssid])
      }

      this.$emit('input', newSelections)
    },
    onSsidInput (value) {
      this.$emit('ssidUpdate', value, this.network)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../../styles/v2/colors";

  .wifi-setup-ssid-list {
    .wifi-setup-ssid-item {
      margin: 4px 8px;
    }
  }

</style>
