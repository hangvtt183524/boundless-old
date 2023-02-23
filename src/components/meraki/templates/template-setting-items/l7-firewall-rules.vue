<template lang="pug">
  .l7-firewall-rules
    base-table(
      :items="tableItems"
      :headers="tableHeaders"
      :actions="tableActions"
      @actionClick="onTableActionClick"
      @itemInput="onTableItemInput"
      @itemReOrder="onTableItemReorder"
      :show-indices="true"
      :draggable="operationMode === operationModes.template"
      :sortable="false"
      :always-editable="true"
      :show-field-validation-state="showFieldValidationState"
      :suppress-field-validation-state-display="isEmpty"
      :is-fixed="isFixed"
    )
    span.l7-firewall-rules__add-chart-item-trigger(
      v-if="!isFixed"
      @click="onAddRuleClick"
    ) + {{ $t('general.addNew') }}

</template>

<script>
import BaseTable from '@/components/v2/base-table/base-table'
import FirewallRulSetL7ApplicationCell from '@/components/meraki/common/cell-components/firewall-rule-set-l7-application-cell'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import NetworkSettingOperationModeMixin from '@/mixins/network-setting-operation-mode.mixin'
import { getEmptyL7FirewallRule } from './factories'
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'l7-firewall-rules',
  components: { BaseTable },
  mixins: [
    CurrentNodeSelectionsMixin,
    NetworkSettingOperationModeMixin
  ],
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
          text: this.$t('wifi.policy'),
          value: 'policy',
          editable: true,
          width: '100px',
          options: [
            {
              key: 'deny',
              name: this.$t('wifi.deny')
            }
          ]
        },
        {
          text: this.$t('wifi.application'),
          value: 'value',
          editable: true,
          options: [],
          cellComponent: FirewallRulSetL7ApplicationCell
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
  mounted () {
    // If not stored, fetch application categories
    if (this.l7ApplicationCategories.length === 0) {
      this.fetchL7ApplicationCategories({
        workspaceId: this.workspaceId
      })
    }
  },
  computed: {
    ...mapGetters('workspace/network', ['l7ApplicationCategories']),
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
    ...mapActions('workspace/network', ['fetchL7ApplicationCategories']),
    getEmptyTableItem () {
      return getEmptyL7FirewallRule()
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
        tableItem[field] = value
        this.addTableItems([tableItem])
      } else {
        this.$emit('itemInput', tableItem, field, value)
      }
    },
    onTableItemReorder (oldIndex, newIndex) {
      // Create a shallow clone of rules array first
      let rules = _.clone(this.value)

      // Now move the items in this array
      const movedItem = rules.splice(oldIndex, 1)[0]
      rules.splice(newIndex, 0, movedItem)

      this.$emit('input', rules)
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

  .l7-firewall-rules {
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
