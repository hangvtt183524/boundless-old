<template lang="pug">
  base-modal(
    class="wifi-setup-confirm-modal"
    :show="show"
    @close="close"
    max-width="860px"
  )
    template(v-slot:default)
      v-layout(row wrap)
        v-flex(xs12 md6)
          .wifi-setup-confirm-modal__column.wifi-setup-confirm-modal__left-column
            .wifi-setup-confirm-modal__left-column__title
              | {{ title }}
            ul.wifi-setup-confirm-modal__left-column__action-list
              li.wifi-setup-confirm-modal__left-column__action-list__item
                | {{ $t('v2.organization.setup.addRadiusServers') }}
              li.wifi-setup-confirm-modal__left-column__action-list__item
                | {{ $t('v2.organization.setup.configureWalledGarden') }}
              li.wifi-setup-confirm-modal__left-column__action-list__item
                | {{ $t('v2.organization.setup.enableSplashPageAuthentication') }}
              li.wifi-setup-confirm-modal__left-column__action-list__item
                | {{ $t('v2.organization.setup.setUpSyslogServers') }}
            base-button.base-button--green(
              @click="onDeployClick"
            ) {{ $t('v2.organization.setup.deployWifi') }}
            base-button.base-button--green--negative(
              @click="close"
            ) {{ $t('general.cancel') }}
            .wifi-setup-confirm-modal__left-column__warning *{{ $t('v2.organization.setup.deployWifiWarning') }}

        v-flex(xs12 md6)
          .wifi-setup-confirm-modal__column.wifi-setup-confirm-modal__right-column
            .wifi-setup-confirm-modal__right-column__title
              | {{ $t('v2.organization.setup.forFollowingTemplateNetworks') }}
            perfect-scrollbar.wifi-setup-confirm-modal__right-column__scroll-holder
              .wifi-setup-confirm-modal__right-column__network-item(
                v-for="network of selectedNetworks"
                :key="network.id"
              )
                .wifi-setup-confirm-modal__right-column__network-item__header(
                  @click="onNetworkExpandClick(network)"
                )
                  .wifi-setup-confirm-modal__right-column__network-item__header__network-name
                    | {{ network.name }}
                  v-icon.wifi-setup-confirm-modal__right-column__network-item__header__expand-trigger
                    | {{ network.isExpanded ? 'arrow_drop_up' : 'arrow_drop_down' }}
                transition(name="slide")
                  .wifi-setup-confirm-modal__right-column__network-item__content(
                    v-show="network.isExpanded"
                  )
                    .wifi-setup-confirm-modal__right-column__network-item__content__ssid(
                      v-for="ssid of network.ssids"
                      :key="ssid.id"
                    )
                      | {{ ssid.name }}

</template>

<script>
import BaseModal from '@/components/v2/base-modal/base-modal.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'wifi-setup-confirm-modal',
  components: {
    BaseModal,
    BaseButton
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    selections: {
      type: Object
    }
  },
  data: function () {
    return {
      selectedNetworks: []
    }
  },
  computed: {
    ...mapGetters('layout', ['selectedOrganization']),
    title () {
      let organizationName = ''
      if (this.selectedOrganization && this.selectedOrganization.meraki_organization) {
        organizationName = this.selectedOrganization.meraki_organization.name
      }

      return this.$t('v2.organization.setup.deployWifiConfirmTitle').replace('{organization_name}', organizationName)
    }
  },
  watch: {
    selections: {
      handler: function () {
        this.setSelectedNetworks()
      },
      deep: true
    }
  },
  methods: {
    setSelectedNetworks () {
      const selectedNetworks = []

      Object.keys(this.selections).forEach((key, index) => {
        if (this.selections[key].isSelected) {
          // See if the network is added before
          let existingNetwork = selectedNetworks.filter(network => {
            return network.id === this.selections[key].networkId
          })[0]

          if (!existingNetwork) {
            existingNetwork = {
              id: this.selections[key].networkId,
              name: this.selections[key].networkName,
              isExpanded: false,
              ssids: []
            }
            selectedNetworks.push(existingNetwork)
          }

          existingNetwork.ssids.push({
            name: this.selections[key].name,
            id: key
          })
        }
      })

      this.$set(this, 'selectedNetworks', selectedNetworks)
    },
    close () {
      this.$emit('close')
    },
    onDeployClick () {
      // Emit close event with selection
      this.$emit('close', true)
    },
    onNetworkExpandClick (network) {
      this.$set(network, 'isExpanded', !network.isExpanded)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../../styles/v2/colors";
  .wifi-setup-confirm-modal {
    &__left-column {
      padding: 0 0 40px 0;
      @media (min-width: 960px) {
        margin-top: -40px;
        margin-left: -40px;
        margin-bottom: -40px;
        padding: 41px 43px 40px 40px;
        background: #F8FAFC;
        box-shadow: 0px 2px 40px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
      }

      &__title {
        font-family: Source Sans Pro;
        font-style: normal;
        font-weight: 600;
        font-size: 18px;
        line-height: 23px;
        color: $blue-dark;
      }

      &__action-list {
        margin: 30px 0 38px 23px;

        &__item {
          font-family: Source Sans Pro;
          font-style: normal;
          font-weight: normal;
          font-size: 16px;
          line-height: 26px;
          color: #4F4F4F;
        }
      }

      &__warning {
        margin-top: 26px;
        font-family: Fira Sans;
        font-style: italic;
        font-weight: normal;
        font-size: 14px;
        line-height: 22px;
        color: $blue-reserve;
        text-align: center;
      }

      .base-button {
        width: 250px;
        margin: 15px auto 0 auto;
        display: block;

        &:not(:first-child) {
          margin-top: 15px;
        }
      }
    }

    &__right-column {
      padding: 0 0 0 49px;
      &__title {
        font-family: Source Sans Pro;
        font-style: normal;
        font-weight: 600;
        font-size: 18px;
        line-height: 23px;
        color: $blue-dark;
        margin-bottom: 13px;
      }

      &__network-item {
        border: 1px solid $gray-medium;
        border-bottom-width: 3px;
        box-sizing: border-box;
        margin-bottom: 6px;
        user-select: none;

        &__header {
          height: 40px;
          line-height: 40px;
          padding: 0 20px;
          overflow: hidden;
          background-color: white;
          cursor: pointer;

          &__network-name {
            float: left;
            font-family: Fira Sans;
            font-style: normal;
            font-weight: 500;
            font-size: 15px;
            color: $text-medium;
          }

          &__expand-trigger {
            float: right;
            font-size: 20px;
            line-height: 40px;
            cursor: pointer;
            color: $gray-dark;
          }
        }

        &__content {
          &__ssid {
            font-family: Fira Sans;
            font-style: normal;
            font-weight: normal;
            font-size: 15px;
            line-height: 32px;
            color: $text-medium;
            padding: 0 42px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            background-color: $white;
          }

          &__ssid:nth-child(2n + 1) {
            background-color: rgba($gray-xlight, .5);
          }
        }
      }

      &__scroll-holder {
        height: 300px;
      }
    }

    .slide-enter-active {
      transition: all 0.3s;
      transition-timing-function: cubic-bezier(.25,.8,.5,1);
    }

    .slide-leave-active {
      transition: all 0.3s;
      transition-timing-function: cubic-bezier(.25,.8,.5,1);
    }

    .slide-enter-to, .slide-leave {
      max-height: 320px;
      overflow: hidden;
    }

    .slide-enter, .slide-leave-to {
      max-height: 0;
      overflow: hidden;
    }
  }
</style>
