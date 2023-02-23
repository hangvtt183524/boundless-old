<template lang="pug">
  .l3-firewall-rules
    base-table(
      :items="tableItems"
      :headers="tableHeaders"
      :actions="tableActions"
      @actionClick="onTableActionClick"
      @itemInput="onTableItemInput"
      @itemReOrder="onTableItemReorder"
      @itemFocus="onTableItemFocus(...arguments, target === targets.mr ? field_key : null, target === targets.mr ? 'ssids' : null)"
      :show-indices="true"
      :draggable="operationMode === operationModes.template"
      :sortable="false"
      :always-editable="true"
      :show-field-validation-state="showFieldValidationState"
      :suppress-field-validation-state-display="isEmpty"
      :is-fixed="isFixed"
    )
    span.l3-firewall-rules__add-chart-item-trigger(
      v-if="!isFixed"
      @click="onAddRuleClick"
    ) + {{ $t('general.addNew') }}

</template>

<script>
import BaseTable from '@/components/v2/base-table/base-table'
import { isValidPort, isValidPortRange, isValidPortList, isValidCidr, isValidFQDN, isValidPolicyObjectOrGroup } from '@/utils/form-fields-validation-rules'
import _ from 'lodash'
import NetworkSettingOperationModeMixin from '@/mixins/network-setting-operation-mode.mixin'
import NetworkTemplateSettingFieldSuggestionsMixin from '@/mixins/network-template-setting-field-suggestions.mixin'

export default {
  name: 'l3-firewall-rules',
  components: { BaseTable },
  mixins: [ NetworkSettingOperationModeMixin, NetworkTemplateSettingFieldSuggestionsMixin ],
  props: {
    value: {
      required: true
    },
    target: {
      type: String,
      default: 'mx'
    },
    showFieldValidationState: {
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
      targets: {
        mx: 'mx',
        mxCellular: 'mxCellular',
        mr: 'mr'
      },
      tableActions: [
        {
          icon: '$vuetify.icons.delete',
          type: 'remove'
        }
      ],
      computeCounter: 0,
      suggestionFields: ['destCidr', 'destPort', 'srcCidr', 'srcPort',
        'mr_l3_firewall_rules__destCidr', 'mr_l3_firewall_rules__destPort']
    }
  },
  computed: {
    isEmpty () {
      return _.isNil(this.value) || _.isEmpty(this.value)
    },
    tableItems () {
      // eslint-disable-next-line no-unused-expressions
      this.computeCounter

      return !this.isEmpty ? this.value : [this.getEmptyTableItem()]
    },
    field_key () {
      const fieldKeys = {
        [this.targets.mx]: 'mx_l3_firewall_rules',
        [this.targets.mxCellular]: 'mx_cellular_firewall_rules',
        [this.targets.mr]: 'mr_l3_firewall_rules'
      }

      return fieldKeys[this.target]
    },
    destCidrTableHeader () {
      // mx -> Multiple comma separated values, ip, cidr, fqdn, policy object / group or 'any'
      // mx cellular -> Multiple comma separated values, ip, cidr, policy object / group or 'any'
      // mr -> single value, ip, cidr or 'any'

      const header = {
        text: this.$t('wifi.destination'),
        value: 'destCidr',
        editable: true,
        width: '180px',
        validations: {
          required: true,
          methods: []
        }
      }

      if (this.target === this.targets.mx || this.target === this.targets.mxCellular) {
        header.width = '320px'
        header.type = Array
        header.valueFormatter = this.cidrCellValueFormatter
        header.formatter = this.cidrCellDisplayFormatter
        header.placeholder = this.$t('v2.placeholders.separateByCommas')
        header.componentProps = {
          items: this.getFieldSuggestions(this.field_key, 'destCidr')
            ? this.getFieldSuggestions(this.field_key, 'destCidr').map(item => { return { key: item, name: item } })
            : null
        }
      }

      if (this.target === this.targets.mx) {
        header.validations.methods.push({
          method: function (value) {
            let isValid = true

            value.split(',').map(cidrValue => {
              return cidrValue.trim()
            }).forEach(cidrValue => {
              if (!(isValidCidr(cidrValue) || isValidFQDN(cidrValue) || isValidPolicyObjectOrGroup(cidrValue) || cidrValue.toLowerCase() === 'any')) {
                isValid = false
                return false
              }
            })

            return isValid
          },
          message: this.$t('v2.merakiTemplates.invalidCidrFQDNValue')
        })
      } else if (this.target === this.targets.mxCellular) {
        header.validations.methods.push({
          method: function (value) {
            let isValid = true

            value.split(',').map(cidrValue => {
              return cidrValue.trim()
            }).forEach(cidrValue => {
              if (!(isValidCidr(cidrValue) || isValidPolicyObjectOrGroup(cidrValue) || cidrValue.toLowerCase() === 'any')) {
                isValid = false
                return false
              }
            })

            return isValid
          },
          message: this.$t('v2.merakiTemplates.invalidCidrValue')
        })
      } else if (this.target === this.targets.mr) {
        header.placeholder = this.$t('v2.placeholders.cidrOrAny')
        header.componentProps = {
          title: this.$t('v2.placeholders.cidrOrAny'),
          suggestions: this.getFieldSuggestions('ssids', `${this.field_key}__destCidr`)
        }
        header.validations.methods.push({
          method: function (value) {
            return isValidCidr(value) || value.toLowerCase() === 'any' || value.toLowerCase() === 'local lan'
          }
        })
      }

      return header
    },
    tableHeaders () {
      const headers = [
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
        this.destCidrTableHeader,
        {
          text: this.$t('wifi.port'),
          value: 'destPort',
          width: '80px',
          editable: true,
          placeholder: this.$t('v2.placeholders.portNumber'),
          componentProps: {
            title: this.$t('v2.placeholders.portNumber'),
            suggestions: this.target === this.targets.mr
              ? this.getFieldSuggestions('ssids', `${this.field_key}__destPort`)
              : this.getFieldSuggestions(this.field_key, 'destPort')
          },
          validations: {
            required: true,
            methods: [{
              method: (value) => {
                if (this.target === this.targets.mx || this.target === this.targets.mxCellular) {
                  // Comma separated post list allowed for mx / mx cellular
                  return isValidPort(value) || isValidPortRange(value) || isValidPortList(value) || value.toLowerCase() === 'any'
                }

                return isValidPort(value) || isValidPortRange(value) || value.toLowerCase() === 'any'
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

      if (this.target === this.targets.mx || this.target === this.targets.mxCellular) {
        // Add extra headers for mx
        headers.splice(4, 0, {
          text: this.$t('wifi.sourceIp'),
          value: 'srcCidr',
          editable: true,
          width: '320px',
          type: Array,
          valueFormatter: this.cidrCellValueFormatter,
          formatter: this.cidrCellDisplayFormatter,
          placeholder: this.$t('v2.placeholders.separateByCommas'),
          validations: {
            required: true,
            methods: [{
              method: function (value) {
                let isValid = true

                value.split(',').map(cidrValue => {
                  return cidrValue.trim()
                }).forEach(cidrValue => {
                  if (!(isValidCidr(cidrValue) || isValidPolicyObjectOrGroup(cidrValue) || cidrValue.toLowerCase() === 'any')) {
                    isValid = false
                    return false
                  }
                })

                return isValid
              },
              message: this.$t('v2.merakiTemplates.invalidCidrValue')
            }]
          },
          componentProps: {
            items: this.getFieldSuggestions(this.field_key, 'srcCidr')
              ? this.getFieldSuggestions(this.field_key, 'srcCidr').map(item => { return { key: item, name: item } })
              : null
          }
        })
        headers.splice(5, 0, {
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
                return isValidPort(value) || isValidPortRange(value) || isValidPortList(value) || value.toLowerCase() === 'any'
              }
            }]
          }
        })
      }

      if (this.operationMode === this.operationModes.compliance) {
        return headers.filter(header => {
          return header.value !== 'comment'
        })
      }

      return headers
    },
    commaSeparatedFields () {
      return this.target === this.targets.mx || this.target === this.targets.mxCellular
        ? ['destCidr', 'srcCidr']
        : null
    }
  },
  methods: {
    getEmptyTableItem () {
      const rule = {
        comment: '',
        policy: null,
        protocol: null,
        destPort: '',
        destCidr: ''
      }

      if (this.target === this.targets.mx || this.target === this.targets.mxCellular) {
        // Add extra rule fields for mx
        rule.srcPort = ''
        rule.srcCidr = ''
      }

      return rule
    },
    addTableItems (tableItems) {
      this.$emit('input', [
        ...(this.value ? this.value : []),
        ...tableItems
      ])
    },
    onTableActionClick (action, tableItem) {
      if (action === 'remove') {
        if (this.isEmpty) {
          this.computeCounter += 1 // Force re-compute of table items so that row re-renders
          return
        }

        const itemIndex = this.value.indexOf(tableItem)

        this.$emit('input', this.value.filter((item, index) => {
          return index !== itemIndex
        }))
      }
    },
    onTableItemInput (tableItem, field, value) {
      if ((field === 'srcCidr' || field === 'destCidr') && this.target !== this.targets.mr) {
        // For mx type rules, convert list value to comma separated value
        value = value.join(',')
      }

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
      let rules = _.clone(this.value)

      // Now move the items in this array
      const movedItem = rules.splice(oldIndex, 1)[0]
      rules.splice(newIndex, 0, movedItem)

      this.$emit('input', rules)
    },
    onAddRuleClick () {
      const tableItems = [this.getEmptyTableItem()]
      if (this.isEmpty) {
        // Do twice if the list is already empty, as one item is displayed as placeholder already
        tableItems.push(this.getEmptyTableItem())
      }

      this.addTableItems(tableItems)
    },
    cidrCellValueFormatter (value) {
      return value ? value.split(',') : []
    },
    cidrCellDisplayFormatter (value) {
      return value.join(', ')
    }
  }
}
</script>

<style scoped lang="scss">
  @import "styles/v2/colors.scss";

  .l3-firewall-rules {
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
