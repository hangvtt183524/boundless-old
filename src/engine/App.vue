<template lang='pug'>
  #wrapper.splash-engine(v-if="mainConfig")
    #background-image(
      :style="pageBackgroundStyle"
      :class="[{'wifi4eu': wifi4eu}]"
    )
    .container
      .language-selection-container
        lang-selector(
          v-if="pageConfig.settings.showLanguageSelectionBar"
          :lang-list="pageConfig.settings.supportLanguages"
          :default-lang="lang"
          @langSelect="onLanguageSelect"
        )
      .screen-center-ie11-wrapper
        .screen-center(:class="[{'wifi4eu': wifi4eu}]")
          .alert.alert-danger(role="alert", v-if="pageParams && pageParams.boundless_login_error", v-cloak) {{ $t('engine.' + pageParams.boundless_login_error) }}
          keep-alive
            router-view(
              :page-config="pageConfig"
              :lang="lang"
              :main-config="mainConfig"
              :page-params="pageParams"
              @submit="submitForm"
            )
      .powered-by-container
        powered-by(
          v-if="pageConfig.settings.poweredBy.config.enabled"
          :config="pageConfig.settings.poweredBy.config"
          :lang="lang"
          :default-lang="lang"
        )
      preview-modal(
        :show="showPreviewModal"
        @close="showPreviewModal = false"
      ) {{ $t('engine.previewModeMessage') }}
</template>

<script>

import logo from './components/logo'
import previewModal from './components/preview-modal'
import langSelector from './components/lang-selector'
import poweredBy from './components/powered-by'
import poweredByDefaultConfig from '../components/splash-page-builder/stubs/powered-by'
import pageBackgroundStyles from './mixins/page-background-style'
// import mainConfig from '../components/splash-page-builder/templates/basic/config.json'
// import axios from 'axios'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCircleNotch, faSync, faSpinner, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faFacebookF, faInstagram, faGoogle, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons'

library.add(faSpinner, faCircleNotch, faSync, faEnvelope)
library.add(faFacebookF, faInstagram, faGoogle, faLinkedin, faTwitter)

let WebFont = require('webfontloader')

export default {
  name: 'Main',
  mixins: [
    pageBackgroundStyles
  ],
  components: {
    logo,
    previewModal,
    langSelector,
    poweredBy
  },
  data () {
    return {
      mainConfig: null,
      pageParams: null,
      showPreviewModal: false,
      lang: 'en_US',
      wifi4eu: false
    }
  },
  mounted () {
    let href = window.location.href
    this.pageParams = this.getAllParams(href)
    this.wifi4eu = href.indexOf('wifi4eu.html') !== -1
    // window.baseUrl = href.substring(0, href.indexOf('index.html'))
    // console.log(window.baseUrl)
    this.loadConfigFile()
    this.redirectIfRequired()
    // console.log('pageParams', this.pageParams)

    this.$eventHub.$on('TOGGLE_PREVIEW_MODAL', () => {
      this.showPreviewModal = !this.showPreviewModal
    })
  },
  methods: {
    submitForm (res) {
      this.mainConfig.formResponse = res
      this.$router.push({ name: res.redirect_to })
    },
    onLanguageSelect (lang) {
      this.lang = lang
    },
    redirectIfRequired () {
      if (this.pageParams.portal_page) {
        let resolved = this.$router.resolve(this.pageParams.portal_page)

        if (resolved.route.name !== '404') {
          this.$router.push(this.pageParams.portal_page)
        }
      }
    },
    processConfigFile (mainConfig) {
      // try {
      let pageConfig = mainConfig.splash_page.config
      let usedFontFamilies = []

      pageConfig.settings.autoDetectLanguage = pageConfig.settings.autoDetectLanguage || true
      pageConfig.settings.defaultLanguage = pageConfig.settings.defaultLanguage || 'en_US'
      pageConfig.settings.supportLanguages = pageConfig.settings.supportLanguages || ['en_US', 'fr_FR']
      pageConfig.settings.showLanguageSelectionBar = pageConfig.settings.showLanguageSelectionBar || false
      pageConfig.settings.poweredBy = pageConfig.settings.poweredBy || {
        component: 'powered-by',
        config: poweredByDefaultConfig
      }
      if (typeof pageConfig.settings.poweredBy.config.enabled === 'undefined') {
        pageConfig.settings.poweredBy.config.enabled = false
      }
      if (typeof pageConfig.settings.poweredBy.config.logo === 'undefined') {
        pageConfig.settings.poweredBy.config.logo = poweredByDefaultConfig.logo
      }

      if (pageConfig.settings.autoDetectLanguage && this.pageParams.locale) {
        this.lang = pageConfig.settings.supportLanguages.find(localeCountry => {
          return localeCountry.indexOf(this.pageParams.locale) === 0
        }) || pageConfig.settings.defaultLanguage
      } else if (pageConfig.settings.defaultLanguage) {
        this.lang = pageConfig.settings.defaultLanguage
      }

      const addToUsedFonts = (fontFamily, fontWeight) => {
        let existingFont = usedFontFamilies.find(fontData => fontData.family === fontFamily)
        if (!existingFont) {
          // Font is being added for the first time
          existingFont = {
            family: fontFamily,
            weights: [fontWeight]
          }
          usedFontFamilies.push(existingFont)
        } else {
          // Font is already added, add weight if not added before
          if (existingFont.weights.indexOf(fontWeight) === -1) {
            existingFont.weights.push(fontWeight)
          }
        }
      }

      let pageNames = Object.keys(pageConfig.pages).filter(pN => pN !== 'defaultPage')
      pageNames.forEach(pN => {
        let pageInfo = pageConfig.pages[pN]
        let componentKeys = Object.keys(pageInfo)
        componentKeys.forEach(cK => {
          if (Array.isArray(pageInfo[cK])) {
            for (let scK = 0; scK < pageInfo[cK].length; scK++) {
              if (typeof pageInfo[cK][scK].value === 'undefined') {
                pageInfo[cK][scK].value = ''
              }
              const fontFamily = pageInfo[cK][scK].config.fontFamily
              const fontWeight = pageInfo[cK][scK].config.fontWeight || 500

              addToUsedFonts(fontFamily, fontWeight)
            }
          } else {
            if (typeof pageInfo[cK].value === 'undefined') {
              pageInfo[cK].value = ''
            }
            if (pageInfo[cK]) {
              const fontFamily = pageInfo[cK].config.fontFamily
              const fontWeight = pageInfo[cK].config.fontWeight || 500

              addToUsedFonts(fontFamily, fontWeight)
            }
          }
        })
      })

      // move submit and accessLink to children component if available
      pageNames.forEach(pN => {
        let pageInfo = pageConfig.pages[pN]
        if (pageInfo.submit) {
          pageInfo.children.push(pageInfo.submit)
        }
        if (pageInfo.accessLink) {
          pageInfo.children.push(pageInfo.accessLink)
        }
        pageInfo.submit = undefined
        pageInfo.accessLink = undefined
      })

      this.mainConfig = mainConfig
      const toLoadFonts = usedFontFamilies.filter(fontData => pageConfig.settings.fontFamilies.indexOf(fontData.family) !== -1)
      this.initFonts(toLoadFonts)
      // } catch (error) {
      //   console.error(error)
      // }
    },
    loadConfigFile () {
      // let version = this.pageParams.version
      if (window.mainConfig && window.mainConfig.splash_page && (!this.pageParams.campaign_key || window.mainConfig.campaign)) {
        return this.processConfigFile(window.mainConfig)
      }
      // console.log('waiting for splashpage data to be loaded ...')
      setTimeout(() => {
        this.loadConfigFile()
      }, 100)
      // axios.get(`${window.baseUrl}config.${version}.json`).then((res) => {
      //   this.processConfigFile(res.data)
      // })
    },
    getUrlParameter (name) {
      name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]')
      var regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
      var results = regex.exec(location.search)
      return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
    },
    getAllParams (url) {
      var params = {}
      var parser = document.createElement('a')
      parser.href = url
      var query = parser.search.substring(1)
      var vars = query.split('&')
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=')
        params[pair[0]] = decodeURIComponent(pair[1])
      }
      return params
    },
    initFonts (fonts) {
      if (!fonts || !fonts.length) { return }
      WebFont.load({
        google: {
          families: fonts.map(fontData => {
            return `${fontData.family}:${([...fontData.weights].sort()).join(',')}`
          })
        },
        context: frames['child'],
        active () {
          // console.log('Active')
        },
        fontloading: function (fontFamily, fontDescription) {
          // console.log('fontloading: ' + fontFamily + ' (' + fontDescription + ')')
        },
        fontactive: function (fontFamily, fontDescription) {
          // console.log('fontactive: ' + fontFamily + ' (' + fontDescription + ')')
        },
        fontinactive: function (fontFamily, fontDescription) {
          // console.log('fontinactive: ' + fontFamily + ' (' + fontDescription + ')')
        }
      })
    },
    getWindowType (windowWidth, windowHeight) {
      let smallLen = Math.min(windowWidth, windowHeight)
      let largeLen = Math.max(windowWidth, windowHeight)

      if (largeLen > 1024) {
        return 'desktop'
      } else if (smallLen >= 768) {
        return 'tablet'
      } else {
        return 'mobile'
      }
    }
  },
  computed: {
    pageConfig () {
      return this.mainConfig.splash_page.config
    }
  }
}
</script>
<style lang="scss">
.container {
  padding: 0 15px 15px 15px;
}
.language-selection-container {
  position: fixed;
  right: 10px;
  top: 10px;
  width: 125px;
  background: #EEE;
}
.powered-by-container {
  color: white;
  margin-top: 35px;
  display: flex;
  align-items: center;
  height: auto;
  width: 100%;
  flex-direction: column;
}
.poweredByLogo {
  height: 30px;
  margin-left: 5px;
}
</style>
