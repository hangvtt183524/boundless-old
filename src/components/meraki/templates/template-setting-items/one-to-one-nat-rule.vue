<template lang="pug">
  .one-to-one-nat-rule
    v-layout(row wrap).one-to-one-nat-rule__row(
      v-if="operationMode === operationModes.template"
    )
      v-flex(xs6 md4 lg3 xl2)
        label {{ $t('general.name') }}
      v-flex(xs6 md4 lg3 xl2)
        base-text-input(
          :value="value.name"
          @input="onFieldInput('name', $event)"
          :placeholder="$t('v2.merakiTemplates.ruleNamePlaceholder')"
          :validations="{required: true}"
          :show-validation-state="showFieldValidationState"
          :suppress-validation-state-display="suppressValidationStateDisplay"
          :disabled="isFixed"
          @focus="fetchFieldSuggestions(field_key, 'name')"
          :suggestions="getFieldSuggestions(field_key, 'name')"
        )

    v-layout(row wrap).one-to-one-nat-rule__row
      v-flex(xs6 md4 lg3 xl2)
        label {{ $t('v2.merakiTemplates.publicIp') }}
      v-flex(xs6 md4 lg3 xl2)
        base-text-input(
          :value="value.publicIp"
          @input="onFieldInput('publicIp', $event)"
          :placeholder="$t('v2.placeholders.ipAddressWithExample').replace('{example}', '11.11.11.11')"
          :title="$t('v2.placeholders.ipAddressWithExample').replace('{example}', '11.11.11.11')"
          :validations="ipAddressFieldValidations"
          :show-validation-state="showFieldValidationState"
          :suppress-validation-state-display="suppressValidationStateDisplay"
          :mask="ipAddressMask"
          :disabled="isFixed"
          @focus="fetchFieldSuggestions(field_key, 'publicIp')"
          :suggestions="getFieldSuggestions(field_key, 'publicIp')"
        )

    v-layout(row wrap).one-to-one-nat-rule__row
      v-flex(xs6 md4 lg3 xl2)
        label {{ $t('v2.merakiTemplates.lanIp') }}
      v-flex(xs6 md4 lg3 xl2)
        base-text-input(
          :value="value.lanIp"
          @input="onFieldInput('lanIp', $event)"
          :placeholder="$t('v2.placeholders.ipAddressWithExample').replace('{example}', '192.168.1.1')"
          :title="$t('v2.placeholders.ipAddressWithExample').replace('{example}', '192.168.1.1')"
          :validations="ipAddressFieldValidations"
          :show-validation-state="showFieldValidationState"
          :suppress-validation-state-display="suppressValidationStateDisplay"
          :mask="ipAddressMask"
          :disabled="isFixed"
          @focus="fetchFieldSuggestions(field_key, 'lanIp')"
          :suggestions="getFieldSuggestions(field_key, 'lanIp')"
        )

    v-layout(row wrap).one-to-one-nat-rule__row
      v-flex(xs6 md4 lg3 xl2)
        label {{ $t('v2.merakiTemplates.allowedConnections') }}
      v-flex(xs6 md8 lg9 xl8)
        base-table(
          :items="allowedConnectionTableItems"
          :headers="allowedConnectionTableHeaders"
          :actions="allowedConnectionTableActions"
          @actionClick="onAllowedConnectionActionClick"
          @itemInput="onAllowedConnectionItemInput"
          @itemFocus="onTableItemFocus(...arguments, 'allowedInbound')"
          :always-editable="true"
          :show-field-validation-state="showFieldValidationState"
          :suppress-field-validation-state-display="isTableEmpty"
          :is-fixed="isFixed"
          index-keyed
        )
        span.one-to-one-nat-rule__add-chart-item-trigger(
          v-if="!isFixed"
          @click="onAddChartItemClick"
        ) + {{ $t('general.addNew') }}

    .one-to-one-nat-rule__actions(
      v-if="!isFixed"
    )
      v-icon.one-to-one-nat-rule__actions__action(
        @click="onDeleteRuleClick"
      ) $vuetify.icons.delete
      v-icon.one-to-one-nat-rule__actions__action.drag-handle(
        v-if="operationMode === operationModes.template"
      ) drag_handle

</template>

<script>
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import BaseTable from '@/components/v2/base-table/base-table'
import { isValidIpAddress, isValidPort } from '@/utils/form-fields-validation-rules'
import { ipAddressMask } from '@/constants/input-masks'
import NetworkSettingOperationModeMixin from '@/mixins/network-setting-operation-mode.mixin'
import NetworkTemplateSettingFieldSuggestionsMixin from '@/mixins/network-template-setting-field-suggestions.mixin'
import _ from 'lodash'

export default {
  name: 'one-to-one-nat-rule',
  components: { BaseTable, BaseTextInput },
  mixins: [ NetworkSettingOperationModeMixin, NetworkTemplateSettingFieldSuggestionsMixin ],
  props: {
    value: {
      required: true
    },
    showFieldValidationState: {
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
      allowedConnectionTableActions: [
        {
          icon: '$vuetify.icons.delete',
          type: 'remove'
        }
      ],
      ipAddressFieldValidations: {
        required: true,
        methods: [
          {
            method: isValidIpAddress
          }
        ]
      },
      computeCounter: 0,
      ipAddressMask: ipAddressMask,
      suggestionFields: ['allowedInbound__destinationPorts', 'allowedInbound__allowedIps']
    }
  },
  computed: {
    field_key () {
      return 'mx_1_to_1_nat_rules'
    },
    allowedConnectionTableHeaders () {
      return [
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
            },
            {
              key: 'icmp',
              name: this.$t('wifi.icmp')
            },
            {
              key: 'any',
              name: this.$t('wifi.any')
            }
          ],
          caseInsensitiveKeys: true,
          validations: {
            required: true
          }
        },
        {
          text: this.$t('v2.merakiTemplates.ports'),
          value: 'destinationPorts',
          editable: true,
          width: '200px',
          type: Array,
          placeholder: this.$t('v2.placeholders.separateByCommas'),
          validations: {
            required: true,
            methods: [
              {
                method: isValidPort,
                message: this.$t('v2.merakiTemplates.nonPortAddError')
              }
            ]
          },
          componentProps: {
            items: this.getFieldSuggestions(this.field_key, 'allowedInbound__destinationPorts')
              ? this.getFieldSuggestions(this.field_key, 'allowedInbound__destinationPorts').map(item => { return { key: item, name: item } })
              : null
          }
        },
        {
          text: this.$t('v2.merakiTemplates.remoteIps'),
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
            items: this.getFieldSuggestions(this.field_key, 'allowedInbound__destinationPorts')
              ? this.getFieldSuggestions(this.field_key, 'allowedInbound__destinationPorts').map(item => { return { key: item, name: item } })
              : null
          }
        }
      ]
    },
    isTableEmpty () {
      return _.isNil(this.value.allowedInbound) || _.isEmpty(this.value.allowedInbound)
    },
    allowedConnectionTableItems () {
      // eslint-disable-next-line no-unused-expressions
      this.computeCounter

      return !this.isTableEmpty ? this.value.allowedInbound : [this.getEmptyTableItem()]
    }
  },
  methods: {
    getEmptyTableItem () {
      return {
        protocol: null,
        destinationPorts: [],
        allowedIps: []
      }
    },
    addTableItems (tableItems) {
      this.$emit('itemInput', this.value, 'allowedInbound', [
        ...(this.value.allowedInbound ? this.value.allowedInbound : []),
        ...tableItems
      ])
    },
    onFieldInput (field, value) {
      this.$emit('itemInput', this.value, field, value)
    },
    onAllowedConnectionActionClick (action, tableItem) {
      if (action === 'remove') {
        if (this.isTableEmpty) {
          this.computeCounter += 1 // Force re-compute of table items so that row re-renders
          return
        }

        const itemIndex = this.value.allowedInbound.indexOf(tableItem)
        this.$emit('input', {
          ...this.value,
          allowedInbound: this.value.allowedInbound.filter((item, index) => {
            return index !== itemIndex
          })
        })
      }
    },
    onAllowedConnectionItemInput (tableItem, field, value) {
      // If inputted a value for placeholder item, add it to the list of items first
      if (this.isTableEmpty) {
        this.addTableItems([{ ...tableItem, [field]: value }])
      } else {
        this.$emit('itemInput', tableItem, field, value)
      }
    },
    onAddChartItemClick () {
      const tableItems = [this.getEmptyTableItem()]
      if (this.isTableEmpty) {
        // Do twice if the list is already empty, as one item is displayed as placeholder already
        tableItems.push(this.getEmptyTableItem())
      }

      this.addTableItems(tableItems)
    },
    onDeleteRuleClick () {
      this.$emit('deleteClick')
    }
  }
}
</script>

<style scoped lang="scss">
  @import "styles/v2/colors.scss";

  .one-to-one-nat-rule {
    position: relative;

    &__row {
      margin-top: 10px;
    }

    label {
      line-height: 40px;
    }

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

    &__actions {
      position: absolute;
      right: 10px;
      top: 10px;

      &__action {
        font-size: 16px;
        vertical-align: middle;
        margin-left: 10px;
        cursor: pointer;
      }
    }
  }

</style>
