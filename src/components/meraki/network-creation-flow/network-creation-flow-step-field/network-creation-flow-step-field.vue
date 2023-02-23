<template lang="pug">
  .network-creation-flow-step-field
    base-select(
      v-if="field.input_mode === inputModes.column || (field.input_mode === inputModes.both && inputMode === inputModes.column)"
      :items="columns"
      :value="value"
      @input="onInput($event)"
      :label="fieldLabel"
      :validations="field.is_required ? {required: true} : null"
      :disabled="disabled"
    )
    base-select(
      v-else-if="field.options"
      :items="fieldStaticOptions"
      :value="value"
      @input="onInput($event)"
      :label="fieldLabel"
      :validations="field.is_required ? {required: true} : null"
      :disabled="disabled"
    )
    base-switch(
      v-else-if="field.data_type === dataTypes.boolean"
      :value="getBooleanValue(value)"
      @input="onBooleanInput($event)"
      :label="fieldLabel"
      :disabled="disabled"
    )
    base-text-input(
      v-else
      :value="value"
      @input="onInput($event)"
      :label="fieldLabel"
      :validations="field.is_required ? {required: true} : null"
      :disabled="disabled"
    )
    .network-creation-flow-step-field__mode-switch-trigger(
      v-if="field.input_mode === inputModes.both && !disabled"
      @click="onInputModeSwitchClick"
    )
      | {{ inputMode === inputModes.column ? $t('v2.merakiNetworkCreation.selectFixedValue') : $t('v2.merakiNetworkCreation.selectColumn') }}

</template>

<script>
import BaseSelect from '@/components/v2/base-select/base-select'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import BaseSwitch from '@/components/v2/base-switch/base-switch'

export default {
  name: 'network-creation-flow-step-field',
  components: {
    BaseSelect,
    BaseTextInput,
    BaseSwitch
  },
  props: {
    value: {
      required: true
    },
    field: {
      type: Object,
      required: true
    },
    inputMode: {
      type: String,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      inputModes: {
        column: 'column',
        fixed: 'fixed',
        both: 'both'
      },
      dataTypes: {
        text: 'text',
        number: 'number',
        boolean: 'boolean'
      }
    }
  },
  computed: {
    fieldLabel () {
      return this.$t('v2.merakiNetworkCreation.fields.' + this.field.field_key) + (this.field.is_required ? ' *' : '')
    },
    fieldStaticOptions () {
      return this.field.options ? this.field.options.map(option => {
        return {
          key: option,
          name: option
        }
      }) : []
    }
  },
  methods: {
    onInput (value) {
      this.$emit('input', {
        input_mode: this.inputMode,
        value: value
      })
    },
    getBooleanValue (value) {
      return value === 'True'
    },
    onBooleanInput (value) {
      this.$emit('input', {
        input_mode: this.inputMode,
        value: value ? 'True' : 'False'
      })
    },
    onInputModeSwitchClick () {
      // Alternate input mode
      this.$emit('input', {
        input_mode: this.inputMode === this.inputModes.column ? this.inputModes.fixed : this.inputModes.column,
        value: this.value
      })
    }
  }
}
</script>

<style src="./network-creation-flow-step-field.scss" lang="scss" scoped></style>
