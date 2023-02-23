<template lang="pug">
  .switch-profile-port
    .switch-profile-port__section
      v-layout(row wrap).switch-profile-port__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.portId') }}
        v-flex(xs6 md3 lg2 xl1)
          base-text-input(
            :value="value.portId"
            @input="onFieldInput('portId', $event)"
            v-bind="positiveIntegerInputProps"
            :placeholder="$t('v2.merakiTemplates.portIdPlaceholder')"
            :validations="portIdFieldValidations"
            :show-validation-state="showFieldValidationState"
            :suppress-validation-state-display="suppressValidationStateDisplay"
            :disabled="isFixed"
            @focus="fetchFieldSuggestions(field_key, 'ports__portId')"
            :suggestions="getFieldSuggestions(field_key, 'ports__portId')"
          )

      v-layout(row wrap).switch-profile-port__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('general.name') }}
        v-flex(xs3 md4 lg3 xl2)
          base-text-input(
            :value="value.name"
            @input="onFieldInput('name', $event)"
            :disabled="isFixed"
            @focus="fetchFieldSuggestions(field_key, 'ports__name')"
            :suggestions="getFieldSuggestions(field_key, 'ports__name')"
          )

      v-layout(row wrap).switch-profile-port__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('wifi.type') }}
        v-flex(xs6 md3 lg2 xl1)
          base-select(
            :items="typeOptions"
            :value="value.type"
            @input="onFieldInput('type', $event)"
            :validations="{ required: true }"
            :show-validation-state="showFieldValidationState"
            :suppress-validation-state-display="suppressValidationStateDisplay"
            :disabled="isFixed"
          )

    .switch-profile-port__section
      v-layout(
        v-show="value.type === types.access"
        row wrap
      ).switch-profile-port__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.accessPolicy') }}
        v-flex(xs3 md4 lg3 xl2)
          base-select(
            :items="accessPolicyOptions"
            :value="value.accessPolicyType"
            @input="onFieldInput('accessPolicyType', $event)"
            :validations="{ required: true }"
            :show-validation-state="showFieldValidationState"
            :suppress-validation-state-display="suppressValidationStateDisplay"
            :disabled="isFixed"
          )

      v-layout(
        v-show="value.type === types.access && value.accessPolicyType === accessPolicies.stickyMacAllowList"
        row wrap
      ).switch-profile-port__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.whitelistSizeLimit') }}
        v-flex(xs6 md3 lg2 xl1)
          base-text-input(
            type="number"
            :value="value.stickyMacAllowListLimit"
            @input="onFieldInput('stickyMacAllowListLimit', $event)"
            :validations="whitelistSizeLimitFieldValidations"
            :placeholder="$t('v2.merakiTemplates.whitelistSizeLimitPlaceholder')"
            :show-validation-state="showFieldValidationState"
            :suppress-validation-state-display="suppressValidationStateDisplay"
            :disabled="isFixed"
            :min="1"
            :max="20"
            :forbidden-characters="positiveIntegerInputProps.forbiddenCharacters"
          )

      v-layout(
        v-show="value.type === types.access && (value.accessPolicyType === accessPolicies.macAllowList || value.accessPolicyType === accessPolicies.stickyMacAllowList)"
        row wrap
      ).switch-profile-port__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.whitelistedMACs') }}
        v-flex(xs6 md8 lg6 xl4)
          multi-text-input(
            :value="value[maxAllowListFieldKey]"
            @input="onFieldInput(maxAllowListFieldKey, $event)"
            :validations="macListFieldValidations"
            :placeholder="$t('v2.placeholders.separateByCommas')"
            :show-validation-state="showFieldValidationState"
            :suppress-validation-state-display="suppressValidationStateDisplay"
            :disabled="isFixed"
            @focus="fetchFieldSuggestions(field_key, `ports__${maxAllowListFieldKey}`)"
            :items="getSuggestionsForMultiTextInput(field_key, `ports__${maxAllowListFieldKey}`)"
          )

      v-layout(row wrap).switch-profile-port__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ value.type === types.trunk ? $t('v2.merakiTemplates.nativeVlan') : $t('v2.merakiTemplates.vlan') }}
        v-flex(xs6 md3 lg2 xl1)
          base-text-input(
            :value="value.vlan"
            @input="onFieldInput('vlan', $event)"
            v-bind="vlanInputProps"
            :placeholder="$t('v2.placeholders.vlanId')"
            :validations="vlanFieldValidations"
            :show-validation-state="showFieldValidationState"
            :suppress-validation-state-display="suppressValidationStateDisplay"
            :disabled="isFixed"
            :min="1"
            :max="4094"
            @focus="fetchFieldSuggestions(field_key, 'ports__vlan')"
            :suggestions="getFieldSuggestions(field_key, 'ports__vlan')"
          )

      v-layout(
        v-show="value.type === types.trunk"
        row wrap
      ).switch-profile-port__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.allowedVlans') }}
        v-flex(xs3 md4 lg3 xl2)
          base-text-input(
            :value="value.allowedVlans"
            @input="onFieldInput('allowedVlans', $event)"
            :placeholder="$t('v2.merakiTemplates.switchPortAllowedVlansPlaceholder')"
            :title="$t('v2.merakiTemplates.switchPortAllowedVlansPlaceholder')"
            :validations="allowedVlansFieldValidation"
            :show-validation-state="showFieldValidationState"
            :suppress-validation-state-display="suppressValidationStateDisplay"
            :disabled="isFixed"
            @focus="fetchFieldSuggestions(field_key, 'ports__allowedVlans')"
            :suggestions="getFieldSuggestions(field_key, 'ports__allowedVlans')"
          )

      v-layout(
        v-show="value.type === types.access"
        row wrap
      ).switch-profile-port__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.voiceVlan') }}
        v-flex(xs6 md3 lg2 xl1)
          base-text-input(
            :value="value.voiceVlan"
            @input="onFieldInput('voiceVlan', $event)"
            v-bind="vlanInputProps"
            :placeholder="$t('v2.merakiTemplates.switchPortVlanPlaceholder')"
            :validations="voiceVlanFieldValidations"
            :show-validation-state="showFieldValidationState"
            :suppress-validation-state-display="suppressValidationStateDisplay"
            :disabled="isFixed"
            :min="1"
            :max="4094"
            @focus="fetchFieldSuggestions(field_key, 'ports__voiceVlan')"
            :suggestions="getFieldSuggestions(field_key, 'ports__voiceVlan')"
          )

    .switch-profile-port__section
      v-layout(row wrap).switch-profile-port__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.linkNegotiation') }}
        v-flex(xs3 md4 lg3 xl2)
          base-select(
            :items="linkNegotiationOptions"
            :value="value.linkNegotiation"
            @input="onFieldInput('linkNegotiation', $event)"
            :validations="{ required: true }"
            :show-validation-state="showFieldValidationState"
            :suppress-validation-state-display="suppressValidationStateDisplay"
            :disabled="isFixed"
          )

      v-layout(row wrap).switch-profile-port__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.rstp') }}
        v-flex(xs3 md4 lg3 xl2)
          base-switch(
            :value="value.rstpEnabled"
            @input="onFieldInput('rstpEnabled', $event)"
            :yes-label="$t('general.enabled')"
            :no-label="$t('general.disabled')"
            :validations="{ required: true }"
            :show-validation-state="showFieldValidationState"
            :suppress-validation-state-display="suppressValidationStateDisplay"
            :disabled="isFixed"
          )

      v-layout(row wrap).switch-profile-port__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.stpGuard') }}
        v-flex(xs3 md4 lg3 xl2)
          base-select(
            :items="stpGuardOptions"
            :value="value.stpGuard"
            @input="onFieldInput('stpGuard', $event)"
            :validations="{ required: true }"
            :show-validation-state="showFieldValidationState"
            :suppress-validation-state-display="suppressValidationStateDisplay"
            :disabled="isFixed"
          )

      v-layout(row wrap).switch-profile-port__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.portIsolation') }}
        v-flex(xs3 md4 lg3 xl2)
          base-switch(
            :value="value.isolationEnabled"
            @input="onFieldInput('isolationEnabled', $event)"
            :yes-label="$t('general.enabled')"
            :no-label="$t('general.disabled')"
            :validations="{ required: true }"
            :show-validation-state="showFieldValidationState"
            :suppress-validation-state-display="suppressValidationStateDisplay"
            :disabled="isFixed"
          )

      v-layout(row wrap).switch-profile-port__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.udld') }}
        v-flex(xs3 md4 lg3 xl2)
          base-select(
            :items="udldOptions"
            :value="value.udld"
            @input="onFieldInput('udld', $event)"
            :validations="{ required: true }"
            :show-validation-state="showFieldValidationState"
            :suppress-validation-state-display="suppressValidationStateDisplay"
            :disabled="isFixed"
          )

      v-layout(row wrap).switch-profile-port__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.poe') }}
        v-flex(xs3 md4 lg3 xl2)
          base-switch(
            :value="value.poeEnabled"
            @input="onFieldInput('poeEnabled', $event)"
            :yes-label="$t('general.enabled')"
            :no-label="$t('general.disabled')"
            :validations="{ required: true }"
            :show-validation-state="showFieldValidationState"
            :suppress-validation-state-display="suppressValidationStateDisplay"
            :disabled="isFixed"
          )

    .switch-profile-port__section
      v-layout(row wrap).switch-profile-port__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('general.tags') }}
        v-flex(xs6 md8 lg6 xl4)
          multi-text-input(
            :value="value.tags"
            @input="onFieldInput('tags', $event)"
            :placeholder="$t('v2.placeholders.separateByCommas')"
            :show-validation-state="showFieldValidationState"
            :suppress-validation-state-display="suppressValidationStateDisplay"
            :disabled="isFixed"
            @focus="fetchFieldSuggestions(field_key, 'ports__tags')"
            :items="getSuggestionsForMultiTextInput(field_key, 'ports__tags')"
          )

</template>

<script>
import BaseTable from '@/components/v2/base-table/base-table'
import BaseSelect from '@/components/v2/base-select/base-select'
import BaseSwitch from '@/components/v2/base-switch/base-switch'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import MultiTextInput from '@/components/v2/multi-text-input/multi-text-input'
import NetworkSettingOperationModeMixin from '@/mixins/network-setting-operation-mode.mixin'
import NetworkTemplateSettingFieldSuggestionsMixin from '@/mixins/network-template-setting-field-suggestions.mixin'
import { isValidMacAddress, isValidNonNegativeInteger, isValidSwitchPortVlan } from '@/utils/form-fields-validation-rules'
import { POSITIVE_INTEGER_INPUT_PROPS, VLAN_INPUT_PROPS } from '@/constants/form-fields'

export default {
  name: 'switch-profile-port',
  components: {
    BaseTable,
    BaseTextInput,
    MultiTextInput,
    BaseSelect,
    BaseSwitch
  },
  mixins: [
    NetworkSettingOperationModeMixin,
    NetworkTemplateSettingFieldSuggestionsMixin
  ],
  props: {
    value: {
      required: true
    },
    showFieldValidationState: {
      type: Boolean,
      default: false
    },
    suppressValidationStateDisplay: {
      type: Boolean,
      default: false
    },
    isFixed: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      field_key: 'switch_profiles',
      types: {
        trunk: 'trunk',
        access: 'access'
      },
      typeOptions: [
        {
          key: 'trunk',
          name: this.$t('v2.merakiTemplates.trunk')
        },
        {
          key: 'access',
          name: this.$t('v2.merakiTemplates.access')
        }
      ],
      accessPolicies: {
        open: 'Open',
        macAllowList: 'MAC allow list',
        stickyMacAllowList: 'Sticky MAC allow list'
      },
      accessPolicyOptions: [
        {
          key: 'Open',
          name: this.$t('general.openNoun')
        },
        {
          key: 'MAC allow list',
          name: this.$t('v2.merakiTemplates.macAllowList')
        },
        {
          key: 'Sticky MAC allow list',
          name: this.$t('v2.merakiTemplates.stickyMacAllowList')
        }
      ],
      linkNegotiationOptions: [
        {
          key: 'Auto negotiate',
          name: this.$t('v2.merakiTemplates.autoNegotiate')
        },
        {
          key: '1 Gigabit full duplex (forced)',
          name: this.$t('v2.merakiTemplates.1gigabitFullDuplexForced')
        },
        {
          key: '100 Megabit (auto)',
          name: this.$t('v2.merakiTemplates.100megabitAuto')
        },
        {
          key: '100 Megabit half duplex (forced)',
          name: this.$t('v2.merakiTemplates.100megabitHalfDuplexForced')
        },
        {
          key: '100 Megabit full duplex (forced)',
          name: this.$t('v2.merakiTemplates.100megabitFullDuplexForced')
        },
        {
          key: '10 Megabit (auto)',
          name: this.$t('v2.merakiTemplates.10megabitAuto')
        },
        {
          key: '10 Megabit half duplex (forced)',
          name: this.$t('v2.merakiTemplates.10megabitHalfDuplexForced')
        },
        {
          key: '10 Megabit full duplex (forced)',
          name: this.$t('v2.merakiTemplates.10megabitFullDuplexForced')
        }
      ],
      stpGuardOptions: [
        {
          key: 'disabled',
          name: this.$t('general.disabled')
        },
        {
          key: 'root guard',
          name: this.$t('v2.merakiTemplates.rootGuard')
        },
        {
          key: 'bpdu guard',
          name: this.$t('v2.merakiTemplates.bpduGuard')
        },
        {
          key: 'loop guard',
          name: this.$t('v2.merakiTemplates.loopGuard')
        }
      ],
      udldOptions: [
        {
          key: 'Alert only',
          name: this.$t('v2.merakiTemplates.alertOnly')
        },
        {
          key: 'Enforce',
          name: this.$t('v2.merakiTemplates.enforce')
        }
      ],
      portIdFieldValidations: {
        required: true,
        methods: [{
          method: function (value) {
            return isValidNonNegativeInteger(value) && value > 0
          }
        }]
      },
      whitelistSizeLimitFieldValidations: {
        required: true,
        methods: [{
          method: function (value) {
            return isValidNonNegativeInteger(value) && value > 0 && value <= 20
          }
        }]
      },
      voiceVlanFieldValidations: {
        required: false,
        methods: [{
          method: isValidSwitchPortVlan
        }]
      },
      allowedVlansFieldValidation: {
        required: true,
        methods: [{
          method: function (value) {
            if (value === 'all') {
              return true
            }

            const elements = value.split(',')
            for (let i = 0; i < elements.length; i++) {
              const element = elements[i]

              if (isValidSwitchPortVlan(element)) {
                // Valid, single vlan
                continue
              }

              if (/^[0-9]+-[0-9]+$/.test(element)) {
                const limits = element.split('-')
                const limitLow = parseInt(limits[0])
                const limitHigh = parseInt(limits[1])

                if (isValidSwitchPortVlan(limitLow) && isValidSwitchPortVlan(limitHigh) && (limitLow < limitHigh)) {
                  // Valid, vlan range (like 1-10)
                  continue
                }
              }

              // Doe not match any of the valid cases
              return false
            }

            return true
          }
        }]
      },
      positiveIntegerInputProps: POSITIVE_INTEGER_INPUT_PROPS,
      vlanInputProps: VLAN_INPUT_PROPS
    }
  },
  computed: {
    maxAllowListFieldKey () {
      if (this.value.accessPolicyType === this.accessPolicies.macAllowList) {
        return 'macAllowList'
      } else if (this.value.accessPolicyType === this.accessPolicies.stickyMacAllowList) {
        return 'stickyMacAllowList'
      }

      return null
    },
    macListFieldValidations () {
      return {
        required: this.value.accessPolicyType === this.accessPolicies.macAllowList,
        methods: [
          {
            method: isValidMacAddress,
            message: this.$t('v2.merakiTemplates.nonMACAddError')
          }
        ]
      }
    },
    vlanFieldValidations () {
      return {
        required: this.value.type === this.types.access,
        methods: [{
          method: isValidSwitchPortVlan
        }]
      }
    }
  },
  methods: {
    onFieldInput (field, value) {
      // Normalize empty values
      if (field === 'vlan' && !value) {
        value = null
      }

      this.$emit('fieldInput', field, value)

      // Set default values for fields that depend on other fields
      if (field === 'type') {
        if (value === 'trunk') {
          this.$emit('fieldInput', 'allowedVlans', 'all')
          this.$emit('fieldClear', ['accessPolicyType', 'macAllowList', 'stickyMacAllowList',
            'stickyMacAllowListLimit', 'voiceVlan'])
        } else if (value === 'access') {
          this.$emit('fieldInput', 'accessPolicyType', 'Open')
          this.$emit('fieldInput', 'voiceVlan', null)

          this.$emit('fieldClear', ['allowedVlans'])
        }
      } else if (field === 'accessPolicyType') {
        if (value === 'Open') {
          this.$emit('fieldClear', ['macAllowList', 'stickyMacAllowList', 'stickyMacAllowListLimit'])
        } else if (value === 'MAC allow list') {
          this.$emit('fieldInput', 'macAllowList', [])

          this.$emit('fieldClear', ['stickyMacAllowList', 'stickyMacAllowListLimit'])
        } else if (value === 'Sticky MAC allow list') {
          this.$emit('fieldInput', 'stickyMacAllowList', [])
          this.$emit('fieldInput', 'stickyMacAllowListLimit', null)

          this.$emit('fieldClear', ['macAllowList'])
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
  @import "styles/v2/colors.scss";

  .switch-profile-port {
    &__section {
      margin-bottom: 30px;
      padding-bottom: 30px;
      border-bottom: 1px solid $gray-xlight;
    }

    &__row {
      margin-top: 10px;

      label {
        line-height: 40px;
        padding-right: 10px;
        display: block;
      }
    }
  }

</style>
