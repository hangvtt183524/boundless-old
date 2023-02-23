// Mixin providing common functionality for dashboard widget parameters

export default {
  data: function () {
    return {
      parameterLocations: {
        body: 'body',
        path: 'path',
        query: 'query'
      },
      parameterTypes: {
        string: 'string',
        integer: 'integer',
        float: 'float',
        number: 'number',
        boolean: 'boolean',
        array: 'array',
        object: 'object'
      },
      pathParameterNames: {
        organization: 'organizationId', // To-be omitted
        network: 'networkId',
        template: 'configTemplateId',
        device: 'serial',
        ssid: 'number'
      },
      operationKeys: {
        update: 'update',
        create: 'create',
        delete: 'delete'
      },
      actionTypes: {
        add: 'add',
        remove: 'remove'
      }
    }
  },

  methods: {
    buildParameterModel (parameters, model) {
      // Build model with operation body parameters
      parameters.forEach(parameter => {
        if (this.fields && this.fields.length > 0 && this.fields.indexOf(parameter.id) === -1) {
          // Skip field
          return
        }

        if (parameter.type === this.parameterTypes.array) {
          this.$set(model, parameter.name, [])
        } else if (parameter.type === this.parameterTypes.object) {
          // We go 1 level deeper
          this.$set(model, parameter.name, {})
          this.buildParameterModel(parameter.children, model[parameter.name])
        } else {
          this.$set(model, parameter.name, null)
        }
      })
    },
    getParameterDisplayName (parameter) {
      if (this.$te(`v2.dashboard.parameters.${parameter.name}`)) {
        return this.$t(`v2.dashboard.parameters.${parameter.name}`)
      }

      // Directly use parameter name if not translation exists
      return parameter.name
    }
  }
}
