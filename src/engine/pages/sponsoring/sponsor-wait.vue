<template lang="pug">
  .page-form.sponsor-wait
    logo(
      :page-config="pageConfig"
      :config="pageConfig.logo.config"
      v-if="!selectedPageInfo.logo || !selectedPageInfo.logo.config || !selectedPageInfo.logo.config.hidden"
    )
    .alert.alert-danger(role="alert", v-if="showError", v-cloak) {{ translatedErrorMessage }}
    flash-message
    component(
      v-for="component in filteredComponents"
      :is="componentMapper(component.component)"
      :loading="isLoading"
      :config="component.config"
      :lang="lang"
      :index="component.id"
      :key="component.id"
      :page-config="pageConfig"
      :page-params="pageParams"
      :component-name="component.component"
    )
</template>

<script>
import axios from 'axios'
import pageMixin from '../../mixins/page-mixin'
import formSubmissionMixin from '../../mixins/form-submission-handling'

export default {

  props: ['mainConfig', 'pageConfig', 'pageParams', 'lang'],

  mixins: [
    pageMixin,
    formSubmissionMixin
  ],

  data () {
    return {
      isLoading: true,
      errorMessage: 'engine.errorServer',
      showError: false,
      pageKey: 'sponsorWait'
    }
  },
  mounted () {
    this.initialize()
  },
  computed: {
    filteredComponents () {
      if (this.isLoading) {
        return this.selectedPageInfo.children
      } else {
        return this.selectedPageInfo.children.filter(item => ['heading', 'loader'].indexOf(item.component) === -1)
      }
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.name === 'sponsor-wait') {
        this.initialize()
      }
    }
  },
  methods: {
    initialize () {
      if (this.mainConfig.formResponse) {
        this.pollServerForAuthorization()
      } else {
        // Most probably user refreshed the wait page. Redirect to form page in this case.
        this.$router.push('sponsor')
      }
    },
    getKeyVerificationUrl () {
      if (!this.pageParams) {
        return null
      }
      let server = this.pageParams.registration_server
      if (!server) {
        server = window.location.origin
      }
      return server + `/portal/sponsor/verify/`
    },
    pollServerForAuthorization () {
      try {
        let vm = this
        let url = vm.getKeyVerificationUrl()
        if (!url) {
          return setTimeout(vm.pollServerForAuthorization.bind(vm), 200)
        }
        let key = this.mainConfig.formResponse.sponsor_authorization_request_id
        axios.post(url,
          { sponsor_authorization_request_id: key },
          { 'headers': { 'X-Requested-With': 'XMLHttpRequest' } }
        ).then((response) => {
          // let response = {
          //   data: {
          //     authorized: true
          //   }
          // }
          // console.log('wait response', response)
          let resData = response.data
          if (resData.authorized === true) {
            this.isLoading = false
            vm.flash('Success in sponsor', 'success')
            setTimeout(() => {
              vm.$emit('submit', resData)
            }, 300)
          } else if (resData.error === true) {
            this.isLoading = false
            vm.showError = true
            vm.errorMessage = 'engine.retryLogin'
          } else {
            setTimeout(vm.pollServerForAuthorization.bind(vm), 1500)
          }
        }).catch(error => {
          if (this.shouldRetry(error)) {
            // Re-try on 5xx errors if not exceeded max retry limit.
            this.retryFormSubmission(error, this.pollServerForAuthorization.bind(this))
          } else {
            this.handleStatusErrors(error)
          }
        })
      } catch (err) {
        this.handleUnexpectedCodeErrors(err)
      }
    }
  }
}
</script>
