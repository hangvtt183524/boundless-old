<template lang="pug">
  base-modal(
    class="dashboard-widget-configuration-modal"
    :show="show"
    @close="close"
    max-width="720px"
  )
    template(v-slot:header)
      div.dashboard-widget-configuration-modal__header
        v-layout(row wrap)
          v-flex(xs12)
            div.dashboard-widget-configuration-modal__title
              | {{ $t(`v2.dashboard.entities.${entity.key}`) }}

    template(v-slot:default)
      div.dashboard-widget-configuration-modal__content
        v-layout.dashboard-widget-configuration-modal__content__row(
          v-if="operationOptions.length > 1"
          row wrap
        )
          v-flex(xs6 md4 lg3)
            label {{ $t(`v2.dashboard.operationText`) }}
          v-flex(xs6 md8 lg9)
            base-multi-select(
              :value="selectedOperations"
              :items="operationOptions"
              @input="onOperationsInput"
            )

        v-layout.dashboard-widget-configuration-modal__content__row(
          v-if="fieldSelectableOperations.length > 0"
          row wrap
        )
          v-flex(xs6 md4 lg3)
            label {{ $t(`v2.dashboard.manageableFields`) }}
          v-flex(xs6 md8 lg9)
            base-multi-select(
              v-for="operation of fieldSelectableOperations"
              :value="getSelectedFields(operation)"
              :items="getFieldOptions(operation)"
              @input="onFieldsInput(operation, ...arguments)"
              :label="fieldSelectableOperations.length > 1 ? $t(`v2.dashboard.operations.${getAPIOperationById(operation).key}`) : null"
            )

        v-layout.dashboard-widget-configuration-modal__content__row(row wrap)
          v-flex(xs6 md4 lg3)
            label {{ $t('v2.dashboard.targetsOptional') }}
          v-flex(xs6 md8 lg9)
            meraki-workspace-target-selection(
              v-model="widget.targets"
              :target-types="['network_base', 'device', 'tag']"
              :placeholder="$t(`v2.dashboard.targetSelectionPlaceholder`)"
              :full-access-label="$t(`v2.dashboard.allOrganizationTargets`)"
              :full-width="true"
              :key="renderCounter"
            )

    template(v-slot:footer)
      div.dashboard-widget-configuration-modal__footer
        v-layout(row wrap)
          v-flex(xs12)
            base-button(
              class="base-button--green"
              @click="onSaveClick"
              :disabled="!(isValid && isValueChanged)"
            ) {{ isExistingWidget ? $t('general.update') : $t('general.add') }}
            base-button(
              class="base-button--green--negative"
              @click="close"
            ) {{ $t('general.cancel') }}

</template>

<script>
import BaseModal from '@/components/v2/base-modal/base-modal.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import BaseMultiSelect from '@/components/v2/base-multi-select/base-multi-select'
import _ from 'lodash'
import MerakiWorkspaceTargetSelection from '../meraki/common/target-selection/meraki-workspace-target-selection'

export default {
  components: {
    MerakiWorkspaceTargetSelection,
    BaseModal,
    BaseButton,
    BaseMultiSelect
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    entity: {
      required: true
    },
    widgetData: {
      required: false
    }
  },
  data () {
    return {
      widget: {},
      originalWidget: {},
      parameterTypes: {
        object: 'object'
      },
      parameterLocations: {
        body: 'body',
        path: 'path',
        query: 'query'
      },
      allFieldsOption: {
        key: 0,
        name: this.$t('v2.dashboard.allFields')
      },
      renderCounter: 0
    }
  },
  mounted () {
    this.resetForm()
  },
  computed: {
    isExistingWidget () {
      return !!this.widgetData
    },
    isValid () {
      return this.widget.operations.length > 0
    },
    isValueChanged () {
      return !this.isExistingWidget || !_.isEqual(this.widget, this.originalWidget)
    },
    operationOptions () {
      return this.entity.api_operations.map(operation => {
        return {
          key: operation.id,
          name: this.$t(`v2.dashboard.operations.${operation.key}`)
        }
      })
    },
    selectedOperations () {
      return this.widget.operations.map(widgetOperation => widgetOperation.operation)
    },
    fieldSelectableOperations () {
      return this.selectedOperations.filter(operationId => {
        const operationObject = this.getAPIOperationById(operationId)

        let parameters = operationObject.request ? operationObject.request.parameters.filter(
          parameter => parameter.location === this.parameterLocations.body
        ) : []
        while (parameters.length === 1 && parameters[0].type === this.parameterTypes.object) {
          parameters = parameters[0].children
        }

        return parameters.length > 1
      })
    }
  },
  watch: {
    show (v) {
      if (v === true) {
        this.resetForm()
      }
    }
  },
  methods: {
    close (isSaved) {
      this.$emit('close', isSaved ? this.widget : null)
    },
    resetForm () {
      if (this.isExistingWidget) {
        this.$set(this, 'widget', JSON.parse(JSON.stringify(this.widgetData)))
      } else {
        this.$set(this, 'widget', {
          entity: this.entity.id,
          operations: this.entity.api_operations.map(apiOperation => {
            return {
              operation: apiOperation.id,
              fields: []
            }
          }),
          targets: []
        })
      }

      this.$set(this, 'originalWidget', JSON.parse(JSON.stringify(this.widget)))

      this.renderCounter += 1
    },
    getParameterDisplayName (parameter) {
      if (this.$te(`v2.dashboard.parameters.${parameter.name}`)) {
        return this.$t(`v2.dashboard.parameters.${parameter.name}`)
      }

      // Directly use parameter name if not translation exists
      return parameter.name
    },
    getAPIOperationById (operationId) {
      return this.entity.api_operations.find(apiOperation => apiOperation.id === operationId)
    },
    getWidgetOperationById (operationId) {
      return this.widget.operations.find(widgetOperation => widgetOperation.operation === operationId)
    },
    onOperationsInput (value) {
      // Already existing operations, excluding newly removed ones
      const existingOperations = this.widget.operations.filter(widgetOperation => value.indexOf(widgetOperation.operation) > -1)

      // Newly added operations
      const newOperations = value.filter(operationId => !this.widget.operations.find(widgetOperation => widgetOperation.operation === operationId))

      this.$set(this.widget, 'operations', existingOperations.concat(newOperations.map(operationId => {
        return {
          operation: operationId,
          fields: []
        }
      })))
    },
    getSelectedFields (operation) {
      const widgetOperation = this.getWidgetOperationById(operation)
      return (widgetOperation.fields && widgetOperation.fields.length > 0) ? widgetOperation.fields : [this.allFieldsOption.key]
    },
    getFieldOptions (operation) {
      const operationObject = this.getAPIOperationById(operation)

      let parameters = operationObject.request
        ? operationObject.request.parameters.filter(parameter => parameter.location === this.parameterLocations.body) : []
      while (parameters.length === 1 && parameters[0].type === this.parameterTypes.object) {
        parameters = parameters[0].children
      }

      return [this.allFieldsOption].concat(parameters.map(parameter => {
        return {
          key: parameter.id,
          name: this.getParameterDisplayName(parameter)
        }
      }))
    },
    onFieldsInput (operation, value) {
      const widgetOperation = this.getWidgetOperationById(operation)
      const oldValue = this.getSelectedFields(operation)

      const addedItem = value.filter(field => !oldValue.includes(field))[0]

      let effectiveValue = value
      if (addedItem !== undefined) {
        if (addedItem === this.allFieldsOption.key) {
          effectiveValue = []
        } else {
          effectiveValue = value.filter(field => field !== this.allFieldsOption.key)
        }
      }

      this.$set(widgetOperation, 'fields', effectiveValue)
    },
    onSaveClick () {
      this.close(true)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .dashboard-widget-configuration-modal {
    position: relative;

    &__header {
      padding-bottom: 30px;
    }

    &__title {
      font-family: Fira Sans;
      font-style: normal;
      font-weight: 600;
      font-size: 21px;
      line-height: 25px;
      color: $blue-dark;
    }

    &__content {
      margin-top: 16px;
      padding-bottom: 60px;

      &__row {
        margin-bottom: 10px;
      }

      label {
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 41px;
        color: $text-medium;
      }
    }

    &__footer {
      margin-top: 30px;

      .base-button {
        margin-right: 24px;
      }
    }
  }

</style>
