import Vue from 'vue'

import SocialIcon from '@/components/common/social-icon'

export default {
  bind: function (el, binding, vnode) {
    const inputEl = el.getElementsByClassName('input-group__input')[0]
    if (!inputEl) {
      return
    }

    const prependClass = 'input-group--prepend-icon'
    const SocialIconClass = Vue.extend(SocialIcon)
    const socialIcon = new SocialIconClass({
      propsData: { type: binding.value }
    })
    socialIcon.$mount()

    el.classList.add(prependClass)
    socialIcon.$el.classList.add('prepend-social-icon')
    inputEl.insertBefore(socialIcon.$el, inputEl.firstElementChild)

    // Options for the observer (which mutations to observe)
    const config = { attributes: true }

    // Callback function to execute when mutations are observed
    const callback = function (mutationsList) {
      for (let mutation of mutationsList) {
        if (mutation.type === 'attributes' && !el.classList.contains(prependClass)) {
          el.classList.add(prependClass)
        }
      }
    }

    var observer = new MutationObserver(callback)
    observer.observe(el, config)
  }
}
