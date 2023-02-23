<template lang="pug">
  .base-select
    label.base-select-label(
      v-if="label"
    ) {{ label }}

    .select-container(
      :class="[{'select-container--upwards': isUpwards}, {'select-container--active': menuVisible}, {'select-container--selected': selectedItem !== null}, {'select-container--invalid': isValidationStateVisible && !isValid}, {'select-container--disabled': disabled}, {'select-container--clear-icon-visible': clearActionVisible}]"
      :tabindex="tabindex"
      @blur="onBlur"
    )
      .selected-item(
        @click="onDropdownHandleClick"
        ref="dropdownHandle"
      )
        .selected-item__name-container
          span.selected-item__name(
            v-if="selectedItem"
          ) {{ selectedItem.name }}
          span.selected-item__name(
            v-else="selectedItem"
          ) {{ placeholder ?  placeholder : $t('general.select') }}

        v-icon.select-icon
          | {{ loading ? 'fas fa-spinner fa-spin' : 'arrow_drop_down' }}

        v-icon(
          v-if="clearActionVisible"
          @click.stop="onClearClick()"
        ).clear-icon
          | close

      .options(
        v-show="menuVisible"
        ref="options"
      )
        .search-container(
          v-if="searchActive"
        )
          base-text-input.search-container__search-input(
            v-model="searchText"
            ref="searchElement"
            @focus="searchInputFocusChange(true)"
            @blur="searchInputFocusChange(false)"
            :placeholder="searchPlaceholder"
            pre-icon="search"
          )
            v-icon.search-container__search-input__clear-icon(
              v-if="searchText"
              @click="onSearchClearClick()"
            ) close

        perfect-scrollbar.scroll-holder(
          :options="scrollBarOptions"
        )
          base-select-option(
            v-for="item of displayedItems"
            :option="item"
            :key="item.key"
            @optionClick="onOptionClick($event)"
          )

    .base-select__error-container(
      v-if="errors && errors.length > 0 && touched"
    )
      .base-select__error-container__error(
        v-for="(error, index) of errors"
        :key="index"
      ) {{ error }}

</template>

<script>
import DropdownItemMixin from '@/mixins/dropdown-item.mixin'
import FormFieldValidationMixin from '@/mixins/form-field-validation.mixin'
import ClearableFormFieldMixin from '@/mixins/clearable-form-field.mixin'
import BaseSelectOption from './base-select-option'
import BaseTextInput from '../base-text-input/base-text-input'

const AUTO_SEARCH_ENABLE_THRESHOLD = 12

export default {
  name: 'BaseSelect',
  components: { BaseTextInput, BaseSelectOption },
  mixins: [
    DropdownItemMixin,
    FormFieldValidationMixin,
    ClearableFormFieldMixin
  ],
  props: {
    value: {
      default: null
    },
    items: {
      type: Array,
      default: null
    },
    label: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    caseInsensitiveKeys: {
      type: Boolean,
      default: false
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0
    },
    placeholder: {
      type: String,
      default: ''
    },
    searchEnabled: {
      default: 'auto'
    },
    searchPlaceholder: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      scrollBarOptions: {
        wheelPropagation: false
      },
      searchText: null,
      componentHasFocus: false,
      searchInputHasFocus: false
    }
  },
  computed: {
    flatItems () {
      // If items is a tree, returns a flat list of leaf items
      return this.getLeafItems(this.items)
    },
    displayedItems () {
      if (this.searchActive === false || !this.searchText) {
        // Search not enabled, or no search query entered
        return this.items
      }

      return this.items.filter(
        item => item.hasOwnProperty('children') // Item is a parent element, include by default
          ? true
          : item.name.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1
      ).map(item => {
        return item.hasOwnProperty('children') // Item is a parent element, filter children further
          ? {
            ...item,
            children: item.children.filter(
              childItem => childItem.name.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1
            )
          }
          : item
      })
    },
    selectedItem: function () {
      const selectedItem = this.flatItems.filter(item => {
        return (this.caseInsensitiveKeys && typeof item.key === 'string' && typeof this.value === 'string')
          ? (item.key.toLowerCase() === this.value.toLowerCase()) : (item.key === this.value)
      })[0]
      return selectedItem || null
    },
    displayActions: function () {
      return (this.actions && this.actions.length) || this.draggable
    },
    searchActive () {
      // Either search should be enabled manually, or number of options exceeds the threshold
      return this.searchEnabled === true ||
        (this.searchEnabled === 'auto' && this.flatItems.length >= AUTO_SEARCH_ENABLE_THRESHOLD)
    }
  },
  methods: {
    showOptions: function () {
      DropdownItemMixin.methods.showOptions.bind(this)()

      // Automatically focus on search input, if search enabled
      if (this.searchActive) {
        setTimeout(() => {
          this.$refs.searchElement.setFocus()
        }, 50)
      }
    },
    hideOptions: function () {
      DropdownItemMixin.methods.hideOptions.bind(this)()

      if (this.searchActive) {
        // Clear search if hiding options
        this.searchText = null
      }
    },
    onOptionClick: function (item) {
      this.hideOptions()
      this.$emit('input', item.key)
    },
    onClearClick () {
      this.hideOptions()

      ClearableFormFieldMixin.methods.onClearClick.bind(this)()
    },
    onDropdownHandleClick (event) {
      if (this.loading) {
        // Ignore clicks if loading
        return
      }

      DropdownItemMixin.methods.onDropdownHandleClick.bind(this)()
    },
    searchInputFocusChange (hasFocus) {
      this.searchInputHasFocus = hasFocus

      if (!hasFocus) {
        setTimeout(() => {
          if (!this.searchInputHasFocus && !this.componentHasFocus) {
            this.touched = true
            this.hideOptions()
          }
        }, 300) // If this is too short, options may get hidden before onOptionClick processed
      }
    },
    onFocus () {
      this.componentHasFocus = true
    },
    onBlur () {
      this.componentHasFocus = false

      if (!this.searchActive) {
        this.touched = true
        this.hideOptions()
      } else {
        // If search enabled, check if search input has focus, hide if it doesn't have focus either
        setTimeout(() => {
          if (!this.searchInputHasFocus && !this.componentHasFocus) {
            this.touched = true
            this.hideOptions()
          }
        }, 50)
      }
    },
    getLeafItems (items) {
      let leafItems = []
      items.forEach(item => {
        if (!item.hasOwnProperty('children')) {
          leafItems.push(item)
        } else {
          leafItems = leafItems.concat(this.getLeafItems(item.children))
        }
      })

      return leafItems
    },
    onSearchClearClick () {
      this.searchText = ''
      this.$refs.searchElement.setFocus()
    }
  }
}
</script>

<style src="./base-select.scss" lang="scss" scoped></style>
