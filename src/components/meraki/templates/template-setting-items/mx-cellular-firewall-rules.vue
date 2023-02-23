<template lang="pug">
  template-setting-item.mx-cellular-firewall-rules(
    :title="$t('v2.merakiTemplates.cellularFailOverRules')"
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
          l3-firewall-rules(
            :value="settingValue"
            @input="onInput"
            @itemInput="onItemInput"
            target="mxCellular"
            :show-field-validation-state="showFieldValidationState"
            :operation-mode="operationMode"
            :is-fixed="isFixed"
            :field-suggestions="fieldSuggestions"
            @fieldSuggestionInput="onFieldSuggestionInput"
          )

</template>

<script>
import TemplateSettingItem from './template-setting-item'
import NetworkTemplateSettingItemMixin from '@/mixins/network-template-setting-item.mixin'
import L3FirewallRules from './l3-firewall-rules'

export default {
  name: 'mx-cellular-firewall-rules',
  mixins: [
    NetworkTemplateSettingItemMixin
  ],
  components: { L3FirewallRules, TemplateSettingItem },
  data: function () {
    return {
      field_key: 'mx_cellular_firewall_rules'
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
