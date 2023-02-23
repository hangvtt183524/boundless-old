<template lang='pug'>
  div(data-test="login-page")
    p.login-text {{ $t('login.organizationRouterDescription')}}
    // email field
    v-layout(row)
      v-flex(xs12)
        v-text-field(
          v-model='organizationSlug',
          required,
          :label="$t('login.organizationSlug')",
        )

    // button container
    v-layout.mt-4(row)
      v-flex(xs12)
        v-btn.success.white--text(
          round, block
          type="button"
          @click="onContinueClick"
          :disabled="!organizationSlug"
        ) {{ $t('login.continue') }}

    // the links below the form: register and forgot pass
    v-layout(row wrap).mt-3
      v-flex(xs6)
        router-link.login-layout-link(to="/login") {{ $t("login.backToLogin") }}

</template>

<script>
import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'LoginOrganizationRouter',

  data () {
    return {
      organizationSlug: ''
    }
  },

  methods: {
    onContinueClick () {
      this.$router.push({ path: '/login/' + this.organizationSlug })

      EventTracker.sendEvent(EVENT_NAMES.USER_LOGGED_IN_VIA_SSO)
    }
  }
}
</script>
