<template lang="pug">
  .page-form.sms-access-code
    logo(
      :page-config="pageConfig"
      :config="pageConfig.logo.config"
      v-if="!selectedPageInfo.logo || !selectedPageInfo.logo.config || !selectedPageInfo.logo.config.hidden"
    )
    .alert.alert-danger(role="alert", v-if="showError", v-cloak) {{ translatedErrorMessage }}
    component(
      v-for="component in selectedPageInfo.children"
      :is="componentMapper(component.component)"
      :config="component.config"
      :lang="lang"
      :index="component.id"
      :key="component.id"
      :id="component.id"
      :loading="isLoading"
      :page-config="pageConfig"
      :page-params="pageParams"
      :component-name="component.component"
      @valid="validateInput"
      @submit="submitForm"
    )
</template>

<script>
import axios from 'axios'

import emailInput from '../../components/email-input'
import textInput from '../../components/text-input'
import passwordInput from '../../components/password-input'
import phoneInput from '../../components/phone-input'
import submitButton from '../../components/submit-button'
import accessLink from '../../components/access-link'

import pageMixin from '../../mixins/page-mixin'
import validationMixin from '../../mixins/page-validation-mixin'
import formSubmissionMixin from '../../mixins/form-submission-handling'

export default {
  mixins: [
    pageMixin,
    validationMixin,
    formSubmissionMixin
  ],
  components: {
    emailInput,
    textInput,
    passwordInput,
    phoneInput,
    submitButton,
    accessLink
  },
  props: {
    pageConfig: {
      type: Object,
      required: true
    },
    pageParams: {
      type: Object,
      required: true
    },
    lang: {
      type: String
    }
  },
  data () {
    return {
      showError: false,
      errorMessage: 'engine.errorServer',
      isLoading: false,
      pageKey: 'smsAccessCode'
    }
  },
  methods: {
    getFormSubmitUrl () {
      let server = this.pageParams.registration_server
      if (!server) {
        server = window.location.origin
      }
      return server + '/portal/sms/code/'
    },
    submitForm () {
      let vm = this
      try {
        if (vm.isInPreview()) {
          vm.$eventHub.$emit('TOGGLE_PREVIEW_MODAL')
          return
        }

        vm.$eventHub.$emit('VALIDATE_INPUTS')
        if (!vm.isValid) {
          return
        }
        vm.showError = false
        let url = vm.getFormSubmitUrl()
        vm.isLoading = true
        let formData = JSON.parse(JSON.stringify(vm.pageParams))
        formData.custom = vm.getFormData()

        // console.log('formData before submit', url, formData)

        axios.post(url, formData, {
          'headers': {
            'X-Requested-With': 'XMLHttpRequest'
          }
        }).then((response) => {
          vm.isLoading = false

          // console.log(response)
          // if (response.data.status === 'success') {
          //   vm.$emit('submit', response.data)
          // } else { // "fail"
          //   vm.showError = true
          //   vm.errorMessage = 'engine.invalidCode'
          // }
          this.handleResponse(response)
        }).catch(error => {
          if (this.shouldRetry(error)) {
            // Re-try on 5xx errors if not exceeded max retry limit.
            this.retryFormSubmission(error, this.submitForm.bind(this))
          } else {
            this.handleStatusErrors(error)
          }
        })
      } catch (err) {
        vm.handleUnexpectedCodeErrors(err)
      }
    },
    getFormData () {
      try {
        let children = this.selectedPageInfo.children
        let formElms = children.filter((c) => {
          let t = c.component
          return (t === 'text-input' || t === 'email-input' || t === 'phone-input' || t === 'terms-checkbox')
        })

        let custom = {}
        formElms.forEach((c) => {
          let value = document.getElementById(c.id).getElementsByTagName('input')[0].value

          if (c.config.fieldName) {
            custom[c.config.fieldName] = value
          } else {
            custom['custom-' + c.id] = value
          }
        })
        return custom
      } catch (err) {
        console.error(err)
      }
    },
    isInPreview () {
      // return false
      return !this.pageParams.portal
    }
  }
}
</script>
