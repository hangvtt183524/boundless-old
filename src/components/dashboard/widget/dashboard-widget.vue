<template lang="pug">
  .dashboard-widget
    .dashboard-widget__header
      .dashboard-widget__header__title
        | {{ $t(`v2.dashboard.entities.${entity.key}`) }}

      .dashboard-widget__header__operation-selection(
        v-if="operationOptions.length > 1"
      )
        .dashboard-widget__header__separator
        base-select(
          v-model="selectedOperation"
          :items="operationOptions"
        )

      .dashboard-widget__header__parent-selections(
        v-if="pathParameters.length > 0"
      )
        .dashboard-widget__header__separator
        .dashboard-widget__header__parent-selections__selection(
          v-for="pathParameter of pathParameters"
          :key="pathParameter.name"
        )
          base-select(
            v-model="pathParameterSelections[pathParameter.name].value"
            :items="pathParameterSelections[pathParameter.name].options"
            :placeholder="getParameterDisplayName(pathParameter)"
            @input="onPathParameterSelect(pathParameter)"
            :disabled="operationMode === operationModes.configuration"
          )

      .dashboard-widget__header__actions
        base-button.base-button--green.dashboard-widget__header__actions__action(
          v-if="operationMode === operationModes.regular"
          @click="onSubmitClick"
          :disabled="!(isValid && (isValueChanged || isValueEmpty))"
        ) {{ $t('general.submit') }}
        base-button.base-button--green--negative.dashboard-widget__header__actions__action(
          v-if="operationMode === operationModes.regular"
          @click="onResetClick"
          :disabled="!isValueChanged"
        ) {{ $t('builder.reset') }}
        base-button.base-button--blue.dashboard-widget__header__actions__action(
          v-if="operationMode === operationModes.configuration"
          @click="onUpdateClick"
        ) {{ $t('general.update') }}
        base-button.base-button--danger.dashboard-widget__header__actions__action(
          v-if="operationMode === operationModes.configuration"
          @click="onRemoveClick"
        ) {{ $t('general.remove') }}

    .dashboard-widget__content
      dashboard-widget-parameters(
        v-if="selectedOperationItem && selectedOperationItem.request"
        v-model="model"
        :parameters="bodyParameters"
        :fields="selectedWidgetOperationItem.fields"
        :disabled="hasMissingPathParameters || operationMode === operationModes.configuration"
      )

    .dashboard-widget__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )

</template>

<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import BaseSelect from '@/components/v2/base-select/base-select'
import DashboardWidgetParameters from './dashboard-widget-parameters'
import DashboardWidgetParameterMixin from '@/mixins/dashboard-widget-parameter.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

export default {
  name: 'dashboard-widget',
  components: {
    DashboardWidgetParameters,
    BaseButton,
    BaseSelect
  },
  mixins: [
    DashboardWidgetParameterMixin,
    CurrentNodeSelectionsMixin
  ],
  props: {
    widget: {
      type: Object,
      required: true
    },
    entity: {
      type: Object,
      required: true
    },
    dashboardId: {
      type: Number,
      required: true
    },
    operationMode: {
      type: String,
      default: 'regular'
    },
    selectedOrganizationId: {
      type: Number,
      required: false
    }
  },
  data: function () {
    return {
      model: {},
      originalModel: {},
      loading: false,
      operationModes: {
        regular: 'regular',
        configuration: 'configuration'
      },
      selectedOperation: null,
      pathParameterSelections: {},
      vendorApiErrorKey: 'widget_vendor_api_error'
    }
  },
  mounted () {
    this.$set(this, 'selectedOperation', this.enabledOperations[0].id)
  },
  computed: {
    ...mapGetters('workspace/network', ['dashboardParameterOptions']),
    isValid () {
      return !this.hasMissingPathParameters
    },
    isValueChanged () {
      return !_.isEqual(this.model, this.originalModel)
    },
    isValueEmpty () {
      return _.isEmpty(this.model) && _.isEmpty(this.originalModel)
    },
    enabledOperations () {
      const widgetOperationIds = this.widget.operations.map(widgetOperation => widgetOperation.operation)
      return this.entity.api_operations.filter(operation => widgetOperationIds.indexOf(operation.id) > -1)
    },
    operationOptions () {
      return this.enabledOperations.map(operation => {
        return {
          key: operation.id,
          name: this.$t(`v2.dashboard.operations.${operation.key}`)
        }
      })
    },
    selectedOperationItem () {
      return this.enabledOperations.find(operation => operation.id === this.selectedOperation)
    },
    selectedWidgetOperationItem () {
      return this.widget.operations.find(widgetOperation => widgetOperation.operation === this.selectedOperation)
    },
    pathParameters () {
      if (!this.selectedOperationItem || !this.selectedOperationItem.request) {
        return []
      }

      return this.selectedOperationItem.request.parameters.filter(
        parameter => (parameter.location === this.parameterLocations.path && parameter.name !== this.pathParameterNames.organization)
      )
    },
    bodyParameters () {
      if (!this.selectedOperationItem || !this.selectedOperationItem.request) {
        return []
      }

      return this.selectedOperationItem.request.parameters.filter(
        parameter => parameter.location === this.parameterLocations.body
      )
    },
    activeOrganization () {
      return this.selectedOrganizationId
    },
    effectiveModel () {
      return this.getEffectiveModel(this.model)
    },
    updatedModel () {
      const updatedModel = {}

      let parameters = this.bodyParameters
      while (parameters.length === 1 && parameters[0].type === this.parameterTypes.object) {
        updatedModel[parameters[0].name] = {}
        parameters = parameters[0].children
      }

      const effectiveOriginalModel = this.getEffectiveModel(this.originalModel)
      const effectiveUpdatedModel = this.getEffectiveModel(updatedModel)

      // Build model with only updated properties
      Object.keys(this.effectiveModel).forEach(modelKey => {
        if (!_.isEqual(this.effectiveModel[modelKey], effectiveOriginalModel[modelKey])) {
          effectiveUpdatedModel[modelKey] = this.effectiveModel[modelKey]
        }
      })

      return updatedModel
    },
    hasMissingPathParameters () {
      return Object.keys(this.pathParameterSelections).filter(pathParameter => {
        return this.pathParameterSelections[pathParameter].value === null
      }).length > 0
    }
  },
  watch: {
    selectedOperation: {
      handler: function () {
        // Clear path parameters on operation change
        if (this.activeOrganization && this.selectedOperation) {
          this.resetPathParameterSelections()
        }

        // Set model on operation change
        if (this.selectedOperation) {
          this.buildModel(this.bodyParameters)
          this.$set(this, 'originalModel', JSON.parse(JSON.stringify(this.model)))
        }

        // If all required parameters are set, fetch widget data
        if (this.selectedOperation &&
          this.selectedOperationItem.key === this.operationKeys.update &&
          !this.hasMissingPathParameters) {
          this.getWidgetOperationData()
        }
      }
    },
    activeOrganization: {
      handler: function (newValue, oldValue) {
        // Clear path parameters on organization change
        if (this.activeOrganization && this.selectedOperation) {
          this.resetPathParameterSelections()
        }

        // Reset model on operation change
        if (newValue && oldValue && (newValue !== oldValue)) {
          if (this.selectedOperation) {
            this.buildModel(this.bodyParameters)
            this.$set(this, 'originalModel', JSON.parse(JSON.stringify(this.model)))
          }
        }
      }
    },
    dashboardParameterOptions: {
      handler: function () {
        if (this.pathParameters.length === 0 || this.widget.has_target_restrictions) {
          // We don't use generic parameter options if widget has target restrictions
          return
        }

        const rootParameter = this.pathParameters[0]
        const rootParameterOptions = this.dashboardParameterOptions.find(
          option => option.name === rootParameter.name && option.organization === this.activeOrganization
        )
        if (rootParameterOptions && rootParameterOptions.status === 'loaded') {
          this.pathParameterSelections[rootParameter.name].options = rootParameterOptions.options
        }
      },
      deep: true
    },
    pathParameterSelections: {
      handler: function () {
        // If all required parameters are set, fetch widget data
        if (this.selectedOperation &&
          this.selectedOperationItem.key === this.operationKeys.update &&
          !this.hasMissingPathParameters) {
          this.getWidgetOperationData()
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('workspace/network', ['fetchDashboardParameterOptions', 'getUserDashboardWidgetData',
      'performUserDashboardWidgetOperation']),
    buildModel (parameters, model = null) {
      if (model === null) {
        // Initial call, initialize model, and skip container parameters if any
        this.model = {}
        model = this.model

        // Skip container parameters
        while (parameters.length === 1 && parameters[0].type === this.parameterTypes.object) {
          this.$set(model, parameters[0].name, {})

          model = model[parameters[0].name]
          parameters = parameters[0].children
        }
      }

      // Build model with operation body parameters
      parameters.forEach(parameter => {
        if (this.selectedWidgetOperationItem.fields &&
          this.selectedWidgetOperationItem.fields.length > 0 &&
          this.selectedWidgetOperationItem.fields.indexOf(parameter.id) === -1) {
          // Skip field
          return
        }

        if (parameter.type === this.parameterTypes.array) {
          this.$set(model, parameter.name, [])
        } else if (parameter.type === this.parameterTypes.object) {
          // We go 1 level deeper
          this.$set(model, parameter.name, {})
          this.buildModel(parameter.children, model[parameter.name])
        } else {
          this.$set(model, parameter.name, null)
        }
      })
    },
    getEffectiveModel (model) {
      // In case of parameters put under a single dictionary key, returns a model containing individual parameters
      let effectiveModel = model
      let modelKeys = Object.keys(effectiveModel)

      while (modelKeys.length === 1 && effectiveModel[modelKeys[0]] !== null && effectiveModel[modelKeys[0]].constructor === Object) {
        effectiveModel = effectiveModel[modelKeys[0]]
        modelKeys = Object.keys(effectiveModel)
      }

      return effectiveModel
    },
    getWidgetOperationData () {
      if (this.operationMode === this.operationModes.configuration) {
        // No need to load widget data on configuration mode
        return
      }

      const filters = {
        workspaceId: this.workspaceId,
        id: this.dashboardId,
        widgetId: this.widget.id,
        operationId: this.selectedOperation
      }

      this.pathParameters.forEach(parameter => {
        filters[parameter.name] = this.pathParameterSelections[parameter.name].value
      })

      // Send organization with request
      filters['organization'] = this.activeOrganization

      this.loading = true
      this.getUserDashboardWidgetData(filters).then(response => {
        // Re-build model
        this.buildModel(this.bodyParameters)

        // Update model with returned data
        Object.keys(this.effectiveModel).forEach(key => {
          if (response.data.data.hasOwnProperty(key)) {
            this.$set(this.effectiveModel, key, response.data.data[key])
          }
        })
        this.$set(this, 'originalModel', JSON.parse(JSON.stringify(this.model)))
      }).finally(() => {
        this.loading = false
      })
    },
    loadPathParameterOptions (pathParameter) {
      if (this.operationMode === this.operationModes.configuration) {
        // No need to load parameter options on configuration mode
        return
      }

      const filters = {
        workspaceId: this.workspaceId,
        id: this.dashboardId,
        isRootParameter: !this.widget.has_target_restrictions && this.pathParameterSelections[pathParameter.name].isRoot,
        widgetId: this.widget.id,
        operationId: this.selectedOperation,
        parameter: pathParameter.name
      }

      // Set parent parameters
      for (let i = 0; i < this.pathParameters.length; i++) {
        if (this.pathParameters[i].name === pathParameter.name) {
          break
        }

        filters[this.pathParameters[i].name] = this.pathParameterSelections[this.pathParameters[i].name].value
      }

      // Send organization with request
      filters['organization'] = this.activeOrganization

      this.fetchDashboardParameterOptions(filters).then(response => {
        this.$set(this.pathParameterSelections[pathParameter.name], 'options', response.data.data)
      })
    },
    resetPathParameterSelections () {
      const pathParameterSelections = {}
      this.pathParameters.forEach((parameter, index) => {
        const parameterOptions = this.dashboardParameterOptions.find(
          option => option.name === parameter.name && option.organization === this.activeOrganization && option.status === 'loaded'
        )

        pathParameterSelections[parameter.name] = {
          options: (index === 0 && !!parameterOptions && !this.widget.has_target_restrictions) ? parameterOptions.options : [],
          value: null,
          isRoot: index === 0 // First element is root, others are bound to it
        }
      })

      this.$set(this, 'pathParameterSelections', pathParameterSelections)

      // Fetch options for root parameter, if not fetched or being fetched
      if (this.pathParameters.length) {
        const existingOptions = this.dashboardParameterOptions.find(
          option => option.name === this.pathParameters[0].name && option.organization === this.activeOrganization
        )
        if (this.widget.has_target_restrictions || !existingOptions || existingOptions.status === 'failed') {
          this.loadPathParameterOptions(this.pathParameters[0])
        }
      }
    },
    clearPathParameterSelections (parameter) {
      // Clear selections for a parameter and load options
      const parameterSelection = this.pathParameterSelections[parameter.name]
      this.$set(parameterSelection, 'options', [])
      this.$set(parameterSelection, 'value', null)

      // Re-load parameter options for current parent selections
      this.loadPathParameterOptions(parameter)
    },
    onPathParameterSelect (pathParameter) {
      // On path parameter select, if parameter has a child parameter, load its options
      const parameterIndex = this.pathParameters.indexOf(pathParameter)
      const childParameter = this.pathParameters[parameterIndex + 1]

      if (childParameter) {
        this.clearPathParameterSelections(childParameter)
      }
    },
    onSubmitClick () {
      const data = {
        workspaceId: this.workspaceId,
        id: this.dashboardId,
        widgetId: this.widget.id,
        operationId: this.selectedOperation,
        filters: {},
        data: this.updatedModel // Only send the fields that have been changed
      }

      this.pathParameters.forEach(parameter => {
        data.filters[parameter.name] = this.pathParameterSelections[parameter.name].value
      })

      // Send organization with request
      data.filters['organization'] = this.activeOrganization

      this.loading = true
      this.performUserDashboardWidgetOperation(data).then(response => {
        this.$set(this, 'originalModel', JSON.parse(JSON.stringify(this.model)))

        global.toastr['success'](this.$t('v2.dashboard.operationPerformSuccess'), this.$t('general.success'))
      }).catch(err => {
        const error = err.response.data.error
        const vendorApiErrors = error.messages
          ? error.messages.filter(errorMessage => errorMessage.code === this.vendorApiErrorKey) : null

        if (vendorApiErrors && vendorApiErrors.length > 0) {
          // Directly display texts for error messages returned form external APIs
          vendorApiErrors.forEach(errorMessage => {
            global.toastr['error'](errorMessage.message, this.$t('general.error'))
          })
        } else {
          // Display generic error message
          global.toastr['error'](this.$t('v2.dashboard.operationPerformFailure'), this.$t('general.error'))
        }
      }).finally(() => {
        this.loading = false
      })
    },
    onResetClick () {
      this.$set(this, 'model', JSON.parse(JSON.stringify(this.originalModel)))
    },
    onUpdateClick () {
      this.$emit('updateClick')
    },
    onRemoveClick () {
      this.$emit('removeClick')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .dashboard-widget {
    width: 100%;
    padding: 10px;
    position: relative;

    &__header {
      height: 60px;
      line-height: 60px;
      border-bottom: 1px solid $gray-medium;
      margin-bottom: 20px;

      &__title {
        float: left;
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 18px;
        letter-spacing: 1px;
        color: $text-medium;
      }

      &__operation-selection {
        float: left;
        overflow: hidden;

        .base-select {
          float: left;
          width: 160px;
        }
      }

      &__parent-selections {
        float: left;
        overflow: hidden;

        &__selection {
          float: left;
          width: 160px;
        }

        &__selection:not(:last-child) {
          margin-right: 10px;
        }
      }

      &__actions {
        float: right;

        .base-button {
          margin-top: 10px;
          margin-left: 10px;
          padding: 0 20px;
        }
      }

      &__separator {
        float: left;
        height: 40px;
        margin-top: 10px;
        margin-left: 30px;
        padding-left: 30px;
        border-left: 1px solid $gray-medium;
      }
    }

    &__content {

    }

    &__loading-indicator {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(255, 255, 255, 0.6);
    }
  }
</style>
