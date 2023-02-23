import Vue from 'vue'

import BLoader from '@/components/common/b-loader'

import './b-loading.scss'

let isStatic = true
let loadingBox = null

function showLoading (el) {
  let position = window.getComputedStyle(el).position

  if (position === 'static' || position === '') {
    isStatic = true
    el.style.position = 'relative'
  }

  const box = document.createElement('div')
  box.className = 'b-loading'

  const BLoaderClass = Vue.extend(BLoader)
  const bLoader = new BLoaderClass({
    propsData: { color: 'primary', size: 30 }
  })
  bLoader.$mount()

  box.appendChild(bLoader.$el)
  el.appendChild(box)

  window.requestAnimationFrame(() => {
    box.style.opacity = 1
  })

  loadingBox = box
}

function handleHide (el) {
  if (!loadingBox) {
    return
  }
  loadingBox.addEventListener('transitionend', () => {
    loadingBox.remove()

    if (isStatic) {
      el.style.removeProperty('position')
    }
  })

  loadingBox.style.opacity = 0.01
}

const BLoading = (el, binding, vnode) => {
  if (binding.value) {
    showLoading(el)
  } else {
    handleHide(el)
  }
}

export default BLoading
