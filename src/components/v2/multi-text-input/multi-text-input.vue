<template lang="pug">
  .multi-text-input(
    :class="['.multi-text-input', {'multi-text-input--upwards': isUpwards}, {'multi-text-input--active': menuVisible}, {'multi-text-input--has-options': (displayedItems && displayedItems.length)}, {'multi-text-input--invalid': isValidationStateVisible && !isValid}, {'multi-text-input--required': isRequired}, {'multi-text-input--disabled': disabled}]"
    @click="onElementClick"
    :tabindex="tabindex"
  )
    label.multi-text-input__label(
      v-if="label"
    ) {{ label }}

    .multi-text-input__handle-container
      .multi-text-input__input-container(
        ref="dropdownHandle"
      )
        .multi-text-input__selected-items
          .multi-text-input__selected-items__item(
            v-for="(item, index) of selectedItems"
            :key="index"
          )
            span.multi-text-input__selected-items__item__text {{ getItemDisplayValue(item) }}
            v-icon.multi-text-input__selected-items__item__close-icon(
              @click="onRemoveItemClick(index)"
            ) clear

        .multi-text-input__text-field(
          v-show="isActive || selectedItems.length === 0"
        )
          input(
            :type="type"
            v-model="newItem"
            @keydown="onNewItemKeyDown"
            @focus="$emit('focus')"
            @blur="onInputBlur"
            :placeholder="placeholder"
            :disabled="disabled"
            ref="inputElement"
          )

    .multi-text-input__options(
      v-show="(displayedItems && displayedItems.length) && menuVisible"
      ref="options"
    )
      perfect-scrollbar.multi-text-input__options__scroll-holder(
        :options="scrollBarOptions"
      )
        .multi-text-input__options__option-container(
            v-for="item of displayedItems"
            :key ="item.key"
            :class="[{'multi-text-input__options__option-container--tree': !!item.children}]"
        )
          .multi-text-input__options__section(
            v-if="item.children"
          )
            .multi-text-input__options__section__title {{ item.name }}
            .multi-text-input__options__option(
              v-for="childItem of item.children"
              :key="childItem.key"
              @click="onOptionClick(childItem)"
            ) {{ childItem.name }}

          .multi-text-input__options__option(
            v-else
            @click="onOptionClick(item)"
          ) {{ item.name }}

</template>

<script>
import FormFieldValidationMixin from '@/mixins/form-field-validation.mixin'
import DropdownItemMixin from '@/mixins/dropdown-item.mixin'

export default {
  name: 'multi-text-input',
  mixins: [
    FormFieldValidationMixin,
    DropdownItemMixin
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
      default: null,
      required: false
    },
    type: {
      type: String,
      default: 'text'
    },
    separators: {
      type: Array,
      default: function () {
        return ['Enter', 'Comma', 'Space']
      }
    },
    placeholder: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0
    },
    itemFormatter: {
      type: Function,
      required: false
    }
  },
  data: function () {
    return {
      isActive: false,
      newItem: '',
      touched: false,
      scrollBarOptions: {
        wheelPropagation: false
      }
    }
  },
  computed: {
    selectedItems () {
      return this.value ? this.value : []
    },
    itemList () {
      return this.items ? this.items : []
    },
    flatItems: function () {
      const flatItemList = []

      this.itemList.forEach(item => {
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
      const displayedItems = []

      this.itemList.forEach(item => {
        if (item.children) {
          const displayedChildren = item.children.filter(childItem => {
            return this.value.indexOf(childItem.key) === -1
          })

          if (displayedChildren.length > 0) {
            displayedItems.push({
              ...item,
              children: displayedChildren
            })
          }
        } else {
          if (this.value.indexOf(item.key) === -1) {
            displayedItems.push(item)
          }
        }
      })

      return displayedItems
    },
    isValid: function () {
      if (this.validations) {
        if (this.validations.required && this.isValueEmpty) {
          return false
        }

        if (this.selectedItems.length > 0 && this.validations.methods) {
          for (let i = 0; i < this.validations.methods.length; i++) {
            const methodData = this.validations.methods[i]
            for (let j = 0; j < this.selectedItems.length; j++) {
              if (!methodData.method(this.selectedItems[j])) {
                return false
              }
            }
          }
        }
      }

      return true
    }
  },
  watch: {
    value: {
      handler: function () {
        if (this.menuVisible) {
          // On value change, re-calculate dropdown position as it might need to change
          setTimeout(function () {
            this.computeDropdownPosition()
          }.bind(this), 100)
        }
      },
      deep: true
    },
    newItem: {
      handler: function (newVal) {
        this.$emit('newItemInput', newVal)
      }
    }
  },
  methods: {
    getItemDisplayValue (item) {
      // If item exists in the option list, return corresponding option's display name. Otherwise, if an item formatter
      // is supplied, use it. If not, directly return item value

      const option = this.flatItems.filter(option => {
        return option.key === item
      })[0]

      if (option) {
        return option.name
      }

      return this.itemFormatter ? this.itemFormatter(item) : item
    },
    addNewItem () {
      // Run validations first
      if (!this.runNewItemValidations()) {
        return false
      }

      this.$emit('input', [
        ...this.value,
        this.newItem
      ])

      // Reset new item
      this.newItem = ''
    },
    onNewItemKeyDown (event) {
      if (this.separators.indexOf(event.code) > -1) {
        // A separator key pressed, add new item
        if (this.newItem) {
          this.addNewItem()
        }

        event.preventDefault()
      }
    },
    onInputBlur () {
      // If a text is entered, and there are no suggestions, add the entered text into selections on blur
      if (this.newItem && this.items === null) {
        this.addNewItem()
      }
    },
    runNewItemValidations () {
      if (!(this.validations && this.validations.methods)) {
        return true
      }

      for (let i = 0; i < this.validations.methods.length; i++) {
        const methodData = this.validations.methods[i]
        if (!methodData.method(this.newItem)) {
          if (methodData.message) {
            global.toastr['error'](methodData.message, this.$t('general.error'))
          }

          return false
        }
      }

      return true
    },
    onRemoveItemClick: function (itemIndex) {
      if (this.disabled) {
        return false
      }

      this.$emit('input', this.value.filter((valueItem, index) => {
        return index !== itemIndex
      }))
    },
    onElementClick () {
      if (this.disabled) {
        return false
      }

      const justActivated = !this.isActive
      this.isActive = true

      if (!this.menuVisible) {
        this.showOptions()
      }

      if (!this.disabled && justActivated) {
        // Add window click event listener so that we can de-activate element when clicked outside
        window.addEventListener('click', this.onEverywhereClick)

        // If activating the element just now, give focus to input
        setTimeout(function () {
          this.$refs.inputElement.focus()
          this.computeDropdownPosition()
        }.bind(this), 100)
      }
    },
    onEverywhereClick (event) {
      if (!(
        this.$el === event.target ||
        this.$el.contains(event.target) ||
        event.target.classList.contains('multi-text-input__options__option')
      )) {
        this.touched = true
        this.isActive = false
        this.hideOptions()

        // De-register click handler
        window.removeEventListener('click', this.onEverywhereClick)
      }
    },
    onOptionClick: function (item) {
      this.$emit('input', this.value.concat([item.key]))

      // Re-focus on input
      this.$refs.inputElement.focus()
    }
  }
}
</script>

<style src="./multi-text-input.scss" lang="scss" scoped></style>
