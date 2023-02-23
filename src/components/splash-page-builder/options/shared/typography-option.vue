<template lang="pug">
  v-expansion-panel-content
    template.pa-0(v-slot:header).option
      .option-category-label {{ $t('builder.typography') }}
    v-card
      .option-category-body.pb-3.px-2
        text-alignment(:selected-item="selectedItem")
        font-style(:selected-item="selectedItem", :settings-config="settingsConfig")
        font-family(:selected-item="selectedItem", :settings-config="settingsConfig")
        font-weight(:selected-item="selectedItem", :settings-config="settingsConfig")
        font-size(:selected-item="selectedItem", :settings-config="settingsConfig")
        line-height(:selected-item="selectedItem", :settings-config="settingsConfig")
        wrap-text(:selected-item="selectedItem")
        text-color(:selected-item="selectedItem", :settings-config="settingsConfig")
        text-color(v-if="!!selectedItem.config.linkColor" :selected-item="selectedItem", :settings-config="settingsConfig", config-key="linkColor", label="builder.linkColor")
        text-shadow(:selected-item="selectedItem")
        background-color(:selected-item="selectedItem")
        placeholder-color(:selected-item="selectedItem" v-if="showPlaceholderOptions")
        placeholder-opacity(:selected-item="selectedItem" v-if="showPlaceholderOptions")
</template>

<script>
import textAlignment from '../../option-types/text-alignment'
import fontFamily from '../../option-types/font-family'
import fontWeight from '../../option-types/font-weight'
import fontStyle from '../../option-types/font-style'
import lineHeight from '../../option-types/line-height'
import fontSize from '../../option-types/font-size'
import textColor from '../../option-types/text-color'
import wrapText from '../../option-types/wrap-text'
import textShadow from '../../option-types/shadow/text-shadow'
import backgroundColor from '../../option-types/background-color'
import placeholderColor from '../../option-types/placeholder-color'
import placeholderOpacity from '../../option-types/placeholder-opacity'

export default {
  props: ['selectedItem', 'settingsConfig'],
  components: {
    textAlignment,
    fontFamily,
    fontStyle,
    fontWeight,
    fontSize,
    lineHeight,
    textColor,
    wrapText,
    textShadow,
    backgroundColor,
    placeholderColor,
    placeholderOpacity
  },

  data () {
    return {
    }
  },

  computed: {
    showPlaceholderOptions () {
      console.log('showPlaceholderOptions', this.selectedItem)
      switch (this.selectedItem.component) {
        case 'text-input':
        case 'email-input':
        case 'password-input':
        case 'phone-input':
        case 'tel-input':
          return true
        default:
          return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
