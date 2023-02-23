<template lang="pug">
  v-expansion-panel.option(v-model="panel", expand)
    v-expansion-panel-content
      template.pa-0(v-slot:header).option
        .option-category-label {{ $t('builder.content') }}
      v-card
        .option-category-body.pb-3.px-2
          i18nTextAreaInput(
            :selected-item="selectedItem"
            :lang="lang"
            :default-lang="defaultLang"
            config-key="label"
            label="builder.label"
            min-height="90px"
          )
          text-type(:selected-item="selectedItem", config-key="fieldName", label="builder.fieldName")
          .option-type.mt-2
            v-checkbox(
              :label="$t('builder.requiredField')",
              v-model="selectedItem.config.fieldRequired",
              color="primary",
              hide-details
            )
    generic-style(:selected-item="selectedItem", :settings-config="settingsConfig")
    typography(:selected-item="selectedItem", :settings-config="settingsConfig")
    v-expansion-panel-content(v-for="(link, index) in translated.links" :key="index")
      template.pa-0(v-slot:header).option
        .option-category-label Link {{index + 1}}
      v-card
        .option-category-body-1.pb-3.px-2
          link-type(:selected-item="selectedItem" :link="link")
          v-btn(@click.prevent="showCGUModal=true;", v-if="link.type === 'modal'") Edit Content
          link-external(@close="closeCGUModal" :selected-item="selectedItem" :link="link", v-if="link && link.type === 'external_link'")
          link-internal(
            @close="closeCGUModal"
            v-if="link.type === 'internal_link'"
            :selected-item="selectedItem"
            :link="link"
            :selected-page="selectedPage"
          )
          base-dialog(
            :persistent="true"
            :show="showCGUModal"
            @close="closeCGUModal"
            max-width="920"
          )
            link-modal(@close="closeCGUModal" :selected-item="selectedItem" :link="link", v-if="link && link.type === 'modal'")
</template>

<script>
import textType from '../option-types/text-type'
import i18nTextAreaInput from '../option-types/i18n-textarea-input'
import textAlignment from '../option-types/text-alignment'
import fontFamily from '../option-types/font-family'
import fontWeight from '../option-types/font-weight'
import fontSize from '../option-types/font-size'
import lineHeight from '../option-types/line-height'
import fontStyle from '../option-types/font-style'
import textColor from '../option-types/text-color'
import margin from '../option-types/margin'
import padding from '../option-types/padding'
import backgroundColor from '../option-types/background-color'
import linkType from '../option-types/link/link-type'
import linkModal from '../option-types/link/link-modal'
import linkInternal from '../option-types/link/link-internal'
import linkExternal from '../option-types/link/link-external'
import wrapText from '../option-types/wrap-text'
import blockAlignment from '../option-types/block-alignment'
import position from '../option-types/position'
import textShadow from '../option-types/shadow/text-shadow'
import borderWidth from '../option-types/border/width'
import borderColor from '../option-types/border/color'
import borderRadius from '../option-types/border/radius'
import borderStyle from '../option-types/border/style'

import typography from './shared/typography-option'
import genericStyle from './shared/generic-style-option'
import optionTranslationMixin from '../mixins/option-translation-mixin'

export default {
  props: ['selectedItem', 'settingsConfig', 'lang', 'defaultLang', 'selectedPage'],
  mixins: [
    optionTranslationMixin
  ],
  data () {
    return {
      showCGUModal: false,
      curDlgLink: null,
      panel: [true, false, false]
    }
  },
  components: {
    textType,
    i18nTextAreaInput,
    textAlignment,
    fontFamily,
    fontWeight,
    fontSize,
    textColor,
    backgroundColor,
    linkType,
    fontStyle,
    borderWidth,
    borderRadius,
    borderStyle,
    borderColor,
    lineHeight,
    linkModal,
    linkInternal,
    linkExternal,
    wrapText,
    margin,
    position,
    blockAlignment,
    padding,
    textShadow,
    typography,
    genericStyle
  },

  watch: {
    linkCount () {
      if (this.linkCount !== this.translated.links.length) {
        this.updateSelectedItemLinks()
      }
    },
    lang () {
      if (this.linkCount !== this.translated.links.length) {
        this.updateSelectedItemLinks()
      }
    }
  },

  methods: {
    closeCGUModal () {
      this.showCGUModal = false
    },
    updateSelectedItemLinks () {
      if (!this.translated.links) {
        this.translated.links = []
      }

      for (let i = 0; i < this.linkCount; i++) {
        if (typeof this.translated.links[i] === 'undefined') {
          let newLink = {
            type: 'internal_link',
            title: '',
            content: '',
            externalUrl: '',
            internalPage: ''
          }

          this.$set(this.translated.links, i, newLink)
        }
      }
      if (this.translated.links.length > this.linkCount) {
        this.translated.links.splice(this.linkCount)
      }
    }
  },

  computed: {
    linkCount () {
      const re = /<(.*?)>/g
      return ((this.translated.label || '').match(re) || []).length
    }
  }
}
</script>
