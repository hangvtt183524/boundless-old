// Mixin providing common functionality for network template setting items
import _ from 'lodash'
import { isObjectEmpty } from '@/utils/functions'
import NetworkSettingOperationModeMixin from '@/mixins/network-setting-operation-mode.mixin'
import NetworkTemplateSettingFieldSuggestionsMixin from '@/mixins/network-template-setting-field-suggestions.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

export default {
  mixins: [
    NetworkSettingOperationModeMixin,
    NetworkTemplateSettingFieldSuggestionsMixin,
    CurrentNodeSelectionsMixin
  ],
  props: {
    value: {
      required: true
    },
    originalValue: {
      required: true
    },
    submitted: {
      type: Boolean,
      default: false
    },
    isFixed: {
      type: Boolean,
      default: false
    },
    customizations: {
      type: Array,
      default: () => []
    },
    visibleFields: {
      type: Array,
      required: false
    }
  },
  data: function () {
    return {
      touched: false,
      deployStrategies: {
        extend: 'extend',
        overwrite: 'overwrite'
      }
    }
  },
  computed: {
    settingValue () {
      // TODO: Verify that this does not cause problems on regular template screens. If it does, clear other instances
      //   of this, like stateSettingValue on vlans component
      return this.value[this.field_key] || this.nonConfiguredValue
    },
    isEmpty () {
      return _.isNil(this.settingValue) || _.isEmpty(this.settingValue)
    },
    effectiveValue () {
      // If setting is empty, and an empty value for the setting is defined, return it. Otherwise return actual
      // setting value. We can use this value when a setting field is updated when settings is empty, to emit
      // a value with all necessary fields
      // In customization mode, return an empty array or object, depending on setting's type
      if ((this.isEmpty && !_.isNil(this.emptyValue))) {
        if (this.isCustomizationMode) {
          return this.emptyValue.constructor === Array ? [] : {}
        }

        return this.emptyValue
      }

      return this.settingValue
    },
    showFieldValidationState () {
      return this.submitted && !this.isEmpty
    },
    originalSettingValue () {
      return this.originalValue[this.field_key]
    },
    deployStrategyValue () {
      return (this.value.settings_to_overwrite || []).indexOf(this.field_key) === -1
        ? this.deployStrategies.extend : this.deployStrategies.overwrite
    },
    nonConfiguredValue () {
      // Value of the setting item when no configurations were made to it. To be used on "clear" functionality.
      return null
    }
  },
  watch: {
    settingValue: {
      handler: function (newValue) {
        // If current setting value changes to empty value, re-emit non-configured value for the setting
        if (!_.isEqual(newValue, this.nonConfiguredValue) && this.isSettingEmpty(newValue)) {
          this.$emit('settingInput', this.field_key, this.nonConfiguredValue)
        }
      },
      deep: true
    }
  },
  methods: {
    onBlur: function () {
      this.touched = true
      this.$emit('blur')
    },
    isSettingEmpty (value) {
      return isObjectEmpty(value)
    },
    isFieldVisible (field) {
      return !(this.visibleFields && this.visibleFields.length > 0) || this.visibleFields.includes(field)
    }
  }
}
