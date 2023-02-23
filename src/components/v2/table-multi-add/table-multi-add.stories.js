import { storiesOf } from '@storybook/vue'
import i18n from '../../../plugins/i18n/i18n'
import TableMultiAdd from './table-multi-add.vue'

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

storiesOf('TableMultiAdd', module)
  .add('default', () => {
    return {
      components: { TableMultiAdd },
      data: () => {
        return {
          items: items
        }
      },
      template: `<div style="width: 280px;"><table-multi-add :items="items"></table-multi-add></div>`,
      i18n
    }
  })
  .add('disabled', () => {
    return {
      components: { TableMultiAdd },
      data: () => {
        return {
          items: items
        }
      },
      template: `<div style="width: 280px;"><table-multi-add :items="items" :disabled="true"></table-multi-add></div>`,
      i18n
    }
  })
