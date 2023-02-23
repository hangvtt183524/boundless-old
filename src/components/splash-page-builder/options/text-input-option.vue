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
          text-type(:selected-item="selectedItem", config-key="fieldName", label="builder.fieldName" :disabled="!selectedItem.dynamic")
          .option-type.mt-2
            v-checkbox(:label="$t('builder.requiredField')", v-model="selectedItem.config.fieldRequired", color="primary", hide-details)
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
import textType from '../option-types/text-type'
import i18nTextType from '../option-types/i18n-text-type'
import textAlignment from '../option-types/text-alignment'
import fontFamily from '../option-types/font-family'
import fontWeight from '../option-types/font-weight'
import fontStyle from '../option-types/font-style'
import lineHeight from '../option-types/line-height'
import fontSize from '../option-types/font-size'
import textColor from '../option-types/text-color'
import backgroundColor from '../option-types/background-color'
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
    textType,
    i18nTextType,
    textAlignment,
    fontFamily,
    fontWeight,
    fontStyle,
    fontSize,
    textColor,
    lineHeight,
    backgroundColor,
    margin,
    position,
    borderWidth,
    borderRadius,
    borderStyle,
    borderColor,
    blockAlignment,
    padding,
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
