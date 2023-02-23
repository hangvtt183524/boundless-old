<template lang="pug">
  .group-policies-bonjour-forwarding-settings
    v-layout(row wrap).group-policies-bonjour-forwarding-settings__row
      v-flex(xs6 md4 lg3 xl2)
        label {{ $t('v2.merakiTemplates.bonjourForwarding') }}
      v-flex(xs6 md4 lg3 xl2)
        base-select(
          :items="bonjourForwardingSetting"
          :value="value.settings"
          @input="onFieldInput('settings', $event)"
          :validations="{ required: true }"
          :show-validation-state="showFieldValidationState"
          :disabled="isFixed"
        )

    v-layout(row wrap).group-policies-bonjour-forwarding-settings__row.rule-row(
      v-show="value.settings === 'custom'"
    )
      v-flex(xs6 md4 lg3 xl2)
      v-flex(xs6 md8 lg9 xl10)
        bonjour-forwarding-rules(
          :value="value.rules ? value.rules : []"
          @input="onFieldInput('rules', $event)"
          @itemInput="onItemInput"
          target="mr"
          :show-field-validation-state="showFieldValidationState"
          :is-fixed="isFixed"
        )

</template>

<script>
import BaseSelect from '@/components/v2/base-select/base-select'
import BonjourForwardingRules from './bonjour-forwarding-rules'

export default {
  name: 'group-policies-firewall-settings',
  components: { BonjourForwardingRules, BaseSelect },
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
      bonjourForwardingSetting: [
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

  .group-policies-bonjour-forwarding-settings {
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
