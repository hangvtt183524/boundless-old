<template lang="pug">
  .page-content.monitoring-page
    v-layout(row wrap)
      v-flex.mx-2(xs9, sm8, md3, lg3)
        v-select(
          :items='times'
          v-model='selectedTime'
          :label="$t(' monitoring.selectTime ')"
          item-text="text"
          item-value="value"
          prepend-inner-icon="event"
        )

      v-flex.pb-3(
        v-if="!(getAppFeatures==='production')"
        text-xs-right
      )
        v-btn.primary-action.fixed-right(color='primary', @click.stop='showExportDialog = true')
          .action {{ $t('monitoring.export') }}
          v-icon cloud_download
    .wifi-analytics-progress(v-if="loading")
      v-progress-circular(:size="50" indeterminate color="primary")
    .wifi-analytics(v-else)
      v-layout(row wrap)
        v-flex.px-2.py-2(xs12, md4, sm4)
          collection-satistics(
            :total="analyticsData.connections_total"
            :data="analyticsData.connection_by_provider"
          )
        v-flex.px-2.py-2(xs12, md4, sm4)
          email-collected(
            :value="analyticsData.emails_collected"
          )
        v-flex.px-2.py-2(xs12, md4, sm4)
          visited-sites(
            :sites="analyticsData.top5_visited_sites"
          )
      v-layout(row wrap)
        v-flex.px-2.py-2(xs12, md6, sm6)
          type-of-product(
            :type="'os'",
            :data='analyticsData.operation_systems || []',
            :bgImg="require('./images/chart-os-bg.png')"
          )
        v-flex.px-2.py-2(xs12, md6, sm6)
          type-of-product(
            :type="'device'",
            :data='analyticsData.device_types || []',
            :bgImg="require('./images/chart-device-bg.png')"
          )

    export-dialog(
      :show="showExportDialog"
      :can-manage="true"
      @close="showExportDialog = false"
    )
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import ManageableNodesMixin from '@/mixins/manageable-nodes.mixin'
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'

import NodeSelect from '@/components/common/node-select'
import collectionSatistics from './collection-satistics'
import emailCollected from './email-collected'
import visitedSites from './visited-sites'
import typeOfProduct from './type-of-product'

import exportDialog from './export-dialog'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  mixins: [
    ManageableNodesMixin,
    UserPermissionsMixin
  ],

  components: {
    NodeSelect,
    collectionSatistics,
    emailCollected,
    visitedSites,
    typeOfProduct,
    exportDialog
  },
  beforeMount () {
    if (this.$route.params.nodeId) {
      this.fetchAnalyticsData()
    }
  },
  watch: {
    '$route.params.nodeId' () {
      this.fetchAnalyticsData()
    },
    selectedTime (v) {
      this.fetchAnalyticsData()

      EventTracker.sendEvent(EVENT_NAMES.PORTAL_ANALYTICS_TIME_RANGE_CHANGED)
    }
  },
  computed: {
    ...mapGetters('layout', ['selectedNode']),
    getAppFeatures: function () {
      return process.env.VUE_APP_FEATURES
    }
  },
  methods: {
    ...mapActions('organization/node', ['fetchAnalytics']),
    fetchAnalyticsData () {
      this.loading = true
      this.fetchAnalytics({ nodeId: this.$route.params.nodeId, timeLine: this.selectedTime }).then(response => {
        this.analyticsData = response && response.data && response.data.data ? response.data.data : {}
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    isRouteActive (input) {
      return this.$route.name === input
    },
    openPage (route) {
      this.$router.push({ name: route })
    }
  },
  data () {
    return {
      nodeFilters: {
        types: 'organization,group,site'
      },
      times: [
        { value: 'last_day', text: this.$t('general.lastDay') },
        { value: 'last_week', text: this.$t('general.lastWeek') },
        { value: 'last_month', text: this.$t('general.lastMonth') },
        { value: 'all_time', text: this.$t('general.allTime') }
      ],
      selectedTime: 'last_month',
      analyticsData: {},
      loading: false,
      showExportDialog: false
    }
  }
}

</script>

<style lang="scss">
@import "styles/layout.scss";
@import "styles/colors.scss";

.monitoring-page {
  margin-top: 40px;
  @media (min-width: 768px) and (max-width: 1024px) {
    margin-top: 20px;
  }
  @media (max-width: 767px) {
    margin-top: 0;
  }
  a {
    &.tab {
      padding: 5px;
      margin-right: 30px;
      position: relative;

      span {
        font-family: 'Fira Sans', sans-serif;
        color: $deemed-gray;
      }

      &.active {
        span {
          color: $black;
        }

        &:after {
          width: 30px;
          height: 4px;
          background: $green;
          content: ' ';
          position: absolute;
          bottom: -7px;
          left: 5px;
        }
      }
    }
  }

  .form-card {
    width: 100%;
    padding: 30px 30px 25px;
    background: white;
    box-shadow: 5px 10px 20px 0px rgba(206, 211, 218, 0.3);
    border-radius: 5px;
    @media (max-width: 1300px) {
      padding: 30px 10px 25px;
    }
    @media (max-width: 767px) {
      padding: 30px 30px 25px;
    }
    h4.card-title {
      font-weight: 600;
      font-size: 14px;
      color: #000;
    }

    .v-icon {
      width: 0.7em !important;
    }

    &.x2 {
      height: 249px;
      @media (max-width: 767px) {
        height: unset;
      }
    }
    &.x3 {
      height: 274px;
      @media (max-width: 767px) {
        height: unset;
      }
    }
  }

  .mb-2 {
    margin-bottom: 0!important;
  }
  .mb-3 {
    margin-bottom: 20px !important;
  }
  .mb-4 {
    margin-bottom: 10px !important;
  }
  .mb-5 {
    margin-bottom: 40px !important;
  }

  @media (min-width: 1690px) {
    font-size: 15px;
  }

  @media (max-width: 1680px) {
    font-size: 14px;

    .form-card {
      &.x3 {
        max-width: 29.9em !important;
      }
    }
  }

  @media (max-width: 1440px) {
    font-size: 13px;
  }

  @media (max-width: 1366px) {
    font-size: 12px;
  }

  @media (max-width: 767px) {
    .form-card {
      &.x3 {
        max-width: 100% !important;
      }
    }
  }

  @media (max-width: 1280px) {
    font-size: 12px;
  }

  @media (max-width: 1024px) {
    font-size: 12px;
  }
  .wifi-analytics-progress {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
  }
}

</style>
