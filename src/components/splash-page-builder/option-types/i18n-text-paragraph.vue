<template lang="pug">
  .option-type
    label.option-label {{ $t(label) }}
    textarea.form-control(v-model="translated[configKey]")
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
    }
  }
}
</script>
