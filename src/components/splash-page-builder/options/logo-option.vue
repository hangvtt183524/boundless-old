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
          //- dimensions(:selected-item="selectedItem", ref="dimensions")
          //- aspect-ratio(:selected-item="selectedItem")
    v-expansion-panel-content
      template.pa-0(v-slot:header)
        .option-category-label {{ $t('builder.logo') }}
      v-card
        .option-category-body.pb-3.px-2
          logo(:selected-item="selectedItem", @logo-changed="$refs.dimensions.setItem()")
    generic-style(:selected-item="selectedItem", :settings-config="settingsConfig")
</template>

<script>
import i18nTextType from '../option-types/i18n-text-type'
import dimensions from '../option-types/dimensions'
import margin from '../option-types/margin'
import padding from '../option-types/padding'
import position from '../option-types/position'
import logo from '../option-types/logo'
import borderWidth from '../option-types/border/width'
import borderColor from '../option-types/border/color'
import borderRadius from '../option-types/border/radius'
import borderStyle from '../option-types/border/style'
import aspectRatio from '../option-types/aspect_ratio'
import blockAlignment from '../option-types/block-alignment'
import boxShadow from '../option-types/shadow/box-shdow'

import genericStyle from './shared/generic-style-option'

export default {
  props: ['selectedItem', 'settingsConfig', 'lang', 'defaultLang'],
  components: {
    i18nTextType,
    dimensions,
    margin,
    padding,
    logo,
    aspectRatio,
    borderWidth,
    borderRadius,
    borderStyle,
    borderColor,
    position,
    blockAlignment,
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
<style lang="scss" scoped>
.v-expansion-panel__header {
  padding: 0
}
</style>
