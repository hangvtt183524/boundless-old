<template lang="pug">
div.connection-mode
  h4.step-heading.mb-4(:class="{ 'input-wrap': true, 'mt-5': !readonly }")
    | {{ $t('campaign.redirectionConnectionMode') }}
  .connect-form
    .connect-group(v-if="!isConditionalValid()")
      .connect-icon
      .connect-field
        p.warning-message {{ $t('errors.fillWarning') }}
    .connect-group
      .connect-icon
        v-icon.default fa-file
        span {{$t('general.form')}}
      .connect-field
        v-text-field(
          v-model="value.redirection_url_auth_form"
          :append-icon="urlAppendIcon('value.redirection_url_auth_form', value.redirection_url_auth_form)"
          @click:append="onFieldIconClick('redirection_url_auth_form')"
          :error-messages="getVueErrors('value.redirection_url_auth_form')"
          :label="$t('campaign.redirectLink')"
          :readonly="readonly"
          :placeholder="placeholder"
          @blur="$v.value.redirection_url_auth_form.$touch()"
          class="url-field"
        )

    .connect-group(v-for="key in redirects" :key="key")
      .connect-icon
        v-icon(:class="`${key} fab fa-${key}`")
        span {{ key|capitalize }}
      .connect-field
        v-text-field(
          v-model="value[`redirection_url_auth_${key}`]"
          :append-icon="urlAppendIcon(`value.redirection_url_auth_${key}`, value[`redirection_url_auth_${key}`])"
          @click:append="onFieldIconClick(`redirection_url_auth_${key}`)"
          :error-messages="getVueErrors(`value.redirection_url_auth_${key}`)"
          :label="$t('campaign.redirectLink')"
          :readonly="readonly"
          :placeholder="placeholder"
          @blur="$v.value[`redirection_url_auth_${key}`].$touch()"
          class="url-field"
        )
</template>

<script>
import { url } from 'vuelidate/lib/validators'

import CampaignUrlMixin from '@/mixins/campaign-url.mixin'
import ErrorHandlerMixin from '@/mixins/error-handler.mixin'
import CampaignRedirectionMixin from '@/mixins/campaign-redirection.mixin'

export default {
  props: {
    value: {
      type: Object,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  mixins: [
    CampaignUrlMixin,
    CampaignRedirectionMixin,
    ErrorHandlerMixin
  ],
  data () {
    return {
      redirects: [
        'twitter',
        'instagram',
        'facebook',
        'linkedin',
        'google'
      ]
    }
  },
  validations: {
    value: {
      redirection_url_auth_form: { url },
      redirection_url_auth_facebook: { url },
      redirection_url_auth_twitter: { url },
      redirection_url_auth_linkedin: { url },
      redirection_url_auth_instagram: { url },
      redirection_url_auth_google: { url }
    }
  },
  methods: {
    onFieldIconClick (field) {
      if (this.hasVueError(`value.${field}`)) {
        this.$set(this.value, field, '')
      }
    }
  }
}
</script>
