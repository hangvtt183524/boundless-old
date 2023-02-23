<template lang="pug">
  v-expansion-panel-content
    template.pa-0(v-slot:header)
      .option-category-label {{ $t('builder.genericStyle') }}
    v-card
      .option-category-sublabel {{ $t('builder.blockAlignment') }}
      .option-category-body.pb-3.px-2
        block-alignment(:selected-item="selectedItem")
    v-card
      .option-category-sublabel {{ $t('builder.position') }}
      .option-category-body.pb-3.px-2
        position(:selected-item="selectedItem", :settings-config="settingsConfig")
    v-card
      .option-category-sublabel {{ $t('builder.margin') }}
      .option-category-body.pb-3.px-2
        margin(:selected-item="selectedItem", :settings-config="settingsConfig")
    v-card
      .option-category-sublabel {{ $t('builder.padding') }}
      .option-category-body.pb-3.px-2
        padding(:selected-item="selectedItem", :settings-config="settingsConfig")
    v-card
      .option-category-sublabel {{ $t('builder.border') }}
      .option-category-body.pb-3.px-2
        borderWidth(:selected-item="selectedItem")
        borderRadius(:selected-item="selectedItem")
        borderStyle(:selected-item="selectedItem", :settings-config="settingsConfig")
        borderColor(:selected-item="selectedItem", :settings-config="settingsConfig")
    v-card(v-if="selectedItem.config.boxShadow")
      .option-category-sublabel {{ $t('builder.shadow') }}
      .option-category-body.pb-3.px-2
        box-shadow(:selected-item="selectedItem")
    v-card
      .option-category-sublabel {{ $t('builder.color') }}
      .option-category-body.pb-3.px-2
        background-color(:selected-item="selectedItem")
    v-card
      .option-category-sublabel {{ $t('builder.size') }}
      .option-category-body.pb-3.px-2
        dimensions(:selected-item="selectedItem", ref="dimensions")
        aspect-ratio(:selected-item="selectedItem")
</template>

<script>
import margin from '../../option-types/margin'
import padding from '../../option-types/padding'
import position from '../../option-types/position'
import borderWidth from '../../option-types/border/width'
import borderColor from '../../option-types/border/color'
import borderRadius from '../../option-types/border/radius'
import borderStyle from '../../option-types/border/style'
import boxShadow from '../../option-types/shadow/box-shdow'
import backgroundColor from '../../option-types/background-color'
import blockAlignment from '../../option-types/block-alignment'
import dimensions from '../../option-types/dimensions'
import aspectRatio from '../../option-types/aspect_ratio'

export default {
  props: ['selectedItem', 'settingsConfig'],
  components: {
    margin,
    padding,
    position,
    borderWidth,
    borderRadius,
    borderStyle,
    borderColor,
    boxShadow,
    backgroundColor,
    blockAlignment,
    dimensions,
    aspectRatio
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
