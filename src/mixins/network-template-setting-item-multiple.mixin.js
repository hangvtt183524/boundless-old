// Mixin providing common functionality for network template setting items that are a list of multiple items

export default {
  data: function () {
    return {
      activeItemIndex: null,
      placeholderItem: null,
      computeCounter: 0
    }
  },
  computed: {
    items () {
      // eslint-disable-next-line no-unused-expressions
      this.computeCounter

      if (!this.isEmpty) {
        return this.settingValue
      }

      // Setting value empty. Set a placeholder item and add it to the list.
      // If we do not define placeholderItem as a data attribute, and directly return a dynamic list here as we do for
      // simple list-type settings, a change in the placeholder item property is not detected by child components.
      this.$set(this, 'placeholderItem', this.getEmptyItem())
      return [this.placeholderItem]
    },
    activeItem () {
      return this.activeItemIndex !== null ? this.items[this.activeItemIndex] : null
    }
  },
  watch: {
    activeItemIndex: {
      handler: function () {
        // Emit detail view mode change event on active item change
        this.$emit('detailViewToggle', this.activeItemIndex !== null, this.getActiveItemName())
      }
    }
  },
  methods: {
    addItem (item) {
      this.$emit('settingInput', this.field_key, [
        ...(this.settingValue ? this.settingValue : []),
        item
      ])
    },
    addNewItem () {
      if (this.isEmpty) {
        // Do twice if the list is already empty, as one item is displayed as placeholder already
        this.addItem(this.getEmptyItem())
      }

      this.addItem(this.getEmptyItem())
    },
    addPlaceholderItemIfEmpty () {
      // If setting value is empty, adds placeholder item to setting value. To be called on input methods, in case
      // and input is made for the placeholder item.
      if (!(this.settingValue && this.settingValue.length > 0)) {
        this.addItem(this.placeholderItem)
        this.placeholderItem = null
      }
    },
    deleteItem (itemIndex) {
      if (!(this.settingValue && this.settingValue.length > 0)) {
        this.computeCounter += 1 // Force re-compute of table items so that row re-renders
        return
      }

      this.$emit('settingInput', this.field_key, this.settingValue.filter((item, index) => {
        return index !== itemIndex
      }))
    },
    onBackClick () {
      this.$set(this, 'activeItemIndex', null)

      // Automatically scroll back to top
      document.querySelector('#template-detail-content-scroll-area').scrollTop = 0
    },
    getActiveItemName () {
      return this.activeItem ? this.activeItem.name : null
    }
  }
}
