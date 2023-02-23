<template lang="pug">
  template-setting-item.ssid-network-access(
    :title="$t('v2.merakiTemplates.networkAccess')"
    :operation-mode="operationMode"
  )
    template(v-slot:default)
      v-layout(row wrap).template-setting-item__content__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.authenticationMode') }}
        v-flex(xs6 lg4 xl3)
          base-select(
            :items="authModeOptions"
            :value="settingValue.authMode"
            @input="onFieldInput('authMode', $event)"
            :validations="{ required: isTemplateMode }"
            :show-validation-state="showFieldValidationState"
            :disabled="isFixed"
          )
        v-flex(
          xs6 md8 lg9 xl8 offset-xs6 offset-md4 offset-lg3 offset-xl2 mt-2
          v-if="settingValue.authMode === 'ipsk-without-radius'"
        )
          span.ssid-network-access__warning-text {{ $t('v2.merakiTemplates.ipskWithoutRadiusDeploymentWarning') }}

      v-layout.template-setting-item__content__row(
        row wrap
        v-show="settingValue.authMode === 'psk' || settingValue.authMode === 'wpa12'"
      )
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.pskKey') }}
        v-flex(xs6 md4 lg3 xl2)
          protected-input(
            :value="settingValue.psk"
            @input="onFieldInput('psk', $event)"
            :validations="{ required: isTemplateMode }"
            :show-validation-state="showFieldValidationState"
            :disabled="isFixed"
          )

      v-layout.template-setting-item__content__row(
        row wrap
        v-show="settingValue.authMode === 'psk' || settingValue.authMode === '8021x-meraki' || settingValue.authMode === '8021x-radius' || settingValue.authMode === 'ipsk-with-radius' || settingValue.authMode === 'ipsk-without-radius'"
      )
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.encryptionMode') }}
        v-flex(xs6 md3 lg2 xl1)
          base-select(
            :items="encryptionModeOptions"
            :value="settingValue.encryptionMode"
            @input="onFieldInput('encryptionMode', $event)"
            :validations="{ required: isTemplateMode }"
            :show-validation-state="showFieldValidationState"
            :disabled="isFixed"
          )

      v-layout.template-setting-item__content__row(
        row wrap
        v-show="(settingValue.authMode === 'psk' || settingValue.authMode === '8021x-meraki' || settingValue.authMode === '8021x-radius' || settingValue.authMode === 'ipsk-with-radius' || settingValue.authMode === 'ipsk-without-radius') && (settingValue.encryptionMode === 'wpa' || settingValue.encryptionMode === 'wpa-eap')"
      )
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.wpaEncryptionMode') }}
        v-flex(xs6 lg4 xl3)
          base-select(
            :items="wpaEncryptionModeOptions"
            :value="settingValue.wpaEncryptionMode"
            @input="onFieldInput('wpaEncryptionMode', $event)"
            :validations="{ required: isTemplateMode }"
            :show-validation-state="showFieldValidationState"
            :disabled="isFixed"
          )

      v-layout(
        row wrap
        v-show="settingValue.authMode === 'ipsk-without-radius'"
      ).template-setting-item__content__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.identityPsks') }}
        v-flex(xs6 md8 lg8 xl6)
          ssid-identity-psks(
            :value="value"
            :original-value="originalValue"
            :template-value="templateValue"
            @settingInput="onIdentityPsksInput"
            @itemInput="onItemInput"
            :show-validation-state="showFieldValidationState"
            :is-fixed="isFixed"
            :field-suggestions="fieldSuggestions"
            @fieldSuggestionInput="onFieldSuggestionInput"
          )

      v-layout(row wrap).template-setting-item__content__row.splash-page-row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('general.splashPage') }}
        v-flex(xs6 lg4 xl3)
          base-select(
            :items="splashPageOptions"
            :value="settingValue.splashPage"
            @input="onFieldInput('splashPage', $event)"
            :validations="{ required: isTemplateMode }"
            :show-validation-state="showFieldValidationState"
            :disabled="isFixed"
          )

      v-layout(row wrap).template-setting-item__content__row(
        v-show="settingValue.splashPage === 'Sponsored guest'"
      )
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.sponsorDomains') }}
        v-flex(xs6 md8 lg9 xl6)
          multi-text-input(
            :value="settingValue.splashGuestSponsorDomains"
            @input="onFieldInput('splashGuestSponsorDomains', $event)"
            :placeholder="$t('v2.placeholders.separateByCommas')"
            :validations="splashSponsorDomainValidations"
            :show-validation-state="showFieldValidationState"
            :disabled="isFixed"
            @focus="fetchFieldSuggestions('ssids', 'definition__splashGuestSponsorDomains')"
            :items="getSuggestionsForMultiTextInput('ssids', 'definition__splashGuestSponsorDomains')"
          )

      v-layout.template-setting-item__content__row(
        row wrap
        v-show="isSplashDetailSettingsVisible"
      )
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.customSplashUrl') }}
        v-flex(xs6 md4 lg4 xl3)
          base-text-input(
            :value="splashPageSettingValue.splashUrl"
            @input="onSplashSettingsFieldInput('splashUrl', $event)"
            :validations="splashUrlValidations"
            :show-validation-state="showFieldValidationState"
            :disabled="isFixed"
            :placeholder="$t('v2.placeholders.url')"
            @focus="fetchFieldSuggestions('ssids', 'splash_page_settings__splashUrl')"
            :suggestions="getFieldSuggestions('ssids', 'splash_page_settings__splashUrl')"
          )
        v-flex(xs6 md3 offset-xs6 offset-md1)
          base-switch.url-use-switch(
            :value="splashPageSettingValue.useSplashUrl"
            @input="onSplashSettingsFieldInput('useSplashUrl', $event)"
            :disabled="isFixed"
            :yes-label="$t('v2.merakiTemplates.used')"
            :no-label="$t('v2.merakiTemplates.ignored')"
            clearable
          )

      v-layout.template-setting-item__content__row(
        row wrap
        v-show="isSplashDetailSettingsVisible"
      )
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.customRedirectUrl') }}
        v-flex(xs6 md4 lg4 xl3)
          base-text-input(
            :value="splashPageSettingValue.redirectUrl"
            @input="onSplashSettingsFieldInput('redirectUrl', $event)"
            :validations="splashUrlValidations"
            :show-validation-state="showFieldValidationState"
            :disabled="isFixed"
            :placeholder="$t('v2.placeholders.url')"
            @focus="fetchFieldSuggestions('ssids', 'splash_page_settings__redirectUrl')"
            :suggestions="getFieldSuggestions('ssids', 'splash_page_settings__redirectUrl')"
          )
        v-flex(xs6 md3 offset-xs6 offset-md1)
          base-switch.url-use-switch(
            :value="splashPageSettingValue.useRedirectUrl"
            @input="onSplashSettingsFieldInput('useRedirectUrl', $event)"
            :disabled="isFixed"
            :yes-label="$t('v2.merakiTemplates.used')"
            :no-label="$t('v2.merakiTemplates.ignored')"
            clearable
          )

      v-layout.template-setting-item__content__row(
        row wrap
        v-show="isSplashDetailSettingsVisible"
      )
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.welcomeMessage') }}
        v-flex(xs6 md4 lg4 xl3)
          base-text-area(
            :value="splashPageSettingValue.welcomeMessage"
            @input="onSplashSettingsFieldInput('welcomeMessage', $event)"
            :disabled="isFixed"
          )

      v-layout.template-setting-item__content__row(
        row wrap
        v-show="isSplashDetailSettingsVisible"
      )
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.splashTimeout') }}
        v-flex(xs6 md4 lg4 xl3)
          base-text-input(
            :value="splashPageSettingValue.splashTimeout"
            @input="onSplashSettingsFieldInput('splashTimeout', $event)"
            v-bind="positiveIntegerInputProps"
            :disabled="isFixed"
          )

</template>

<script>
import TemplateSettingItem from './template-setting-item'
import NetworkTemplateSettingItemMixin from '@/mixins/network-template-setting-item.mixin'
import BaseSelect from '@/components/v2/base-select/base-select'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import ProtectedInput from '@/components/v2/protected-input/protected-input'
import BaseSwitch from '@/components/v2/base-switch/base-switch'
import BaseTextArea from '@/components/v2/base-text-area/base-text-area'
import MultiTextInput from '@/components/v2/multi-text-input/multi-text-input'
import { isValidUrl, isValidFQDN } from '@/utils/form-fields-validation-rules'
import { POSITIVE_INTEGER_INPUT_PROPS } from '@/constants/form-fields'
import _ from 'lodash'
import SsidIdentityPsks from './ssid-identity-psks'

export default {
  name: 'ssid-network-access',
  mixins: [
    NetworkTemplateSettingItemMixin
  ],
  components: { SsidIdentityPsks, ProtectedInput, BaseTextInput, BaseSelect, BaseSwitch, BaseTextArea, MultiTextInput, TemplateSettingItem },
  props: {
    templateValue: {
      type: Object
    }
  },
  data: function () {
    return {
      field_key: 'definition',
      splash_page_field_key: 'splash_page_settings',
      identity_psks_field_key: 'identity_psks',
      authModeOptions: [
        {
          key: 'open',
          name: this.$t('v2.merakiTemplates.open')
        },
        {
          key: 'psk',
          name: this.$t('v2.merakiTemplates.psk')
        },
        {
          key: 'wpa12',
          name: this.$t('v2.merakiTemplates.pskWithWpa12')
        },
        {
          key: 'open-with-radius',
          name: this.$t('v2.merakiTemplates.macBasedAccessControl')
        },
        {
          key: '8021x-meraki',
          name: this.$t('v2.merakiTemplates.enterpriseWithMerakiCloud')
        },
        {
          key: '8021x-radius',
          name: this.$t('v2.merakiTemplates.enterpriseWithCustomRadius')
        },
        {
          key: 'ipsk-with-radius',
          name: this.$t('v2.merakiTemplates.ipskWithRadius')
        },
        {
          key: 'ipsk-without-radius',
          name: this.$t('v2.merakiTemplates.ipskWithoutRadius')
        }
      ],
      splashPageOptions: [
        {
          key: 'None',
          name: this.$t('v2.merakiTemplates.none')
        },
        {
          key: 'Click-through splash page',
          name: this.$t('v2.merakiTemplates.clickThroughSplashPage')
        },
        {
          key: 'Sponsored guest',
          name: this.$t('v2.merakiTemplates.sponsoredGuestLogin')
        },
        {
          key: 'Password-protected with Meraki RADIUS',
          name: this.$t('v2.merakiTemplates.signOnWithMerakiCloud')
        },
        {
          key: 'Password-protected with custom RADIUS',
          name: this.$t('v2.merakiTemplates.signOnWithRadius')
        },
        {
          key: 'Password-protected with LDAP',
          name: this.$t('v2.merakiTemplates.signOnWithLDAPServer')
        },
        {
          key: 'Password-protected with Active Directory',
          name: this.$t('v2.merakiTemplates.signOnWithActiveDirectory')
        },
        {
          key: 'Facebook Wi-Fi',
          name: this.$t('v2.merakiTemplates.signOnWithFacebookLogin')
        },
        {
          key: 'SMS authentication',
          name: this.$t('v2.merakiTemplates.smsAuthentication')
        },
        {
          key: 'Systems Manager Sentry',
          name: this.$t('v2.merakiTemplates.systemsManagerSentryEnrollment')
        },
        {
          key: 'Billing',
          name: this.$t('v2.merakiTemplates.paidAccess')
        }
      ],
      splashUrlValidations: {
        required: false,
        methods: [{
          method: isValidUrl
        }]
      },
      splashSponsorDomainValidations: {
        required: true,
        methods: [{
          method: isValidFQDN,
          message: this.$t('v2.merakiTemplates.invalidDomainError')
        }]
      },
      positiveIntegerInputProps: POSITIVE_INTEGER_INPUT_PROPS
    }
  },
  computed: {
    splashPageSettingValue () {
      return this.value[this.splash_page_field_key]
    },
    identityPsksSettingValue () {
      return this.value[this.identity_psks_field_key]
    },
    encryptionModeOptions () {
      // Keys depend on selected auth mode
      if (this.settingValue.authMode === '8021x-meraki' || this.settingValue.authMode === '8021x-radius') {
        return [
          {
            key: 'wep',
            name: this.$t('v2.merakiTemplates.WEP')
          },
          {
            key: 'wpa-eap',
            name: this.$t('v2.merakiTemplates.WPA')
          }
        ]
      }

      return [
        {
          key: 'wep',
          name: this.$t('v2.merakiTemplates.WEP')
        },
        {
          key: 'wpa',
          name: this.$t('v2.merakiTemplates.WPA')
        }
      ]
    },
    wpaEncryptionModeOptions () {
      const options = [
        {
          key: 'WPA1 only',
          name: this.$t('v2.merakiTemplates.wpa1Only')
        },
        {
          key: 'WPA1 and WPA2',
          name: this.$t('v2.merakiTemplates.wpa1And2')
        },
        {
          key: 'WPA2 only',
          name: this.$t('v2.merakiTemplates.wpa2Only')
        },
        {
          key: 'WPA3 Transition Mode',
          name: this.$t('v2.merakiTemplates.wpa3TransitionMode')
        },
        {
          key: 'WPA3 only',
          name: this.$t('v2.merakiTemplates.wpa3Only')
        }
      ]

      if (this.settingValue.authMode === 'psk') {
        // WPA 1&2 options is not available when auth mode is psk
        return options.filter(option => {
          return option.key !== 'WPA1 and WPA2'
        })
      }

      return options
    },
    isSplashDetailSettingsVisible () {
      return !!this.settingValue.splashPage &&
        this.settingValue.splashPage !== 'None' &&
        this.settingValue.splashPage !== 'Facebook Wi-Fi' &&
        this.settingValue.splashPage !== 'SMS authentication' &&
        this.settingValue.splashPage !== 'Billing'
    },
    nonConfiguredValue () {
      return {}
    }
  },
  watch: {
    encryptionModeOptions: {
      handler: function () {
        // If selected option is no longer in list of options, update selected value accordingly
        if (this.settingValue.encryptionMode === 'wpa' && this.encryptionModeOptions.filter(option => {
          return option.key === 'wpa'
        }).length === 0) {
          this.$emit('settingInput', this.field_key, {
            ...this.settingValue,
            encryptionMode: 'wpa-eap'
          })
        } else if (this.settingValue.encryptionMode === 'wpa-eap' && this.encryptionModeOptions.filter(option => {
          return option.key === 'wpa-eap'
        }).length === 0) {
          this.$emit('settingInput', this.field_key, {
            ...this.settingValue,
            encryptionMode: 'wpa'
          })
        }
      },
      deep: true
    },
    wpaEncryptionModeOptions: {
      handler: function () {
        // If selected option is no longer in list of options, clear selection
        if (!!this.settingValue.wpaEncryptionMode && this.wpaEncryptionModeOptions.filter(option => {
          return option.key === this.settingValue.wpaEncryptionMode
        }).length === 0) {
          this.$emit('settingInput', this.field_key, _.omit(this.settingValue, 'wpaEncryptionMode'))
        }
      },
      deep: true
    }
  },
  methods: {
    onFieldInput (field, value) {
      this.$emit('settingInput', this.field_key, {
        ...this.settingValue,
        [field]: value
      })

      if (field === 'splashPage') {
        this.resetSplashSettings()
      }
    },
    onSplashSettingsFieldInput (field, value) {
      this.$emit('settingInput', this.splash_page_field_key, {
        ...this.splashPageSettingValue,
        [field]: value
      })
    },
    onIdentityPsksInput (field, value) {
      this.$emit('settingInput', this.identity_psks_field_key, value)
    },
    onItemInput (item, field, value) {
      this.$emit('itemInput', item, field, value)
    },
    resetSplashSettings () {
      // Re-set splash settings value depending on splash page type selection
      const customSplashDisabledTypes = ['None', 'Facebook Wi-Fi', 'SMS authentication', 'Billing']
      if (!this.settingValue.splashPage || customSplashDisabledTypes.indexOf(this.settingValue.splashPage) > -1) {
        this.$emit('settingInput', this.splash_page_field_key, {
          ...this.splashPageSettingValue,
          splashUrl: null,
          useSplashUrl: false,
          redirectUrl: null,
          useRedirectUrl: false,
          welcomeMessage: null,
          splashTimeout: null
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
  @import "styles/v2/colors.scss";

  .ssid-network-access {
    .splash-page-row {
      margin-top: 30px;
      padding-top: 30px;
      border-top: 1px solid $gray-xlight;
    }

    .url-use-switch {
      margin-top: 6px;
    }

    &__warning-text {
      font-family: Fira Sans;
      font-style: italic;
      font-weight: normal;
      font-size: 13px;
      line-height: 16px;
      color: $blue-reserve;
    }
  }

</style>
