import { storiesOf } from '@storybook/vue'

import DataSizeInput from './data-size-input'

storiesOf('DataSizeInput', module)
  .add('basic', () => {
    return {
      components: { DataSizeInput },
      data: function () {
        return {
          value: 8388608
        }
      },
      template: `<data-size-input v-model="value"></data-size-input>`
    }
  })
  .add('basic-with-label', () => {
    return {
      components: { DataSizeInput },
      data: function () {
        return {
          value: 8388608
        }
      },
      template: `<data-size-input v-model="value" label="Label"></data-size-input>`
    }
  })
  .add('small', () => {
    return {
      components: { DataSizeInput },
      data: function () {
        return {
          value: 8388608
        }
      },
      template: `<data-size-input class="data-size-input--small" v-model="value"></data-size-input>`
    }
  })
  .add('disabled', () => {
    return {
      components: { DataSizeInput },
      data: function () {
        return {
          value: 8388608
        }
      },
      template: `<data-size-input class="data-size-input" :disabled="true" v-model="value"></data-size-input>`
    }
  })
