<template lang='pug'>
  div(data-test="signup-page")
    p.login-text(
      v-html="$t('login.emailVerificationText')"
    )

    v-layout(row wrap).mt-5
      v-flex(xs6)
        router-link.login-layout-link(to="/login") {{ $t("login.alreadyVerified") }}
      v-flex.text-xs-right(xs6)
        a.login-layout-link(href="#", @click.prevent="onResendMessageClick()") {{ $t("login.resend") }}
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'EmailVerificationInfo',
  mounted () {
    if (!this.registeredEmail) {
      // No registered email in store. Re-direct to login page.
      this.$router.push({ name: 'login' })
    }
  },
  computed: {
    ...mapGetters('auth', ['registeredEmail'])
  },
  methods: {
    ...mapActions('user', ['resendVerificationMessage']),
    onResendMessageClick () {
      this.resendVerificationMessage({
        email: this.registeredEmail
      }).then(response => {
        global.toastr['success'](this.$t('login.verificationEmailResendSuccess'), this.$t('general.success'))
      }).catch(() => {
        global.toastr['error'](this.$t('login.verificationEmailResendFailure'), this.$t('general.error'))
      })
    }
  }
}
</script>
