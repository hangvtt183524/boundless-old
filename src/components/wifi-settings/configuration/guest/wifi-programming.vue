<template lang="pug">
  .wifi-programming
    v-layout.header-section(row wrap)
      h3.small-heading.py-3
        | {{ $t('organization.wifiProgramming') }}

      base-switch(
        data-test="enable-switch",
        color="deep-purple lighten-2",
        v-model="enableWifiProgramming"
      )

    v-layout(row wrap v-if="enableWifiProgramming")
      v-flex(xs12)
        v-data-table(
          data-test="programming-table"
          :items='rows'
          :total-items="7"
        )
          template(slot='headers')
            tr
              th(class='column text-xs-left') {{ $t('general.day') }}
              th(class='column text-xs-left') {{ $t('general.status') }}
              th(class='column text-xs-left')
                v-select.schedule-select(
                  data-test="schedule-template"
                  :items='scheduleTemplateList'
                  v-model="scheduleTemplate"
                  @change="onChangeScheduleTemplate"
                  hide-details
                )
              th(class='column text-xs-left') {{ $t('general.action') }}

          template(slot='items', slot-scope='props')
            td(:data-test="props.item.weekday") {{ props.item.day }}
            td
              div.circle-status(
                :class="{'active' : props.item.status == 'general.active'}"
                @click="updateStatus(props.item)"
              )
                v-icon fas fa-circle
                span {{ $t(props.item.status) }}
            td.time-range
              slider-wrapper(
                :index="props.item.day"
                :value="props.item.time_range_array"
                :label-formatter="labelFormatter"
                :tooltip-formatter="tooltipFormatter"
                :process = "props.item.process"
                :order="false"
                :tooltip="'focus'"
                :interval="0.5"
                :options="{ min: 0, max: 24, interval: 0.5, disabled: props.item.status === 'general.disabled' }"
                @callback="changeSliderValue"
              )
            td.text-xs-center
              v-tooltip(top color="#9aa9c4" light)
                template(v-slot:activator="{ on }")
                  button.edit-btn(
                    :class="{'disabled-btn' : props.item.status === 'general.disabled'}"
                    :disabled="props.item.status === 'general.disabled'"
                    v-on="on"
                    @click="openEditScheduleDialog(props.item, props.index)")
                    v-icon edit
                span {{ $t('wifi.editSchedule') }}
    edit-schedule-dialog(
      :show="showEditScheduleDialog"
      :selectedSchedule="selectedSchedule"
      @save="saveSchedule"
      @close="closeEditScheduleDialog")
</template>
<script>
import timeArray from '@/utils/time-array'

import SliderWrapper from '@/components/common/slider-wrapper'
import CurrentUserMixin from '@/mixins/current-user.mixin'
import editScheduleDialog from './edit-schedule-dialog'

export default {
  components: {
    SliderWrapper,
    editScheduleDialog
  },
  mixins: [
    CurrentUserMixin
  ],
  props: {
    scheduleActive: {
      type: Boolean,
      default: false
    },
    schedule: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      enableWifiProgramming: false,
      headers: [
        { text: this.$t('general.day'), value: 'day', sortable: false, width: 100 },
        { text: this.$t('general.status'), value: 'status', sortable: false, width: 100 },
        { text: this.$t('general.status'), value: 'status', sortable: false, width: 100 },
        { text: 'Action', value: 'edit', sortable: false }
      ],
      rows: [],
      timeList: timeArray,
      scheduleTemplateList: [
        { text: this.$t('wifi.availableDaily'), value: 'worktime' },
        { text: this.$t('wifi.availableWeekdays'), value: 'weekdays' },
        { text: this.$t('wifi.alwaysAvailable'), value: 'always' },
        { text: this.$t('wifi.customSchedule'), value: 'custom' }
      ],
      scheduleTemplate: 'custom',
      showEditScheduleDialog: false,
      selectedSchedule: null,
      backgroundList: [
        '#AA85D9', '#71B0FF', '#65D965'
      ]
    }
  },
  watch: {
    enableWifiProgramming (v) {
      if (v) {
        this.makeRequest()
        if (this.schedule.length === 0) {
          this.onChangeScheduleTemplate('default')
        }
      } else if (this.schedule.length !== 0) {
        this.makeRequest()
      }
    },
    scheduleActive (v) {
      this.getData()
    },
    schedule () {
      this.getData()
    },
    rows: {
      handler: global._.debounce(function (val) {
        this.scheduleTemplate = 'custom'
      }, 1000),
      deep: true
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      let rowsData = [
        { day: this.$t('general.days.sunday'), weekday: 'sunday', status: 'general.active', edit: '' },
        { day: this.$t('general.days.monday'), weekday: 'monday', status: 'general.active', edit: '' },
        { day: this.$t('general.days.tuesday'), weekday: 'tuesday', status: 'general.active', edit: '' },
        { day: this.$t('general.days.wednesday'), weekday: 'wednesday', status: 'general.active', edit: '' },
        { day: this.$t('general.days.thursday'), weekday: 'thursday', status: 'general.active', edit: '' },
        { day: this.$t('general.days.friday'), weekday: 'friday', status: 'general.active', edit: '' },
        { day: this.$t('general.days.saturday'), weekday: 'saturday', status: 'general.active', edit: '' }
      ]

      this.schedule.map(item => {
        const timeRange = item.time_range.map(range => {
          const valueRange = range.map(time => {
            const value = this.timeList.find(timeValue => time.startsWith(timeValue.text)).value
            return value
          })
          return valueRange
        })
        var merged = [].concat.apply([], timeRange)
        const index = rowsData.map(row => row.weekday).indexOf(item.weekday)
        if (index !== -1) {
          let rowData = rowsData[index]
          rowData.status = item.available ? 'general.active' : 'general.disabled'
          rowData.time_range_array = merged
          rowData.time_range = item.time_range
          rowData.dotOptions = merged.map(row => {
            return { disabled: true }
          })
          rowData.process = this.setProcess(rowData.time_range)
          rowsData[index] = rowData
        }
      })
      rowsData.map(row => {
        if (!row.time_range) {
          row.time_range = []
          row.time_range_array = []
        }
        return row
      })
      this.enableWifiProgramming = this.scheduleActive
      this.rows = rowsData
      this.sortWeekDays()
    },
    setProcess (data) {
      let process = null
      if (data) {
        process = (dotsPos) => {
          const proc = data.map((item, index) => {
            return [dotsPos[index * 2], dotsPos[index * 2 + 1], { backgroundColor: this.backgroundList[index] }]
          })
          return proc
        }
      }
      return process
    },
    onChangeScheduleTemplate (value) {
      if (value === 'default') {
        this.rows = this.rows.map(item => ({
          ...item,
          status: 'general.active',
          time_range: [['00:00', '23:59']],
          time_range_array: [0, 24]
        }))
      } else if (value === 'worktime') {
        this.rows = this.rows.map(item => ({
          ...item,
          status: 'general.active',
          time_range: [['08:00', '18:00']],
          time_range_array: [8, 18]
        }))
      } else if (value === 'weekdays') {
        this.rows = this.rows.map(item => {
          if (item.day === this.$t('general.days.saturday') || item.day === this.$t('general.days.sunday')) {
            return ({
              ...item,
              status: 'general.disabled',
              time_range: [['08:00', '18:00']],
              time_range_array: [8, 18]
            })
          } else {
            return ({
              ...item,
              status: 'general.active',
              time_range: [['08:00', '18:00']],
              time_range_array: [8, 18]
            })
          }
        })
      } else if (value === 'always') {
        this.rows = this.rows.map(item => ({
          ...item,
          status: 'general.active',
          time_range: [['00:00', '24:00']],
          time_range_array: [0, 24]
        }))
      }
      this.makeRequest()
    },
    sortWeekDays () {
      if (this.profile.first_day_of_week) {
        const sundayValue = this.rows.find(item => item.weekday === 'sunday')
        if (sundayValue) {
          this.rows.splice(0, 1)
          this.rows.splice(6, 0, sundayValue)
        }
      }
    },
    labelFormatter (value) {
      if (value % 4 === 0) {
        return (value < 10 ? '0' : '') + value + ':00'
      }
      return ''
    },
    tooltipFormatter (value) {
      const timeText = this.timeList.find(timeValue => timeValue.value === value).text
      // if (value === 24) {
      //   return '23:59'
      // }
      // const hours = Math.floor(value)
      // const mins = (value - hours) * 60

      // return (hours < 10 ? '0' : '') + hours + ':' + (mins === 0 ? '00' : mins)
      return timeText
    },
    saveSchedule (item) {
      this.rows[item.index] = global._.cloneDeep(item)
      this.showEditScheduleDialog = false
      this.makeRequest()
    },
    makeRequest () {
      const schedule = this.rows.map(item => {
        let available = false
        if (item.status === 'general.active') {
          available = true
        }
        const timeRange = item.time_range.map(timeTextArray => {
          const formatedTextArray = timeTextArray.map(time => time.substring(0, 5))
          return formatedTextArray
        })
        return { weekday: item.weekday, available, time_range: timeRange }
      })
      const scheduleActive = this.enableWifiProgramming
      this.$emit('change', { schedule, schedule_active: scheduleActive })
    },
    updateStatus (item) {
      if (item.status === 'general.active') {
        item.status = 'general.disabled'
      } else {
        item.status = 'general.active'
      }
      this.makeRequest()
    },
    closeEditScheduleDialog () {
      this.showEditScheduleDialog = false
    },
    openEditScheduleDialog (item, index) {
      this.showEditScheduleDialog = true
      this.selectedSchedule = Object.assign({
        index
      }, item)
    },
    changeSliderValue (item) {
      const rowIndex = this.rows.map(row => row.day).indexOf(item.index)

      for (var ind = 0; ind < item.value.length / 2; ind++) {
        if (item.value[ind * 2] > item.value[ind * 2 + 1]) {
          const temp = item.value[ind * 2]
          item.value[ind * 2] = item.value[ind * 2 + 1]
          item.value[ind * 2 + 1] = temp
        }
      }

      item.value.map((value, index) => {
        this.rows[rowIndex].time_range_array[index] = value
        this.rows[rowIndex].time_range[parseInt(index / 2)][index % 2] = this.tooltipFormatter(value)
      })
      this.makeRequest()
    }
  }
}
</script>

<style lang="scss">
@import "styles/colors.scss";
.wifi-programming {
  .schedule-layout {
    background: #fff;
    border-radius: 6px;
    padding: 10px 20px;
  }
  .schedule-select {
    padding: 0px !important;
    width: 300px;
    height: 32px !important;
    .v-input__slot {
      &:before {
        border: none !important;
      }
      .v-select__selection {
        color: #9AA9C4;
      }
    }
  }
  .v-table {
    tr {
      .circle-status {
        display: flex;
        align-items: center;
        cursor: pointer;
        min-width: 70px;

        .v-icon {
          font-size: 10px;
          color: $red !important;
          margin-right: 5px;
        }

        &.active .v-icon {
          color: $green !important;
        }
      }

      &:hover {
        .circle-status {

          .v-icon {
            color: $red !important;
          }

          span {
            color: $red !important;
          }

          &.active .v-icon {
            color: $green !important;
          }

          &.active span {
            color: $blue !important;
          }
        }
      }
      .time-range {
        width: 100%;
      }
      .edit-btn {
        background: $primary;
        color: #FFF;
        padding: 4px;
        border-radius: 4px;
        cursor: pointer;
        .v-icon {
          font-size: 20px;
          color: #FFF !important;
        }
        &.disabled-btn {
          background: #d8deeb;
          cursor: not-allowed;
          .v-icon {
            color: #989da2 !important;
          }
        }
      }
    }
  }
  .time-range-tooltip {
    color: #9AA9C4;
    font-size: 10px;
  }
  .vue-slider {
    .vue-slider-mark {
      top: 60%;
      font-size: 10px;
      .vue-slider-piecewise-label {
        line-height: 30px;
      }
      .vue-slider-mark-step {
        width: 1px;
        &.vue-slider-mark-step-active {
          background: #D8DEEB;
        }
      }
    }
    .vue-slider-dot-tooltip-top {
      top: -2px;
    }
    .vue-slider-piecewise-dot {
      top: 50% !important;
      background-color: #D8DEEB !important;
      height: 14px !important;
      z-index: 1;
    }
    .vue-slider-tooltip-wrap.vue-slider-tooltip-top {
      top: 0;
    }
    .vue-slider-process {
      z-index: 3;
    }
  }
}
</style>
