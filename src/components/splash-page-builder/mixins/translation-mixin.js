import { cloneDeep } from 'lodash'

let TranslationMixin = {
  computed: {
    componentLabel () {
      switch (this.component.component) {
        case 'heading':
          return 'HEADING TEXT'
        case 'terms-checkbox':
          return `CHECKBOX (${this.config.fieldName})`
        default:
      }
      let originLabel = this.component.component.replace(/-/g, ' ').toUpperCase()
      if (this.component.component.indexOf('input') !== -1) {
        return `${originLabel} (${this.config.fieldName})`
      }
      return originLabel
    },
    translated () {
      try {
        const config = this.config
        const lang = this.lang || this.defaultLang
        const defaultLang = this.defaultLang
        if (!config.translation[lang]) {
          config.translation[lang] = cloneDeep(config.translation[defaultLang])
        }
        return config.translation[lang]
      } catch (err) {
        console.error(err)
      }
    }
  }
}

export default TranslationMixin
