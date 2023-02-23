<template lang="pug">
  base-dialog(:show="show", @close="$emit('close')")
    .contact-us-dialog(data-test="contact-us-dialog")
      v-layout(row)
        v-flex.mb-4(xs12)
          h2.dialog-heading.mb-1 {{ $t('contact.contactUs') }}
          h4.dialog-subtitle {{ $t('contact.fillTheContactForm') }}

      // contact row
      v-layout(row wrap)
        v-flex(xs12 sm6 px-2)
          v-text-field.contact-us-name(
            data-test="contact-us-name"
            :error-messages="getVueErrors('contactForm.name')"
            :label="$t('general.name')"
            :name="$t('general.name')"
            @blur="$v.contactForm.name.$touch()"
            @input="$v.contactForm.name.$touch()"
            required
            v-model="contactForm.name"
          )
        v-flex(xs12 sm6 px-2)
          v-text-field.contact-us-email(
            data-test="contact-us-email"
            :error-messages="emailErrors"
            :label="$t('general.email')"
            :name="$t('general.email')"
            @blur="$v.contactForm.email.$touch()"
            required
            v-model="contactForm.email"
          )
        v-flex(xs12 sm6 px-2 v-if="show")
          tel-input(
            :error-messages="getVueErrors('contactForm.telephone')"
            :label="$t('general.phoneNumber')"
            @blur="$v.contactForm.telephone.$touch()"
            @input="$v.contactForm.telephone.$reset()"
            required
            v-model="contactForm.telephone"
          )
        v-flex(xs12 sm6 px-2)
          availability-select.contact-us-availability(
            data-test="contact-us-availability"
            :error-messages="getVueErrors('contactForm.availability')"
            @blur="$v.contactForm.availability.$touch()"
            required
            v-model="contactForm.availability"
          )
        v-flex(xs12 px-2)
          v-textarea.contact-us-message(
            data-test="contact-us-message"
            :error-messages="getVueErrors('contactForm.message')"
            :label="$t('contact.writeMessageHere')"
            :name="$t('contact.writeMessageHere')"
            @blur="$v.contactForm.message.$touch()"
            @input="$v.contactForm.message.$reset()"
            required
            outline
            v-model='contactForm.message'
          )

      v-layout.pt-3(row)
        v-flex(xs12)
          em.required-label {{ $t('contact.mandatoryFields') }}
      v-layout.pt-3.text-xs-right(row)
        v-flex(xs12)
          v-btn.btn-send(
            data-test="btn-send"
            :disabled="$v.contactForm.$invalid || !phoneValidation"
            :loading="loading"
            @click="submitForm"
            color="success"
            large
            round
          ) {{$t('general.send')}}
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import { required, email, maxLength } from 'vuelidate/lib/validators'
import { nonBlank } from '@/validators'

import ErrorHandlerMixin from '@/mixins/error-handler.mixin'

import AvailabilitySelect from '@/components/common/availability-select'
import baseDialog from '@/components/common/base-dialog'
import telInput from '@/components/common/tel-input/input'
import { isValidNumber } from 'libphonenumber-js'

export default {
  name: 'ContactUsDialog',

  props: ['show'],

  mixins: [
    ErrorHandlerMixin
  ],

  components: {
    AvailabilitySelect,
    baseDialog,
    telInput
  },

  validations: {
    contactForm: {
      email: {
        required,
        email
      },
      name: {
        required,
        nonBlank
      },
      telephone: {
        required
      },
      availability: {
        required
      },
      message: {
        required,
        nonBlank,
        maxLength: maxLength(500)
      }
    }
  },

  data () {
    return {
      contactForm: {
        name: '',
        email: '',
        telephone: '',
        availability: '',
        message: ''
      },
      loading: false
    }
  },

  watch: {
    show (value) {
      if (value) {
        Object.assign(this.contactForm, {
          name: this.currentUser.profile.full_name,
          telephone: this.currentUser.profile.phone,
          email: this.currentUser.email,
          availability: '',
          message: ''
        })
        this.$v.$reset()
      }
    }
  },

  mounted () {
    Object.assign(this.contactForm, {
      name: this.currentUser.profile.full_name,
      telephone: this.currentUser.profile.phone,
      email: this.currentUser.email
    })
  },

  methods: {
    submitForm () {
      this.$v.$touch()
      const API_URL = process.env.VUE_APP_API_URL

      Object.assign(this.contactForm, {}, {
        type: 'contact',
        subject: 'Contact Form Submission'
      })

      if (!this.$v.contactForm.$invalid) {
        this.loading = true
        axios.post(API_URL + '/contact/', this.contactForm).then((response) => {
          global.toastr['success'](this.$t('contact.contactSuccessMessage'), this.$t('general.success'))
          this.loading = false
          this.clearForm()
          this.$emit('close')
        }).catch(() => {
          this.loading = false
        })
      }
    },
    clearForm () {
      this.contactForm = {
        name: this.currentUser.profile.full_name,
        email: this.currentUser.email,
        telephone: this.currentUser.profile.phone,
        availability: '',
        message: ''
      }

      this.$v.$reset()
    }
  },
  computed: {
    ...mapGetters('user', ['currentUser']),
    phoneValidation () {
      return isValidNumber(this.contactForm.telephone)
    },
    emailErrors () {
      return this.getVueErrors('contactForm.email')
    }
  }
}
</script>

<style>
  .required-label {
    color: #9ba9c4 !important;
  }

  .input-group--textarea textarea{
    box-shadow: none;
  }
</style>
