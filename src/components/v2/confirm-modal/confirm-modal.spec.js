import { shallowMount } from '@vue/test-utils'
import ConfirmModal from './confirm-modal.vue'

const title = 'Confirm'
const text = 'Are you sure?'

describe('ConfirmModal.vue', () => {
  it('yields false on clicking cancel', () => {
    const wrapper = shallowMount(ConfirmModal)
    wrapper.vm.show = true
    wrapper.find('.cancel-button').trigger('click')
    expect(wrapper.vm.resolve).toHaveBeenCalledWith(false)
  })

  it('yields true on clicking cancel', () => {
    const wrapper = shallowMount(ConfirmModal)
    wrapper.vm.show = true
    wrapper.find('.confirm-button').trigger('click')
    expect(wrapper.vm.resolve).toHaveBeenCalledWith(true)
  })
})
