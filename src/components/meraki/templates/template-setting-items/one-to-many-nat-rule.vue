<template lang="pug">
  .one-to-many-nat-rule
    v-layout(row wrap).one-to-many-nat-rule__row
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

    v-layout(row wrap).one-to-many-nat-rule__row
      v-flex(xs6 md4 lg3 xl2)
        label {{ $t('v2.merakiTemplates.uplink') }}
      v-flex(xs6 md4 lg3 xl2)
        base-select(
          :items="uplinkOptions"
          :value="value.uplink"
          @input="onFieldInput('uplink', $event)"
          :validations="{required: true}"
          :show-validation-state="showFieldValidationState"
          :suppress-validation-state-display="suppressValidationStateDisplay"
          :disabled="isFixed"
          clearable
        )

    v-layout(row wrap).one-to-many-nat-rule__row
      v-flex(xs6 md4 lg3 xl2)
        label {{ $t('v2.merakiTemplates.rules') }}
      v-flex(xs6 md8 lg9 xl10)
        base-table(
          :items="portRulesTableItems"
          :headers="portRulesTableHeaders"
          :actions="portRulesTableActions"
          @actionClick="onPortRulesActionClick"
          @itemInput="onPortRulesItemInput"
          @itemFocus="onTableItemFocus(...arguments, 'portRules')"
          :always-editable="true"
          :show-field-validation-state="showFieldValidationState"
          :suppress-field-validation-state-display="isTableEmpty"
          :is-fixed="isFixed"
          index-keyed
        )
        span.one-to-many-nat-rule__add-chart-item-trigger(
          v-if="!isFixed"
          @click="onAddChartItemClick"
        ) + {{ $t('general.addNew') }}

    .one-to-many-nat-rule__actions(
      v-if="!isFixed"
    )
      v-icon.one-to-many-nat-rule__actions__action(
        @click="onDeleteRuleClick"
      ) $vuetify.icons.delete

</template>

<script>
import _ from 'lodash'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import BaseTable from '@/components/v2/base-table/base-table'
import BaseSelect from '@/components/v2/base-select/base-select'
import { isValidIpAddress, isValidPort } from '@/utils/form-fields-validation-rules'
import { ipAddressMask } from '@/constants/input-masks'
import NetworkSettingOperationModeMixin from '@/mixins/network-setting-operation-mode.mixin'
import NetworkTemplateSettingFieldSuggestionsMixin from '@/mixins/network-template-setting-field-suggestions.mixin'
import { PORT_INPUT_PROPS } from '@/constants/form-fields'

export default {
  name: 'one-to-many-nat-rule',
  components: { BaseSelect, BaseTable, BaseTextInput },
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
      uplinkOptions: [
        {
          key: 'internet1',
          name: this.$t('v2.merakiTemplates.internet1')
        },
        {
          key: 'internet2',
          name: this.$t('v2.merakiTemplates.internet2')
        }
      ],
      portRulesTableActions: [
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
      suggestionFields: ['portRules__publicPort', 'portRules__localIp', 'portRules__localPort', 'portRules__name', 'portRules__allowedIps']
    }
  },
  computed: {
    field_key () {
      return 'mx_1_to_many_nat_rules'
    },
    isTableEmpty () {
      return _.isNil(this.value.portRules) || _.isEmpty(this.value.portRules)
    },
    portRulesTableItems () {
      // eslint-disable-next-line no-unused-expressions
      this.computeCounter

      return !this.isTableEmpty ? this.value.portRules : [this.getEmptyTableItem()]
    },
    portRulesTableHeaders () {
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
            suggestions: this.getFieldSuggestions(this.field_key, 'portRules__name')
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
          componentProps: {
            ...PORT_INPUT_PROPS,
            suggestions: this.getFieldSuggestions(this.field_key, 'portRules__publicPort')
          },
          validations: {
            required: true,
            methods: [{
              method: isValidPort
            }]
          }
        },
        {
          text: this.$t('v2.merakiTemplates.lanIp'),
          value: 'localIp',
          editable: true,
          width: '160px',
          validations: {
            required: true,
            methods: [{
              method: isValidIpAddress
            }]
          },
          componentProps: {
            mask: ipAddressMask,
            suggestions: this.getFieldSuggestions(this.field_key, 'portRules__localIp')
          }
        },
        {
          text: this.$t('v2.merakiTemplates.localPort'),
          value: 'localPort',
          width: '80px',
          editable: true,
          componentProps: {
            ...PORT_INPUT_PROPS,
            suggestions: this.getFieldSuggestions(this.field_key, 'portRules__localPort')
          },
          validations: {
            required: true,
            methods: [{
              method: isValidPort
            }]
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
            items: this.getFieldSuggestions(this.field_key, 'portRules__allowedIps')
              ? this.getFieldSuggestions(this.field_key, 'portRules__allowedIps').map(item => { return { key: item, name: item } })
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
        protocol: null,
        publicPort: '',
        lanIp: '',
        localPort: '',
        allowedIps: []
      }
    },
    addTableItems (tableItems) {
      this.$emit('itemInput', this.value, 'portRules', [
        ...(this.value.portRules ? this.value.portRules : []),
        ...tableItems
      ])
    },
    onFieldInput (field, value) {
      this.$emit('itemInput', this.value, field, value)
    },
    onPortRulesActionClick (action, tableItem) {
      if (action === 'remove') {
        if (this.isTableEmpty) {
          this.computeCounter += 1 // Force re-compute of table items so that row re-renders
          return
        }

        const itemIndex = this.value.portRules.indexOf(tableItem)
        this.$emit('input', {
          ...this.value,
          portRules: this.value.portRules.filter((item, index) => {
            return index !== itemIndex
          })
        })
      }
    },
    onPortRulesItemInput (tableItem, field, value) {
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

  .one-to-many-nat-rule {
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
