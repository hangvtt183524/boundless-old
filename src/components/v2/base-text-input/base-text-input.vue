<template lang="pug">
  div(
    :class="['base-text-input', {'base-text-input--invalid': isValidationStateVisible && !isValid}, {'base-text-input--required': isRequired}, {'base-text-input--has-pre-icon': preIcon}, {'base-text-input--suggestions-visible': suggestionsVisible}, {'base-text-input--suggestions-upwards': isUpwards}]"
  )
    label(
      class="base-text-label"
      v-if="label"
    ) {{ label }}
    div(
      class="base-text-input__input-container"
      ref="dropdownHandle"
    )
      v-icon(
        class="base-text-input__pre-icon"
        v-if="preIcon"
      ) {{ preIcon }}
      input(
        :type="type"
        v-model="inputValue"
        @blur="onBlur"
        @focus="onFocus"
        @keyup.enter="$emit('enterKeyUp')"
        @keypress="onKeyPress"
        @paste="onPaste"
        :placeholder="placeholder"
        :disabled="disabled"
        ref="inputElement"
        :maxlength="maxLength"
        :min="min !== -1 ? min : 'none'"
        :max="max !== -1 ? max : 'none'"
        v-mask="mask"
        :autocomplete="autocomplete"
        :title="title"
      )
      slot

    .base-text-input__suggestions(
      v-if="suggestions && suggestions.length > 0"
      v-show="(visibleSuggestions && visibleSuggestions.length) && menuVisible"
      ref="options"
    )
      perfect-scrollbar.base-text-input__suggestions__scroll-holder(
        :options="scrollBarOptions"
      )
        .base-text-input__suggestions__suggestion(
          v-for="suggestion of visibleSuggestions"
          @mousedown="onOptionClick(suggestion)"
        ) {{ suggestion }}

    div(
      class="base-text-input__error-container"
      v-if="errors && errors.length > 0 && touched"
    )
      div(
        class="base-text-input__error-container__error"
        v-for="(error, index) of errors"
        :key="index"
      ) {{ error }}

</template>

<script>
import FormFieldValidationMixin from '@/mixins/form-field-validation.mixin'
import DropdownItemMixin from '@/mixins/dropdown-item.mixin'
import _ from 'lodash'

export default {
  mixins: [
    FormFieldValidationMixin,
    DropdownItemMixin
  ],
  props: {
    value: {
      default: ''
    },
    type: {
      type: String,
      default: 'text'
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
    preIcon: {
      type: String,
      required: false
    },
    maxLength: {
      type: Number,
      default: 524288 // Browser default value
    },
    min: {
      type: Number,
      default: -1 // Non-number value means no limit
    },
    max: {
      type: Number,
      default: -1 // Non-number value means no limit
    },
    forbiddenCharacters: {
      type: Array,
      default: () => { return [] }
    },
    mask: {
      required: false
    },
    autocomplete: {
      type: String,
      default: 'new-password' // Workaround to prevent browser autocomplete, works in cases where 'off' doesn't work
    },
    title: {
      type: String,
      required: false
    },
    suggestions: {
      required: false
    }
  },
  data: function () {
    return {
      inputValue: '',
      hasFocus: false,
      localSuggestions: [],
      scrollBarOptions: {
        wheelPropagation: false
      }
    }
  },
  mounted () {
    // Using this mechanism because v-model is required for v-mask to work properly
    this.inputValue = this.value || ''
  },
  computed: {
    effectiveSuggestions () {
      if (!this.suggestions) {
        return null
      }

      if (this.suggestions && this.suggestions.constructor === Array) {
        // Array supplied as suggestions, directly return it
        return this.suggestions
      }

      if (this.suggestions && this.suggestions.constructor === Function) {
        // A function is provided as suggestions, return localSuggestions list. It will be populated as the input
        // value changes
        return this.localSuggestions
      }

      // No expected type
      return null
    },
    visibleSuggestions () {
      if (!this.effectiveSuggestions) {
        return null
      }

      return this.inputValue
        ? this.effectiveSuggestions.filter(suggestion =>
          suggestion.toLowerCase().indexOf(this.inputValue.toLowerCase()) > -1
        )
        : this.effectiveSuggestions
    },
    suggestionsVisible () {
      return (this.visibleSuggestions && this.visibleSuggestions.length) && this.menuVisible
    }
  },
  watch: {
    inputValue () {
      if (this.inputValue !== this.value) {
        this.$emit('input', this.inputValue)

        if (this.suggestions && this.suggestions.constructor === Function) {
          // A function provided for suggestions, call it on value change
          this.fetchSuggestions()
        }
      }
    },
    value () {
      if (this.inputValue !== this.value) {
        this.inputValue = this.value
      }
    },
    suggestions (newVal, oldVal) {
      if (!oldVal && newVal && this.hasFocus) {
        // If suggestions are newly loaded while component has focus, show them
        this.showOptions()
      }
    }
  },
  methods: {
    setFocus () {
      this.$refs.inputElement.focus()
    },
    onFocus () {
      this.$emit('focus')

      if (this.suggestions) {
        this.showOptions()
      }

      this.hasFocus = true
    },
    onBlur: function () {
      if (this.suggestions) {
        this.hideOptions()
      }

      this.hasFocus = false

      FormFieldValidationMixin.methods.onBlur.bind(this)()
    },
    onKeyPress (event) {
      if (event.key === 'Enter') {
        // Do not process enter key
        return
      }

      this.testForbiddenCharacters(event, event.key)
    },
    onPaste (event) {
      this.testForbiddenCharacters(event, event.clipboardData.getData('text'))
    },
    testForbiddenCharacters (event, text) {
      if (this.forbiddenCharacters.length === 0) {
        // No forbidden characters, do nothing
        return
      }

      const forbiddenCharactersRegex = new RegExp(`(${this.forbiddenCharacters.join('|')})`, 'g')
      if (forbiddenCharactersRegex.test(text)) {
        event.preventDefault()
      }
    },
    onOptionClick: function (item) {
      this.inputValue = item
    },
    fetchSuggestions: _.debounce(function (searchText) {
      this.suggestions(this.inputValue).then(suggestions => {
        this.localSuggestions = suggestions
      })
    }, 400),
    computeDropdownPosition: function () {
      this.$refs.options.style.left = (this.$refs.dropdownHandle.getBoundingClientRect().left) + 'px'
      this.$refs.options.style.width = 'auto'
      this.$refs.options.style.minWidth = (this.$refs.dropdownHandle.getBoundingClientRect().width) + 'px'

      if (this.isUpwards) {
        this.$refs.options.style.top = null
        this.$refs.options.style.bottom = (window.innerHeight - this.$refs.dropdownHandle.getBoundingClientRect().top - 1) + 'px'
      } else {
        this.$refs.options.style.top = (this.$refs.dropdownHandle.getBoundingClientRect().bottom - 1) + 'px'
        this.$refs.options.style.bottom = null
      }
    }
  }
}
</script>

<style src="./base-text-input.scss" lang="scss" scoped></style>
