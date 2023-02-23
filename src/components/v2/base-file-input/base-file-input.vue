<template lang="pug">
    .base-file-input
      base-button.base-button--blue(
        @click="$refs.fileInput.click()"
        :disabled="disabled"
      ) {{ label ? label : $t('general.chooseFile') }}
      span.base-file-input__file-name(
        v-if="value"
      )
        | {{ value.name }}
      input(
        type="file"
        ref="fileInput"
        @input="onFileElementInput"
        :accept="accept"
        hidden
      )
</template>

<script>
import BaseButton from '../base-button/base-button'

export default {
  name: 'base-file-input',
  components: { BaseButton },
  props: {
    value: {
      default: null
    },
    label: {
      type: String,
      default: ''
    },
    accept: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onFileElementInput (event) {
      this.$emit('input', event.target.files[0])
    }
  }
}
</script>

<style src="./base-file-input.scss" lang="scss" scoped></style>
