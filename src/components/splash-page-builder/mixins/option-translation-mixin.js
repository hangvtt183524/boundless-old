import { cloneDeep } from 'lodash'

let TranslationMixin = {
  computed: {
    translated () {
      try {
        const config = this.selectedItem.config
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
