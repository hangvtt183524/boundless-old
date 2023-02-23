<template lang="pug">
  div.base-text-area(
    :class="[{'base-text-area--invalid': isValidationStateVisible && !isValid}, {'base-text-area--required': isRequired}]"
  )
    label(
      class="base-text-label"
      v-if="label"
    ) {{ label }}
    div.base-text-area__input-container
      textarea(
        :value="value"
        @input="$emit('input', $event.target.value)"
        @blur="onBlur"
        @focus="$emit('focus')"
        :placeholder="placeholder"
        :disabled="disabled"
        :rows="rows"
      )
    div.base-text-area__error-container(
      v-if="errors && errors.length > 0 && touched"
    )
      div.base-text-area__error-container__error(
        v-for="(error, index) of errors"
        :key="index"
      ) {{ error }}
</template>

<script>
import FormFieldValidationMixin from '@/mixins/form-field-validation.mixin'

export default {
  mixins: [
    FormFieldValidationMixin
  ],
  props: {
    value: {
      type: String,
      default: ''
    },
    rows: {
      type: Number,
      default: 3
    },
    placeholder: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style src="./base-text-area.scss" lang="scss" scoped></style>
