<template lang="pug">
  .page-builder(:class="{'sidebar-open': isSidebarVisible}")
    header
      page-selector(:selected-page="selectedPage", @select="selectPage")
      ul.device-switcher
        li(
          v-for="view in views",
          :id="view.name",
          @click="selectView(view.name)",
          :title="view.title",
          :class="{'portrait': view.portrait, 'active': (view.name === currentView || (view.similarcategories && view.similarcategories.indexOf(currentView) != -1))}"
        )
          v-icon {{ view.icon }}
      device-selector(:selected-device="currentView", @select="selectView")
      device-resolution(:device-resolution="currentResolution", @change="setToCustomDevice")
      device-scale(:current-scale="currentScale", :auto-adjust="autoAdjustScale", @select="selectScale")
      button.btn-undo(:disabled="!canUndo" :class="{'disabled': !canUndo}" @click="undoOperation()")
        v-icon undo
      button.btn-redo(:disabled="!canRedo" :class="{'disabled': !canRedo}" @click="redoOperation()")
        v-icon redo
      //- button.btn-save(:disabled="!isChangedConfig" :class="{'disabled': !isChangedConfig}" @click="onSaveConfig('manual')")
      //-   span.spinner(v-if="isSaving")
      //-     v-icon fas fa-spinner fa-spin
      //-   span(v-else)
      //-     v-icon save
      //-   span {{ $t('builder.saveDraft') }}
      button.btn-publish(@click="onPublish()")
        span.spinner(v-if="isPublishing")
          v-icon fas fa-spinner fa-spin
        span(v-else)
          v-icon save
        span {{ $t('builder.publish') }}
    .sidebar
      a.logo-main(@mouseenter="isLogoVisible = false", @mouseleave="isLogoVisible = true", :class="{'hovered': !isLogoVisible}")
        img(src="@/assets/images/boundless-logo.png", v-if="isLogoVisible")
        v-btn.btn-back(icon, small, v-else, @click="goToDashboard")
          v-icon fas fa-long-arrow-alt-left
      settings-panel(
        :page="splashPage"
        :selected-page="selectedPage"
        :show="pannelVisible('settings')"
        ref="settingsPanel"
        @reset="resetAll"
        :window-size="windowType"
        :previewLang="previewLang"
        :defaultLang="splashPage.config.settings.defaultLanguage"
        @preview="onPreview"
      )
      components-panel(:page="splashPage", :show="pannelVisible('components')", ref="componentsPanel", @reset="resetAll", :window-size="windowType")
      v-btn.toggle-icon(icon, small, @click="toggleSettingsPanel")
        v-icon fas fa-cog
      v-btn.toggle-components-bar(icon, small, @click="toggleComponentsPanel")
        v-icon fas fa-building

    .detail-view
      option-wrapper(
        v-if="selectedItem"
        :selected-item="selectedItem"
        :settings-config="splashPage.config.settings"
        :key="previewKey"
        :lang="previewLang"
        :default-lang="splashPage.config.settings.defaultLanguage"
        :selected-page="selectedPage"
      )
      background-panel(
        v-if="showingBkPanel"
        :page-config="splashPage.config"
        :devices="devices"
        :window-size="windowType"
      )
    #iframe-container(:class="currentView", v-if="splashPage.config", ref="iframe")
      i-frame(name="child", :custom-style="iframeStyle", :is-mobile="currentView !== 'desktop'", :page-config="splashPage.config")
        #background-image(
          :style="pageBackgroundStyle"
          :class="[{'wifi4eu': selectedPage.name === 'Wifi4eu'}]"
        )
        .container(@click="onIframeClick")
          .language-selection-container
            lang-selector(
              v-if="pageConfig.settings.showLanguageSelectionBar"
              :lang-list="pageConfig.settings.supportLanguages"
              :default-lang="pageConfig.settings.defaultLanguage"
              @langSelect="onPreview"
            )
          page-wrapper(
            :selected-item="selectedItem"
            :selected-page="selectedPage"
            :page-config="pageConfig"
            :key="previewKey"
            :lang="previewLang"
            :default-lang="pageConfig.settings.defaultLanguage"
            @select="selectItem"
          )
          .powered-by-container
            powered-by(
              v-if="pageConfig.settings.poweredBy.config.enabled"
              :component="pageConfig.settings.poweredBy"
              :config="pageConfig.settings.poweredBy.config"
              :key="previewKey"
              :lang="previewLang"
              :default-lang="pageConfig.settings.defaultLanguage"
            )
    .iframe-loader(v-if="!splashPage || isLoadingStyles || isLoadingFonts")
      v-progress-circular(
        color="primary"
        size="50"
        indeterminate
      )
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
import { cloneDeep, debounce, isEmpty } from 'lodash'
import languages from './settings/translations/languages'
import { initTranslation, processTranslationForProd } from './translation-manager'
import { diff, applyChange, revertChange } from 'deep-diff'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSpinner, faEnvelope, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { faFacebookF, faInstagram, faGoogle, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons'

import configVersionUpgrade, { defaultProperty, setDefaultLanguageAndPoweredByOption } from './config-version-upgrade'

import pageBackgroundStyles from '../../engine/mixins/page-background-style'

import iFrame from './i-frame.vue'
import settingsPanel from './settings/index'
import componentsPanel from './components-panel/index'
import pageSelector from './page-selector'
import deviceSelector from './device-selector'
import deviceResolution from './device-resolution'
import deviceScale from './device-scale'
import pageWrapper from './pages/index'

import langSelector from './components/lang-selector'
import poweredBy from './components/powered-by'
import poweredByDefaultConfig from './stubs/powered-by'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

// Form Components
import emailInput from './components/email-input'
import textInput from './components/text-input'
import passwordInput from './components/password-input'

// Options
import optionWrapper from './options/option-wrapper'
import backgroundPanel from './settings/backgrounds'

import defaultPageConfig from './templates/basic/config.json'

library.add(faSpinner, faEnvelope, faTimesCircle, faFacebookF, faInstagram, faGoogle, faLinkedin, faTwitter)

const API_URL = process.env.VUE_APP_API_URL

export default {
  mixins: [
    pageBackgroundStyles
  ],
  components: {
    iFrame,
    optionWrapper,
    backgroundPanel,
    settingsPanel,
    componentsPanel,
    emailInput,
    textInput,
    passwordInput,
    pageSelector,
    deviceSelector,
    deviceResolution,
    deviceScale,
    pageWrapper,
    langSelector,
    poweredBy
  },
  data () {
    return {
      views: [
        {
          name: 'desktop',
          title: 'Desktop',
          icon: 'fas fa-desktop',
          portrait: true
        },
        {
          name: 'tablet-landscape',
          title: 'Tablet Landscape',
          icon: 'fas fa-tablet-alt',
          portrait: false
        },
        {
          name: 'tablet-portrait',
          similarcategories: ['ipad-portrait', 'ipad-pro-portrait'],
          title: 'Tablet Portrait',
          icon: 'fas fa-tablet-alt',
          portrait: true
        },
        {
          name: 'smartphone-landscape',
          title: 'Smartphone Landscape',
          icon: 'fas fa-mobile-alt',
          portrait: false
        },
        {
          name: 'smartphone-portrait',
          similarcategories: ['galaxy-s5-portrait', 'pixel-2-portrait', 'pixel-2-xl-portrait', 'iphone-5-portrait', 'iphone-6-portrait', 'iphone-6-plus-portrait', 'iphone-x-portrait'],
          title: 'Smartphone Portrait',
          icon: 'fas fa-mobile-alt',
          portrait: true
        }
      ],
      currentView: 'desktop',
      currentResolution: {
        width: '',
        height: ''
      },
      currentScale: 1,
      autoAdjustScale: false,
      splashPage: null,
      doingUndoRedo: false,
      pointerSplashPage: null,
      splashPageDiffs: [],
      undoRedoIndex: 0,
      windowType: 'desktop',
      windowSize: [0, 0],
      selectedItem: null,
      showingBkPanel: false,
      devices: ['desktop', 'tablet', 'mobile'],
      selectedPage: { id: 1, name: 'Guest Form', component: 'guest-form', configKey: 'guestForm', routeName: 'guest' },
      defaultPageOptions: [
        { id: 1, name: 'Guest Form', component: 'guest-form', configKey: 'guestForm', routeName: 'guest' },
        { id: 2, name: 'Guest Social', component: 'guest-social', configKey: 'guestSocial', routeName: 'social' },
        { id: 12, name: 'SMS Registration', component: 'sms-registration', configKey: 'smsRegistration', routeName: 'sms-reg' },
        { id: 3, name: 'Sponsor Page', component: 'sponsor-page', configKey: 'sponsorPage', routeName: 'sponsor' },
        { id: 10, name: 'Ticketing', component: 'ticketing', configKey: 'ticketing', routeName: 'ticketing' },
        { id: 11, name: 'Codes', component: 'codes', configKey: 'codes', routeName: 'codes' },
        { id: 15, name: 'SSO', component: 'sso', configKey: 'sso', routeName: 'sso' },
        { id: 13, name: 'User Login', component: 'user-login', configKey: 'userLogin', routeName: 'user-login' },
        { id: 14, name: 'Wifi4eu', component: 'wifi4eu', configKey: 'wifi4eu', routeName: 'wifi4eu' }
      ],
      isLoadingFonts: true,
      isLoadingStyles: true,
      isSidebarVisible: false,
      activePanelName: 'settings',
      showEmailForm: true,
      isSaving: false,
      isPublishing: false,
      isLogoVisible: true,
      isChangedConfig: false,
      previewLang: 'en_US',
      previewKey: 1
    }
  },
  mounted () {
    this.loadPageConfig()
    this.$eventHub.$on('fonts-loaded', () => {
      this.isLoadingFonts = false

      this.$nextTick(() => {
        let iframeEl = (this.$refs.iframe.firstElementChild || this.$refs.iframe.firstChild)

        iframeEl.contentWindow.addEventListener('resize', () => {
          this.windowType = this.getWindowType(iframeEl.contentWindow.innerWidth, iframeEl.contentWindow.innerHeight)
        })
      })
    })
    this.$eventHub.$on('styles-loaded', () => {
      this.isLoadingStyles = false
    })
    this.$eventHub.$on('open-bkpanel', () => {
      this.showingBkPanel = true
      this.selectedItem = null
    })
  },
  methods: {
    onPreview (previewLang) {
      this.previewKey += 1
      this.previewLang = previewLang
    },
    pannelVisible (panelName) {
      return (panelName === this.activePanelName)
    },
    // this maybe in the future if we show the uesr a list of versions
    // and let them publish a specific version,
    // original method could be used, but for now it wont be used
    // onPublish () {
    //   this.isPublishing = true
    //   let orgId = this.$route.params.orgId
    //   let splashId = this.$route.params.splashId
    //   let url = `${API_URL}/organization/${orgId}/splashpage/${splashId}/`

    //   const versions = this.splashPage.versions
    //   // console.log('versions', versions)
    //   let payload = {
    //     published_version: versions[versions.length - 1].id
    //   }
    //   axios.patch(url, payload).then(() => {
    //     global.toastr['success'](this.$t('splash.publish'), this.$t('general.success'))
    //     this.isPublishing = false
    //     setTimeout(() => {
    //       this.goToDashboard()
    //     }, 1000)
    //   }).catch(err => {
    //     console.log(err.response)
    //     this.isPublishing = false
    //   })
    // },
    onPublish () {
      let orgId = this.$route.params.orgId
      let splashId = this.$route.params.splashId
      let url = `${API_URL}/organization/${orgId}/splashpage/${splashId}/`

      this.isPublishing = true

      const saveConfig = cloneDeep(this.splashPage.config)
      this.loopAllComponents(saveConfig, (component) => {
        processTranslationForProd(component.config, saveConfig.settings)
      })
      let payload = {
        config: saveConfig,
        name: this.splashPage.name,
        publish: true
      }
      axios.patch(url, payload).then((res) => {
        global.toastr['success'](this.$t('splash.publish'), this.$t('general.success'))
        this.isChangedConfig = false
        this.isPublishing = false
        // console.log('publish res', res.data.data.versions)
        this.splashPage.versions = res.data.data.versions
        setTimeout(() => {
          this.goToDashboard()
        }, 1000)
      }).catch(() => {
        this.isPublishing = false
      })

      EventTracker.sendEvent(EVENT_NAMES.SPLASH_PAGE_PUBLISHED)
    },
    onSaveConfig (saveMode = 'auto') {
      let orgId = this.$route.params.orgId
      let splashId = this.$route.params.splashId
      let url = `${API_URL}/organization/${orgId}/splashpage/${splashId}/`

      if (saveMode === 'manual') {
        this.isSaving = true
      }
      if (saveMode !== 'manual') {
        return
      }
      const saveConfig = cloneDeep(this.splashPage.config)
      this.loopAllComponents(saveConfig, (component) => {
        processTranslationForProd(component.config, saveConfig.settings)
      })
      let payload = {
        config: saveConfig,
        name: this.splashPage.name
      }
      axios.patch(url, payload).then((res) => {
        if (saveMode === 'manual') {
          global.toastr['success'](this.$t('splash.savedDraft'), this.$t('general.success'))
          this.isChangedConfig = false
          this.isSaving = false
          // console.log('saveDraft res', res.data.data.versions)
          this.splashPage.versions = res.data.data.versions
        }
      }).catch(() => {
        this.isSaving = false
      })
    },
    loopAllComponents (totalConfig, actionCallback) {
      actionCallback(totalConfig.logo)
      let pageNames = Object.keys(totalConfig.pages).filter(pN => pN !== 'defaultPage')
      pageNames.forEach(pN => {
        let pageInfo = totalConfig.pages[pN]
        let componentKeys = Object.keys(pageInfo)
        componentKeys.forEach(cK => {
          if (Array.isArray(pageInfo[cK])) {
            for (let scK = 0; scK < pageInfo[cK].length; scK++) {
              actionCallback(pageInfo[cK][scK])
            }
          } else {
            if (pageInfo[cK]) {
              actionCallback(pageInfo[cK])
            }
          }
        })
      })
    },
    loadPageConfig () {
      const userProfile = (this.currentUser && this.currentUser.profile) || {}
      const profileLang = languages.find(lang => lang.locale === userProfile.language)
      const profileLocaleCountry = profileLang && profileLang.localeCountry

      if (!profileLocaleCountry) {
      // this is when user refresh page often, currentUsere does not contain user profile language
      // to avoid default set to en_US automatically when profile is fr just put timeout
        setTimeout(() => {
          this.loadPageConfig()
        }, 300)
        return
      }
      let orgId = this.$route.params.orgId
      let splashId = this.$route.params.splashId
      axios.get(`${API_URL}/organization/${orgId}/splashpage/${splashId}/`).then((res) => {
        let fetchedSplashPage = res.data.data

        // Get page config now
        axios.get(`${API_URL}/organization/${orgId}/splashpage/${splashId}/config/`).then((res) => {
          fetchedSplashPage.config = res.data.data.config

          if (isEmpty(fetchedSplashPage.config)) {
            fetchedSplashPage.config = cloneDeep(defaultPageConfig)
            this.isChangedConfig = true

            // If using default config, and organization settings is set to use logo on splash pages, change logo url
            if (this.selectedOrganization.logo && this.selectedOrganization.logo.is_on_splash_pages) {
              fetchedSplashPage.config.logo.config.width = 'auto'
              fetchedSplashPage.config.logo.config.src = this.selectedOrganization.logo.logo_details.url
            }
          } else {
            this.isChangedConfig = false
          }

          /* template version update start from v0 to v1 */
          let background = fetchedSplashPage.config.background
          let copiedPage = cloneDeep(fetchedSplashPage)
          if (!background || background.version !== 'v1') {
            fetchedSplashPage.config.background = {
              version: 'v1',
              backgroundType: copiedPage.config.backgroundType,
              backgrounds: copiedPage.config.backgrounds,
              backgroundColor: copiedPage.config.backgroundColor,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
              gradient: defaultProperty('gradient')
            }
            delete fetchedSplashPage.config.backgroundType
            delete fetchedSplashPage.config.backgrounds
            delete fetchedSplashPage.config.backgroundColor
          }

          fetchedSplashPage.config.settings.borderStyles = fetchedSplashPage.config.settings.borderStyles || defaultProperty('borderStyles')
          fetchedSplashPage.config.settings.autoDetectLanguage = fetchedSplashPage.config.settings.autoDetectLanguage || true
          setDefaultLanguageAndPoweredByOption(fetchedSplashPage.config)
          fetchedSplashPage.config.settings.wifi4euNetworkId = fetchedSplashPage.config.settings.wifi4euNetworkId || ''
          if (typeof fetchedSplashPage.config.settings.poweredBy.config.enabled === 'undefined') {
            fetchedSplashPage.config.settings.poweredBy.config.enabled = false
          }
          if (typeof fetchedSplashPage.config.settings.poweredBy.config.logo === 'undefined') {
            fetchedSplashPage.config.settings.poweredBy.config.logo = poweredByDefaultConfig.logo
          }

          this.previewLang = fetchedSplashPage.config.settings.defaultLanguage

          // If a page config is available on default config, but not on existing config (could be possible when
          // we add a new page type), add default page config to existing config
          let defaultConfigPageNames = Object.keys(defaultPageConfig.pages).filter(pN => pN !== 'defaultPage')
          defaultConfigPageNames.forEach(pN => {
            if (!fetchedSplashPage.config.pages[pN]) {
              fetchedSplashPage.config.pages[pN] = defaultPageConfig.pages[pN]
            }
          })

          // move submit and accessLink to children component if available
          let pageNames = Object.keys(fetchedSplashPage.config.pages).filter(pN => pN !== 'defaultPage')
          pageNames.forEach(pN => {
            let pageInfo = fetchedSplashPage.config.pages[pN]
            if (pageInfo.submit) {
              pageInfo.children.push(pageInfo.submit)
            }
            if (pageInfo.accessLink) {
              pageInfo.children.push(pageInfo.accessLink)
            }
            pageInfo.submit = undefined
            pageInfo.accessLink = undefined
            if (!pageInfo.logo) {
              pageInfo.logo = {
                config: {
                  hidden: false
                }
              }
            }
          })

          // upgrade all components' config to v1
          this.loopAllComponents(fetchedSplashPage.config, (component) => {
            component.config = configVersionUpgrade(
              component.config.version,
              component.config,
              component.component,
              'v1'
            )
            initTranslation(component.config, fetchedSplashPage.config.settings.defaultLanguage)
          })
          if (!fetchedSplashPage.config.pages.defaultPage) {
            fetchedSplashPage.config.pages.defaultPage = 'guestForm'
          }
          /* template version update end from v0 to v1 */
          this.splashPage = fetchedSplashPage

          let defaultPageConfigKey = fetchedSplashPage.config.pages.defaultPage
          this.selectPage(this.defaultPageOptions.find(item => item.configKey === defaultPageConfigKey))

          this.pointerSplashPage = cloneDeep(this.splashPage)
          this.undoRedoIndex = 0
        })
      })
    },
    undoOperation () {
      this.doingUndoRedo = true
      if (!this.splashPageDiffs.length || this.undoRedoIndex <= 0) {
        return
      }
      let appliedChange = this.splashPageDiffs[this.undoRedoIndex - 1]
      if (!appliedChange) {
        return
      }
      appliedChange.forEach(d => {
        revertChange(this.pointerSplashPage, true, d)
      })
      this.undoRedoIndex -= 1
      this.splashPage = cloneDeep(this.pointerSplashPage)
    },
    redoOperation () {
      this.doingUndoRedo = true
      if (!this.splashPageDiffs.length || this.undoRedoIndex >= this.splashPageDiffs.length) {
        return
      }
      let toApplyChange = this.splashPageDiffs[this.undoRedoIndex]
      if (!toApplyChange) {
        return
      }
      toApplyChange.forEach(d => {
        applyChange(this.pointerSplashPage, true, d)
      })
      this.undoRedoIndex += 1
      this.splashPage = cloneDeep(this.pointerSplashPage)
    },
    toggleSettingsPanel () {
      this.isSidebarVisible = true
      this.$refs.settingsPanel.selectedView = null
      this.activePanelName = 'settings'
    },
    toggleComponentsPanel () {
      this.isSidebarVisible = true
      this.$refs.settingsPanel.selectedView = null
      this.activePanelName = 'components'
    },
    loadFonts () {
      this.$eventHub.$emit('load-fonts', this.splashPage.config.settings.fontFamilies)
    },
    selectView (view) {
      this.currentView = view
      let resolutionTable = {
        'smartphone-portrait': [360, 640],
        'smartphone-landscape': [640, 360],
        'tablet-portrait': [768, 1024],
        'tablet-landscape': [1024, 768],
        'galaxy-s5-portrait': [360, 640],
        'pixel-2-portrait': [411, 731],
        'pixel-2-xl-portrait': [411, 823],
        'iphone-5-portrait': [320, 568],
        'iphone-6-portrait': [375, 667],
        'iphone-6-plus-portrait': [414, 736],
        'iphone-x-portrait': [375, 812],
        'ipad-portrait': [768, 1024],
        'ipad-pro-portrait': [1024, 1366]
      }
      if (resolutionTable[view]) {
        this.currentResolution.width = resolutionTable[view][0]
        this.currentResolution.height = resolutionTable[view][1]
      }
      if (this.autoAdjustScale) {
        this.autoUpdatePageScale()
      }
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
    },
    selectItem (item) {
      this.selectedItem = item
      this.showingBkPanel = false
    },
    onIframeClick () {
      this.selectedItem = null
      this.$refs.settingsPanel.selectedView = null
    },
    selectPage (page) {
      if (page) {
        this.selectedPage = page
      }
    },
    setToCustomDevice () {
      this.currentView = 'custom-device'
      if (this.autoAdjustScale) {
        this.autoUpdatePageScale()
      }
    },
    selectScale (newScale) {
      if (newScale === 'auto-adjust') {
        this.autoUpdatePageScale()
        this.autoAdjustScale = true
      } else {
        this.currentScale = newScale
        this.autoAdjustScale = false
      }
    },
    autoUpdatePageScale () {
      let width = this.$refs.iframe.offsetWidth
      let height = this.$refs.iframe.offsetHeight

      let deviceWidth = this.currentResolution.width
      let deviceHeight = this.currentResolution.height

      let scaleX = (width / deviceWidth).toFixed(2)
      let scaleY = (height / deviceHeight).toFixed(2)

      if (isNaN(scaleX) || isNaN(scaleY) || !isFinite(scaleX) || !isFinite(scaleY)) {
        return
      }

      this.currentScale = Math.min(scaleX, scaleY) - 0.1
    },
    goToDashboard () {
      this.$router.push({ name: 'SplashPages' })
    },
    resetAll () {
      this.splashPage.config = JSON.parse(JSON.stringify(defaultPageConfig))
      setDefaultLanguageAndPoweredByOption(this.splashPage.config)
    }
  },
  watch: {
    splashPage: {
      handler: debounce(function (val, old) {
        if (old) {
          this.isChangedConfig = true
        }
        this.onSaveConfig()
        if (this.pointerSplashPage) {
          if (this.doingUndoRedo) {
            this.doingUndoRedo = false
            return
          }
          this.splashPageDiffs = this.splashPageDiffs.slice(0, this.undoRedoIndex)
          let diffFrmPrv = diff(this.pointerSplashPage, this.splashPage)
          if (!diffFrmPrv || !diffFrmPrv.length) {
            return
          }
          this.splashPageDiffs.push(diffFrmPrv)
          this.pointerSplashPage = cloneDeep(this.splashPage)
          this.undoRedoIndex += 1
          // console.log('savedSplashPage', this.splashPageDiffs.length, this.splashPageDiffs)
        }
      }, 200),
      deep: true
    }
  },
  computed: {
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('layout', ['selectedOrganization']),
    pageConfig () {
      return this.splashPage.config
    },
    canUndo () {
      if (!this.splashPageDiffs.length || this.undoRedoIndex <= 0 || !this.splashPageDiffs[this.undoRedoIndex - 1]) {
        return false
      }
      return true
    },
    canRedo () {
      if (!this.splashPageDiffs.length || this.undoRedoIndex >= this.splashPageDiffs.length || !this.splashPageDiffs[this.undoRedoIndex]) {
        return false
      }
      return true
    },
    iframeStyle () {
      let view = this.currentView
      let transformStyle = {
        transform: `scale(${this.currentScale})`
      }
      if (view === 'desktop') {
        return transformStyle
      } else {
        return {
          width: `${this.currentResolution.width}px`,
          height: `${this.currentResolution.height}px`,
          ...transformStyle
        }
      }
    },
    pageComponents () {
      return (this.showEmailForm) ? this.splashPage.config.emailForm.children : this.splashPage.config.container.children
    }
  }
}
</script>

<style lang="scss">
@import "styles/colors.scss";
@import "../../styles/v2/colors.scss";

.page-builder {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-left: 40px;
  padding-right: 250px;
  transition: all 0.3s ease;
  background: $gray-xlight;

  .iframe-loader {
    position: absolute;
    margin-top: 50px;
    height: calc(100vh - 50px);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 5;
    background: $gray-xlight;
  }

  .previewModeMarker {
    position: fixed;
    top: 50px;
    z-index: 100000;
    width: 100px;
    height: 50px;
    background: blue;
    color: white;
    &:hover {
      border: solid blue 1px;
      color: blue;
      background-color: white;
    }
  }

  header {
    position: fixed;
    display: flex;
    width: calc(100% - 290px);
    border-bottom: 0px solid #ccc;
    align-items: center;
    justify-content: center;
    padding: 10px;
    background: $gray-xlight;
    left: 40px;
    border-bottom: 1px solid #9ba9c4;

    .btn-undo {
      position: absolute;
      right: 154px;
      border-left: 1px solid #9ba9c4;
      padding: 5px 5px;
      height: 100%;
      outline: none;
      &:hover {
        background: #4c83f0;
      }
      &.disabled {
        background: #eee;
      }
    }

    .btn-redo {
      position: absolute;
      right: 121px;
      padding: 5px 5px;
      height: 100%;
      outline: none;
      &:hover {
        background: #4c83f0;
      }
      &.disabled {
        background: #eee;
      }
    }

    // .btn-save {
    //   position: absolute;
    //   right: 121px;
    //   top: 0;
    //   height: 100%;
    //   padding: 5px 10px;
    //   display: flex;
    //   align-items: center;
    //   border-left: 1px solid #9ba9c4;
    //   justify-content: center;

    //   .v-icon {
    //     color: $primary;
    //     width: 30px;
    //   }

    //   span {
    //     font-size: 16px;
    //     color: $primary;
    //     padding-left: 5px;
    //     padding-right: 5px;
    //   }
    //   &.disabled {
    //     .span {
    //       color: hsl(220, 19%, 61%) !important;
    //     }
    //     .v-icon {
    //       color: #9ba9c4;
    //     }
    //   }
    // }
    .btn-publish {
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      padding: 5px 10px;
      display: flex;
      align-items: center;
      border-left: 1px solid #9ba9c4;
      justify-content: center;

      .v-icon {
        color: $primary;
        width: 30px;
      }

      span {
        font-size: 16px;
        color: $primary;
        padding-left: 5px;
        padding-right: 5px;
      }
      &.disabled {
        .span {
          color: hsl(220, 19%, 61%) !important;
        }
        .v-icon {
          color: #9ba9c4;
        }
      }
    }
  }

  header .device-switcher * {
    display: inline-block;
  }

  header h1 {
    font-size: 1em;
    margin-left: 1em;
  }

  &.sidebar-open  {
    padding-left: 200px;

    .sidebar {
      width: 200px;
      transform: translateX(0);
    }

    header {
      left: 200px;
      width: calc(100% - 450px);
    }

    .logo-main {
      width: 100%;
    }
  }

  .logo-main {
    width: 40px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    right: 0;
    border-bottom: 1px solid #9ba9c4;
    padding: 10px;

    &.hovered {
      padding: 0;
    }

    img {
      max-width: 100%;
      height: 100%;
    }

    .btn-back {
      margin: 0 !important;
    }
  }

  .sidebar {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    height: 100%;
    width: 200px;
    background: $gray-xlight;
    transform: translateX(-160px);
    color: #0f202f;
    display: flex;
    padding-top: 44px;
    transition: all 0.3s ease;
    border-right: 1px solid #9ba9c4;

    .toggle-icon {
      position: absolute;
      top: 44px;
      right: 0;
      margin: 5px;
    }
    .toggle-components-bar {
      position: absolute;
      top: 84px;
      right: 0;
      margin: 5px;
    }

    .v-btn .v-icon {
      color: #9ba9c4;
    }

    .settings-panel, .components-panel {
      flex: 1;
      padding: 10px;
    }
  }

  .email-form {
    display: flex;
    flex-direction: column;
  }

  .detail-view {
    position: fixed;
    right: 0;
    top: 0;
    height: 100%;
    width: 250px;
    background: $gray-xlight;
    padding-top: 50px;
    border-left: 1px solid #9ba9c4;
    overflow-y: scroll;
    padding-bottom: 50px;

    .sub-panel {
      opacity: 1;
      visibility: visible;
      left: 0;
      min-width: 230px;

      .form-control {
        height: 30px;
        background: white;
        width: 100%;
        padding: 5px 5px;
        outline: none;
      }
    }

    .option-heading {
      color: #9ba9c4;
      text-transform: uppercase;
    }

    .option {
      .option-category-label {
        background: #9ba9c4;
        padding: 5px 10px;
        color: white;
        text-transform: uppercase;
      }

      .option-category-sublabel {
        background: lightblue;
        padding: 5px 10px;
        color: white;
        text-transform: uppercase;
      }

      .option-category-body {
        padding: 0 10px;
        margin-top: 10px;
        background: $gray-xlight !important;

        .form-control {
          height: 30px;
          background: white;
          width: 100%;
          padding: 5px 5px;
          outline: none;
        }

        textarea.form-control {
          height: auto;
        }
      }

      .option-label {
        display: block;
        margin-bottom: 3px;
      }

      .option-type {
        margin-top: 10px;
      }
    }
  }

  .device-switcher {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .device-switcher li {
    color: black;
    cursor: pointer;
    margin: 0 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    .v-icon {
      transform: rotate(90deg);
      color: #9ba9c4
    }

    &.portrait .v-icon {
      transform: rotate(0);
    }

    &.active .v-icon {
      color: $primary;
    }
  }

  #site {
    margin: 0;
    border: 1px solid #ccc;
    padding: 0 1em;
    width:16em;
    padding-left:2.5em;
    transition: all 0.2s;
  }

  #site:focus {
    outline: none;
    border-color: #76CC52;
    background: #fff;
    width:20em;
  }

  #iframe-container {
    margin-top: 50px;
    overflow: hidden;
    align-items: center;
    display: flex;
    height: calc(100vh - 50px);
    background: hsl(210, 8%, 50%);
    -webkit-transition: all 1s;
    -moz-transition: all 1s;
    transition: all 1s;
  }

  iframe {
    background-color: white;
    display: block;
    border:none;
    margin:0 auto;
    -webkit-transition: all 1s;
    -moz-transition: all 1s;
    transition: all 1s;
  }

  .auto iframe{
    width:100%;
    height: 100%;
  }

  .desktop iframe{
    width: 100%;
    height: 100%;
  }

  .page-list {
    list-style-type: none;
    padding: 0;
    max-height: 230px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 8px;
    }

    /* Track */
    &::-webkit-scrollbar-track {
      background: $light-gray;
      border: 3px solid transparent;
      background-clip: content-box;
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
      background: $success;
      border: 1px solid $success;
      border-radius: 5px;
    }

    .page-group {
      margin-right: 5px;
      margin-top: 10px;
      ul {
        padding: 0;
      }
      .page-title {
        padding: 5px 10px;
        border-radius: 5px;
        display: block;
        background: $gray-xlight;
        margin: 5px 0;
        color: #8995ae;
      }
    }

    .page-item {
      padding: 5px 10px;
      cursor: pointer;
      border-radius: 5px;
      margin-top: 2px;
      position: relative;

      .page-item-icon {
        display: none;
        color: #ffffff;
        margin-right: 5px;
        position: absolute;
        top: 5px;
        right: 5px;

        svg {
          color: #ffffff;
        }
      }

      &:hover {
        background-color: lighten($light-gray, 5%);
      }

      &.active {
        background-color: $primary;
        color: #ffffff;

        .page-item-icon {
          display: block;
        }
      }
    }
  }

  @media screen and (max-width:30em) {

    #site {
      background-color: white;
      border-color: #aaa;
      margin: 0.5em;
      position: fixed;
      right: 3.99em;
      left: 0px;
      width: auto;
      -webkit-appearance:none;
      -webkit-border-radius:0px;
    }

    #changeSite {
      float: right;
      margin: 0.5em;
    }

  }
}
</style>
