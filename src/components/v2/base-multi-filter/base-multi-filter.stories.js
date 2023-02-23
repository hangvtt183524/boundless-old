import { storiesOf } from '@storybook/vue'
import i18n from '../../../plugins/i18n/i18n'
import BaseMultiFilter from './base-multi-filter.vue'

storiesOf('BaseMultiFilter', module)
  .add('default', () => {
    return {
      components: { BaseMultiFilter },
      data () {
        return {
          items: [
            {
              'key': 1,
              'name': 'VLan'
            },
            {
              'key': 2,
              'name': 'SSID'
            },
            {
              'key': 3,
              'name': 'Tag'
            },
            {
              'key': 4,
              'name': 'Switch'
            },
            {
              'key': 5,
              'name': 'Port'
            }
          ]
        }
      },
      template: `<div><base-multi-filter :items="items"></base-multi-filter></div>`,
      i18n
    }
  })
