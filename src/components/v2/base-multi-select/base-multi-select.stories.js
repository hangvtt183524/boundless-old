import { storiesOf } from '@storybook/vue'
import i18n from '../../../plugins/i18n/i18n'
import BaseMultiSelect from './base-multi-select.vue'

storiesOf('BaseMultiSelect', module)
  .add('default', () => {
    return {
      components: { BaseMultiSelect },
      template: `<div style="width: 180px;"><base-multi-select :items="[{'key': 1, 'name': 'Apple'}, {'key': 2, 'name': 'Orange'}]"></base-multi-select></div>`,
      i18n
    }
  })
  .add('with-sections', () => {
    return {
      components: { BaseMultiSelect },
      template: `<div style="width: 180px;"><base-select class="base-select--small" :items="[{'name': 'Fruits', children: [{'key': 1, 'name': 'Apple'}, {'key': 2, 'name': 'Orange'}]}, {'name': 'Cars', {'key': 3, 'name': 'BMW'}, {'key': 4, 'name': 'Mercedes'}}]"></base-select></div>`,
      i18n
    }
  })
