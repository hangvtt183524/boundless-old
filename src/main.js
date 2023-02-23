import 'babel-polyfill'
import Vue from 'vue'
import router from './router'
import store from './store'
import i18n from './plugins/i18n/i18n'
import { sync } from 'vuex-router-sync'
// import * as Sentry from '@sentry/browser'
import * as Sentry from '@sentry/vue'
import { BrowserTracing } from "@sentry/tracing";

import colorPicker from '@caohenghu/vue-colorpicker'
import VueHtmlToPaper from 'vue-html-to-paper'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import App from './App'

Vue.config.devtools = true

const options = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'scrollbars=yes'
  ],
  styles: [
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css',
    'https://use.fontawesome.com/releases/v5.6.3/css/all.css'
  ]
}

Vue.use(VueHtmlToPaper, options)

Vue.component('color-picker', colorPicker)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.ignoredElements = [
  'trix-editor'
]

Sentry.init({
  Vue: Vue,
  dsn: process.env.SENTRY_DSN,
  integrations: [new BrowserTracing],
  tracesSampleRate: 0.2 
})

/* eslint-disable */
// import-first
import './bootstrap'
/* eslint-enable */

sync(store, router)

/* eslint-disable no-new */
let root = new Vue(Vue.util.extend({ router, store, i18n }, App))
document.addEventListener('DOMContentLoaded', () => root.$mount('#app'))
