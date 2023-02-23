<template lang="pug">
  template-setting-item.uplink-configuration(
    :title="$t('v2.merakiTemplates.uplinkConfiguration')"
    :operation-mode="operationMode"
    :customizations="customizations"
    :setting-fields="[field_key]"
    customizations-enabled
    @customizationsClick="$emit('customizationsClick', $event)"
  )
    template(v-slot:default)
      v-layout(row wrap).template-setting-item__content__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.wan1') }}
        v-flex(xs6 md4 lg3 xl2)
          base-text-input(
            :value="wan1LimitDown"
            @input="onLimitInput('wan1', 'limitDown', $event, 1000)"
            v-bind="positiveIntegerInputProps"
            :label="$t('v2.merakiTemplates.limitDownMb')"
            :placeholder="$t('v2.placeholders.lowerLimit')"
            :validations="limitFieldValidations"
            :show-validation-state="showFieldValidationState"
            :disabled="isFixed"
          )
          // @focus="fetchFieldSuggestions(field_key, 'bandwidthLimits__wan1__limitDown')"
          // :suggestions="getFieldSuggestions(field_key, 'bandwidthLimits__wan1__limitDown')"
        v-flex(xs6 md4 lg3 xl2)
          base-text-input(
            :value="wan1LimitUp"
            @input="onLimitInput('wan1', 'limitUp', $event, 1000)"
            v-bind="positiveIntegerInputProps"
            :label="$t('v2.merakiTemplates.limitUpMb')"
            :placeholder="$t('v2.placeholders.upperLimit')"
            :validations="limitFieldValidations"
            :show-validation-state="showFieldValidationState"
            :disabled="isFixed"
          )
          // @focus="fetchFieldSuggestions(field_key, 'bandwidthLimits__wan1__limitUp')"
          // :suggestions="getFieldSuggestions(field_key, 'bandwidthLimits__wan1__Up')"

      v-layout(row wrap).template-setting-item__content__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.wan2') }}
        v-flex(xs6 md4 lg3 xl2)
          base-text-input(
            :value="wan2LimitDown"
            @input="onLimitInput('wan2', 'limitDown', $event, 1000)"
            v-bind="positiveIntegerInputProps"
            :label="$t('v2.merakiTemplates.limitDownMb')"
            :placeholder="$t('v2.placeholders.lowerLimit')"
            :validations="limitFieldValidations"
            :show-validation-state="showFieldValidationState"
            :disabled="isFixed"
          )
          // @focus="fetchFieldSuggestions(field_key, 'bandwidthLimits__wan2__limitDown')"
          // :suggestions="getFieldSuggestions(field_key, 'bandwidthLimits__wan2__limitDown')"
        v-flex(xs6 md4 lg3 xl2)
          base-text-input(
            :value="wan2LimitUp"
            @input="onLimitInput('wan2', 'limitUp', $event, 1000)"
            v-bind="positiveIntegerInputProps"
            :label="$t('v2.merakiTemplates.limitUpMb')"
            :placeholder="$t('v2.placeholders.upperLimit')"
            :validations="limitFieldValidations"
            :show-validation-state="showFieldValidationState"
            :disabled="isFixed"
          )
          // @focus="fetchFieldSuggestions(field_key, 'bandwidthLimits__wan2__limitUp')"
          // :suggestions="getFieldSuggestions(field_key, 'bandwidthLimits__wan2__limitUp')"

      v-layout(row wrap).template-setting-item__content__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.cellular') }}
        v-flex(xs6 md4 lg3 xl2)
          base-text-input(
            :value="cellularLimitDown"
            @input="onLimitInput('cellular', 'limitDown', $event)"
            v-bind="positiveIntegerInputProps"
            :label="$t('v2.merakiTemplates.limitDownKb')"
            :placeholder="$t('v2.placeholders.lowerLimit')"
            :validations="limitFieldValidations"
            :show-validation-state="showFieldValidationState"
            :disabled="isFixed"
          )
          // @focus="fetchFieldSuggestions(field_key, 'bandwidthLimits__cellular__limitDown')"
          // :suggestions="getFieldSuggestions(field_key, 'bandwidthLimits__cellular__limitDown')"
        v-flex(xs6 md4 lg3 xl2)
          base-text-input(
            :value="cellularLimitUp"
            @input="onLimitInput('cellular', 'limitUp', $event)"
            v-bind="positiveIntegerInputProps"
            :label="$t('v2.merakiTemplates.limitUpKb')"
            :placeholder="$t('v2.placeholders.upperLimit')"
            :validations="limitFieldValidations"
            :show-validation-state="showFieldValidationState"
            :disabled="isFixed"
          )
          // @focus="fetchFieldSuggestions(field_key, 'bandwidthLimits__cellular__limitDown')"
          // :suggestions="getFieldSuggestions(field_key, 'bandwidthLimits__cellular__limitDown')"

      .template-setting-item__content__row
        .template-setting-item__info
          | * {{ $t('v2.merakiTemplates.unlimited0Info') }}

</template>

<script>
import TemplateSettingItem from './template-setting-item'
import NetworkTemplateSettingItemMixin from '@/mixins/network-template-setting-item.mixin'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import { isValidNonNegativeInteger } from '@/utils/form-fields-validation-rules'
import { POSITIVE_INTEGER_INPUT_PROPS } from '@/constants/form-fields'

export default {
  name: 'uplink-configuration',
  mixins: [
    NetworkTemplateSettingItemMixin
  ],
  components: { BaseTextInput, TemplateSettingItem },
  data: function () {
    return {
      field_key: 'uplink_settings',
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
    wan1LimitDown () {
      return (this.settingValue.bandwidthLimits && this.settingValue.bandwidthLimits.wan1 &&
        this.settingValue.bandwidthLimits.wan1.limitDown !== null)
        ? this.settingValue.bandwidthLimits.wan1.limitDown / 1000 : null
    },
    wan1LimitUp () {
      return (this.settingValue.bandwidthLimits && this.settingValue.bandwidthLimits.wan1 &&
        this.settingValue.bandwidthLimits.wan1.limitUp !== null)
        ? this.settingValue.bandwidthLimits.wan1.limitUp / 1000 : null
    },
    wan2LimitDown () {
      return (this.settingValue.bandwidthLimits && this.settingValue.bandwidthLimits.wan2 &&
        this.settingValue.bandwidthLimits.wan2.limitDown !== null)
        ? this.settingValue.bandwidthLimits.wan2.limitDown / 1000 : null
    },
    wan2LimitUp () {
      return (this.settingValue.bandwidthLimits && this.settingValue.bandwidthLimits.wan2 &&
        this.settingValue.bandwidthLimits.wan2.limitUp !== null)
        ? this.settingValue.bandwidthLimits.wan2.limitUp / 1000 : null
    },
    cellularLimitDown () {
      return (this.settingValue.bandwidthLimits && this.settingValue.bandwidthLimits.cellular &&
        this.settingValue.bandwidthLimits.cellular.limitDown !== null)
        ? this.settingValue.bandwidthLimits.cellular.limitDown : null
    },
    cellularLimitUp () {
      return (this.settingValue.bandwidthLimits && this.settingValue.bandwidthLimits.cellular &&
        this.settingValue.bandwidthLimits.cellular.limitUp !== null)
        ? this.settingValue.bandwidthLimits.cellular.limitUp : null
    },
    nonConfiguredValue () {
      return {}
    }
  },
  methods: {
    getEmptyLimitItem () {
      return {
        limitDown: null,
        limitUp: null
      }
    },
    onLimitInput (limitKey, limitType, value, valueMultiplier) {
      valueMultiplier = valueMultiplier || 1

      const limitEntity = (this.settingValue.bandwidthLimits && this.settingValue.bandwidthLimits.hasOwnProperty(limitKey))
        ? this.settingValue.bandwidthLimits[limitKey] : this.getEmptyLimitItem()

      const updatedEntity = {
        ...limitEntity,
        [limitType]: value ? parseInt(value) * valueMultiplier : null
      }

      if (updatedEntity.limitDown === null && updatedEntity.limitUp === null) {
        // Removing settings
        const bandwidthLimits = {
          ...this.settingValue.bandwidthLimits
        }
        delete bandwidthLimits[limitKey]

        this.$emit('settingInput', this.field_key, {
          bandwidthLimits: bandwidthLimits
        })
      } else {
        this.$emit('settingInput', this.field_key, {
          bandwidthLimits: {
            ...this.settingValue.bandwidthLimits,
            [limitKey]: updatedEntity
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
  @import "styles/v2/colors.scss";

  .uplink-configuration {
    .base-text-input {
      margin-right: 10px;
    }
  }

</style>
