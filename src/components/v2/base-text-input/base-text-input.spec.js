import { shallowMount } from '@vue/test-utils'
import BaseTextInput from './base-text-input.vue'

const labelText = 'Label:'

describe('BaseTextInput.vue', () => {
  it('displays an input element', () => {
    const wrapper = shallowMount(BaseTextInput)
    expect(wrapper.find('input')).toBeTruthy()
  })

  it('displays label when supplied', () => {
    const wrapper = shallowMount(BaseTextInput, {
      propsData: {
        label: labelText
      }
    })
    expect(wrapper.find('label').text()).toMatch(labelText)
  })

  it('emits input event on text entered', () => {
    const wrapper = shallowMount(BaseTextInput)
    const input = wrapper.find('input')
    input.element.value = 'input'
    input.trigger('input')
    expect(wrapper.emitted().input).toBeTruthy()
  })
})
