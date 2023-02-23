<template lang="pug">
  div
    v-layout(
      v-if="isGoogleSignInButtonVisible"
      row
    )
      v-flex(xs12)
        a(
          :href="getOAuthSignInLink('google')"
        )
          div.google-sign-in-button
            div.icon
              img(src="@/assets/images/google_signin_icon.svg")
            span.text {{ $t('login.registerWith') }} Google

    v-layout.mt-3(
      v-if="isGoogleSignInButtonVisible"
      row
    )
      v-flex(xs12)
        .separator
          span {{ $t('general.or') }}

    v-form(ref='form', @submit.prevent="validateAndRegister")
      // first name field
      v-layout(
        row
        :class="{'mt-3': isGoogleSignInButtonVisible}"
      )
        v-flex(xs12)
          v-text-field.signup-name(
            v-model='formData.first_name',
            data-test="signup-name"
            type="text",
            required, counter='64'
            :rules="nameRules"
            :label="$t('login.firstName') + ' *'",
            :error-messages="firstNameErrors",
            :disabled="disableLastName"
            @input="$v.formData.first_name.$touch()",
            @blur="$v.formData.first_name.$touch()"
          )
      // last name field
      v-layout(
        row
        :class="{'mt-3': isGoogleSignInButtonVisible}"
      )
        v-flex(xs12)
          v-text-field.signup-last-name(
            v-model='formData.last_name',
            data-test="signup-last-name"
            type="text",
            required, counter='64'
            :rules="nameRules"
            :label="$t('login.lastName') + ' *'",
            :error-messages="lastNameErrors",
            :disabled="disableFirstName"
            @input="$v.formData.last_name.$touch()",
            @blur="$v.formData.last_name.$touch()"
          )
      // email field
      v-layout(row)
        v-flex(xs12)
          v-text-field.signup-email(
            v-model='formData.email',
            data-test="signup-email"
            type="email",
            required,
            :label="$t('login.email') + ' *'",
            :error-messages="emailErrors",
            :disabled="disableEmail",
            @blur="$v.formData.email.$touch()"
          )
      // password field
      v-layout(row)
        v-flex(xs12)
          v-text-field.signup-password(
            v-model='formData.password',
            data-test="signup-password"
            min='8', required, counter='25',
            ref="password"
            :rules="rules"
            :append-icon="passwordHidden ? 'visibility' : 'visibility_off'",
            :append-icon-cb='() => passwordHidden = !passwordHidden',
            :type="passwordHidden ? 'password' : 'text'",
            :label="$t('login.password') + ' *'",
            :error-messages="passwordErrors",
            @input="$v.formData.password.$touch()",
            @blur="$v.formData.password.$touch()"
          )
      // checkbox
      v-layout(row)
        v-flex(xs12)
          // v-checkbox.primary--text(v-model='checkbox', :rules="checkboxRules", :label="$t('login.doYouAgree')", required)
          v-btn.success.white--text(
            data-test="signup-button"
            :loading="loading",
            round,
            block,
            type="submit"
            :disabled="$v.formData.$invalid"
          ) {{ submitTextDisplay }}

      // identity provider login links
      v-layout.mt-2(
        row
        v-for="provider of identityProviders"
        :key="provider.login_url"
      )
        v-flex(xs12)
          a(
            :href="provider.login_url"
          )
            v-btn.primary.white--text.login-button(
              round, block
              type="button"
            ) {{ $t('login.registerWith') }} {{ $t('login.ssoProviders.' + provider.provider) }}
</template>

<script>
import { mapActions } from 'vuex'
import { required, minLength, maxLength, email } from 'vuelidate/lib/validators'

import ErrorHandlerMixin from '@/mixins/error-handler.mixin'
import NodeSelectionsMixin from '@/mixins/node-selections.mixin'

import RegistrationForm from './registration-form'
import TelInput from '@/components/common/tel-input/input'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'RegistrationForm',

  props: {
    submitText: {
      type: String,
      default: ''
    },
    identityProviders: {
      type: Array,
      required: false
    }
  },

  validations: {
    formData: {
      first_name: {
        required,
        maxLength: maxLength(64)
      },
      last_name: {
        required,
        maxLength: maxLength(64)
      },
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(8),
        maxLength: maxLength(25)
      }
    }
  },

  mixins: [
    ErrorHandlerMixin,
    NodeSelectionsMixin
  ],

  components: {
    RegistrationForm,
    TelInput
  },

  mounted () {
    this.formData = Object.assign({}, this.formData, this.$route.query)
    if (this.$route.query.email) {
      this.disableEmail = true
    }

    if (this.$route.query.first_name) {
      this.disableFirstName = true
    }

    if (this.$route.query.last_name) {
      this.disableLastName = true
    }

    if (this.$route.query.next_page) {
      this.nextPage = this.$route.query.next_page
    }

    if (this.formData.first_name && this.formData.last_name && this.formData.email) {
      this.$refs.password.focus()
    }
    this.nextPage = this.$route.query.next_page
  },

  data () {
    // each field is represented by a value property and its validation rule
    return {
      formData: {
        first_name: '',
        last_name: '',
        email: '',
        password: ''
      },
      disableEmail: false,
      disableFirstName: false,
      disableLastName: false,
      passwordHidden: true,
      checkbox: false,
      loading: false,
      maxLength: 25,
      maxNameLength: 64,
      nextPage: null
    }
  },

  computed: {
    submitTextDisplay () {
      return this.submitText || this.$t('login.submit')
    },
    firstNameErrors () {
      const errors = []
      const firstName = this.$v.formData.first_name
      if (!firstName.$dirty) return errors
      !firstName.required && errors.push(this.$t('errors.firstNameRequired'))
      return errors
    },
    lastNameErrors () {
      const errors = []
      const lastName = this.$v.formData.last_name
      if (!lastName.$dirty) return errors
      !lastName.required && errors.push(this.$t('errors.lastNameRequired'))
      return errors
    },
    emailErrors () {
      const errors = []
      const email = this.$v.formData.email
      if (!email.$dirty) return errors
      !email.email && errors.push(this.$t('errors.email'))
      !email.required && errors.push(this.$t('errors.emailRequired'))
      return errors.length > 0 ? errors : this.getErrorMessages('email')
    },
    passwordErrors () {
      const errors = []
      const password = this.$v.formData.password
      if (!password.$dirty) return errors
      !password.minLength && errors.push(this.$t('general.validateMessages.passwordLeast8Characters'))
      !password.required && errors.push(this.$t('general.validateMessages.passwordRequired'))
      return errors.length > 0 ? errors : this.getErrorMessages('password')
    },
    rules (v) {
      const maxRule = (v) => {
        let value = v
        if (!value) {
          value = {
            length: 0
          }
        }
        return value.length <= this.maxLength || this.$t('general.maxCharacters', { count: this.maxLength })
      }
      return [maxRule]
    },
    nameRules (v) {
      const maxRule = (v) => {
        let value = v
        if (!value) {
          value = {
            length: 0
          }
        }
        return value.length <= this.maxNameLength || this.$t('general.maxCharacters', { count: this.maxNameLength })
      }
      return [maxRule]
    },
    isGoogleSignInButtonVisible () {
      return !this.disableEmail && !this.formData.invitation_key && !this.formData.authentication_token
    }
  },

  methods: {
    ...mapActions('auth', ['signup']),
    ...mapActions('user', ['checkInvitation', 'acceptInvitation']),
    // the form cleanup
    clear () {
      this.$refs.form.reset()
      this.clearErrorData()
    },

    getOAuthSignInLink (provider) {
      return `${process.env.VUE_APP_API_URL}/signin/oauth/${provider}/`
    },

    postRegistration (pendingEmailVerification, invitationData) {
      if (pendingEmailVerification) {
        // Re-route to email verification info screen
        this.$router.push({ name: 'EmailVerificationInfo' })
      } else {
        // Push route if next page is provided
        if (this.nextPage) {
          this.$router.push(this.nextPage)
        }

        this.fetchUserWorkspaces().then(() => {
          this.selectActiveWorkspace()

          this.loading = false
        })
      }

      EventTracker.sendEvent(EVENT_NAMES.USER_REGISTERED)
    },

    // actions
    validateAndRegister () {
      this.$v.$touch()
      this.clearErrorData()

      if (!this.$v.formData.$invalid) {
        this.loading = true
        this.$set(this.formData, 'password2', this.formData.password)

        // If an invitation key is present, check invitation validity first, redirect user to login page if not valid
        if (this.formData.invitation_key) {
          this.checkInvitation({
            invitation_key: this.formData.invitation_key,
            email: this.formData.email
          }).then(response => {
            if (response.data.data.is_valid) {
              this.registerUser()
            } else {
              // Invitation invalid. Display error message and redirect to login page
              this.loading = false

              const message = this.$t('login.invitationKeyInvalidMessage')
              global.toastr['error'](message, this.$t('general.error'))

              this.$router.push({ name: 'login' })
            }
          })
        } else {
          this.registerUser()
        }
      }
    },

    registerUser () {
      this.signup(this.formData).then(response => {
        const pendingEmailVerification = response.data.data.pending_email_verification

        if (this.formData.invitation_key) {
          this.acceptInvitation({ 'invitation_key': this.formData.invitation_key }).then(response => {
            this.postRegistration(pendingEmailVerification, response.data.data)
          }).catch((err) => {
            const errorDetail = err.response.data.error.detail
            if (errorDetail.non_field_errors && errorDetail.non_field_errors[0] && errorDetail.non_field_errors[0].code === 'invitation_not_found') {
              // Invitation does not exist, but registration is successful, run postRegistration
              this.postRegistration(pendingEmailVerification)
              return
            }

            this.setErrorData(err)
            this.loading = false
          })
        } else {
          this.postRegistration(pendingEmailVerification)
        }
      }).catch((err) => {
        this.setErrorData(err)
        this.loading = false

        // If error reason is expired authentication token, re-route to login page
        if (this.getErrorCodes('authentication_token').indexOf('auth_token_expired') > -1) {
          this.$router.push({ name: 'login' })
        }
      })
    }
  }
}
</script>
