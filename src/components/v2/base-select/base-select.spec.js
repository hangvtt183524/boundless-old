import { shallowMount } from '@vue/test-utils'
import BaseSelect from './base-select.vue'

const options = [
  {
    'key': 1,
    'name': 'Apple'
  },
  {
    'key': 2,
    'name': 'Orange'
  }
]

describe('BaseSelect.vue', () => {
  it('does not display options initially', () => {
    const wrapper = shallowMount(BaseSelect, {
      propsData: {
        items: options
      },
      mocks: {
        $t: () => 'text'
      }
    })
    expect(wrapper.find('.options').isVisible()).toBe(false)
  })

  it('displays options when clicked on item', () => {
    const wrapper = shallowMount(BaseSelect, {
      propsData: {
        items: options
      },
      mocks: {
        $t: () => 'text'
      }
    })
    wrapper.find('.selected-item').trigger('click')
    expect(wrapper.find('.options').isVisible()).toBe(true)
  })

  it('emits input event on option select', () => {
    const wrapper = shallowMount(BaseSelect, {
      propsData: {
        items: options
      },
      mocks: {
        $t: () => 'text'
      }
    })
    wrapper.find('.selected-item').trigger('click')
    wrapper.find('.option').trigger('click')
    expect(wrapper.emitted().input).toBeTruthy()
  })
})
