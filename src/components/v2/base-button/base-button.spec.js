import { shallowMount } from '@vue/test-utils'
import BaseButton from './base-button.vue'

const buttonText = 'Submit'

describe('BaseButton.vue', () => {
  it('displays button text', () => {
    const wrapper = shallowMount(BaseButton, {
      slots: {
        default: buttonText
      }
    })
    expect(wrapper.find('button').text()).toMatch(buttonText)
  })

  it('emits click event on click', () => {
    const wrapper = shallowMount(BaseButton, {
      slots: {
        default: buttonText
      }
    })
    wrapper.find('button').trigger('click')
    expect(wrapper.emitted().click).toBeTruthy()
  })
})
