
let SelectedItemMixin = {

  computed: {
    selectedClass () {
      if (this.selectedItem && this.selectedItem.id === this.index) {
        return {
          'selected-item': true
        }
      }
    },
    isSelectedItem () {
      return this.selectedItem && this.selectedItem.id === this.index
    }
  },
  updated () {
    this.resetContentEditable(this.isSelectedItem)
  },
  watch: {
    isSelectedItem: function (newValue) {
      this.resetContentEditable(newValue)
    }
  },
  methods: {
    resetContentEditable (set) {
      if (this.$refs.contentEditable) {
        if (set) {
          this.$refs.contentEditable.setAttribute('contenteditable', true)
        } else {
          this.$refs.contentEditable.removeAttribute('contenteditable')
        }
      }
    },
    selectItem () {
      this.$emit('select', this.component)
    }
  }

}

export default SelectedItemMixin
