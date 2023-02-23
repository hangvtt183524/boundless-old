import { shallowMount } from '@vue/test-utils'
import BaseCheckBox from './base-check-box.vue'

const labelText = 'Label:'

describe('BaseCheckBox.vue', () => {
  it('emits input event when value changed', () => {
    const wrapper = shallowMount(BaseCheckBox, {
      propsData: {
        label: labelText
      }
    })

    // First click should yield true
    wrapper.find('.check-box-display').trigger('click')
    expect(wrapper.emitted().input[0][0]).toEqual(true)

    // Second click should yield false
    wrapper.find('.check-box-display').trigger('click')
    expect(wrapper.emitted().input[1][0]).toEqual(false)
  })
})
