<template lang="pug">
  div
    form.page-form.access-granted(ref='authenticationForm')
      logo(
        :page-config="pageConfig"
        :config="pageConfig.logo.config"
        v-if="!selectedPageInfo.logo || !selectedPageInfo.logo.config || !selectedPageInfo.logo.config.hidden"
      )
      component(
        v-for="component in selectedPageInfo.children"
        :is="componentMapper(component.component)"
        :config="component.config"
        :lang="lang"
        :index="component.id"
        :key="component.id"
        :page-config="pageConfig"
        :page-params="pageParams"
        :component-name="component.component"
        @submit="submitForm"
      )
    iframe(name='portal' height=1 width=1)
</template>

<script>
import heading from '../../components/heading'
import pageMixin from '../../mixins/page-mixin'
import submitButton from '../../components/submit-button'
import Auth from '../../services/auth'

export default {
  props: {
    pageConfig: {
      type: Object,
      required: true
    },
    mainConfig: {
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

  mixins: [
    pageMixin
  ],

  components: {
    heading,
    submitButton
  },

  data () {
    return {
      debug: {
        params: {},
        action_url: ''
      },
      pageKey: 'accessGrantedPage'
    }
  },

  mounted () {
    this.params = {
      ...this.mainConfig,
      ...this.pageParams,
      ...this.mainConfig.formResponse
    }

    // this.params.post_authorization_redirection_url = this.getPostAuthorizationRedirectionUrl(this.params)
    this.params.post_authorization_redirection_url = this.pageParams.registration_server + '/portal/redirection/'
    this.login()
    // this.loginDebug()
  },

  methods: {
    login () {
      Auth.login(this.$refs.authenticationForm, this.params)
    },
    loginDebug () {
      // console.log('Login Debug')
      this.debug.params = this.QueryStringToJSON()
      // console.log(this.$refs.authenticationForm.action)
      // console.log(this.$refs.authenticationForm)
      // console.log(this.debug)
      // console.log('Post Login Debug')
    },
    QueryStringToJSON () {
      let pairs = location.search.slice(1).split('&')
      let result = {}

      pairs.forEach(function (pair) {
        pair = pair.split('=')
        result[pair[0]] = decodeURIComponent(pair[1] || '')
      })

      return JSON.parse(JSON.stringify(result))
    },

    submitForm () {
      this.$refs.authenticationForm.submit()
    },
    getPostAuthorizationRedirectionUrl (params) {
      let redirection = params.campaign.post_authorization_redirection

      if (redirection.mode === 'static') {
        return redirection.static.redirection_url
      }

      if (redirection.mode === 'device_type') {
        let deviceOs = params.device_os
        let deviceRedirect = redirection.device[deviceOs]
        return deviceRedirect || redirection.device.default
      }

      if (redirection.mode === 'connection_mode') {
        let provider = params.authentication_provider
        return redirection.connection[provider] || redirection.connection.form
      }

      if (redirection.mode === 'scenario') {
        return 'https://google.com'
      }

      return 'https://google.com'
    }
  }
}
</script>

<style lang="scss" scoped>
  .error-page {
    background-color: #efefef;
    padding: 10px;
    border-radius: 10px;
  }

  h5 {
    color: #ec5f59;
  }
</style>
