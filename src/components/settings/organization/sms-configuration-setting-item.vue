<template lang="pug" xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  setting-item.sms-configuration-setting-item(
    :is-set-up="isSetUp"
    :title="$t('v2.organization.settings.smsConfigurationTitle')"
    :description="$t('v2.organization.settings.smsConfigurationDescription')"
    :loading="loading"
    :editing="editing"
  )
    template(v-slot:actions)
      base-button(
        v-show="editing === false"
        class="base-button--green sms-configuration-setting-item__setup-trigger"
        @click="onSetupClick"
      ) {{ $t('v2.organization.settings.setupSmsService') }}
      base-button(
        v-show="editing === true"
        class="base-button--green"
        @click="onSaveClick"
        :disabled="!isValueChanged || !isValid"
      ) {{ $t('general.save') }}
      base-button(
        v-show="editing === true"
        class="base-button--blue--negative"
        @click="onCancelClick"
      ) {{ $t('general.cancel') }}

    template(v-slot:content)
      v-container.sms-configuration-setting-item__form-container(grid-list-lg)
        v-layout(row wrap :key="numClearSettings")
          v-flex(xs12 lg9)
            v-layout(row wrap)
              v-flex(xs12 md6 lg5)
                base-select.base-select--multiline(
                  v-model="smsConfig.config_type"
                  :items="providerOptions"
                  :label="$t('v2.organization.settings.chooseProvider')"
                  :validations="{ required: true }"
                )
              template(v-if="smsConfig.config_type === 'twilio'")
                v-flex(xs12 md6 lg5)
                  base-text-input.base-text-input--multiline(
                    v-model="smsConfig.account_sid"
                    placeholder="..."
                    :label="$t('v2.organization.settings.accountSid')"
                    :validations="{ required: true }"
                  )
                v-flex(xs12 md6 lg4)
                  phone-number-input.base-text-input--multiline(
                    v-model="smsConfig.caller_id"
                    placeholder="..."
                    :label="$t('v2.organization.settings.twilioPhoneNumber')"
                    :validations="{ required: true }"
                  )
                v-flex(xs12 md6 lg4)
                  base-text-input.base-text-input--multiline(
                    v-model="smsConfig.auth_token"
                    :placeholder="authTokenDisplay ? authTokenDisplay : '...'"
                    :label="$t('general.authToken')"
                    :validations="{ required: true }"
                  )
                v-flex(xs12 md6 lg4)
                  base-text-input.base-text-input--multiline(
                    v-model="smsConfig.sender_name"
                    :label="$t('v2.organization.settings.senderName')"
                    placeholder="..."
                    :validations="{ required: true }"
                  )
              template(v-if="smsConfig.config_type === 'ringring'")
                v-flex(xs12 md6 lg4)
                  base-text-input.base-text-input--multiline(
                    v-model="smsConfig.auth_token"
                    :placeholder="authTokenDisplay ? authTokenDisplay : '...'"
                    :label="$t('general.apiKey')"
                    :validations="{ required: true }"
                  )
                v-flex(xs12 md6 lg4)
                  base-text-input.base-text-input--multiline(
                    v-model="smsConfig.sender_name"
                    :label="$t('v2.organization.settings.senderName')"
                    placeholder="..."
                  )
              v-flex(xs12)
                .sms-configuration-setting-item__clear-settings-button(
                  :class="{'sms-configuration-setting-item__clear-settings-button--disabled': !isSetUp}"
                  @click="onClearSettingsClick"
                )
                  | {{ $t('v2.organization.settings.clearSettings') }}
          v-flex(xs12 lg3)
            .sms-configuration-setting-item__test-sms-button-container
              .sms-configuration-setting-item__test-sms-button-container__button(
                :class="{'sms-configuration-setting-item__test-sms-button-container__button--disabled': !isValid}"
                @click="onSendTestSmsClick"
              )
                v-icon fas fa-paper-plane
                span.sms-configuration-setting-item__test-sms-button-container__button__text
                  | {{ $t('v2.organization.settings.sendTestSms') }}

</template>

<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import SettingItem from '../setting-item.vue'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import BaseButton from '@/components/v2/base-button/base-button'
import BaseSelect from '@/components/v2/base-select/base-select'
import PhoneNumberInput from '@/components/v2/phone-number-input/phone-number-input'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'sms-configuration-setting-item',
  components: {
    PhoneNumberInput,
    BaseSelect,
    BaseButton,
    BaseTextInput,
    SettingItem
  },
  data: function () {
    return {
      editing: false,
      smsConfig: {},
      loading: false,
      providerOptions: [{
        'name': 'Twilio',
        'key': 'twilio'
      }, {
        'name': 'RingRing',
        'key': 'ringring'
      }],
      numClearSettings: 0
    }
  },
  mounted () {
    this.resetSmsConfig()
  },
  computed: {
    ...mapGetters('layout', ['selectedOrganization']),
    isSetUp () {
      return (this.selectedOrganization && this.selectedOrganization.id !== null) && this.selectedOrganization.sms_config !== null
    },
    isValueChanged () {
      return !_.isEqual(this.smsConfig, this.getOriginalSmsConfig())
    },
    isValid () {
      if (this.smsConfig.config_type === 'ringring') {
        return this.isSetUp || this.smsConfig.auth_token
      }
      return this.smsConfig.sender_name && this.smsConfig.account_sid &&
        this.smsConfig.caller_id && (this.isSetUp || this.smsConfig.auth_token)
    },
    authTokenDisplay () {
      return this.isSetUp ? this.selectedOrganization.sms_config.auth_token_display : null
    }
  },
  watch: {
    selectedOrganization: {
      handler: function () {
        this.resetSmsConfig()
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('organization', ['updateOrganization', 'sendTestSms']),
    getEmptySmsConfig () {
      return {
        auth_token: '',
        sender_name: '',
        account_sid: '',
        caller_id: '',
        config_type: 'twilio'
      }
    },
    onSetupClick () {
      this.editing = true
    },
    onSaveClick () {
      this.loading = true
      this.updateOrganization({
        id: this.selectedOrganization.id,
        sms_config: this.smsConfig
      }).then(response => {
        this.editing = false
      }).finally(() => {
        this.loading = false
      })

      EventTracker.sendEvent(EVENT_NAMES.CUSTOM_SMS_CONFIGURED)
    },
    onCancelClick () {
      this.editing = false

      // Reset sms config
      this.resetSmsConfig()
      this.numClearSettings += 1
    },
    onSendTestSmsClick () {
      if (!this.isValid) {
        return false
      }

      // If settings updated, save first. Else, directly send test
      this.loading = true
      if (this.isValueChanged) {
        this.updateOrganization({
          id: this.selectedOrganization.id,
          sms_config: this.smsConfig
        }).then(response => {
          this.sendTest()
        }).catch(() => {
          this.loading = false
        })
      } else {
        this.sendTest()
      }
    },
    sendTest () {
      this.sendTestSms({
        orgId: this.selectedOrganization.id,
        sms_config: this.smsConfig
      }).then(response => {
        global.toastr['success'](this.$t('v2.organization.settings.sentTestSms'), this.$t('general.success'))
        this.editing = false
      }).catch(err => {
        if (err.response && err.response.data && err.response.data.error && err.response.data.error.detail && err.response.data.error.detail.length > 0) {
          if (err.response.data.error.detail[0].code === 'test_send_failed') {
            global.toastr['error'](this.$t('v2.organization.settings.sendTestSmsFailed'), this.$t('general.error'))
          }
        }
      }).finally(() => {
        this.loading = false
      })

      EventTracker.sendEvent(EVENT_NAMES.CUSTOM_SMS_TESTED)
    },
    onClearSettingsClick () {
      if (!this.isSetUp) {
        return false
      }

      this.loading = true
      this.updateOrganization({
        id: this.selectedOrganization.id,
        sms_config: null
      }).then(response => {
        this.editing = false
        this.numClearSettings += 1
      }).finally(() => {
        this.loading = false
      })

      EventTracker.sendEvent(EVENT_NAMES.CUSTOM_SMS_REMOVED)
    },
    resetSmsConfig () {
      this.$set(this, 'smsConfig', this.getOriginalSmsConfig())
    },
    getOriginalSmsConfig () {
      if (this.isSetUp) {
        return {
          auth_token: '',
          sender_name: this.selectedOrganization.sms_config.sender_name,
          account_sid: this.selectedOrganization.sms_config.account_sid,
          caller_id: this.selectedOrganization.sms_config.caller_id,
          config_type: this.selectedOrganization.sms_config.config_type
        }
      } else {
        return this.getEmptySmsConfig()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .sms-configuration-setting-item {
    &__setup-trigger {
      width: 230px;
    }

    &__form-container {
      padding: 0;

      ::v-deep {
        .base-select label, .base-text-input label {
          white-space: nowrap;
        }
      }
    }

    .base-button:not(:first-child) {
      margin-left: 10px;
    }

    &__clear-settings-button {
      font-family: Source Sans Pro;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 18px;
      text-decoration-line: underline;
      color: $blue-medium;
      cursor: pointer;

      &--disabled {
        cursor: not-allowed;
      }
    }

    &__test-sms-button-container {
      text-align: right;

      @media only screen and (max-width: 1264px) {
        text-align: left;
      }

      &__button {
        margin-top: 20px;
        cursor: pointer;
        display: inline-block;

        .v-icon {
          color: $green-medium;
          margin-right: 10px;
          font-size: 16px;
        }

        &__text {
          font-family: Source Sans Pro;
          font-style: normal;
          font-weight: normal;
          font-size: 14px;
          line-height: 18px;
          text-decoration-line: underline;
          color: $green-medium;
        }

        &--disabled {
          cursor: not-allowed;
        }
      }
    }
  }
</style>
