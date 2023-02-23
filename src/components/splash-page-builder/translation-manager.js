import { cloneDeep } from 'lodash'
import languages from './settings/translations/languages'

export function initTranslation (config, defaultLang) {
  try {
    config.translation = config.translation || {}
    config.translation[defaultLang] = config.translation[defaultLang] || {}

    if (!config.translation[defaultLang].title) {
      config.translation[defaultLang].title = config.title
    }
    if (!config.translation[defaultLang].placeholder) {
      config.translation[defaultLang].placeholder = config.placeholder
    }
    if (!config.translation[defaultLang].label) {
      config.translation[defaultLang].label = config.label
    }
    if (!config.translation[defaultLang].links) {
      config.translation[defaultLang].links = config.links
    }

    languages.forEach(langInfo => {
      const localeCountry = langInfo.localeCountry
      if (!config.translation[localeCountry]) {
        config.translation[localeCountry] = cloneDeep(config.translation[defaultLang])
      }
    })
    if (config.options && config.options.length) {
      config.options.forEach(option => {
        option.translation = option.translation || {}
        option.translation[defaultLang] = option.translation[defaultLang] || {}
        if (!option.translation[defaultLang].label) {
          option.translation[defaultLang].label = option.label
        }
        languages.forEach(langInfo => {
          const localeCountry = langInfo.localeCountry
          if (!option.translation[localeCountry]) {
            option.translation[localeCountry] = cloneDeep(option.translation[defaultLang])
          }
        })
      })
    }
  } catch (err) {
    console.error(err)
  }
}

export function processTranslationForProd (config, settings) {
  config.copiedTranslation = undefined
  if (config.translation) {
    Object.keys(config.translation).forEach(lang => {
      if (settings.supportLanguages.indexOf(lang) === -1) {
        config.translation[lang] = undefined
      }
    })
  }
  if (config.options) {
    config.options.forEach(option => {
      Object.keys(option.translation).forEach(lang => {
        if (settings.supportLanguages.indexOf(lang) === -1) {
          option.translation[lang] = undefined
        }
      })
    })
  }
}

export function createCopiedTranslation (config) {
  config.copiedTranslation = cloneDeep(config.translation || {})
}

export function updateFromCopiedTranslation (config) {
  config.translation = cloneDeep(config.copiedTranslation || {})
}
