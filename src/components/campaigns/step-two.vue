<template lang="pug">
  .step-two.campaign-redirection
    v-layout.mb-4(row)
      v-flex(xs12, sm6, class="input-wrap")
        h2.step-heading(v-show="!value.isConditionalRedirect")
          | {{ $t('campaign.redirectionUrl') }}
        h2.step-heading(v-show="value.isConditionalRedirect")
          | {{ $t('campaign.chooseRedirectionMethod') }}
      v-flex(xs12, offset-sm3, sm3)
        base-switch(
          color="deep-purple lighten-2"
          :label-left="$t('general.static')"
          :label-right="$t('general.conditional')"
          v-model="value.isConditionalRedirect"
        )

    div(v-show="!value.isConditionalRedirect")
      v-text-field.transparent.static-url-input(
        :error-messages="getVueErrors('value.redirection_url_static')"
        :label="$t('campaign.redirectLink')"
        :append-icon="urlAppendIcon('value.redirection_url_static', value.redirection_url_static)"
        @click:append="onFieldIconClick('redirection_url_static')"
        :error="hasVueError('value.redirection_url_static')"
        @blur="$v.value.redirection_url_static.$touch()"
        v-model="value.redirection_url_static"
        class="url-field"
        solo-inverted
      )

    div(v-show="value.isConditionalRedirect")
      .item-list.redirection-list
        .item(
          v-for="mode in redirectionModes"
          @click="selectMode(mode)"
          :class="{'active': mode.value === value.redirection_mode}"
        )
          p {{ mode.title }}

      connection-mode(
        ref="connectionMode"
        v-if="value.redirection_mode === 'connection_mode'"
        v-model="value"
      )

      mobile-mode(
        ref="mobileMode"
        v-if="value.redirection_mode === 'device_type'"
        v-model="value"
      )
</template>

<script>
import { url } from 'vuelidate/lib/validators'

import CampaignUrlMixin from '@/mixins/campaign-url.mixin'
import CampaignRedirectionMixin from '@/mixins/campaign-redirection.mixin'
import ErrorHandlerMixin from '@/mixins/error-handler.mixin'

import connectionMode from './step-two-connection-mode'
import mobileMode from './step-two-mobile-mode'
import baseSwitch from '@/components/common/base-switch'

export default {
  props: ['value', 'campaign', 'hideSteps'],
  components: {
    connectionMode,
    mobileMode,
    baseSwitch
  },
  mixins: [
    CampaignUrlMixin,
    CampaignRedirectionMixin,
    ErrorHandlerMixin
  ],
  data () {
    if (process.env.VUE_APP_FEATURES === 'production') {
      return {
        redirectionModes: [
          { value: 'connection_mode', title: this.$t('campaign.redirectionConnectionMode') },
          { value: 'device_type', title: this.$t('campaign.redirectionMobile') }
        ]
      }
    }
    return {
      redirectionModes: [
        { value: 'connection_mode', title: this.$t('campaign.redirectionConnectionMode') },
        { value: 'device_type', title: this.$t('campaign.redirectionMobile') },
        { value: 'scenario', title: this.$t('campaign.redirectionScenario') }
      ]
    }
  },
  validations: {
    value: {
      redirection_url_static: { url }
    }
  },
  methods: {
    isValid () {
      if (!this.value.isConditionalRedirect) {
        return this.value.redirection_url_static && !this.$v.value.redirection_url_static.$invalid
      } else {
        return this.isConditionalValid()
      }
    },
    onFieldIconClick (field) {
      if (this.hasVueError(`value.${field}`)) {
        this.$set(this.value, field, '')
      }
    }
  }
}
</script>

<style lang="scss">
  @import "styles/components/campaign-redirection.scss";

  .item-list.redirection-list {
    justify-content: space-evenly!important;
  }

  .v-text-field:not(.search-input):not(.v-textarea).static-url-input {
    height: 95px;
  }

</style>
