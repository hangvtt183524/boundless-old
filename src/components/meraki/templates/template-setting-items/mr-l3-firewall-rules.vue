<template lang="pug">
  template-setting-item.mr-l3-firewall-rules(
    :title="operationMode === operationModes.compliance ? $t('v2.merakiTemplates.SSIDLayer3OutboundRules') : $t('v2.merakiTemplates.layer3OutboundRules')"
    :deploy-strategy-selector-enabled="isTemplateMode"
    :deploy-strategy-value="deployStrategyValue"
    :operation-mode="operationMode"
    @deployStrategyInput="$emit('deployStrategyInput', field_key, $event)"
    :is-empty="isEmpty"
  )
    template(v-slot:default)
      v-layout(row wrap).template-setting-item__content__row
        v-flex(xs12 xl10)
          l3-firewall-rules(
            :value="settingValue"
            @input="onInput"
            @itemInput="onItemInput"
            target="mr"
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
  name: 'mr-l3-firewall-rules',
  mixins: [
    NetworkTemplateSettingItemMixin
  ],
  components: { L3FirewallRules, TemplateSettingItem },
  data: function () {
    return {
      field_key: 'mr_l3_firewall_rules'
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
