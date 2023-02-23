<template lang="pug">
  v-expansion-panel.option(v-model="panel", expand)
    v-expansion-panel-content
      template.pa-0(v-slot:header).option
        .option-category-label {{ $t('builder.layout') }}
      v-card
        .option-category-body.pb-3.px-2
          font-size(:selected-item="selectedItem", :settings-config="settingsConfig", label="builder.loaderSize")
          line-height(:selected-item="selectedItem", :settings-config="settingsConfig")
          font-style(:selected-item="selectedItem", :settings-config="settingsConfig")
          text-color(:selected-item="selectedItem", :settings-config="settingsConfig", label="builder.loaderColor")
          background-color(:selected-item="selectedItem", :settings-config="settingsConfig")
          loader-type(:selected-item="selectedItem", :settings-config="settingsConfig")
    generic-style(:selected-item="selectedItem", :settings-config="settingsConfig")
</template>

<script>
import textAlignment from '../option-types/text-alignment'
import fontFamily from '../option-types/font-family'
import fontWeight from '../option-types/font-weight'
import fontStyle from '../option-types/font-style'
import lineHeight from '../option-types/line-height'
import fontSize from '../option-types/font-size'
import textColor from '../option-types/text-color'
import backgroundColor from '../option-types/background-color'
import loaderType from '../option-types/loader-type'
import margin from '../option-types/margin'
import padding from '../option-types/padding'
import blockAlignment from '../option-types/block-alignment'
import position from '../option-types/position'
import boxShadow from '../option-types/shadow/box-shdow'
import borderWidth from '../option-types/border/width'
import borderColor from '../option-types/border/color'
import borderRadius from '../option-types/border/radius'
import borderStyle from '../option-types/border/style'

import genericStyle from './shared/generic-style-option'
export default {
  props: ['selectedItem', 'settingsConfig', 'lang', 'defaultLang', 'hasIcon'],

  components: {
    textAlignment,
    fontStyle,
    fontFamily,
    fontWeight,
    fontSize,
    lineHeight,
    textColor,
    backgroundColor,
    margin,
    padding,
    position,
    borderWidth,
    borderRadius,
    borderStyle,
    borderColor,
    blockAlignment,
    loaderType,
    boxShadow,
    genericStyle
  },
  data () {
    return {
      panel: [true, false, false]
    }
  }
}
</script>
