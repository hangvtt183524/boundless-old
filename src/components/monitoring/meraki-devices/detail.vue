<template lang="pug">
  .meraki-device-detail.page-content
    .meraki-device-detail__header
      .meraki-device-detail__header__back-link-container
        v-icon.meraki-device-detail__header__back-link-container__back-icon(
        @click="onBackClick"
        ) keyboard_backspace
      h4.meraki-device-detail__header__page-title
        | {{ originalDevice.name }}
      .meraki-device-detail__header__actions
        base-button.base-button--green.meraki-device-detail__header__actions__action(
          @click="onSaveClick"
          :disabled="!isValueChanged || !isValid"
        )
          | {{ $t('general.saveChanges') }}
        base-button.base-button--green--negative.meraki-device-detail__header__actions__action(
          v-if="!!device.network"
          @click="onRebootClick"
        )
          | {{ $t('v2.merakiDevices.reboot') }}
        base-button.base-button--danger.meraki-device-detail__header__actions__action(
          v-if="!!device.network"
          @click="onRemoveFromNetworkClick"
        )
          | {{ $t('v2.merakiDevices.removeFromNetwork') }}

    .meraki-device-detail__content

      .meraki-device-detail__content__tab-headers
        base-tab-header(
          :class="['tab-header--underlined', 'tab-header--blue', {'tab-header--active': selectedTab === tabs.general}]"
          @click="onTabHeaderClick(tabs.general)"
        ) {{ $t('v2.merakiDevices.generalData') }}
        base-tab-header(
          :class="['tab-header--underlined', 'tab-header--blue', {'tab-header--active': selectedTab === tabs.uplinks}]"
          @click="onTabHeaderClick(tabs.uplinks)"
        ) {{ $t('v2.merakiDevices.uplinks') }}
        base-tab-header(
          :class="['tab-header--underlined', 'tab-header--blue', {'tab-header--active': selectedTab === tabs.health}]"
          @click="onTabHeaderClick(tabs.health)"
        ) {{ $t('v2.merakiDevices.health') }}

      .meraki-device-detail__content__tab(
        v-show="selectedTab === tabs.general"
      )
        v-container(grid-list-xl)
          v-layout(row wrap)
            v-flex.meraki-device-detail__content__tab__section(xs12 md6 lg4 xl3)

              v-layout.meraki-device-detail__content__tab__row
                v-flex(xs6 lg5 xl4)
                  label {{ $t('general.name') }}
                v-flex(xs6 lg7 xl8)
                  base-text-input(
                    v-model="device.name"
                    :validations="{required: true}"
                  )

              v-layout.meraki-device-detail__content__tab__row
                v-flex(xs6 lg5 xl4)
                  label {{ $t('general.address') }}
                v-flex(xs6 lg7 xl8)
                  base-text-area(
                    v-model="device.address"
                  )

              v-layout.meraki-device-detail__content__tab__row
                v-flex(xs6 lg5 xl4)
                  label {{ $t('v2.merakiDevices.notes') }}
                v-flex(xs6 lg7 xl8)
                  base-text-area(
                    v-model="device.notes"
                  )

              v-layout.meraki-device-detail__content__tab__row
                v-flex(xs6 lg5 xl4)
                  label {{ $t('tags.tableHeaderTags') }}
                v-flex(xs6 lg7 xl8)
                  multi-text-input(
                    :value="deviceTagsFlatList"
                    @input="onTagsInput"
                    :placeholder="$t('v2.placeholders.separateByCommas')"
                  )

            v-flex.meraki-device-detail__content__tab__section(xs12 md6 lg4 xl3)

              v-layout.meraki-device-detail__content__tab__row
                v-flex(xs6 lg5 xl4)
                  label {{ $t('wifi.type') }}
                v-flex(xs6 lg7 xl8)
                  span.meraki-device-detail__content__tab__row__static-value
                    | {{ $t(`v2.merakiDevices.devicesTypes.${device.type}`) }}

              v-layout.meraki-device-detail__content__tab__row
                v-flex(xs6 lg5 xl4)
                  label {{ $t('v2.merakiClients.network') }}
                v-flex(xs6 lg7 xl8)
                  div(
                    v-show="!isEditingNetwork"
                  )
                    span.meraki-device-detail__content__tab__row__static-value
                      | {{ device.network ? device.network.name : '' }}

                  div(
                    v-show="isEditingNetwork"
                  )
                    base-select(
                      :items="networkOptions"
                      v-model="selectedParentNetwork"
                    )
                    base-button.base-button--green(
                      @click="onUpdateNetworkClick"
                      :disabled="!isParentNetworkChanged"
                    ) {{ $t('general.save') }}
                    base-button.base-button--green--negative(
                      @click="onNetworkUpdateTriggerClick"
                    ) {{ $t('general.cancel') }}

              v-layout.meraki-device-detail__content__tab__row
                v-flex(xs6 lg5 xl4)
                  label {{ $t('v2.merakiDevices.serialNumber') }}
                v-flex(xs6 lg7 xl8)
                  span.meraki-device-detail__content__tab__row__static-value
                    | {{ device.serial_number }}

              v-layout.meraki-device-detail__content__tab__row
                v-flex(xs6 lg5 xl4)
                  label {{ $t('general.macAddress') }}
                v-flex(xs6 lg7 xl8)
                  span.meraki-device-detail__content__tab__row__static-value
                    | {{ device.mac_address }}

              v-layout.meraki-device-detail__content__tab__row
                v-flex(xs6 lg5 xl4)
                  label {{ $t('general.model') }}
                v-flex(xs6 lg7 xl8)
                  span.meraki-device-detail__content__tab__row__static-value
                    | {{ device.model }}

      .meraki-device-detail__content__tab(
        v-show="selectedTab === tabs.uplinks"
      )
        v-container(grid-list-xl)
          v-layout(row wrap)
            v-flex.meraki-device-detail__content__tab__section(
              xs12 md6 lg4 xl3
              v-for="uplink of device.uplinks"
              :key="uplink.interface"
            )
              .meraki-device-detail__content__tab__section__title
                | {{ uplink.interface }}

              v-layout.meraki-device-detail__content__tab__row
                v-flex(xs6 lg5 xl4)
                  label {{ $t('general.status') }}
                v-flex(xs6 lg7 xl8)
                  span.meraki-device-detail__content__tab__row__static-value
                    | {{ uplink.status }}

              v-layout.meraki-device-detail__content__tab__row
                v-flex(xs6 lg5 xl4)
                  label {{ $t('v2.merakiDevices.privateIP') }}
                v-flex(xs6 lg7 xl8)
                  span.meraki-device-detail__content__tab__row__static-value
                    | {{ uplink.private_ip }}

              v-layout.meraki-device-detail__content__tab__row
                v-flex(xs6 lg5 xl4)
                  label {{ $t('v2.merakiDevices.publicIP') }}
                v-flex(xs6 lg7 xl8)
                  span.meraki-device-detail__content__tab__row__static-value
                    | {{ uplink.public_ip }}

              v-layout.meraki-device-detail__content__tab__row
                v-flex(xs6 lg5 xl4)
                  label {{ $t('v2.merakiDevices.gateway') }}
                v-flex(xs6 lg7 xl8)
                  span.meraki-device-detail__content__tab__row__static-value
                    | {{ uplink.gateway }}

              v-layout.meraki-device-detail__content__tab__row
                v-flex(xs6 lg5 xl4)
                  label {{ $t('v2.merakiDevices.dns') }}
                v-flex(xs6 lg7 xl8)
                  div.meraki-device-detail__content__tab__row__static-value
                    div(
                      v-for="dns of uplink.dns"
                      :key="dns"
                    ) {{ dns }}

              v-layout.meraki-device-detail__content__tab__row
                v-flex(xs6 lg5 xl4)
                  label {{ $t('v2.merakiDevices.usingStaticIP') }}
                v-flex(xs6 lg7 xl8)
                  span.meraki-device-detail__content__tab__row__static-value
                    | {{ uplink.is_using_static_ip ? $t('general.yes') : $t('general.no') }}

      .meraki-device-detail__content__tab(
        v-show="selectedTab === tabs.health"
      )
        v-container(grid-list-xl)
          v-layout(row wrap)
            v-flex.meraki-device-detail__content__tab__section(xs12 lg6)
              .meraki-device-detail__content__tab__section__title
                | {{ $t('v2.merakiDevices.connectionHistory') }}

              ul
                li(
                  v-for="history of merakiDeviceConnectionHistory"
                  :key="history.id"
                )
                  pre {{ history }}

            v-flex.meraki-device-detail__content__tab__section(xs12 lg6)
              .meraki-device-detail__content__tab__section__title
                | {{ $t('v2.merakiDevices.latencyHistory') }}

              ul
                li(
                  v-for="history of merakiDeviceLatencyHistory"
                  :key="history.id"
                )
                  pre {{ history }}

      .meraki-device-detail__loading-indicator(
        v-if="loading"
      )
        v-progress-circular(
          :size="50"
          indeterminate
          color="#15ac2f"
        )

      confirm-modal(
        ref="confirmModal"
      )

</template>

<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import BaseTabHeader from '@/components/v2/base-tab-header/base-tab-header'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import BaseTextArea from '@/components/v2/base-text-area/base-text-area'
import MultiTextInput from '@/components/v2/multi-text-input/multi-text-input'
import BaseSelect from '@/components/v2/base-select/base-select'
import BaseButton from '@/components/v2/base-button/base-button'
import ConfirmModal from '@/components/v2/confirm-modal/confirm-modal'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'meraki-device-detail',
  components: {
    MultiTextInput,
    BaseTextArea,
    BaseTextInput,
    BaseTabHeader,
    BaseSelect,
    BaseButton,
    ConfirmModal
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  props: {
    deviceId: {
      required: true
    }
  },
  data: function () {
    return {
      loading: false,
      device: {},
      originalDevice: {},
      selectedParentNetwork: null,
      tabs: {
        general: 'general',
        uplinks: 'uplinks',
        health: 'health'
      },
      selectedTab: 'general',
      isEditingNetwork: false,
      isNetworksFetched: false,
      isHistoryFetched: false
    }
  },
  mounted () {
    this.fetchDevice()
  },
  computed: {
    ...mapGetters('organization/meraki', ['merakiNetworks']),
    ...mapGetters('workspace/network', ['merakiDeviceConnectionHistory', 'merakiDeviceLatencyHistory']),
    deviceTagsFlatList () {
      return (this.device.tags ? this.device.tags : []).map(tagItem => {
        return tagItem.name
      })
    },
    isValid () {
      return !!this.device.name
    },
    isValueChanged () {
      return !_.isEqual(this.device, this.originalDevice)
    },
    isParentNetworkChanged () {
      if (this.originalDevice && this.originalDevice.network) {
        return (this.originalDevice.network.id !== this.selectedParentNetwork)
      } else {
        return !!this.selectedParentNetwork
      }
    },
    networkOptions () {
      const networks = (this.merakiNetworks && this.merakiNetworks.data) ? this.merakiNetworks.data.results : []
      return networks.map(networkItem => {
        return {
          name: networkItem.name,
          key: networkItem.id
        }
      })
    },
    filters () {
      return {
        workspaceId: this.workspaceId,
        deviceId: this.deviceId
      }
    },
    deviceOrganizationId () {
      return this.device.organization.id
    }
  },
  methods: {
    ...mapActions('organization/meraki', ['fetchNetworks']),
    ...mapActions('workspace/network', ['updateDevice', 'sendDeviceCommand', 'disassociateDevice',
      'updateDeviceNetwork', 'retrieveMerakiMonitoringDevice', 'fetchMerakiDeviceConnectionHistory',
      'fetchMerakiDeviceLatencyHistory']),
    fetchDevice () {
      this.loading = true
      this.retrieveMerakiMonitoringDevice(this.filters).then(response => {
        this.$set(this, 'device', response.data.data)
        this.$set(this, 'originalDevice', JSON.parse(JSON.stringify(response.data.data)))
        this.$set(this, 'selectedParentNetwork', response.data.data.network ? response.data.data.network.id : null)
      }).finally(() => {
        this.loading = false
      })
    },
    onSaveClick () {
      this.loading = true

      // We are not sending latitude and longitude for now, so that when address is updated,
      // api weill send the request to Meraki in such a way that the coordinates will be updated as well
      const { latitude, longitude, ...deviceData } = this.device

      this.updateDevice({
        workspaceId: this.workspaceId,
        deviceId: this.deviceId,
        ...deviceData
      }).then(response => {
        this.$set(this, 'originalDevice', JSON.parse(JSON.stringify(this.device)))
        this.$set(this, 'selectedParentNetwork', response.data.data.network ? response.data.data.network.id : null)

        global.toastr['success'](this.$t('v2.merakiDevices.deviceUpdateSuccess'), this.$t('general.success'))
      }).finally(() => {
        this.loading = false
      })

      EventTracker.sendEvent(EVENT_NAMES.MONITORED_DEVICE_UPDATED)
    },
    onRebootClick () {
      this.$refs.confirmModal.open(
        this.$t('errors.warning'),
        this.$t('v2.merakiDevices.deviceRebootConfirmation')
      ).then(confirm => {
        if (confirm) {
          this.loading = true
          this.sendDeviceCommand({
            workspaceId: this.workspaceId,
            deviceId: this.deviceId,
            command: 'reboot'
          }).then(response => {
            global.toastr['success'](this.$t('v2.merakiDevices.deviceRebootSuccess'), this.$t('general.success'))
          }).catch(() => {
            global.toastr['error'](this.$t('v2.merakiDevices.deviceRebootFailure'), this.$t('general.error'))
          }).finally(() => {
            this.loading = false
          })

          EventTracker.sendEvent(EVENT_NAMES.MONITORED_DEVICE_REBOOTED)
        }
      })
    },
    onRemoveFromNetworkClick () {
      this.$refs.confirmModal.open(
        this.$t('errors.warning'),
        this.$t('v2.merakiDevices.deviceRemoveFromNetworkConfirmation')
      ).then(confirm => {
        if (confirm) {
          this.loading = true
          this.disassociateDevice({
            workspaceId: this.workspaceId,
            deviceId: this.deviceId
          }).then(response => {
            global.toastr['success'](this.$t('v2.merakiDevices.deviceRemoveFromNetworkSuccess'), this.$t('general.success'))

            // Re-fetch device after disassociation
            this.fetchDevice()
          }).catch(() => {
            global.toastr['error'](this.$t('v2.merakiDevices.deviceRemoveFromNetworkFailure'), this.$t('general.error'))
          }).finally(() => {
            this.loading = false
          })

          EventTracker.sendEvent(EVENT_NAMES.MONITORED_DEVICE_REMOVED_FROM_NETWORK)
        }
      })
    },
    onTagsInput (value) {
      const tags = this.device.tags.filter(tag => {
        return value.indexOf(tag.name) > -1
      })

      value.forEach(tagName => {
        if (tags.filter(tag => {
          return tag.name === tagName
        }).length === 0) {
          tags.push({
            name: tagName
          })
        }
      })

      this.$set(this.device, 'tags', tags)
    },
    onNetworkUpdateTriggerClick () {
      this.isEditingNetwork = !this.isEditingNetwork

      // Fetch networks if setting to editing state for the first name
      if (this.isEditingNetwork && !this.isNetworksFetched) {
        this.isNetworksFetched = true
        this.fetchNetworks({
          organizationId: this.deviceOrganizationId,
          page_size: 0
        })
      }
    },
    onUpdateNetworkClick () {
      this.loading = true
      this.updateDeviceNetwork({
        workspaceId: this.workspaceId,
        deviceId: this.deviceId,
        meraki_network: this.selectedParentNetwork
      }).then(response => {
        global.toastr['success'](this.$t('v2.merakiDevices.deviceNetworkUpdateSuccess'), this.$t('general.success'))

        this.isEditingNetwork = false

        // Re-fetch device after network update
        this.fetchDevice()
      }).catch(() => {
        global.toastr['error'](this.$t('v2.merakiDevices.deviceNetworkUpdateFailure'), this.$t('general.error'))
      }).finally(() => {
        this.loading = false
      })
    },
    onTabHeaderClick: function (tabKey) {
      this.selectedTab = tabKey

      if (this.selectedTab === this.tabs.health && !this.isHistoryFetched) {
        // Fetch health history if switching to health tab for the first time
        this.isHistoryFetched = true

        this.fetchMerakiDeviceConnectionHistory(this.filters)
        this.fetchMerakiDeviceLatencyHistory(this.filters)
      }
    },
    onBackClick () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";
  @import "styles/v2/base.scss";

  .meraki-device-detail {
    background-color: $white;
    position: relative;

    &__header {
      height: 60px;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
      padding: 0 30px 0 0;
      overflow: hidden;

      &__back-link-container {
        float: left;
        width: 60px;
        line-height: 60px;
        border-right: 1px solid #eff3f8;
        text-align: center;

        &__back-icon {
          color: $blue-reserve;
          line-height: 60px;
        }
      }

      &__page-title {
        margin-left: 33px;
        line-height: 60px;
        letter-spacing: 1px;
        float: left;
      }

      &__actions {
        float: right;

        &__action {
          margin: 12px 0 0 13px;
          width: 200px;
        }
      }
    }

    &__content {
      padding: 24px 40px;
      box-sizing: border-box;

      &__tab-headers {
        .tab-header {
          @media only screen and (max-width: 1024px) {
            min-width: 112px;
          }
        }
      }

      &__tab {
        padding-top: 30px;

        .container {
          margin-left: 0;
        }

        &__section {
          &__title {
            height: 38px;
            line-height: 38px;
            padding: 0 14px;
            background-color: $gray-xlight;
            overflow: hidden;
          }

          &:not(:last-child) {
            border-right: 1px solid $gray-xlight;
          }
        }

        &__row {
          margin-bottom: 10px;

          .base-text-input, .base-text-area, .multi-text-input, .base-select {
            width: calc(100% - 14px);
          }

          label {
            font-weight: 600;
            line-height: 40px;
            padding-left: 14px;
          }

          &__static-value {
            line-height: 40px;
          }

          &__action-icon {
            font-size: 15px;
            vertical-align: middle;
            margin-left: 10px;
            cursor: pointer;
          }

          .base-button {
            margin-top: 10px;
            margin-right: 10px;
          }
        }
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
