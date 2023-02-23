<template lang="pug">
  .page-content.camera-page
    .camera-analytics-progress(v-if="loading")
      v-progress-circular(:size="50" indeterminate color="primary")
    .camera-analytics-data(v-show="!loading")
      v-layout.page-header.mt-3(row wrap)
        v-flex.mx-2(xs12, sm5, md5, lg5)
          v-select(
            :items='cameraList'
            v-model='selectedCamera'
            label="Select Camera"
            item-text="text"
            item-value="value"
          )
        v-flex.mx-2.datetime-container(xs12, sm6, md6, lg4)
          date-time-range(
            v-model="dateTime"
            ref="dateTimeRange"
          )
      v-layout(row wrap)
        label.mx-2.section-title {{ $t('camera.cameraStats') }}
      v-layout(row wrap)
        v-flex.py-2.camera-stats__left-section(xs12, sm7)
          v-layout(row wrap)
            cameraData(
              :data="cameraData"
            )
            dailySnapshot.camera-stats__daily-snapsot(
              :data="dailyOverview"
            )
        v-flex.py-2(xs12, sm5)
          viewSnapshot(
            :url="liveSnapshot"
            :fetching="fetchingSnapshot"
          )
      v-layout(
        row wrap
        v-if="zonesData.length > 0"
      )
        label.mx-2.pt-5.section-title {{ $t('camera.statsByZone') }}
      v-layout(row wrap)
        v-flex.px-2.py-2(
          xs12
          sm4
          v-for="(item, index) in zonesData"
          :key="index"
        )
          zoneData(
            :data="item"
          )
</template>

<script>
import { mapActions } from 'vuex'

import cameraData from './cameraData'
import dailySnapshot from './dailySnapshot'
import viewSnapshot from './viewSnapshot'
import zoneData from './zoneData'
import DateTimeRange from '../../common/date-time-range/date-time-range'

export default {
  components: {
    DateTimeRange,
    cameraData,
    dailySnapshot,
    viewSnapshot,
    zoneData
  },

  data () {
    return {
      cameraList: [],
      cameraData: {},
      zonesData: [],
      selectedCamera: '',
      dateTime: [],
      loading: false,
      liveIntervalID: null,
      snapshotTimeoutId: null,
      liveSnapshot: null,
      fetchingSnapshot: false,
      delayTime: 10000,
      dailyOverview: []
    }
  },

  beforeMount () {
    if (this.$route.params.nodeId) {
      this.fetchCameraList()
    }
  },

  beforeDestroy () {
    if (this.liveIntervalID) {
      clearInterval(this.liveIntervalID)
    }
  },

  mounted () {
    // Set initial date range as 1 day before
    this.$refs.dateTimeRange.selectRelativeValue(1, 'day')
  },

  methods: {
    ...mapActions('organization/camera', ['fetchCameras', 'fetchCameraAnalytics', 'fetchCameraLive',
      'fetchCameraDailyOverview', 'fetchCameraSnapshot']),

    fetchCameraList () {
      this.loading = true
      this.fetchCameras(this.$route.params.nodeId).then(response => {
        this.cameraList = response.results.map(item => {
          return {
            value: item.id,
            text: `${item.name}`
          }
        })
        if (this.cameraList.length > 0) {
          this.selectedCamera = this.cameraList[0].value
        } else {
          this.selectedCamera = ''
        }
        this.loading = false
      }).catch(err => {
        this.selectedCamera = ''
        this.loading = false
        console.log(err)
      })
    },

    fetchCameraAnalyticsData () {
      if (!this.selectedCamera) {
        return false
      }

      const startDateTime = this.dateTime[0] ? this.$moment(this.dateTime[0]).format('YYYY-MM-DDTHH:mm:ss') : this.$moment().format('YYYY-MM-DDTHH:mm:ss')
      const endDateTime = this.dateTime[1] ? this.$moment(this.dateTime[1]).format('YYYY-MM-DDTHH:mm:ss') : this.$moment().format('YYYY-MM-DDTHH:mm:ss')

      this.fetchCameraAnalytics({ id: this.selectedCamera, startDateTime, endDateTime }).then(response => {
        this.parseCameraData(response)
      }).catch(err => {
        if (err.response && err.response.data && err.response.data.error && err.response.data.error.detail) {
          const errorDetail = err.response.data.error.detail[0]
          if (errorDetail && errorDetail.code) {
            if (errorDetail.code === 'meraki_mv_sense_not_enabled') {
              // Mv sense not enabled for this camera
              global.toastr['error'](this.$t('camera.mvSenseNotEnabled'), this.$t('general.error'))

              if (this.liveIntervalID) {
                clearInterval(this.liveIntervalID)
              }

              this.resetAnalyticsData()
            }
          }
        }
        console.log(err)
      })

      this.fetchCameraDailyOverview(this.selectedCamera).then(response => {
        this.dailyOverview = response
      }).catch(err => {
        console.log(err)
      })
    },

    fetchCameraLiveData () {
      if (!this.selectedCamera) {
        return false
      }

      this.fetchCameraLive(this.selectedCamera).then(response => {
        this.parseCameraData(response)
      }).catch(err => {
        console.log(err)
      })
      this.fetchingSnapshot = true
      this.fetchCameraSnapshot(this.selectedCamera).then(response => {
        this.loadSnapshotImage(response.url, 0)
      }).catch(err => {
        this.fetchingSnapshot = false
        // this.liveSnapshot = require('../../../assets/images/placeholder.jpg')
        console.log(err)
      })
    },

    startCameraAnalytics () {
      // Clear any existing intervals for live camera data
      if (this.liveIntervalID) {
        clearInterval(this.liveIntervalID)
      }

      if (this.snapshotTimeoutId) {
        clearTimeout(this.snapshotTimeoutId)
      }

      this.resetAnalyticsData()

      this.fetchCameraAnalyticsData()
      this.fetchCameraLiveData()

      // Keep fetching live camera data in an interval
      this.liveIntervalID = window.setInterval(this.fetchCameraLiveData, this.delayTime)
    },

    loadSnapshotImage (imageUrl, tryCount) {
      // Workaround for Meraki API's problem, that the image is not available immediately after being generated,
      // but becomes available after several seconds
      const img = new Image()
      img.onload = function () {
        this.fetchingSnapshot = false
        this.liveSnapshot = imageUrl
      }.bind(this)
      img.onerror = function () {
        if (tryCount < 4) {
          // Try again
          this.snapshotTimeoutId = setTimeout(function () {
            this.loadSnapshotImage(imageUrl, tryCount + 1)
          }.bind(this), 2000)
        } else {
          this.fetchingSnapshot = false
          // this.liveSnapshot = require('../../../assets/images/placeholder.jpg')
        }
      }.bind(this)
      img.src = imageUrl
    },

    parseCameraData (response) { // Merge original data and live data
      const liveCamera = response.find(item => item.zone_id === 0) || {}
      this.cameraData = {
        ...this.cameraData,
        ...liveCamera
      }
      const liveZones = response.filter(item => item.zone_id)
      liveZones.map((zone, index) => {
        this.zonesData[index] = {
          ...this.zonesData[index],
          ...zone
        }
      })
    },

    resetAnalyticsData () {
      this.cameraData = {}
      this.zonesData = []
      this.fetchingSnapshot = false
      this.liveSnapshot = null
      this.dailyOverview = []
    }
  },

  watch: {
    '$route.params.nodeId' () {
      this.dateTime = []
      this.fetchCameraList()
    },

    dateTime (value, oldValue) {
      if (value.length === 2) {
        this.startCameraAnalytics()
      }
    },

    selectedCamera (value, oldValue) {
      if (value) {
        this.startCameraAnalytics()
      }
    }
  }
}
</script>

<style lang="scss">
@import "styles/colors.scss";
.camera-page {
  .camera-analytics-progress {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 500px;
  }
  .page-header {
    justify-content: space-between;
    .datetime-container {
      margin-top: 25px;
    }
  }
  label.section-title {
    font-size: 14px;
    color: #000;
    font-weight: 600;
    font-family: "Fira Sans";
  }
  .camera-stats {
    &__left-section {
      padding-right: 20px;
    }
    &__daily-snapsot {
      margin-top: 20px;
    }
  }
  .blue-text {
    color: $blue;
  }
  .deemed-blue-text {
    color: $deemed-blue;
  }
  .purple-text {
    color: $purple;
  }
  .red-text {
    color: $red;
  }
  .form-card {
    width: 100%;
    padding: 20px 30px;
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
  }
}
</style>
