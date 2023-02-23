<template lang="pug">
  editable-panel(
    data-test="personal-info"
    :is-editing="isEditing"
    :is-loading="isLoading"
    :title="$t('general.personalInformation')"
    :disableSubmit="disableSubmit"
    @cancel="cancel"
    @edit="edit"
    @submit="submit"
  )
    v-layout(row wrap slot-scope="{readonly}")
      v-flex(xs12 md6 px-3)
        node-name-input.name(
          data-test="name"
          :error-messages="getVueErrors('formData.first_name')"
          :label="$t('login.firstName')"
          :readonly="readonly"
          placeholder="--"
          required
          v-model="formData.first_name"
          @blur="$v.formData.first_name.$touch()"
          @input="$v.formData.first_name.$touch()"
        )

      node-name-input.last-name(
        data-test="name"
        :error-messages="getVueErrors('formData.last_name')"
        :label="$t('login.lastName')"
        :readonly="readonly"
        placeholder="--"
        required
        v-model="formData.last_name"
        @blur="$v.formData.last_name.$touch()"
        @input="$v.formData.last_name.$touch()"
      )

      v-flex(xs12 md6 px-3)
        node-name-input.job(
          data-test="job"
          :error-messages="getVueErrors('formData.job_title')"
          :label="$t('general.jobTitle')"
          :readonly="readonly"
          placeholder="--"
          v-model="formData.job_title"
          @blur="$v.formData.job_title.$touch()"
          @input="$v.formData.job_title.$touch()"
        )

      v-flex(xs12 md6 px-3)
        tel-input.phone(
          :readonly="readonly"
          placeholder="--"
          v-model="formData.phone"
          :error-messages="phoneErrors",
          @input="$v.formData.phone.$reset",
          @blur="$v.formData.phone.$touch"
        )

</template>

<script>
import { required, maxLength } from 'vuelidate/lib/validators'
import { nonBlank } from '@/validators'

import CurrentUserMixin from '@/mixins/current-user.mixin'
import EditablePanelMixin from '@/mixins/editable-panel.mixin'
import ErrorHandlerMixin from '@/mixins/error-handler.mixin'

import EditablePanel from '@/components/common/editable-panel'
import TelInput from '@/components/common/tel-input/input'
import { isValidNumber } from 'libphonenumber-js'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  components: {
    EditablePanel,
    TelInput
  },
  mixins: [
    CurrentUserMixin,
    EditablePanelMixin,
    ErrorHandlerMixin
  ],
  validations: {
    formData: {
      first_name: {
        required,
        nonBlank,
        maxLength: maxLength(64)
      },
      last_name: {
        required,
        nonBlank,
        maxLength: maxLength(64)
      },
      job_title: {
        nonBlank,
        maxLength: maxLength(64)
      },
      phone: {
      }
    }
  },
  data () {
    return {
      formData: {
        job_title: '',
        first_name: '',
        last_name: '',
        phone: ''
      },
      phoneValid: false
    }
  },
  mounted () {
    this.setFormData()
  },
  computed: {
    profileErrors () {
      return this.errorData.profile
    },
    phoneErrors () {
      const errors = []
      const phone = this.$v.formData.phone
      if (!phone.$dirty) return errors
      return errors
    },
    disableSubmit () {
      return this.$v.formData.$invalid || !this.phoneValidation
    },
    phoneValidation () {
      if (!this.formData.phone) {
        return true
      }
      return isValidNumber(this.formData.phone)
    }
  },
  methods: {
    setFormData () {
      const profile = this.profile
      this.formData = Object.assign({}, this.formData, {
        job_title: profile.job_title,
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone
      })
    },
    submit () {
      this.isLoading = true
      this.$v.$touch()
      this.clearErrorData()
      if (!this.$v.formData.$invalid) {
        this.updateCurrentUser({ profile: this.formData }).then(response => {
          this.setFormData()
          this.isEditing = false
          this.isLoading = false
          this.showSuccessMessage()
        }).catch(err => {
          this.setErrorData(err)
          this.isLoading = false
        })

        EventTracker.sendEvent(EVENT_NAMES.PERSONAL_INFO_UPDATED, {
          changed_fields: ['job_title', 'first_name', 'last_name', 'phone'].filter(field => this.profile[field] !== this.formData[field])
        })
      }
    }
  }
}
</script>
