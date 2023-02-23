<template lang="pug">
  .group-policies-bandwidth-limits
    v-layout(row wrap).group-policies-bandwidth-limits__row
      v-flex(xs6 md4 lg3 xl2)
        label {{ $t('v2.merakiTemplates.bandwidthLimits') }}
      v-flex(xs6 md4 lg3 xl2)
        base-select(
          :items="bandwidthLimitSetting"
          :value="value.settings"
          @input="onFieldInput('settings', $event)"
          :validations="{ required: true }"
          :show-validation-state="showFieldValidationState"
          :disabled="isFixed"
        )

    v-layout(row wrap).group-policies-bandwidth-limits__row(
      v-show="value.settings === 'custom'"
    )
      v-flex(xs6 md4 lg3 xl2)
      v-flex(xs6 md4 lg3 xl2)
        base-text-input(
          :value="limitDown"
          @input="onLimitInput('limitDown', $event)"
          v-bind="positiveIntegerInputProps"
          :label="$t('v2.merakiTemplates.limitDownKb')"
          :validations="limitFieldValidations"
          :show-validation-state="showFieldValidationState"
          :disabled="isFixed"
          @focus="fetchFieldSuggestions('group_policies', 'bandwidth__bandwidthLimits__limitDown')"
          :suggestions="getFieldSuggestions('group_policies', 'bandwidth__bandwidthLimits__limitDown')"
        )
      v-flex(xs6 md4 lg3 xl2)
        base-text-input(
          :value="limitUp"
          @input="onLimitInput('limitUp', $event)"
          v-bind="positiveIntegerInputProps"
          :label="$t('v2.merakiTemplates.limitUpKb')"
          :validations="limitFieldValidations"
          :show-validation-state="showFieldValidationState"
          :disabled="isFixed"
          @focus="fetchFieldSuggestions('group_policies', 'bandwidth__bandwidthLimits__limitUp')"
          :suggestions="getFieldSuggestions('group_policies', 'bandwidth__bandwidthLimits__limitUp')"
        )

</template>

<script>
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import BaseSelect from '@/components/v2/base-select/base-select'
import { isValidNonNegativeInteger } from '@/utils/form-fields-validation-rules'
import { POSITIVE_INTEGER_INPUT_PROPS } from '@/constants/form-fields'
import NetworkTemplateSettingFieldSuggestionsMixin from '@/mixins/network-template-setting-field-suggestions.mixin'

export default {
  name: 'group-policies-bandwidth-limits',
  components: { BaseTextInput, BaseSelect },
  mixins: [ NetworkTemplateSettingFieldSuggestionsMixin ],
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
          name: this.$t('v2.merakiTemplates.customLimits')
        }
      ],
      limitFieldValidations: {
        required: false,
        methods: [{
          method: isValidNonNegativeInteger
        }]
      },
      positiveIntegerInputProps: POSITIVE_INTEGER_INPUT_PROPS
    }
  },
  computed: {
    limitDown () {
      return this.value.bandwidthLimits ? this.value.bandwidthLimits.limitDown : null
    },
    limitUp () {
      return this.value.bandwidthLimits ? this.value.bandwidthLimits.limitUp : null
    }
  },
  methods: {
    onFieldInput (field, value) {
      this.$emit('input', {
        ...this.value,
        [field]: value
      })
    },
    onLimitInput (field, value) {
      this.$emit('input', {
        ...this.value,
        bandwidthLimits: {
          ...this.value.bandwidthLimits,
          [field]: value
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  @import "styles/v2/colors.scss";

  .group-policies-bandwidth-limits {
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

      .base-text-input {
        margin-right: 10px;
      }
    }
  }

</style>
