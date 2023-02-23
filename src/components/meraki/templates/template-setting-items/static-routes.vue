<template lang="pug">
  template-setting-item.static-routes(
    :title="$t('v2.merakiTemplates.staticRoutes')"
    :deploy-strategy-selector-enabled="isTemplateMode"
    :deploy-strategy-value="deployStrategyValue"
    :operation-mode="operationMode"
    @deployStrategyInput="$emit('deployStrategyInput', field_key, $event)"
    :is-empty="isEmpty"
    :customizations="customizations"
    :setting-fields="[field_key]"
    customizations-enabled
    @customizationsClick="$emit('customizationsClick', $event)"
  )
    template(v-slot:default)
      v-layout(row wrap).template-setting-item__content__row
        v-flex(xs12 xl10)
          base-table(
            :items="tableItems"
            :headers="tableHeaders"
            :actions="tableActions"
            @actionClick="onTableActionClick"
            @itemInput="onTableItemInput"
            @itemFocus="onTableItemFocus"
            :always-editable="true"
            :show-field-validation-state="showFieldValidationState"
            :suppress-field-validation-state-display="isEmpty"
            :is-fixed="isFixed"
            index-keyed
          )
          span.static-routes__add-chart-item-trigger(
            v-if="!isFixed"
            @click="onAddRouteClick"
          ) + {{ $t('general.addNew') }}

</template>

<script>
import TemplateSettingItem from './template-setting-item'
import NetworkTemplateSettingItemMixin from '@/mixins/network-template-setting-item.mixin'
import BaseTable from '@/components/v2/base-table/base-table'
import { isValidCidr, isValidIpAddress } from '@/utils/form-fields-validation-rules'
import { ipAddressMask, subnetMask } from '@/constants/input-masks'

export default {
  name: 'static-routes',
  mixins: [
    NetworkTemplateSettingItemMixin
  ],
  components: { BaseTable, TemplateSettingItem },
  data: function () {
    return {
      field_key: 'static_routes',
      tableActions: [
        {
          icon: '$vuetify.icons.delete',
          type: 'remove'
        }
      ],
      computeCounter: 0,
      suggestionFields: ['subnet', 'name', 'gatewayIp']
    }
  },
  computed: {
    tableHeaders () {
      return [
        {
          text: this.$t('general.name'),
          value: 'name',
          editable: true,
          validations: {
            required: true
          },
          placeholder: this.$t('v2.merakiTemplates.staticRouteNamePlaceholder'),
          componentProps: {
            suggestions: this.getFieldSuggestions(this.field_key, 'name')
          }
        },
        {
          text: this.$t('v2.merakiTemplates.subnet'),
          value: 'subnet',
          editable: true,
          validations: {
            required: true,
            methods: [{
              method: isValidCidr
            }]
          },
          placeholder: this.$t('v2.placeholders.subnetWithExample').replace('{example}', '192.168.1.0/24'),
          componentProps: {
            mask: subnetMask,
            title: this.$t('v2.placeholders.subnetWithExample').replace('{example}', '192.168.1.0/24'),
            suggestions: this.getFieldSuggestions(this.field_key, 'subnet')
          }
        },
        {
          text: this.$t('v2.merakiTemplates.gatewayIp'),
          value: 'gatewayIp',
          editable: true,
          validations: {
            required: true,
            methods: [{
              method: isValidIpAddress
            }]
          },
          placeholder: this.$t('v2.placeholders.ipAddressInASubnet'),
          componentProps: {
            mask: ipAddressMask,
            title: this.$t('v2.placeholders.ipAddressInASubnet'),
            suggestions: this.getFieldSuggestions(this.field_key, 'gatewayIp')
          }
        }
      ]
    },
    tableItems () {
      // eslint-disable-next-line no-unused-expressions
      this.computeCounter

      return !this.isEmpty ? this.settingValue : [this.getEmptyTableItem()]
    }
  },
  methods: {
    getEmptyTableItem () {
      return {
        name: null,
        subnet: null,
        gatewayIp: null
      }
    },
    addTableItems (tableItems) {
      this.$emit('settingInput', this.field_key, [
        ...(this.settingValue ? this.settingValue : []),
        ...tableItems
      ])
    },
    onTableActionClick (action, tableItem) {
      if (action === 'remove') {
        if (this.isEmpty) {
          this.computeCounter += 1 // Force re-compute of table items so that row re-renders
          return
        }

        const itemIndex = this.settingValue.indexOf(tableItem)
        this.$emit('settingInput', this.field_key, this.settingValue.filter((item, index) => {
          return index !== itemIndex
        }))
      }
    },
    onTableItemInput (tableItem, field, value) {
      // If inputted a value for placeholder item, add it to the list of items first
      if (this.isEmpty) {
        this.addTableItems([{ ...tableItem, [field]: value }])
      } else {
        this.$emit('itemInput', tableItem, field, value)
      }
    },
    onAddRouteClick () {
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

  .static-routes {
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
