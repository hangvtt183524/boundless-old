<template lang="pug">
  .base-multi-select(
    :class="['base-multi-select', {'base-multi-select--upwards': isUpwards}, {'base-multi-select--active': menuVisible}, {'base-multi-select--invalid': isValidationStateVisible && !isValid}, {'base-multi-select--disabled': disabled || (isEmpty && disabledWhenEmpty)}]"
    :tabindex="tabindex"
    @focus="onFocus"
    @blur="onBlur"
  )
    label.base-multi-select__label(
      v-if="label"
    ) {{ label }}

    .base-multi-select__handle-container
      .base-multi-select__input-container(
        ref="dropdownHandle"
        @click="onDropdownHandleClick"
      )
        .base-multi-select__selected-items
          .base-multi-select__selected-items__item(
            v-for="selectedItem of selectedItems"
            :key="selectedItem.key"
            :title="selectedItem.name"
          )
            span.base-multi-select__selected-items__item__text {{ selectedItem.name }}
            v-icon.base-multi-select__selected-items__item__close-icon(
              @click="onRemoveItemClick(selectedItem)"
            ) clear
          .base-multi-select__selected-items__add-new-item(
            v-show="displayedItems.length > 0 || searchEnabled"
          )
            v-icon.base-multi-select__selected-items__add-new-item__icon add
            span.base-multi-select__selected-items__add-new-item__text {{ $t('general.add') }}
          v-icon.base-multi-select__selected-items__icon arrow_drop_down

        .base-multi-select__search-field(
          v-if="searchActive"
          v-show="isSearchInputVisible"
        )
          input(
            type="text"
            v-model="searchText"
            :placeholder="placeholder"
            :disabled="disabled"
            ref="searchElement"
            @focus="searchInputFocusChange(true)"
            @blur="searchInputFocusChange(false)"
          )

    .base-multi-select__options(
      v-show="menuVisible"
      ref="options"
    )
      perfect-scrollbar.base-multi-select__options__scroll-holder(
        :options="scrollBarOptions"
      )
        .base-multi-select__options__option-container(
          v-for="item of displayedItems"
          :key ="item.key"
          :class="[{'base-multi-select__options__option-container--tree': !!item.children}]"
        )
          .base-multi-select__options__section(
            v-if="item.children"
          )
            .base-multi-select__options__section__title {{ item.name }}
            .base-multi-select__options__option(
              v-for="childItem of item.children"
              :key="childItem.key"
              @click="onOptionClick(childItem)"
              :class="{'base-multi-select__options__option--highlighted': childItem.highlighted}"
              :title="item.name"
            ) {{ childItem.name }}
          .base-multi-select__options__option(
            v-else
            @click="onOptionClick(item)"
            :class="{'base-multi-select__options__option--highlighted': item.highlighted}"
            :title="item.name"
          ) {{ item.name }}
    div.base-multi-select__error-container(
    v-if="errors && errors.length > 0 && touched"
    )
      div.base-multi-select__error-container__error(
      v-for="(error, index) of errors"
      :key="index"
      ) {{ error }}
</template>

<script>
import DropdownItemMixin from '@/mixins/dropdown-item.mixin'
import FormFieldValidationMixin from '@/mixins/form-field-validation.mixin'
import _ from 'lodash'

const AUTO_SEARCH_ENABLE_THRESHOLD = 18

export default {
  name: 'base-multi-select',
  mixins: [
    DropdownItemMixin,
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
    label: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    searchEnabled: {
      default: 'auto'
    },
    placeholder: {
      type: String,
      default: ''
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0
    },
    disabledWhenEmpty: {
      type: Boolean,
      default: true
    }
  },
  data: function () {
    return {
      searchText: '',
      isSearchInputVisible: false,
      componentHasFocus: false,
      searchInputHasFocus: false,
      scrollBarOptions: {
        wheelPropagation: false
      }
    }
  },
  computed: {
    flatItems: function () {
      const flatItemList = []

      this.items.forEach(item => {
        if (!item.children) {
          flatItemList.push(item)
        } else {
          item.children.forEach(itemChild => {
            flatItemList.push(itemChild)
          })
        }
      })

      return flatItemList
    },
    selectedItems: function () {
      return this.flatItems.filter(item => {
        return this.value.indexOf(item.key) > -1
      })
    },
    nonSelectedItems: function () {
      const nonSelectedItems = []

      this.items.forEach(item => {
        if (item.children) {
          const displayedChildren = item.children.filter(childItem => {
            return this.value.indexOf(childItem.key) === -1
          })

          if (displayedChildren.length > 0) {
            nonSelectedItems.push({
              ...item,
              children: displayedChildren
            })
          }
        } else {
          if (this.value.indexOf(item.key) === -1) {
            nonSelectedItems.push(item)
          }
        }
      })

      return nonSelectedItems
    },
    nonSelectedFlatItems: function () {
      const flatItemList = []

      this.nonSelectedItems.forEach(item => {
        if (!item.children) {
          flatItemList.push(item)
        } else {
          item.children.forEach(itemChild => {
            flatItemList.push(itemChild)
          })
        }
      })

      return flatItemList
    },
    displayedItems: function () {
      // Do not display selected items in options
      let displayedItems = [...this.nonSelectedItems]

      // Apply search filter, if any
      if (this.searchActive && this.searchText) {
        displayedItems = displayedItems.filter(item => {
          return item.name.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1
        })
      }

      return displayedItems
    },
    searchActive () {
      // Either search should be enabled manually, or number of options exceeds the threshold
      return this.searchEnabled === true ||
        (this.searchEnabled === 'auto' && this.nonSelectedFlatItems.length >= AUTO_SEARCH_ENABLE_THRESHOLD)
    },
    isEmpty () {
      return this.flatItems.length === 0
    }
  },
  watch: {
    searchText: {
      handler: _.debounce(function () {
        this.$emit('searchInput', this.searchText)
      }, 400),
      deep: true
    },
    value: {
      handler: _.debounce(function () {
        if (this.menuVisible) {
          // Value change might require re-calculation of dropdown position, as number of lines on selected items may
          // change
          this.computeDropdownPosition()
        }
      }, 50),
      deep: true
    }
  },
  methods: {
    showOptions: function () {
      if (this.nonSelectedFlatItems.length === 0 && !this.searchEnabled) {
        // Do not open options when list empty
        return
      }

      if (this.searchActive) {
        this.isSearchInputVisible = true

        setTimeout(() => {
          this.$refs.searchElement.focus()

          DropdownItemMixin.methods.showOptions.bind(this)()
        }, 50)
      } else {
        DropdownItemMixin.methods.showOptions.bind(this)()
      }
    },
    hideOptions: function () {
      if (this.searchActive) {
        this.isSearchInputVisible = false
        this.searchText = ''

        setTimeout(DropdownItemMixin.methods.hideOptions.bind(this), 100)
      } else {
        DropdownItemMixin.methods.hideOptions.bind(this)()
      }
    },
    onDropdownHandleClick (event) {
      if (event.target.closest('.base-multi-select__selected-items__item')) {
        // Skip clicks to a selected item
        return
      }

      DropdownItemMixin.methods.onDropdownHandleClick.bind(this)()
    },
    onOptionClick: function (item) {
      this.$emit('input', this.value.concat([item.key]))

      // If no more options left, automatically hide options container
      setTimeout(function () {
        if (this.displayedItems.length === 0) {
          this.hideOptions()
        }
      }.bind(this), 50)
    },
    onRemoveItemClick: function (item) {
      if (this.disabled) {
        return false
      }

      this.$emit('input', this.value.filter(key => {
        return key !== item.key
      }))
    },
    searchInputFocusChange (hasFocus) {
      this.searchInputHasFocus = hasFocus

      if (!hasFocus) {
        setTimeout(() => {
          if (!this.searchInputHasFocus && !this.componentHasFocus) {
            this.hideOptions()
          }
        }, 50)
      }
    },
    onFocus () {
      this.componentHasFocus = true

      this.$emit('focus')
    },
    onBlur () {
      this.touched = true
      this.componentHasFocus = false

      if (!this.searchActive) {
        this.hideOptions()
      } else {
        // If search enabled, check if search input has focus, hide if it doesn't have focus either
        setTimeout(() => {
          if (!this.searchInputHasFocus && !this.componentHasFocus) {
            this.hideOptions()
          }
        }, 50)
      }
    }
  }
}
</script>

<style src="./base-multi-select.scss" lang="scss" scoped></style>
