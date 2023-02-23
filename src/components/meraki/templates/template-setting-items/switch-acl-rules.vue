<template lang="pug">
  template-setting-item.switch-acl-rules(
    :title="$t('v2.merakiTemplates.aclRules')"
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
import { isValidPort, isValidCidr, isValidVlan } from '@/utils/form-fields-validation-rules'

export default {
  name: 'switch-acl-rules',
  mixins: [
    NetworkTemplateSettingItemMixin
  ],
  components: { BaseTable, TemplateSettingItem },
  data: function () {
    return {
      field_key: 'switch_acl_rules',
      tableActions: [
        {
          icon: '$vuetify.icons.delete',
          type: 'remove'
        }
      ],
      computeCounter: 0,
      suggestionFields: ['srcCidr', 'srcPort', 'dstCidr', 'dstPort', 'vlan']
    }
  },
  computed: {
    tableItems () {
      // eslint-disable-next-line no-unused-expressions
      this.computeCounter

      return !this.isEmpty ? this.settingValue : [this.getEmptyTableItem()]
    },
    tableHeaders () {
      const tableHeaders = [
        {
          text: this.$t('wifi.policy'),
          value: 'policy',
          editable: true,
          width: '100px',
          options: [
            {
              key: 'allow',
              name: this.$t('wifi.allow')
            },
            {
              key: 'deny',
              name: this.$t('wifi.deny')
            }
          ],
          validations: {
            required: true
          }
        },
        {
          text: this.$t('v2.merakiTemplates.ipVersion'),
          value: 'ipVersion',
          width: '100px',
          editable: true,
          options: [
            {
              key: 'ipv4',
              name: this.$t('v2.merakiTemplates.ipv4')
            },
            {
              key: 'ipv6',
              name: this.$t('v2.merakiTemplates.ipv6')
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
          text: this.$t('v2.merakiTemplates.source'),
          value: 'srcCidr',
          editable: true,
          width: '160px',
          placeholder: this.$t('v2.placeholders.cidrOrAny'),
          componentProps: {
            title: this.$t('v2.placeholders.cidrOrAny'),
            suggestions: this.getFieldSuggestions(this.field_key, 'srcCidr')
          },
          validations: {
            required: true,
            methods: [{
              method: function (value) {
                return isValidCidr(value) || value.toLowerCase() === 'any'
              }
            }]
          }
        },
        {
          text: this.$t('wifi.sourcePort'),
          value: 'srcPort',
          width: '80px',
          editable: true,
          placeholder: this.$t('v2.placeholders.portNumber'),
          componentProps: {
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
          text: this.$t('wifi.destination'),
          value: 'dstCidr',
          editable: true,
          width: '180px',
          placeholder: this.$t('v2.placeholders.cidrOrAny'),
          componentProps: {
            title: this.$t('v2.placeholders.cidrOrAny'),
            suggestions: this.getFieldSuggestions(this.field_key, 'dstCidr')
          },
          validations: {
            required: true,
            methods: [{
              method: function (value) {
                return isValidCidr(value) || value.toLowerCase() === 'any'
              }
            }]
          }
        },
        {
          text: this.$t('wifi.port'),
          value: 'dstPort',
          width: '80px',
          editable: true,
          placeholder: this.$t('v2.placeholders.portNumber'),
          componentProps: {
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
          text: this.$t('v2.merakiTemplates.vlan'),
          value: 'vlan',
          width: '80px',
          editable: true,
          placeholder: this.$t('v2.placeholders.vlanId'),
          componentProps: {
            suggestions: this.getFieldSuggestions(this.field_key, 'vlan')
          },
          validations: {
            required: true,
            methods: [{
              method: function (value) {
                return isValidVlan(value) || value.toLowerCase() === 'any'
              }
            }]
          }
        },
        {
          text: this.$t('wifi.comment'),
          value: 'comment',
          editable: true,
          width: '120px'
        }
      ]

      if (this.operationMode === this.operationModes.compliance) {
        return tableHeaders.filter(header => {
          return header.value !== 'comment'
        })
      }

      return tableHeaders
    }
  },
  methods: {
    getEmptyTableItem () {
      return {
        comment: '',
        policy: null,
        ipVersion: null,
        protocol: null,
        srcPort: '',
        srcCidr: '',
        dstPort: '',
        dstCidr: '',
        vlan: ''
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
