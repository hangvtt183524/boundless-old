<template lang="pug">
  template-setting-item.ssid-radius-servers(
    :title="$t('v2.merakiTemplates.radiusServers')"
    :operation-mode="operationMode"
    v-show="settingValue.authMode === 'open-with-radius' || settingValue.authMode === '8021x-radius' || settingValue.authMode === 'ipsk-with-radius' || settingValue.splashPage === 'Password-protected with custom RADIUS'"
  )
    template(v-slot:default)
      v-layout(row wrap).template-setting-item__content__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.servers') }}
        v-flex(xs6 md8 lg8 xl6)
          base-table(
            :items="serverTableItems"
            :headers="getRadiusTableHeaders('radiusServers')"
            :actions="tableActions"
            @actionClick="onServerTableActionClick"
            @itemInput="onServerTableItemInput"
            @itemReOrder="onServerTableItemReorder"
            @itemFocus="onTableItemFocus(...arguments, 'definition__radiusServers', 'ssids')"
            :show-indices="true"
            :draggable="true"
            :sortable="false"
            :always-editable="true"
            :show-field-validation-state="showFieldValidationState"
            :is-fixed="isFixed"
            :generate-keys="true"
          )
          span.ssid-radius-servers__add-chart-item-trigger(
            v-if="!isFixed"
            @click="onAddServerClick"
          ) + {{ $t('general.addNew') }}

      v-layout(row wrap).template-setting-item__content__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.radiusCoaEnabled') }}
        v-flex(xs6 md4 lg3 xl2)
          base-switch(
            :value="settingValue.radiusCoaEnabled"
            @input="onFieldInput('radiusCoaEnabled', $event)"
            :disabled="isFixed"
          )

      v-layout(row wrap).template-setting-item__content__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.radiusAttributeForGroupPolicy') }}
        v-flex(xs6 md4 lg3 xl2)
          base-select(
            :items="groupAttributeOptions"
            :value="settingValue.radiusAttributeForGroupPolicies"
            @input="onFieldInput('radiusAttributeForGroupPolicies', $event)"
            :disabled="isFixed"
            clearable
          )

      v-layout(row wrap).template-setting-item__content__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.radiusAccountingEnabled') }}
        v-flex(xs6 md4 lg3 xl2)
          base-switch(
            :value="settingValue.radiusAccountingEnabled"
            @input="onFieldInput('radiusAccountingEnabled', $event)"
            :disabled="isFixed"
          )

      v-layout(row wrap).template-setting-item__content__row(
        v-show="settingValue.radiusAccountingEnabled === true"
      )
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.accountingServers') }}
        v-flex(xs6 md8 lg8 xl6)
          base-table(
            :items="accountingServerTableItems"
            :headers="getRadiusTableHeaders('radiusAccountingServers')"
            :actions="tableActions"
            @actionClick="onAccountingServerTableActionClick"
            @itemInput="onAccountingTableItemInput"
            @itemReOrder="onAccountingServerTableItemReorder"
            @itemFocus="onTableItemFocus(...arguments, 'definition__radiusAccountingServers', 'ssids')"
            :show-indices="true"
            :draggable="true"
            :sortable="false"
            :always-editable="true"
            :show-field-validation-state="showFieldValidationState"
            :is-fixed="isFixed"
            :generate-keys="true"
          )
          span.ssid-radius-servers__add-chart-item-trigger(
            v-if="!isFixed"
            @click="onAddAccountingServerClick"
          ) + {{ $t('general.addNew') }}

      v-layout(row wrap).template-setting-item__content__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.failoverPolicy') }}
        v-flex(xs6 md4 lg3 xl2)
          base-select(
            :items="failoverPolicyOptions"
            :value="settingValue.radiusFailoverPolicy"
            @input="onFieldInput('radiusFailoverPolicy', $event)"
            :disabled="isFixed"
            clearable
          )

      v-layout(row wrap).template-setting-item__content__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.loadBalancingPolicy') }}
        v-flex(xs6 md4 lg3 xl2)
          base-select(
            :items="loadBalancingPolicyOptions"
            :value="settingValue.radiusLoadBalancingPolicy"
            @input="onFieldInput('radiusLoadBalancingPolicy', $event)"
            :disabled="isFixed"
            clearable
          )

</template>

<script>
import TemplateSettingItem from './template-setting-item'
import NetworkTemplateSettingItemMixin from '@/mixins/network-template-setting-item.mixin'
import BaseSelect from '@/components/v2/base-select/base-select'
import BaseTable from '@/components/v2/base-table/base-table'
import BaseSwitch from '@/components/v2/base-switch/base-switch'
import _ from 'lodash'
import { isValidHostname, isValidIpAddress, isValidPort } from '@/utils/form-fields-validation-rules'
import { PORT_INPUT_PROPS } from '@/constants/form-fields'

export default {
  name: 'ssid-radius-servers',
  mixins: [
    NetworkTemplateSettingItemMixin
  ],
  components: { BaseTable, BaseSelect, BaseSwitch, TemplateSettingItem },
  data: function () {
    return {
      field_key: 'definition',
      tableActions: [
        {
          icon: '$vuetify.icons.delete',
          type: 'remove'
        }
      ],
      groupAttributeOptions: ['Filter-Id', 'Reply-Message', 'Airespace-ACL-Name', 'Aruba-User-Role'].map(option => {
        return {
          key: option,
          name: option
        }
      }),
      loadBalancingPolicyOptions: ['Strict priority order', 'Round robin'].map(option => {
        return {
          key: option,
          name: option
        }
      }),
      failoverPolicyOptions: ['Deny access', 'Allow access'].map(option => {
        return {
          key: option,
          name: option
        }
      }),
      computeCounter: 0,
      suggestionFields: [
        'definition__radiusServers__host',
        'definition__radiusServers__port',
        'definition__radiusAccountingServers__host',
        'definition__radiusAccountingServers__port'
      ]
    }
  },
  computed: {
    serverTableItems () {
      // eslint-disable-next-line no-unused-expressions
      this.computeCounter

      return this.settingValue.radiusServers && this.settingValue.radiusServers.length > 0
        ? this.settingValue.radiusServers : [this.getEmptyTableItem()]
    },
    accountingServerTableItems () {
      // eslint-disable-next-line no-unused-expressions
      this.computeCounter

      return this.settingValue.radiusAccountingServers && this.settingValue.radiusAccountingServers.length > 0
        ? this.settingValue.radiusAccountingServers : [this.getEmptyTableItem()]
    }
  },
  methods: {
    getRadiusTableHeaders (field) {
      return [
        {
          text: this.$t('v2.merakiTemplates.host'),
          value: 'host',
          editable: true,
          placeholder: this.$t('v2.placeholders.hostnameOrIpAddress'),
          componentProps: {
            title: this.$t('v2.placeholders.hostnameOrIpAddress'),
            suggestions: this.getFieldSuggestions('ssids', `definition__${field}__host`)
          },
          validations: {
            required: true,
            methods: [{
              method: function (value) {
                return isValidIpAddress(value) || isValidHostname(value)
              }
            }]
          }
        },
        {
          text: this.$t('wifi.port'),
          value: 'port',
          editable: true,
          placeholder: this.$t('v2.placeholders.portNumberWithExample').replace('{example}', '1812'),
          componentProps: {
            ...PORT_INPUT_PROPS,
            title: this.$t('v2.placeholders.portNumberWithExample').replace('{example}', '1812'),
            suggestions: this.getFieldSuggestions('ssids', `definition__${field}__port`)
          },
          validations: {
            required: true,
            methods: [{
              method: isValidPort
            }]
          }
        },
        {
          text: this.$t('v2.merakiTemplates.secret'),
          value: 'secret',
          editable: true,
          protected: true,
          placeholder: this.$t('v2.merakiTemplates.radiusSecretPlaceholder'),
          componentProps: {
            title: this.$t('v2.merakiTemplates.radiusSecretPlaceholder')
          },
          validations: {
            required: true
          }
        }
      ]
    },
    getEmptyTableItem () {
      return {
        host: null,
        port: null,
        secret: null
      }
    },
    addServerTableItem (tableItem) {
      this.$emit('settingInput', this.field_key, {
        ...this.settingValue,
        radiusServers: [
          ...(this.settingValue.radiusServers ? this.settingValue.radiusServers : []),
          tableItem
        ]
      })
    },
    addAccountingTableItem (tableItem) {
      this.$emit('settingInput', this.field_key, {
        ...this.settingValue,
        radiusAccountingServers: [
          ...(this.settingValue.radiusAccountingServers ? this.settingValue.radiusAccountingServers : []),
          tableItem
        ]
      })
    },
    onFieldInput (field, value) {
      this.$emit('settingInput', this.field_key, {
        ...this.settingValue,
        [field]: value
      })
    },
    onAddServerClick () {
      if (!(this.settingValue && this.settingValue.radiusServers && this.settingValue.radiusServers.length > 0)) {
        // Do twice if the list is already empty, as one item is displayed as placeholder already
        setTimeout(() => {
          this.addServerTableItem(this.getEmptyTableItem())
        }, 50)
      }

      this.addServerTableItem(this.getEmptyTableItem())
    },
    onServerTableActionClick (action, tableItem) {
      if (action === 'remove') {
        if (!(this.settingValue && this.settingValue.radiusServers)) {
          this.computeCounter += 1 // Force re-compute of table items so that row re-renders
          return
        }

        const itemIndex = this.settingValue.radiusServers.indexOf(tableItem)
        this.$emit('settingInput', this.field_key, {
          ...this.settingValue,
          radiusServers: this.settingValue.radiusServers.filter((item, index) => {
            return index !== itemIndex
          })
        })
      }
    },
    onServerTableItemReorder (oldIndex, newIndex) {
      // Create a shallow clone of customPieChartItems array first
      let radiusServers = _.clone(this.settingValue.radiusServers)

      // Now move the items in this array
      const movedItem = radiusServers.splice(oldIndex, 1)[0]
      radiusServers.splice(newIndex, 0, movedItem)

      this.$emit('settingInput', this.field_key, {
        ...this.settingValue,
        radiusServers: radiusServers
      })
    },
    onServerTableItemInput (tableItem, field, value) {
      if (!(this.settingValue && this.settingValue.radiusServers && this.settingValue.radiusServers.length > 0)) {
        this.addServerTableItem(tableItem)
      }

      this.$emit('itemInput', tableItem, field, value)
    },
    onAddAccountingServerClick () {
      if (!(this.settingValue && this.settingValue.radiusAccountingServers && this.settingValue.radiusAccountingServers.length > 0)) {
        // Do twice if the list is already empty, as one item is displayed as placeholder already
        setTimeout(() => {
          this.addAccountingTableItem(this.getEmptyTableItem())
        }, 50)
      }

      this.addAccountingTableItem(this.getEmptyTableItem())
    },
    onAccountingServerTableActionClick (action, tableItem) {
      if (action === 'remove') {
        if (!(this.settingValue && this.settingValue.radiusAccountingServers)) {
          this.computeCounter += 1 // Force re-compute of table items so that row re-renders
          return
        }

        const itemIndex = this.settingValue.radiusAccountingServers.indexOf(tableItem)
        this.$emit('settingInput', this.field_key, {
          ...this.settingValue,
          radiusAccountingServers: this.settingValue.radiusAccountingServers.filter((item, index) => {
            return index !== itemIndex
          })
        })
      }
    },
    onAccountingServerTableItemReorder (oldIndex, newIndex) {
      // Create a shallow clone of customPieChartItems array first
      let accountingServers = _.clone(this.settingValue.radiusAccountingServers)

      // Now move the items in this array
      const movedItem = accountingServers.splice(oldIndex, 1)[0]
      accountingServers.splice(newIndex, 0, movedItem)

      this.$emit('settingInput', this.field_key, {
        ...this.settingValue,
        radiusAccountingServers: accountingServers
      })
    },
    onAccountingTableItemInput (tableItem, field, value) {
      if (!(this.settingValue && this.settingValue.radiusAccountingServers && this.settingValue.radiusAccountingServers.length > 0)) {
        this.addAccountingTableItem(tableItem)
      }

      this.$emit('itemInput', tableItem, field, value)
    }
  }
}
</script>

<style scoped lang="scss">
  @import "styles/v2/colors.scss";

  .ssid-radius-servers {
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
