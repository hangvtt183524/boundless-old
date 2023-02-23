import { shallowMount } from '@vue/test-utils'
import BaseTabHeader from './base-tab-header.vue'

const headerText = 'Submit'

describe('TabHeader.vue', () => {
  it('displays header text', () => {
    const wrapper = shallowMount(BaseTabHeader, {
      slots: {
        default: headerText
      }
    })
    expect(wrapper.find('button').text()).toMatch(headerText)
  })

  it('emits click event on click', () => {
    const wrapper = shallowMount(BaseTabHeader, {
      slots: {
        default: headerText
      }
    })
    wrapper.find('button').trigger('click')
    expect(wrapper.emitted().click).toBeTruthy()
  })
})
