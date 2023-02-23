<template lang="pug">
  .switch-profile
    v-layout(row wrap).switch-profile__row
      v-flex(xs6 md4 lg3 xl2)
        label {{ $t('general.name') }}
      v-flex(xs6 md4 lg3 xl2)
        base-text-input(
          :value="value.name"
          @input="onFieldInput('name', $event)"
          :placeholder="$t('v2.merakiTemplates.switchProfileNamePlaceholder')"
          :validations="{required: true}"
          :show-validation-state="showFieldValidationState"
          :suppress-validation-state-display="suppressValidationStateDisplay"
          :disabled="isFixed"
          @focus="fetchFieldSuggestions(field_key, 'name')"
          :suggestions="getFieldSuggestions(field_key, 'name')"
        )

    v-layout(row wrap).switch-profile__row
      v-flex(xs6 md4 lg3 xl2)
        label {{ $t('general.model') }}
      v-flex(xs6 md4 lg3 xl2)
        base-select(
          :items="modelOptions"
          :value="value.switch_model"
          @input="onFieldInput('switch_model', $event)"
          :validations="{required: true}"
          :show-validation-state="showFieldValidationState"
          :suppress-validation-state-display="suppressValidationStateDisplay"
          :disabled="isFixed"
          clearable
        )

    v-layout(row wrap).switch-profile__row
      v-flex(xs6 md4 lg3 xl2)
        label {{ $t('v2.merakiTemplates.ports') }}
      v-flex(xs6 md8 lg9 xl6)
        base-table(
          :items="portsTableItems"
          :headers="portsTableHeaders"
          :actions="portsTableActions"
          @actionClick="onTableActionClick"
          @itemInput="onTableItemInput"
          @itemFocus="onTableItemFocus(...arguments, 'ports')"
          :always-editable="true"
          :sortable="false"
          :show-field-validation-state="showFieldValidationState"
          :suppress-field-validation-state-display="isTableEmpty"
          index-keyed
          :is-fixed="isFixed"
        )

        span.switch-profile__add-chart-item-trigger(
          v-if="!isFixed"
          @click="onAddChartItemClick"
        ) + {{ $t('general.addNew') }}

    .switch-profile__actions(
      v-if="!isFixed"
    )
      v-icon.switch-profile__actions__action(
        @click="onDeleteProfileClick"
      ) $vuetify.icons.delete

</template>

<script>
import _ from 'lodash'
import BaseTable from '@/components/v2/base-table/base-table'
import BaseSelect from '@/components/v2/base-select/base-select'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import NetworkSettingOperationModeMixin from '@/mixins/network-setting-operation-mode.mixin'
import NetworkTemplateSettingFieldSuggestionsMixin from '@/mixins/network-template-setting-field-suggestions.mixin'
import { POSITIVE_INTEGER_INPUT_PROPS } from '@/constants/form-fields'
import { getEmptySwitchProfilePort } from './factories'

export default {
  name: 'switch-profile',
  components: {
    BaseTable,
    BaseTextInput,
    BaseSelect
  },
  mixins: [
    NetworkSettingOperationModeMixin,
    NetworkTemplateSettingFieldSuggestionsMixin
  ],
  props: {
    value: {
      required: true
    },
    showFieldValidationState: {
      type: Boolean,
      default: false
    },
    suppressValidationStateDisplay: {
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
      field_key: 'switch_profiles',
      portsTableActions: [
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
      modelOptions: [
        'MS120-24P',
        'MS120-48FP',
        'MS120-48LP',
        'MS120-8FP',
        'MS120-8LP',
        'MS125-24P',
        'MS125-48FP',
        'MS210-24P',
        'MS210-48FP',
        'MS210-48LP',
        'MS220-24P',
        'MS220-48FP',
        'MS220-48LP',
        'MS220-8P',
        'MS225-24P',
        'MS225-48FP',
        'MS225-48LP',
        'MS22P',
        'MS250-24P',
        'MS250-48FP',
        'MS250-48LP',
        'MS320-24P',
        'MS320-48FP',
        'MS350-24P',
        'MS350-24X',
        'MS350-48FP',
        'MS350-48LP',
        'MS355-24X',
        'MS355-24X2',
        'MS355-48X',
        'MS355-48X2',
        'MS390-24',
        'MS390-24P',
        'MS390-24U',
        'MS390-24UX',
        'MS390-48',
        'MS390-48P',
        'MS390-48U',
        'MS390-48UX',
        'MS390-48UX2',
        'MS410-16',
        'MS410-32',
        'MS420-24',
        'MS420-48',
        'MS425-16',
        'MS425-32',
        'MS42P',
        'MS450-12'
      ].map(model => {
        return {
          key: model,
          name: model
        }
      }),
      computeCounter: 0,
      suggestionFields: ['ports__portId', 'ports__name']
    }
  },
  computed: {
    portsTableHeaders () {
      return [
        {
          text: this.$t('v2.merakiTemplates.portId'),
          value: 'portId',
          editable: true,
          type: Number,
          fixedWidth: '120px',
          placeholder: this.$t('v2.placeholders.portId'),
          componentProps: {
            ...POSITIVE_INTEGER_INPUT_PROPS,
            title: this.$t('v2.placeholders.portId'),
            suggestions: this.getFieldSuggestions(this.field_key, 'ports__portId')
          },
          validations: {
            required: true
          }
        },
        {
          text: this.$t('general.name'),
          value: 'name',
          editable: true,
          componentProps: {
            suggestions: this.getFieldSuggestions(this.field_key, 'ports__name')
          }
        },
        {
          text: this.$t('general.enabled'),
          value: 'enabled',
          editable: true,
          type: Boolean,
          validations: {
            required: true
          }
        },
        {
          text: this.$t('wifi.type'),
          value: 'type',
          editable: false,
          formatter: this.portTypeCellFormatter
        }
      ]
    },
    isTableEmpty () {
      return _.isNil(this.value.ports) || _.isEmpty(this.value.ports)
    },
    portsTableItems () {
      // eslint-disable-next-line no-unused-expressions
      this.computeCounter

      return !this.isTableEmpty ? this.value.ports : [this.getEmptyTableItem()]
    }
  },
  methods: {
    getEmptyTableItem () {
      return getEmptySwitchProfilePort()
    },
    addTableItems (tableItems) {
      this.$emit('itemInput', this.value, 'ports', [
        ...(this.value.ports ? this.value.ports : []),
        ...tableItems
      ])
    },
    onFieldInput (field, value) {
      this.$emit('itemInput', this.value, field, value)
    },
    onTableActionClick (action, tableItem) {
      if (action === 'remove') {
        if (this.isTableEmpty) {
          this.computeCounter += 1 // Force re-compute of table items so that row re-renders
          return
        }

        const itemIndex = this.value.ports.indexOf(tableItem)
        this.$emit('input', {
          ...this.value,
          ports: this.value.ports.filter((item, index) => {
            return index !== itemIndex
          })
        })
      } else if (action === 'edit') {
        this.$emit('portDetailViewClick', this.portsTableItems.indexOf(tableItem))
      }
    },
    onTableItemInput (tableItem, field, value) {
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
    },
    onDeleteProfileClick () {
      this.$emit('deleteClick')
    },
    portTypeCellFormatter (value) {
      return this.$t(`v2.merakiTemplates.${value}`)
    }
  }
}
</script>

<style scoped lang="scss">
  @import "styles/v2/colors.scss";

  .switch-profile {
    position: relative;

    &__row {
      margin-top: 10px;
    }

    label {
      line-height: 40px;
    }

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

    &__actions {
      position: absolute;
      right: 10px;
      top: 10px;

      &__action {
        font-size: 16px;
        vertical-align: middle;
        margin-left: 10px;
        cursor: pointer;
      }
    }
  }

</style>
