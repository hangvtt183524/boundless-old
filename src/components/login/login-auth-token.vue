<template lang="pug">
  v-app
    v-container(fill-height)
      b-loader
</template>

<script>
import { mapActions } from 'vuex'
import NodeSelectionsMixin from '@/mixins/node-selections.mixin'
import BLoader from '@/components/common/b-loader.vue'

export default {
  name: 'LoginAuthToken',

  mixins: [
    NodeSelectionsMixin
  ],

  components: {
    BLoader
  },

  data: function () {
    return {
      token: null,
      email: null,
      nextPage: null
    }
  },
  mounted () {
    this.initialize()
  },
  methods: {
    ...mapActions('auth', ['loginAuthToken', 'unsetUser']),
    initialize () {
      // Clear stored logged in user data, if exists
      this.unsetUser()

      this.email = this.$route.query.email
      this.token = this.$route.query.authentication_token

      if (this.$route.query.next_page) {
        this.nextPage = this.$route.query.next_page
      }

      if (!this.email || !this.token) {
        // Missing parameters in query string
        this.$router.push({ name: 'login' })
        return
      }

      this.loginWithAuthToken()
    },
    loginWithAuthToken () {
      this.loginAuthToken({
        authentication_token: this.token,
        email: this.email
      }).then(response => {
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
        }
      }).catch((err) => {
        // If error reason is email not being verified yet, re-route to email verification info screen
        if (err.response && err.response.data && err.response.data.error && err.response.data.error.detail &&
          err.response.data.error.detail.code === 'account_email_not_verified') {
          this.$router.push({ name: 'EmailVerificationInfo' })
        } else {
          // No other error case should happen within expected flow logic. Re-route to login page in such a case
          this.$router.push({ name: 'login', query: this.$route.query })
        }
      })
    }
  }
}
</script>
