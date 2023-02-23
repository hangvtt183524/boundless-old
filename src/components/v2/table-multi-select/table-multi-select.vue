<template lang="pug">
  .table-multi-select(
    :class="['table-multi-select', {'table-multi-select--invalid': isValidationStateVisible && !isValid}, {'table-multi-select--disabled': disabled}]"
    :tabindex="tabindex"
    @blur="onBlur"
  )
    .table-multi-select__options
      .table-multi-select__options__header
        search-input.table-multi-select__options__header__search-input(
          v-model="search"
          :placeholder="searchPlaceholder ? searchPlaceholder : $t('general.search')"
          :disabled="disabled"
        )

      .table-multi-select__options__list
        base-table.table-multi-select__options__list__table(
          :items="displayedItems"
          :headers="headers"
          item-key="key"
          :sortable="!disabled"
          :multi-selectable="!disabled"
          :selected-rows="selectedItems"
          :row-clickable="!disabled"
          @rowClick="onRowClick"
          @rowSelect="onRowSelect"
          @rowDeselect="onRowDeselect"
          @loadMore="onScrollEnd"
        )

    .list-empty-state(
      v-if="!!emptyStateMessage && !(items && items.length > 0)"
    )
      .list-empty-state__message
        | {{ emptyStateMessage }}

</template>

<script>
import FormFieldValidationMixin from '@/mixins/form-field-validation.mixin'
import BaseTable from '../base-table/base-table'
import SearchInput from '../search-input/search-input'

export default {
  name: 'table-multi-select',
  components: { SearchInput, BaseTable },
  mixins: [
    FormFieldValidationMixin
  ],
  props: {
    value: {
      type: Array,
      default: function () {
        return []
      }
    },
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
    tabindex: {
      type: Number,
      required: false,
      default: 0
    },
    emptyStateMessage: {
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
      ]
    }
  },
  computed: {
    displayedItems () {
      if (!this.search) {
        return this.items
      }

      return this.items.filter(item => item.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
    },
    selectedItems () {
      return this.items.filter(item => this.value.indexOf(item.key) > -1)
    }
  },
  methods: {
    onRowSelect (selectedRows) {
      this.$emit('input', [
        ...this.value,
        ...selectedRows.map(option => option.key)
      ])
    },
    onRowDeselect (deselectedRows) {
      this.$emit('input', this.value.filter(key => {
        return deselectedRows.map(row => row.key).indexOf(key) === -1
      }))
    },
    onRowClick (row) {
      if (this.value.indexOf(row.key) > -1) {
        // Already selected, de-select
        this.onRowDeselect([row])
      } else {
        // Row not selected, select
        this.onRowSelect([row])
      }
    },
    onScrollEnd () {
      this.$emit('scrollEnd')
    }
  }
}
</script>

<style src="./table-multi-select.scss" lang="scss" scoped></style>
