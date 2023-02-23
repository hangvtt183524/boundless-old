<template lang="pug">
  div.sso-details
    v-layout.header-section(row wrap)
      h3.small-heading.py-3
        | {{ $t('organization.ssoConfiguration') }}
    .form-card.round
      v-layout(row wrap)
        v-flex(xs12)
          v-text-field.login-url-input(
            data-test="login-url-input"
            :label="$t('wifi.ssoLoginUrl')"
            ref="loginUrl"
            v-model="loginUrlModel"
            :error-messages="loginUrlErrors"
            @input="delayTouch($v.loginUrl)"
            @blur="$v.loginUrl.$touch"
          )
        v-flex(xs12)
          v-textarea.public-certificate-input(
            data-test="public-certificate-input"
            :label="$t('v2.organization.settings.publicCertificate')"
            ref="publicCertificate"
            v-model="publicCertificateModel"
            :error-messages="publicCertificateErrors"
            @input="delayTouch($v.publicCertificate)"
            @blur="$v.publicCertificate.$touch"
            outline
          )
        v-flex(xs12)
          v-text-field.metadata-url-input(
            data-test="metadata-url-input"
            :label="$t('wifi.metadataUrl')"
            ref="metadataUrl"
            v-model="metadataUrlModel"
          )
        v-flex(xs12)
          v-text-field.consumer-url-display-input(
            data-test="consumer-url-display-input"
            :label="$t('v2.organization.settings.consumerUrl')"
            :value="consumerUrl"
            append-icon="fa-clipboard",
            @click:append="onCopyConsumerUrlClick()",
            readonly
          )
</template>
<script>
import { required } from 'vuelidate/lib/validators'
import copyTextToClipboard from '@/utils/copy-to-clipboard'

export default {
  props: {
    loginUrl: {
      type: String
    },
    publicCertificate: {
      type: String
    },
    metadataUrl: {
      type: String
    }
  },
  mounted () {
    this.getData()
  },
  data () {
    return {
      loginUrlModel: '',
      publicCertificateModel: '',
      metadataUrlModel: ''
    }
  },

  validations: {
    loginUrl: {
      required
    },
    publicCertificate: {
      required
    }
  },
  computed: {
    loginUrlErrors () {
      const errors = []
      this.$v.loginUrl.$dirty && !this.loginUrlModel && errors.push(`${this.$t('errors.required')}`)
      return errors
    },
    publicCertificateErrors () {
      const errors = []
      this.$v.publicCertificate.$dirty && !this.publicCertificateModel && errors.push(`${this.$t('errors.required')}`)
      return errors
    },
    consumerUrl () {
      return process.env.VUE_APP_PORTAL_SAML_CONSUMER_URL
    }
  },
  watch: {
    loginUrlModel (v) {
      this.makeParams()
    },
    publicCertificateModel (v) {
      this.makeParams()
    },
    metadataUrlModel (v) {
      this.makeParams()
    },
    loginUrl (v) {
      this.getData()
    },
    publicCertificate (v) {
      this.getData()
    },
    metadataUrl (v) {
      this.getData()
    }
  },
  methods: {
    makeParams () {
      const data = {
        login_url: this.loginUrlModel,
        public_certificate: this.publicCertificateModel,
        metadata_url: this.metadataUrlModel
      }
      this.$emit('change', data)
    },
    getData () {
      this.loginUrlModel = this.loginUrl
      this.publicCertificateModel = this.publicCertificate
      this.metadataUrlModel = this.metadataUrl
    },
    onCopyConsumerUrlClick () {
      copyTextToClipboard(this.consumerUrl).then(() => {
        global.toastr['success'](this.$t('general.urlCopied'))
      })
    }
  }
}
</script>
<style lang="scss">
  @import "styles/v2/colors.scss";

  .sso-details {
    min-width: 400px;

    label.info-label {
      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 41px;
      color: $text-medium;
      display: block;
    }
  }
</style>
