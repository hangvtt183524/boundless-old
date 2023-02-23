<template lang="pug">
  template-setting-item(
    :title="$t('v2.merakiTemplates.ssids')"
    :title-visible="false"
    :deploy-strategy-selector-enabled="isTemplateMode && activeItem === null"
    :deploy-strategy-value="deployStrategyValue"
    @deployStrategyInput="$emit('deployStrategyInput', field_key, $event)"
    :is-empty="isEmpty"
  ).ssids
    template(v-slot:default)
      v-layout(row wrap).template-setting-item__content__row(
        v-show="activeItem === null"
      )
        v-flex(xs12 md10 lg8 xl6)
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
          span.ssids__add-chart-item-trigger(
            v-if="!isFixed"
            v-show="items.length < maxSSIDCount"
            @click="onAddSSIDClick"
          ) + {{ $t('general.addNew') }}

      .ssids__active-ssid(
        v-if="activeItem !== null"
      )

        base-tab-header(
          :class="['tab-header--underlined', 'tab-header--blue', {'tab-header--active': selectedTab === tabs.accessControl}]"
          @click="onTabHeaderClick(tabs.accessControl)"
        )
          | {{ $t('v2.merakiTemplates.settingCategories.access_control') }}

        base-tab-header(
          :class="['tab-header--underlined', 'tab-header--blue', {'tab-header--active': selectedTab === tabs.firewallAndTrafficShaping}]"
          @click="onTabHeaderClick(tabs.firewallAndTrafficShaping)"
        )
          | {{ $t('v2.merakiTemplates.settingCategories.firewall_traffic_shaping') }}

        base-tab-header(
          :class="['tab-header--underlined', 'tab-header--blue', {'tab-header--active': selectedTab === tabs.availability}]"
          @click="onTabHeaderClick(tabs.availability)"
        )
          | {{ $t('v2.merakiTemplates.availability') }}

        .ssids__active-ssid__content
          .ssids__active-ssid__content__tab(
            v-show="selectedTab === tabs.accessControl"
          )
            ssid-network-access(
              :value="activeItem"
              :original-value="originalValue"
              :template-value="value"
              :submitted="submitted"
              :operation-mode="operationMode"
              @settingInput="onSSIDSettingInput"
              @itemInput="onSSIDSettingItemInput"
              :is-fixed="isFixed"
              :field-suggestions="fieldSuggestions"
              @fieldSuggestionInput="onFieldSuggestionInput"
            )

            ssid-radius-servers(
              :value="activeItem"
              :original-value="originalValue"
              :submitted="submitted"
              :operation-mode="operationMode"
              @settingInput="onSSIDSettingInput"
              @itemInput="onSSIDSettingItemInput"
              :is-fixed="isFixed"
              @deployStrategyInput="onSSIDSettingDeployStrategyInput"
              :field-suggestions="fieldSuggestions"
              @fieldSuggestionInput="onFieldSuggestionInput"
            )

            ssid-walled-garden(
              :value="activeItem"
              :original-value="originalValue"
              :submitted="submitted"
              :operation-mode="operationMode"
              @settingInput="onSSIDSettingInput"
              @itemInput="onSSIDSettingItemInput"
              :is-fixed="isFixed"
              :field-suggestions="fieldSuggestions"
              @fieldSuggestionInput="onFieldSuggestionInput"
            )

            ssid-addressing-and-traffic(
              :value="activeItem"
              :original-value="originalValue"
              :submitted="submitted"
              :operation-mode="operationMode"
              @settingInput="onSSIDSettingInput"
              @itemInput="onSSIDSettingItemInput"
              :is-fixed="isFixed"
            )

            ssid-bonjour-forwarding(
              :value="activeItem"
              :original-value="originalValue"
              :submitted="submitted"
              :operation-mode="operationMode"
              @settingInput="onSSIDSettingInput"
              @itemInput="onSSIDSettingItemInput"
              :is-fixed="isFixed"
              @deployStrategyInput="onSSIDSettingDeployStrategyInput"
            )

          .ssids__active-ssid__content__tab(
            v-show="selectedTab === tabs.firewallAndTrafficShaping"
          )

            mr-l3-firewall-rules(
              :value="activeItem"
              :original-value="originalValue"
              :submitted="submitted"
              :operation-mode="operationMode"
              @settingInput="onSSIDSettingInput"
              @itemInput="onSSIDSettingItemInput"
              :is-fixed="isFixed"
              @deployStrategyInput="onSSIDSettingDeployStrategyInput"
              :field-suggestions="fieldSuggestions"
              @fieldSuggestionInput="onFieldSuggestionInput"
            )

            ssid-traffic-shaping(
              :value="activeItem"
              :original-value="originalValue"
              :submitted="submitted"
              :operation-mode="operationMode"
              @settingInput="onSSIDSettingInput"
              @itemInput="onSSIDSettingItemInput"
              :is-fixed="isFixed"
            )

          .ssids__active-ssid__content__tab(
            v-show="selectedTab === tabs.availability"
          )

            ssid-availability(
              :value="activeItem"
              :original-value="originalValue"
              :submitted="submitted"
              :operation-mode="operationMode"
              @settingInput="onSSIDSettingInput"
              @itemInput="onSSIDSettingItemInput"
              :is-fixed="isFixed"
            )

</template>

<script>
import _ from 'lodash'
import TemplateSettingItem from './template-setting-item'
import NetworkTemplateSettingItemMixin from '@/mixins/network-template-setting-item.mixin'
import NetworkTemplateSettingItemMultipleMixin from '@/mixins/network-template-setting-item-multiple.mixin'
import NetworkSettingOperationModeMixin from '@/mixins/network-setting-operation-mode.mixin'
import BaseTable from '@/components/v2/base-table/base-table'
import BaseTabHeader from '@/components/v2/base-tab-header/base-tab-header.vue'
import SsidNetworkAccess from './ssid-network-access'
import SsidRadiusServers from './ssid-radius-servers'
import SsidWalledGarden from './ssid-walled-garden'
import SsidAddressingAndTraffic from './ssid-addressing-and-traffic'
import SsidAvailability from './ssid-availability'
import MrL3FirewallRules from './mr-l3-firewall-rules'
import SsidTrafficShaping from './ssid-traffic-shaping'
import { getEmptySSID } from './factories'
import SsidBonjourForwarding from './ssid-bonjour-forwarding'

export default {
  name: 'ssids',
  mixins: [
    NetworkTemplateSettingItemMixin,
    NetworkTemplateSettingItemMultipleMixin,
    NetworkSettingOperationModeMixin
  ],
  components: {
    SsidBonjourForwarding,
    SsidTrafficShaping,
    MrL3FirewallRules,
    SsidAddressingAndTraffic,
    SsidWalledGarden,
    SsidRadiusServers,
    SsidNetworkAccess,
    SsidAvailability,
    BaseTable,
    BaseTabHeader,
    TemplateSettingItem },
  data: function () {
    return {
      field_key: 'ssids',
      maxSSIDCount: 15,
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
      tabs: {
        accessControl: 'accessControl',
        firewallAndTrafficShaping: 'firewallAndTrafficShaping',
        availability: 'availability'
      },
      selectedTab: 'accessControl',
      suggestionFields: ['definition__name']
    }
  },
  computed: {
    tableHeaders () {
      return [
        {
          text: this.$t('general.name'),
          value: 'definition.name',
          editable: true,
          validations: {
            required: true
          },
          placeholder: this.$t('v2.merakiTemplates.ssidNamePlaceholder'),
          componentProps: {
            suggestions: this.getFieldSuggestions(this.field_key, 'definition__name')
          }
        },
        {
          text: this.$t('general.enabled'),
          value: 'definition.enabled',
          editable: true,
          type: Boolean,
          validations: {
            required: true
          }
        }
      ]
    },
    nonConfiguredValue () {
      return []
    }
  },
  methods: {
    getEmptyItem () {
      const emptySSID = getEmptySSID()

      // Do not set these by default for compliance
      if (this.operationMode === this.operationModes.compliance) {
        delete emptySSID.definition.authMode
        delete emptySSID.definition.splashPage
      }

      return emptySSID
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
    onAddSSIDClick () {
      if (this.items.length >= this.maxSSIDCount) {
        return false
      }

      this.addNewItem()
    },
    onTabHeaderClick (tab) {
      this.selectedTab = tab
    },
    onSSIDSettingInput (field, value) {
      this.addPlaceholderItemIfEmpty()

      this.$emit('settingInput', this.field_key, this.settingValue.map((ssid, index) => {
        if (index === this.activeItemIndex) {
          return {
            ...ssid,
            [field]: value
          }
        }

        return ssid
      }))
    },
    onSSIDSettingItemInput (item, field, value) {
      this.addPlaceholderItemIfEmpty()

      this.$emit('itemInput', item, field, value)
    },
    onSSIDSettingDeployStrategyInput (field, value) {
      // true means extend
      let ssidSettingsToOverride
      if (value) {
        ssidSettingsToOverride =
          (this.activeItem.settings_to_overwrite || []).filter(settingField => settingField !== field)
      } else {
        ssidSettingsToOverride = [...(this.activeItem.settings_to_overwrite || []), field]
      }

      this.onSSIDSettingInput('settings_to_overwrite', ssidSettingsToOverride)
    },
    getActiveItemName () {
      return this.activeItem ? this.activeItem.definition.name : null
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

  .ssids {
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

    &__active-ssid {
      .ssid-name-row {
        margin-bottom: 20px;
      }

      .tab-header {
        min-width: auto;
        padding: 0 40px;
      }

      &__done-button {
        margin-top: 60px;
      }
    }
  }

</style>
