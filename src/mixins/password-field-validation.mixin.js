import { required, minLength, maxLength } from 'vuelidate/lib/validators'

import ErrorHandlerMixin from './error-handler.mixin'

let PasswordFieldValidationMixin = {
  mixins: [
    ErrorHandlerMixin
  ],
  validations: {
    password: {
      required,
      minLength: minLength(8),
      maxLength: maxLength(25)
    },
    password2: {
      required
    }
  },
  computed: {
    passwordErrors () {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.minLength && errors.push(this.$t('general.validateMessages.passwordLeast8Characters'))
      !this.$v.password.required && errors.push(this.$t('general.validateMessages.passwordRequired'))
      return errors.length > 0 ? errors : this.getErrorMessages('password')
    },
    password2Errors () {
      const errors = []
      if (!this.$v.password2.$dirty) return errors
      !this.$v.password.required && errors.push(this.$t('general.validateMessages.passwordConfirm'))
      this.password !== this.password2 && errors.push(this.$t('general.validateMessages.passwordDoNotMatch'))
      return errors.length > 0 ? errors : this.getErrorMessages('password2')
    }
  }
}

export default PasswordFieldValidationMixin
