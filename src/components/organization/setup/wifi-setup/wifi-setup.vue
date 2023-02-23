<template lang="pug">
  .wifi-setup
    .wifi-setup__header
      .wifi-setup__header__description-container
        | {{ $t('organization.wifiSetupDescription') }}
      base-button.wifi-setup__header__deploy-button.base-button--blue(
        :disabled="!isSsidSelected"
        @click="onDeployClick"
      ) {{ $t('organization.deployWifi')  }}
    .wifi-setup__content
      .wifi-setup__content__network-select-container
        label.wifi-setup__content__network-select-label
          | {{ $t('organization.networkTemplateSelectLabel') }}
        base-multi-select.wifi-setup__content__network-select(
          v-model="selectedNetworkKeys"
          :items="networkOptions"
        )
      .wifi-setup__content__active-network-select-container(
        v-if="selectedNetworkKeys.length > 0"
      )
        label.wifi-setup__content__active-network-select-label
          | {{ $t('organization.activeNetworkSelectLabel') }}
        base-flat-select.wifi-setup__content__active-network-select(
          v-model="activeNetwork"
          :items="activeNetworkOptions"
        )
        wifi-setup-ssid-list.wifi-setup__content__ssid-list(
          v-if="activeNetworkObject !== null"
          :network="activeNetworkObject"
          v-model="selectedSsids[activeNetwork.toString()]"
          @ssidUpdate="onSsidUpdate"
        )
        base-button.wifi-setup__content__save-button.base-button--green--negative(
          :disabled="!isUpdated"
          @click="onSaveButtonClick"
        ) {{ $t('general.save') }}

    .wifi-setup__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )

    wifi-setup-confirm-modal(
      :show="isConfirmModalVisible"
      @close="onConfirmModalClose"
    )

</template>

<script>
import BaseMultiSelect from '@/components/v2/base-multi-select/base-multi-select.vue'
import BaseFlatSelect from '@/components/v2/base-flat-select/base-flat-select.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import WifiSetupConfirmModal from './wifi-setup-confirm-modal.vue'
import WifiSetupSsidList from './wifi-setup-ssid-list.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'wifi-setup',
  components: {
    BaseMultiSelect,
    BaseFlatSelect,
    BaseButton,
    WifiSetupSsidList,
    WifiSetupConfirmModal
  },
  data: function () {
    return {
      selectedNetworkKeys: [],
      selectedNetworks: [],
      activeNetwork: null,
      selectedSsids: {},
      loading: false,
      isConfirmModalVisible: false
    }
  },
  mounted () {
    this.fetchNetworks()
  },
  computed: {
    ...mapGetters('organization/meraki', ['merakiNetworkBases']),
    networkList () {
      return (this.merakiNetworkBases && this.merakiNetworkBases.data) ? this.merakiNetworkBases.data.results : []
    },
    networkOptions () {
      return [
        {
          name: this.$t('wifi.networks'),
          key: 'networks',
          children: this.networkList.filter(network => {
            return network.type === 'network'
          }).map(network => {
            return {
              key: network.network_id,
              name: network.name
            }
          })
        },
        {
          name: this.$t('wifi.templates'),
          key: 'templates',
          children: this.networkList.filter(network => {
            return network.type === 'template'
          }).map(network => {
            return {
              key: network.network_id,
              name: network.name
            }
          })
        }
      ]
    },
    activeNetworkOptions () {
      return this.networkList.filter(network => {
        return this.selectedNetworkKeys.indexOf(network.network_id) > -1
      }).map(network => {
        return {
          key: network.network_id,
          name: network.name
        }
      })
    },
    activeNetworkObject () {
      if (!this.activeNetwork) {
        return null
      }

      return this.selectedNetworks.filter(network => {
        return network.network_id === parseInt(this.activeNetwork)
      })[0]
    },
    updatedSsids () {
      const updatedSsids = []

      this.selectedNetworks.forEach(network => {
        const currentNetworkItem = this.networkList.filter(item => {
          return item.network_id === network.network_id
        })[0]

        network.ssids.forEach(ssid => {
          const currentSsidItem = currentNetworkItem.ssids.filter(item => {
            return item.id === ssid.id
          })[0]

          if (JSON.stringify(ssid) !== JSON.stringify(currentSsidItem)) {
            updatedSsids.push(ssid)
          }
        })
      })

      return updatedSsids
    },
    selectedSsidIds () {
      let ids = []

      Object.keys(this.selectedSsids).forEach((key, index) => {
        ids = ids.concat(this.selectedSsids[key].map(ssid => {
          return ssid.id
        }))
      })

      return ids
    },
    isUpdated () {
      return this.updatedSsids.length > 0
    },
    isSsidSelected () {
      let selected = false

      Object.keys(this.selectedSsids).forEach((key, index) => {
        if (this.selectedSsids[key].length > 0) {
          selected = true
        }
      })

      return selected
    }
  },
  watch: {
    selectedNetworkKeys: {
      handler: function () {
        // Update selected ssids depending on active network options
        this.updateSelectedSsids()

        // Update selected networks list
        this.updateSelectedNetworks()

        // Un-set active network if removed from list
        if (this.selectedNetworkKeys.indexOf(this.activeNetwork) === -1) {
          this.$set(this, 'activeNetwork', null)
        }
      }
    },
    activeNetwork: {
      handler: function () {
        // If ssids not yet loaded for selected network, load them
        if (this.activeNetworkObject && this.activeNetworkObject.ssids.length === 0) {
          this.loading = true
          this.synchronizeNetworkSSIDs({
            organizationId: this.$route.params.orgId,
            networkId: this.activeNetwork
          }).then(response => {
            const existingNetworkItem = this.selectedNetworks.filter(network => {
              return network.network_id === this.activeNetwork
            })[0]

            if (existingNetworkItem) {
              this.$set(existingNetworkItem, 'ssids', response.data.data)
            }
          }).finally(() => {
            this.loading = false
          })
        }
      }
    }
  },
  methods: {
    ...mapActions('organization/meraki', ['synchronizeNetworkSSIDs']),
    fetchNetworks () {
      const filters = {
        organizationId: this.$route.params.orgId,
        page_size: 0,
        configurable: true
      }

      this.$store.dispatch('organization/meraki/fetchNetworkBases', filters)
    },
    updateSelectedSsids () {
      this.selectedNetworkKeys.filter(networkId => {
        return !this.selectedSsids.hasOwnProperty(networkId.toString())
      }).forEach(networkId => {
        this.$set(this.selectedSsids, networkId.toString(), [])
      })

      Object.keys(this.selectedSsids).forEach((key, index) => {
        if (this.selectedNetworkKeys.filter(networkId => {
          return networkId.toString() === key
        }).length === 0) {
          this.$delete(this.selectedSsids, key)
        }
      })
    },
    updateSelectedNetworks () {
      // Add newly selected networks
      this.selectedNetworkKeys.filter(networkId => {
        return this.selectedNetworks.filter(network => {
          return network.network_id === networkId
        }).length === 0
      }).forEach(networkId => {
        const networkItem = this.networkList.filter(network => {
          return network.network_id === networkId
        })[0]
        this.$set(this, 'selectedNetworks', this.selectedNetworks.concat([JSON.parse(JSON.stringify(networkItem))]))
      })

      // Remove newly unselected networks
      this.$set(this, 'selectedNetworks', this.selectedNetworks.filter(network => {
        return this.selectedNetworkKeys.indexOf(network.network_id) > -1
      }))
    },
    onSsidUpdate (ssid, network) {
      const existingSsidItem = network.ssids.filter(ssidItem => {
        return ssidItem.id === ssid.id
      })[0]

      this.$set(existingSsidItem, 'name', ssid.name)
      this.$set(existingSsidItem, 'enabled', ssid.enabled)
    },
    onSaveButtonClick () {
      this.loading = true
      this.$store.dispatch('organization/meraki/bulkUpdateNetworkSSIDs', {
        organizationId: this.$route.params.orgId,
        payload: this.updatedSsids
      }).then(response => {
        // Re-fetch networks on update
        this.fetchNetworks()
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.loading = false
      })
    },
    onDeployClick () {
      this.isConfirmModalVisible = true
    },
    onConfirmModalClose (confirm) {
      this.isConfirmModalVisible = false

      if (confirm) {
        // If there are unsaved ssids, save them first, then deploy
        this.loading = true
        if (this.isUpdated) {
          this.$store.dispatch('organization/meraki/bulkUpdateNetworkSSIDs', {
            organizationId: this.$route.params.orgId,
            payload: this.updatedSsids
          }).then(response => {
            // Now configure SSIDs
            this.configureSsids()
          }).catch(err => {
            console.log(err)
            this.loading = false
          })
        } else {
          // No updated ssids, directly configure SSIDs
          this.configureSsids()
        }
      }
    },
    configureSsids () {
      this.$store.dispatch('organization/meraki/configureWifiForSSIDs', {
        organizationId: this.$route.params.orgId,
        ssids: this.selectedSsidIds,
        login_methods: ['facebook', 'instagram', 'twitter', 'linkedin'] // Hard-coded for now, later will enable selection
      }).then(response => {
        this.$emit('configurationSuccess')
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style src="./wifi-setup.scss" lang="scss" scoped></style>
