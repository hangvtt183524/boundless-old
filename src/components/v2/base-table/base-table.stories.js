import { storiesOf } from '@storybook/vue'

import BaseTable from './base-table.vue'
import i18n from '../../../plugins/i18n/i18n'

export const headers = [
  {
    text: 'Name',
    value: 'name'
  },
  {
    text: 'Color',
    value: 'color'
  },
  {
    text: 'Count',
    value: 'count'
  }
]

export const items = [
  {
    name: 'Apple',
    color: 'Red',
    count: '5'
  },
  {
    name: 'Orange',
    color: 'Orange',
    count: '2'
  },
  {
    name: 'Pear',
    color: 'Green',
    count: '8'
  },
  {
    name: 'PineApple',
    color: 'Green',
    count: '8'
  },
  {
    name: 'Water',
    color: 'Blue',
    count: '8'
  },
  {
    name: 'Juice',
    color: 'Green',
    count: '8'
  },
  {
    name: 'Cola',
    color: 'Black',
    count: '8'
  }
]

storiesOf('BaseTable', module)
  .add('basic', () => {
    return {
      components: { BaseTable },
      data () {
        return {
          items: items,
          headers: JSON.parse(JSON.stringify(headers))
        }
      },
      template: `<base-table :items="items" :headers="headers"></base-table>`
    }
  })
  .add('basic-with-indices', () => {
    return {
      components: { BaseTable },
      data () {
        return {
          items: JSON.parse(JSON.stringify(items)),
          headers: JSON.parse(JSON.stringify(headers))
        }
      },
      template: `<base-table :items="items" :headers="headers" :show-indices="true"></base-table>`
    }
  })
  .add('basic-with-actions', () => {
    return {
      components: { BaseTable },
      data () {
        return {
          items: JSON.parse(JSON.stringify(items)),
          headers: JSON.parse(JSON.stringify(headers)),
          actions: [
            {
              type: 'edit',
              icon: 'edit'
            },
            {
              type: 'refresh',
              icon: 'refresh'
            }
          ]
        }
      },
      template: `<base-table :items="items" :headers="headers" :actions="actions"></base-table>`,
      i18n
    }
  })
  .add('editable', () => {
    return {
      components: { BaseTable },
      data () {
        return {
          items: JSON.parse(JSON.stringify(items)),
          headers: [
            {
              text: 'Name',
              value: 'name',
              editable: true
            },
            {
              text: 'Color',
              value: 'color',
              editable: true,
              options: [
                {
                  key: 'Red',
                  name: 'Red'
                },
                {
                  key: 'Green',
                  name: 'Green'
                },
                {
                  key: 'Blue',
                  name: 'Blue'
                },
                {
                  key: 'Orange',
                  name: 'Orange'
                },
                {
                  key: 'Yellow',
                  name: 'Yellow'
                }
              ]
            },
            {
              text: 'Count',
              value: 'count',
              editable: false
            }
          ]
        }
      },
      template: `<base-table :items="items" :headers="headers"></base-table>`,
      i18n
    }
  })
