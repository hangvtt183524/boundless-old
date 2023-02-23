<template lang="pug">
  template-setting-item.mx-l7-firewall-rules(
    :title="$t('v2.merakiTemplates.layer7FirewallRules')"
    :deploy-strategy-selector-enabled="isTemplateMode"
    :deploy-strategy-value="deployStrategyValue"
    :operation-mode="operationMode"
    @deployStrategyInput="$emit('deployStrategyInput', field_key, $event)"
    :is-empty="isEmpty"
    :customizations="customizations"
    :setting-fields="[field_key]"
    customizations-enabled
    @customizationsClick="$emit('customizationsClick', $event)"
  )
    template(v-slot:default)
      v-layout(row wrap).template-setting-item__content__row
        v-flex(xs12 xl10)
          l7-firewall-rules(
            :value="settingValue"
            @input="onInput"
            @itemInput="onItemInput"
            :show-field-validation-state="showFieldValidationState"
            :operation-mode="operationMode"
            :is-fixed="isFixed"
          )

</template>

<script>
import TemplateSettingItem from './template-setting-item'
import NetworkTemplateSettingItemMixin from '@/mixins/network-template-setting-item.mixin'
import L7FirewallRules from './l7-firewall-rules'

export default {
  name: 'mx-l7-firewall-rules',
  mixins: [
    NetworkTemplateSettingItemMixin
  ],
  components: { L7FirewallRules, TemplateSettingItem },
  data: function () {
    return {
      field_key: 'mx_l7_firewall_rules'
    }
  },
  methods: {
    onInput (value) {
      this.$emit('settingInput', this.field_key, value)
    },
    onItemInput (tableItem, field, value) {
      this.$emit('itemInput', tableItem, field, value)
    }
  }
}
</script>
