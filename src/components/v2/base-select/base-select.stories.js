import { storiesOf } from '@storybook/vue'
import i18n from '../../../plugins/i18n/i18n'
import BaseSelect from './base-select.vue'

storiesOf('BaseSelect', module)
  .add('default', () => {
    return {
      components: { BaseSelect },
      data: function () {
        return {
          options: [
            {
              'key': 1,
              'name': 'Apple'
            },
            {
              'key': 2,
              'name': 'Orange'
            },
            {
              'key': 3,
              'name': 'Grapefruit'
            },
            {
              'key': 4,
              'name': 'Invalid',
              'disabled': true
            },
            {
              'key': 5,
              'name': 'Banana'
            }
          ]
        }
      },
      template: `<div style="width: 180px;"><base-select :items="options"></base-select></div>`,
      i18n
    }
  })
  .add('small', () => {
    return {
      components: { BaseSelect },
      data: function () {
        return {
          options: [
            {
              'key': 1,
              'name': 'Apple'
            },
            {
              'key': 2,
              'name': 'Orange'
            },
            {
              'key': 3,
              'name': 'Grapefruit'
            },
            {
              'key': 4,
              'name': 'Invalid',
              'disabled': true
            },
            {
              'key': 5,
              'name': 'Banana'
            }
          ]
        }
      },
      template: `<div style="width: 180px;"><base-select class="base-select--small" :items="options"></base-select></div>`,
      i18n
    }
  })
  .add('tree', () => {
    return {
      components: { BaseSelect },
      data: function () {
        return {
          options: [
            {
              'name': 'Fruits',
              'children': [
                {
                  'key': 1,
                  'name': 'Apple'
                },
                {
                  'key': 2,
                  'name': 'Orange'
                },
                {
                  'key': 3,
                  'name': 'Grapefruit'
                }
              ]
            },
            {
              'name': 'Vegetables',
              'children': [
                {
                  'key': 4,
                  'name': 'Carrot'
                },
                {
                  'key': 5,
                  'name': 'Spinach'
                },
                {
                  'key': 6,
                  'name': 'Aubergine'
                },
                {
                  'key': 7,
                  'name': 'Invalid',
                  'disabled': true
                }
              ]
            }
          ]
        }
      },
      template: `<div style="width: 180px;"><base-select class="base-select--small" :items="options"></base-select></div>`,
      i18n
    }
  })
