<template lang="pug">
  .wifi-registration(
    v-show="selectedNode && !!selectedNode.id"
    data-test="wifi-registration"
  )
    v-layout.mb-3
      v-flex(
        v-if="!!getNodeParentId(selectedNode)"
        pa-2 pb-4 xs6 md6
      )
        v-layout.header-section(row wrap)
          base-switch(
            v-model="wifiConfig.is_active"
            :yes-label="$t('wifi.overwriteConfig')"
            :no-label="$t('wifi.inheritWifiConfigFrom').replace('{parent_name}', configInheritParent ? configInheritParent.name : $t('wifi.parent'))"
          )

      v-flex.pb-3(xs6, md6, lg6, text-xs-right)
        v-btn.primary-action(
          data-test="btn-save"
          color='primary'
          @click.stop='submitWifiConfig'
          :disabled="!isChanged"
          :loading="loading"
        )
          | {{ $t('general.save') }}
          v-icon save

    v-layout(
      v-show="wifiConfig.is_active || getNodeParentId(selectedNode) === null"
      row wrap
    )
      v-flex(pa-2 pb-4 xs12 md6)
        connection-time(
          data-test="connection-time"
          :session-timeout="wifiConfig.session_timeout"
          :session-timeout-enabled="wifiConfig.session_timeout_enabled"
          @change="changeWifiConfig"
        )

      v-flex(pa-2 pb-4 xs12 md6)
        connection-frequency(
          data-test="connection-frequency"
          :frequency-limit-active="wifiConfig.frequency_limit_active"
          :frequency-limit-duration="wifiConfig.frequency_limit_duration"
          :frequency-limit="wifiConfig.frequency_limit"
          @change="changeWifiConfig"
          v-if="!(getAppFeatures==='production')"
        )

      v-flex(pa-2 pb-4 xs12 :class="wifiConfig.schedule_active ? 'md12' : 'md6'")
        wifi-programming(
          data-test="wifi-programming"
          :schedule-active="wifiConfig.schedule_active"
          :schedule="wifiConfig.schedule"
          @change="changeWifiConfig"
        )

    v-layout(
      v-show="wifiConfig.is_active || getNodeParentId(selectedNode) === null"
      row wrap
    )
      v-flex(pa-2 pb-4 xs12 xl6 v-if="!(getAppFeatures==='production')")
        data-limitation(
          data-test="data-limitation"
          :data-limited="wifiConfig.data_limited"
          :upload-data-limit="wifiConfig.upload_data_limit"
          :download-data-limit="wifiConfig.download_data_limit"
          @change="changeWifiConfig"
        )

      v-flex(pa-2 pb-4 xs12 xl6)
        bandwidth-limitation(
          data-test="bandwidth-limitation"
          :bandwidth-limited="wifiConfig.bandwidth_limited"
          :upload-bandwidth-limit="wifiConfig.upload_bandwidth_limit"
          :download-bandwidth-limit="wifiConfig.download_bandwidth_limit"
          @change="changeWifiConfig"
        )

</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import BaseSwitch from '@/components/v2/base-switch/base-switch'
import BandwidthLimitation from './configuration/guest/bandwidth-limitation'
import ConnectionFrequency from './configuration/guest/connection-frequency'
import ConnectionTime from './configuration/guest/connection-time'
import DataLimitation from './configuration/guest/data-limitation'
import WifiProgramming from './configuration/guest/wifi-programming'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  components: {
    BaseSwitch,
    BandwidthLimitation,
    ConnectionFrequency,
    ConnectionTime,
    DataLimitation,
    WifiProgramming
  },

  data () {
    return {
      wifiConfig: {
        is_active: false
      },
      preWifiConfig: {
        is_active: false
      },
      nodeFilters: {
        layout: 'flat',
        types: 'organization,group,site,floor'
      },
      loading: false
    }
  },

  mounted () {
    if (this.selectedNode.id) {
      this.getWifiConfig()
    }
  },

  computed: {
    ...mapGetters('layout', ['selectedOrganization', 'selectedNode', 'userOrganizationNodes', 'userWorkspaces']),
    isChanged () {
      if (global._.isEqual(this.preWifiConfig, this.wifiConfig)) {
        return false
      }
      return true
    },
    getAppFeatures: function () {
      return process.env.VUE_APP_FEATURES
    },
    configInheritParent () {
      if (!this.getNodeParentId(this.selectedNode)) {
        return null
      }

      let parent = this.getNodeById(this.getNodeParentId(this.selectedNode))
      while (parent && !(parent.wifi_config && parent.wifi_config.is_active) && !!this.getNodeParentId(parent)) {
        parent = this.getNodeById(this.getNodeParentId(parent))
      }

      if (parent && parent.wifi_config && parent.wifi_config.is_active) {
        return parent
      }

      return null
    }
  },

  methods: {
    ...mapActions('organization/node', ['updateNode']),
    changeWifiConfig (value) {
      this.wifiConfig = { ...this.wifiConfig, ...value }
    },
    getWifiConfig () {
      this.wifiConfig = this.selectedNode.wifi_config || {
        is_active: false
      }
      this.preWifiConfig = this.selectedNode.wifi_config || {
        is_active: false
      }
    },
    getNodeParentId (node) {
      // TODO: After node is updated, we lose parent_id field and get parent field. Why?
      if (node.hasOwnProperty('parent')) {
        return node.parent
      } else if (node.hasOwnProperty('parent_id')) {
        return node.parent_id
      }

      return null
    },
    getNodeById (nodeId) {
      // Find node either from list of selected organization nodes, or from list of workspaces
      return this.userOrganizationNodes.find(node => node.id === nodeId) ||
        this.userWorkspaces.find(node => node.id === nodeId)
    },
    submitWifiConfig () {
      this.loading = true
      this.updateNode({ nodeId: this.selectedNode.id, wifi_config: this.wifiConfig }).then(response => {
        this.wifiConfig = { ...response.data.data.wifi_config }
        this.preWifiConfig = { ...response.data.data.wifi_config }
        global.toastr['success'](this.$t('wifi.savedSuccessfully'), this.$t('general.success'))
        this.loading = false
      })

      EventTracker.sendEvent(EVENT_NAMES.GUEST_WIFI_SETTINGS_CUSTOMIZED, {
        session_timeout: this.wifiConfig.session_timeout_enabled === true,
        wifi_schedule: this.wifiConfig.schedule_active === true,
        bandwidth_limit: this.wifiConfig.bandwidth_limited === true
      })
    }
  },
  watch: {
    selectedNode: {
      handler: function (newValue, oldValue) {
        if (!oldValue || !oldValue.id || !oldValue.hasOwnProperty('wifi_config') || (newValue.id !== oldValue.id)) {
          this.getWifiConfig()
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
@import "styles/colors.scss";
.wifi-registration {

  .header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .slider-display {
    display: flex;
    align-items: baseline;
    .slider-title {
      min-width: 100px;
      float: left;
    }
  }
}
</style>
