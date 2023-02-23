<template lang="pug">
  .network-template-list
    .network-template-list__header
      search-input.base-text-input--small(
        v-model="search"
        :placeholder="$t('v2.organization.setup.networksTemplates')"
      )
    .network-template-list__content
      .network-template-list__content__section(
        :class="[{'expanded-section-full': isTemplateExpanded && !isNetworkExpanded, 'expanded-section-half': isTemplateExpanded && isNetworkExpanded}]")
        .network-template-list__content__section__header(@click="isTemplateExpanded=!isTemplateExpanded")
          .network-template-list__content__section__header__title
            | {{ $t('wifi.templates') }} ({{ templates.length }})
          v-icon {{ isTemplateExpanded ? 'arrow_drop_up' : 'arrow_drop_down' }}
        transition(name="slide")
          .network-template-list__content__section__items(v-show="isTemplateExpanded")
            perfect-scrollbar.network-template-list__content__section__items__scroll-holder
              .network-template-list__content__section__items__item(
              v-for="network of templates"
              :key="network.network_id"
              :class="[{'network-template-list__content__section__items__item--selected': selectedNetwork && (selectedNetwork.network_id === network.network_id)}, {'network-template-list__content__section__items__item--configured': isNetworkSelectedForConfiguration(network)}]"
              @click="onNetworkItemClick(network)"
              )
                v-icon check_circle
                span.network-template-list__content__section__items__item__title
                  | {{ network.name }}
      .network-template-list__content__section(
        :class="[{'expanded-section-half': isTemplateExpanded && isNetworkExpanded, 'expanded-section-full': !isTemplateExpanded && isNetworkExpanded}]"
      )
        .network-template-list__content__section__header(@click="isNetworkExpanded=!isNetworkExpanded")
          .network-template-list__content__section__header__title
            | {{ $t('wifi.networks') }} ({{ networks.length }})
          v-icon {{ isNetworkExpanded ? 'arrow_drop_up' : 'arrow_drop_down' }}
        transition(name="slide")
          .network-template-list__content__section__items(v-show="isNetworkExpanded")
            perfect-scrollbar.network-template-list__content__section__items__scroll-holder
              .network-template-list__content__section__items__item(
                v-for="network of networks"
                :key="network.network_id"
                :class="[{'network-template-list__content__section__items__item--selected': selectedNetwork && (selectedNetwork.network_id === network.network_id)}, {'network-template-list__content__section__items__item--configured': isNetworkSelectedForConfiguration(network)}]"
                @click="onNetworkItemClick(network)"
              )
                v-icon check_circle
                span.network-template-list__content__section__items__item__title
                  | {{ network.name }}

    .network-template-list__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )
</template>

<script>
import SearchInput from '@/components/v2/search-input/search-input'
import { mapActions, mapGetters } from 'vuex'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'network-template-list',
  components: {
    SearchInput
  },
  props: {
    ssidSelections: {
      type: Object
    }
  },
  data: function () {
    return {
      search: null,
      loading: false,
      selectedNetwork: null,
      isTemplateExpanded: true,
      isNetworkExpanded: true
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
    networks () {
      return this.networkList.filter(network => {
        return network.type === 'network'
      })
    },
    templates () {
      return this.networkList.filter(network => {
        return network.type === 'template'
      })
    }
  },
  watch: {
    search: {
      handler: function () {
        this.fetchNetworks()

        EventTracker.sendEvent(EVENT_NAMES.MERAKI_SSID_NETWORKS_SEARCHED)
      }
    }
  },
  methods: {
    ...mapActions('organization/meraki', ['fetchNetworkBases', 'synchronizeNetworkSSIDs']),
    fetchNetworks () {
      const filters = {
        organizationId: this.$route.params.orgId,
        page_size: 0,
        configurable: true
      }

      if (this.search) {
        filters['search'] = this.search
      }

      this.loading = true
      this.fetchNetworkBases(filters).then(response => {
        if (this.selectedNetwork) {
          const networkItem = this.networkList.filter(network => {
            return network.network_id === this.selectedNetwork.network_id
          })[0]

          if (networkItem) {
            this.onNetworkItemClick(networkItem)
          }
        }
      }).finally(() => {
        this.loading = false
      })
    },
    onNetworkItemClick (network) {
      this.selectedNetwork = network

      if (network.ssids.length === 0) {
        // If network ssids not yet loaded, synchronize ssids and then continue
        this.loading = true
        this.synchronizeNetworkSSIDs({
          organizationId: this.$route.params.orgId,
          networkId: network.network_id
        }).then(response => {
          this.$emit('networkSelect', network)
        }).finally(() => {
          this.loading = false
        })
      } else {
        this.$emit('networkSelect', network)
      }
    },
    isNetworkSelectedForConfiguration (network) {
      let isSelected = false

      network.ssids.filter(ssid => {
        return ssid.enabled === true
      }).forEach(ssid => {
        if (this.ssidSelections.hasOwnProperty(ssid.id) && this.ssidSelections[ssid.id].isSelected === true) {
          isSelected = true
        }
      })

      return isSelected
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../../styles/v2/colors";

  .network-template-list {
    background-color: $white;
    position: relative;

    &__header {
      height: 65px;
      padding: 0 17px;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;

      .base-text-input {
        margin-top: 18px;
      }
    }

    &__content {

      &__section {

        &__header {
          cursor:pointer;
          user-select: none;
          padding: 0 17px;
          height: 46px;
          line-height: 46px;
          overflow: hidden;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.12);

          &__title {
            float: left;

            font-family: Fira Sans;
            font-style: normal;
            font-weight: 600;
            font-size: 18px;
            letter-spacing: 2px;
            text-transform: uppercase;

            color: $blue-dark
          }

          .v-icon {
            float: right;
            color: $blue-dark;
            line-height: 46px;
          }
        }

        &__items {

          &__scroll-holder {
            height: 100%;
          }

          &__item {
            height: 40px;
            line-height: 40px;
            border-bottom: 2px solid $gray-xlight;
            padding: 0 13px;
            cursor: pointer;

            .v-icon {
              color: $gray-light;
              margin-right: 12px;
              line-height: 40px;
              font-size: 20px;
              vertical-align: middle;
            }

            &__title {
              font-family: Fira Sans;
              font-style: normal;
              font-weight: 500;
              font-size: 15px;
              color: $text-medium;
              vertical-align: middle;

              display: inline-block;
              max-width: 85%;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            &--selected {
              background-color: $blue-dark;

              .network-template-list__content__section__items__item__title {
                color: $white
              }
            }

            &--configured {
              .v-icon {
                color: $green-medium;
              }
            }
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

  @media only screen and (min-width: 1264px) {
    .network-template-list {
      &__content {
        height: calc(100% - 65px);

        &__section {
          height: 46px;
          &.expanded-section-half {
            height: 50%;
          }
          &.expanded-section-full {
            height: calc(100% - 46px);
          }

          &__items {
            height: calc(100% - 46px);
          }
        }
      }
    }
  }

  @media only screen and (max-width: 1264px) {
    .network-template-list {
      &__content {
        &__section {
          &__items {
            height: 360px;
          }
        }
      }
    }
  }
</style>
