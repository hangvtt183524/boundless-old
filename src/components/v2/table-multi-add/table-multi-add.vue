<template lang="pug">
  .table-multi-add(
    :class="['table-multi-add', {'table-multi-add--disabled': disabled}]"
  )
    .table-multi-add__options
      .table-multi-add__options__header
        search-input.table-multi-add__options__header__search-input(
          v-model="search"
          :placeholder="searchPlaceholder ? searchPlaceholder : $t('general.search')"
          :disabled="disabled"
        )

      .table-multi-add__options__list
        base-table.table-multi-add__options__list__table(
          :items="displayedItems"
          :headers="headers"
          item-key="key"
          :sortable="!disabled"
          :multi-selectable="!disabled"
          :select-on-row-click="!disabled"
          :actions="!disabled ? actions : []"
          actions-label=" "
          :actions-head-more="actionsHeadMore"
          @actionClick="onTableActionClick"
          @rowSelectionChange="onRowSelectionChange"
          @headMoreInput="onTableHeadMoreInput"
          @loadMore="onScrollEnd"
        )

    .list-empty-state(
      v-if="!!emptyStateMessage && !(items && items.length > 0)"
    )
      .list-empty-state__message
        | {{ emptyStateMessage }}

</template>

<script>
import BaseTable from '../base-table/base-table'
import SearchInput from '../search-input/search-input'
import ClickActionHeaderCell from '../base-table/column-components/click-action-header-cell'

export default {
  name: 'table-multi-add',
  components: { SearchInput, BaseTable },
  props: {
    items: {
      type: Array,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    searchPlaceholder: {
      type: String,
      default: ''
    },
    emptyStateMessage: {
      type: String,
      required: false
    },
    addActionTooltip: {
      type: String,
      required: false
    }
  },
  data: function () {
    return {
      search: '',
      headers: [
        {
          text: this.$t('general.name'),
          value: 'name'
        }
      ],
      actions: [
        {
          icon: 'add_box',
          type: 'add',
          tooltip: this.addActionTooltip ? this.addActionTooltip : null
        }
      ],
      selectedItems: []
    }
  },
  computed: {
    displayedItems () {
      if (!this.search) {
        return this.items
      }

      return this.items.filter(item => item.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
    },
    actionsHeadMore () {
      return {
        component: ClickActionHeaderCell,
        props: {
          icon: 'add_circle_outline',
          text: this.$t('general.addSelected'),
          disabled: this.selectedItems.length === 0
        }
      }
    }
  },
  methods: {
    onRowSelectionChange (selectedRows) {
      this.selectedItems = selectedRows
    },
    onTableActionClick (action, item) {
      if (action === 'add') {
        this.$emit('add', [
          item.key
        ])
      }
    },
    onTableHeadMoreInput (header, event) {
      if (header.value === '_actions' && event.action === 'click') {
        // Select all selected items
        this.$emit('add', this.selectedItems.map(item => item.key))
      }
    },
    onScrollEnd () {
      this.$emit('scrollEnd')
    }
  }
}
</script>

<style src="./table-multi-add.scss" lang="scss" scoped></style>
