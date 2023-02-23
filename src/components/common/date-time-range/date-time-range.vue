<template lang="pug">
  .daterange-picker(
    ref="datetimerange"
  )
    .daterange-picker-label {{ 'Time Range' }}
    .daterange-picker-toolbar
      ul.datepicker-quickpicks(v-if="!isCustomShow")
        li.datepicker-quickpick(
          v-for="quickPick in quickPickerList"
          @click="selectRelativeValue(quickPick.value, quickPick.type)"
          :class="quickPick.value === relativeValue && quickPick.type === relativeType ? 'datepicker-quickpick-selected' : ''"
        )
          a {{ quickPick.label }}
      .datepicker-quickpick
        a(@click="showHidePopup")
          .picker-custom-value(v-if="isCustomShow") {{ `${this.backupDateTime[0]} (${this.backupDateTime[1]}) - ${this.backupDateTime[2]} (${this.backupDateTime[3]})` }}
          span(
            :class="customLabel !== 'custom' ? 'picker-custom-value' : ''"
            v-if="!isCustomShow"
          ) {{ customLabel }}
          i.fa.fa-angle-down
    .daterange-picker-customize(v-show="isPopupShow")
      .customize-type-tabs
        .tab-item(
          :class="selectedTabItem === 0 ? 'tab-item-active' : ''"
          @click="selectTabItem(0)"
        )
          | {{ 'Absolute' }}
        .tab-item(
          :class="selectedTabItem === 1 ? 'tab-item-active' : ''"
          @click="selectTabItem(1)"
        )
          | {{ 'Relative' }}
      .daterange-picker-absolute-container(v-show="selectedTabItem === 0")
        .daterange-calendar-container
          calendar(
            :year="startCalendarYM.year",
            :month="startCalendarYM.month",
            :selectedDates="selectedDates",
            type='start'
            @changeMonth="changeMonth"
            @chooseDate="chooseDate"
          )
          calendar(
            :year="endCalendarYM.year",
            :month="endCalendarYM.month",
            :selectedDates="selectedDates",
            type='end'
            @changeMonth="changeMonth"
            @chooseDate="chooseDate"
          )
        .daterange-datetime-container
          v-layout(wrap row)
            v-flex(xs12, sm6, md6, lg6, pr-2)
              v-layout(wrap row)
                v-flex(xs12, sm6, md6, lg6, pr-2)
                  v-text-field(
                    v-model="startDate"
                    label="Start Date"
                    class="startDate"
                    :success-messages="['YYYY-MM-DD']" success
                    required
                  )
                v-flex(xs12, sm6, md6, lg6, pl-2)
                  v-text-field(
                    v-model="startTime"
                    label="Start Time"
                    class="startTime"
                    :success-messages="['hh:mm:ss']" success
                    required
                  )
            v-flex(xs12, sm6, md6, lg6, pl-2)
              v-layout(wrap row)
                v-flex(xs12, sm6, md6, lg6, pr-2)
                  v-text-field(
                    v-model="endDate"
                    label="End Date"
                    class="endDate"
                    :success-messages="['YYYY-MM-DD']" success
                    required
                  )
                v-flex(xs12, sm6, md6, lg6, pl-2)
                  v-text-field(
                    v-model="endTime"
                    label="End Time"
                    class="endTime"
                    :success-messages="['hh:mm:ss']" success
                    required
                  )
          v-layout(wrap row)
            v-flex(pt-2, pb-2)
              label.error-message {{ validationErrorMessage }}

        .daterange-action-button-container
          v-layout(row)
            v-flex.text-xs-right.pr-2(sm-2)
              v-btn(color='error', @click.stop='cancelDates') {{ 'Cancel' }}
              v-btn(
                :disabled="!isValidateDateTime"
                color='primary',
                @click.stop='applyDates'
              ) {{ 'Apply' }}

      .daterange-picker-relative-container(v-if="selectedTabItem === 1")
        .relative-row(
          v-for="relative in relativeValueList"
        )
          .relative-label {{ relative.label }}
          .relative-button-container
            .relative-button(
              v-for="value in relative.values"
              @click="selectRelativeValue(value, relative.type)"
              :class="value === relativeValue && relative.type === relativeType ? 'relative-button-active' : ''"
            ) {{ value }}
</template>

<script>
import Calendar from './calendar'
import Cleave from 'cleave.js'

export default {
  name: 'date-time-range',

  props: {
    value: {
      type: Array,
      default: function () { return [] }
    }
  },

  computed: {
    startCalendarYM () {
      const month = this.currentCalendarDate ? this.currentCalendarDate.month() : this.$moment().month()
      const year = this.currentCalendarDate ? this.currentCalendarDate.year() : this.$moment().year()
      const date = new Date(year, month - 1, 1)
      const moment = this.$moment(date)
      return {
        year: moment.year(),
        month: moment.month()
      }
    },

    endCalendarYM () {
      return {
        year: this.currentCalendarDate ? this.currentCalendarDate.year() : this.$moment().year(),
        month: this.currentCalendarDate ? this.currentCalendarDate.month() : this.$moment().month()
      }
    },

    isValidateDateTime () {
      return this.checkIfDateTimeValid()
    },

    isCustomShow () {
      return this.backupDateTime[0] && this.backupDateTime[1] && this.backupDateTime[2] && this.backupDateTime[3]
    },

    customLabel () {
      const pickupItem = this.quickPickerList.find(item => item.type === this.relativeType && item.value === this.relativeValue)
      if (pickupItem || !this.relativeType) {
        return 'custom'
      } else {
        const type = this.relativeValueList.find(item => item.type === this.relativeType)
        return `custom (${this.relativeValue}${type.shortLabel})`
      }
    }
  },

  components: {
    Calendar
  },

  data () {
    return {
      quickPickerList: [
        { label: '1h', value: 1, type: 'hour' },
        { label: '3h', value: 3, type: 'hour' },
        { label: '12h', value: 12, type: 'hour' },
        { label: '1d', value: 1, type: 'day' },
        { label: '3d', value: 3, type: 'day' },
        { label: '1w', value: 1, type: 'week' }
      ],
      currentCalendarDate: null,
      isPopupShow: false,
      selectedTabItem: 0,
      relativeType: '',
      relativeValue: 0,
      relativeValueList: [
        {
          type: 'minute',
          label: 'Minutes',
          shortLabel: 'm',
          unit: 'minutes',
          values: [1, 3, 5, 15, 30, 45]
        },
        {
          type: 'hour',
          label: 'Hours',
          shortLabel: 'h',
          unit: 'hours',
          values: [1, 2, 3, 6, 8, 12]
        },
        {
          type: 'day',
          label: 'Days',
          shortLabel: 'd',
          unit: 'days',
          values: [1, 2, 3, 4, 5, 6]
        },
        {
          type: 'week',
          label: 'Weeks',
          shortLabel: 'w',
          unit: 'weeks',
          values: [1, 2, 4, 6]
        },
        {
          type: 'month',
          label: 'Months',
          shortLabel: 'mo',
          unit: 'months',
          values: [3, 6, 12, 15]
        }
      ],
      calendarMonth: -1,
      calendarYear: -1,
      selectedDates: [],
      backupDateTime: ['', '', '', ''],
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      validationErrorMessage: ''
    }
  },

  created () {
    document.onclick = this.documentClick
  },

  mounted () {
    this.currentCalendarDate = this.$moment()
    this.calendarYear = this.currentCalendarDate.year()
    this.calendarMonth = this.currentCalendarDate.month()

    this.formatInputFields()
  },

  methods: {
    checkIfDateTimeValid () {
      if (!this.startDate && !this.startTime && !this.endDate && !this.endTime) return false

      if (!this.$moment(`${this.startDate} ${this.startTime}`, 'YYYY-MM-DD HH:mm:ss', true).isValid()) {
        this.validationErrorMessage = 'Start date-time is invalid.'
        return false
      }

      if (!this.$moment(`${this.endDate} ${this.endTime}`, 'YYYY-MM-DD HH:mm:ss', true).isValid()) {
        this.validationErrorMessage = 'End date-time is invalid.'
        return false
      }

      if (`${this.startDate} ${this.startTime}` > `${this.endDate} ${this.endTime}`) {
        this.validationErrorMessage = 'The end date must be after the start date.'
        return false
      }

      if (this.startDate > this.$moment().format('YYYY-MM-DD')) {
        this.validationErrorMessage = 'Range not supported.'
        return false
      }

      if (this.endDate > this.$moment().format('YYYY-MM-DD')) {
        this.validationErrorMessage = 'Range not supported.'
        return false
      }

      this.validationErrorMessage = ''
      return true
    },

    documentClick (e) {
      let el = this.$refs.datetimerange
      if (el) {
        let target = e.target
        if ((el !== target) && !el.contains(target)) {
          this.initDateTime()
        }
      }
    },

    formatInputFields () {
      const startDateInput = document.querySelector('.daterange-picker .daterange-picker-customize .daterange-datetime-container .startDate input')
      if (startDateInput) {
        const cleave = new Cleave(startDateInput, {
          date: true,
          delimiter: '-',
          datePattern: ['Y', 'm', 'd']
        })
        startDateInput.cleave = cleave
      }

      const startTimeInput = document.querySelector('.daterange-picker .daterange-picker-customize .daterange-datetime-container .startTime input')
      if (startTimeInput) {
        const cleave = new Cleave(startTimeInput, {
          time: true,
          timePattern: ['h', 'm', 's']
        })
        startTimeInput.cleave = cleave
      }

      const endDateInput = document.querySelector('.daterange-picker .daterange-picker-customize .daterange-datetime-container .endDate input')
      if (endDateInput) {
        const cleave = new Cleave(endDateInput, {
          date: true,
          delimiter: '-',
          datePattern: ['Y', 'm', 'd']
        })
        endDateInput.cleave = cleave
      }
    },

    selectRelativeValue (value, type) {
      this.relativeValue = value
      this.relativeType = type
      this.backupDateTime = []
      this.backupDateTime = ['', '', '', '']

      const relative = this.relativeValueList.find(item => item.type === type)
      const endDateTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
      const startDateTime = this.$moment().subtract(value, relative.unit).format('YYYY-MM-DD HH:mm:ss')
      this.$emit('input', [startDateTime, endDateTime])
      this.initDateTime()
    },

    selectTabItem (value) {
      this.selectedTabItem = value
    },

    showHidePopup () {
      this.isPopupShow = !this.isPopupShow
    },

    changeMonth (arrow) {
      const date = new Date(this.currentCalendarDate.year(), this.currentCalendarDate.month() + arrow, 1)
      this.currentCalendarDate = this.$moment(date)
    },

    chooseDate (year, month, day) {
      const selectedDate = this.$moment([year, month, day]).format('YYYY-MM-DD')
      if (this.selectedDates.length === 1) {
        const startDate = this.selectedDates[0]
        this.selectedDates = []
        this.selectedDates[0] = startDate
        this.selectedDates[1] = selectedDate

        if (this.selectedDates[0] > this.selectedDates[1]) {
          this.startDate = this.selectedDates[1]
          this.endDate = this.selectedDates[0]
        } else {
          this.startDate = this.selectedDates[0]
          this.endDate = this.selectedDates[1]
        }
        this.startTime = '00:00:00'
        this.endTime = '23:59:59'
      } else {
        this.selectedDates = []
        this.selectedDates[0] = selectedDate
      }
    },

    applyDates () {
      this.backupDateTime = []
      this.backupDateTime[0] = this.startDate
      this.backupDateTime[1] = this.startTime
      this.backupDateTime[2] = this.endDate
      this.backupDateTime[3] = this.endTime
      this.relativeValue = 0
      this.relativeType = ''
      this.$emit('input', [`${this.startDate} ${this.startTime}`, `${this.endDate} ${this.endTime}`])
      this.initDateTime()
    },

    cancelDates () {
      this.initDateTime()
    },

    initDateTime () {
      this.startDate = this.backupDateTime[0]
      this.startTime = this.backupDateTime[1]
      this.endDate = this.backupDateTime[2]
      this.endTime = this.backupDateTime[3]
      this.selectedDates = [
        this.backupDateTime[0],
        this.backupDateTime[2]
      ]
      this.validationErrorMessage = ''
      this.isPopupShow = false
    }
  }
}
</script>

<style lang="scss">
  .daterange-picker {
    display: flex;
    position: relative;
    z-index: 999;
    width: fit-content;
    font-size: 14px;
    font-family: "Helvetica Neue", Roboto, Arial, sans-serif;
    color: #000;
    .daterange-picker-label {
      font-weight: bold;
    }
    .daterange-picker-toolbar {
      display: flex;
      padding: 0 5px;
      .datepicker-quickpicks {
        display: inline-block;
        padding-left: 0;
      }
      .datepicker-quickpick {
        display: inline-block;
        padding: 0 5px;
        a {
          color: #000;
          text-decoration: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          i {
            margin-left: 10px;
          }
          .picker-custom-value {
            font-weight: bold;
            color: #16b;
          }
          &:hover {
            color: #16b;
          }
        }
        &.datepicker-quickpick-selected {
          a {
            color: #16b;
            font-weight: bold;
          }
        }
      }
    }
    .daterange-picker-customize {
      position: absolute;
      width: 545px;
      border-radius: 4px;
      background-color: #f8fafc;
      box-shadow: 0 1px 4px 0 #444;
      color: #fff;
      top: 30px;
      right: 10px;
      padding: 20px 20px 10px;
      .customize-type-tabs {
        display: flex;
        margin-bottom: 20px;
        .tab-item {
          font-weight: bold;
          color: #000;
          background: transparent;
          padding: 0;
          margin-right: 20px;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          &:hover {
            color: #4c83f0;
          }
          &.tab-item-active {
            color: #4c83f0;
            border-bottom-color: #4c83f0;
          }
        }
      }
      .daterange-picker-absolute-container {
        .daterange-calendar-container {
          display: flex;
          justify-content: space-between;
          color: #222;
        }
        .daterange-datetime-container {
          border-bottom: 1px solid #e2e7f0;
          .v-input {
            &.success--text {
              color: #4c83f0 !important;
              caret-color: #4c83f0 !important;
            }
            input {
              color: #222;
            }
            .success--text {
              color: #999 !important;
            }
          }
          .error-message {
            color: #f32e2e;
          }
        }
        .daterange-action-button-container {
          padding-top: 10px;
        }
      }
      .daterange-picker-relative-container {
        padding-bottom: 10px;
        .relative-row {
          display: flex;
          align-items: center;
          color: #222;
          padding: 15px 0;
          &:first-child {
            padding-top: 0;
          }
          &:last-child {
            padding-bottom: 0;
          }
          .relative-label{
            font-weight: bold;
            display: inline-block;
            padding-right: 15px;
            width: 70px;
          }
          .relative-button-container {
            display: flex;
            .relative-button {
              width: 40px;
              height: 28px;
              background-color: transparent;
              color: #222;
              border: 1px solid #c1c1c1;
              font-weight: bold;
              border-radius: 4px;
              margin: 0 5px;
              line-height: 26px;
              text-align: center;
              cursor: pointer;
              &.relative-button-active {
                background-color: #4c83f0;
                color: #FFF;
              }
              &:hover {
                background-color: #4c83f0;
                color: #FFF;
              }
            }
          }
        }
      }
    }
  }
</style>
