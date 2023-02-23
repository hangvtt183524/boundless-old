<template lang="pug">
  template-setting-item.mx-1-to-many-nat-rules(
    :title="$t('v2.merakiTemplates.oneToManyNatRules')"
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
      .mx-1-to-many-nat-rules__rule-list
        one-to-many-nat-rule(
          v-for="(rule, index) of items"
          :key="getItemKey(rule)"
          :value="rule"
          @input="onInput(index, ...arguments)"
          @itemInput="onItemInput"
          @deleteClick="onDeleteClick(index)"
          :show-field-validation-state="showFieldValidationState"
          :suppress-validation-state-display="isEmpty"
          :operation-mode="operationMode"
          :is-fixed="isFixed"
          :field-suggestions="fieldSuggestions"
          @fieldSuggestionInput="onFieldSuggestionInput"
        )

      span.mx-1-to-many-nat-rules__add-rule-trigger(
        v-if="!isFixed"
        @click="onAddRuleClick"
      ) + {{ $t('v2.merakiTemplates.add1toManyIp') }}

</template>

<script>
import TemplateSettingItem from './template-setting-item'
import NetworkTemplateSettingItemMixin from '@/mixins/network-template-setting-item.mixin'
import ItemUniqueKeyMixin from '@/mixins/item-unique-key.mixin'
import OneToManyNatRule from './one-to-many-nat-rule'
import _ from 'lodash'

export default {
  name: 'mx-1-to-many-nat-rules',
  mixins: [
    NetworkTemplateSettingItemMixin,
    ItemUniqueKeyMixin
  ],
  components: { OneToManyNatRule, TemplateSettingItem },
  data: function () {
    return {
      field_key: 'mx_1_to_many_nat_rules',
      computeCounter: 0,
      placeholderItem: null
    }
  },
  computed: {
    items () {
      // eslint-disable-next-line no-unused-expressions
      this.computeCounter

      if (!this.isEmpty) {
        return this.settingValue
      }

      // Setting value empty. Set a placeholder item and add it to the list.
      // If we do not define placeholderItem as a data attribute, and directly return a dynamic list here as we do for
      // simple list-type settings, a change in the placeholder item property is not detected by child components.
      this.$set(this, 'placeholderItem', this.getEmptyItem())
      return [this.placeholderItem]
    }
  },
  methods: {
    getEmptyItem () {
      return {
        publicIp: '',
        uplink: null,
        portRules: []
      }
    },
    addItem (item) {
      this.$emit('settingInput', this.field_key, [
        ...(this.settingValue ? this.settingValue : []),
        item
      ])
    },
    onAddRuleClick () {
      if (this.isEmpty) {
        // Do twice if the list is already empty, as one item is displayed as placeholder already
        this.addItem(this.getEmptyItem())
      }

      this.addItem(this.getEmptyItem())
    },
    onInput (itemIndex, value) {
      // If inputted a value for placeholder item, add it to the list of items first
      if (this.isEmpty) {
        this.addItem(this.placeholderItem)
        this.placeholderItem = null
      }

      this.$emit('settingInput', this.field_key, this.settingValue.map((item, index) => {
        if (index === itemIndex) {
          return value
        }

        return item
      }))
    },
    onItemInput (item, field, value) {
      // item can be a nat rule itself, or an allowed inbound entry for a nat rule here.
      // If its a nat rule, and is the placeholder rule, add it to the list first.
      if (item.hasOwnProperty('portRules') && this.isEmpty) {
        this.addItem(this.placeholderItem)
        this.placeholderItem = null
      }

      this.$emit('itemInput', item, field, value)
    },
    onDeleteClick (itemIndex) {
      if (this.isEmpty) {
        this.computeCounter += 1 // Force re-compute of table items so that row re-renders
        return
      }

      this.$emit('settingInput', this.field_key, this.settingValue.filter((item, index) => {
        return index !== itemIndex
      }))
    },
    isSettingEmpty (value) {
      // Overwriting mixin method to perform special empty checks for setting
      const emptyStateValue = this.getEmptyItem()
      const emptyStateValueWithRule = {
        ...this.getEmptyItem(),
        portRules: [{
          name: '',
          protocol: null,
          publicPort: '',
          lanIp: '',
          localPort: '',
          allowedIps: []
        }]
      }

      return NetworkTemplateSettingItemMixin.methods.isSettingEmpty.bind(this)(value) ||
        (this.settingValue.length === 1 &&
          (_.isEqual(this.settingValue[0], emptyStateValue) ||
            _.isEqual(this.settingValue[0], emptyStateValueWithRule)))
    }
  }
}
</script>

<style scoped lang="scss">
  @import "styles/v2/colors.scss";

  .mx-1-to-many-nat-rules {
    .one-to-many-nat-rule:not(:last-child) {
      margin-bottom: 30px;
      padding-bottom: 30px;
      border-bottom: 1px solid $gray-xlight;
    }

    &__add-rule-trigger {
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
