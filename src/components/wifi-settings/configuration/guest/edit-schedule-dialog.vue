<template lang="pug">
  base-dialog(
    :show="show"
    @close="close"
    scrollable
  )
    .wifi-programming.edit-schedule-dialog(data-test="edit-schedule-dialog")
      h2.edit-schedule-heading.py-2 {{ currentSchedule.day }} {{ $t('wifi.timeSchedule') }}
      span.comment {{ $t('wifi.limitNote', { limit: timeRangeLimit }) }}
      v-layout(mt-5)
        slider-wrapper(
          :value="currentSchedule.time_range_array"
          :label-formatter="labelFormatter"
          :interval="0.5"
          :tooltip-formatter="formatTime"
          :tooltip="'focus'"
          :process="process"
          :order="false"
          :options="{ min: 0, max: 24}"
          @callback="changeSliderValue"
        )
      v-layout.mt-4(column)
        v-flex.schedules-container
          schedule-selector(
            v-for="(item, index) in currentSchedule.time_range"
            :key="index"
            :index="index"
            :startTime="currentSchedule.time_range_array[index * 2]"
            :endTime="currentSchedule.time_range_array[index * 2 + 1]"
            :background="backgroundList[index]"
            @change="changeScheduleTime"
            @remove="removeScheduleTime"
          )

        v-flex.v-flex(justify-start, mt-4)
          // v-tooltip(top color="#9aa9c4" light)
          //   template(v-slot:activator="{ on }")
          //     button.add-schedule-button(
          //       data-test="btn-add-org"
          //       @click="addSchedule"
          //       :disabled="currentSchedule.time_range.length === timeRangeLimit"
          //       :class="{'disabled-button': currentSchedule.time_range.length === timeRangeLimit}"
          //       v-on="on"
          //     )
          //       .circle-container
          //         v-icon(small) fas fa-plus
          //   span {{ 'Add Time Range' }}
          button.add-schedule-button(
            data-test="btn-add-org"
            @click="addSchedule"
            :disabled="currentSchedule.time_range.length === timeRangeLimit"
            :class="{'disabled-button': currentSchedule.time_range.length === timeRangeLimit}"
          )
            .circle-container
              v-icon(small) fas fa-plus

      v-layout.mt-4(row)
        v-flex.text-xs-right.pb-3.pr-2(sm-2)
          v-btn(
            data-test="btn-invite"
            color='success'
            large
            round
            @click="saveSchedule"
          ) {{ $t('wifi.saveSchedule') }}
</template>

<script>
import timeArray from '@/utils/time-array'
import SliderWrapper from '@/components/common/slider-wrapper'
import ScheduleSelector from '@/components/common/schedule-selector'

export default {
  components: {
    SliderWrapper,
    ScheduleSelector
  },
  props: ['show', 'selectedSchedule'],
  watch: {
    selectedSchedule (v) {
      this.currentSchedule = global._.cloneDeep(v)
      this.setProcess()
    }
  },
  data () {
    return {
      isEditing: false,
      backgroundList: [
        '#AA85D9', '#71B0FF', '#65D965'
      ],
      currentSchedule: null,
      process: null,
      timeRangeLimit: 3,
      timeList: timeArray
    }
  },
  mounted () {
    this.currentSchedule = global._.cloneDeep(this.selectedSchedule)
  },
  methods: {
    setProcess () {
      if (this.currentSchedule && this.currentSchedule.time_range) {
        this.process = (dotsPos) => {
          const proc = this.currentSchedule.time_range.map((item, index) => {
            return [dotsPos[index * 2], dotsPos[index * 2 + 1], { backgroundColor: this.backgroundList[index] }]
          })
          return proc
        }
      } else {
        this.process = null
      }
    },
    labelFormatter (value) {
      if (value % 4 === 0) {
        return (value < 10 ? '0' : '') + value + ':00'
      }
      return ''
    },
    formatTime (value) {
      const timeText = this.timeList.find(timeValue => timeValue.value === value).text
      return timeText
    },
    addSchedule () {
      this.currentSchedule.time_range.splice(this.currentSchedule.time_range.length, 0, ['08:00:00', '18:00:00'])
      this.currentSchedule.time_range_array.splice(this.currentSchedule.time_range_array.length, 0, 8, 18)
      this.currentSchedule.dotOptions.splice(this.currentSchedule.dotOptions.length, 0, { disabled: true }, { disabled: true })
      this.setProcess()
    },
    changeScheduleTime (startTime, endTime, index) {
      this.currentSchedule.time_range.splice(index, 1, [this.formatTime(startTime), this.formatTime(endTime)])
      this.currentSchedule.time_range_array.splice(index * 2, 2, startTime, endTime)
    },
    changeSliderValue (item) {
      let timeRange = []
      let backupTimeRange = []
      let timeRangeValue = []

      for (var ind = 0; ind < item.value.length / 2; ind++) {
        if (item.value[ind * 2] > item.value[ind * 2 + 1]) {
          const temp = item.value[ind * 2]
          item.value[ind * 2] = item.value[ind * 2 + 1]
          item.value[ind * 2 + 1] = temp
        }
      }

      item.value.map((value, index) => {
        if (index % 2 === 0) {
          backupTimeRange = []
        }
        timeRangeValue.splice(index, 0, value)
        backupTimeRange.splice(index % 2, 0, this.formatTime(value))
        if (index % 2 === 1) {
          timeRange.splice(parseInt(index / 2), 0, backupTimeRange)
        }
      })
      this.currentSchedule.time_range = global._.cloneDeep(timeRange)
      this.currentSchedule.time_range_array = global._.cloneDeep(timeRangeValue)
    },
    removeScheduleTime (index) {
      this.currentSchedule.time_range.splice(index, 1)
      this.currentSchedule.time_range_array.splice(index * 2, 2)
      this.currentSchedule.dotOptions.splice(index * 2, 2)
      this.setProcess()
    },
    saveSchedule () {
      this.currentSchedule.process = this.process
      this.$emit('save', this.currentSchedule)
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss">
  .edit-schedule-dialog {
    .edit-schedule-heading {
      font-size: 21px;
      font-weight: 600;
      color: #354C77;
    }
    .comment {
      font-size: 14px;
      color: #9AA9C4;
    }
    .schedules-container {
      width: 50%;
    }
  }
</style>
