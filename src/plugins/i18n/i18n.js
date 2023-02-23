import Vue from 'vue'
import VueI18n from 'vue-i18n'
const en = require('./locales/en.json')
const fr = require('./locales/fr.json')

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'en',
  messages: {
    en,
    fr
  },
  fallbackLocale: 'en'
})
export default i18n
