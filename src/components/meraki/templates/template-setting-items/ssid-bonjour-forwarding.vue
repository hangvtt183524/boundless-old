<template lang="pug">
  template-setting-item.ssid-radius-servers(
    :title="$t('v2.merakiTemplates.bonjourForwarding')"
    :operation-mode="operationMode"
    :deploy-strategy-selector-enabled="isTemplateMode"
    :deploy-strategy-value="deployStrategyValue"
    @deployStrategyInput="$emit('deployStrategyInput', field_key, $event)"
    :is-empty="isEmpty"
  )
    template(v-slot:default)
      v-layout(row wrap).template-setting-item__content__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('general.enabled') }}
        v-flex(xs6 md8 lg8 xl6)
          base-switch(
            :value="settingValue.enabled"
            @input="onFieldInput('enabled', $event)"
            :disabled="isFixed"
            clearable
          )

      v-layout(
        v-show="settingValue.enabled === true"
        row wrap
      ).template-setting-item__content__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.rules') }}
        v-flex(xs6 md8 lg9 xl10)
          bonjour-forwarding-rules(
            :value="settingValue.rules ? settingValue.rules : []"
            @input="onFieldInput('rules', $event)"
            @itemInput="onItemInput"
            :show-field-validation-state="showFieldValidationState"
            :is-fixed="isFixed"
          )

</template>

<script>
import TemplateSettingItem from './template-setting-item'
import NetworkTemplateSettingItemMixin from '@/mixins/network-template-setting-item.mixin'
import BaseSwitch from '@/components/v2/base-switch/base-switch'
import BonjourForwardingRules from './bonjour-forwarding-rules'

export default {
  name: 'ssid-bonjour-forwarding',
  mixins: [
    NetworkTemplateSettingItemMixin
  ],
  components: { BonjourForwardingRules, BaseSwitch, TemplateSettingItem },
  data: function () {
    return {
      field_key: 'bonjour_forwarding_rules'
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
    },
    onItemInput (item, field, value) {
      this.$emit('itemInput', item, field, value)
    }
  }
}
</script>

<style scoped lang="scss">
  @import "styles/v2/colors.scss";

  .ssid-radius-servers {
    .base-table {
      height: auto;
    }

    &__add-chart-item-trigger {
      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 15px;
      line-height: 35px;
      text-decoration-line: underline;
      color: $green-medium;
      cursor: pointer;
    }
  }

</style>
