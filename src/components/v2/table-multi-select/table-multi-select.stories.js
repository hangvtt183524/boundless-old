import { storiesOf } from '@storybook/vue'
import i18n from '../../../plugins/i18n/i18n'
import TableMultiSelect from './table-multi-select.vue'

export const items = [
  { 'key': 1, 'name': 'Apple' },
  { 'key': 2, 'name': 'Orange' },
  { 'key': 3, 'name': 'Lemon' },
  { 'key': 4, 'name': 'Grape' },
  { 'key': 5, 'name': 'Peach' },
  { 'key': 6, 'name': 'Carrot' },
  { 'key': 7, 'name': 'Melon' },
  { 'key': 8, 'name': 'Banana' },
  { 'key': 9, 'name': 'Pear' },
  { 'key': 10, 'name': 'Potato' }
]

storiesOf('TableMultiSelect', module)
  .add('default', () => {
    return {
      components: { TableMultiSelect },
      data: () => {
        return {
          items: items,
          selected: [1]
        }
      },
      template: `<div style="width: 280px;"><table-multi-select v-model="selected" :items="items"></table-multi-select></div>`,
      i18n
    }
  })
  .add('disabled', () => {
    return {
      components: { TableMultiSelect },
      data: () => {
        return {
          items: items,
          selected: [1]
        }
      },
      template: `<div style="width: 280px;"><table-multi-select v-model="selected" :items="items" :disabled="true"></table-multi-select></div>`,
      i18n
    }
  })
  .add('required', () => {
    return {
      components: { TableMultiSelect },
      data: () => {
        return {
          items: items,
          selected: []
        }
      },
      template: `<div style="width: 280px;"><table-multi-select v-model="selected" :items="items" :validations="{required: true}"></table-multi-select></div>`,
      i18n
    }
  })
