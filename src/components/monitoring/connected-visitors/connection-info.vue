<template lang="pug">
  panel-container(:title="$t('general.connectionInformation')")
    v-layout(row wrap)
      v-flex(xs12 md6 px-3)
        readonly-input(
          :label="$t('general.siteGroup')"
          :value="visitorDetails.site__name"
        )
      v-flex(xs12 md6 px-3)
        readonly-input(
          :label="$t('general.clientMacAddress')"
          :value="visitorDetails.client_mac_address"
        )
      v-flex(xs12 md6 px-3)
        readonly-input(
          :label="$t('general.accessPointMacAddress')"
          :value="visitorDetails.ap_mac_address"
        )
      v-flex(xs12 md6 px-3)
        readonly-input(
          :label="$t('general.authenticationProvider')"
          :value="visitorDetails.auth_provider | capitalize"
        )
      v-flex(xs12 md6 px-3)
        readonly-input(
          :label="$t('general.registrationDateTime')"
          :value="dateTimeFormatter(visitorDetails.registration_datetime)"
        )
      v-flex(xs12 md6 px-3)
        readonly-input(
          :label="$t('general.disconnectionDateTime')"
          :value="dateTimeFormatter(visitorDetails.disconnection_datetime)"
        )
      v-flex(xs12 md6 px-3)
        readonly-input(
          :label="$t('general.sessionDuration')"
          :value="visitorDetails.session_duration"
        )
      v-flex(xs12 md6 px-3)
        readonly-input(
          :label="$t('general.uploadedData')"
          :value="visitorDetails.uploaded_data"
        )
      v-flex(xs12 md6 px-3)
        readonly-input(
          :label="$t('general.downloadedData')"
          :value="visitorDetails.downloaded_data"
        )
      v-flex(xs12 md6 px-3)
        readonly-input(
          :label="$t('general.clientIpAddress')"
          :value="visitorDetails.client_ip_address"
        )
      v-flex(xs12 md6 px-3)
        readonly-input(
          :label="$t('general.radiusUserName')"
          :value="visitorDetails.radius_user_name"
        )
      v-flex(xs12 md6 px-3)
        readonly-input(
          :label="$t('general.connectionType')"
          :value="visitorDetails.connection_type"
        )
      v-flex(xs12 md6 px-3)
        readonly-input(
          :label="$t('general.terminationCause')"
          :value="visitorDetails.termination_cause"
        )
      v-flex(xs12 md6 px-3)
        readonly-input(
          :label="$t('general.ssid')"
          :value="visitorDetails.ssid"
        )
</template>
<script>
import { mapGetters } from 'vuex'

import CurrentUserMixin from '@/mixins/current-user.mixin'

import PanelContainer from '@/components/common/panel-container'

export default {
  mixins: [
    CurrentUserMixin
  ],
  components: {
    PanelContainer
  },
  computed: {
    ...mapGetters('organization/visitor', ['visitorDetails'])
  }
}
</script>
