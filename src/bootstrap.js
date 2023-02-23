import Ls from '@/services/ls.js'
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
import VueMoment from 'vue-moment'
import VueTouch from 'vue-touch'
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'
import VueNativeSock from 'vue-native-websocket'
import VueMask from 'v-mask'
import colors from 'vuetify/es5/util/colors'
import moment from 'moment-timezone'
import store from './store'
import router from './router'

/**
 * Global Component Imports
 */

import baseSwitch from '@/components/common/base-switch'
import baseDialog from '@/components/common/base-dialog'
import tooltip from '@/components/common/tooltip'
import HelpTooltip from '@/components/common/help-tooltip'
import NodeNameInput from '@/components/common/node-name-input'
import Multiselect from 'vue-multiselect'
import ReadonlyInput from '@/components/common/readonly-input'
import PerfectScrollbar from 'vue2-perfect-scrollbar'

/**
 * Global Directive Imports
 */
import BLoading from '@/directives/b-loading'
import PrependSocialIcon from '@/directives/prepend-social-icon.js'
import ClickOutside from '@/directives/click-outside.js'
import i18n from '@/plugins/i18n/i18n'
/**
 * CSS Imports
 */

import 'vuetify/dist/vuetify.min.css' // En
import 'toastr/build/toastr.min.css'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'
import '@/styles/main.scss'

/**
 * Global Mixin Imports
 */

import validationMixin from './mixins/validation.mixin'
import customIcons from './components/v2/base-icons'

/**
 * Globals
 */
global.VueScrollTo = require('vue-scrollto')
global.axios = require('axios')
global.toastr = require('toastr')
global._ = require('lodash')
global.RandExp = require('randexp')
global.touchMap = new WeakMap()
// window.multiDownload = require('multi-download')
/**
 * Global Axios Request Interceptor
 */
global.toastr.options = {
  positionClass: 'toast-top-full-width',
  closeButton: true,
  preventDuplicates: true,
  closeHtml: '<button><i class="icon material-icons">close</i></button>'
}

const trimStringData = function (data) {
  if (data instanceof FormData) {
    for (const item of data) {
      if (typeof (item[1]) === 'string') {
        data.set(item[0], item[1].trim())
      }
    }
  } else if (data instanceof Object) {
    Object.keys(data).forEach(key => {
      if (typeof (data[key]) === 'string') {
        data[key] = data[key].trim()
      }
    })
  }
}

global.axios.interceptors.request.use(function (config) {
  if (['post', 'put', 'patch'].includes(config.method)) {
    trimStringData(config.data)
  }
  // Do something before request is sent
  const AUTH_TOKEN = Ls.get('auth.token')
  // Only when sending to base server
  if (AUTH_TOKEN) {
    config.headers.common['Authorization'] = `Bearer ${AUTH_TOKEN}`
  }

  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

/**
 * Global Axios Response Interceptor
 */

global.axios.interceptors.response.use(undefined, function (err) {
  // Do something with request error
  return new Promise((resolve, reject) => {
    // Do not logout and redirect if the error code is present in the exemptedCodes
    const exemptedCodes = ['reset_token_invalid', 'wrong_credentials', 'account_email_not_verified']

    if (!err.response) {
      // This usually happen when OPERATION_TIME_OUT issue happen on lazy network
      console.log('no response in error', err)
      return
    }

    if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
      let errorCode = err.response.data.error.detail.code
      console.log('Error: ', errorCode)
      if (!exemptedCodes.includes(errorCode)) {
        if (errorCode !== 'refresh_expired') {
          console.log('Refreshing')
          return store.dispatch('auth/refreshToken').then((res) => {
            err.config.headers.common['Authorization'] = `Bearer ${res.data.data.token}`

            global.axios.request(err.config).then((res) => {
              resolve(res)
            })
          }).catch(() => {
            console.log('NOT AUTHENTICATED')
            store.dispatch('auth/logout')
            console.log('Unauthorized! Logging out.')
          })
        } else {
          console.log('REFRESH EXPIRED!')
          store.dispatch('auth/logout')
          console.log('Unauthorized! Logging out.')
        }
      }
    } else if (err.response.status === 403) {
      // Action not allowed
      const requestUrl = err.response.config.url

      if (!err.response.config.suppressErrors) {
        const error = err.response.data.error
        error.messages.forEach(errorMessage => {
          if (i18n.te('apiMessages.' + errorMessage.code)) {
            if (errorMessage.code === 'permission_denied') {
              if (err.response.config.suppressErrors ||
                (requestUrl && (requestUrl.indexOf('api/signin') > -1 || requestUrl.indexOf('api/me') > -1))) {
                // Skip generic permission error for authentication or background requests
                return
              }
            }

            global.toastr['error'](i18n.t('apiMessages.' + errorMessage.code), i18n.t('general.error'))
          }
        })
      }

      // If ot a 403 error from an organization related endpoint, check user security settings and display info
      // to the user if the error is caused by them
      if (requestUrl && requestUrl.indexOf('api/signin') === -1 && requestUrl.indexOf('api/me') === -1 &&
        requestUrl.indexOf('user-security-checks') === -1) {
        if (store.state.layout.selectedWorkspace.id) {
          store.dispatch('workspace/fetchWorkspaceUserSecurityChecks',
            store.state.layout.selectedWorkspace.id)
        }
      }

      throw err
    } else if (err.response.status === 500) {
      router.push({ name: 'error', params: { errorCode: 500 } })
    } else {
      const error = err.response.data.error
      if (err.response.status === 400) {
        // Check error messages, and display them if their translations are defined
        if (!err.response.config.suppressErrors) {
          error.messages.forEach(errorMessage => {
            if (errorMessage.context && i18n.te(`apiMessages.withContext.${errorMessage.code}`)) {
              // We have context data in error, and we have an error message version with context, apply context
              // substitutions and display it.
              let message = i18n.t(`apiMessages.withContext.${errorMessage.code}`)
              Object.entries(errorMessage.context).forEach(([key, value]) => {
                message = message.replace(`{${key}}`, value)
              })

              global.toastr['error'](message, i18n.t('general.error'))
            } else if (i18n.te(`apiMessages.${errorMessage.code}`)) {
              // We have a generic version of the error message, display it
              global.toastr['error'](i18n.t(`apiMessages.${errorMessage.code}`), i18n.t('general.error'))
            }
          })
        }
      }

      if (error && error.status === 404) {
        global.toastr['error'](i18n.t('errors.error404ShortMessage'), i18n.t('general.error'))
        setTimeout(() => (window.location = '/'), 2000)

        throw err
      } else {
        throw err
      }
    }
  })
})

/**
 * Plugins
 */

Vue.use(Vuetify, {
  theme: {
    primary: '#4b83f0',
    secondary: '#3260D3',
    accent: colors.purple.base,
    error: '#EC5F59',
    warning: colors.orange.base,
    info: colors.yellow.base,
    success: '#62d862'
  },
  icons: customIcons
})

Vue.use(global.VueScrollTo)
Vue.use(VueClipboard)
Vue.use(VueTouch)
Vue.use(Vuelidate)
Vue.use(PerfectScrollbar)
Vue.use(VueMoment, {
  moment
})
Vue.use(VueNativeSock, process.env.VUE_APP_WEBSOCKET_URL, {
  connectManually: true
})
Vue.use(VueMask)

Vue.config.productionTip = false

/**
 * Custom Directive
 */

Vue.directive('loading', BLoading)
Vue.directive('prepend-social-icon', PrependSocialIcon)
Vue.directive('click-outside', ClickOutside)

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

Vue.directive('help-tooltip', {
  /*
    Adds help icon with a tooltip in an input field.

    Usage:

    v-text-field(v-help-tooltip="{ message: 'This is the tooltip message' }")
  */
  bind: function (el, binding, vnode) {
    const HelpTooltipClass = Vue.extend(HelpTooltip)
    const helpTooltip = new HelpTooltipClass({
      propsData: { message: binding.value.message }
    })
    helpTooltip.$mount()

    const inputEl = el.getElementsByClassName('v-input__slot')[0].children[0]
    if (!inputEl) {
      return
    }
    const appendedIcon = inputEl.getElementsByClassName(
      'v-input__append-inner'
    )[0]

    if (appendedIcon) {
      // This occurs when there is an existing icon like a select input
      inputEl.insertBefore(helpTooltip.$el, appendedIcon)
    } else {
      inputEl.appendChild(helpTooltip.$el)
    }
  }
})

/**
 * Register Global Components
 */

Vue.component('readonly-input', ReadonlyInput)
Vue.component('base-switch', baseSwitch)
Vue.component('base-dialog', baseDialog)
Vue.component('tooltip', tooltip)
Vue.component('node-name-input', NodeNameInput)
Vue.component('multiselect', Multiselect)

/**
 * Register Global Filters
 */
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

Vue.prototype.$eventHub = new Vue() // Global event bus

/**
 * Register Global Mixins
 */

Vue.mixin(validationMixin)
