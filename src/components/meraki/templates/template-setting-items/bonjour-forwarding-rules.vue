<template lang="pug">
  .bonjour-forwarding-rules
    base-table(
      :items="tableItems"
      :headers="tableHeaders"
      :actions="tableActions"
      @actionClick="onTableActionClick"
      @itemInput="onTableItemInput"
      :sortable="false"
      :always-editable="true"
      :show-field-validation-state="showFieldValidationState"
      :suppress-field-validation-state-display="isEmpty"
      :is-fixed="isFixed"
      index-keyed
    )
    span.bonjour-forwarding-rules__add-chart-item-trigger(
      v-if="!isFixed"
      @click="onAddRuleClick"
    ) + {{ $t('general.addNew') }}

</template>

<script>
import BaseTable from '@/components/v2/base-table/base-table'
import { isValidVlan } from '@/utils/form-fields-validation-rules'
import { VLAN_INPUT_PROPS } from '@/constants/form-fields'
import _ from 'lodash'

export default {
  name: 'bonjour-forwarding-rules',
  components: { BaseTable },
  props: {
    value: {
      required: true
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
      tableHeaders: [
        {
          text: this.$t('general.description'),
          value: 'description',
          editable: true,
          width: '120px',
          validations: {
            required: true
          }
        },
        {
          text: this.$t('v2.merakiTemplates.serviceVlan'),
          value: 'vlanId',
          editable: true,
          width: '80px',
          placeholder: this.$t('v2.placeholders.vlanId'),
          validations: {
            required: true,
            methods: [{
              method: isValidVlan
            }]
          },
          componentProps: VLAN_INPUT_PROPS
        },
        {
          text: this.$t('v2.merakiTemplates.services'),
          value: 'services',
          editable: true,
          type: Array,
          width: '300px',
          options: ['All Services', 'AirPlay', 'AFP', 'BitTorrent', 'FTP', 'iChat', 'iTunes', 'Printers',
            'Samba', 'Scanners', 'SSH'].map(option => {
            return {
              key: option,
              name: option
            }
          }),
          validations: {
            required: true
          }
        }
      ],
      tableActions: [
        {
          icon: '$vuetify.icons.delete',
          type: 'remove'
        }
      ],
      computeCounter: 0
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
    }
  },
  methods: {
    getEmptyTableItem () {
      return {
        description: null,
        vlanId: null,
        services: []
      }
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
      // If inputted a value for placeholder item, add it to the list of items first
      if (this.isEmpty) {
        this.addTableItems([{ ...tableItem, [field]: value }])
      } else {
        this.$emit('itemInput', tableItem, field, value)
      }
    },
    onAddRuleClick () {
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

  .bonjour-forwarding-rules {
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
