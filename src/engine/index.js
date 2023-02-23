import 'babel-polyfill'
import Vue from 'vue'
import VueFlashMessage from 'vue-flash-message'
import router from './router'
import i18n from '../plugins/i18n/i18n'
import Vuelidate from 'vuelidate'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { getCookie } from './utils/common'

import 'vue-flash-message/dist/vue-flash-message.min.css'
import './assets/common/styles/bootstrap.css'
import './assets/common/styles/base.css'
import './assets/templates/basic/styles/style.css'

import App from './App'

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(VueFlashMessage)
/**
 * Custom Directive
 */

Vue.directive('click-outside', {
  bind: function (el, binding, vnode) {
    el.event = function (event) {
      // here I check that click was outside the el and his childrens
      if (!(el === event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        vnode.context[binding.expression](event)
      }
    }
    document.body.addEventListener('click', el.event)
  },
  unbind: function (el) {
    document.body.removeEventListener('click', el.event)
  }
})

/**
 * Config
 */

Vue.config.devtools = true
Vue.prototype.$eventHub = new Vue()

/**
 * Plugins
 */

Vue.use(Vuelidate)

/* eslint-disable no-new */
let root = new Vue(Vue.util.extend({ router, i18n }, App))
document.addEventListener('DOMContentLoaded', () => root.$mount('#app'))

/**
 * Configure axios
 */
global.axios = require('axios')

global.axios.interceptors.request.use(function (config) {
  if (['post', 'put', 'patch', 'delete'].includes(config.method)) {
    // Add csrf token to request headers
    const csrfToken = getCookie('csrftoken')
    if (csrfToken) {
      config.headers.common['X-CSRFToken'] = csrfToken
    }
  }

  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})
