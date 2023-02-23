<template lang="pug">
  .date-picker
    base-text-input(
      :class="{'base-text-input--small': isSmall}"
      :value="value"
      @input="$emit('input', $event)"
      @focus="onTextInputFocus()"
      @blur="onTextInputBlur()"
      :placeholder="placeholder"
      :label="label"
      :disabled="disabled"
      :validations="validations"
      :show-validation-state="showValidationState"
      :suppress-validation-state-display="suppressValidationStateDisplay"
      type="text"
    )
      v-icon(
        @click="onClearClick"
      ) close

    v-date-picker(
      v-show="isDatePickerVisible"
      v-click-outside="onDatePickerClickOutside"
      :value="value"
      no-title
      @input="onDatePickerInput"
      :first-day-of-week="this.profile.first_day_of_week"
      :min="minDate"
      :max="maxDate"
    )
</template>

<script>
import BaseTextInput from '@/components/v2/base-text-input/base-text-input.vue'
import CurrentUserMixin from '@/mixins/current-user.mixin'

export default {
  name: 'date-selector',
  components: {
    BaseTextInput
  },
  mixins: [
    CurrentUserMixin
  ],
  props: {
    value: {
      type: String,
      default: ''
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
    },
    validations: {
      type: Object,
      required: false
    },
    showValidationState: {
      type: Boolean,
      default: false
    },
    suppressValidationStateDisplay: {
      type: Boolean,
      default: false
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    minDate: {
      required: false
    },
    maxDate: {
      required: false
    }
  },
  data: function () {
    return {
      isSmall: false,
      isDatePickerVisible: false,
      textInputHasFocus: false
    }
  },
  mounted () {
    // Set is-small field depending on element classes
    this.setIsSmall()
  },
  methods: {
    setIsSmall () {
      // Can't use a computed property for this as $el is undefined before mounted
      this.$set(this, 'isSmall', this.$el.classList.contains('date-picker--small'))
    },
    onDatePickerInput (value) {
      this.$emit('input', value)
      this.isDatePickerVisible = false
    },
    onClearClick () {
      this.$emit('input', null)
      this.isDatePickerVisible = false
    },
    onTextInputFocus () {
      this.isDatePickerVisible = true
      this.textInputHasFocus = true
    },
    onTextInputBlur () {
      this.textInputHasFocus = false

      // If not in a valid format after blur, clear the value
      if (!!this.value && !this.$moment(this.value, this.format, true).isValid()) {
        this.$emit('input', null)
      }
    },
    onDatePickerClickOutside () {
      setTimeout(function () {
        if (!this.textInputHasFocus) {
          this.isDatePickerVisible = false
        }
      }.bind(this), 50)
    }
  }
}
</script>

<style src="./date-picker.scss" lang="scss" scoped></style>
