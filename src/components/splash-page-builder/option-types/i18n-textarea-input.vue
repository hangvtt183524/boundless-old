<template lang="pug">
  .option-type
    label.option-label {{ $t(label) }}
    textarea.form-control(
      v-model="translated[configKey]"
      :style="textAreaStyle"
    )
</template>

<script>
import optionTranslationMixin from '../mixins/option-translation-mixin'
export default {
  mixins: [
    optionTranslationMixin
  ],
  props: {
    selectedItem: {
      type: Object
    },
    lang: {
      type: String
    },
    defaultLang: {
      type: String
    },
    label: {
      type: String,
      default: 'builder.title'
    },
    configKey: {
      type: String,
      default: 'title'
    },
    minHeight: {
      type: String,
      default: '60px'
    }
  },
  computed: {
    textAreaStyle () {
      return {
        'min-height': this.minHeight
      }
    }
  }
}
</script>
