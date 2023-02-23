import { storiesOf } from '@storybook/vue'
import i18n from '../../../plugins/i18n/i18n'
import BaseSwitch from './base-switch.vue'

storiesOf('BaseSwitch', module)
  .add('default', () => {
    return {
      components: { BaseSwitch },
      data () {
        return {
          value: false
        }
      },
      template: `<base-switch v-model="value"></base-switch>`,
      i18n
    }
  })
