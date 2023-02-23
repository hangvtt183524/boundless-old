<template lang='pug'>
  div
    p.login-text {{ $t('login.forgotPasswordText')}}
    v-form(ref='form')
      // email field
      v-layout(row)
        v-flex(xs12)
          v-text-field(
            v-model='email',
            required
            :label="$t('login.email')",
            type="email",
            :error-messages="emailErrors",
            @blur="$v.email.$touch()"
          )
      // submit
      v-layout(row)
        v-flex(xs12)
          v-btn.success.white--text(round, block, :disabled='this.$v.$dirty && this.$v.$invalid', @click='forgotPassword') {{ $t('login.submit') }}
      // the links below the form: register and forgot pass
      v-layout.mt-3(row)
        v-flex.text-xs-center(xs12)
          router-link.forgot-link(to="/login") {{ $t("login.alreadyRegistered") }}
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'

export default {
  name: 'ForgotPassword',

  validations: {
    email: {
      required,
      email
    }
  },

  data () {
    // each field is represented by a value property and its validation rule
    return {
      // email
      email: '',
      // form is valid
      valid: true
    }
  },

  computed: {
    emailErrors () {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.email && errors.push(this.$t('errors.email'))
      !this.$v.email.required && errors.push(this.$t('errors.emailRequired'))
      return errors
    }
  },

  methods: {
    forgotPassword () {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        console.log(this.email)
        // this.auth.forgotPassword()
      }
    }
  }
}
</script>
