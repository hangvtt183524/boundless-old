<template lang="pug">
  .group-policies-firewall-settings
    v-layout(row wrap).group-policies-firewall-settings__row
      v-flex(xs6 md4 lg3 xl2)
        label {{ $t('v2.merakiTemplates.firewallAndTrafficShaping') }}
      v-flex(xs6 md4 lg3 xl2)
        base-select(
          :items="firewallSetting"
          :value="value.settings"
          @input="onFieldInput('settings', $event)"
          :validations="{ required: true }"
          :show-validation-state="showFieldValidationState"
          :disabled="isFixed"
        )

    v-layout(row wrap).group-policies-firewall-settings__row.rule-row(
      v-show="value.settings === 'custom'"
    )
      v-flex(xs12)
        label {{ $t('v2.merakiTemplates.layer3Firewall') }}
      v-flex(xs12 xl10)
        l3-firewall-rules(
          :value="value.l3FirewallRules ? value.l3FirewallRules : []"
          @input="onFieldInput('l3FirewallRules', $event)"
          @itemInput="onItemInput"
          target="mr"
          :operation-mode="operationMode"
          :show-field-validation-state="showFieldValidationState"
          :is-fixed="isFixed"
          :field-suggestions="fieldSuggestions"
          @fieldSuggestionInput="onFieldSuggestionInput"
        )

    v-layout(row wrap).group-policies-firewall-settings__row.rule-row(
      v-show="value.settings === 'custom'"
    )
      v-flex(xs12)
        label {{ $t('v2.merakiTemplates.layer7Firewall') }}
      v-flex(xs12 xl10)
        l7-firewall-rules(
          :value="value.l7FirewallRules ? value.l7FirewallRules : []"
          @input="onFieldInput('l7FirewallRules', $event)"
          @itemInput="onItemInput"
          :show-field-validation-state="showFieldValidationState"
          :is-fixed="isFixed"
        )

    v-layout(row wrap).group-policies-firewall-settings__row.rule-row(
      v-show="value.settings === 'custom'"
    )
      v-flex(xs12)
        label {{ $t('v2.merakiTemplates.trafficShaping') }}
      v-flex(xs12 xl10)
        traffic-shaping-rules(
          :value="value.trafficShapingRules ? value.trafficShapingRules : []"
          @input="onFieldInput('trafficShapingRules', $event)"
          @itemInput="onItemInput"
          target="mr"
          :show-field-validation-state="showFieldValidationState"
          :operation-mode="operationMode"
          :is-fixed="isFixed"
        )

</template>

<script>
import BaseSelect from '@/components/v2/base-select/base-select'
import L3FirewallRules from './l3-firewall-rules'
import L7FirewallRules from './l7-firewall-rules'
import TrafficShapingRules from './traffic-shaping-rules'
import NetworkSettingOperationModeMixin from '@/mixins/network-setting-operation-mode.mixin'
import NetworkTemplateSettingFieldSuggestionsMixin from '@/mixins/network-template-setting-field-suggestions.mixin'

export default {
  name: 'group-policies-firewall-settings',
  components: { TrafficShapingRules, L7FirewallRules, L3FirewallRules, BaseSelect },
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
    isFixed: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      firewallSetting: [
        {
          key: 'network default',
          name: this.$t('v2.merakiTemplates.obeyNetworkDefault')
        },
        {
          key: 'ignore',
          name: this.$t('v2.merakiTemplates.ignoreNetworkDefault')
        },
        {
          key: 'custom',
          name: this.$t('v2.merakiTemplates.customRules')
        }
      ]
    }
  },
  methods: {
    onFieldInput (field, value) {
      this.$emit('input', {
        ...this.value,
        [field]: value
      })
    },
    onItemInput (tableItem, field, value) {
      this.$emit('itemInput', tableItem, field, value)
    }
  }
}
</script>

<style scoped lang="scss">
  @import "styles/v2/colors.scss";

  .group-policies-firewall-settings {
    margin-bottom: 30px;
    padding-bottom: 30px;
    border-bottom: 1px solid $gray-xlight;

    &__row {
      margin-top: 10px;

      label {
        line-height: 40px;
        padding-right: 10px;
        display: block;
      }

      &.rule-row {
        padding-bottom: 10px;
      }
    }
  }

</style>
