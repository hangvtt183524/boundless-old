<template lang="pug">
  .saml-router
</template>

<script>
import { mapActions } from 'vuex'
import ErrorHandlerMixin from '@/mixins/error-handler.mixin'
import NodeSelectionsMixin from '@/mixins/node-selections.mixin'

export default {
  name: 'saml-router',

  mixins: [
    ErrorHandlerMixin,
    NodeSelectionsMixin
  ],

  data: function () {
    return {
      samlStates: {
        loggedIn: 'logged_in',
        registration: 'registration',
        login: 'login'
      },
      state: null,
      token: null
    }
  },
  mounted () {
    this.initialize()
  },
  methods: {
    ...mapActions('auth', ['loginSaml', 'unsetUser']),
    initialize () {
      // Clear stored logged in user data, if exists
      this.unsetUser()

      this.samlState = this.$route.query.state
      this.token = this.$route.query.saml_token

      if (this.samlState === this.samlStates.loggedIn) {
        this.loginWithSamlToken()
      } else if (this.samlState === this.samlStates.registration) {
        // Redirect to registration page
        this.$router.push({ name: 'register', query: this.$route.query })
      } else if (this.samlState === this.samlStates.login) {
        // Redirect to login page, with email pre-filled
        this.$router.push({ name: 'login', query: this.$route.query })
      }
    },
    loginWithSamlToken () {
      this.loginSaml({
        saml_token: this.token
      }).then(response => {
        // Clear query
        this.$router.replace({ query: {} })

        this.fetchUserWorkspaces().then(() => {
          this.selectActiveWorkspace()
        })
      }).catch((err) => {
        this.setErrorData(err)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
