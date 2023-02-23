<template lang="pug">
  panel-container(:title="$t('general.password')" data-test="password-info")
    v-layout(row wrap)
      v-flex(xs12 md6 px-3)
        v-text-field.new-password(
          :label="$t('general.newPassword')"
          placeholder="--"
          v-model="formData.password"
          data-test="new-password"
          min='8',
          required,
          counter="25"
          :rules="rules"
          :append-icon="passwordHidden ? 'visibility' : 'visibility_off'",
          :append-icon-cb='() => passwordHidden = !passwordHidden',
          :type="passwordHidden ? 'password' : 'text'",
          :error-messages="passwordErrors",
          @blur="$v.formData.password.$touch()"
          @input="$v.formData.password.$touch()"
        )
      v-flex(xs12 md6 px-3)
        v-text-field.confirm-password(
          :label="$t('general.confirmNewPassword')"
          placeholder="--"
          v-model="formData.password_confirm"
          data-test="confirm-password"
          required
          :append-icon="passwordConfirmHidden ? 'visibility' : 'visibility_off'",
          :append-icon-cb='() => passwordConfirmHidden = !passwordConfirmHidden',
          :type="passwordConfirmHidden ? 'password' : 'text'",
          :error-messages="passwordConfirmErrors",
          @input="$v.formData.password_confirm.$touch()",
          @blur="$v.formData.password_confirm.$touch()"
        )
      v-flex(xs12 px-3)
        v-alert(
          :value="nonFieldError"
          color="error"
          icon="warning"
          outline
        ) {{ nonFieldError }}

    v-layout(row wrap)
      v-flex(xs12 text-xs-right)
        v-btn(
          data-test="submit-password-button"
          :disabled="disableSubmit"
          :loading="isLoading"
          @click="submit"
          color="success"
          round
        ) {{ $t('general.save') }}
</template>

<script>
import { mapActions } from 'vuex'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import PanelContainer from '@/components/common/panel-container'

import EditablePanelMixin from '@/mixins/editable-panel.mixin'
import ErrorHandlerMixin from '@/mixins/error-handler.mixin'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  components: {
    PanelContainer
  },
  validations: {
    formData: {
      password: {
        required,
        minLength: minLength(8),
        maxLength: maxLength(25)
      },
      password_confirm: {
        required
      }
    }
  },
  mixins: [
    EditablePanelMixin,
    ErrorHandlerMixin
  ],
  data () {
    return {
      formData: {
        password: '',
        password_confirm: ''
      },
      passwordHidden: true,
      passwordConfirmHidden: true,
      maxLength: 25
    }
  },
  computed: {
    passwordErrors () {
      const errors = []
      if (!this.$v.formData.password.$dirty) return errors
      !this.$v.formData.password.minLength && errors.push(this.$t('general.validateMessages.passwordLeast8Characters'))
      !this.$v.formData.password.required && errors.push(this.$t('general.validateMessages.passwordRequired'))
      return errors.length > 0 ? errors : this.getErrorMessages('password')
    },
    passwordConfirmErrors () {
      const errors = []
      if (!this.$v.formData.password_confirm.$dirty) return errors
      !this.$v.formData.password.required && errors.push(this.$t('general.validateMessages.passwordConfirm'))
      this.formData.password !== this.formData.password_confirm && errors.push(this.$t('general.validateMessages.passwordDoNotMatch'))
      return errors.length > 0 ? errors : this.getErrorMessages('password_confirm')
    },
    disableSubmit () {
      return !this.formData.password ||
              !this.formData.password_confirm ||
              this.$v.formData.password.$invalid ||
              this.$v.formData.password_confirm.$invalid ||
              this.formData.password !== this.formData.password_confirm
    },
    nonFieldError () {
      for (let error of this.getErrorMessages('non_field_errors')) {
        return error
      }
      return ''
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
    }
  },
  methods: {
    ...mapActions('user', ['changePassword']),
    submit () {
      this.isLoading = true
      this.changePassword(this.formData).then(response => {
        this.showSuccessMessage()
        this.isEditing = false
        this.isLoading = false
      }).catch(err => {
        this.setErrorData(err)
        this.isLoading = false
        console.log(this.errorData)
      })

      EventTracker.sendEvent(EVENT_NAMES.USER_PASSWORD_CHANGED)
    },
    showSuccessMessage () {
      const successMessage = this.$t('user.passwordUpdateddSuccessfully')
      global.toastr['success'](successMessage, this.$t('general.success'))
    }
  }
}
</script>
