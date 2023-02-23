<template lang="pug">
  .traffic-shaping-rules
    base-table(
      :items="tableItems"
      :headers="tableHeaders"
      :actions="tableActions"
      @actionClick="onTableActionClick"
      @itemInput="onTableItemInput"
      @itemReOrder="onTableItemReorder"
      :show-indices="true"
      :draggable="true"
      :sortable="false"
      :always-editable="true"
      :show-field-validation-state="showFieldValidationState"
      :suppress-field-validation-state-display="isEmpty"
      :is-fixed="isFixed"
      :generate-keys="true"
    )
    span.traffic-shaping-rules__add-chart-item-trigger(
      v-if="!isFixed"
      @click="onAddRuleClick"
    ) + {{ $t('general.addNew') }}

</template>

<script>
import BaseTable from '@/components/v2/base-table/base-table'
import BandwidthLimitCell from './traffic-shaping-bandwidth-limit-cell'
import DefinitionsCell from './traffic-shaping-definitions-cell'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import NetworkSettingOperationModeMixin from '@/mixins/network-setting-operation-mode.mixin'
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  name: 'traffic-shaping-rules',
  components: { BaseTable },
  mixins: [
    CurrentNodeSelectionsMixin,
    NetworkSettingOperationModeMixin
  ],
  props: {
    value: {
      required: true
    },
    target: {
      type: String,
      default: 'mx'
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
      targets: {
        mx: 'mx',
        mr: 'mr'
      },
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
    if (!this.trafficShapingApplicationCategories || this.trafficShapingApplicationCategories.length === 0) {
      this.fetchTrafficShapingApplicationCategories({
        workspaceId: this.workspaceId
      })
    }

    // If not stored, fetch dscp tags
    if (!this.trafficShapingDscpTags || this.trafficShapingDscpTags.length === 0) {
      this.fetchTrafficShapingDscpTags({
        workspaceId: this.workspaceId
      })
    }
  },
  computed: {
    ...mapGetters('workspace/network', ['trafficShapingApplicationCategories', 'trafficShapingDscpTags']),
    isEmpty () {
      return _.isNil(this.value) || _.isEmpty(this.value)
    },
    tableItems () {
      // eslint-disable-next-line no-unused-expressions
      this.computeCounter

      return !this.isEmpty ? this.value : [this.getEmptyTableItem()]
    },
    dscpTagOptions () {
      return this.trafficShapingDscpTags.map(item => {
        return {
          key: item.value,
          name: item.description
        }
      })
    },
    tableHeaders () {
      const headers = [
        {
          text: this.$t('v2.merakiTemplates.definition'),
          value: 'definitions',
          editable: true,
          type: Array,
          cellComponent: DefinitionsCell,
          width: '400px'
        },
        {
          text: this.$t('v2.merakiTemplates.bandwidthLimit'),
          value: 'perClientBandwidthLimits',
          editable: true,
          cellComponent: BandwidthLimitCell,
          width: '400px'
        },
        {
          text: this.$t('v2.merakiTemplates.dscpTagging'),
          value: 'dscpTagValue',
          width: '400px',
          editable: true,
          options: this.dscpTagOptions,
          componentProps: {
            clearable: true
          }
        }
      ]

      if (this.target === this.targets.mx) {
        // Add extra headers for mx
        headers.splice(2, 0, {
          text: this.$t('v2.merakiTemplates.priority'),
          value: 'priority',
          editable: true,
          width: '120px',
          options: [
            {
              key: 'low',
              name: this.$t('v2.merakiTemplates.low')
            },
            {
              key: 'normal',
              name: this.$t('v2.merakiTemplates.normal')
            },
            {
              key: 'high',
              name: this.$t('v2.merakiTemplates.high')
            }
          ],
          validations: {
            required: this.isTemplateMode
          }
        })
      } else if (this.target === this.targets.mr) {
        // Add extra headers for mr
        headers.splice(2, 0, {
          text: this.$t('v2.merakiTemplates.pcpTagging'),
          value: 'pcpTagValue',
          editable: true,
          width: '60px',
          options: [0, 1, 2, 3, 4, 5, 6, 7].map(option => {
            return {
              key: option,
              name: option
            }
          }),
          componentProps: {
            clearable: true
          }
        })
      }

      return headers
    }
  },
  methods: {
    ...mapActions('workspace/network', ['fetchTrafficShapingApplicationCategories', 'fetchTrafficShapingDscpTags']),
    getEmptyTableItem () {
      return this.target === this.targets.mx ? {
        priority: null,
        definitions: [],
        dscpTagValue: null,
        perClientBandwidthLimits: {
          settings: null
        }
      } : {
        definitions: [],
        dscpTagValue: null,
        pcpTagValue: null,
        perClientBandwidthLimits: {
          settings: null
        }
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

  .traffic-shaping-rules {
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
