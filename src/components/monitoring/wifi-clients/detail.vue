<template lang="pug">
  .wifi-client-detail.page-content
    .wifi-client-detail__header
      .wifi-client-detail__header__back-link-container
        v-icon.wifi-client-detail__header__back-link-container__back-icon(
        @click="onBackClick"
        ) keyboard_backspace
      h4.wifi-client-detail__header__page-title
        | {{ client.description }}

    .wifi-client-detail__content

      .wifi-client-detail__content__tab-headers
        base-tab-header(
          :class="['tab-header--underlined', 'tab-header--blue', {'tab-header--active': selectedTab === tabs.general}]"
          @click="onTabHeaderClick(tabs.general)"
        ) General data
        base-tab-header(
          :class="['tab-header--underlined', 'tab-header--blue', {'tab-header--active': selectedTab === tabs.events}]"
          @click="onTabHeaderClick(tabs.events)"
        ) Events
        base-tab-header(
          :class="['tab-header--underlined', 'tab-header--blue', {'tab-header--active': selectedTab === tabs.trafficHistory}]"
          @click="onTabHeaderClick(tabs.trafficHistory)"
        ) Traffic history
        base-tab-header(
          :class="['tab-header--underlined', 'tab-header--blue', {'tab-header--active': selectedTab === tabs.usageHistory}]"
          @click="onTabHeaderClick(tabs.usageHistory)"
        ) Usage history
        base-tab-header(
          :class="['tab-header--underlined', 'tab-header--blue', {'tab-header--active': selectedTab === tabs.latencyHistory}]"
          @click="onTabHeaderClick(tabs.latencyHistory)"
        ) Latency history

      .wifi-client-detail__content__tab(
        v-show="selectedTab === tabs.general"
      )
        pre {{ client }}

      .wifi-client-detail__content__tab(
        v-show="selectedTab === tabs.events"
      )
        ul
          li(
            v-for="event of merakiClientEvents"
            :key="event.id"
          )
            pre {{ event }}

      .wifi-client-detail__content__tab(
        v-show="selectedTab === tabs.trafficHistory"
      )
        ul
          li(
            v-for="history of merakiClientTrafficHistory"
            :key="history.id"
          )
            pre {{ history }}

      .wifi-client-detail__content__tab(
        v-show="selectedTab === tabs.usageHistory"
      )
        ul
          li(
            v-for="history of merakiClientUsageHistory"
            :key="history.id"
          )
            pre {{ history }}

      .wifi-client-detail__content__tab(
        v-show="selectedTab === tabs.latencyHistory"
      )
        ul
          li(
            v-for="history of merakiClientLatencyHistory"
            :key="history.id"
          )
            pre {{ history }}

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import BaseTabHeader from '@/components/v2/base-tab-header/base-tab-header'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

export default {
  name: 'wifi-client-detail',
  components: {
    BaseTabHeader
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  props: {
    clientId: {
      required: true
    }
  },
  data: function () {
    return {
      loading: false,
      client: {},
      tabs: {
        general: 'general',
        events: 'events',
        trafficHistory: 'trafficHistory',
        usageHistory: 'usageHistory',
        latencyHistory: 'latencyHistory'
      },
      selectedTab: 'general'
    }
  },
  mounted () {
    this.fetchClient()
    this.fetchClientEvents()
    this.fetchClientTrafficHistory()
    this.fetchClientUsageHistory()
    this.fetchClientLatencyHistory()
  },
  computed: {
    ...mapGetters('workspace/network', ['merakiClientEvents', 'merakiClientTrafficHistory', 'merakiClientUsageHistory',
      'merakiClientLatencyHistory']),
    filters () {
      return {
        workspaceId: this.workspaceId,
        clientId: this.clientId
      }
    }
  },
  methods: {
    ...mapActions('organization/meraki', {
      fetchOrganizationClient: 'fetchMerakiClient',
      fetchOrganizationClientEvents: 'fetchMerakiClientEvents',
      fetchOrganizationClientTrafficHistory: 'fetchMerakiClientTrafficHistory',
      fetchOrganizationClientUsageHistory: 'fetchMerakiClientUsageHistory',
      fetchOrganizationClientLatencyHistory: 'fetchMerakiClientLatencyHistory'
    }),
    ...mapActions('workspace/network', ['fetchMerakiClient', 'fetchMerakiClientEvents',
      'fetchMerakiClientTrafficHistory', 'fetchMerakiClientUsageHistory', 'fetchMerakiClientLatencyHistory']),
    fetchClient () {
      this.loading = true
      this.fetchMerakiClient(this.filters).then(response => {
        this.$set(this, 'client', response.data.data)
      }).finally(() => {
        this.loading = false
      })
    },
    fetchClientEvents () {
      this.loading = true
      this.fetchMerakiClientEvents(this.filters).finally(() => {
        this.loading = false
      })
    },
    fetchClientTrafficHistory () {
      this.loading = true
      this.fetchMerakiClientTrafficHistory(this.filters).finally(() => {
        this.loading = false
      })
    },
    fetchClientUsageHistory () {
      this.loading = true
      this.fetchMerakiClientUsageHistory(this.filters).finally(() => {
        this.loading = false
      })
    },
    fetchClientLatencyHistory () {
      this.loading = true
      this.fetchMerakiClientLatencyHistory(this.filters).finally(() => {
        this.loading = false
      })
    },
    onTabHeaderClick: function (tabKey) {
      this.selectedTab = tabKey
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

  .wifi-client-detail {
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
          margin: 10px 0 0 13px;
          width: 180px;
        }
      }
    }

    &__content {
      padding: 24px 40px;
      box-sizing: border-box;

      &__tab {
        padding-top: 30px;
      }
    }
  }
</style>
