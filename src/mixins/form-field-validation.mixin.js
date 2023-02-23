// Mixin providing form field validation support

import _ from 'lodash'

export default {
  props: {
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
    }
  },
  data: function () {
    return {
      touched: false
    }
  },
  computed: {
    isValidationStateVisible () {
      return !this.suppressValidationStateDisplay && (this.touched || this.showValidationState)
    },
    isValid: function () {
      if (this.validations) {
        if (this.validations.required && this.isValueEmpty) {
          return false
        }

        if (this.value && this.validations.methods) {
          for (let i = 0; i < this.validations.methods.length; i++) {
            const methodData = this.validations.methods[i]
            if (!methodData.method(this.value, ...(methodData.parameters || []))) {
              return false
            }
          }
        }
      }

      return true
    },
    isValueEmpty () {
      return _.isNil(this.value) || this.value === '' || (this.value.constructor === Array && this.value.length === 0)
    },
    isRequired () {
      return this.validations && this.validations.required
    },
    errors: function () {
      const errors = []

      if (this.validations) {
        if (this.validations.required && !this.value && this.validations.required.message) {
          errors.push(this.validations.required.message)
        }

        if (this.value && this.validations.methods) {
          this.validations.methods.forEach(methodData => {
            if (!methodData.method(this.value, ...(methodData.parameters || [])) && methodData.message) {
              errors.push(methodData.message)
            }
          })
        }
      }

      return errors
    }
  },
  methods: {
    onBlur: function () {
      this.touched = true
      this.$emit('blur')
    }
  }
}
