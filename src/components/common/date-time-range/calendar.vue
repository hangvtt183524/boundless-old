<template lang="pug">
  .daterange-calendar
    .calendar-header
      .arrow.previous(
        :class="type === 'end' ? 'hidden' : ''"
        @click="changeMonth(-1)"
      )
        i.fa.fa-angle-left
      .year-month {{ `${months[month]} ${year}` }}
      .arrow.next(
        :class="[type === 'start' ? 'hidden' : '', currentYear === year && currentMonth === month ? 'disabled' : '']"
        @click="changeMonth(1)"
      )
        i.fa.fa-angle-right
    .calendar-body
      table
        thead
          tr
            th(
              v-for="item in weekLabels"
            ) {{ item }}
        tbody
          tr(
            v-for="row in calendarDates"
          )
            td(
              v-for="day in row"
              @click="chooseDate(day)"
            )
              div(
                :class="[!day ? 'empty' : '', day && isActive(day) ? 'active' : '', day && isInRange(day) ? 'in-range' : '', day && isDisabled(day) ? 'disabled' : '']"
              ) {{ day || '' }}
    .calendar-footer
</template>

<script>
export default {
  name: 'date-time-range-calendar',
  props: {
    year: {
      type: Number,
      required: true
    },
    month: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      default: 'start'
    },
    selectedDates: {
      type: Array,
      default: function () { return [] }
    }
  },

  computed: {
    calendarDates () {
      const moment = this.$moment([this.year, this.month, 1])
      const lastDay = moment.daysInMonth()
      const firstDay = moment.day()
      const totalWeeks = Math.ceil((lastDay + firstDay) / 7)
      let dates = []

      for (var i = 0; i < totalWeeks; i++) {
        let weekDates = []
        for (var j = 1; j <= 7; j++) {
          let day = i * 7 + j - firstDay
          day = day > 0 ? day : 0
          day = day > lastDay ? 0 : day
          weekDates[j - 1] = day
        }
        dates[i] = weekDates
      }
      return dates
    }
  },

  data () {
    return {
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      weekLabels: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      dates: [
        ['', '', '', 1, 2, 3, 4],
        [5, 6, 7, 8, 9, 10, 11],
        [12, 13, 14, 15, 16, 17, 18],
        [19, 20, 21, 22, 23, 24, 25],
        [26, 27, 28, 29, 30, '', '']
      ],
      currentYear: 0,
      currentMonth: 0
    }
  },

  mounted () {
    this.currentYear = this.$moment().year()
    this.currentMonth = this.$moment().month()
  },

  methods: {
    isActive (day) {
      const dateString = this.$moment([this.year, this.month, day]).format('YYYY-MM-DD')
      return this.selectedDates.indexOf(dateString) !== -1
    },

    isInRange (day) {
      if (this.selectedDates.length !== 2) return false
      const startDate = this.selectedDates[0] > this.selectedDates[1] ? this.selectedDates[1] : this.selectedDates[0]
      const endDate = this.selectedDates[0] > this.selectedDates[1] ? this.selectedDates[0] : this.selectedDates[1]
      return this.$moment([this.year, this.month, day]).isBetween(startDate, endDate)
    },

    isDisabled (day) {
      const dateString = this.$moment([this.year, this.month, day]).format('YYYY-MM-DD')
      const currentDateString = this.$moment([this.currentYear, this.currentMonth, this.$moment().date()]).format('YYYY-MM-DD')
      return dateString > currentDateString
    },

    chooseDate (day) {
      if (day) {
        this.$emit('chooseDate', this.year, this.month, day)
      }
    },

    changeMonth (arrow) {
      this.$emit('changeMonth', arrow)
    }
  }
}
</script>

<style lang="scss">
  .daterange-calendar {
    flex: 0.48;
    .disabled {
      pointer-events: none;
      color: #999;
    }
    .calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .arrow {
        cursor: pointer;
        &:hover {
          color: #e07700;
        }
      }
      .year-month {
        flex: 1;
        text-align: center;
        font-size: 18px;
        font-weight: 700;
      }
      .hidden {
        visibility: hidden;
      }
    }
    .calendar-body {
      table {
        width: 100%;
        border-collapse: collapse;
        border-spacing: 0;
        th {
          width: 35px;
          font-size: 18px;
        }
        td {
          text-align: center;
          font-size: 18px;
          font-weight: 400;
          cursor: pointer;
          div {
            padding: 5px 0;
            &:hover {
              background-color: #4c83f0;
            }
            &.active {
              background-color: #4c83f0;
              color: #FFF;
            }
            &.in-range {
              background-color: #d1d1d1;
            }
            &.empty {
              &:hover {
                background-color: unset;
              }
            }
          }
        }
      }
    }
  }
</style>
