import { storiesOf } from '@storybook/vue'
import i18n from '../../../plugins/i18n/i18n'
import BaseSliderInput from './base-slider-input.vue'

storiesOf('BaseSliderInput', module)
  .add('timeRangeInput', () => {
    return {
      components: { BaseSliderInput },
      data: function () {
        return {
          value: [8, 17],
          options: {
            min: 0,
            max: 24,
            interval: 0.5
          }
        }
      },
      methods: {
        labelFormatter (value) {
          if (value % 4 === 0) {
            return (value < 10 ? '0' : '') + value + ':00'
          }
          return ''
        }
      },
      template: `<div style="width: 600px; margin-left: 20px;"><base-slider-input v-model="value" :options="options" :label-formatter="labelFormatter"></base-slider-input></div>`,
      i18n
    }
  })
  .add('selectInput', () => {
    return {
      components: { BaseSliderInput },
      data: function () {
        return {
          value: 12,
          options: {
            min: 1,
            max: 60,
            marks: [1, 2, 4, 8, 12, 20, 34, 48, 60],
            adsorb: true,
            included: true
          }
        }
      },
      template: `<div style="width: 800px; margin-left: 20px;"><base-slider-input v-model="value" :options="options"></base-slider-input></div>`,
      i18n
    }
  })
