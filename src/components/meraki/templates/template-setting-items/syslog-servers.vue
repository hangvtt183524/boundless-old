<template lang="pug">
  template-setting-item.syslog-servers(
    :title="$t('v2.merakiTemplates.syslogServers')"
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
          span.syslog-servers__add-chart-item-trigger(
            v-if="!isFixed"
            @click="onAddServerClick"
          ) + {{ $t('general.addNew') }}

</template>

<script>
import TemplateSettingItem from './template-setting-item'
import NetworkTemplateSettingItemMixin from '@/mixins/network-template-setting-item.mixin'
import BaseTable from '@/components/v2/base-table/base-table'
import { isValidPort, isValidIpAddress } from '@/utils/form-fields-validation-rules'
import { PORT_INPUT_PROPS } from '@/constants/form-fields'
import { ipAddressMask } from '@/constants/input-masks'

export default {
  name: 'syslog-servers',
  mixins: [
    NetworkTemplateSettingItemMixin
  ],
  components: { BaseTable, TemplateSettingItem },
  data: function () {
    return {
      field_key: 'syslog_servers',
      tableActions: [
        {
          icon: '$vuetify.icons.delete',
          type: 'remove'
        }
      ],
      computeCounter: 0,
      suggestionFields: ['host', 'port']
    }
  },
  computed: {
    tableHeaders () {
      return [
        {
          text: this.$t('v2.merakiTemplates.serverIp'),
          value: 'host',
          editable: true,
          validations: {
            required: true,
            methods: [{
              method: isValidIpAddress
            }]
          },
          placeholder: this.$t('v2.placeholders.ipAddressWithExample').replace('{example}', '11.11.11.11'),
          componentProps: {
            title: this.$t('v2.placeholders.ipAddressWithExample').replace('{example}', '11.11.11.11'),
            mask: ipAddressMask,
            suggestions: this.getFieldSuggestions(this.field_key, 'host')
          }
        },
        {
          text: this.$t('wifi.port'),
          value: 'port',
          editable: true,
          validations: {
            required: true,
            methods: [{
              method: isValidPort
            }]
          },
          placeholder: this.$t('v2.placeholders.portNumberWithExample').replace('{example}', '514'),
          componentProps: {
            title: this.$t('v2.placeholders.portNumberWithExample').replace('{example}', '514'),
            suggestions: this.getFieldSuggestions(this.field_key, 'port'),
            ...PORT_INPUT_PROPS
          }
        },
        {
          text: this.$t('v2.merakiTemplates.roles'),
          value: 'roles',
          editable: true,
          type: Array,
          width: '300px',
          options: ['Wireless event log', 'Appliance event log', 'Switch event log',
            'Air Marshal events', 'Flows', 'URLs', 'IDS alerts', 'Security events'].map(option => {
            return {
              key: option,
              name: option
            }
          }),
          validations: {
            required: true
          }
        }
      ]
    },
    tableItems () {
      // eslint-disable-next-line no-unused-expressions
      this.computeCounter

      return !this.isEmpty > 0 ? this.settingValue : [this.getEmptyTableItem()]
    }
  },
  methods: {
    getEmptyTableItem () {
      return {
        host: null,
        port: null,
        roles: []
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
    onAddServerClick () {
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

  .syslog-servers {
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
