<template lang="pug">
  base-dialog(:show="show", @close="$emit('close')")
    v-container(grid-list-md)
      v-layout(row)
        v-flex(xs12)
          h2.dialog-heading.mb-3 {{ $t('login.forgotPassword') }}
          h4.dialog-subtitle {{ $t('login.forgotPasswordText') }}
      v-form(ref='form', @submit.prevent="submitReset")
        v-layout.mt-3.mb-4(row)
          v-flex(sm4, class="input-wrap")
            v-text-field.forgot-email(
              data-test="forgot-email"
              v-model='email',
              required,
              :label="$t('general.emailAddress')",
              :error-messages="emailErrors",
              @blur="$v.email.$touch()"
            )

        v-layout(row)
          v-flex(sm6)
            a.login-layout-link(@click.stop="login" data-test="login-link") {{ $t("login.alreadyRegistered") }}
          v-flex.text-xs-right(sm6)
            v-btn(
              color="success", round, large, type="submit",
              :loading="loading",
              :disabled='this.$v.$dirty && this.$v.$invalid'
              data-test="forgot-password-button"
            ) {{ $t("login.sendEmail") }}
</template>

<script>
import { mapActions } from 'vuex'
import { required, email } from 'vuelidate/lib/validators'
import BaseDialog from '@/components/common/base-dialog'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {

  components: {
    BaseDialog
  },

  validations: {
    email: {
      required,
      email
    }
  },

  props: {
    show: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      email: '',
      loading: false
    }
  },

  computed: {
    emailErrors () {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.email && errors.push(this.$t('general.emailValid'))
      !this.$v.email.required && errors.push(this.$t('general.emailRequired'))
      return errors
    }
  },

  methods: {
    ...mapActions('auth', [
      'sendResetLink'
    ]),
    clear () {
      this.$refs.form.reset()
      this.$v.$reset()
    },
    login () {
      this.$emit('close')
      this.clear()
      this.$router.push({ name: 'login' })
    },
    submitReset () {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.loading = true
        this.sendResetLink({
          email: this.email
        }).then((res) => {
          global.toastr['success'](this.$t('login.emailSentSuccessMessage'), this.$t('general.success'))
          this.$emit('close')
          this.loading = false
          this.clear()
        }).catch((err) => {
          this.loading = false
          global.toastr['error'](this.$t('login.cannotFindUserMessage'), this.$t('general.error'))
          console.log(err.message)
        })

        EventTracker.sendEvent(EVENT_NAMES.PASSWORD_RESET_REQUESTED)
      }
    }
  }
}
</script>
