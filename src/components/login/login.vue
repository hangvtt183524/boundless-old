<template lang='pug'>
  div(data-test="login-page")
    p.login-text {{ $t('login.signInText')}}

    v-layout(row)
      v-flex(xs12)
        a(
          :href="getOAuthSignInLink('google')"
        )
          div.google-sign-in-button
            div.icon
              img(src="@/assets/images/google_signin_icon.svg")
            span.text {{ $t('login.loginWith') }} Google

    v-layout.mt-3(row)
      v-flex(xs12)
        .separator
          span {{ $t('general.or') }}

    v-form(ref='form', @submit.prevent="loginUser")
      // email field
      v-layout.mt-3(row)
        v-flex(xs12)
          v-text-field.login-email(
            v-model='email',
            data-test="login-email"
            required,
            :class="{ 'input-group--dirty': dirtyEmail }"
            :label="$t('login.email')",
            :error-messages="getErrorMessages('email')"
            :disabled="emailDisabled",
          )
      // password field
      v-layout(row)
        v-flex(xs12)
          v-text-field.login-password(
            v-model='password',
            data-test="login-password"
            required
            :append-icon="passwordHidden ? 'visibility' : 'visibility_off'",
            @click:append="onPasswordIconClick()",
            :class="{ 'input-group--dirty': dirtyPwd }"
            :type="passwordHidden ? 'password' : 'text'",
            :label="$t('login.password')",
            :error-messages="getErrorMessages('password')"
          )
      // button container
      v-layout.mt-4(row)
        v-flex(xs12)
          // v-checkbox.primary--text(v-model='checkbox', :rules="checkboxRules", :label="$t('login.doYouAgree')", required)
          v-btn.success.white--text.login-button(
            :loading="loading"
            data-test="login-button"
            round, block
            type="submit"
          ) {{ $t('login.loginButtonText') }}

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
              data-test="login-button"
              round, block
              type="button"
            ) {{ $t('login.loginWith') }} {{ $t('login.ssoProviders.' + provider.provider) }}

      // the links below the form: register and forgot pass
      v-layout(row wrap).mt-3
        //- temporary disable (Carlota) until metrics working
        //- v-flex(xs6)
        //-   router-link.login-layout-link(to="/sign-up" data-test="signup-link") {{ $t("login.register") }}
        v-flex.text-xs-right(xs6)
          a.login-layout-link(href="#", data-test="forgot-link" @click.prevent="showForgotPasswordDialog = true") {{ $t("login.forgotPassword") }}

        v-flex.text-xs-right(
          xs6
          v-if="!organizationSlug"
        )
          router-link.login-layout-link(to="/login/organization-router") {{ $t("login.singleSignOn") }}

      //- v-layout(row wrap).mt-3
        v-flex(
          xs6
          v-if="!organizationSlug"
        )
          router-link.login-layout-link(to="/login/organization-router") {{ $t("login.singleSignOn") }}

    forgot-password-dialog(:show="showForgotPasswordDialog", @close="showForgotPasswordDialog = false")
</template>

<script>
import { mapActions } from 'vuex'

import ErrorHandlerMixin from '@/mixins/error-handler.mixin'
import NodeSelectionsMixin from '@/mixins/node-selections.mixin'

import forgotPasswordDialog from './forgot-password-dialog'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'Login',

  props: {
    organizationSlug: {
      type: String,
      required: false
    }
  },

  mounted () {
    if (this.$route.query.email) {
      // If email is passed in the query, set it as static email value
      this.email = this.$route.query.email
      this.emailDisabled = true
    }

    if (this.$route.query.saml_token) {
      this.samlToken = this.$route.query.saml_token
    }

    if (this.$route.query.next_page) {
      this.nextPage = this.$route.query.next_page
    }

    // If we are on an organization specific login page, fetch organization identity providers
    if (this.organizationSlug) {
      this.getOrganizationIdentityProviders()
    }

    let times = 0
    const interval = setInterval(() => {
      times += 1
      if (times === 5) {
        clearInterval(interval)
        if (this.dirtyEmail || this.dirtyPwd) {
          const emailInput = document.querySelector('div.login-email')
          emailInput.classList.add('v-input--is-label-active')
          emailInput.classList.add('v-input--is-dirty')
          emailInput.classList.remove('input-group--dirty')
          const emailInputLabel = document.querySelector('div.login-email label')
          emailInputLabel.classList.add('v-label--active')

          const pwdInput = document.querySelector('div.login-password')
          pwdInput.classList.add('v-input--is-label-active')
          pwdInput.classList.add('v-input--is-dirty')
          pwdInput.classList.remove('input-group--dirty')
          const pwdInputLabel = document.querySelector('div.login-password label')
          pwdInputLabel.classList.add('v-label--active')
        }
      }
      this.dirtyEmail = document.querySelector('input[type="email"]:-webkit-autofill')
      this.dirtyPwd = document.querySelector('input[type="password"]:-webkit-autofill')
    }, 100)
  },

  components: {
    forgotPasswordDialog
  },

  mixins: [
    ErrorHandlerMixin,
    NodeSelectionsMixin
  ],

  data () {
    // each field is represented by a value property and its validation rule
    return {
      // email
      email: '',
      dirtyEmail: null,
      // password
      password: '',
      dirtyPwd: null,
      passwordHidden: true,
      // checkbox
      checkbox: false,
      identityProviders: [],

      // form is valid
      valid: true,
      loading: false,
      showForgotPasswordDialog: false,

      samlToken: null,
      emailDisabled: false,
      nextPage: null
    }
  },

  methods: {
    ...mapActions('auth', ['login', 'fetchNodeIdentityProviders']),
    // the form cleanup action
    clear () {
      this.$refs.form.reset()
    },

    getOrganizationIdentityProviders () {
      this.loading = true
      this.fetchNodeIdentityProviders(this.organizationSlug).then(response => {
        this.$set(this, 'identityProviders', response.data.data)
      }).catch((err) => {
        this.setErrorData(err)
      }).finally(() => {
        this.loading = false
      })
    },

    getOAuthSignInLink (provider) {
      return `${process.env.VUE_APP_API_URL}/signin/oauth/${provider}/`
    },

    onPasswordIconClick () {
      this.passwordHidden = !this.passwordHidden

      if (!this.passwordHidden) {
        EventTracker.sendEvent(EVENT_NAMES.LOGIN_PASSWORD_SHOWN)
      }
    },

    // action to perform upon form submission
    loginUser () {
      const formData = {
        email: this.email,
        password: this.password
      }

      if (this.samlToken) {
        formData.saml_token = this.samlToken
      }

      this.loading = true
      this.login(formData).then(response => {
        if (response.data.data.tfa_mode) {
          // 2fa enabled for user, continue to 2fa page
          this.$router.push({ name: 'login2fa', query: this.$route.query })
        } else {
          // Push route if next page is provided
          if (this.nextPage) {
            this.$router.push(this.nextPage)
          }

          this.fetchUserWorkspaces().then(() => {
            this.selectActiveWorkspace()
          })

          EventTracker.sendEvent(EVENT_NAMES.USER_LOGGED_IN_VIA_PASSWORD)
        }
      }).catch((err) => {
        this.loading = false

        this.setErrorData(err)

        // If error reason is email not being verified yet, re-route to email verification info screen
        if (err.response && err.response.data && err.response.data.error && err.response.data.error.detail &&
          err.response.data.error.detail.code === 'account_email_not_verified') {
          this.$router.push({ name: 'EmailVerificationInfo' })
        }
      })
    }
  }
}
</script>
