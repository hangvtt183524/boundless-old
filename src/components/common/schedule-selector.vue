<template lang="pug">
  v-layout.schedules(row mb-3)
    .range-color(
      :style="{'background': background }"
    )
    v-select.start-time-list(
      data-test="schedule-template"
      :items="startTimeList"
      v-model="startTimeValue"
      @change="onChangeStartTime"
      :label="$t('general.from')"
      hide-details
    )

    v-select.end-time-list(
      data-test="schedule-template"
      :items="endTimeList"
      v-model="endTimeValue"
      @change="onChangeEndTime"
      :label="$t('general.to')"
      hide-details
    )

    .close-icon(@click="onRemoveSchedule" :style="{'visibility': index === 0 ? 'hidden' : 'visible'}")
      v-icon close
</template>

<script>
import timeArray from '@/utils/time-array'
export default {
  props: ['startTime', 'endTime', 'background', 'index'],
  data () {
    return {
      startTimeValue: 0,
      endTimeValue: 24,
      timeList: timeArray
    }
  },
  computed: {
    startTimeList () {
      return this.timeList.filter(time => time.value < this.endTimeValue)
    },
    endTimeList () {
      return this.timeList.filter(time => time.value > this.startTimeValue)
    }
  },
  watch: {
    startTime (v) {
      this.startTimeValue = v
    },
    endTime (v) {
      this.endTimeValue = v
    }
  },
  mounted () {
    this.startTimeValue = this.startTime
    this.endTimeValue = this.endTime
  },
  methods: {
    onChangeStartTime () {
      this.$emit('change', this.startTimeValue, this.endTimeValue, this.index)
    },
    onChangeEndTime () {
      this.$emit('change', this.startTimeValue, this.endTimeValue, this.index)
    },
    onRemoveSchedule () {
      this.$emit('remove', this.index)
    }
  }
}
</script>

<style lang="scss">
  .schedules {
    align-items: center;
    .range-color {
      width: 40px;
      height: 4px;
      margin-top: 10px;
    }
    & > div {
      margin-right: 20px !important;
      &:last-child {
        margin-right: 0 !important;
      }
    }
    .close-icon {
      margin-top: 15px;
      cursor: pointer;
      i {
        color: #9AA9C4;
        &:hover {
          color: #000;
        }
      }
    }
  }
</style>
