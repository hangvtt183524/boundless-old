<template lang="pug">
  template-setting-item.mx-port-forwarding-rules(
    :title="$t('v2.merakiTemplates.portForwardingRules')"
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
            :sortable="false"
            :show-field-validation-state="showFieldValidationState"
            :suppress-field-validation-state-display="isEmpty"
            :is-fixed="isFixed"
            index-keyed
          )
          span.mx-port-forwarding-rules__add-chart-item-trigger(
            v-if="!isFixed"
            @click="onAddRuleClick"
          ) + {{ $t('general.addNew') }}

</template>

<script>
import TemplateSettingItem from './template-setting-item'
import NetworkTemplateSettingItemMixin from '@/mixins/network-template-setting-item.mixin'
import BaseTable from '@/components/v2/base-table/base-table'
import { isValidPort, isValidPortRange, isValidIpAddress } from '@/utils/form-fields-validation-rules'
import { ipAddressMask } from '@/constants/input-masks'

export default {
  name: 'mx-port-forwarding-rules',
  mixins: [
    NetworkTemplateSettingItemMixin
  ],
  components: { BaseTable, TemplateSettingItem },
  data: function () {
    return {
      field_key: 'mx_port_forwarding_rules',
      tableActions: [
        {
          icon: '$vuetify.icons.delete',
          type: 'remove'
        }
      ],
      computeCounter: 0,
      suggestionFields: ['name', 'publicPort', 'lanIp', 'localPort', 'allowedIps']
    }
  },
  computed: {
    tableItems () {
      // eslint-disable-next-line no-unused-expressions
      this.computeCounter

      return !this.isEmpty ? this.settingValue : [this.getEmptyTableItem()]
    },
    tableHeaders () {
      const headers = [
        {
          text: this.$t('general.description'),
          value: 'name',
          editable: true,
          width: '100px',
          validations: {
            required: true
          },
          componentProps: {
            suggestions: this.getFieldSuggestions(this.field_key, 'name')
          }
        },
        {
          text: this.$t('v2.merakiTemplates.uplink'),
          value: 'uplink',
          width: '120px',
          editable: true,
          options: [
            {
              key: 'internet1',
              name: this.$t('v2.merakiTemplates.internet1')
            },
            {
              key: 'internet2',
              name: this.$t('v2.merakiTemplates.internet2')
            },
            {
              key: 'both',
              name: this.$t('v2.merakiTemplates.both')
            }
          ],
          validations: {
            required: true
          }
        },
        {
          text: this.$t('wifi.protocol'),
          value: 'protocol',
          width: '100px',
          editable: true,
          options: [
            {
              key: 'tcp',
              name: this.$t('wifi.tcp')
            },
            {
              key: 'udp',
              name: this.$t('wifi.udp')
            }
          ],
          validations: {
            required: true
          }
        },
        {
          text: this.$t('v2.merakiTemplates.publicPort'),
          value: 'publicPort',
          width: '80px',
          editable: true,
          placeholder: this.$t('v2.placeholders.portNumber'),
          componentProps: {
            title: this.$t('v2.placeholders.portNumber'),
            suggestions: this.getFieldSuggestions(this.field_key, 'publicPort')
          },
          validations: {
            required: true,
            methods: [{
              method: (value) => {
                return isValidPort(value) || isValidPortRange(value)
              }
            }]
          }
        },
        {
          text: this.$t('v2.merakiTemplates.lanIp'),
          value: 'lanIp',
          editable: true,
          width: '160px',
          placeholder: this.$t('v2.placeholders.ipAddressWithExample').replace('{example}', '192.168.1.1'),
          componentProps: {
            mask: ipAddressMask,
            title: this.$t('v2.placeholders.ipAddressWithExample').replace('{example}', '192.168.1.1'),
            suggestions: this.getFieldSuggestions(this.field_key, 'lanIp')
          },
          validations: {
            required: true,
            methods: [{
              method: isValidIpAddress
            }]
          }
        },
        {
          text: this.$t('v2.merakiTemplates.localPort'),
          value: 'localPort',
          width: '80px',
          editable: true,
          placeholder: this.$t('v2.placeholders.portNumber'),
          componentProps: {
            title: this.$t('v2.placeholders.portNumber'),
            suggestions: this.getFieldSuggestions(this.field_key, 'localPort')
          },
          validations: {
            required: true,
            methods: [{
              method: (value) => {
                return isValidPort(value) || isValidPortRange(value)
              }
            }]
          }
        },
        {
          text: this.$t('v2.merakiTemplates.allowedRemoteIps'),
          value: 'allowedIps',
          editable: true,
          width: '300px',
          type: Array,
          placeholder: this.$t('v2.placeholders.separateByCommas'),
          validations: {
            required: true,
            methods: [
              {
                method: function (value) {
                  return isValidIpAddress(value) || value.toLowerCase() === 'any'
                },
                message: this.$t('v2.merakiTemplates.nonIpOrAnyAddError')
              }
            ]
          },
          componentProps: {
            items: this.getFieldSuggestions(this.field_key, 'allowedIps')
              ? this.getFieldSuggestions(this.field_key, 'allowedIps').map(item => { return { key: item, name: item } })
              : null
          }
        }
      ]

      if (this.operationMode === this.operationModes.compliance) {
        return headers.filter(header => {
          return header.value !== 'name'
        })
      }

      return headers
    }
  },
  methods: {
    getEmptyTableItem () {
      return {
        name: '',
        uplink: null,
        protocol: null,
        publicPort: null,
        lanIp: null,
        localPort: null,
        allowedIps: []
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

  .mx-port-forwarding-rules {
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
