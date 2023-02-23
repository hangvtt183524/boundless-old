import { shallowMount } from '@vue/test-utils'
import BaseCard from './base-card.vue'

const cardData = {
  'title': 'Card Title',
  'text': 'Card text'
}

describe('BaseCard.vue', () => {
  it('displays title', () => {
    const wrapper = shallowMount(BaseCard, {
      propsData: {
        title: cardData.title,
        text: cardData.text
      }
    })
    expect(wrapper.find('.card-title').text()).toMatch(cardData.title)
  })

  it('displays text', () => {
    const wrapper = shallowMount(BaseCard, {
      propsData: {
        title: cardData.title,
        text: cardData.text
      }
    })
    expect(wrapper.find('.card-text').text()).toMatch(cardData.text)
  })

  it('emits input event on click', () => {
    const wrapper = shallowMount(BaseCard, {
      propsData: {
        title: cardData.title,
        text: cardData.text
      }
    })
    wrapper.find('.card').trigger('click')
    expect(wrapper.emitted().input).toBeTruthy()
  })

  it('has card--selected class when selected', () => {
    const wrapper = shallowMount(BaseCard, {
      propsData: {
        title: cardData.title,
        text: cardData.text,
        value: 'value',
        cardValue: 'value'
      }
    })
    expect(wrapper.find('.card').classes()).toContain('card--selected')
  })
})
