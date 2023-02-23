<template lang="pug">
  .group-policies-vlan-tagging
    v-layout(row wrap).group-policies-vlan-tagging__row
      v-flex(xs6 md4 lg3 xl2)
        label {{ $t('v2.merakiTemplates.vlan') }}
      v-flex(xs3 md4 lg3 xl2)
        base-select(
          :items="bandwidthLimitSetting"
          :value="value.settings"
          @input="onFieldInput('settings', $event)"
          :validations="{ required: true }"
          :show-validation-state="showFieldValidationState"
          :disabled="isFixed"
        )
      v-flex(
        xs3 md2 lg1
        v-show="value.settings === 'custom'"
      )
        base-text-input(
          :value="value.vlanId"
          @input="onFieldInput('vlanId', $event)"
          v-bind="vlanInputProps"
          :placeholder="$t('v2.merakiTemplates.basicVlanIdPlaceholder')"
          :validations="vlanIdValidations"
          :show-validation-state="showFieldValidationState"
          :disabled="isFixed"
        )

</template>

<script>
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import BaseSelect from '@/components/v2/base-select/base-select'
import { isValidVlan } from '@/utils/form-fields-validation-rules'
import { VLAN_INPUT_PROPS } from '@/constants/form-fields'

export default {
  name: 'group-policies-vlan-tagging',
  components: { BaseTextInput, BaseSelect },
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
      bandwidthLimitSetting: [
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
          name: this.$t('v2.merakiTemplates.tagVlan')
        }
      ],
      vlanIdValidations: {
        required: true,
        methods: [{
          method: isValidVlan
        }]
      },
      vlanInputProps: VLAN_INPUT_PROPS
    }
  },
  methods: {
    onFieldInput (field, value) {
      this.$emit('input', {
        ...this.value,
        [field]: value
      })
    }
  }
}
</script>

<style scoped lang="scss">
  @import "styles/v2/colors.scss";

  .group-policies-vlan-tagging {
    &__row {
      margin-top: 10px;

      label {
        line-height: 40px;
        padding-right: 10px;
        display: block;
      }

      .base-text-input {
        margin-left: 10px;
      }
    }
  }

</style>
