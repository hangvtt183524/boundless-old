<!--suppress ALL -->
<template lang="pug">
  .lang-selector
    .input-wrapper
      button.selection(
        @click.prevent="toggleDropdown"
      )
        div(:class="activeLanguage.vtelClass")
        strong(class="countryIso2") {{ activeLanguage.language }}
        span.dropdown-arrow {{ open ? '▲' : '▼' }}
    transition(name="slide-fade")
      .dropdown(
        :class="{open: open}"
        ref="dropdown"
        v-click-outside="clickedOutside"
        v-show="open"
      )
        ul
          li.dropdown-item(
            :class="optionHighlight(index, pb)"
            :key="pb['iso2']",
            @click.prevent="selectItem(index)",
            @mouseenter.self="pointerSet(index)"
            v-for="(pb, index) in allLanguages",
          )
            div(:class="pb.vtelClass")
            strong {{ pb.language }}
</template>

<script>
import allLanguages from './languages'

export default {
  name: 'lang-selector',
  props: {
    itemHeight: {
      type: Number,
      default: 48
    },
    maxContainerHeight: {
      type: Number,
      default: 200
    },
    langList: {
      type: Array,
      default: () => (['en_US'])
    },
    defaultLang: {
      type: String
    },
    index: {
      type: Number
    }
  },
  data () {
    return {
      allLanguages: allLanguages.filter(c => (this.langList.indexOf(c.localeCountry) !== -1)),
      activeLanguage: allLanguages.find(c => (c.localeCountry === this.defaultLang)),
      open: false,
      justClickedDropdown: false,
      inputFocused: false,
      pointer: 0,
      error: ''
    }
  },
  mounted () {
    // close country selection dropdown when click inside iframe
    this.iframeElement = this.$el.closest('body')
    if (this.iframeElement) {
      this.iframeElement.removeEventListener('click', this.clickedOutside)
      this.iframeElement.addEventListener('click', this.clickedOutside)
    }
    // close country selection dropdown when click outside iframe on main window
    window.removeEventListener('click', this.clickedOutside)
    window.addEventListener('click', this.clickedOutside)
  },
  computed: {
    pointerPosition () {
      return this.pointer * this.itemHeight
    },
    visibleElements () {
      return this.maxContainerHeight / this.itemHeight
    }
  },
  watch: {
    langList (newVal, oldVal) {
      this.allLanguages = allLanguages.filter(c => (newVal.indexOf(c.localeCountry) !== -1))
    },
    defaultLang (newVal, oldVal) { // watch it
      this.pointer = this.allLanguages.findIndex(c => c.localeCountry === newVal)
      this.selectActiveCountry()
    },
    open (value) {
      if (value) {
        window.removeEventListener('keydown', this.onKeyDown)
        window.addEventListener('keydown', this.onKeyDown)
      } else {
        window.removeEventListener('keydown', this.onKeyDown)
      }
    }
  },
  methods: {
    isNumber: function (evt) {
      if (!evt) {
        evt = window.event
      }
      var charCode = (evt.which) ? evt.which : evt.keyCode

      if (charCode < 48 || charCode > 57) {
        evt.preventDefault()
      } else {
        return true
      }
    },

    pointerDown () {
      if (this.pointer < this.allLanguages.length - 1) {
        this.pointer++
        if (this.$refs.dropdown.scrollTop <= this.pointerPosition - (this.visibleElements - 1) * this.itemHeight) {
          this.$refs.dropdown.scrollTop = this.pointerPosition - (this.visibleElements - 1) * this.itemHeight
        }
      }
    },
    pointerUp () {
      if (this.pointer > 0) {
        this.pointer--
        if (this.$refs.dropdown.scrollTop >= this.pointerPosition) {
          this.$refs.dropdown.scrollTop = this.pointerPosition
        }
      }
    },

    pointerSet (index) {
      this.pointer = index
    },

    selectActiveCountry () {
      this.activeLanguage = this.allLanguages[this.pointer]
      this.$emit('langSelect', this.activeLanguage.localeCountry)
    },

    selectItem (index) {
      this.pointer = index
      this.selectActiveCountry()
      this.open = false
    },
    openDropdown () {
      this.open = true
      window.addEventListener('keydown', this.onKeyDown)
    },

    onKeyDown (e) {
      e.preventDefault()

      if (e.code === 'ArrowDown') {
        this.pointerDown()
      } else if (e.code === 'ArrowUp') {
        this.pointerUp()
      }

      if (e.code === 'Enter') {
        this.selectItem(this.pointer)
      }

      // Scroll to country item if an alphabet key is pressed
      if (this.isCharacterKey(e.keyCode)) {
        let countryIndex = this.allLanguages.findIndex((item) => {
          return item.name.toLowerCase().indexOf(e.key) === 0
        })

        if (countryIndex >= 0) {
          this.pointer = countryIndex
          this.$refs.dropdown.scrollTop = this.pointerPosition
        }
      }
    },

    isCharacterKey (charCode) {
      return ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode === 8)
    },

    toggleDropdown () {
      this.open = !this.open
      if (this.open) {
        this.justClickedDropdown = true
      }
    },

    clickedOutside () {
      if (!this.justClickedDropdown) {
        this.open = false
      }
      this.justClickedDropdown = false
    },

    closeDropdown () {
      this.open = false
    },

    optionHighlight (index, option) {
      return {
        'highlight': index === this.pointer,
        'active': option.localeCountry === this.activeLanguage.localeCountry
      }
    }
  },

  destroyed () {
    window.removeEventListener('keydown', this.onKeyDown)
  }
}
</script>
