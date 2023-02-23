import { storiesOf } from '@storybook/vue'
import i18n from '../../../plugins/i18n/i18n'
import BaseFlatSelect from './base-flat-select.vue'

storiesOf('BaseFlatSelect', module)
  .add('default', () => {
    return {
      components: { BaseFlatSelect },
      template: `<div style="width: 300px;"><base-flat-select :items="[{'key': 1, 'name': 'Apple'}, {'key': 2, 'name': 'Orange'}]"></base-flat-select></div>`,
      i18n
    }
  })
