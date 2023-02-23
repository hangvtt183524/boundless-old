import { cloneDeep } from 'lodash'

let TranslationMixin = {
  computed: {
    translated () {
      // try {
      const config = this.config
      const lang = this.lang || this.defaultLang
      const defaultLang = this.defaultLang

      config.translation = config.translation || {}
      config.translation[defaultLang] = config.translation[defaultLang] || {
        title: config.title,
        placeholder: config.placeholder,
        label: config.label,
        links: config.links
      }
      if (!config.translation[lang]) {
        config.translation[lang] = cloneDeep(config.translation[defaultLang])
      }

      // If translations not entered for fields, use any defined language entry
      if (!config.translation[lang].title) {
        config.translation[lang].title = this.getDefinedTranslationForField('title')
      }

      if (!config.translation[lang].placeholder) {
        config.translation[lang].placeholder = this.getDefinedTranslationForField('placeholder')
      }

      if (!config.translation[lang].label) {
        config.translation[lang].label = this.getDefinedTranslationForField('label')
      }

      return config.translation[lang]
      // } catch (err) {
      //   console.error(err)
      // }
    }
  },
  methods: {
    getDefinedTranslationForField (fieldName) {
      const translationLanguageKeys = Object.keys(this.config.translation)
      for (let i = 0; i < translationLanguageKeys.length; i++) {
        const translation = this.config.translation[translationLanguageKeys[i]]
        if (translation[fieldName]) {
          return translation[fieldName]
        }
      }

      return null
    }
  }
}

export default TranslationMixin
