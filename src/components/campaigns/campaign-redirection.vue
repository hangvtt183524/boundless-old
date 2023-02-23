<template lang="pug">
  panel-container.campaign-redirection(
    :slot-title="true"
    flex
  )
    v-layout(row wrap slot="title")
      v-flex
        h3.small-heading {{ $t('general.redirectionMethod') }}
      v-flex
        base-switch(
          :label-left="$t('general.static')"
          :label-right="$t('general.conditional')"
          :readonly="readonly"
          v-model="value.isConditionalRedirect"
          color="deep-purple lighten-2"
        )

    v-layout(row wrap)
      v-flex(xs12 v-show="!value.isConditionalRedirect" pt-3 pb-4)
        v-text-field.transparent(
          :error-messages="getVueErrors('value.redirection_url_static')"
          :label="$t('campaign.redirectLink')"
          :append-icon="urlAppendIcon('value.redirection_url_static', value.redirection_url_static)"
          @click:append="onFieldIconClick('redirection_url_static')"
          :error="hasVueError('value.redirection_url_static')"
          @blur="$v.value.redirection_url_static.$touch()"
          v-model="value.redirection_url_static"
          class="url-field"
          solo-inverted
          :readonly="readonly"
        )

      v-flex(xs12 v-show="value.isConditionalRedirect" pt-0)
        .item-list.redirection-list(v-if="!readonly")
          .item(
            v-for="mode in redirectionModes"
            @click="selectMode(mode)"
            :class="{'active': mode.value === value.redirection_mode}"
          )
            p {{ mode.title }}

        connection-mode(
          v-if="value.redirection_mode === 'connection_mode'"
          :readonly="readonly"
          ref="connectionMode"
          v-model="value"
          placeholder="--"
        )
        mobile-mode(
          v-if="value.redirection_mode === 'device_type'"
          :readonly="readonly"
          ref="mobileMode"
          v-model="value"
          placeholder="--"
        )
</template>

<script>
import { url } from 'vuelidate/lib/validators'

import CurrentUserMixin from '@/mixins/current-user.mixin'
import ErrorHandlerMixin from '@/mixins/error-handler.mixin'
import CampaignUrlMixin from '@/mixins/campaign-url.mixin'
import CampaignRedirectionMixin from '@/mixins/campaign-redirection.mixin'

import PanelContainer from '@/components/common/panel-container'
import ConnectionMode from './step-two-connection-mode'
import MobileMode from './step-two-mobile-mode'

export default {
  props: {
    value: {
      type: Object,
      required: true
    },
    readonly: {
      type: Boolean,
      default: true
    }
  },
  mixins: [
    CampaignUrlMixin,
    CampaignRedirectionMixin,
    CurrentUserMixin,
    ErrorHandlerMixin
  ],
  data () {
    return {
      redirectionModes: [
        { value: 'connection_mode', title: this.$t('campaign.redirectionConnectionMode') },
        { value: 'device_type', title: this.$t('campaign.redirectionMobile') }
      ]
    }
  },
  components: {
    PanelContainer,
    ConnectionMode,
    MobileMode
  },
  validations: {
    value: {
      redirection_url_static: { url }
    }
  },
  computed: {
    maxTime () {
      if (this.value.startDate && this.value.endDate) {
        if (this.value.startDate === this.value.endDate) {
          return this.value.endTime
        }
      }
      return null
    },
    minTime () {
      if (this.value.startDate && this.value.endDate) {
        if (this.value.startDate === this.value.endDate) {
          return this.value.startTime
        }
      }
      return null
    }
  },
  methods: {
    selectMode (mode) {
      this.$set(this.value, 'redirection_mode', mode.value)
      this.$emit('input', this.value)

      // scroll to specific section on type select
      this.$nextTick(() => {
        let el
        switch (mode.value) {
          case 'connection_mode':
            el = this.$refs.connectionMode.$el
            break
          case 'device_type':
            el = this.$refs.mobileMode.$el
            break
        }
        this.$el.closest('.dialog').scrollTop = el.scrollHeight
      })
    },
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
</style>
