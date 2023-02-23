<template lang="pug">
  template-setting-item.snmp(
    :title="$t('v2.merakiTemplates.snmp')"
    :operation-mode="operationMode"
    :customizations="customizations"
    :setting-fields="[field_key]"
    customizations-enabled
    @customizationsClick="$emit('customizationsClick', $event)"
  )
    template(v-slot:default)
      v-layout(row wrap).template-setting-item__content__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.access') }}
        v-flex(xs6 md4 lg3 xl2)
          base-select(
            :items="accessOptions"
            :value="settingValue.access"
            @input="onFieldInput('access', $event)"
            :validations="{required: isTemplateMode}"
            :show-validation-state="showFieldValidationState"
            :suppress-validation-state-display="isEmpty"
            :disabled="isFixed"
            clearable
          )

      v-layout(row wrap).template-setting-item__content__row(
        v-if="settingValue.access === 'community'"
      )
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.communityString') }}
        v-flex(xs6 md4 lg3 xl2)
          base-text-input(
            :value="settingValue.communityString"
            @input="onFieldInput('communityString', $event)"
            :placeholder="$t('v2.merakiTemplates.snmpCommunityStringPlaceholder')"
            :validations="{required: isTemplateMode}"
            :show-validation-state="showFieldValidationState"
            :disabled="isFixed"
            @focus="fetchFieldSuggestions(field_key, 'communityString')"
            :suggestions="getFieldSuggestions(field_key, 'communityString')"
          )

      v-layout(row wrap).template-setting-item__content__row(
        v-if="settingValue.access === 'users'"
      )
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.users') }}
        v-flex(xs6 md8 lg6 xl4)
          base-table(
            :items="userTableItems"
            :headers="userTableHeaders"
            :actions="userTableActions"
            @actionClick="onUserActionClick"
            @itemInput="onUserItemInput"
            @itemFocus="onTableItemFocus(...arguments, 'users')"
            :always-editable="true"
            :show-field-validation-state="showFieldValidationState"
            :is-fixed="isFixed"
            index-keyed
          )
          span.snmp__add-chart-item-trigger(
            v-if="!isFixed"
            @click="onAddChartItemClick"
          ) + {{ $t('general.addNew') }}

</template>

<script>
import TemplateSettingItem from './template-setting-item'
import NetworkTemplateSettingItemMixin from '@/mixins/network-template-setting-item.mixin'
import BaseSelect from '@/components/v2/base-select/base-select'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import BaseTable from '@/components/v2/base-table/base-table'
import _ from 'lodash'

export default {
  name: 'snmp',
  mixins: [
    NetworkTemplateSettingItemMixin
  ],
  components: { BaseTable, BaseSelect, BaseTextInput, TemplateSettingItem },
  data: function () {
    return {
      field_key: 'snmp_settings',
      accessOptions: [
        {
          key: 'none',
          name: this.$t('general.disabled')
        },
        {
          key: 'community',
          name: this.$t('v2.merakiTemplates.communityAccess')
        },
        {
          key: 'users',
          name: this.$t('v2.merakiTemplates.userAccess')
        }
      ],
      userTableActions: [
        {
          icon: '$vuetify.icons.delete',
          type: 'remove'
        }
      ],
      computeCounter: 0,
      suggestionFields: ['users__username']
    }
  },
  computed: {
    userTableHeaders () {
      return [
        {
          text: this.$t('general.username'),
          value: 'username',
          editable: true,
          validations: {
            required: true
          },
          placeholder: this.$t('v2.merakiTemplates.snmpUsernamePlaceholder'),
          componentProps: {
            suggestions: this.getFieldSuggestions(this.field_key, 'users__username')
          }
        },
        {
          text: this.$t('v2.merakiTemplates.passphrase'),
          value: 'passphrase',
          editable: true,
          protected: true,
          validations: {
            required: true
          },
          placeholder: this.$t('v2.merakiTemplates.snmpPasswordPlaceholder')
        }
      ]
    },
    isTableEmpty () {
      return _.isNil(this.settingValue.users) || _.isEmpty(this.settingValue.users)
    },
    userTableItems () {
      // eslint-disable-next-line no-unused-expressions
      this.computeCounter

      return !this.isTableEmpty ? this.settingValue.users : [this.getEmptyTableItem()]
    },
    nonConfiguredValue () {
      return {}
    }
  },
  methods: {
    getEmptyTableItem () {
      return {
        username: null,
        passphrase: null
      }
    },
    addTableItems (tableItems) {
      this.$emit('settingInput', this.field_key, {
        ...this.settingValue,
        users: [
          ...(this.settingValue.users ? this.settingValue.users : []),
          ...tableItems
        ]
      })
    },
    onFieldInput (field, value) {
      this.$emit('settingInput', this.field_key, {
        ...this.settingValue,
        [field]: value
      })
    },
    onUserActionClick (action, tableItem) {
      if (action === 'remove') {
        if (this.isTableEmpty) {
          this.computeCounter += 1 // Force re-compute of table items so that row re-renders
          return
        }

        const itemIndex = this.settingValue.users.indexOf(tableItem)
        this.$emit('settingInput', this.field_key, {
          ...this.settingValue,
          users: this.settingValue.users.filter((item, index) => {
            return index !== itemIndex
          })
        })
      }
    },
    onUserItemInput (tableItem, field, value) {
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
    }
  }
}
</script>

<style scoped lang="scss">
  @import "styles/v2/colors.scss";

  .snmp {
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
