<template lang="pug">
  template-setting-item.ssid-walled-garden(
    :title="$t('v2.merakiTemplates.walledGarden')"
    :operation-mode="operationMode"
    v-show="settingValue.splashPage !== 'None'"
  )
    template(v-slot:default)
      v-layout(row wrap).template-setting-item__content__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('general.enabled') }}
        v-flex(xs6 md4 lg3 xl2)
          base-switch(
            :value="settingValue.walledGardenEnabled"
            @input="onFieldInput('walledGardenEnabled', $event)"
            :disabled="isFixed"
          )

      v-layout(row wrap).template-setting-item__content__row(
        v-show="settingValue.walledGardenEnabled"
      )
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.ranges') }}
        v-flex(xs6 md8 lg9 xl6)
          multi-text-input(
            :value="walledGardenRangesValue"
            @input="onRangeInput($event)"
            :placeholder="$t('v2.placeholders.separateByCommas')"
            :validations="walledGardenRangeValidations"
            :show-validation-state="showFieldValidationState"
            :disabled="isFixed"
            @focus="fetchFieldSuggestions('ssids', 'definition__walledGardenRanges')"
            :items="getSuggestionsForMultiTextInput('ssids', 'definition__walledGardenRanges')"
          )

</template>

<script>
import TemplateSettingItem from './template-setting-item'
import NetworkTemplateSettingItemMixin from '@/mixins/network-template-setting-item.mixin'
import BaseSwitch from '@/components/v2/base-switch/base-switch'
import MultiTextInput from '@/components/v2/multi-text-input/multi-text-input'
import { isValidCidr, isValidHostname, isValidIpAddress, isValidDomainWildcard } from '@/utils/form-fields-validation-rules'

export default {
  name: 'ssid-walled-garden',
  mixins: [
    NetworkTemplateSettingItemMixin
  ],
  components: { BaseSwitch, MultiTextInput, TemplateSettingItem },
  data: function () {
    return {
      field_key: 'definition',
      walledGardenRangeValidations: {
        required: true,
        methods: [{
          method: function (value) {
            return isValidCidr(value) || isValidHostname(value) || isValidIpAddress(value) || isValidDomainWildcard(value)
          },
          message: this.$t('v2.merakiTemplates.invalidWalledGardenRangeAddError')
        }]
      }
    }
  },
  mounted () {
    // Update validations for compliance mode
    if (this.isComplianceMode || this.isCustomizationMode) {
      this.$set(this.walledGardenRangeValidations, 'required', false)
    }
  },
  computed: {
    walledGardenRangesValue () {
      return this.settingValue.walledGardenRanges ? this.settingValue.walledGardenRanges : []
    }
  },
  methods: {
    onFieldInput (field, value) {
      this.$emit('settingInput', this.field_key, {
        ...this.settingValue,
        [field]: value
      })
    },
    onRangeInput (value) {
      this.$emit('settingInput', this.field_key, {
        ...this.settingValue,
        walledGardenRanges: value
      })
    }
  }
}
</script>
