<template lang="pug">
  .sso-authentication(data-test="sso-authentication")
    v-layout.mb-3
      v-flex(pa-2 pb-4 xs6 md6)
        saml-details(
          data-test="server-details"
          :login-url="samlConfig.login_url"
          :public-certificate="samlConfig.public_certificate"
          :metadata-url="samlConfig.metadata_url"
          @change="changeSAMLConfig"
        )
      v-flex.pb-3(xs6, md6, lg6, text-xs-right)
        v-btn.primary-action(
          data-test="btn-save"
          color='primary'
          @click.stop='submitSAMLConfig'
          :disabled="!isChanged"
          :loading="loading"
        )
          | {{ $t('general.save') }}
          v-icon save
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SamlDetails from './configuration/sso/saml-details'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  components: {
    SamlDetails
  },

  data () {
    return {
      samlConfig: {
        login_url: '',
        public_certificate: '',
        metadata_url: ''
      },
      preSamlConfig: {
        login_url: '',
        public_certificate: '',
        metadata_url: ''
      },
      nodeFilters: {
        layout: 'flat',
        types: 'organization,group,site,floor'
      },
      loading: false
    }
  },

  mounted () {
    if (this.selectedNode.id) {
      this.getSAMLConfig()
    }
  },

  computed: {
    ...mapGetters('layout', ['selectedOrganization', 'selectedNode']),
    isChanged () {
      if (global._.isEqual(this.preSamlConfig, this.samlConfig)) {
        return false
      }
      return true
    },
    getAppFeatures: function () {
      return process.env.VUE_APP_FEATURES
    }
  },

  methods: {
    ...mapActions('organization/node', ['updateNode']),
    changeSAMLConfig (value) {
      this.samlConfig = { ...this.samlConfig, ...value }
    },
    getSAMLConfig () {
      this.samlConfig = this.selectedNode.wifi_config_saml || {
        login_url: '',
        public_certificate: '',
        metadata_url: ''
      }
      this.preSamlConfig = this.selectedNode.wifi_config_saml || {
        login_url: '',
        public_certificate: '',
        metadata_url: ''
      }
    },
    submitSAMLConfig () {
      if (!this.samlConfig.login_url || !this.samlConfig.public_certificate) return

      this.loading = true
      this.updateNode({ nodeId: this.selectedNode.id, wifi_config_saml: this.samlConfig }).then(response => {
        this.samlConfig = { ...response.data.data.wifi_config_saml }
        this.preSamlConfig = { ...response.data.data.wifi_config_saml }
        global.toastr['success'](this.$t('wifi.savedSuccessfully'), this.$t('general.success'))
        this.loading = false
      }).catch(() => {
        this.loading = false
      })

      EventTracker.sendEvent(EVENT_NAMES.SSO_AUTHENTICATION_CONFIGURED)
    }
  },
  watch: {
    selectedNode (newValue, oldValue) {
      if (!oldValue || !oldValue.id || !oldValue.hasOwnProperty('wifi_config_saml') || newValue.id !== oldValue.id) {
        this.getSAMLConfig()
      }
    }
  }
}
</script>

<style lang="scss">
@import "styles/colors.scss";
.sso-authentication {
  margin-top: 20px;

  .header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .slider-display {
    display: flex;
    align-items: baseline;
    .slider-title {
      min-width: 100px;
      float: left;
    }
  }
}
</style>
