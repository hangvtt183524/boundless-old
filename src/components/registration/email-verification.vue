<template lang="pug">
  v-app
    v-content
      v-container.invite-signup(fluid fill-height)
        v-layout(class="align-center justify-center")
          v-flex(xs12 sm7 md3)
            v-card.pa-4
              v-card-text
                .logo-container
                  img.logo-image(src="@/assets/images/boundless-logo.png")
                  h3.logo-text  BOUNDLESS

                v-flex(
                  class="text-xs-center mt-5"
                )
                  v-progress-circular(
                    v-if="isLoading"
                    :size="50"
                    indeterminate
                    color="primary"
                  )
                  v-alert(
                    v-else-if="errorMessage"
                    class="mt-5"
                    :value="true"
                    outline
                    color="error"
                    icon="warning"
                  )
                    strong
                      | {{ errorMessage }}

</template>

<script>
import Ls from '@/services/ls'
import { mapActions } from 'vuex'

import ErrorHandlerMixin from '@/mixins/error-handler.mixin'
import IntervalProgress from '@/components/common/interval-progress'

export default {
  props: {
    token: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  mixins: [
    ErrorHandlerMixin
  ],
  components: {
    IntervalProgress
  },
  data () {
    return {
      isLoading: true,
      isAuthenticated: false,
      errors: {},
      success: false
    }
  },
  mounted () {
    const payload = {
      key: this.token,
      email: this.email
    }
    this.verifyEmail(payload).then(response => {
      const data = response.data.data

      // If a token is returned, and if there is no logged in user in session, or the logged in user is the current
      // user, update token and user email in session.
      if (data.token && (!Ls.get('currentUserEmail') || (Ls.get('currentUserEmail') === data.old_email))) {
        this.$store.commit('auth/AUTH_SUCCESS', data.token)
        this.$store.commit('user/UPDATE_CURRENT_USER', { email: this.email })
        Ls.set('auth.token', data.token)
        Ls.set('currentUserEmail', this.email)
        this.isAuthenticated = true
      }
      this.success = true

      this.proceed()
    }).catch(err => {
      this.setErrorData(err)
    }).finally(() => {
      this.isLoading = false
    })
  },
  computed: {
    errorMessage () {
      if (this.errorData.hasOwnProperty('key')) {
        return this.getErrorMessages('key')[0]
      } else if (this.errorData.hasOwnProperty('email')) {
        return this.getErrorMessages('email')[0]
      } else if (this.errorData.hasOwnProperty('non_field_errors')) {
        return this.getErrorMessages('non_field_errors')[0]
      } else {
        return ''
      }
    },
    successMessage () {
      let message = this.$t('user.changeEmailSuccess')
      if (!this.isAuthenticated) {
        message = `${message} ${this.$t('user.loginWithNewEmail')}`
      }
      return message
    }
  },
  methods: {
    ...mapActions('auth', ['logout']),
    ...mapActions('user', ['verifyEmail']),
    proceed () {
      global.toastr['success'](this.successMessage, this.$t('general.success'))

      if (this.isAuthenticated) {
        this.$router.push({ name: 'home' })
      } else {
        this.logout()
      }
    }
  }
}
</script>

<style lang="scss">
@import 'styles/_logo-container.scss';

.invite-signup {
  flex: 1;
  background: url('../../assets/images/background.png') no-repeat center center;
  background-size: cover;
}

html {
  overflow-y: auto !important;
}
</style>
