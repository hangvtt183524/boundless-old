<template lang="pug">
  .ssid-identity-psks
    base-table(
      :items="tableItems"
      :headers="tableHeaders"
      :actions="tableActions"
      @actionClick="onTableActionClick"
      @itemInput="onTableItemInput"
      @itemFocus="onTableItemFocus"
      :sortable="false"
      :always-editable="true"
      :show-field-validation-state="showFieldValidationState"
      :is-fixed="isFixed"
      :generate-keys="true"
    )
    span.ssid-identity-psks__add-chart-item-trigger(
      v-if="!isFixed"
      @click="onAddTableItemClick"
    ) + {{ $t('general.addNew') }}

</template>

<script>
import _ from 'lodash'
import NetworkTemplateSettingItemMixin from '@/mixins/network-template-setting-item.mixin'
import NetworkTemplateSettingFieldSuggestionsMixin from '@/mixins/network-template-setting-field-suggestions.mixin'
import BaseTable from '@/components/v2/base-table/base-table'

export default {
  name: 'ssid-identity-psks',
  mixins: [
    NetworkTemplateSettingItemMixin
  ],
  components: { BaseTable },
  props: {
    templateValue: {
      type: Object
    }
  },
  data: function () {
    return {
      field_key: 'identity_psks',
      tableActions: [
        {
          icon: '$vuetify.icons.delete',
          type: 'remove'
        }
      ],
      computeCounter: 0,
      suggestionFields: [
        'identity_psks__name',
        'name'
      ]
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
          placeholder: this.$t('general.name'),
          componentProps: {
            suggestions: this.getFieldSuggestions('ssids', 'identity_psks__name')
          }
        },
        {
          text: this.$t('v2.merakiTemplates.passphrase'),
          protected: true,
          value: 'passphrase',
          editable: true,
          validations: {
            required: true
          },
          placeholder: this.$t('v2.merakiTemplates.passphrase')
        },
        {
          text: this.$t('v2.merakiTemplates.groupPolicy'),
          value: 'groupPolicyId',
          editable: true,
          validations: {
            required: true
          },
          placeholder: this.$t('v2.merakiTemplates.enterPolicyNameOrId'),
          componentProps: {
            title: this.$t('v2.merakiTemplates.enterPolicyNameOrId'),
            suggestions: this.getFieldSuggestions('group_policies', 'name')
          }
        }
      ]
    },
    tableItems () {
      // eslint-disable-next-line no-unused-expressions
      this.computeCounter

      return !this.isEmpty ? this.settingValue : [this.getEmptyTableItem()]
    }
  },
  methods: {
    getEmptyTableItem () {
      return {
        name: null,
        passphrase: null,
        groupPolicyId: null
      }
    },
    addTableItems (tableItems) {
      this.$emit('settingInput', this.field_key, [
        ...(this.settingValue ? this.settingValue : []),
        ...tableItems
      ])
    },
    onAddTableItemClick () {
      const tableItems = [this.getEmptyTableItem()]
      if (this.isEmpty) {
        // Do twice if the list is already empty, as one item is displayed as placeholder already
        tableItems.push(this.getEmptyTableItem())
      }

      this.addTableItems(tableItems)
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
      if (this.isEmpty) {
        this.addTableItems([tableItem])
      }

      this.$emit('itemInput', tableItem, field, value)
    },
    onTableItemFocus (tableItem, field, parent, setting) {
      if (field === 'name') {
        return NetworkTemplateSettingFieldSuggestionsMixin.methods.onTableItemFocus.bind(this)(tableItem, field, 'identity_psks', 'ssids')
      } else if (field === 'groupPolicyId') {
        return NetworkTemplateSettingFieldSuggestionsMixin.methods.onTableItemFocus.bind(this)(tableItem, 'name', null, 'group_policies')
      }
    },
    getFieldSuggestions (setting, field) {
      const suggestions =
        NetworkTemplateSettingFieldSuggestionsMixin.methods.getFieldSuggestions.bind(this)(setting, field) || []

      // For groupPolicyId field, insert names for group policies defined on the template
      if (setting === 'group_policies' && field === 'name') {
        const templateGroupPolicyNames = (this.templateValue.group_policies || []).map(item => item.name).sort()

        // Group policy names from template + group policy names from other organization templates / networks
        return _.uniq(templateGroupPolicyNames.concat(suggestions))
      }

      return suggestions
    }
  }
}
</script>

<style scoped lang="scss">
  @import "styles/v2/colors.scss";

  .ssid-identity-psks {
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
