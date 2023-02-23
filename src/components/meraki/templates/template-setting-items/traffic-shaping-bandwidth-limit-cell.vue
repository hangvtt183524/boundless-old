<template lang="pug">
  .traffic-shaping-bandwidth-limit-cell
    base-select.base-select--small(
      :value="value.settings"
      @input="onSettingsInput"
      :items="bandwidthLimitSetting"
      :validations="{required: true}"
      :show-validation-state="showValidationState"
      :suppress-validation-state-display="suppressValidationStateDisplay"
      :disabled="isFixed"
    )
    base-text-input.base-text-input--small(
      v-if="value.settings === 'custom' && value.bandwidthLimits"
      type="number"
      :value="value.bandwidthLimits.limitDown"
      @input="onLimitInput('limitDown', $event)"
      :placeholder="$t('v2.merakiTemplates.limitDownKb')"
      :disabled="isFixed"
    )
    base-text-input.base-text-input--small(
      v-if="value.settings === 'custom' && value.bandwidthLimits"
      type="number"
      :value="value.bandwidthLimits.limitUp"
      @input="onLimitInput('limitUp', $event)"
      :placeholder="$t('v2.merakiTemplates.limitUpKb')"
      :disabled="isFixed"
    )
</template>

<script>
import BaseSelect from '@/components/v2/base-select/base-select'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'

export default {
  name: 'traffic-shaping-bandwidth-limit-cell',
  components: { BaseTextInput, BaseSelect },
  props: {
    value: {
      required: true
    },
    item: {
      type: Object
    },
    editable: {
      type: Boolean,
      default: false
    },
    showValidationState: {
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
      ]
    }
  },
  methods: {
    onSettingsInput (value) {
      if (value === 'custom') {
        this.$emit('input', {
          settings: value,
          bandwidthLimits: {
            limitUp: null,
            limitDown: null
          }
        })
      } else {
        this.$emit('input', {
          settings: value
        })
      }
    },
    onLimitInput (field, value) {
      this.$emit('input', {
        ...this.value,
        bandwidthLimits: {
          ...this.value.bandwidthLimits,
          [field]: parseInt(value)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

  .traffic-shaping-bandwidth-limit-cell {
    .base-select {
      display: inline-block;
      width: 190px;
      margin-right: 5px;
    }

    .base-text-input {
      display: inline-block;
      width: 80px;

      &:not(:last-child) {
        margin-right: 5px;
      }
    }
  }

</style>
