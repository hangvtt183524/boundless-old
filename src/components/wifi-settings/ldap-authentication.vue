<template lang="pug">
  .ldap-authentication(data-test="ldap-authentication")
    v-layout.mb-3
      v-flex(pa-2 pb-4 xs6 md6)
        server-details(
          data-test="server-details"
          :server="ldapConfig.server"
          :base-dn="ldapConfig.base_dn"
          @change="changeLdapConfig"
        )
      v-flex.pb-3(xs6, md6, lg6, text-xs-right)
        v-btn.primary-action(
          data-test="btn-save"
          color='primary'
          @click.stop='submitLdapConfig'
          :disabled="!isChanged"
          :loading="loading"
        )
          | {{ $t('general.save') }}
          v-icon save
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ServerDetails from './configuration/ldap/server-details'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  components: {
    ServerDetails
  },

  data () {
    return {
      ldapConfig: {
        server: '',
        base_dn: ''
      },
      preLdapConfig: {
        server: '',
        base_dn: ''
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
      this.getLdapConfig()
    }
  },

  computed: {
    ...mapGetters('layout', ['selectedOrganization', 'selectedNode']),
    isChanged () {
      if (global._.isEqual(this.preLdapConfig, this.ldapConfig)) {
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
    changeLdapConfig (value) {
      this.ldapConfig = { ...this.ldapConfig, ...value }
    },
    getLdapConfig () {
      this.ldapConfig = this.selectedNode.wifi_config_ldap || {
        server: '',
        base_dn: ''
      }
      this.preLdapConfig = this.selectedNode.wifi_config_ldap || {
        server: '',
        base_dn: ''
      }
    },
    submitLdapConfig () {
      if (!this.ldapConfig.server || !this.ldapConfig.base_dn) return

      this.loading = true
      this.updateNode({ nodeId: this.selectedNode.id, wifi_config_ldap: this.ldapConfig }).then(response => {
        this.ldapConfig = { ...response.data.data.wifi_config_ldap }
        this.preLdapConfig = { ...response.data.data.wifi_config_ldap }
        global.toastr['success'](this.$t('wifi.savedSuccessfully'), this.$t('general.success'))
        this.loading = false
      })

      EventTracker.sendEvent(EVENT_NAMES.LDAP_AUTHENTICATION_CONFIGURED)
    }
  },
  watch: {
    selectedNode (newValue, oldValue) {
      if (!oldValue || !oldValue.id || !oldValue.hasOwnProperty('wifi_config_ldap') || newValue.id !== oldValue.id) {
        this.getLdapConfig()
      }
    }
  }
}
</script>

<style lang="scss">
@import "styles/colors.scss";
.ldap-authentication {
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
