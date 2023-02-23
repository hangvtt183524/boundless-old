<template lang='pug'>
  div(data-test="login-page")
    p.login-text {{ tfaMode === tfaModes.sms ? $t('login.sms2faText') : $t('login.googleAuthenticator2faText') }}
    v-form(ref='form', @submit.prevent="loginUser")
      // code field
      v-layout(row)
        v-flex(xs12)
          v-text-field.login-code(
            v-model='code'
            required
            :class="{ 'input-group--dirty': dirtyCode }"
            :label="$t('login.code')",
          )

      // button container
      v-layout.mt-4(row)
        v-flex(xs12)
          v-btn.success.white--text.login-button(
            :loading="loading"
            data-test="login-button"
            round
            block
            type="submit"
          ) {{ $t('login.loginButtonText') }}
      // the links below the form: re-send for sms mode
      v-layout(row).mt-3
        v-flex(xs6)
          a.login-layout-link(
            href="#"
            @click.prevent="onResendClick"
            v-if="tfaMode === tfaModes.sms"
          ) {{ $t("login.reSendCode") }}

</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import ErrorHandlerMixin from '@/mixins/error-handler.mixin'
import NodeSelectionsMixin from '@/mixins/node-selections.mixin'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'Login2fa',

  mixins: [
    ErrorHandlerMixin,
    NodeSelectionsMixin
  ],

  data () {
    return {
      tfaModes: {
        sms: 'sms',
        googleAuthenticator: 'google_authenticator'
      },

      // email
      code: '',
      dirtyCode: null,

      // form is valid
      valid: true,
      loading: false,

      samlToken: null,
      nextPage: null
    }
  },

  mounted () {
    if (this.$route.query.saml_token) {
      this.samlToken = this.$route.query.saml_token
    }

    if (this.$route.query.next_page) {
      this.nextPage = this.$route.query.next_page
    }

    if (!(this.tfaToken && this.tfaMode)) {
      // If user directly loads this page, redirect to login page
      this.$router.push({ name: 'login' })
    } else {
      let times = 0
      const interval = setInterval(() => {
        times += 1
        if (times === 5) {
          clearInterval(interval)
          if (this.dirtyEmail) {
            const emailInput = document.querySelector('div.login-email')
            emailInput.classList.add('v-input--is-label-active')
            emailInput.classList.add('v-input--is-dirty')
            emailInput.classList.remove('input-group--dirty')
            const emailInputLabel = document.querySelector('div.login-email label')
            emailInputLabel.classList.add('v-label--active')
          }
        }
        this.dirtyEmail = document.querySelector('input[type="email"]:-webkit-autofill')
      }, 100)
    }
  },

  computed: {
    ...mapGetters('auth', ['tfaMode', 'tfaToken'])
  },

  methods: {
    ...mapActions('auth', ['login2fa', 'resend2fa']),
    // the form cleanup action
    clear () {
      this.$refs.form.reset()
    },

    onResendClick () {
      this.loading = true
      this.resend2fa({
        token: this.tfaToken
      }).then(() => {
        global.toastr['success'](this.$t('login.resend2faSuccess'), this.$t('general.success'))
      }).catch((err) => {
        this.setErrorData(err)

        if (this.errorData && this.errorData.non_field_errors) {
          const message = this.getErrorMessages('message', this.errorData.non_field_errors[0])
          if (message.length > 0) {
            global.toastr['error'](message[0], this.$t('general.error'))
          }
        }
      }).finally(() => {
        this.loading = false
      })
    },

    // action to perform upon form submission
    loginUser () {
      const formData = {
        token: this.tfaToken,
        code: this.code
      }

      if (this.samlToken) {
        formData.saml_token = this.samlToken
      }

      this.loading = true
      this.login2fa(formData).then(() => {
        // Push route if next page is provided
        if (this.nextPage) {
          this.$router.push(this.nextPage)
        }

        this.fetchUserWorkspaces().then(() => {
          this.selectActiveWorkspace()
        })

        EventTracker.sendEvent(EVENT_NAMES.USER_LOGGED_IN_VIA_TFA)
      }).catch((err) => {
        this.loading = false

        this.setErrorData(err)

        if (this.errorData && this.errorData.code === '2fa_token_expired') {
          // If code is expired, redirect user back to login page
          this.$router.push({ name: 'login' })
        }
      })
    }
  }
}
</script>
