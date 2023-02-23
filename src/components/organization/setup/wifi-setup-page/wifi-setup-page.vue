<template lang="pug">
  .wifi-setup-page(
    :class="[{'is-quick-setup': isQuickSetup}]"
  )
    .wifi-setup-page__description
      | {{ $t('organization.wifiSetupDescription') }}
    v-layout(row wrap)
      v-flex(xs12 lg4 xl3)
        .wifi-setup-page__left-section
          network-template-list(
            :ssid-selections="ssidSelections"
            @networkSelect="onNetworkSelect"
            ref="networkList"
          )
      v-flex(xs12 lg8 xl9)
        .wifi-setup-page__deployment-section
          .wifi-setup-page__deployment-section__regular-content(
            v-show="selectedNetwork == null"
          )
            .wifi-setup-page__placeholder-section
              .wifi-setup-page__placeholder-section__warning-icon
                img(
                  src="@/assets/images/blue-warning.svg"
                )
              .wifi-setup-page__placeholder-section__title
                | {{ $t('v2.organization.setup.hardwareSetup') }}
              .wifi-setup-page__placeholder-section__progress
              .wifi-setup-page__placeholder-section__description
                | {{ $t('v2.organization.setup.selectTemplateNetworkForSetup') }}
          .wifi-setup-page__deployment-section__regular-content(
            v-show="selectedNetwork != null && !isDeploymentSuccessful"
          )
            .wifi-setup-page__deployment-section__header
              .wifi-setup-page__deployment-section__header__title
                | {{ selectedNetwork ? selectedNetwork.name : '' }}
              .wifi-setup-page__deployment-section__header__actions
                base-button.base-button--green(
                  @click="onDeployClick"
                  :disabled="!isSelectionMade"
                ) {{ !isQuickSetup ? $t('v2.organization.setup.deployToSelectedSSIDs') : $t('organization.deployWifi') }}
            .wifi-setup-page__deployment-section__content
              perfect-scrollbar.wifi-setup-page__deployment-section__content__scroll-holder
                .wifi-setup-page__deployment-section__content__ssid-selection(
                  v-if="selectedNetwork !== null"
                )
                  .wifi-setup-page__deployment-section__content__ssid-selection__header
                    .wifi-setup-page__deployment-section__content__ssid-selection__header__title
                      | {{ $t('v2.organization.setup.definedSSIDsForThisNetwork') }}
                    .wifi-setup-page__deployment-section__content__ssid-selection__header__count
                      | {{ enabledSsids.length }} / {{ selectedNetwork.ssids.length }}
                  .wifi-setup-page__deployment-section__content__ssid-selection__items
                    .wifi-setup-page__deployment-section__content__ssid-selection__items__item(
                      v-for="ssid of enabledSsids"
                      :key="ssid.id"
                      @click="onClickSSID(ssid)"
                    )
                      base-check-box(
                        :label="'SSID ' + (ssid.number + 1) + ' : '"
                        v-model="ssidSelections[ssid.id].isSelected"
                      )
                      .wifi-setup-page__deployment-section__content__ssid-selection__items__item__ssid_name
                        span {{ ssid.name }}
                      v-icon wifi

                  .wifi-setup-page__deployment-section__content__ssid-selection__add-ssid(
                    v-show="unconfiguredSsids.length > 0"
                  )
                    .wifi-setup-page__deployment-section__content__ssid-selection__add-ssid__button(
                      v-show="addingSsid === false"
                      @click="onAddSSIDClick"
                    )
                      | + {{ $t('v2.organization.setup.addNewSSID') }}
                    base-text-input(
                      v-show="addingSsid === true"
                      v-model="newSSIDName"
                      :placeholder="$t('v2.organization.setup.typeSSIDName')"
                    )
                    base-button.base-button--blue--negative(
                      v-show="addingSsid === true"
                      @click="onCreateSSIDClick"
                      :disabled="!newSSIDName"
                    ) {{ $t('v2.organization.setup.createSSID') }}
                    v-icon(
                      v-show="addingSsid === true"
                      @click="onCloseNewSSIDClick"
                    ) close

                social-login-selection(
                  @selectionChange="onSocialLoginSelectionChange"
                )
          .wifi-setup-page__deployment-section__success-content(
            v-show="selectedNetwork != null && isDeploymentSuccessful"
          )
            wifi-setup-success

    wifi-setup-confirm-modal(
      :show="isConfirmModalVisible"
      :selections="ssidSelections"
      @close="onConfirmModalClose"
    )

    .wifi-setup-page__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )
</template>

<script>
import NetworkTemplateList from './network-template-list'
import BaseButton from '@/components/v2/base-button/base-button'
import BaseCheckBox from '@/components/v2/base-check-box/base-check-box'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import SocialLoginSelection from './social-login-selection'
import WifiSetupConfirmModal from './wifi-setup-confirm-modal.vue'
import WifiSetupSuccess from './wifi-setup-success'
import { mapActions } from 'vuex'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'wifi-setup-page',
  props: {
    isQuickSetup: {
      type: Boolean,
      default: false
    }
  },
  components: {
    WifiSetupSuccess,
    SocialLoginSelection,
    BaseTextInput,
    BaseCheckBox,
    BaseButton,
    NetworkTemplateList,
    WifiSetupConfirmModal
  },
  data: function () {
    return {
      loading: false,
      selectedNetwork: null,
      addingSsid: false,
      newSSIDName: null,
      ssidSelections: {},
      socialLoginSelections: [],
      unConfiguredSSIDKey: 'Unconfigured',
      isConfirmModalVisible: false,
      isDeploymentSuccessful: false
    }
  },
  computed: {
    enabledSsids () {
      return this.selectedNetwork ? this.selectedNetwork.ssids.filter(ssid => {
        return ssid.enabled === true
      }) : []
    },
    unconfiguredSsids () {
      return this.selectedNetwork ? this.selectedNetwork.ssids.filter(ssid => {
        return ssid.enabled === false && ssid.name.indexOf(this.unConfiguredSSIDKey) > -1
      }) : []
    },
    isSelectionMade () {
      let isSelectionMade = false

      Object.keys(this.ssidSelections).forEach((key, index) => {
        if (this.ssidSelections[key].isSelected) {
          isSelectionMade = true
        }
      })

      return isSelectionMade
    },
    selectedSsidIds () {
      let ids = []

      Object.keys(this.ssidSelections).forEach((key, index) => {
        if (this.ssidSelections[key].isSelected) {
          ids.push(key)
        }
      })

      return ids
    }
  },
  methods: {
    ...mapActions('organization/meraki', ['bulkUpdateNetworkSSIDs', 'configureWifiForSSIDs']),
    onNetworkSelect (network) {
      this.selectedNetwork = network

      // Add ssid selection data for network ssids
      this.enabledSsids.forEach(ssid => {
        if (!this.ssidSelections.hasOwnProperty(ssid.id)) {
          this.$set(this.ssidSelections, ssid.id, {
            isSelected: false,
            name: ssid.name,
            number: ssid.number,
            networkId: network.network_id,
            networkName: network.name
          })
        }
      })
    },
    onAddSSIDClick () {
      this.addingSsid = true
    },
    onCloseNewSSIDClick () {
      this.addingSsid = false
      this.newSSIDName = null
    },
    onSocialLoginSelectionChange (selections) {
      this.socialLoginSelections = selections
    },
    onCreateSSIDClick () {
      // Get an available ssid first
      const ssid = this.selectedNetwork.ssids.filter(ssid => {
        return ssid.enabled === false && ssid.name.indexOf(this.unConfiguredSSIDKey) > -1
      })[0]

      if (!ssid) {
        return false
      }

      this.loading = true
      this.bulkUpdateNetworkSSIDs({
        organizationId: this.$route.params.orgId,
        payload: [{
          ...ssid,
          enabled: true,
          name: this.newSSIDName
        }]
      }).then(response => {
        this.newSSIDName = null
        this.addingSsid = false

        // Re-fetch network list
        // TODO: Find another way than calling child's method here
        this.$refs.networkList.fetchNetworks()
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.loading = false
      })

      EventTracker.sendEvent(EVENT_NAMES.MERAKI_SSID_CREATED)
    },
    onDeployClick () {
      this.isConfirmModalVisible = true

      EventTracker.sendEvent(EVENT_NAMES.MERAKI_SSID_CONFIGURED)
    },
    onConfirmModalClose (confirm) {
      this.isConfirmModalVisible = false

      if (confirm) {
        // If there are unsaved ssids, save them first, then deploy
        this.loading = true
        this.configureWifiForSSIDs({
          organizationId: this.$route.params.orgId,
          ssids: this.selectedSsidIds,
          login_methods: this.socialLoginSelections
        }).then(response => {
          if (this.isQuickSetup) {
            this.$router.push({ name: 'OrganizationSetupWifiDeploymentSuccess' })
          } else {
            this.$set(this, 'isDeploymentSuccessful', true)
          }
        }).catch(err => {
          console.log(err)
        }).finally(() => {
          this.loading = false
        })
      }
    },
    onClickSSID (ssid) {
      this.ssidSelections[ssid.id].isSelected = !this.ssidSelections[ssid.id].isSelected
    }
  }
}
</script>

<style src="./wifi-setup-page.scss" lang="scss" scoped></style>
