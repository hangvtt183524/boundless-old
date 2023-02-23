import { storiesOf } from '@storybook/vue'

import BaseTextArea from './base-text-area.vue'

storiesOf('BaseTextArea', module)
  .add('basic', () => {
    return {
      components: { BaseTextArea },
      template: `<base-text-area placeholder="Placeholder text" ></base-text-area>`
    }
  })
