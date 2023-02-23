<template lang="pug">
  div.meraki-connection-success(
    :class="[{ 'meraki-connection-success--extended': itemsVisible }]"
  )
    div.meraki-connection-success__header
      img.meraki-connection-success__header__success-visual(
        src="@/assets/images/check-icon.png"
      )
      div.meraki-connection-success__header__text-container
        div.meraki-connection-success__header__success-title
          | {{ $t('general.success') }}!
        div.meraki-connection-success__header__success-description
          | {{ $t('organization.merakiConnectionSuccessDescription') }}
      div.meraki-connection-success__header__view-trigger(
        @click="itemsVisible = !itemsVisible"
      )
        div(
          v-if="!itemsVisible"
        )
          | {{ $t('general.viewItems') }}
          v-icon.meraki-connection-success__header__view-trigger__icon arrow_drop_down
        div(
          v-if="itemsVisible"
        )
          | {{ $t('general.closeItems') }}
          v-icon.meraki-connection-success__header__view-trigger__icon arrow_drop_up
    transition( name="slide")
      div.meraki-connection-success__content(
        v-show="itemsVisible"
      )
        div.meraki-connection-success__content__tab-headers
          v-layout(row wrap)
            v-flex(xs3 md3 lg2 xl1)
              base-tab-header(
                :class="['tab-header--blue tab-header--underlined', {'tab-header--active': selectedTab === tabs.venues}]"
                @click="onTabHeaderClick(tabs.venues)"
              ) {{ $t('general.venues') }} ({{ merakiNetworkList.length }})
            v-flex(xs3 md3 lg2 xl1)
              base-tab-header(
                :class="['tab-header--blue tab-header--underlined', {'tab-header--active': selectedTab === tabs.devices}]"
                @click="onTabHeaderClick(tabs.devices)"
              ) {{ $t('venue.devices') }} ({{ merakiMatchedDeviceList.length }})
            v-flex(xs3 md3 lg2 xl1)
              base-tab-header(
                 v-if="merakiSkippedDeviceList.length > 0"
                :class="['tab-header--blue tab-header--underlined', {'tab-header--active': selectedTab === tabs.skippedDevices}]"
                @click="onTabHeaderClick(tabs.skippedDevices)"
              ) {{ $t('venue.skippedDevices') }} ({{ merakiSkippedDeviceList.length }})
            v-flex(xs3 md3 lg6 xl9)
              search-input.base-text-input--small.meraki-connection-success__content__tab-headers__search(
                v-model="search"
                @input="onChangeSearchText"
                :placeholder="$t('general.search')"
              )
        perfect-scrollbar(
          class="meraki-connection-success__content__scroll-area"
        )
          div.meraki-connection-success__content__list(
            v-show="selectedTab === tabs.venues"
          )
            v-layout(row wrap)
              v-flex(
                xs6 md4
                v-for="network of merakiNetworkList"
                :key="network.id"
                class="meraki-connection-success__content__list__item"
              )
                div.meraki-connection-success__content__list__item__content
                  | {{ network.name }}
          div.meraki-connection-success__content__list(
            v-show="selectedTab === tabs.devices"
          )
            v-layout(row wrap)
              v-flex(
                xs6 md4
                v-for="device of merakiMatchedDeviceList"
                :key="device.id"
                class="meraki-connection-success__content__list__item"
              )
                div.meraki-connection-success__content__list__item__content
                  | {{ device.name }}
          div.meraki-connection-success__content__list(
            v-show="selectedTab === tabs.skippedDevices"
          )
            .meraki-connection-success__content__list__desc {{ $t('venue.skippedDevicesDesc') }}
            v-layout(row wrap)
              v-flex(
                xs6 md4
                v-for="device of merakiSkippedDeviceList"
                :key="device.id"
                class="meraki-connection-success__content__list__item"
              )
                div.meraki-connection-success__content__list__item__content
                  | {{ device.name }}

    div.meraki-connection-success__footer
      div.meraki-connection-success__footer__navigation-label
        | {{ $t('general.whatsNext') }}?
      div.meraki-connection-success__footer__navigation-buttons
        base-button(
          class="base-button--blue"
          @click="onNextStepClick"
        )
          v-icon arrow_right
          span {{ $t('organization.setupWifi') }}
        base-button(
          class="base-button--blue--negative"
          @click="onFinishClick"
        )
          v-icon arrow_right
          span {{ $t('organization.endSetup') }}

</template>

<script>
import BaseTabHeader from '@/components/v2/base-tab-header/base-tab-header.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import SearchInput from '@/components/v2/search-input/search-input'
import { mapGetters } from 'vuex'

export default {
  name: 'meraki-connection-success',
  components: {
    BaseTabHeader,
    BaseButton,
    SearchInput
  },
  data: function () {
    return {
      itemsVisible: false,
      tabs: {
        venues: 'venues',
        devices: 'devices',
        skippedDevices: 'skipped_devices'
      },
      selectedTab: 'venues',
      search: ''
    }
  },
  mounted () {
    this.fetchNetworks()
    this.fetchMatchedDevices()
    this.fetchSkippedDevices()
  },
  computed: {
    ...mapGetters('organization/meraki', ['merakiNetworks', 'merakiMatchedDevices', 'merakiSkippedDevices']),
    merakiNetworkList () {
      return (this.merakiNetworks && this.merakiNetworks.data) ? this.merakiNetworks.data.results : []
    },
    merakiMatchedDeviceList () {
      return (this.merakiMatchedDevices && this.merakiMatchedDevices.data) ? this.merakiMatchedDevices.data.results : []
    },
    merakiSkippedDeviceList () {
      return (this.merakiSkippedDevices && this.merakiSkippedDevices.data) ? this.merakiSkippedDevices.data.results : []
    }
  },
  methods: {
    onChangeSearchText () {
      this.fetchNetworks()
      this.fetchMatchedDevices()
      this.fetchSkippedDevices()
    },
    fetchNetworks () {
      const filters = {
        organizationId: this.$route.params.orgId,
        search: this.search,
        page_size: 0
      }

      this.$store.dispatch('organization/meraki/fetchNetworks', filters)
    },
    fetchMatchedDevices () {
      const filters = {
        organizationId: this.$route.params.orgId,
        search: this.search,
        page_size: 0
      }

      this.$store.dispatch('organization/meraki/fetchMatchedDevices', filters)
    },
    fetchSkippedDevices () {
      const filters = {
        organizationId: this.$route.params.orgId,
        search: this.search,
        page_size: 0
      }

      this.$store.dispatch('organization/meraki/fetchSkippedDevices', filters)
    },
    onTabHeaderClick (tab) {
      this.selectedTab = tab
    },
    onNextStepClick () {
      this.$emit('nextStepClick')
    },
    onFinishClick () {
      this.$emit('finishClick')
    }
  }
}
</script>

<style src="./meraki-connection-success.scss" lang="scss" scoped></style>
