<template lang="pug">
  .organization-security-settings
    .organization-security-settings__header
      v-layout(row wrap)
        v-flex(xs6 md8 lg9)
          span.organization-security-settings__header__description
            | {{ $t('v2.organization.settings.securitySettingsDescription') }}
        v-flex.organization-security-settings__header__actions(xs6 md4 lg3)
          base-button.base-button--green(
            @click="onSaveClick"
            :disabled="!isValid"
          ) {{ $t('general.save') }}
          base-button.base-button--blue--negative(
            @click="onClearClick"
          ) {{ $t('login.clear') }}
    .organization-security-settings__content
      .organization-security-settings__content__setting-row
        base-check-box(
          v-model="settingsData.isPasswordExpirationEnabled"
        )
        span.organization-security-settings__content__setting-row__description
          | {{ $t('v2.organization.settings.passwordExpirationDescription') }}
        base-text-input.base-text-input--small.organization-security-settings__content__setting-row__setting-value(
          v-model="settingsData.passwordExpiration"
          :disabled="settingsData.isPasswordExpirationEnabled === false"
          type="number"
          :validations="{ required: true }"
        )

      .organization-security-settings__content__setting-row
        base-check-box(
          v-model="settingsData.isPasswordVarietyLimitEnabled"
        )
        span.organization-security-settings__content__setting-row__description
          | {{ $t('v2.organization.settings.passwordVarietyDescription') }}
        base-text-input.base-text-input--small.organization-security-settings__content__setting-row__setting-value(
          v-model="settingsData.passwordVarietyLimit"
          :disabled="settingsData.isPasswordVarietyLimitEnabled === false"
          type="number"
          :validations="{ required: true }"
        )

      .organization-security-settings__content__setting-row
        base-check-box(
          v-model="settingsData.isStrongPasswordRequirementEnabled"
        )
        span.organization-security-settings__content__setting-row__description
          | {{ $t('v2.organization.settings.strongPasswordRequirementDescription') }}

      .organization-security-settings__content__setting-row
        base-check-box(
          v-model="settingsData.isTfaRequirementEnabled"
        )
        span.organization-security-settings__content__setting-row__description
          | {{ $t('v2.organization.settings.tfaRequirementDescription') }}

      .organization-security-settings__content__setting-row
        base-check-box(
          v-model="settingsData.isIpRangeLimitEnabled"
          @input="onIpLimitStateChange"
        )
        span.organization-security-settings__content__setting-row__description
          | {{ $t('v2.organization.settings.ipRestrictionsDescription') }}
        div.organization-security-settings__content__setting-row__ip-range-row(
          v-for="(ipRestriction, index) in settingsData.ipRestrictions"
          :key="index"
        )
          base-text-input.base-text-input--small(
            v-model="ipRestriction.ip_range"
            :validations="ipRangeValidations"
          )
          v-icon.organization-security-settings__content__setting-row__ip-range-row__remove-icon(
            @click="onRemoveIpRangeClick(index)"
          )
            | close
          .organization-security-settings__content__setting-row__ip-range-row__add-link(
            v-if="index === settingsData.ipRestrictions.length - 1"
            @click="onAddIpRangeClick"
          ) {{ $t('general.addAnother') }}

    .organization-security-settings__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )

</template>

<script>
import { mapActions } from 'vuex'
import BaseButton from '@/components/v2/base-button/base-button'
import BaseCheckBox from '@/components/v2/base-check-box/base-check-box'
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import { isValidCidr } from '@/utils/meraki-validations'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'security',
  components: {
    BaseTextInput,
    BaseCheckBox,
    BaseButton
  },
  mixins: [
    UserPermissionsMixin,
    CurrentNodeSelectionsMixin
  ],
  data: function () {
    return {
      settingsData: {},
      loading: false,
      ipRangeValidations: { required: true, methods: [{ method: isValidCidr }] }
    }
  },
  mounted () {
    this.$set(this, 'settingsData', this.getCurrentSettingsData())
  },
  computed: {
    isValid () {
      if (this.settingsData.isPasswordExpirationEnabled) {
        if (!this.settingsData.passwordExpiration || this.settingsData.passwordExpiration < 0) {
          return false
        }
      }

      if (this.settingsData.isPasswordVarietyLimitEnabled) {
        if (!this.settingsData.passwordVarietyLimit || this.settingsData.passwordVarietyLimit < 0) {
          return false
        }
      }

      if (this.settingsData.isIpRangeLimitEnabled) {
        if (this.settingsData.ipRestrictions.filter(restriction => {
          return !restriction.ip_range || !isValidCidr(restriction.ip_range)
        }).length > 0) {
          return false
        }
      }

      return true
    },
    rootNode () {
      return this.selectedWorkspace
    }
  },
  watch: {
    rootNode: {
      handler: function () {
        this.$set(this, 'settingsData', this.getCurrentSettingsData())
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('workspace', ['updateWorkspace']),
    getEmptySecuritySettings () {
      return {
        password_expiration_frequency: null,
        password_variety_limit: null,
        idle_logout_timeout: null,
        is_strong_password_required: false,
        is_tfa_required: false,
        ip_restrictions: []
      }
    },
    getCurrentSettingsData () {
      // Convert API response for security settings to screen version
      const securitySettings = (this.rootNode && this.rootNode.security_settings)
        ? this.rootNode.security_settings : this.getEmptySecuritySettings()
      return {
        isPasswordExpirationEnabled: (securitySettings.password_expiration_frequency !== null),
        passwordExpiration: securitySettings.password_expiration_frequency,
        isPasswordVarietyLimitEnabled: (securitySettings.password_variety_limit !== null),
        passwordVarietyLimit: securitySettings.password_variety_limit,
        isIdleLogoutTimeoutEnabled: (securitySettings.idle_logout_timeout !== null),
        idleLogoutTimeout: securitySettings.idle_logout_timeout,
        isStrongPasswordRequirementEnabled: securitySettings.is_strong_password_required,
        isTfaRequirementEnabled: securitySettings.is_tfa_required,
        isIpRangeLimitEnabled: (securitySettings.ip_restrictions.length > 0),
        ipRestrictions: JSON.parse(JSON.stringify(securitySettings.ip_restrictions))
      }
    },
    getApiDataFromSettingsData () {
      // Convert screen data to api data
      return {
        password_expiration_frequency: this.settingsData.isPasswordExpirationEnabled ? this.settingsData.passwordExpiration : null,
        password_variety_limit: this.settingsData.isPasswordVarietyLimitEnabled ? this.settingsData.passwordVarietyLimit : null,
        idle_logout_timeout: this.settingsData.isIdleLogoutTimeoutEnabled ? this.settingsData.idleLogoutTimeout : null,
        is_strong_password_required: this.settingsData.isStrongPasswordRequirementEnabled,
        is_tfa_required: this.settingsData.isTfaRequirementEnabled,
        ip_restrictions: this.settingsData.isIpRangeLimitEnabled ? JSON.parse(JSON.stringify(this.settingsData.ipRestrictions)) : []
      }
    },
    onAddIpRangeClick () {
      this.settingsData.ipRestrictions.push({
        ip_range: null
      })
    },
    onRemoveIpRangeClick (index) {
      this.settingsData.ipRestrictions.splice(index, 1)

      if (this.settingsData.ipRestrictions.length === 0) {
        // Set to disabled if not ip range left
        this.settingsData.isIpRangeLimitEnabled = false
      }
    },
    onIpLimitStateChange () {
      if (this.settingsData.isIpRangeLimitEnabled && this.settingsData.ipRestrictions.length === 0) {
        this.onAddIpRangeClick()
      }
    },
    onClearClick () {
      this.$set(this, 'settingsData', this.getCurrentSettingsData())
    },
    onSaveClick () {
      this.updateWorkspaceSecuritySettings()
    },
    updateWorkspaceSecuritySettings () {
      this.loading = true
      this.updateWorkspace({
        id: this.selectedWorkspace.id,
        security_settings: this.getApiDataFromSettingsData()
      }).then(res => {
        global.toastr['success'](this.$t('v2.organization.settings.securitySettingsUpdated'), this.$t('general.success'))
      }).finally(() => {
        this.loading = false
      })

      EventTracker.sendEvent(EVENT_NAMES.SECURITY_SETTINGS_CHANGED)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .organization-security-settings {
    width: 100%;
    overflow: hidden;

    &__header {
      padding: 40px 25px;
      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 17px;
      color: $text-medium;
      border-bottom: 3px solid $gray-xlight;

      &__description {
        line-height: 36px;
      }

      &__actions {
        text-align: right;

        .base-button {
          margin-left: 10px;
        }
      }
    }

    &__content {
      padding: 25px;

      &__setting-row {
        line-height: 30px;
        margin-bottom: 10px;

        .base-check-box {
          margin-right: 10px;
          vertical-align: middle;
        }

        &__description {
          margin-right: 10px;
          vertical-align: middle;
        }

        &__setting-value {
          display: inline-block;
          max-width: 80px;
          vertical-align: middle;
        }

        &__ip-range-row {
          padding-left: 30px;
          margin-top: 10px;

          .base-text-input {
            display: inline-block;
            vertical-align: middle;
            width: 120px;
          }

          &__remove-icon {
            vertical-align: middle;
            cursor: pointer;
            font-size: 15px;
            line-height: 32px;
            margin-left: 10px;
          }

          &__add-link {
            display: inline;
            vertical-align: middle;
            margin-left: 10px;
            cursor: pointer;
            font-family: Fira Sans;
            font-style: normal;
            font-weight: normal;
            font-size: 15px;
            line-height: 32px;
            color: $green-medium;
            text-decoration-line: underline;
          }
        }
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
  }

</style>
