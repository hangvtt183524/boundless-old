import { storiesOf } from '@storybook/vue'

import BaseTextInput from './base-text-input.vue'

storiesOf('BaseTextInput', module)
  .add('basic', () => {
    return {
      components: { BaseTextInput },
      template: `<base-text-input type="text" placeholder="Placeholder text" ></base-text-input>`
    }
  })
  .add('basic-with-label', () => {
    return {
      components: { BaseTextInput },
      template: `<base-text-input type="text" placeholder="Placeholder text" label="Label:" ></base-text-input>`
    }
  })
  .add('basic-with-label-multiline', () => {
    return {
      components: { BaseTextInput },
      template: `<base-text-input type="text" placeholder="Placeholder text" class="base-text-input--multiline" label="Label:" ></base-text-input>`
    }
  })
  .add('basic-disabled', () => {
    return {
      components: { BaseTextInput },
      template: `<base-text-input type="text" placeholder="Placeholder text" disabled ></base-text-input>`
    }
  })
  .add('small', () => {
    return {
      components: { BaseTextInput },
      template: `<base-text-input type="text" placeholder="Placeholder text" class="base-text-input--small" ></base-text-input>`
    }
  })
  .add('small-with-label', () => {
    return {
      components: { BaseTextInput },
      template: `<base-text-input type="text" placeholder="Placeholder text" label="Label:" class="base-text-input--small" ></base-text-input>`
    }
  })
  .add('small-with-label-multiline', () => {
    return {
      components: { BaseTextInput },
      template: `<base-text-input type="text" placeholder="Placeholder text" label="Label:" class="base-text-input--small base-text-input--multiline" ></base-text-input>`
    }
  })
  .add('small-disabled', () => {
    return {
      components: { BaseTextInput },
      template: `<base-text-input type="text" placeholder="Placeholder text" class="base-text-input--small" disabled ></base-text-input>`
    }
  })
