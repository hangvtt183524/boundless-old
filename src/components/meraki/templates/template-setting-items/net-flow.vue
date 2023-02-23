<template lang="pug">
  template-setting-item.net-flow(
    :title="$t('v2.merakiTemplates.netFlow')"
    :operation-mode="operationMode"
    :customizations="customizations"
    :setting-fields="[field_key]"
    customizations-enabled
    @customizationsClick="$emit('customizationsClick', $event)"
  )
    template(v-slot:default)
      v-layout(row wrap).template-setting-item__content__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.trafficReportingEnabled') }}
        v-flex(xs6 md4 lg3 xl2)
          base-switch(
            :value="settingValue.reportingEnabled"
            @input="onFieldInput('reportingEnabled', $event)"
            :disabled="isFixed"
            clearable
          )

      v-layout(row wrap).template-setting-item__content__row(
        v-show="settingValue.reportingEnabled === true"
      )
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.collectorIp') }}
        v-flex(xs6 md4 lg3 xl2)
          base-text-input(
            :value="settingValue.collectorIp"
            @input="onFieldInput('collectorIp', $event)"
            :validations="collectorIpValidations"
            :show-validation-state="showFieldValidationState"
            :mask="ipAddressMask"
            :placeholder="$t('v2.placeholders.ipAddressWithExample').replace('{example}', '11.11.11.11')"
            :title="$t('v2.placeholders.ipAddressWithExample').replace('{example}', '11.11.11.11')"
            :disabled="isFixed"
            @focus="fetchFieldSuggestions(field_key, 'collectorIp')"
            :suggestions="getFieldSuggestions(field_key, 'collectorIp')"
          )

      v-layout(row wrap).template-setting-item__content__row(
        v-show="settingValue.reportingEnabled === true"
      )
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.collectorPort') }}
        v-flex(xs6 md3 lg2 xl1)
          base-text-input(
            :value="settingValue.collectorPort"
            @input="onFieldInput('collectorPort', $event)"
            v-bind="portInputProps"
            :validations="collectorPortValidations"
            :show-validation-state="showFieldValidationState"
            :placeholder="$t('v2.placeholders.portNumber')"
            :disabled="isFixed"
            @focus="fetchFieldSuggestions(field_key, 'collectorPort')"
            :suggestions="getFieldSuggestions(field_key, 'collectorPort')"
          )

</template>

<script>
import TemplateSettingItem from './template-setting-item'
import NetworkTemplateSettingItemMixin from '@/mixins/network-template-setting-item.mixin'
import BaseSwitch from '@/components/v2/base-switch/base-switch'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import { isValidPort, isValidIpAddress } from '@/utils/form-fields-validation-rules'
import { ipAddressMask } from '@/constants/input-masks'
import { PORT_INPUT_PROPS } from '@/constants/form-fields'

export default {
  name: 'net-flow',
  mixins: [
    NetworkTemplateSettingItemMixin
  ],
  components: { BaseTextInput, BaseSwitch, TemplateSettingItem },
  data: function () {
    return {
      field_key: 'net_flow_settings',
      modes: [
        {
          key: 'disabled',
          name: this.$t('general.disabled')
        },
        {
          key: 'basic',
          name: this.$t('monitoring.basic')
        },
        {
          key: 'detailed',
          name: this.$t('v2.merakiTemplates.detailed')
        }
      ],
      collectorIpValidations: {
        required: true,
        methods: [
          {
            method: isValidIpAddress
          }
        ]
      },
      collectorPortValidations: {
        required: true,
        methods: [
          {
            method: isValidPort
          }
        ]
      },
      portInputProps: PORT_INPUT_PROPS,
      ipAddressMask: ipAddressMask
    }
  },
  mounted () {
    // Update validations for compliance mode
    if (this.isComplianceMode || this.isCustomizationMode) {
      this.$set(this.collectorIpValidations, 'required', false)
      this.$set(this.collectorPortValidations, 'required', false)
    }
  },
  computed: {
    nonConfiguredValue () {
      return {}
    }
  },
  methods: {
    onFieldInput (field, value) {
      this.$emit('settingInput', this.field_key, {
        ...this.settingValue,
        [field]: value
      })
    }
  }
}
</script>
