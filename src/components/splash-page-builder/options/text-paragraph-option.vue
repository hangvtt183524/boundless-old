<template lang="pug">
  v-expansion-panel.option(v-model="panel", expand)
    v-expansion-panel-content
      template.pa-0(v-slot:header).option
        .option-category-label {{ $t('builder.content') }}
      v-card
        .option-category-body.pb-3.px-2
          i18n-text-paragraph(
            :selected-item="selectedItem"
            :lang="lang"
            :default-lang="defaultLang"
            label="builder.title"
            config-key="title"
          )
    generic-style(:selected-item="selectedItem", :settings-config="settingsConfig")
    typography(:selected-item="selectedItem", :settings-config="settingsConfig")
</template>

<script>
import i18nTextParagraph from '../option-types/i18n-text-paragraph'
import textAlignment from '../option-types/text-alignment'
import fontFamily from '../option-types/font-family'
import fontWeight from '../option-types/font-weight'
import fontSize from '../option-types/font-size'
import lineHeight from '../option-types/line-height'
import fontStyle from '../option-types/font-style'
import textColor from '../option-types/text-color'
import margin from '../option-types/margin'
import padding from '../option-types/padding'
import blockAlignment from '../option-types/block-alignment'
import position from '../option-types/position'
import textShadow from '../option-types/shadow/text-shadow'
import borderWidth from '../option-types/border/width'
import borderColor from '../option-types/border/color'
import borderRadius from '../option-types/border/radius'
import borderStyle from '../option-types/border/style'

import typography from './shared/typography-option'
import genericStyle from './shared/generic-style-option'

export default {
  props: ['selectedItem', 'settingsConfig', 'lang', 'defaultLang'],

  components: {
    i18nTextParagraph,
    textAlignment,
    fontFamily,
    fontWeight,
    fontStyle,
    fontSize,
    lineHeight,
    textColor,
    margin,
    padding,
    position,
    borderWidth,
    borderRadius,
    borderStyle,
    borderColor,
    blockAlignment,
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

    .icon {
      color: #9ba9c4;
      font-size: 20px;
    }

    &.active {
      border: 1px solid #4b83f0;

      .icon {
        color: #4b83f0;
      }
    }
  }
}
</style>
