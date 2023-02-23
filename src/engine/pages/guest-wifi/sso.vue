<template lang="pug">
  .page-form.sso-login
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
      v-model="component.value"
      @submit="submitForm"
    )
</template>

<script>
import pageMixin from '../../mixins/page-mixin'
import validationMixin from '../../mixins/page-validation-mixin'
import formSubmissionMixin from '../../mixins/form-submission-handling'

export default {
  mixins: [
    pageMixin,
    validationMixin,
    formSubmissionMixin
  ],
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
      isLoading: false,
      pageKey: 'sso',
      errorMessage: 'engine.errorServer',
      showError: false
    }
  },
  mounted () {
    this.checkErrors()
  },
  methods: {
    getRedirectionUrl () {
      let server = this.pageParams.registration_server
      if (!server) {
        server = window.location.origin
      }
      return server + '/portal/saml/redirection/' + window.location.search
    },
    submitForm () {
      try {
        let vm = this
        if (vm.isInPreview()) {
          vm.$eventHub.$emit('TOGGLE_PREVIEW_MODAL')
          return
        }

        vm.$eventHub.$emit('VALIDATE_INPUTS')
        if (!vm.isValid) {
          return
        }
        vm.showError = false
        let url = vm.getRedirectionUrl()

        // Redirect to saml login url
        window.location.replace(url)
      } catch (err) {
        this.handleUnexpectedCodeErrors(err)
      }
    },
    checkErrors () {
      if (this.pageParams.error) {
        this.errorMessage = `engine.${this.pageParams.error}`
        this.showError = true
      }
    },
    isInPreview () {
      // return false
      return !this.pageParams.portal
    }
  }
}
</script>
