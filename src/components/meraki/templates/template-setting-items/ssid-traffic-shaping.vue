<template lang="pug">
  template-setting-item.ssid-traffic-shaping(
    :title="$t('v2.merakiTemplates.trafficShaping')"
    :operation-mode="operationMode"
  )
    template(v-slot:default)
      v-layout(row wrap).template-setting-item__content__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.enableTrafficShaping') }}
        v-flex(xs6 md4 lg3 xl2)
          base-switch(
            :value="settingValue.trafficShapingEnabled"
            @input="onFieldInput('trafficShapingEnabled', $event)"
            :disabled="isFixed"
            clearable
          )

      v-layout(row wrap).template-setting-item__content__row(
        v-show="settingValue.trafficShapingEnabled"
      )
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.enableDefaultRules') }}
        v-flex(xs6 md4 lg3 xl2)
          base-switch(
            :value="settingValue.defaultRulesEnabled"
            @input="onFieldInput('defaultRulesEnabled', $event)"
            :disabled="isFixed"
          )

      v-layout(row wrap).template-setting-item__content__row(
        v-show="settingValue.trafficShapingEnabled"
      )
        v-flex(xs12)
          label {{ $t('v2.merakiTemplates.rules') }}
        v-flex(xs12 xl10)
          traffic-shaping-rules(
            :value="rules"
            @input="onRulesInput"
            @itemInput="onRulesItemInput"
            target="mr"
            :show-field-validation-state="showFieldValidationState"
            :operation-mode="operationMode"
            :is-fixed="isFixed"
          )

</template>

<script>
import TemplateSettingItem from './template-setting-item'
import NetworkTemplateSettingItemMixin from '@/mixins/network-template-setting-item.mixin'
import BaseSwitch from '@/components/v2/base-switch/base-switch'
import TrafficShapingRules from './traffic-shaping-rules'

export default {
  name: 'ssid-traffic-shaping',
  mixins: [
    NetworkTemplateSettingItemMixin
  ],
  components: { TrafficShapingRules, BaseSwitch, TemplateSettingItem },
  data: function () {
    return {
      field_key: 'traffic_shaping_settings'
    }
  },
  computed: {
    rules () {
      return this.effectiveValue.rules ? this.effectiveValue.rules : []
    },
    emptyValue () {
      return {
        trafficShapingEnabled: null,
        defaultRulesEnabled: null,
        rules: []
      }
    },
    nonConfiguredValue () {
      return {}
    }
  },
  methods: {
    onFieldInput (field, value) {
      this.$emit('settingInput', this.field_key, {
        ...this.effectiveValue,
        [field]: value
      })
    },
    onRulesInput (value) {
      this.$emit('settingInput', this.field_key, {
        ...this.effectiveValue,
        rules: value
      })
    },
    onRulesItemInput (tableItem, field, value) {
      this.$emit('itemInput', tableItem, field, value)
    }
  }
}
</script>
