import { storiesOf } from '@storybook/vue'

import ProtectedInput from './protected-input.vue'

storiesOf('ProtectedInput', module)
  .add('default', () => {
    return {
      components: { ProtectedInput },
      template: `<protected-input placeholder="hidden" ></protected-input>`
    }
  })
