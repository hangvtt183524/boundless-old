<template lang="pug">
  .traffic-shaping-definitions-cell
    multi-text-input.multi-text-input--small(
      v-show="applicationCategoryOptions.length > 0"
      :value="selectedItems"
      :items="applicationCategoryOptions"
      @input="onInput"
      :item-formatter="definitionItemFormatter"
      :placeholder="$t('v2.merakiTemplates.trafficShapingRuleDefinitionPlaceholder')"
      :validations="definitionValidations"
      :show-validation-state="showValidationState"
      :suppress-validation-state-display="suppressValidationStateDisplay"
      :disabled="isFixed"
    )
</template>

<script>
import MultiTextInput from '@/components/v2/multi-text-input/multi-text-input'
import { mapGetters } from 'vuex'
import { isValidPort, isValidCidrWithPort, isValidHostname } from '@/utils/form-fields-validation-rules'

export default {
  name: 'traffic-shaping-bandwidth-limit-cell',
  components: { MultiTextInput },
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
      definitionValidations: {
        required: true,
        methods: [
          {
            method: function (value) {
              return isValidPort(value) || isValidCidrWithPort(value) || isValidHostname(value)
            },
            message: this.$t('v2.merakiTemplates.invalidTrafficShapingDefinitionError')
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters('workspace/network', ['trafficShapingApplicationCategories']),
    applicationCategoryOptions: function () {
      return this.trafficShapingApplicationCategories.map(category => {
        return {
          key: category.id,
          name: category.name,
          children: [
            {
              key: category.id,
              name: `All ${category.name}`
            },
            ...category.applications.map(application => {
              return {
                key: application.id,
                name: application.name
              }
            })
          ]
        }
      })
    },
    allApplications () {
      let allApplications = []
      this.trafficShapingApplicationCategories.forEach(category => {
        allApplications = allApplications.concat(category.applications)
      })

      return allApplications
    },
    selectedItems () {
      // Convert value which is a complex of objects, to a flat list
      return this.value.map(selection => {
        if (selection.type === 'application' || selection.type === 'applicationCategory') {
          return selection.value.id
        }

        return selection.value
      })
    }
  },
  methods: {
    getSelectionType (selection) {
      if (/meraki:layer7\/category\/\d+/.test(selection)) {
        return 'applicationCategory'
      }

      if (/meraki:layer7\/application\/\d+/.test(selection)) {
        return 'application'
      }

      if (isValidCidrWithPort(selection)) {
        return 'ipRange'
      }

      if (isValidPort(selection)) {
        return 'port'
      }

      if (isValidHostname(selection)) {
        return 'host'
      }

      return ''
    },
    onInput (value) {
      const selections = []
      value.forEach(selection => {
        const selectionType = this.getSelectionType(selection)
        if (selectionType === 'applicationCategory') {
          const categoryName = this.trafficShapingApplicationCategories.filter(category => {
            return category.id === selection
          })[0].name

          selections.push({
            type: 'applicationCategory',
            value: {
              id: selection,
              name: categoryName
            }
          })
        } else if (selectionType === 'application') {
          const applicationName = this.allApplications.filter(application => {
            return application.id === selection
          })[0].name

          selections.push({
            type: 'application',
            value: {
              id: selection,
              name: applicationName
            }
          })
        } else {
          selections.push({
            type: selectionType,
            value: selection
          })
        }
      })

      this.$emit('input', selections)
    },
    definitionItemFormatter (value) {
      const selectionType = this.getSelectionType(value)
      const definitionTypeDisplayValue = this.$t(`v2.merakiTemplates.trafficShapingRuleTypes.${selectionType}`)

      return `${definitionTypeDisplayValue}: ${value}`
    }
  }
}
</script>

<style lang="scss" scoped>

  .traffic-shaping-definitions-cell {

  }

</style>
