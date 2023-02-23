<template lang="pug">
  .base-switch-container
    label.base-switch-label(
      v-if="label"
    ) {{ label }}
    .base-switch(
      :class="[{'base-switch--disabled': disabled}, {'base-switch--fluid': (!!yesLabel || !!noLabel)}]"
    )
      .base-switch__options
        .base-switch__option.yes-option(
          :class="{'base-switch__option--active': value === true}"
          @click="onOptionClick(true)"
        ) {{ yesLabel ? yesLabel : $t('general.yes') }}
        .base-switch__option.yes-option(
          :class="{'base-switch__option--active': value === false}"
          @click="onOptionClick(false)"
        ) {{ noLabel ? noLabel : $t('general.no') }}

      v-icon.base-switch__clear-icon(
        v-if="clearActionVisible"
        @click.stop="onClearClick()"
      ).clear-icon
        | close

</template>

<script>
import ClearableFormFieldMixin from '@/mixins/clearable-form-field.mixin'

export default {
  name: 'base-switch',
  mixins: [
    ClearableFormFieldMixin
  ],
  props: {
    value: {
      type: Boolean,
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    yesLabel: {
      type: String,
      required: false
    },
    noLabel: {
      type: String,
      required: false
    }
  },
  methods: {
    onOptionClick (value) {
      if (this.disabled) {
        return
      }

      this.$emit('input', value)
    }
  }
}
</script>

<style src="./base-switch.scss" lang="scss" scoped></style>
