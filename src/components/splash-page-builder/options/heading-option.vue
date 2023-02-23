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
            label="builder.title"
            config-key="title"
          )
    generic-style(:selected-item="selectedItem", :settings-config="settingsConfig")
    typography(:selected-item="selectedItem", :settings-config="settingsConfig")
    v-expansion-panel-content(v-for="(link, index) in translated.links" :key="index")
      template.pa-0(v-slot:header).option
        .option-category-label Link {{index + 1}}
      v-card
        .option-category-body-1.pb-3.px-2
          link-type(:selected-item="selectedItem" :link="link")
          link-modal(:selected-item="selectedItem" :link="link", v-if="link.type === 'modal'")
          link-external(:selected-item="selectedItem" :link="link", v-if="link.type === 'external_link'")
          link-internal(
            v-if="link.type === 'internal_link'"
            :selected-item="selectedItem"
            :link="link"
            :selected-page="selectedPage"
          )
</template>

<script>
import i18nTextAreaInput from '../option-types/i18n-textarea-input'
import textAlignment from '../option-types/text-alignment'
import fontFamily from '../option-types/font-family'
import fontWeight from '../option-types/font-weight'
import fontStyle from '../option-types/font-style'
import lineHeight from '../option-types/line-height'
import fontSize from '../option-types/font-size'
import textColor from '../option-types/text-color'
import margin from '../option-types/margin'
import padding from '../option-types/padding'
import linkType from '../option-types/link/link-type'
import linkModal from '../option-types/link/link-modal'
import linkInternal from '../option-types/link/link-internal'
import linkExternal from '../option-types/link/link-external'
import wrapText from '../option-types/wrap-text'
import backgroundColor from '../option-types/background-color'
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
  beforeMount () {
    if (!this.translated.links) {
      this.updateSelectedItemLinks()
    }
  },

  components: {
    i18nTextAreaInput,
    textAlignment,
    fontFamily,
    fontStyle,
    fontWeight,
    fontSize,
    lineHeight,
    textColor,
    margin,
    padding,
    linkType,
    linkModal,
    linkInternal,
    borderWidth,
    borderRadius,
    borderStyle,
    borderColor,
    linkExternal,
    wrapText,
    position,
    blockAlignment,
    backgroundColor,
    textShadow,
    typography,
    genericStyle
  },

  data () {
    return {
      panel: [true, false, false],
      alignments: [
        {
          name: 'left',
          icon: 'fas fa-align-left'
        },
        {
          name: 'center',
          icon: 'fas fa-align-center'
        },
        {
          name: 'right',
          icon: 'fas fa-align-right'
        },
        {
          name: 'justify',
          icon: 'fas fa-align-justify'
        }
      ]
    }
  },
  watch: {
    linkCount () {
      if (this.linkCount !== this.translated.length) {
        this.updateSelectedItemLinks()
      }
    },
    lang () {
      if (this.linkCount !== this.translated.length) {
        this.updateSelectedItemLinks()
      }
    }
  },

  methods: {
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
    links () {
      if (this.translated.links.length !== this.linkCount) {
        this.updateSelectedItemLinks()
      }
      return this.translated.links
    },
    linkCount () {
      const re = /<(.*?)>/g
      return ((this.translated.title || '').match(re) || []).length
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/colors.scss";
@import "styles/v2/colors.scss";

.alignment-buttons {
  display: flex;
  width: 100%;

  .align-button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 2px;
    background: white;
    padding: 5px;
    border: 1px solid $gray-xlight;

    .v-icon {
      color: #9ba9c4;
      font-size: 20px;
    }

    &.active {
      border: 1px solid #4b83f0;

      .v-icon {
        color: #4b83f0;
      }
    }
  }
}
</style>
