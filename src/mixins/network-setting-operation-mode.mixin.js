// Mixin providing common functionality for operation mode

export default {
  props: {
    operationMode: {
      type: String,
      default: 'template'
    }
  },
  data: function () {
    return {
      operationModes: {
        template: 'template',
        compliance: 'compliance',
        customization: 'customization'
      }
    }
  },
  computed: {
    isTemplateMode () {
      return this.operationMode === this.operationModes.template
    },
    isComplianceMode () {
      return this.operationMode === this.operationModes.compliance
    },
    isCustomizationMode () {
      return this.operationMode === this.operationModes.customization
    }
  }
}
