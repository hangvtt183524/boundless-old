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
            config-key="placeholder"
            label="builder.placeholder"
          )
          .option-type.mt-2
            v-checkbox(:label="$t('builder.showLabel')", v-model="selectedItem.config.showLabel", color="primary", hide-details)
          .mt-2(v-show="selectedItem.config.showLabel")
            i18n-text-type(
              :selected-item="selectedItem"
              :lang="lang"
              :default-lang="defaultLang"
              config-key="label"
              label="builder.label"
            )
          select-options(
            :selected-item="selectedItem"
            :lang="lang"
            :default-lang="defaultLang"
          )
    v-expansion-panel-content(v-show="selectedItem.config.showLabel")
      template.pa-0(v-slot:header).option
        .option-category-label {{ $t('builder.labelTypography') }}
      v-card
        .option-category-body.pb-3.px-2
          text-alignment(:selected-item="selectedItem", config-key="labelTextAlignment")
          font-style(:selected-item="selectedItem", config-key="labelFontStyle")
          font-family(:selected-item="selectedItem", :settings-config="settingsConfig", config-key="labelFontFamily")
          font-weight(:selected-item="selectedItem", config-key="labelFontWeight")
          font-size(:selected-item="selectedItem", config-key="labelFontSize")
          line-height(:selected-item="selectedItem", :settings-config="settingsConfig")
          text-color(:selected-item="selectedItem", config-key="labelColor")
          background-color(:selected-item="selectedItem", config-key="labelBackgroundColor")
    v-expansion-panel-content(v-show="selectedItem.config.showLabel")
      template.pa-0(v-slot:header).option
        .option-category-label {{ $t('builder.labelMargin') }}
      v-card
        .option-category-body.pb-3.px-2
          margin(:selected-item="selectedItem", config-key="labelMargin")
    generic-style(:selected-item="selectedItem", :settings-config="settingsConfig")
    typography(:selected-item="selectedItem", :settings-config="settingsConfig")
</template>

<script>
import i18nTextType from '../option-types/i18n-text-type'
import textAlignment from '../option-types/text-alignment'
import fontFamily from '../option-types/font-family'
import fontWeight from '../option-types/font-weight'
import fontSize from '../option-types/font-size'
import fontStyle from '../option-types/font-style'
import textColor from '../option-types/text-color'
import lineHeight from '../option-types/line-height'
import backgroundColor from '../option-types/background-color'
import margin from '../option-types/margin'
import padding from '../option-types/padding'
import selectOptions from '../option-types/select-options'
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

export default {
  props: ['selectedItem', 'settingsConfig', 'lang', 'defaultLang'],

  components: {
    i18nTextType,
    textAlignment,
    fontFamily,
    fontWeight,
    fontSize,
    fontStyle,
    lineHeight,
    textColor,
    backgroundColor,
    margin,
    padding,
    selectOptions,
    position,
    borderWidth,
    borderRadius,
    borderStyle,
    borderColor,
    blockAlignment,
    wrapText,
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
