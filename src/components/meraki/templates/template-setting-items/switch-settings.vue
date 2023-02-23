<template lang="pug">
  template-setting-item.switch-settings(
    :title="$t('v2.merakiTemplates.generalSwitchSettings')"
    :operation-mode="operationMode"
    :customizations="customizations"
    :setting-fields="[field_key, stp_settings_field_key, multicast_settings_field_key, mtu_settings_field_key]"
    customizations-enabled
    @customizationsClick="$emit('customizationsClick', $event)"
  )
    template(v-slot:default)
      v-layout(
        v-show="isFieldVisible(field_key)"
        row wrap
      ).template-setting-item__content__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.managementVlan') }}
        v-flex(xs6 md3 lg2 xl1)
          base-text-input(
            :value="settingValue.vlan"
            @input="onFieldInput('vlan', $event)"
            v-bind="vlanInputProps"
            :placeholder="$t('v2.placeholders.vlanId')"
            :validations="vlanValidations"
            :show-validation-state="showFieldValidationState"
            :suppress-validation-state-display="isEmpty"
            :disabled="isFixed"
            @focus="fetchFieldSuggestions(field_key, 'vlan')"
            :suggestions="getFieldSuggestions(field_key, 'vlan')"
          )

      v-layout(
        v-show="isFieldVisible(field_key)"
        row wrap
      ).template-setting-item__content__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.useCombinedPower') }}
        v-flex(xs6 md4 lg3 xl2)
          base-switch(
            :value="settingValue.useCombinedPower"
            @input="onFieldInput('useCombinedPower', $event)"
            :disabled="isFixed"
            clearable
          )

      v-layout(
        v-show="isFieldVisible(stp_settings_field_key)"
        row wrap
      ).template-setting-item__content__row.switch-settings__sub-section
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.rstpEnabled') }}
        v-flex(xs6 md4 lg3 xl2)
          base-switch(
            :value="stpSettingValue.rstpEnabled"
            @input="onStpFieldInput('rstpEnabled', $event)"
            :disabled="isFixed"
            clearable
          )

      v-layout(
        v-show="isFieldVisible(multicast_settings_field_key)"
        row wrap
      ).template-setting-item__content__row.switch-settings__sub-section
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.igmpSnoopingEnabled') }}
        v-flex(xs6 md4 lg3 xl2)
          base-switch(
            :value="multicastSettingDefaults.igmpSnoopingEnabled"
            @input="onMulticastFieldInput('igmpSnoopingEnabled', $event)"
            :disabled="isFixed"
            clearable
          )

      v-layout(
        v-show="isFieldVisible(multicast_settings_field_key)"
        row wrap
      ).template-setting-item__content__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.floodUnknownMulticastTrafficEnabled') }}
        v-flex(xs6 md4 lg3 xl2)
          base-switch(
            :value="multicastSettingDefaults.floodUnknownMulticastTrafficEnabled"
            @input="onMulticastFieldInput('floodUnknownMulticastTrafficEnabled', $event)"
            :disabled="isFixed"
            clearable
          )

      v-layout(
        v-show="isFieldVisible(mtu_settings_field_key)"
        row wrap
      ).template-setting-item__content__row.switch-settings__sub-section
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.mtuSize') }}
        v-flex(xs6 md3 lg2 xl1)
          base-text-input(
            :value="mtuSettingValue.defaultMtuSize"
            @input="onMtuFieldInput('defaultMtuSize', $event)"
            v-bind="positiveIntegerInputProps"
            :disabled="isFixed"
            @focus="fetchFieldSuggestions(mtu_settings_field_key, 'defaultMtuSize')"
            :suggestions="getFieldSuggestions(mtu_settings_field_key, 'defaultMtuSize')"
          )

</template>

<script>
import TemplateSettingItem from './template-setting-item'
import NetworkTemplateSettingItemMixin from '@/mixins/network-template-setting-item.mixin'
import BaseSwitch from '@/components/v2/base-switch/base-switch'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import { isValidVlan } from '@/utils/form-fields-validation-rules'
import { VLAN_INPUT_PROPS, POSITIVE_NUMBER_INPUT_PROPS } from '@/constants/form-fields'
import _ from 'lodash'

export default {
  name: 'switch-settings',
  mixins: [
    NetworkTemplateSettingItemMixin
  ],
  components: { BaseTextInput, BaseSwitch, TemplateSettingItem },
  data: function () {
    return {
      field_key: 'switch_settings',
      stp_settings_field_key: 'switch_stp_settings',
      multicast_settings_field_key: 'switch_multicast_settings',
      mtu_settings_field_key: 'switch_mtu_settings',
      vlanValidations: {
        required: true,
        methods: [{
          method: isValidVlan
        }]
      },
      vlanInputProps: VLAN_INPUT_PROPS,
      positiveIntegerInputProps: POSITIVE_NUMBER_INPUT_PROPS
    }
  },
  computed: {
    stpSettingValue () {
      return this.value[this.stp_settings_field_key] || {}
    },
    multicastSettingValue () {
      return this.value[this.multicast_settings_field_key] || {}
    },
    multicastSettingDefaults () {
      return (this.multicastSettingValue && this.multicastSettingValue.defaultSettings)
        ? this.multicastSettingValue.defaultSettings : {
          igmpSnoopingEnabled: null,
          floodUnknownMulticastTrafficEnabled: null
        }
    },
    mtuSettingValue () {
      return this.value[this.mtu_settings_field_key] || {}
    },
    nonConfiguredValue () {
      return {}
    }
  },
  watch: {
    stpSettingValue: {
      handler: function (newValue) {
        // If current setting value changes to empty value, re-emit non-configured value for the setting
        if (!_.isEqual(newValue, this.nonConfiguredValue) && this.isSettingEmpty(newValue)) {
          this.$emit('settingInput', this.stp_settings_field_key, this.nonConfiguredValue)
        }
      },
      deep: true
    },
    multicastSettingValue: {
      handler: function (newValue) {
        // If current setting value changes to empty value, re-emit non-configured value for the setting
        if (!_.isEqual(newValue, this.nonConfiguredValue) && this.isSettingEmpty(newValue)) {
          this.$emit('settingInput', this.multicast_settings_field_key, this.nonConfiguredValue)
        }
      },
      deep: true
    },
    mtuSettingValue: {
      handler: function (newValue) {
        // If current setting value changes to empty value, re-emit non-configured value for the setting
        if (!_.isEqual(newValue, this.nonConfiguredValue) && this.isSettingEmpty(newValue)) {
          this.$emit('settingInput', this.mtu_settings_field_key, this.nonConfiguredValue)
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
    },
    onStpFieldInput (field, value) {
      this.$emit('settingInput', this.stp_settings_field_key, {
        ...this.stpSettingValue,
        [field]: value
      })
    },
    onMulticastFieldInput (field, value) {
      this.$emit('settingInput', this.multicast_settings_field_key, {
        ...this.multicastSettingValue,
        defaultSettings: {
          ...this.multicastSettingValue.defaultSettings,
          [field]: value
        }
      })
    },
    onMtuFieldInput (field, value) {
      this.$emit('settingInput', this.mtu_settings_field_key, {
        ...this.mtuSettingValue,
        [field]: value
      })
    }
  }
}
</script>

<style scoped lang="scss">
  @import "styles/v2/colors.scss";

  .switch-settings {
    &__sub-section {
      margin-top: 30px;
      padding-top: 30px;
      border-top: 1px solid $gray-xlight;
    }
  }

</style>
