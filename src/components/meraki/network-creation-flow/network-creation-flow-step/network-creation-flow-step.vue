<template lang="pug">
  .network-creation-flow-step
    v-layout(row wrap)
      v-flex(xs6 md4 lg3 xl2).network-creation-flow-step__step-selection
        base-select(
          :items="stepOptions"
          :value="value.step"
          @input="onStepInput"
          :label="$t('v2.merakiNetworkCreation.step')"
          :disabled="isFixed || disabled"
        )
      v-flex(xs5 md7 lg8 xl9)
        .network-creation-flow-step__fields(
          v-if="selectedStep"
        )
          v-layout(row wrap)
            v-flex.network-creation-flow-step__fields__field(
              xs12 md6 lg3 xl2
              v-for="field of selectedStep.fields"
              :key="field.id"
            )
              network-creation-flow-step-field(
                :value="getFieldValue(field)"
                @input="onFieldInput($event, field)"
                :field="field"
                :input-mode="getFieldInputMode(field)"
                :columns="columnOptions"
                :disabled="disabled"
              )
      v-flex(xs1).network-creation-flow-step__actions
        v-icon.network-creation-flow-step__actions__action.drag-handle(
          v-if="!(isFixed || disabled)"
        ) drag_handle
        v-icon.network-creation-flow-step__actions__action(
          v-if="!(isFixed || disabled)"
          @click="onRemoveClick"
        ) close

</template>

<script>
import BaseSelect from '@/components/v2/base-select/base-select'
import { mapGetters } from 'vuex'
import NetworkCreationFlowStepField from '../network-creation-flow-step-field/network-creation-flow-step-field'

export default {
  name: 'network-creation-flow-step',
  components: { NetworkCreationFlowStepField, BaseSelect },
  props: {
    value: {
      type: Object,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    isFixed: {
      type: Boolean,
      default: false
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
      }
    }
  },
  computed: {
    ...mapGetters('workspace/network', ['merakiNetworkCreationSteps']),
    stepOptions () {
      return this.merakiNetworkCreationSteps.map(stepData => {
        return {
          name: this.$t('v2.merakiNetworkCreation.steps.' + stepData.key),
          key: stepData.id
        }
      })
    },
    columnOptions () {
      return this.columns.map(column => {
        return {
          name: column,
          key: column
        }
      })
    },
    selectedStep () {
      if (!this.value.step) {
        return null
      }

      return this.merakiNetworkCreationSteps.filter(stepData => {
        return stepData.id === this.value.step
      })[0]
    }
  },
  methods: {
    getSetField (field) {
      return this.value.fields.filter(fieldItem => {
        return fieldItem.field === field.id
      })[0]
    },
    getFieldValue (field) {
      const setField = this.getSetField(field)

      if (setField) {
        return setField.value
      }

      return null
    },
    getFieldInputMode (field) {
      const setField = this.getSetField(field)

      if (setField) {
        return setField.input_mode
      }

      // Default value if field is not set
      return field.input_mode === this.inputModes.fixed ? this.inputModes.fixed : this.inputModes.column
    },
    onStepInput (step) {
      this.$emit('input', {
        ...this.value,
        step: step,
        fields: []
      })
    },
    onFieldInput (value, field) {
      const setField = this.getSetField(field)

      if (setField) {
        this.$emit('input', {
          ...this.value,
          fields: this.value.fields.map(fieldItem => {
            return fieldItem.field === field.id ? {
              field: field.id,
              value: value.value,
              input_mode: value.input_mode
            } : fieldItem
          })
        })
      } else {
        this.$emit('input', {
          ...this.value,
          fields: [
            ...this.value.fields,
            {
              field: field.id,
              value: value.value,
              input_mode: value.input_mode
            }
          ]
        })
      }
    },
    onRemoveClick () {
      this.$emit('removeClick')
    }
  }
}
</script>

<style src="./network-creation-flow-step.scss" lang="scss" scoped></style>
