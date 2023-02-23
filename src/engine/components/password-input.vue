<template lang="pug">
  base-text-input.password-input(
    type="password"
    :index="index"
    :config="config"
    :lang="lang"
    :page-config="pageConfig"
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
