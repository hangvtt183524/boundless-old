<template lang="pug">
  template-setting-item.vlans(
    :title="$t('v2.merakiTemplates.vlans')"
    :deploy-strategy-selector-enabled="isTemplateMode"
    :deploy-strategy-value="deployStrategyValue"
    :operation-mode="operationMode"
    @deployStrategyInput="$emit('deployStrategyInput', field_key, $event)"
    :is-empty="isEmpty"
    :customizations="customizations"
    :setting-fields="[field_key, state_field_key]"
    customizations-enabled
    @customizationsClick="$emit('customizationsClick', $event)"
  )
    template(v-slot:default)
      v-layout(
        v-show="isFieldVisible(state_field_key)"
        row wrap
      ).template-setting-item__content__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.enableVlans') }}
        v-flex(xs6 md4 lg3 xl2)
          base-switch(
            :value="stateSettingValue.vlansEnabled"
            @input="onStateFieldInput('vlansEnabled', $event)"
            :disabled="isFixed"
            clearable
          )

      v-layout(row wrap).template-setting-item__content__row(
        v-show="isFieldVisible(field_key) && (!isTemplateMode || stateSettingValue.vlansEnabled === true)"
      )
        v-flex(xs12 xl10)
          base-table(
            :items="tableItems"
            :headers="tableHeaders"
            :actions="tableActions"
            @actionClick="onTableActionClick"
            @itemInput="onTableItemInput"
            @itemFocus="onTableItemFocus"
            :always-editable="true"
            :index-keyed="true"
            :show-field-validation-state="showFieldValidationState"
            :suppress-field-validation-state-display="isEmpty"
            :is-fixed="isFixed"
          )
          span.vlans__add-chart-item-trigger(
            v-if="!isFixed"
            @click="onAddSubnetClick"
          ) + {{ $t('general.addNew') }}

</template>

<script>
import TemplateSettingItem from './template-setting-item'
import NetworkTemplateSettingItemMixin from '@/mixins/network-template-setting-item.mixin'
import BaseTable from '@/components/v2/base-table/base-table'
import BaseSwitch from '@/components/v2/base-switch/base-switch'
import { isValidCidr, isValidIpAddress, isValidNonNegativeInteger } from '@/utils/form-fields-validation-rules'
import { ipAddressMask, subnetMask } from '@/constants/input-masks'
import { VLAN_INPUT_PROPS } from '@/constants/form-fields'
import _ from 'lodash'

export default {
  name: 'vlans',
  mixins: [
    NetworkTemplateSettingItemMixin
  ],
  components: { BaseTable, BaseSwitch, TemplateSettingItem },
  data: function () {
    return {
      field_key: 'vlans',
      state_field_key: 'vlans_state',
      tableActions: [
        {
          icon: '$vuetify.icons.delete',
          type: 'remove'
        }
      ],
      computeCounter: 0,
      suggestionFields: ['subnet', 'name', 'applianceIp']
    }
  },
  computed: {
    tableHeaders () {
      return [
        {
          text: this.$t('v2.merakiTemplates.subnet'),
          value: 'subnet',
          editable: true,
          width: '150px',
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
          text: this.$t('general.id'),
          value: 'id',
          width: '100px',
          editable: true,
          validations: {
            required: true,
            methods: [{
              method: isValidNonNegativeInteger
            }]
          },
          placeholder: this.$t('v2.placeholders.vlanIdWithLimits'),
          componentProps: {
            ...VLAN_INPUT_PROPS,
            title: this.$t('v2.placeholders.vlanIdWithLimits')
          }
        },
        {
          text: this.$t('general.name'),
          value: 'name',
          editable: true,
          width: '150px',
          validations: {
            required: true
          },
          placeholder: this.$t('v2.merakiTemplates.vlanNamePlaceholder'),
          componentProps: {
            suggestions: this.getFieldSuggestions(this.field_key, 'name')
          }
        },
        {
          text: this.$t('v2.merakiTemplates.mxIp'),
          value: 'applianceIp',
          editable: true,
          width: '150px',
          validations: {
            required: true,
            methods: [{
              method: isValidIpAddress
            }]
          },
          placeholder: this.$t('v2.placeholders.ipAddressInSubnet'),
          componentProps: {
            mask: ipAddressMask,
            title: this.$t('v2.placeholders.ipAddressInSubnet'),
            suggestions: this.getFieldSuggestions(this.field_key, 'applianceIp')
          }
        }
      ]
    },
    stateSettingValue () {
      return this.value[this.state_field_key] || this.stateNonConfiguredValue
    },
    stateNonConfiguredValue () {
      return {}
    },
    tableItems () {
      // eslint-disable-next-line no-unused-expressions
      this.computeCounter

      return !this.isEmpty ? this.settingValue : [this.getEmptyTableItem()]
    }
  },
  watch: {
    stateSettingValue: {
      handler: function (newValue) {
        // If current setting value changes to empty value, re-emit non-configured value for the setting
        if (!_.isEqual(newValue, this.stateNonConfiguredValue) && this.isSettingEmpty(newValue)) {
          this.$emit('settingInput', this.state_field_key, this.stateNonConfiguredValue)
        }
      },
      deep: true
    }
  },
  methods: {
    getEmptyTableItem () {
      return {
        id: null,
        subnet: null,
        name: null,
        applianceIp: null
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
    onStateFieldInput (field, value) {
      this.$emit('settingInput', this.state_field_key, {
        ...this.stateSettingValue,
        [field]: value
      })
    },
    onTableItemInput (tableItem, field, value) {
      // If inputted a value for placeholder item, add it to the list of items first
      if (this.isEmpty) {
        this.addTableItems([{ ...tableItem, [field]: value }])
      } else {
        this.$emit('itemInput', tableItem, field, value)
      }
    },
    onAddSubnetClick () {
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

  .vlans {
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
