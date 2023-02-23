<template lang="pug">
  div(
    :class="['base-table', {'base-table--large': hasEditableHeader}, {'base-table--no-background': noBackground}, {'base-table--with-separator': withSeparator}, {'base-table--has-page-buttons': pageButtons.length > 0}]"
  )
    div(
      v-if="tableTitle"
    ) {{ tableTitle }}

    .base-table__scroll-holder(
      :options="scrollBarOptions"
      @ps-y-reach-end="$emit('loadMore')"
    )
      v-data-table.base-data-table.base-data-table--fixed-header(
        :items="items"
        :headers="displayedHeaders"
        hide-actions
        :pagination.sync="isExternalSort ? null : pagination"
        disable-initial-sort
        :item-key="itemKey"
        ref="dataTable"
      )
        template(
          v-slot:headers
        )
          tr
            th(
              :class="['header-cell', 'column', 'sortable', {[header.customClass]: header.customClass}, {'header-cell--highlighted': header.highlighted}, pagination.descending ? 'desc' : 'asc', getHeaderSortKey(header) === pagination.sortBy ? 'active' : '']"
              v-for='header of displayedHeaders'
              :key='header.value'
              :style="`min-width: ${header.width ? header.width : 'auto'}; width: ${header.fixedWidth ? header.fixedWidth : 'auto'}; max-width: ${header.maxWidth ? header.maxWidth : 'auto'}`"
              @click="changeSort(header)"
            )
              | {{ header.text }}
              v-icon.no-rotate(
                v-if="sortable !== false && header.sortable !== false"
                small
              ) arrow_drop_up
              component(
                v-if="header.headMore"
                v-bind:is="header.headMore.component"
                v-bind="header.headMore.props"
                @input="onHeadMoreInput(header, $event)"
              )

        template(
          v-slot:items="props"
        )
          tr(
            :key="getItemKey(props.item)"
            @click="onRowClick(props.item)"
            :class="['base-table-row', {'selected': selectedRow === props.item}, {'selectable': selectable}, {'clickable': isRowClickable(props.item) || (isExpandable && expandOnRowClick) || (multiSelectable && selectOnRowClick)}, {'base-table-row--expanded': props.expanded}, {'base-table-row--even': props.index % 2 === 0}, {'base-table-row--odd': props.index % 2 === 1}]"
          )
            td(
              :class="['base-table-cell', {'base-table-cell--action-cell': header.value === '_actions'}, {[header.cellClass]: header.cellClass}]"
              v-for="header of displayedHeaders"
              :key="header.value"
              @click="onCellClick(props.item, header)"
            )
              template(
                v-if="header.value === '_indices'"
              )
                | {{ props.index + 1 }}
              template(
                v-else-if="header.value === '_actions'"
              )
                v-tooltip(
                  v-if="isExpandActionVisible(props.item)"
                  bottom color="#223d70" light
                  :disabled="!expandTooltip"
                )
                  template(v-slot:activator="{ on }")
                    v-icon.action-container.action-icon(
                      @click="onExpandClick(props.item); stopPropagation($event)"
                      v-on="on"
                    ) visibility
                  span {{ expandTooltip }}
                v-icon.action-container.action-icon.edit-icon(
                  @click="onEditClick(props.item); stopPropagation($event)"
                  v-if="hasEditableHeader && !alwaysEditable && !isRowEditable(props.item) && !isFixed"
                ) $vuetify.icons.edit
                v-icon.action-container.action-icon.save-icon(
                  @click="onEditClick(props.item); stopPropagation($event)"
                  v-if="hasEditableHeader && !alwaysEditable && isRowEditable(props.item) && !isFixed"
                ) check
                span.action-container(
                  v-for="action of actions"
                  :key="action.type"
                  v-if="isActionVisible(action, props.item)"
                )
                  v-tooltip(
                    bottom color="#223d70" light
                    :disabled="!getActionTooltip(action, props.item)"
                  )
                    template(v-slot:activator="{ on }")
                      v-icon.action-icon(
                        :class="[{'action-icon--disabled': isActionDisabled(action, props.item)}]"
                        @click="onActionClick(action, props.item); stopPropagation($event)"
                        :style="`font-size: ${action.fontSize ? action.fontSize : 'auto'};`"
                        v-on="on"
                      ) {{ action.icon }}
                    span {{ getActionTooltip(action, props.item) }}

                v-icon.action-container.action-icon.drag-handle(
                  v-if="draggable"
                ) drag_handle

              template(
                v-else
              )
                // If a special component is provided for cell, use it. Otherwise use default cell
                component(
                  v-if="header.cellComponent"
                  v-bind:is="header.cellComponent"
                  v-bind="header.componentProps"
                  :value="getCellValue(props.item, header)"
                  @input="onItemInput(props.item, header.value, $event)"
                  @customFieldInput="onItemInput"
                  @focus="onItemFocus(props.item, header.value)"
                  @blur="onItemBlur(props.item, header.value)"
                  @action="onItemAction(props.item, header.value, $event)"
                  :item="props.item"
                  :selected-rows="effectiveSelectedRows"
                  :item-key="itemKey"
                  :options="header.options"
                  :editable="isCellEditable(props.item, header)"
                  :is-fixed="isFixed"
                  :show-validation-state="showFieldValidationState"
                  :suppress-validation-state-display="suppressFieldValidationStateDisplay"
                )
                template(
                  v-else
                )
                  span.inline-full-width(
                    v-if="!isCellEditable(props.item, header)"
                    v-show="isCellContentsVisible(props.item, header)"
                  )
                    template(
                      v-if="header.type && header.type === 'json'"
                    )
                      v-tooltip(right color="#223d70" light :disabled="!(header.tooltip && getCellTooltipValue(props.item, header))")
                        template(v-slot:activator="{ on }")
                          pre(v-on="on") {{ getCellDisplayValue(props.item, header) }}
                        span(v-html="getCellTooltipValue(props.item, header)")

                    template(v-else)
                      v-tooltip(right color="#223d70" light :disabled="!(header.tooltip && getCellTooltipValue(props.item, header))")
                        template(v-slot:activator="{ on }")
                          span.inline-full-width(v-on="on") {{ getCellDisplayValue(props.item, header) }}
                        span(v-html="getCellTooltipValue(props.item, header)")

                  div(
                    v-if="isCellEditable(props.item, header)"
                    v-show="isCellContentsVisible(props.item, header)"
                  )
                    base-multi-select.base-multi-select--small(
                      v-if="header.options && header.type === Array"
                      :value="getCellValue(props.item, header)"
                      @input="onItemInput(props.item, header.value, $event)"
                      @focus="onItemFocus(props.item, header.value)"
                      @blur="onItemBlur(props.item, header.value)"
                      :items="header.options"
                      :validations="header.validations"
                      :show-validation-state="showFieldValidationState"
                      :suppress-validation-state-display="suppressFieldValidationStateDisplay"
                      v-bind="header.componentProps ? header.componentProps : {}"
                      :ref="`input_${header.value}`"
                    )
                    base-select.base-select--small(
                      v-if="header.options && header.type !== Array"
                      :value="getCellValue(props.item, header)"
                      @input="onItemInput(props.item, header.value, $event)"
                      @focus="onItemFocus(props.item, header.value)"
                      @blur="onItemBlur(props.item, header.value)"
                      :items="header.options"
                      :validations="header.validations"
                      :case-insensitive-keys="!!header.caseInsensitiveKeys"
                      :show-validation-state="showFieldValidationState"
                      :suppress-validation-state-display="suppressFieldValidationStateDisplay"
                      :search-enabled="header.optionsSearchEnabled || false"
                      :search-placeholder="header.optionsSearchPlaceholder || ''"
                      v-bind="header.componentProps ? header.componentProps : {}"
                      :ref="`input_${header.value}`"
                    )
                    base-switch(
                      v-if="!header.options && header.type === Boolean && header.component !== 'check_box'"
                      :value="getCellValue(props.item, header)"
                      @input="onItemInput(props.item, header.value, $event)"
                      @focus="onItemFocus(props.item, header.value)"
                      @blur="onItemBlur(props.item, header.value)"
                      v-bind="header.componentProps ? header.componentProps : {}"
                      :ref="`input_${header.value}`"
                    )
                    base-check-box.base-check-box--small(
                      v-if="!header.options && header.type === Boolean && header.component === 'check_box'"
                      :value="getCellValue(props.item, header)"
                      @input="onItemInput(props.item, header.value, $event)"
                      @focus="onItemFocus(props.item, header.value)"
                      @blur="onItemBlur(props.item, header.value)"
                      v-bind="header.componentProps ? header.componentProps : {}"
                      :ref="`input_${header.value}`"
                    )
                    multi-text-input.multi-text-input--small(
                      v-if="!header.options && header.type === Array"
                      :value="getCellValue(props.item, header)"
                      @input="onItemInput(props.item, header.value, $event)"
                      @focus="onItemFocus(props.item, header.value)"
                      @blur="onItemBlur(props.item, header.value)"
                      :validations="header.validations"
                      :placeholder="getCellPlaceholderValue(props.item, header)"
                      :show-validation-state="showFieldValidationState"
                      :suppress-validation-state-display="suppressFieldValidationStateDisplay"
                      v-bind="header.componentProps ? header.componentProps : {}"
                      :ref="`input_${header.value}`"
                    )
                    base-text-input.base-text-input--small(
                      v-if="!header.options && header.type !== Boolean && header.type !== Array && !header.protected"
                      :value="getCellValue(props.item, header)"
                      @input="onItemInput(props.item, header.value, $event)"
                      @focus="onItemFocus(props.item, header.value)"
                      @blur="onItemBlur(props.item, header.value)"
                      :validations="header.validations"
                      :placeholder="getCellPlaceholderValue(props.item, header)"
                      :show-validation-state="showFieldValidationState"
                      :suppress-validation-state-display="suppressFieldValidationStateDisplay"
                      v-bind="header.componentProps ? header.componentProps : {}"
                      :ref="`input_${header.value}`"
                    )
                    protected-input.base-text-input--small(
                      v-if="!header.options && header.type !== Boolean && header.protected"
                      :value="getCellValue(props.item, header)"
                      @input="onItemInput(props.item, header.value, $event)"
                      @focus="onItemFocus(props.item, header.value)"
                      @blur="onItemBlur(props.item, header.value)"
                      :validations="header.validations"
                      :placeholder="getCellPlaceholderValue(props.item, header)"
                      :show-validation-state="showFieldValidationState"
                      :suppress-validation-state-display="suppressFieldValidationStateDisplay"
                      v-bind="header.componentProps ? header.componentProps : {}"
                      :ref="`input_${header.value}`"
                    )

        template(
          v-slot:expand="props"
          v-if="isExpandable"
        )
          slot.base-table__expand-content(
            name="row-expand-area"
            :props="props"
          )

        template(
          slot="no-data"
        )
          div

    .base-table__pagination(
      v-if="customPagination && customPagination.pageSize"
    )
      .base-table__pagination__page-size-select
        base-select.base-select--small(
          :value="customPagination.pageSize"
          :items="effectivePageSizeOptions"
          :label="$t('general.rowsPerPageText')"
          @input="onPageSizeInput"
        )

      .base-table__pagination__page-buttons(
        v-show="pageButtons.length > 0"
      )
        .base-table__pagination__page-button(
          v-for="(page, index) of pageButtons"
          :class="[{'base-table__pagination__page-button--current': customPagination.page === page}, {'base-table__pagination__page-button--separator': page === '...'}]"
          :key="index"
          @click="onPageLinkClick(page)"
        ) {{ page }}

    .list-empty-state(
      v-if="!!emptyStateMessage && !(items && items.length > 0)"
    )
      .list-empty-state__message
        | {{ emptyStateMessage }}

</template>

<script>
import _ from 'lodash'
import BaseTextInput from '../base-text-input/base-text-input.vue'
import ProtectedInput from '../protected-input/protected-input.vue'
import BaseSelect from '../base-select/base-select.vue'
import BaseSwitch from '../base-switch/base-switch.vue'
import BaseMultiSelect from '../base-multi-select/base-multi-select.vue'
import MultiTextInput from '../multi-text-input/multi-text-input.vue'
import BaseCheckBox from '../base-check-box/base-check-box'
import ListSelectCell from '@/components/v2/base-table/column-components/list-select-cell'
import ListSelectHeaderCell from '@/components/v2/base-table/column-components/list-select-header-cell'
import Sortable from 'sortablejs/modular/sortable.complete.esm'
import TemplateSettingCategoryListItem
  from '../../meraki/templates/template-setting-category-list-item/template-setting-category-list-item'

export default {
  name: 'BaseTable',
  components: {
    BaseCheckBox,
    TemplateSettingCategoryListItem,
    BaseTextInput,
    ProtectedInput,
    BaseSelect,
    BaseSwitch,
    BaseMultiSelect,
    MultiTextInput
  },
  props: {
    headers: {
      type: Array,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    totalItems: {
      type: Number,
      required: false
    },
    itemKey: {
      type: String,
      default: 'id'
    },
    indexKeyed: {
      type: Boolean,
      default: false
    },
    generateKeys: {
      type: Boolean,
      default: false
    },
    tableTitle: {
      type: String
    },
    actions: {
      type: Array,
      required: false
    },
    showIndices: {
      type: Boolean
    },
    draggable: {
      type: Boolean,
      default: false
    },
    sortable: {
      type: Boolean,
      default: true
    },
    rowClickable: {
      type: Boolean,
      default: false
    },
    clickableRowFilter: {
      type: Function,
      required: false
    },
    selectedRow: {
      type: Object,
      required: false
    },
    selectedRows: {
      type: Array,
      required: false
    },
    selectable: {
      type: Boolean,
      default: false
    },
    multiSelectable: {
      type: Boolean,
      default: false
    },
    totalSelectable: { // Does not take effect if maxSelectCount is present
      type: Boolean,
      default: false
    },
    isTotalSelected: {
      type: Boolean,
      default: false
    },
    selectableRowFilter: {
      type: Function,
      required: false
    },
    maxSelectCount: {
      type: Number,
      required: false
    },
    selectOnRowClick: {
      type: Boolean,
      default: false
    },
    isExpandable: {
      type: Boolean,
      default: false
    },
    expandOnRowClick: {
      type: Boolean,
      default: false
    },
    expandTooltip: {
      type: String,
      requireD: false
    },
    expandableRowFilter: {
      type: Function,
      required: false
    },
    noBackground: {
      type: Boolean,
      default: false
    },
    alwaysEditable: {
      type: Boolean,
      default: false
    },
    customPagination: {
      type: Object,
      required: false
    },
    isExternalSort: {
      type: Boolean,
      default: false
    },
    initialSortKey: {
      type: String,
      required: false
    },
    withSeparator: {
      type: Boolean,
      default: false
    },
    showFieldValidationState: {
      type: Boolean,
      default: false
    },
    suppressFieldValidationStateDisplay: {
      type: Boolean,
      default: false
    },
    isFixed: {
      type: Boolean,
      default: false
    },
    pageSizeOptions: {
      type: Array,
      default: () => {
        return [5, 10, 20, 50]
      }
    },
    actionsLabel: {
      type: String,
      required: false
    },
    actionsHeadMore: {
      type: Object,
      required: false
    },
    emptyStateMessage: {
      type: String,
      required: false
    }
  },
  data: function () {
    return {
      itemKeys: new WeakMap(),
      currentItemKey: 0,
      scrollBarOptions: {
        wheelPropagation: true,
        suppressScrollY: true
      },
      editableRows: [],
      localSelectedRows: [],
      pagination: this.sortable ? {
        sortBy: this.initialSortKey ? this.initialSortKey : 'type',
        rowsPerPage: 1000
      } : {
        rowsPerPage: 1000
      }
    }
  },
  mounted () {
    // If table is set to be sortable, initialize soring functionality
    if (this.draggable) {
      Sortable.create(
        this.$refs.dataTable.$el.getElementsByTagName('tbody')[0],
        {
          draggable: 'tbody tr',
          handle: '.drag-handle',
          onEnd: this.onDragSortEnd
        }
      )
    }
    var vm = this
    var scrollEl = vm.$refs.dataTable.$el.getElementsByClassName('v-table__overflow')[0]
    if (scrollEl) {
      scrollEl.addEventListener('scroll', function () {
        if (this.scrollTop + this.clientHeight >= this.scrollHeight - 10) {
          vm.$emit('loadMore')
        }
      })
    }
  },
  computed: {
    selectableItems () {
      return !this.selectableRowFilter ? this.items : this.items.filter(item => this.selectableRowFilter(item))
    },
    effectiveSelectedRows () {
      return this.selectedRows ? this.selectedRows : this.localSelectedRows
    },
    isAllSelected () {
      return this.effectiveSelectedRows.length > 0 && this.effectiveSelectedRows.length === this.selectableItems.length
    },
    totalCount () {
      if (this.customPagination) {
        return this.customPagination.total
      }

      if (this.totalItems !== undefined) {
        return this.totalItems
      }

      return null
    },
    displayedHeaders () {
      const headers = this.headers.map(header => {
        return header
      })

      if (this.multiSelectable) {
        headers.unshift({
          value: '_selected',
          text: '',
          customClass: 'header-cell--selection-cell',
          cellComponent: ListSelectCell,
          componentProps: {
            selectableRowFilter: this.selectableRowFilter,
            maxSelectCount: this.maxSelectCount
          },
          sortable: false,
          selectable: false,
          headMore: {
            component: ListSelectHeaderCell,
            props: {
              value: this.isAllSelected,
              totalSelectable: this.totalSelectable,
              isTotalSelected: this.isTotalSelected,
              totalItems: this.totalCount,
              isMultiPage: (this.totalCount || 0) > this.items.length,
              hasSelectableRowFilter: !!this.selectableRowFilter,
              selectedRows: this.effectiveSelectedRows,
              maxSelectCount: this.maxSelectCount
            }
          }
        })
      }

      if (this.showIndices) {
        headers.unshift({
          value: '_indices',
          text: '#',
          customClass: 'header-cell--indices-cell'
        })
      }

      if (this.displayActions) {
        headers.push({
          value: '_actions',
          text: this.actionsLabel ? this.actionsLabel : this.$t('general.actions'),
          headMore: this.actionsHeadMore ? this.actionsHeadMore : null,
          customClass: 'header-cell--actions-cell',
          sortable: false
        })
      }

      return headers
    },
    hasEditableHeader: function () {
      return this.headers.filter(header => { return header.editable === true }).length > 0
    },
    displayActions: function () {
      return (
        (
          (this.actions && this.actions.filter(action => {
            return this.isFixed ? action.validForFixed : true
          }).length > 0) || (
            (this.draggable || (this.hasEditableHeader && !this.alwaysEditable)) && !this.isFixed
          )
        )
      ) || this.isExpandable
    },
    pageButtons: function () {
      const pageButtons = []

      if (this.customPagination && this.customPagination.pageSize) {
        const pageCount = Math.ceil(this.customPagination.total / this.customPagination.pageSize)

        if (pageCount > 1) {
          for (let i = this.customPagination.page - 2; i <= this.customPagination.page + 2; i++) {
            if (i > 0 && i <= pageCount) {
              pageButtons.push(i)
            }
          }

          // Add first and last page links, if not added
          if (pageButtons.indexOf(1) === -1) {
            if (pageButtons.indexOf(2) === -1) {
              pageButtons.unshift(1, '...')
            } else {
              pageButtons.unshift(1)
            }
          }

          if (pageButtons.indexOf(pageCount) === -1) {
            if (pageButtons.indexOf(pageCount - 1) === -1) {
              pageButtons.push('...', pageCount)
            } else {
              pageButtons.push(pageCount)
            }
          }
        }
      }

      return pageButtons
    },
    effectivePageSizeOptions () {
      // Add current page size value to page size option, if not already in.
      let options = this.pageSizeOptions

      if (this.customPagination && this.customPagination.pageSize &&
        this.pageSizeOptions.indexOf(this.customPagination.pageSize) === -1) {
        options = [...this.pageSizeOptions, this.customPagination.pageSize].sort((a, b) => a - b)
      }

      return options.map(option => {
        return {
          key: option,
          name: option
        }
      })
    }
  },
  watch: {
    items: {
      handler: function () {
        if (this.selectedRows) {
          // If selected rows provided as a prop, do not process local selected rows
          return
        }

        if (this.isTotalSelected) {
          // If total selected flag is on, select all new items
          this.localSelectedRows = [...this.selectableItems]
        } else {
          // Remove rows that are not visible from selected rows list, and update local list to contain new objects
          const selectedItemKeys = this.localSelectedRows.map(item => item[this.itemKey])
          this.localSelectedRows = this.selectableItems.filter(item => selectedItemKeys.indexOf(item[this.itemKey]) > -1)
        }
      },
      deep: true
    },
    localSelectedRows: {
      handler: function () {
        this.$emit('rowSelectionChange', this.localSelectedRows)
      },
      deep: true
    },
    effectiveSelectedRows: {
      handler: function () {
        if (this.selectedRows) {
          // Skip processing if selected rows managed externally
          return
        }

        if (this.effectiveSelectedRows.length < this.selectableItems.length) {
          // If an item is de-selected, set isTotalSelected flag to false
          this.$emit('totalSelectionChange', false)
        }
      },
      deep: true
    }
  },
  methods: {
    onActionClick: function (action, item) {
      if (this.isActionDisabled(action, item)) {
        return false
      }

      this.$emit('actionClick', action.type, item)
    },
    isActionVisible (action, item) {
      return (!action.displayCondition || action.displayCondition(item)) && (!this.isFixed || action.validForFixed)
    },
    isActionDisabled (action, item) {
      if (!action.hasOwnProperty('disabled')) {
        return false
      }

      if (_.isFunction(action.disabled)) {
        return action.disabled(item)
      }

      return action.disabled
    },
    getActionTooltip (action, item) {
      if (!action.hasOwnProperty('tooltip')) {
        return null
      }

      if (_.isFunction(action.tooltip)) {
        return action.tooltip(item)
      }

      return action.tooltip
    },
    onEditClick: function (item) {
      if (this.editableRows.indexOf(item) > -1) {
        this.editableRows.splice(this.editableRows.indexOf(item), 1)
      } else {
        this.editableRows.push(item)
      }
    },
    onHeadMoreInput: function (header, event) {
      if (header.value === '_selected') {
        // Special case, select row

        if (event.key === 'isAllSelected') {
          if (this.selectedRows) {
            // Selected rows managed externally, emit rows selected / de-selected events
            if (event.value) {
              this.$emit('rowSelect', [...this.selectableItems].filter(row => this.selectedRows.indexOf(row) === -1))
            } else {
              this.$emit('rowDeselect', [...this.selectableItems].filter(row => this.selectedRows.indexOf(row) > -1))
            }
          } else {
            // Selected rows managed locally, update local data
            if (event.value) {
              this.localSelectedRows = [...this.selectableItems]
            } else {
              this.localSelectedRows = []
            }
          }
        }

        if (event.key === 'isTotalSelected') {
          if (event.value) {
            this.$emit('totalSelectionChange', true)
          } else {
            if (!this.selectedRows) {
              // Selected rows managed locally, update local data
              this.localSelectedRows = []
            }

            this.$emit('totalSelectionChange', false)
          }
        }

        return
      }

      this.$emit('headMoreInput', header, event)
    },
    onExpandClick: function (item) {
      const itemKey = item[this.itemKey]
      const isExpanded = this.$refs.dataTable.expanded[itemKey] === true
      this.$set(
        this.$refs.dataTable.expanded,
        itemKey,
        !isExpanded
      )

      // Close other items
      Object.keys(this.$refs.dataTable.expanded).forEach((key, index) => {
        if (key.toString() !== itemKey.toString()) {
          this.$set(
            this.$refs.dataTable.expanded,
            key,
            false
          )
        }
      })

      this.$emit('rowExpand', item)
    },
    expandRow (item) {
      const itemKey = item[this.itemKey]
      const isExpanded = this.$refs.dataTable.expanded[itemKey] === true
      if (!isExpanded) {
        this.onExpandClick(item)
      }
    },
    isExpandActionVisible (item) {
      return this.isExpandable && (!this.expandableRowFilter || this.expandableRowFilter(item))
    },
    stopPropagation ($event) {
      $event.stopPropagation()
    },
    onDragSortEnd: function ({ oldIndex, newIndex }) {
      this.$emit('itemReOrder', oldIndex, newIndex)
    },
    isRowEditable: function (item) {
      return (this.editableRows.indexOf(item) > -1) || this.alwaysEditable
    },
    isCellEditable: function (item, header) {
      return header.editable && this.isRowEditable(item) && !this.isFixed
    },
    isCellContentsVisible: function (item, header) {
      return !header.hidden || !header.hidden(this.getCellValue(item, header), item)
    },
    getItemKey (item) {
      if (this.generateKeys || this.draggable) {
        // Returns a unique key for each row.
        // Required for drag - sort
        if (!this.itemKeys.has(item)) {
          this.itemKeys.set(item, ++this.currentItemKey)
        }

        return this.itemKeys.get(item)
      }

      if (this.indexKeyed) {
        return this.items.indexOf(item)
      }

      return item[this.itemKey]
    },
    getCellValue (item, header) {
      let value = null
      if (item.hasOwnProperty(header.value)) {
        value = item[header.value]
      } else {
        value = item
        for (let key of header.value.split('.')) {
          if (value && value.hasOwnProperty(key)) {
            value = value[key]
          } else {
            value = null
            break
          }
        }
      }

      if (header.valueFormatter) {
        return header.valueFormatter(value, item)
      }

      return value
    },
    getCellDisplayValue (item, header) {
      const cellValue = this.getCellValue(item, header)

      if (header.formatter) {
        return header.formatter(cellValue, item)
      }

      if (header.type === Array && Array.isArray(cellValue)) {
        return cellValue.join(', ')
      }

      if (header.options) {
        return header.options.filter(option => {
          return option.key === cellValue
        })[0].name
      }

      return cellValue
    },
    getCellTooltipValue (item, header) {
      if (header.tooltipFormatter) {
        return header.tooltipFormatter(this.getCellValue(item, header), item)
      }

      return this.getCellDisplayValue(item, header)
    },
    getCellPlaceholderValue (item, header) {
      if (!header.hasOwnProperty('placeholder')) {
        return ''
      }

      if (_.isFunction(header.placeholder)) {
        return header.placeholder(item)
      }

      return header.placeholder
    },
    onItemInput (item, field, value) {
      if (field === '_selected') {
        // Special case, select row

        // Skip if item is not selectable
        if (this.selectableItems.indexOf(item) === -1) {
          return
        }

        if (this.selectedRows) {
          // Selected rows managed externally, emit rows selected / de-selected events
          if (value) {
            this.$emit('rowSelect', [item])
          } else {
            this.$emit('rowDeselect', [item])
          }
        } else {
          // Selected rows managed locally, update local data
          if (value) {
            this.localSelectedRows.push(item)
          } else {
            this.localSelectedRows = this.localSelectedRows.filter(row => row[this.itemKey] !== item[this.itemKey])
          }
        }

        return
      }

      if (item.hasOwnProperty(field)) {
        this.$emit('itemInput', item, field, value)
      } else {
        let element = item
        const keys = field.split('.')
        for (let i = 0; i < keys.length; i++) {
          if (i < keys.length - 1) {
            element = element[keys[i]]
          } else {
            this.$emit('itemInput', element, keys[i], value)
            this.$set(element, keys[i], value)
          }
        }
      }
    },
    onItemFocus (item, field) {
      this.$emit('itemFocus', item, field)
    },
    onItemBlur (item, field) {
      this.$emit('itemBlur', item, field)
    },
    onItemAction (item, field, value) {
      this.$emit('itemAction', item, field, value)
    },
    isRowClickable (item) {
      return this.rowClickable && (!this.clickableRowFilter || this.clickableRowFilter(item))
    },
    onRowClick (item) {
      if (this.isRowClickable(item)) {
        this.$emit('rowClick', item)
      }

      if (this.isExpandable && this.expandOnRowClick) {
        // Toggle expand
        this.onExpandClick(item)
      }

      if (this.multiSelectable && this.selectOnRowClick) {
        // Toggle select
        this.onItemInput(item, '_selected', this.effectiveSelectedRows.indexOf(item) === -1)
      }
    },
    onCellClick (item, header) {
      if (this.selectable) {
        if (this.selectedRow !== item && header.selectable !== false) {
          this.$emit('rowSelect', item)
        }
      }
    },
    getHeaderSortKey (header) {
      return header.sortKey ? header.sortKey : header.value
    },
    changeSort (header) {
      if (header.sortable === false || this.sortable === false) {
        return
      }

      let column = this.getHeaderSortKey(header)
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
      }
      if (this.pagination.descending) {
        column = '-' + column
      }

      this.$emit('sortOrderChange', column)
    },
    onPageLinkClick (pageNumber) {
      // Check if not clicked on a separator
      if (pageNumber !== '...') {
        this.$emit('pageLinkClick', pageNumber)
      }
    },
    onPageSizeInput (pageSize) {
      this.$emit('pageSizeInput', pageSize)
    },
    setFocus (header, row) {
      // By default, first column of last row
      header = header || this.headers[0]
      row = row || this.items.length - 1

      // Set focus on provided row / column input element
      if (this.$refs[`input_${header.value}`] &&
        this.$refs[`input_${header.value}`][row] &&
        this.$refs[`input_${header.value}`][row]['setFocus']) {
        this.$refs[`input_${header.value}`][row].setFocus()
      }
    },
    getCellTooltip (header, row) {
      if (!header.hasOwnProperty('tooltip')) {
        return null
      }

      if (_.isFunction(header.tooltip)) {
        return header.tooltip(row)
      }

      return header.tooltip
    }
  }
}
</script>

<style src="./base-table.scss" lang="scss"></style>
<style src="./base-table.styl" lang="stylus"></style>
<style src="@/styles/v2/base.scss" lang="scss" scoped></style>
