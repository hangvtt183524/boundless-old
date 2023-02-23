<template lang="pug">
  panel-container(:title="$t('general.generalInformation')")
    v-layout(row wrap)
      v-flex(xs12 px-3)
        v-flex(xs6)
          img(
            :src="visitorDetails.profile_picture ? visitorDetails.profile_picture : require('@/assets/images/profile-placeholder.png')"
            style="width: 100%; margin-bottom: 10px;"
            )
      v-flex(xs12 md6 px-3)
          readonly-input(
            :label="$t('general.name')"
            :value="visitorDetails.name"
          )
      v-flex(xs12 md6 px-3)
        readonly-input(
          :label="$t('general.browser')"
          :value="visitorDetails.browser"
        )
      v-flex(xs12 md6 px-3)
        readonly-input(
          :label="$t('general.operatingSystem')"
          :value="visitorDetails.operation_system | capitalize"
        )
      v-flex(xs12 md6 px-3)
        readonly-input(
          :label="$t('general.device')"
          :value="visitorDetails.device_type | capitalize"
        )
      v-flex(xs12 md6 px-3)
        readonly-input(
          :label="$t('general.userAgent')"
          :value="visitorDetails.user_agent"
        )
      v-flex(xs12 md6 px-3)
        readonly-input(
          :label="$t('general.campaign')"
          :value="visitorDetails.campaign_name"
        )
      v-flex(xs12 md6 px-3)
        readonly-input(
          :label="$t('general.splashPage')"
          :value="visitorDetails.splashpage_name"
        )
      v-flex(xs12 md6 px-3)
        readonly-input(
          :label="$t('general.deviceLanguage')"
          :value="visitorDetails.device_language"
        )
      v-flex(xs12 md6 px-3)
        readonly-input(
          :label="$t('general.pageLanguage')"
          :value="visitorDetails.page_language"
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
