<template lang="pug">
  .option-type
    label.option-label {{ $t(label) }}
    input.form-control(type="text", v-model="translated[configKey]")
</template>

<script>
import optionTranslationMixin from '../mixins/option-translation-mixin'
export default {
  mixins: [
    optionTranslationMixin
  ],
  props: ['selectedItem', 'lang', 'defaultLang', 'label', 'configKey']
}
</script>
