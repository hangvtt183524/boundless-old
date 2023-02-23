import { mount } from '@vue/test-utils'
import BaseTable from './base-table.vue'
import Vuetify from 'vuetify'
import Vue from 'vue'

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
  }
]

export const actions = [
  {
    type: 'edit',
    icon: 'edit'
  },
  {
    type: 'refresh',
    icon: 'refresh'
  }
]

describe('BaseTable.vue', () => {
  beforeEach(() => {
    Vue.use(Vuetify)
  })

  it('displays provided headers', () => {
    const wrapper = mount(BaseTable, {
      propsData: {
        headers: headers,
        items: items
      }
    })
    console.log(wrapper)

    headers.forEach((header, index) => {
      expect(wrapper.findAll('thead th').at(index).text()).toMatch(header.text)
    })
  })

  it('displays provided rows', () => {
    const wrapper = mount(BaseTable, {
      propsData: {
        headers: headers,
        items: items
      }
    })

    items.forEach((item, itemIndex) => {
      const itemRow = wrapper.findAll('tbody tr').at(itemIndex)
      headers.forEach((header, headerIndex) => {
        expect(itemRow.findAll('td').at(headerIndex).text()).toMatch(item[header.value])
      })
    })
  })

  it('displays indices when set to', () => {
    const wrapper = mount(BaseTable, {
      propsData: {
        headers: headers,
        items: items,
        showIndices: true
      }
    })

    for (let i = 0; i < items.length; i++) {
      const row = wrapper.findAll('tbody tr').at(i)
      expect(row.findAll('td').at(0).text()).toMatch((i + 1).toString())
    }
  })

  it('displays actions when set to', () => {
    const wrapper = mount(BaseTable, {
      propsData: {
        headers: headers,
        items: items,
        actions: actions
      },
      mocks: {
        $t: () => 'text'
      }
    })

    for (let i = 0; i < items.length; i++) {
      const row = wrapper.findAll('tbody tr').at(i)
      const actionsCell = row.find('.base-table-cell--action-cell')
      expect(actionsCell).toBeTruthy()

      // Now check that we have an icon for each action
      actions.forEach((action, index) => {
        expect(actionsCell.findAll('.action-icon').at(index).text()).toMatch(action.icon)
      })
    }
  })

  it('emits event when clicked on action icon', () => {
    const wrapper = mount(BaseTable, {
      propsData: {
        headers: headers,
        items: items,
        actions: actions
      },
      mocks: {
        $t: () => 'text'
      }
    })

    wrapper.find('.action-icon').trigger('click')
    expect(wrapper.emitted().actionClick[0][0]).toEqual(actions[0])
    expect(wrapper.emitted().actionClick[0][1]).toEqual(items[0])
  })

  it('displays input elements when editable headers are set', () => {
    const wrapper = mount(BaseTable, {
      propsData: {
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
              }
            ]
          },
          {
            text: 'Count',
            value: 'count',
            editable: false
          }
        ],
        items: items
      },
      mocks: {
        $t: () => 'text'
      }
    })

    items.forEach((item, itemIndex) => {
      const itemRow = wrapper.findAll('tbody tr').at(itemIndex)
      expect(itemRow.findAll('td').at(0).find('.base-text-input')).toBeTruthy()
      expect(itemRow.findAll('td').at(1).find('.base-select')).toBeTruthy()
    })
  })
})
