<template lang="pug" xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  setting-item.email-configuration-setting-item(
    :is-set-up="isSetUp"
    :title="$t('v2.organization.settings.emailConfigurationTitle')"
    :description="$t('v2.organization.settings.emailConfigurationDescription')"
    :loading="loading"
    :editing="editing"
  )
    template(v-slot:actions)
      base-button(
        v-show="editing === false"
        class="base-button--green email-configuration-setting-item__setup-trigger"
        @click="onSetupClick"
      ) {{ $t('v2.organization.settings.setupMailServers') }}
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
      v-container.email-configuration-setting-item__form-container(grid-list-lg)
        v-layout(row wrap :key="numClearSettings")
          v-flex(xs12 lg9)
            v-layout(row wrap)
              v-flex(xs12 md6 lg5)
                base-text-input.base-text-input--multiline(
                  placeholder="..."
                  v-model="emailConfig.sender_name"
                  :label="$t('v2.organization.settings.senderName')"
                  :validations="{ required: true }"
                )
              v-flex(xs12 md6 lg5)
                base-text-input.base-text-input--multiline(
                  v-model="emailConfig.sender_email"
                placeholder="..."
                  :label="$t('v2.organization.settings.senderEmail')"
                  :validations="emailFieldValidations"
                )
              v-flex(xs12 md6 lg2)
                base-select.base-select--multiline(
                  v-model="emailConfig.port"
                  :items="portOptions"
                  :label="$t('v2.organization.settings.smtpPort')"
                  :validations="{ required: true }"
                )
              v-flex(xs12 md6 lg4)
                base-text-input.base-text-input--multiline(
                  v-model="emailConfig.host"
                  placeholder="..."
                  :label="$t('v2.organization.settings.smtpHost')"
                  :validations="{ required: true }"
                )
              v-flex(xs12 md6 lg4)
                base-text-input.base-text-input--multiline(
                  v-model="emailConfig.username"
                  placeholder="..."
                  :label="$t('v2.organization.settings.smtpUsername')"
                  :validations="{ required: true }"
                )
              v-flex(xs12 md6 lg4)
                base-text-input.base-text-input--multiline(
                  v-model="emailConfig.password"
                  type="password"
                  :placeholder="passwordDisplay ? passwordDisplay : '...'"
                  :label="$t('v2.organization.settings.smtpPassword')"
                )
              v-flex(xs12)
                .email-configuration-setting-item__clear-settings-button(
                  :class="{'email-configuration-setting-item__clear-settings-button--disabled': !isSetUp}"
                  @click="onClearSettingsClick"
                )
                  | {{ $t('v2.organization.settings.clearSettings') }}
          v-flex(xs12 lg3)
            .email-configuration-setting-item__test-email-button-container
              .email-configuration-setting-item__test-email-button-container__button(
                :class="{'email-configuration-setting-item__test-email-button-container__button--disabled': !isValid}"
                @click="onSendTestEmailClick"
              )
                v-icon fas fa-paper-plane
                span.email-configuration-setting-item__test-email-button-container__button__text
                  | {{ $t('v2.organization.settings.sendTestEmail') }}

</template>

<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import SettingItem from '../setting-item.vue'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import BaseButton from '@/components/v2/base-button/base-button'
import { isValidEmail } from '@/utils/form-fields-validation-rules'
import BaseSelect from '@/components/v2/base-select/base-select'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'email-configuration-setting-item',
  components: {
    BaseSelect,
    BaseButton,
    BaseTextInput,
    SettingItem
  },
  data: function () {
    return {
      numClearSettings: 0,
      editing: false,
      emailConfig: {},
      loading: false,
      portOptions: [{
        'name': '25',
        'key': 25
      }, {
        'name': '465',
        'key': 465
      }, {
        'name': '587',
        'key': 587
      }],
      emailFieldValidations: {
        required: true,
        method: isValidEmail
      }
    }
  },
  mounted () {
    this.resetEmailConfig()
  },
  computed: {
    ...mapGetters('layout', ['selectedOrganization']),
    isSetUp () {
      return (this.selectedOrganization && this.selectedOrganization.id !== null) && this.selectedOrganization.email_config !== null
    },
    isValueChanged () {
      return !_.isEqual(this.emailConfig, this.getOriginalEmailConfig())
    },
    isValid () {
      return this.emailConfig.host && this.emailConfig.port && this.emailConfig.username &&
        this.emailConfig.sender_name && (this.emailConfig.sender_email && isValidEmail(this.emailConfig.sender_email)) &&
        (this.isSetUp || this.emailConfig.password)
    },
    passwordDisplay () {
      return this.isSetUp ? this.selectedOrganization.email_config.password_display : null
    }
  },
  watch: {
    selectedOrganization: {
      handler: function () {
        this.resetEmailConfig()
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('organization', ['updateOrganization', 'sendTestEmail']),
    getEmptyEmailConfig () {
      return {
        password: '',
        host: '',
        port: 25,
        username: '',
        sender_name: '',
        sender_email: ''
      }
    },
    onSetupClick () {
      this.editing = true
    },
    onSaveClick () {
      this.loading = true
      this.updateOrganization({
        id: this.selectedOrganization.id,
        email_config: this.emailConfig
      }).then(response => {
        this.editing = false
      }).finally(() => {
        this.loading = false
      })

      EventTracker.sendEvent(EVENT_NAMES.CUSTOM_SMTP_CONFIGURED)
    },
    onCancelClick () {
      this.editing = false

      // Reset email config
      this.resetEmailConfig()
      this.numClearSettings += 1
    },
    onSendTestEmailClick () {
      if (!this.isValid) {
        return false
      }

      // If settings updated, save first. Else, directly send test
      this.loading = true
      if (this.isValueChanged) {
        this.updateOrganization({
          id: this.selectedOrganization.id,
          email_config: this.emailConfig
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
      this.sendTestEmail({
        orgId: this.selectedOrganization.id,
        email_config: this.emailConfig
      }).then(response => {
        global.toastr['success'](this.$t('v2.organization.settings.sentTestEmail'), this.$t('general.success'))
        this.editing = false
      }).catch(err => {
        if (err.response && err.response.data && err.response.data.error && err.response.data.error.detail && err.response.data.error.detail.length > 0) {
          if (err.response.data.error.detail[0].code === 'test_send_failed') {
            global.toastr['error'](this.$t('v2.organization.settings.sendTestEmailFailed'), this.$t('general.error'))
          }
        }
      }).finally(() => {
        this.loading = false
      })

      EventTracker.sendEvent(EVENT_NAMES.CUSTOM_SMTP_TESTED)
    },
    onClearSettingsClick () {
      if (!this.isSetUp) {
        return false
      }

      this.loading = true
      this.updateOrganization({
        id: this.selectedOrganization.id,
        email_config: null
      }).then(response => {
        this.editing = false
        this.numClearSettings += 1
      }).finally(() => {
        this.loading = false
      })

      EventTracker.sendEvent(EVENT_NAMES.CUSTOM_SMTP_REMOVED)
    },
    resetEmailConfig () {
      this.$set(this, 'emailConfig', this.getOriginalEmailConfig())
    },
    getOriginalEmailConfig () {
      if (this.isSetUp) {
        return {
          password: '',
          host: this.selectedOrganization.email_config.host,
          port: this.selectedOrganization.email_config.port,
          username: this.selectedOrganization.email_config.username,
          sender_name: this.selectedOrganization.email_config.sender_name,
          sender_email: this.selectedOrganization.email_config.sender_email
        }
      } else {
        return this.getEmptyEmailConfig()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .email-configuration-setting-item {
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

    &__test-email-button-container {
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
