<template lang="pug">
  .social-oauth-setting-item
    v-layout(row wrap)
      v-flex.social-oauth-setting-item__icon-container(xs1)
        v-icon.social-oauth-setting-item__icon
          | {{'$vuetify.icons.'+provider}}
      v-flex.social-oauth-setting-item__content-container(xs11)
        .social-oauth-setting-item__header(
          @click="onTitleClick"
        )
          .social-oauth-setting-item__header__title
            | {{ provider }}
          .social-oauth-setting-item__header__use-check(
            @click.stop="stopPropagation"
          )
            base-check-box(
              v-model="useCustomConfig"
              @input="onUseCheckInput"
              :label="$t('v2.organization.settings.customOauthApp')"
            )
        transition(name="slide")
          .social-oauth-setting-item__content(
            v-show="expanded"
          )
            .social-oauth-setting-item__content__setting-element
              label.social-oauth-setting-item__content__setting-label
                | {{ $t('v2.organization.settings.oauthId') }}:
              span.social-oauth-setting-item__content__setting-value(
                v-show="editing === false"
              )
                | {{ oauthConfig.oauth_id ? oauthConfig.oauth_id : '-' }}
              base-text-input.social-oauth-setting-item__content__setting-input.base-text-input--small(
                v-show="editing === true"
                v-model="oauthConfig.oauth_id"
                placeholder="..."
                :validations="{ required: true }"
              )

            .social-oauth-setting-item__content__setting-element
              label.social-oauth-setting-item__content__setting-label
                | {{ $t('v2.organization.settings.oauthSecretKey') }}:
              span.social-oauth-setting-item__content__setting-value(
                v-show="editing === false"
              )
                | {{ secretKeyDisplay ? secretKeyDisplay : '-' }}
              base-text-input.social-oauth-setting-item__content__setting-input.base-text-input--small(
                v-show="editing === true"
                v-model="oauthConfig.oauth_secret_key"
                :placeholder="secretKeyDisplay ? secretKeyDisplay : '...'"
              )

            v-icon.social-oauth-setting-item__content__edit-trigger(
              v-show="editing === false"
              @click="onEditTriggerClick"
            ) edit
            v-icon.social-oauth-setting-item__content__edit-trigger(
              v-show="editing === true"
              @click="onEditTriggerClick"
            ) visibility
            base-button(
              v-show="editing === true"
              class="base-button--green"
              @click="onSaveClick"
              :disabled="!isValueChanged || !isValid"
            ) {{ $t('general.save') }}

    .social-oauth-setting-item__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )
</template>

<script>
import _ from 'lodash'
import BaseCheckBox from '@/components/v2/base-check-box/base-check-box'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import BaseButton from '@/components/v2/base-button/base-button'
import { mapActions, mapGetters } from 'vuex'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'social-oauth-setting-item',
  components: {
    BaseTextInput,
    BaseCheckBox,
    BaseButton
  },
  props: {
    provider: {
      type: String,
      required: true
    }
  },
  data: function () {
    return {
      editing: false,
      expanded: false,
      loading: false,
      useCustomConfig: false,
      oauthConfig: {}
    }
  },
  mounted () {
    this.resetOauthConfig()
  },
  computed: {
    ...mapGetters('layout', ['selectedOrganization']),
    isSetUp () {
      return (this.selectedOrganization && this.selectedOrganization.id !== null) && this.selectedOrganization.oauth_configs.filter(config => {
        return config.provider === this.provider
      }).length > 0
    },
    isValueChanged () {
      return !_.isEqual(this.oauthConfig, this.getOriginalOauthConfig())
    },
    isValid () {
      return this.oauthConfig.oauth_id && (this.isSetUp || this.oauthConfig.oauth_secret_key)
    },
    secretKeyDisplay () {
      return this.isSetUp ? this.selectedOrganization.oauth_configs.filter(config => {
        return config.provider === this.provider
      })[0].oauth_secret_key_display : null
    }
  },
  watch: {
    selectedOrganization: {
      handler: function () {
        this.resetOauthConfig()
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('organization', ['updateOrganization']),
    stopPropagation (event) {
      event.stopPropagation()
    },
    getEmptyOauthConfig () {
      return {
        oauth_id: '',
        oauth_secret_key: '',
        provider: this.provider,
        use_default_config: true
      }
    },
    onTitleClick () {
      this.expanded = !this.expanded
    },
    onEditTriggerClick () {
      this.editing = !this.editing
    },
    onSaveClick () {
      this.loading = true
      this.updateOrganization({
        id: this.selectedOrganization.id,
        oauth_configs: [this.oauthConfig]
      }).then(response => {
        this.editing = false
      }).finally(() => {
        this.loading = false
      })

      EventTracker.sendEvent(EVENT_NAMES.CUSTOM_OAUTH_PROVIDER_CONFIGURED, {
        provider: this.provider
      })
    },
    onUseCheckInput () {
      if (this.useCustomConfig) {
        this.expanded = true
      } else {
        this.expanded = false
      }
      this.$set(this.oauthConfig, 'use_default_config', !this.useCustomConfig)
    },
    resetOauthConfig () {
      this.$set(this, 'oauthConfig', this.getOriginalOauthConfig())
      this.$set(this, 'useCustomConfig', !this.oauthConfig.use_default_config)
    },
    getOriginalOauthConfig () {
      if (this.isSetUp) {
        const configData = this.selectedOrganization.oauth_configs.filter(config => {
          return config.provider === this.provider
        })[0]

        return {
          oauth_secret_key: '',
          oauth_id: configData.oauth_id,
          provider: this.provider,
          use_default_config: configData.use_default_config
        }
      } else {
        return this.getEmptyOauthConfig()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .social-oauth-setting-item {
    position: relative;

    &__icon-container {
      text-align: center;
    }

    &__content-container {
      padding-right: 20px;
    }

    &__icon {
      font-size: 14px;
      height: 56px;
    }

    &__header {
      overflow: hidden;
      height: 56px;
      line-height: 56px;
      background-color: $white;
      cursor: pointer;

      &__title {
        float: left;
        font-family: Fira Sans;
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        color: $text-dark;
        text-transform: capitalize;
        user-select: none;
      }

      &__use-check {
        float: right;
        cursor: default;
        line-height: 20px;
        padding: 18px 69px 18px 0;
      }
    }

    &__content {
      background-color: $gray-xlight;
      line-height: 46px;
      margin-bottom: 25px;
      padding: 0 30px;
      user-select: none;

      &__setting-element {
        display: inline-block;
        @media (max-width: 1024px) {
          display: block;
        }
      }

      &__setting-label {
        font-family: Fira Sans;
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        margin-right: 5px;
        color: $text-dark;
        display: inline;
      }

      &__setting-value {
        font-family: Fira Sans;
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        color: $text-medium;
        margin-right: 80px;
      }

      &__setting-input {
        width: 140px;
        margin-right: 20px;
        display: inline-block;
      }

      &__edit-trigger {
        margin-right: 40px;
        font-size: 16px;
        cursor: pointer;
        color: $blue-dark;
      }
    }

    &__loading-indicator {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(255, 255, 255, 0.6);
    }

    .slide-enter-active {
      transition: all 0.15s;
      transition-timing-function: cubic-bezier(.25,.8,.5,1);
    }

    .slide-leave-active {
      transition: all 0.15s;
      transition-timing-function: cubic-bezier(.25,.8,.5,1);
    }

    .slide-enter-to, .slide-leave {
      max-height: 320px;
      overflow: hidden;
    }

    .slide-enter, .slide-leave-to {
      max-height: 0;
      overflow: hidden;
    }
  }
</style>
