<template lang="pug">
  template-setting-item.http-servers(
    :title="$t('v2.merakiTemplates.webhooks')"
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
            :is-fixed="isFixed"
            index-keyed
          )
          span.http-servers__add-chart-item-trigger(
            v-if="!isFixed"
            @click="onAddServerClick"
          ) + {{ $t('general.addNew') }}

</template>

<script>
import TemplateSettingItem from './template-setting-item'
import NetworkTemplateSettingItemMixin from '@/mixins/network-template-setting-item.mixin'
import BaseTable from '@/components/v2/base-table/base-table'
import { isValidUrl } from '@/utils/form-fields-validation-rules'

export default {
  name: 'http-servers',
  mixins: [
    NetworkTemplateSettingItemMixin
  ],
  components: { BaseTable, TemplateSettingItem },
  data: function () {
    return {
      field_key: 'http_servers',
      tableActions: [
        {
          icon: '$vuetify.icons.delete',
          type: 'remove'
        }
      ],
      computeCounter: 0,
      suggestionFields: ['name', 'url']
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
          text: this.$t('media.url'),
          value: 'url',
          editable: true,
          validations: {
            required: true,
            methods: [{
              method: function (value) {
                return isValidUrl(value) && value.substring(0, 8) === 'https://'
              }
            }]
          },
          placeholder: this.$t('v2.merakiTemplates.webhookServerUrlPlaceholder'),
          componentProps: {
            suggestions: this.getFieldSuggestions(this.field_key, 'url')
          }
        },
        {
          text: this.$t('v2.merakiTemplates.sharedSecret'),
          value: 'sharedSecret',
          editable: true,
          protected: true
        }
      ]

      if (this.operationMode === this.operationModes.compliance) {
        return tableHeaders.filter(header => {
          return header.value !== 'name'
        })
      }

      return tableHeaders
    }
  },
  methods: {
    getEmptyTableItem () {
      return {
        name: null,
        url: null,
        sharedSecret: null
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

  .http-servers {
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
