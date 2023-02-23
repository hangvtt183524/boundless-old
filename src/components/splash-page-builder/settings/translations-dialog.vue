<template lang='pug'>
  base-dialog(
    v-if="show"
    :show="show"
    @close="close"
    scrollable
    persistent
  )
    .page-builder-translation-dialog
      h2.step-heading.mb-2 {{ $t('builder.translations') }}
      v-layout(row)
        v-flex(xs4)
          .translation-type
            label
              input.form-control(
                type="checkbox"
                v-model="autoDetectLanguage"
              )
              span automatically detect language
          .translation-type
            label
              input.form-control(
                type="checkbox"
                v-model="showLanguageSelectionBar"
              )
              span show language bar on portal
        v-flex(xs8)
          .translation-panel-header
            v-layout(row)
              v-flex(current-language-container, used-language, no-hover)
                div(:class="currentLangInfo.vtelClass")
                span(
                  class="selected-lang-text"
                ) {{currentLangInfo.language}}
              v-flex(current-language-options-container)
                v-btn(
                  class="translation-actions-btn"
                  @click="onSelectOption('set-as-default')"
                  color="success"
                  small
                  round
                ) Set as default
                v-btn(
                  class="translation-actions-btn"
                  @click="onSelectOption('preview')"
                  color="success"
                  small
                  round
                ) Preview
      v-layout(row)
        v-flex(xs4, left-container)
          v-btn(
            @click="openAddLanguage"
            color="success"
            small
            outline
            round
          ) {{$t('builder.addLanguage')}}
          .used-language(
            v-for="(langInfo, key) in flagInfos"
            :key="key"
            :class="{ selected: currentLanguage === langInfo.localeCountry }"
            @click="onSelectCurrentLanguage(langInfo)"
          )
            div(:class="langInfo.vtelClass")
            span {{langInfo.language}}
            .action-block
              .action.remove-action(@click.stop.prevent="onRemoveLang(langInfo)")
                font-awesome-icon(:icon="timesCircleIcon")
        v-flex(xs8, right-container)
          .add-language(v-if="addingLanguage")
            .close-btn(
              @click="closeAddLanguage"
            )
              v-icon close
            .language-filter
              label
                span Filter
                input(
                  v-model="filterText"
                  placeholder="French"
                  class="form-control"
                )
            .used-language.all-list(
              v-for="(langInfo, key) in filteredLanguages"
              :key="key"
              :class="{ selected: usedLanguages.indexOf(langInfo.localeCountry) !== -1 }"
              @click="onUsedLangSelectionChange(langInfo)"
            )
              div(:class="langInfo.vtelClass")
              span {{langInfo.language}}
          .translation-panel(v-else)
            .translation-panel-body
              v-expansion-panel.translation(v-model="panel")
                v-expansion-panel-content(
                  v-for="pageData in pagesWithComponents"
                  :key="pageData.name"
                )
                  template.pa-0(v-slot:header).translation
                    .translation-page-label {{ pageData.name }}
                  v-card
                    .translation-page-components.pb-3.px-2
                      component(
                        v-for="(component, index) in pageData.children"
                        :component="component"
                        :lang="currentLanguage"
                        :default-lang="defaultLanguage"
                        :is="componentMapper(component.component)"
                        :config="component.config"
                        :index="component.id"
                        :key="index"
                      )
      v-layout(row powered-by-container)
        v-flex(xs4)
        v-flex(xs8)
          v-layout(row)
            v-flex(xs4)
              .translation-type
                label Powered by
            v-flex(xs8)
              powered-by(
                :component="poweredBy"
                :lang="currentLanguage"
                :default-lang="defaultLanguage"
                :config="poweredBy.config"
              )
      v-layout(row wrap pt-3)
        v-flex(xs12)
          v-btn(
            :loading="loading"
            @click="save"
            color="success"
            large
            round
            style="float: right"
          ) {{$t('builder.save')}}
          v-btn(
            @click="close"
            color="success"
            large
            outline
            round
            style="float: right"
          ) {{$t('general.cancel')}}
</template>

<script>
import baseDialog from '@/components/common/base-dialog'
import languages from './translations/languages'
import components from './translations'
import poweredBy from './translations/powered-by'
import translationOptionsSelector from './translation-options-selector'
import { createCopiedTranslation, updateFromCopiedTranslation } from '../translation-manager'
import { cloneDeep } from 'lodash'

export default {
  props: ['show', 'page', 'selectedPage', 'previewLang'],
  components: {
    ...components,
    poweredBy,
    baseDialog,
    translationOptionsSelector
  },
  data () {
    const pageSettings = this.page.config.settings
    return {
      filterText: '',
      loading: false,
      usedLanguages: [...pageSettings.supportLanguages],
      autoDetectLanguage: pageSettings.autoDetectLanguage,
      defaultLanguage: pageSettings.defaultLanguage,
      showLanguageSelectionBar: pageSettings.showLanguageSelectionBar,
      poweredBy: cloneDeep(pageSettings.poweredBy),
      currentLanguage: this.previewLang || 'fr_FR',
      languages,
      addingLanguage: false,
      panel: 0
    }
  },
  watch: {
    show (newVal) {
      if (newVal === true) {
        this.pagesWithComponents.forEach(pageData => {
          pageData.children.forEach(component => {
            createCopiedTranslation(component.config)
          })
        })
      }
    }
  },
  computed: {
    filteredLanguages () {
      if (!this.filterText || !this.filterText.length) {
        return languages
      }
      return languages.filter(lang => {
        if (JSON.stringify(lang).toLowerCase().indexOf(this.filterText.toLowerCase()) !== -1) {
          return true
        }
        return false
      })
    },
    timesCircleIcon () {
      return ['fas', 'times-circle']
    },
    flagInfos () {
      return this.usedLanguages.map(lang => languages.find(langInfo => langInfo.localeCountry === lang))
    },
    currentLangInfo () {
      return languages.find(langInfo => langInfo.localeCountry === this.currentLanguage)
    },
    pagesWithComponents () {
      // try {
      const cfgKeyToName = {
        guestForm: 'Guest Form',
        guestSocial: 'Guest Social',
        ticketing: 'Ticketing',
        codes: 'Codes',
        sponsorPage: 'Sponsor Page',
        sponsorCode: 'Sponsor Code',
        sponsorWait: 'Sponsor Wait',
        sponsorAuth: 'Sponsor Authorization',
        smsRegistration: 'SMS registration',
        smsAccessCode: 'SMS Access Code',
        wifiUnavailablePage: 'Wifi Unavailable Page',
        accessGrantedPage: 'Access Granted Page'
      }
      let pageKeys = [
        'guestForm',
        'ticketing',
        'codes',
        'guestSocial',
        'sponsorPage',
        'sponsorCode',
        'sponsorWait',
        'sponsorAuth',
        'smsRegistration',
        'smsAccessCode',
        'wifiUnavailablePage',
        'accessGrantedPage'
      ]
      let pagesWithComponents = []

      pageKeys.forEach(pK => {
        let pageInfo = this.page.config.pages[pK]
        if (!pageInfo) {
          return
        }
        let pageData = {
          name: cfgKeyToName[pK],
          key: pK,
          children: [...pageInfo.children]
        }

        pagesWithComponents.push(pageData)
      })
      return pagesWithComponents
      // } catch (err) {
      //   console.error(err)
      // }
    }
  },

  methods: {
    componentMapper (componentName) {
      let buttons = [
        'facebook-button',
        'instagram-button',
        'google-button',
        'linkedin-button',
        'twitter-button',
        'email-button',
        'submit-button'
      ]
      if (buttons.indexOf(componentName) !== -1) {
        return 'base-button'
      }
      let inputs = [
        'phone-input',
        'email-input',
        'password-input'
      ]
      if (inputs.indexOf(componentName) !== -1) {
        return 'text-input'
      }
      let links = [
        'base-link',
        'access-link',
        'link'
      ]
      if (links.indexOf(componentName) !== -1) {
        return 'base-link'
      }
      let noTrans = [
        'loader'
      ]
      if (noTrans.indexOf(componentName) !== -1) {
        return 'no-trans'
      }
      return componentName
    },
    close () {
      this.pagesWithComponents.forEach(pageData => {
        pageData.children.forEach(component => {
          updateFromCopiedTranslation(component.config)
        })
      })
      this.poweredBy = cloneDeep(this.page.config.settings.poweredBy)
      this.$emit('close')
    },
    save () {
      this.page.config.settings.supportLanguages = [...this.usedLanguages]
      this.page.config.settings.autoDetectLanguage = this.autoDetectLanguage
      this.page.config.settings.defaultLanguage = this.defaultLanguage
      this.page.config.settings.showLanguageSelectionBar = this.showLanguageSelectionBar
      this.page.config.settings.poweredBy = cloneDeep(this.poweredBy)
      this.$emit('save')
    },
    openAddLanguage () {
      this.addingLanguage = true
    },
    closeAddLanguage () {
      this.addingLanguage = false
    },
    onUsedLangSelectionChange (langInfo) {
      const localeCountry = langInfo.localeCountry
      const usedLangIdx = this.usedLanguages.indexOf(localeCountry)
      if (usedLangIdx === -1) {
        this.usedLanguages.push(localeCountry)
      } else {
        this.usedLanguages.splice(usedLangIdx, 1)
      }
    },
    onSelectCurrentLanguage (langInfo) {
      this.currentLanguage = langInfo.localeCountry
      this.addingLanguage = false
    },
    onRemoveLang (langInfo) {
      const lang = langInfo.localeCountry
      if (this.usedLanguages.length > 1) {
        const usedLangIdx = this.usedLanguages.indexOf(lang)
        this.usedLanguages.splice(usedLangIdx, 1)
        if (this.defaultLanguage === lang) {
          this.defaultLanguage = this.usedLanguages[0]
        }
      } else {
        alert('you shouldn\'t delete all languages')
      }
    },
    onSelectOption (optionName) {
      switch (optionName) {
        case 'set-as-default':
          this.defaultLanguage = this.currentLanguage
          break
        case 'remove':
          if (this.usedLanguages.length > 1) {
            const usedLangIdx = this.usedLanguages.indexOf(this.currentLanguage)
            this.usedLanguages.splice(usedLangIdx, 1)
            if (this.defaultLanguage === this.currentLanguage) {
              this.defaultLanguage = this.usedLanguages[0]
            }
          } else {
            alert('you shouldn\'t delete all languages')
          }
          break
        case 'preview':
          this.$emit('save')
          this.$emit('preview', this.currentLanguage)
          break
        default:
      }
    }
  }
}
</script>

<style lang="scss">

  .page-builder-translation-dialog {
    .left-container {
      max-height: 500px;
      min-height: 500px;
      overflow-y: scroll;
    }
    .right-container {
      min-height: 500px;
      max-height: 500px;
      overflow-y: scroll;
    }
    .used-language {
      position: relative;
      padding: 6px 12px;
      cursor: pointer;
      .flag {
        display: inline-block;
        margin-right: 10px;
      }
      &:hover {
        background: lightblue;
      }
      &.no-hover {
        background: transparent;
      }
      &.selected {
        background: lightblue;
        border-right: solid green 2px;
      }
      &.all-list {
        width: 50%;
        display: inline-block;
      }
    }
    .translation-panel {
      .translation-category-label {
        background: #9ba9c4;
        padding: 5px 10px;
        color: white;
        text-transform: uppercase;
      }

      .translation-category-sublabel {
        background: lightblue;
        padding: 5px 10px;
        color: white;
        text-transform: uppercase;
      }

      .form-control {
        height: 30px;
        background: white;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        width: 100%;
        padding: 5px 5px;
        outline: none;
      }

      textarea.form-control {
        height: auto;
      }

      .translation-type {
        margin-top: 10px;
      }
    }

    .translation-panel-header {
      border-radius: 1px;
      .flag {
        margin-bottom: 2px;
        margin-top: 5px;
      }
      .selected-lang-text {
        font-weight: bold;
        font-size: 22px;
      }
    }

    label {
      user-select: none;
      display: block;
      margin-bottom: 3px;
      input {
        margin-right: 5px;
      }
    }

    .translation-label {
      margin-left: 5px;
    }

    .translation-panel-body {
      .translation {
        .translation-page-label {
          margin-left: 10px;
        }
      }
    }

    .translation-actions-btn {
      font-size: 12px;
      height: 19px;
      margin: 15px 2px;
      float: right;
    }

    .action-block {
      position: absolute;
      top: 0;
      right: 0;
      cursor: pointer;
      transition: 0.2s all ease-in-out;
      display: flex;
      height: 100%;
      justify-content: space-between;
      align-items: center;
    }

    .used-language .action-block {
      opacity: 0;
    }

    .used-language:hover .action-block {
      opacity: 1;
    }

    .action-block .remove-action {
      color: #ec5f59;
      width: 20px;
      height: 20px;
    }
    .add-language {
      position: relative;
      padding-right: 25px;
      padding-top: 15px;
      .close-btn {
        position: absolute;
        right: 2px;
        top: 2px;
        cursor: pointer;
      }
    }
    .language-filter {
      label span {
        margin: 0 10px;
      }
      input {
        height: 30px;
        background: white;
        width: calc(100% - 100px);
        padding: 5px 5px;
        outline: none;
      }
    }
    .powered-by-container {
      margin-top: 10px;
    }
  }
</style>
