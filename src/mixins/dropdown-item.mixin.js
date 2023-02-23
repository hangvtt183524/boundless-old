// Mixin providing methods for displaying drop downs correctly

export default {
  data: function () {
    return {
      menuVisible: false,
      isUpwards: false,
      scrollParents: null
    }
  },
  mounted () {
    this.scrollParents = this.getScrollParents(this.$el)
  },
  destroyed () {
    // Remove any registered dom event listeners
    this.deRegisterDomEvents()
  },
  methods: {
    onDropdownHandleClick: function () {
      if (this.disabled) {
        return
      }

      if (this.menuVisible) {
        this.hideOptions()
      } else {
        this.showOptions()
      }
    },
    showOptions: function () {
      // Set upwards class depending on select coordinates
      if (window.outerHeight - this.$refs.dropdownHandle.getBoundingClientRect().bottom < 350) {
        this.isUpwards = true
      } else {
        this.isUpwards = false
      }

      // Add listeners to hide options when select element moves
      this.scrollParents.forEach(scrollParent => {
        scrollParent.addEventListener('scroll', this.hideOptions)
      })
      window.addEventListener('resize', this.hideOptions)

      // Re-calculate options coordinates
      setTimeout(() => {
        // Wait here so that we can calculate correctly if layout changes while opening the dropdown
        this.computeDropdownPosition()
        this.menuVisible = true
      }, 25)
    },
    hideOptions: function () {
      // De-register event listeners on menu close
      this.deRegisterDomEvents()

      this.menuVisible = false
    },
    deRegisterDomEvents: function () {
      this.scrollParents.forEach(scrollParent => {
        scrollParent.removeEventListener('scroll', this.hideOptions)
      })
      window.removeEventListener('resize', this.hideOptions)
    },
    computeDropdownPosition: function () {
      this.$refs.options.style.left = (this.$refs.dropdownHandle.getBoundingClientRect().left - 1) + 'px'
      this.$refs.options.style.width = (this.$refs.dropdownHandle.getBoundingClientRect().width + 2) + 'px'

      if (this.isUpwards) {
        this.$refs.options.style.top = null
        this.$refs.options.style.bottom = (window.innerHeight - this.$refs.dropdownHandle.getBoundingClientRect().top) + 'px'
      } else {
        this.$refs.options.style.top = this.$refs.dropdownHandle.getBoundingClientRect().bottom + 'px'
        this.$refs.options.style.bottom = null
      }
    },
    getScrollParents: function (element) {
      // Utility method to get scrollable parent of a dom element
      const scrollParents = [document.body]
      let style = getComputedStyle(element)
      const excludeStaticParent = style.position === 'absolute'
      const overflowRegex = /(auto|scroll|hidden)/

      if (style.position === 'fixed') {
        return scrollParents
      }

      for (let parent = element; (parent = parent.parentElement);) {
        style = getComputedStyle(parent)
        if (excludeStaticParent && style.position === 'static') {
          continue
        }
        if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) {
          scrollParents.push(parent)
        }
      }

      return scrollParents
    }
  }
}
