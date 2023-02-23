<template lang="pug">
  editable-panel(
    data-test="email-info"
    :disable-submit="disableSubmit"
    :is-editing="isEditing"
    :is-loading="isLoading"
    :submitText="$t('general.changeEmail')"
    :title="$t('general.email')"
    @cancel="cancel"
    @edit="edit"
    @submit="submit"
  )
    v-form(
      @submit.prevent="submit"
      slot-scope="{readonly}"
    )
      v-layout(row wrap)
        v-flex.px-3(xs12)
          v-text-field.email(
            data-test="email"
            :readonly="readonly"
            :label="$t('general.email')"
            v-model="formData.email"
            :error-messages="getErrors('email')"
            @blur="$v.formData.email.$touch"
            @input="$v.formData.email.$reset"
            required
          )
        v-flex(xs12)
          v-alert.email-change-confirm(
            data-test="email-change-confirm"
            color="success"
            dismissible
            icon="check_circle"
            outline
            transition="scale-transition"
            v-model="showConfirmationAlert"
          )
            | {{ $t('user.changeEmailConfirmationSent') }}
            | {{ $t('user.changeEmailVerify') }}
</template>

<script>
import { email, required } from 'vuelidate/lib/validators'
import { mapActions } from 'vuex'

import EditablePanel from '@/components/common/editable-panel'

import CurrentUserMixin from '@/mixins/current-user.mixin'
import EditablePanelMixin from '@/mixins/editable-panel.mixin'
import ErrorHandlerMixin from '@/mixins/error-handler.mixin'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  components: {
    EditablePanel
  },
  validations: {
    formData: {
      email: {
        required,
        email
      }
    }
  },
  mixins: [
    CurrentUserMixin,
    EditablePanelMixin,
    ErrorHandlerMixin
  ],
  mounted () {
    this.setFormData()
    this.currentEmail = this.currentUser.email
  },
  data () {
    return {
      formData: {
        email: ''
      },
      showConfirmationAlert: false,
      currentEmail: ''
    }
  },
  computed: {
    disableSubmit () {
      return !this.formData.email || this.currentEmail === this.formData.email || this.$v.formData.$invalid
    }
  },
  methods: {
    ...mapActions('user', ['updateUserEmail']),
    getErrors (fieldName) {
      const vueErrors = this.getVueErrors(`formData.${fieldName}`)
      if (vueErrors.length > 0) {
        return vueErrors
      } else {
        return this.getErrorMessages(fieldName)
      }
    },
    setFormData () {
      this.$set(this.formData, 'email', this.currentUser.email)
    },
    submit () {
      this.clearErrorData()
      this.isLoading = true
      this.updateUserEmail(this.formData).then((response) => {
        this.isLoading = false
        this.isEditing = false
        this.showConfirmationAlert = true
        this.currentEmail = this.formData.email
      }).catch(err => {
        this.setErrorData(err)
        this.isLoading = false
      })

      EventTracker.sendEvent(EVENT_NAMES.EMAIL_CHANGE_REQUESTED)
    }
  }
}
</script>
