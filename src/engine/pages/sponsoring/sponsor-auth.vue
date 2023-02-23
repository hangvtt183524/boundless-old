<template lang="pug">
  .page-form.sponsor-auth
    logo(
      :page-config="pageConfig"
      :config="pageConfig.logo.config"
      v-if="!selectedPageInfo.logo || !selectedPageInfo.logo.config || !selectedPageInfo.logo.config.hidden"
    )
    .alert.alert-danger(role="alert", v-if="showError", v-cloak) {{ translatedErrorMessage }}
    component(
      v-for="component in renderingComponents"
      :is="componentMapper(component.component)"
      :config="component.config"
      :lang="lang"
      :index="component.id"
      :id="component.id"
      :loading="isLoading"
      :key="component.id"
      @valid="validateInput"
      v-model="component.value"
      :page-config="pageConfig"
      :page-params="pageParams"
      :component-name="component.component"
      @submit="submitForm"
    )
</template>

<script>
import { cloneDeep } from 'lodash'

import axios from 'axios'
import pageMixin from '../../mixins/page-mixin'
import validationMixin from '../../mixins/page-validation-mixin'
import formSubmissionMixin from '../../mixins/form-submission-handling'

export default {
  props: ['pageConfig', 'pageParams', 'lang'],
  mixins: [
    pageMixin,
    validationMixin,
    formSubmissionMixin
  ],
  mounted () {
    this.$eventHub.$emit('VALIDATE_INPUTS')
  },
  data () {
    return {
      pageKey: 'sponsorAuth',
      showError: false,
      errorMessage: 'engine.errorServer',
      isLoading: false,
      successFinish: false
    }
  },
  computed: {
    renderingComponents () {
      if (!this.successFinish) {
        return this.selectedPageInfo.children
      } else {
        let headingComponent = this.selectedPageInfo.children.find(item => ['heading'].indexOf(item.component) !== -1)
        if (headingComponent) {
          let copiedHeading = cloneDeep(headingComponent)
          copiedHeading.config.translation = {
            en_US: {
              title: 'Your guest has been granted wifi access'
            },
            fr_FR: {
              title: 'Votre invité a obtenu un accès wifi'
            }
          }
          if (!copiedHeading.config.translation[this.lang]) {
            copiedHeading.config.translation[this.lang] = 'Your guest has been granted wifi access'
          }
          return [copiedHeading]
        }
        return []
      }
    }
  },
  methods: {
    getFormSubmitUrl () {
      let server = this.pageParams.registration_server
      if (!server) {
        server = window.location.origin
      }
      return server + '/portal/sponsor/authorize/'
    },
    submitForm () {
      try {
        let vm = this
        if (vm.isInPreview()) {
          vm.$eventHub.$emit('TOGGLE_PREVIEW_MODAL')
          return
        }

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
        formData.authorization = vm.getFormData()

        // console.log('formData before submit', url, formData)

        axios.post(url, formData, {
          'headers': {
            'X-Requested-With': 'XMLHttpRequest'
          }
        }).then((response) => {
          // let response = {
          //   data: {
          //     success: true
          //   }
          // }
          vm.isLoading = false
          // console.log(response)
          if (response.data.success === true) {
            vm.successFinish = true
          } else { // "fail"
            vm.showError = true
            vm.errorMessage = 'engine.retryLogin'
          }
          // this.handleResponse(response)
        }).catch(error => {
          if (this.shouldRetry(error)) {
            // Re-try on 5xx errors if not exceeded max retry limit.
            this.retryFormSubmission(error, this.submitForm.bind(this))
          } else {
            this.handleStatusErrors(error)
          }
        })
      } catch (err) {
        this.handleUnexpectedCodeErrors(err)
      }
    },
    getFormData () {
      let children = this.selectedPageInfo.children
      let formElms = children.filter((c) => {
        let t = c.component
        return (['text-input', 'email-input', 'phone-input', 'terms-checkbox', 'select-input'].indexOf(t) !== -1)
      })

      let custom = {}
      formElms.forEach((c) => {
        let value
        if (c.component === 'select-input') {
          var e = document.getElementById(c.id).getElementsByTagName('select')[0]
          value = e.options[e.selectedIndex].value
        } else {
          value = document.getElementById(c.id).getElementsByTagName('input')[0].value
        }

        if (c.config.fieldName) {
          custom[c.config.fieldName] = value
        } else {
          custom['custom-' + c.id] = value
        }
      })
      return custom
    },
    isInPreview () {
      return false // NO NEED TO fetch portal param on sponsor-auth
    }
  }
}
</script>
