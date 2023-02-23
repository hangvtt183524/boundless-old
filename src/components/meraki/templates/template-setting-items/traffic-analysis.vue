<template lang="pug">
  template-setting-item.trafic-analysis(
    :title="$t('v2.merakiTemplates.trafficAnalysis')"
    :operation-mode="operationMode"
    :customizations="customizations"
    :setting-fields="[field_key]"
    customizations-enabled
    @customizationsClick="$emit('customizationsClick', $event)"
  )
    template(v-slot:default)
      v-layout(row wrap).template-setting-item__content__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.mode') }}
        v-flex(xs6 md4 lg3 xl2)
          base-select(
            :items="modes"
            :value="settingValue.mode"
            @input="onModeInput"
            :validations="{required: true}"
            :show-validation-state="showFieldValidationState"
            :suppress-validation-state-display="isEmpty"
            :disabled="isFixed"
            clearable
          )

      v-layout(
        row wrap
        v-show="settingValue.mode !== 'disabled'"
      ).template-setting-item__content__row
        v-flex(xs12)
          label {{ $t('v2.merakiTemplates.customPieChart') }}
        v-flex(xs12 xl10)
          base-table(
            :items="pieChartTableItems"
            :headers="pieChartTableHeaders"
            :actions="pieChartTableActions"
            @actionClick="onPieChartActionClick"
            @itemInput="onPieChartItemInput"
            @itemReOrder="onPieChartItemReorder"
            @itemFocus="onTableItemFocus(...arguments, 'customPieChartItems')"
            :show-indices="true"
            :draggable="true"
            :sortable="false"
            :always-editable="true"
            :show-field-validation-state="showFieldValidationState"
            :suppress-field-validation-state-display="isTableEmpty"
            :is-fixed="isFixed"
            :generate-keys="true"
          )
          span.trafic-analysis__add-chart-item-trigger(
            v-if="!isFixed"
            @click="onAddChartItemClick"
          ) + {{ $t('general.addNew') }}

</template>

<script>
import _ from 'lodash'
import TemplateSettingItem from './template-setting-item'
import NetworkTemplateSettingItemMixin from '@/mixins/network-template-setting-item.mixin'
import BaseSelect from '@/components/v2/base-select/base-select'
import BaseTable from '@/components/v2/base-table/base-table'
import { isValidPort, isValidCidrWithPort, isValidHostname } from '@/utils/form-fields-validation-rules'

export default {
  name: 'traffic-analysis',
  mixins: [
    NetworkTemplateSettingItemMixin
  ],
  components: { BaseTable, BaseSelect, TemplateSettingItem },
  data: function () {
    return {
      field_key: 'traffic_analysis_settings',
      modes: [
        {
          key: 'disabled',
          name: this.$t('general.disabled')
        },
        {
          key: 'basic',
          name: this.$t('monitoring.basic')
        },
        {
          key: 'detailed',
          name: this.$t('v2.merakiTemplates.detailed')
        }
      ],
      pieChartTableActions: [
        {
          icon: '$vuetify.icons.delete',
          type: 'remove'
        }
      ],
      computeCounter: 0,
      suggestionFields: ['customPieChartItems__name']
    }
  },
  computed: {
    pieChartTableHeaders () {
      return [
        {
          text: this.$t('general.name'),
          value: 'name',
          editable: true,
          validations: {
            required: true
          },
          placeholder: this.$t('v2.merakiTemplates.pieChartNamePlaceholder'),
          componentProps: {
            suggestions: this.getFieldSuggestions(this.field_key, 'customPieChartItems__name')
          }
        },
        {
          text: this.$t('wifi.type'),
          value: 'type',
          editable: true,
          width: '150px',
          options: [
            {
              key: 'port',
              name: this.$t('wifi.port')
            },
            {
              key: 'host',
              name: this.$t('wifi.hostname')
            },
            {
              key: 'ipRange',
              name: this.$t('wifi.ipRange')
            }
          ],
          validations: {
            required: true
          }
        },
        {
          text: this.$t('v2.merakiTemplates.value'),
          value: 'value',
          editable: true,
          placeholder: (item) => {
            if (item.type === 'port') {
              return this.$t('v2.placeholders.portNumberWithExample').replace('{example}', '25, 443')
            } else if (item.type === 'host') {
              return this.$t('v2.placeholders.hostnameWithExample').replace('{example}', 'example.com')
            } else if (item.type === 'ipRange') {
              return this.$t('v2.placeholders.ipRangeWithExample').replace('{example}', '11.11.11.0/24')
            }

            return ''
          },
          validations: {
            required: true,
            methods: [
              {
                method: function (value) {
                  return isValidPort(value) || isValidCidrWithPort(value) || isValidHostname(value)
                }
              }
            ]
          }
        }
      ]
    },
    isTableEmpty () {
      return _.isNil(this.settingValue.customPieChartItems) || _.isEmpty(this.settingValue.customPieChartItems)
    },
    pieChartTableItems () {
      // eslint-disable-next-line no-unused-expressions
      this.computeCounter

      return !this.isTableEmpty ? this.settingValue.customPieChartItems : [this.getEmptyTableItem()]
    },
    emptyValue () {
      return {
        mode: null,
        customPieChartItems: []
      }
    },
    nonConfiguredValue () {
      return {}
    }
  },
  methods: {
    getEmptyTableItem () {
      return {
        name: null,
        type: null,
        value: null
      }
    },
    addTableItems (tableItems) {
      this.$emit('settingInput', this.field_key, {
        ...this.effectiveValue,
        customPieChartItems: [
          ...(this.effectiveValue.customPieChartItems ? this.effectiveValue.customPieChartItems : []),
          ...tableItems
        ]
      })
    },
    onModeInput (mode) {
      this.$emit('settingInput', this.field_key, {
        ...this.effectiveValue,
        mode: mode
      })
    },
    onPieChartActionClick (action, pieChartItem) {
      if (action === 'remove') {
        if (this.isTableEmpty) {
          this.computeCounter += 1 // Force re-compute of table items so that row re-renders
          return
        }

        const itemIndex = this.effectiveValue.customPieChartItems.indexOf(pieChartItem)
        this.$emit('settingInput', this.field_key, {
          ...this.effectiveValue,
          customPieChartItems: this.effectiveValue.customPieChartItems.filter((item, index) => {
            return index !== itemIndex
          })
        })
      }
    },
    onPieChartItemInput (tableItem, field, value) {
      // If inputted a value for placeholder item, add it to the list of items first
      if (this.isTableEmpty) {
        tableItem[field] = value
        this.addTableItems([tableItem])
      } else {
        this.$emit('itemInput', tableItem, field, value)
      }

      /* TODO: As this method creates a new "item", it is re-rendered after input, and text inputs lose focus after
       *   entering a single character. Above solution fixes this, but is not neat as requires the parent component to
       *   handle field-level inputs. Try to think of a better solution here, by just using "input" event
      const itemIndex = this.value.customPieChartItems.indexOf(pieChartItem)
      this.$emit('input', {
        ...this.value,
        customPieChartItems: this.value.customPieChartItems.map((item, index) => {
          if (index === itemIndex) {
            return {
              ...item,
              [field]: value
            }
          }

          return item
        })
      })
      */
    },
    onPieChartItemReorder (oldIndex, newIndex) {
      // Create a shallow clone of customPieChartItems array first
      let customPieChartItems = _.clone(this.effectiveValue.customPieChartItems)

      // Now move the items in this array
      const movedItem = customPieChartItems.splice(oldIndex, 1)[0]
      customPieChartItems.splice(newIndex, 0, movedItem)

      this.$emit('settingInput', this.field_key, {
        ...this.effectiveValue,
        customPieChartItems: customPieChartItems
      })
    },
    onAddChartItemClick () {
      const tableItems = [this.getEmptyTableItem()]
      if (this.isEmpty) {
        // Do twice if the list is already empty, as one item is displayed as placeholder already
        tableItems.push(this.getEmptyTableItem())
      }

      this.addTableItems(tableItems)
    }
  }
}
</script>

<style scoped lang="scss">
  @import "styles/v2/colors.scss";

  .trafic-analysis {
    .base-table {
      height: auto;
    }

    &__add-chart-item-trigger {
      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 15px;
      line-height: 35px;
      text-decoration-line: underline;
      color: $green-medium;
      cursor: pointer;
    }
  }

</style>
