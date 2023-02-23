<template lang="pug">
  template-setting-item.wireless-rf-profiles(
    :title="$t('v2.merakiTemplates.wirelessRfProfiles')"
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
          span.wireless-rf-profiles__add-chart-item-trigger(
            v-if="!isFixed"
            @click="addNewItem"
          ) + {{ $t('general.addNew') }}

      .wireless-rf-profiles__active-profile(
        v-if="activeItem !== null"
      )
        v-layout(row wrap).template-setting-item__content__row
          v-flex(xs6 md4 lg3 xl2)
            label {{ $t('v2.merakiTemplates.bandSelection') }}
          v-flex(xs6 md4 lg3 xl2)
            base-select(
              :items="bandSelectionTypes"
              :value="activeItem.bandSelectionType"
              @input="onFieldInput('bandSelectionType', $event)"
              :validations="{required: true}"
              :show-validation-state="showFieldValidationState"
              :disabled="isFixed"
            )

        wireless-rf-profiles-ap-band-settings(
          v-show="activeItem.bandSelectionType === 'ap'"
          :value="activeItem.apBandSettings"
          @input="onFieldInput('apBandSettings', $event)"
          :show-field-validation-state="showFieldValidationState"
          :is-fixed="isFixed"
        )

        .template-setting-item__content__separator

        v-layout(row wrap).template-setting-item__content__row
          v-flex(xs6 md4 lg3 xl2)
            label {{ $t('v2.merakiTemplates.minimumBitrateConfiguration') }}
          v-flex(xs6 md4 lg3 xl2)
            base-select(
              :items="minimumBitrateSettingTypes"
              :value="activeItem.minBitrateType"
              @input="onFieldInput('minBitrateType', $event)"
              :validations="{required: true}"
              :show-validation-state="showFieldValidationState"
              :disabled="isFixed"
            )

        v-layout(row wrap).template-setting-item__content__row
          v-flex(xs6 md4 lg3 xl2)
            label {{ $t('v2.merakiTemplates.clientBalancingEnabled') }}
          v-flex(xs6 md4 lg3 xl2)
            base-switch(
              :value="activeItem.clientBalancingEnabled"
              @input="onFieldInput('clientBalancingEnabled', $event)"
              :disabled="isFixed"
            )

        .template-setting-item__content__separator

        wireless-rf-profiles-two-four-ghz-settings(
          :value="activeItem.twoFourGhzSettings"
          @input="onFieldInput('twoFourGhzSettings', $event)"
          :show-field-validation-state="showFieldValidationState"
          :is-fixed="isFixed"
        )

        .template-setting-item__content__separator

        wireless-rf-profiles-five-ghz-settings(
          :value="activeItem.fiveGhzSettings"
          @input="onFieldInput('fiveGhzSettings', $event)"
          :show-field-validation-state="showFieldValidationState"
          :is-fixed="isFixed"
        )

</template>

<script>
import TemplateSettingItem from './template-setting-item'
import NetworkTemplateSettingItemMixin from '@/mixins/network-template-setting-item.mixin'
import NetworkTemplateSettingItemMultipleMixin from '@/mixins/network-template-setting-item-multiple.mixin'
import BaseTable from '@/components/v2/base-table/base-table'
import BaseSelect from '@/components/v2/base-select/base-select'
import BaseSwitch from '@/components/v2/base-switch/base-switch'
import WirelessRfProfilesApBandSettings from './wireless-rf-profiles-ap-band-settings'
import WirelessRfProfilesTwoFourGhzSettings from './wireless-rf-profiles-two-four-ghz-settings'
import WirelessRfProfilesFiveGhzSettings from './wireless-rf-profiles-five-ghz-settings'
import { getEmptyWirelessRfProfile } from './factories'
import _ from 'lodash'

export default {
  name: 'wireless-rf-profiles',
  mixins: [
    NetworkTemplateSettingItemMixin,
    NetworkTemplateSettingItemMultipleMixin
  ],
  components: {
    WirelessRfProfilesFiveGhzSettings,
    WirelessRfProfilesTwoFourGhzSettings,
    WirelessRfProfilesApBandSettings,
    BaseTable,
    BaseSelect,
    BaseSwitch,
    TemplateSettingItem
  },
  data: function () {
    return {
      field_key: 'wireless_rf_profiles',
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
      bandSelectionTypes: [
        {
          key: 'ap',
          name: this.$t('v2.merakiTemplates.perAp')
        },
        {
          key: 'ssid',
          name: this.$t('v2.merakiTemplates.perSSID')
        }
      ],
      minimumBitrateSettingTypes: [
        {
          key: 'band',
          name: this.$t('v2.merakiTemplates.perBand')
        },
        {
          key: 'ssid',
          name: this.$t('v2.merakiTemplates.perSSID')
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
          validations: {
            required: true
          },
          componentProps: {
            suggestions: this.getFieldSuggestions(this.field_key, 'name')
          }
        },
        {
          text: this.$t('v2.merakiTemplates.bandSelection'),
          value: 'bandSelectionType',
          formatter: this.bandSelectionCellFormatter
        },
        {
          text: this.$t('v2.merakiTemplates.minimumBitrateConfiguration'),
          value: 'minBitrateType',
          formatter: this.minimumBitrateConfigurationCellFormatter
        }
      ]
    }
  },
  methods: {
    getEmptyItem () {
      return getEmptyWirelessRfProfile()
    },
    bandSelectionCellFormatter (value) {
      const item = this.bandSelectionTypes.filter(item => {
        return item.key === value
      })[0]

      return item ? item.name : ''
    },
    minimumBitrateConfigurationCellFormatter (value) {
      const item = this.minimumBitrateSettingTypes.filter(item => {
        return item.key === value
      })[0]

      return item ? item.name : ''
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

      this.$emit('settingInput', this.field_key, this.settingValue.map((profile, index) => {
        if (index === this.activeItemIndex) {
          return {
            ...profile,
            [field]: value
          }
        }

        return profile
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
        (this.settingValue.length === 1 && _.isEqual({
          ...this.settingValue[0],
          name: this.settingValue[0].name === '' ? null : this.settingValue[0].name
        }, emptyStateValue))
    }
  }
}
</script>

<style scoped lang="scss">
  @import "styles/v2/colors.scss";

  .wireless-rf-profiles {
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

    &__active-profile {
      &__done-button {
        margin-top: 60px;
      }
    }
  }

</style>
