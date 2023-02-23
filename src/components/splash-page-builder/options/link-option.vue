<template lang="pug">
  v-expansion-panel.option(v-model="panel", expand)
    v-expansion-panel-content
      template.pa-0(v-slot:header).option
        .option-category-label {{ $t('builder.content') }}
      v-card
        .option-category-body.pb-3.px-2
          i18n-text-type(
            :selected-item="selectedItem"
            :lang="lang"
            :default-lang="defaultLang"
            label="builder.title"
            config-key="title"
          )
    generic-style(:selected-item="selectedItem", :settings-config="settingsConfig")
    typography(:selected-item="selectedItem", :settings-config="settingsConfig")
    v-expansion-panel-content
      template.pa-0(v-slot:header).option
        .option-category-label Link
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
import i18nTextType from '../option-types/i18n-text-type'
import textAlignment from '../option-types/text-alignment'
import fontFamily from '../option-types/font-family'
import fontWeight from '../option-types/font-weight'
import fontSize from '../option-types/font-size'
import lineHeight from '../option-types/line-height'
import fontStyle from '../option-types/font-style'
import textColor from '../option-types/text-color'
import blockAlignment from '../option-types/block-alignment'
import position from '../option-types/position'
import wrapText from '../option-types/wrap-text'
import textShadow from '../option-types/shadow/text-shadow'
import borderWidth from '../option-types/border/width'
import borderColor from '../option-types/border/color'
import borderRadius from '../option-types/border/radius'
import borderStyle from '../option-types/border/style'

import typography from './shared/typography-option'
import genericStyle from './shared/generic-style-option'
import linkType from '../option-types/link/link-type'
import linkExternal from '../option-types/link/link-external'
import linkInternal from '../option-types/link/link-internal'
import linkModal from '../option-types/link/link-modal'
import optionTranslationMixin from '../mixins/option-translation-mixin'

export default {
  props: ['selectedItem', 'settingsConfig', 'lang', 'defaultLang', 'selectedPage'],

  mixins: [
    optionTranslationMixin
  ],

  components: {
    i18nTextType,
    textAlignment,
    fontFamily,
    fontWeight,
    lineHeight,
    fontSize,
    fontStyle,
    textColor,
    position,
    borderWidth,
    borderRadius,
    borderStyle,
    borderColor,
    blockAlignment,
    wrapText,
    textShadow,
    linkType,
    linkModal,
    linkInternal,
    linkExternal,
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
      ],
      showCGUModal: false,
    }
  },

  computed: {
    link () {
      return this.selectedItem.config.link
    }
  },

  methods: {
    closeCGUModal () {
      this.showCGUModal = false
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
