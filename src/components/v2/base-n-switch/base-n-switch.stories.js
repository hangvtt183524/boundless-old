import { storiesOf } from '@storybook/vue'
import i18n from '../../../plugins/i18n/i18n'
import BaseNSwitch from './base-n-switch.vue'

storiesOf('BaseNSwitch', module)
  .add('default', () => {
    return {
      components: { BaseNSwitch },
      data () {
        return {
          value: 1,
          items: [
            {
              'value': 1,
              'text': 'Apple'
            },
            {
              'value': 2,
              'text': 'Orange'
            },
            {
              'value': 3,
              'text': 'Strawberry'
            }
          ]
        }
      },
      template: `<base-n-switch v-model="value" :items="items"></base-n-switch>`,
      i18n
    }
  })
