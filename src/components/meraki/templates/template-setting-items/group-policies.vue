<template lang="pug">
  template-setting-item.group-policies(
    :title="$t('v2.merakiTemplates.groupPolicies')"
    :deploy-strategy-selector-enabled="isTemplateMode"
    :deploy-strategy-value="deployStrategyValue"
    :operation-mode="operationMode"
    @deployStrategyInput="$emit('deployStrategyInput', field_key, $event)"
    :is-empty="isEmpty"
  )
    template(v-slot:default)
      v-layout(row wrap).template-setting-item__content__row(
        v-show="activeItem === null"
      )
        v-flex(xs12 xl10)
          base-table(
            :items="items"
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
          span.group-policies__add-chart-item-trigger(
            v-if="!isFixed"
            @click="addNewItem"
          ) + {{ $t('general.addNew') }}

      .group-policies__active-policy(
        v-if="activeItem !== null"
      )
        group-policies-bandwidth-limits(
          :value="activeItem.bandwidth"
          @input="onFieldInput('bandwidth', $event)"
          :show-field-validation-state="showFieldValidationState"
          :is-fixed="isFixed"
          :field-suggestions="fieldSuggestions"
          @fieldSuggestionInput="onFieldSuggestionInput"
        )

        group-policies-scheduling(
          :value="activeItem.scheduling"
          @input="onFieldInput('scheduling', $event)"
          :is-fixed="isFixed"
        )

        group-policies-firewall-settings(
          :value="activeItem.firewallAndTrafficShaping"
          @input="onFieldInput('firewallAndTrafficShaping', $event)"
          @itemInput="onItemInput"
          :show-field-validation-state="showFieldValidationState"
          :operation-mode="operationMode"
          :is-fixed="isFixed"
          :field-suggestions="fieldSuggestions"
          @fieldSuggestionInput="onFieldSuggestionInput"
        )

        group-policies-vlan-tagging(
          :value="activeItem.vlanTagging"
          @input="onFieldInput('vlanTagging', $event)"
          :show-field-validation-state="showFieldValidationState"
          :is-fixed="isFixed"
        )

        v-layout(row wrap).template-setting-item__content__row
          v-flex(xs6 md4 lg3 xl2)
            label {{ $t('v2.merakiTemplates.splashAuth') }}
          v-flex(xs6 md4 lg3 xl2)
            base-select(
              :items="splashAuthOptions"
              :value="activeItem.splashAuthSettings"
              @input="onFieldInput('splashAuthSettings', $event)"
              :validations="{required: true}"
              :show-validation-state="showFieldValidationState"
              :disabled="isFixed"
            )

        group-policies-bonjour-forwarding(
          :value="activeItem.bonjourForwarding"
          @input="onFieldInput('bonjourForwarding', $event)"
          @itemInput="onItemInput"
          :show-field-validation-state="showFieldValidationState"
          :is-fixed="isFixed"
        )

</template>

<script>
import _ from 'lodash'
import TemplateSettingItem from './template-setting-item'
import NetworkTemplateSettingItemMixin from '@/mixins/network-template-setting-item.mixin'
import NetworkTemplateSettingItemMultipleMixin from '@/mixins/network-template-setting-item-multiple.mixin'
import BaseTable from '@/components/v2/base-table/base-table'
import BaseSelect from '@/components/v2/base-select/base-select'
import GroupPoliciesBandwidthLimits from './group-policies-bandwidth-limits'
import GroupPoliciesScheduling from './group-policies-scheduling'
import GroupPoliciesFirewallSettings from './group-policies-firewall-settings'
import GroupPoliciesVlanTagging from './group-policies-vlan-tagging'
import GroupPoliciesBonjourForwarding from './group-policies-bonjour-forwarding'
import { getEmptyGroupPolicy } from './factories'

export default {
  name: 'group-policies',
  mixins: [
    NetworkTemplateSettingItemMixin,
    NetworkTemplateSettingItemMultipleMixin
  ],
  components: {
    GroupPoliciesVlanTagging,
    GroupPoliciesFirewallSettings,
    GroupPoliciesScheduling,
    GroupPoliciesBandwidthLimits,
    GroupPoliciesBonjourForwarding,
    BaseTable,
    BaseSelect,
    TemplateSettingItem
  },
  data: function () {
    return {
      field_key: 'group_policies',
      tableActions: [
        {
          icon: '$vuetify.icons.edit',
          type: 'edit',
          validForFixed: true
        },
        {
          icon: '$vuetify.icons.delete',
          type: 'remove'
        }
      ],
      splashAuthOptions: [
        {
          key: 'network default',
          name: this.$t('v2.merakiTemplates.obeyNetworkDefault')
        },
        {
          key: 'bypass',
          name: this.$t('v2.merakiTemplates.bypass')
        }
      ],
      suggestionFields: ['name']
    }
  },
  computed: {
    tableHeaders () {
      return [
        {
          text: this.$t('general.name'),
          value: 'name',
          editable: true,
          width: '120px',
          validations: {
            required: true
          },
          componentProps: {
            emptyValue: null,
            suggestions: this.getFieldSuggestions(this.field_key, 'name')
          }
        },
        {
          text: this.$t('v2.merakiTemplates.bandwidth'),
          value: 'bandwidth.settings',
          formatter: this.settingsCellFormatter
        },
        {
          text: this.$t('v2.merakiTemplates.vlan'),
          value: 'vlanTagging.settings',
          formatter: this.settingsCellFormatter
        },
        {
          text: this.$t('v2.merakiTemplates.splashAuth'),
          value: 'splashAuthSettings',
          formatter: this.splashAuthSettingsCellFormatter
        },
        {
          text: this.$t('v2.merakiTemplates.bonjourForwarding'),
          value: 'bonjourForwarding.settings',
          formatter: this.settingsCellFormatter
        },
        {
          text: this.$t('v2.merakiTemplates.traffic'),
          value: 'firewallAndTrafficShaping.settings',
          formatter: this.settingsCellFormatter
        }
      ]
    }
  },
  methods: {
    getEmptyItem () {
      return getEmptyGroupPolicy()
    },
    settingsCellFormatter (value) {
      if (value === 'network default') {
        return this.$t('general.default')
      } else if (value === 'ignore') {
        return this.$t('general.disabled')
      }

      return this.$t('general.custom')
    },
    splashAuthSettingsCellFormatter (value) {
      if (value === 'network default') {
        return this.$t('general.default')
      }

      return this.$t('v2.merakiTemplates.bypass')
    },
    onTableActionClick (action, tableItem) {
      const itemIndex = this.items.indexOf(tableItem)

      if (action === 'remove') {
        this.deleteItem(itemIndex)
      } else if (action === 'edit') {
        this.$set(this, 'activeItemIndex', itemIndex)
      }
    },
    onTableItemInput (tableItem, field, value) {
      this.addPlaceholderItemIfEmpty()

      this.$emit('itemInput', tableItem, field, value)
    },
    onFieldInput (field, value) {
      this.addPlaceholderItemIfEmpty()

      this.$emit('settingInput', this.field_key, this.settingValue.map((policy, index) => {
        if (index === this.activeItemIndex) {
          return {
            ...policy,
            [field]: value
          }
        }

        return policy
      }))
    },
    onItemInput (tableItem, field, value) {
      this.addPlaceholderItemIfEmpty()

      this.$emit('itemInput', tableItem, field, value)
    },
    isSettingEmpty (value) {
      // Overwriting mixin method to perform special empty checks for setting
      const emptyStateValue = this.getEmptyItem()

      return NetworkTemplateSettingItemMixin.methods.isSettingEmpty.bind(this)(value) ||
        (this.settingValue.length === 1 && _.isEqual(this.settingValue[0], emptyStateValue))
    }
  }
}
</script>

<style scoped lang="scss">
  @import "styles/v2/colors.scss";

  .group-policies {
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

    &__active-policy {
      &__done-button {
        margin-top: 60px;
      }
    }
  }

</style>
