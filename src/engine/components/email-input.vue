<template lang="pug">
  base-text-input.email-input(
    :index="index"
    :config="config"
    :lang="lang"
    :page-config="pageConfig"
    type="email"
    @input="triggerInput"
    @valid="validateInput"
  )
</template>

<script>
import baseTextInput from './text-input'

export default {
  props: ['index', 'config', 'pageConfig', 'lang'],
  components: {
    baseTextInput
  },
  methods: {
    triggerInput (val) {
      this.$emit('input', val)
    },
    validateInput (val) {
      this.$emit('valid', val)
    }
  }
}
</script>
