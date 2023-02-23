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
            config-key="title"
            label="builder.title"
          )
          .option-type.mt-2(v-if="hasIcon")
            v-checkbox(label="Show Icon", v-model="selectedItem.config.showIcon", color="primary")
    generic-style(:selected-item="selectedItem", :settings-config="settingsConfig")
    typography(:selected-item="selectedItem", :settings-config="settingsConfig")
</template>

<script>
import i18nTextType from '../option-types/i18n-text-type'
import textAlignment from '../option-types/text-alignment'
import fontFamily from '../option-types/font-family'
import fontWeight from '../option-types/font-weight'
import lineHeight from '../option-types/line-height'
import fontStyle from '../option-types/font-style'
import fontSize from '../option-types/font-size'
import textColor from '../option-types/text-color'
import backgroundColor from '../option-types/background-color'
import margin from '../option-types/margin'
import blockAlignment from '../option-types/block-alignment'
import position from '../option-types/position'
import padding from '../option-types/padding'
import wrapText from '../option-types/wrap-text'
import boxShadow from '../option-types/shadow/box-shdow'
import textShadow from '../option-types/shadow/text-shadow'
import borderWidth from '../option-types/border/width'
import borderColor from '../option-types/border/color'
import borderRadius from '../option-types/border/radius'
import borderStyle from '../option-types/border/style'

import typography from './shared/typography-option'
import genericStyle from './shared/generic-style-option'

export default {
  props: ['selectedItem', 'settingsConfig', 'lang', 'defaultLang', 'hasIcon'],

  components: {
    i18nTextType,
    textAlignment,
    fontStyle,
    lineHeight,
    fontFamily,
    fontWeight,
    fontSize,
    textColor,
    backgroundColor,
    margin,
    padding,
    position,
    blockAlignment,
    wrapText,
    boxShadow,
    borderWidth,
    borderRadius,
    borderStyle,
    borderColor,
    textShadow,
    typography,
    genericStyle
  },
  data () {
    return {
      panel: [true, false, false]
    }
  }
}
</script>
