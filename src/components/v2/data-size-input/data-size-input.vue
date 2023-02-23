<template lang="pug">
  .data-size-input
    label.data-size-input__label(
      v-if="label"
    ) {{ label }}
    .data-size-input__input-container(
      v-show="isSmall !== null"
    )
      base-text-input(
        :value="activeValue"
        @input="onActiveValueInput"
        v-bind="positiveIntegerInputProps"
        :class="{'base-text-input--small': isSmall}"
        :disabled="disabled"
        :validations="{required: true}"
        :show-validation-state="showValidationState"
        :suppress-validation-state-display="suppressValidationStateDisplay"
      )
      base-select(
        :items="sizeUnitOptions"
        :value="selectedSizeMultiplier"
        @input="onMultiplierInput"
        :class="{'base-select--small': isSmall}"
        :disabled="disabled"
      )

</template>

<script>
import BaseTextInput from '../base-text-input/base-text-input'
import BaseSelect from '../base-select/base-select'
import _ from 'lodash'
import { POSITIVE_INTEGER_INPUT_PROPS } from '@/constants/form-fields'

export default {
  name: 'data-size-input',
  components: { BaseSelect, BaseTextInput },
  props: {
    value: {
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
    showValidationState: {
      type: Boolean,
      default: false
    },
    suppressValidationStateDisplay: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      sizeUnitOptions: [
        { key: 1, name: 'KB' },
        { key: 1024, name: 'MB' },
        { key: 1024 * 1024, name: 'GB' },
        { key: 1024 * 1024 * 1024, name: 'TB' }
      ],
      selectedSizeMultiplier: 1,
      isSmall: null,
      positiveIntegerInputProps: POSITIVE_INTEGER_INPUT_PROPS
    }
  },
  mounted () {
    // Get initial size multiplier depending on value
    this.setInitialSizeMultiplier()

    // Set is-small field depending on element classes
    this.setIsSmall()
  },
  computed: {
    activeValue () {
      return !_.isNil(this.value) ? (this.value / this.selectedSizeMultiplier) : null
    }
  },
  methods: {
    onActiveValueInput (value) {
      this.$emit('input', value * this.selectedSizeMultiplier)
    },
    onMultiplierInput (value) {
      const valueChangeMultiplier = value / this.selectedSizeMultiplier

      // Update value first, then change multiplier
      this.$emit('input', this.value * valueChangeMultiplier)
      this.$set(this, 'selectedSizeMultiplier', value)
    },
    setIsSmall () {
      // Can't use a computed property for this as $el is undefined before mounted
      this.$set(this, 'isSmall', this.$el.classList.contains('data-size-input--small'))
    },
    setInitialSizeMultiplier () {
      if (_.isNil(this.value)) {
        this.$set(this, 'selectedSizeMultiplier', this.sizeUnitOptions[0].key)
      } else if (this.value > this.sizeUnitOptions[3].key) {
        this.$set(this, 'selectedSizeMultiplier', this.sizeUnitOptions[3].key)
        return this.sizeUnitOptions[3].key
      } else if (this.value > this.sizeUnitOptions[2].key) {
        this.$set(this, 'selectedSizeMultiplier', this.sizeUnitOptions[2].key)
      } else if (this.value > this.sizeUnitOptions[1].key) {
        this.$set(this, 'selectedSizeMultiplier', this.sizeUnitOptions[1].key)
      } else {
        this.$set(this, 'selectedSizeMultiplier', this.sizeUnitOptions[0].key)
      }
    }
  }
}
</script>

<style src="./data-size-input.scss" lang="scss" scoped></style>
