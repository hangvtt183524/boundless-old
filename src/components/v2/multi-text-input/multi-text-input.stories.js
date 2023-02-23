import { storiesOf } from '@storybook/vue'

import MultiTextInput from './multi-text-input.vue'

storiesOf('MultiTextInput', module)
  .add('basic', () => {
    return {
      components: { MultiTextInput },
      data: function () {
        return {
          value: []
        }
      },
      template: `<multi-text-input v-model="value" type="text" placeholder="Placeholder text" ></multi-text-input>`
    }
  })
  .add('basic-with-label', () => {
    return {
      components: { MultiTextInput },
      data: function () {
        return {
          value: []
        }
      },
      template: `<multi-text-input v-model="value" type="text" placeholder="Placeholder text" label="Label:" ></multi-text-input>`
    }
  })
  .add('basic-with-label-multiline', () => {
    return {
      components: { MultiTextInput },
      data: function () {
        return {
          value: []
        }
      },
      template: `<multi-text-input v-model="value" type="text" placeholder="Placeholder text" class="multi-text-input--multiline" label="Label:" ></multi-text-input>`
    }
  })
  .add('basic-disabled', () => {
    return {
      components: { MultiTextInput },
      data: function () {
        return {
          value: []
        }
      },
      template: `<multi-text-input v-model="value" type="text" placeholder="Placeholder text" disabled ></multi-text-input>`
    }
  })
  .add('basic-disabled-with-values', () => {
    return {
      components: { MultiTextInput },
      data: function () {
        return {
          value: ['value 1', 'value 2']
        }
      },
      template: `<multi-text-input v-model="value" type="text" placeholder="Placeholder text" disabled ></multi-text-input>`
    }
  })
  .add('small', () => {
    return {
      components: { MultiTextInput },
      data: function () {
        return {
          value: []
        }
      },
      template: `<multi-text-input v-model="value" type="text" placeholder="Placeholder text" class="multi-text-input--small" ></multi-text-input>`
    }
  })
  .add('small-with-label', () => {
    return {
      components: { MultiTextInput },
      data: function () {
        return {
          value: []
        }
      },
      template: `<multi-text-input v-model="value" type="text" placeholder="Placeholder text" label="Label:" class="multi-text-input--small" ></multi-text-input>`
    }
  })
  .add('small-with-label-multiline', () => {
    return {
      components: { MultiTextInput },
      data: function () {
        return {
          value: []
        }
      },
      template: `<multi-text-input v-model="value" type="text" placeholder="Placeholder text" label="Label:" class="multi-text-input--small multi-text-input--multiline" ></multi-text-input>`
    }
  })
  .add('small-disabled', () => {
    return {
      components: { MultiTextInput },
      data: function () {
        return {
          value: []
        }
      },
      template: `<multi-text-input v-model="value" type="text" placeholder="Placeholder text" class="multi-text-input--small" disabled ></multi-text-input>`
    }
  })
