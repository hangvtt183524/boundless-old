<template lang="pug">
  .schedule
    .schedule__daily-schedule(
      v-for="schedule of scheduleValue"
      :key="schedule.key"
    )
        v-layout(row wrap)
          v-flex(xs12 lg2 xl2).schedule__daily-schedule__weekday-label
            | {{ $t(`general.days.${schedule.key}`) }}

          v-flex(xs12 md5 lg5 xl3)
            v-layout(row wrap)
              v-flex(xs5 lg4)
                base-select.base-select--small(
                  :items="scheduleStateOptions"
                  :value="schedule.active"
                  @input="onScheduleStateUpdate(schedule.key, $event)"
                  :disabled="isFixed"
                )

              v-flex(xs6 lg7 offset-xs1).schedule__daily-schedule__time-selections
                v-layout(row wrap)
                  v-flex(xs6)
                    base-select.base-select--small(
                      :items="getAvailableTimeOptions({up: schedule.value[1]})"
                      :value="schedule.value[0]"
                      @input="onScheduleUpdate(schedule.key, [$event, schedule.value[1]])"
                      :disabled="isFixed"
                    )
                  v-flex(xs6)
                    base-select.base-select--small(
                      :items="getAvailableTimeOptions({down: schedule.value[0]})"
                      :value="schedule.value[1]"
                      @input="onScheduleUpdate(schedule.key, [schedule.value[0], $event])"
                      :disabled="isFixed"
                    )

          v-flex(xs12 md6 lg4 xl6 offset-md1)
            base-slider-input(
              :value="schedule.value"
              @input="onScheduleUpdate(schedule.key, $event)"
              :options="rangeInputOptions"
              :label-formatter="labelFormatter"
              :reversed="!schedule.active"
              :disabled="isFixed"
            )

</template>

<script>
import BaseSliderInput from '@/components/v2/base-slider-input/base-slider-input'
import BaseSwitch from '@/components/v2/base-switch/base-switch'
import BaseSelect from '@/components/v2/base-select/base-select'

export default {
  name: 'schedule-item',
  components: { BaseSliderInput, BaseSwitch, BaseSelect },
  props: {
    value: {
      type: Object,
      required: true
    },
    isFixed: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      rangeInputOptions: {
        min: 0,
        max: 48,
        interval: 1
      },
      scheduleStateOptions: [
        {
          name: this.$t('general.enabled'),
          key: true
        },
        {
          name: this.$t('general.disabled'),
          key: false
        }
      ]
    }
  },
  computed: {
    scheduleValue () {
      const scheduleValues = []
      const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

      weekdays.forEach(weekday => {
        const value = this.value[weekday]
        scheduleValues.push({
          key: weekday,
          value: [this.hourStringToNumericValue(value.from), this.hourStringToNumericValue(value.to)],
          active: value.active
        })
      })

      return scheduleValues
    },
    timeOptions () {
      const options = []

      for (let i = 0; i < 24; i++) {
        const hourValue = (i < 10 ? '0' : '') + i
        options.push({
          key: (2 * i),
          name: `${hourValue}:00`
        })

        options.push({
          key: (2 * i) + 1,
          name: `${hourValue}:30`
        })
      }

      options.push({
        key: 48,
        name: `${24}:00`
      })

      return options
    }
  },
  methods: {
    getAvailableTimeOptions (limits) {
      return this.timeOptions.map(option => {
        if ((limits.hasOwnProperty('up') && option.key >= limits.up) || (limits.hasOwnProperty('down') && option.key <= limits.down)) {
          return {
            ...option,
            disabled: true
          }
        }

        return option
      })
    },
    hourStringToNumericValue (hourString) {
      const [hour, minutes] = hourString.split(':')
      return (parseInt(hour) * 2) + (parseInt(minutes) > 0 ? 1 : 0)
    },
    numericValueToHourString (value) {
      const hour = Math.floor(value / 2)
      const hasMinutes = value % 2 !== 0

      return (hour < 10 ? '0' + hour : '' + hour) + ':' + (hasMinutes ? '30' : '00')
    },
    labelFormatter (value) {
      if (value % 8 === 0) {
        const hourValue = value / 2
        return (hourValue < 10 ? '0' : '') + hourValue + ':00'
      }
      return ''
    },
    onScheduleUpdate (weekday, scheduleValue) {
      this.$emit('input', {
        ...this.value,
        [weekday]: {
          ...this.value[weekday],
          from: this.numericValueToHourString(scheduleValue[0]),
          to: this.numericValueToHourString(scheduleValue[1])
        }
      })
    },
    onScheduleStateUpdate (weekday, state) {
      this.$emit('input', {
        ...this.value,
        [weekday]: {
          ...this.value[weekday],
          active: state
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .schedule {
    &__daily-schedule {
      margin-bottom: 30px;

      &__time-selections {
        .base-select {
          margin-right: 10px;
        }
      }
    }

    @media only screen and (max-width: 1264px) {
      .base-slider-input {
        margin-top: 10px;
      }

      &__daily-schedule {
        &__weekday-label {
          margin-bottom: 10px;
        }
      }
    }
  }
</style>
