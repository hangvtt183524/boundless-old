<template lang="pug">
  template-setting-item.intrusion-detection-protection(
    :title="$t('v2.merakiTemplates.intrusionDetection')"
    :operation-mode="operationMode"
    :customizations="customizations"
    :setting-fields="[field_key]"
    customizations-enabled
    @customizationsClick="$emit('customizationsClick', $event)"
  )
    template(v-slot:default)

      v-layout(row wrap).template-setting-item__content__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.mode') }}
        v-flex(xs6 md4 lg3 xl2)
          base-select(
            :items="modes"
            :value="effectiveValue.mode"
            @input="onFieldInput('mode', $event)"
            :disabled="isFixed"
            clearable
          )

      v-layout(row wrap).template-setting-item__content__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.ruleSet') }}
        v-flex(xs6 md4 lg3 xl2)
          base-select(
            :items="ruleSets"
            :value="effectiveValue.idsRulesets"
            @input="onFieldInput('idsRulesets', $event)"
            :disabled="isFixed"
            clearable
          )

      v-layout(
        v-show="effectiveValue.mode !== 'disabled'"
        row wrap
      ).template-setting-item__content__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.useSpecialIPAddressRules') }}
        v-flex(xs6 md4 lg3 xl2)
          base-switch(
            :value="protectedNetworksValue.useDefault"
            @input="onProtectedNetworksFieldInput('useDefault', $event)"
            :disabled="isFixed"
            clearable
          )

      v-layout(
        v-show="effectiveValue.mode !== 'disabled'"
        row wrap
      ).template-setting-item__content__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.includedCidr') }}
        v-flex(xs6 md8 lg9 xl10)
          multi-text-input(
            :value="protectedNetworksValue.includedCidr || []"
            @input="onProtectedNetworksFieldInput('includedCidr', $event)"
            :disabled="isFixed"
            :validations="cidrFieldValidations"
            :suppress-validation-state-display="isEmpty"
            :placeholder="$t('v2.placeholders.separateByCommas')"
            @focus="fetchFieldSuggestions(field_key, 'protectedNetworks__includedCidr')"
            :items="getSuggestionsForMultiTextInput(field_key, 'protectedNetworks__includedCidr')"
          )

      v-layout(
        v-show="effectiveValue.mode !== 'disabled'"
        row wrap
      ).template-setting-item__content__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.excludedCidr') }}
        v-flex(xs6 md8 lg9 xl10)
          multi-text-input(
            :value="protectedNetworksValue.excludedCidr || []"
            @input="onProtectedNetworksFieldInput('excludedCidr', $event)"
            :disabled="isFixed"
            :validations="cidrFieldValidations"
            :suppress-validation-state-display="isEmpty"
            :placeholder="$t('v2.placeholders.separateByCommas')"
            @focus="fetchFieldSuggestions(field_key, 'protectedNetworks__excludedCidr')"
            :items="getSuggestionsForMultiTextInput(field_key, 'protectedNetworks__excludedCidr')"
          )

</template>

<script>
import TemplateSettingItem from './template-setting-item'
import NetworkTemplateSettingItemMixin from '@/mixins/network-template-setting-item.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import BaseSelect from '@/components/v2/base-select/base-select'
import BaseSwitch from '@/components/v2/base-switch/base-switch'
import MultiTextInput from '@/components/v2/multi-text-input/multi-text-input'
import { isValidIpAddress, isValidCidr } from '@/utils/form-fields-validation-rules'

export default {
  name: 'intrusion-detection-protection',
  mixins: [
    NetworkTemplateSettingItemMixin,
    CurrentNodeSelectionsMixin
  ],
  components: {
    MultiTextInput,
    BaseSelect,
    BaseSwitch,
    TemplateSettingItem
  },
  data: function () {
    return {
      field_key: 'intrusion_settings',
      modes: [
        {
          key: 'disabled',
          name: this.$t('general.disabled')
        },
        {
          key: 'detection',
          name: this.$t('v2.merakiTemplates.detection')
        },
        {
          key: 'prevention',
          name: this.$t('v2.merakiTemplates.prevention')
        }
      ],
      ruleSets: [
        {
          key: 'connectivity',
          name: this.$t('v2.merakiTemplates.connectivity')
        },
        {
          key: 'balanced',
          name: this.$t('v2.merakiTemplates.balanced')
        },
        {
          key: 'security',
          name: this.$t('v2.merakiTemplates.security')
        }
      ],
      cidrFieldValidations: {
        required: false,
        methods: [{
          method: function (value) {
            return isValidIpAddress(value) || isValidCidr(value)
          },
          message: this.$t('v2.merakiTemplates.nonIpOrRangeAddError')
        }]
      }
    }
  },
  computed: {
    emptyValue () {
      return {
        mode: null,
        idsRulesets: null
      }
    },
    nonConfiguredValue () {
      return {}
    },
    protectedNetworksValue () {
      return this.effectiveValue.protectedNetworks ? this.effectiveValue.protectedNetworks : {}
    }
  },
  methods: {
    onFieldInput (field, value) {
      this.$emit('settingInput', this.field_key, {
        ...this.effectiveValue,
        [field]: value
      })
    },
    onProtectedNetworksFieldInput (field, value) {
      this.$emit('settingInput', this.field_key, {
        ...this.effectiveValue,
        protectedNetworks: {
          ...(this.protectedNetworksValue),
          [field]: value
        }
      })
    }
  }
}
</script>
