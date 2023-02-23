<template lang="pug">
  template-setting-item.switch-acl-rules(
    :title="$t('v2.merakiTemplates.qualityOfService')"
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
            @itemReOrder="onTableItemReorder"
            @itemFocus="onTableItemFocus"
            :show-indices="true"
            :draggable="true"
            :sortable="false"
            :always-editable="true"
            :show-field-validation-state="showFieldValidationState"
            :suppress-field-validation-state-display="isEmpty"
            :is-fixed="isFixed"
            :generate-keys="true"
          )
          span.switch-acl-rules__add-chart-item-trigger(
            v-if="!isFixed"
            @click="onAddRuleClick"
          ) + {{ $t('general.addNew') }}

</template>

<script>
import TemplateSettingItem from './template-setting-item'
import NetworkTemplateSettingItemMixin from '@/mixins/network-template-setting-item.mixin'
import BaseTable from '@/components/v2/base-table/base-table'
import _ from 'lodash'
import { isValidPort, isValidVlan } from '@/utils/form-fields-validation-rules'
import { VLAN_INPUT_PROPS, PORT_INPUT_PROPS } from '@/constants/form-fields'
import { getEmptySwitchQOSRule } from './factories'

export default {
  name: 'switch-acl-rules',
  mixins: [
    NetworkTemplateSettingItemMixin
  ],
  components: { BaseTable, TemplateSettingItem },
  data: function () {
    return {
      field_key: 'switch_qos_rules',
      tableActions: [
        {
          icon: '$vuetify.icons.delete',
          type: 'remove'
        }
      ],
      computeCounter: 0,
      suggestionFields: ['vlan', 'srcPort', 'dstPort']
    }
  },
  computed: {
    tableHeaders () {
      return [
        {
          text: this.$t('v2.merakiTemplates.vlan'),
          value: 'vlan',
          width: '80px',
          editable: true,
          placeholder: this.$t('v2.merakiTemplates.leaveBlankForAny'),
          validations: {
            required: false,
            methods: [{
              method: function (value) {
                return isValidVlan(value) || value.toLowerCase() === 'any'
              }
            }]
          },
          componentProps: {
            ...VLAN_INPUT_PROPS,
            suggestions: this.getFieldSuggestions(this.field_key, 'vlan')
          }
        },
        {
          text: this.$t('wifi.protocol'),
          value: 'protocol',
          width: '100px',
          editable: true,
          options: [
            {
              key: 'TCP',
              name: this.$t('wifi.tcp')
            },
            {
              key: 'UDP',
              name: this.$t('wifi.udp')
            },
            {
              key: 'ANY',
              name: this.$t('wifi.any')
            }
          ],
          caseInsensitiveKeys: true,
          validations: {
            required: true
          }
        },
        {
          text: this.$t('wifi.sourcePort'),
          value: 'srcPort',
          width: '80px',
          editable: true,
          placeholder: this.$t('v2.placeholders.portNumber'),
          componentProps: {
            ...PORT_INPUT_PROPS,
            title: this.$t('v2.placeholders.portNumber'),
            suggestions: this.getFieldSuggestions(this.field_key, 'srcPort')
          },
          validations: {
            required: true,
            methods: [{
              method: function (value) {
                return isValidPort(value) || value.toLowerCase() === 'any'
              }
            }]
          }
        },
        {
          text: this.$t('v2.merakiTemplates.destinationPort'),
          value: 'dstPort',
          width: '80px',
          editable: true,
          placeholder: this.$t('v2.placeholders.portNumber'),
          componentProps: {
            ...PORT_INPUT_PROPS,
            title: this.$t('v2.placeholders.portNumber'),
            suggestions: this.getFieldSuggestions(this.field_key, 'dstPort')
          },
          validations: {
            required: true,
            methods: [{
              method: function (value) {
                return isValidPort(value) || value.toLowerCase() === 'any'
              }
            }]
          }
        },
        {
          text: this.$t('v2.merakiTemplates.dscp'),
          value: 'dscp',
          width: '200px',
          editable: true,
          options: [
            {
              key: -1,
              name: this.$t('v2.merakiTemplates.trustIncomingDscp')
            },
            {
              key: 0,
              name: this.$t('v2.merakiTemplates.dscpClass0')
            },
            {
              key: 10,
              name: this.$t('v2.merakiTemplates.dscpClass0Af11')
            },
            {
              key: 26,
              name: this.$t('v2.merakiTemplates.dscpClass2Af31')
            },
            {
              key: 34,
              name: this.$t('v2.merakiTemplates.dscpClass3Af41')
            },
            {
              key: 46,
              name: this.$t('v2.merakiTemplates.dscpClass3Ef')
            }
          ],
          caseInsensitiveKeys: true,
          validations: {
            required: true
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
      return getEmptySwitchQOSRule()
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
      // Convert empty values to null before emitting
      value = value || null

      // If inputted a value for placeholder item, add it to the list of items first
      if (this.isEmpty) {
        tableItem[field] = value
        this.addTableItems([tableItem])
      } else {
        this.$emit('itemInput', tableItem, field, value)
      }
    },
    onTableItemReorder (oldIndex, newIndex) {
      // Create a shallow clone of rules array first
      let rules = _.clone(this.settingValue)

      // Now move the items in this array
      const movedItem = rules.splice(oldIndex, 1)[0]
      rules.splice(newIndex, 0, movedItem)

      this.$emit('settingInput', this.field_key, rules)
    },
    onAddRuleClick () {
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

  .switch-acl-rules {
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
