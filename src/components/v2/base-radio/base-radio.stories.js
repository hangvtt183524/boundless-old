import { storiesOf } from '@storybook/vue'

import BaseRadio from './base-radio.vue'

storiesOf('BaseRadio', module)
  .add('default', () => {
    return {
      components: { BaseRadio },
      template: `<base-radio label="Item label" value="1" selected-value="2"></base-radio>`
    }
  })
  .add('selected', () => {
    return {
      components: { BaseRadio },
      template: `<base-radio label="Item label" value="1" selected-value="1"></base-radio>`
    }
  })
