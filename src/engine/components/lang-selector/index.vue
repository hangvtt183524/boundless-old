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
  computed: {
    pointerPosition () {
      return this.pointer * this.itemHeight
    },
    visibleElements () {
      return this.maxContainerHeight / this.itemHeight
    }
  },
  watch: {
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
        'active': option.iso2 === this.activeLanguage.iso2
      }
    }
  },

  destroyed () {
    window.removeEventListener('keydown', this.onKeyDown)
  }
}
</script>

<style lang="scss">
@import "styles/colors.scss";

.iti-flag {
  transform: scale(1.25);
}

/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all .5s cubic-bezier(.25,.8,.5,1);
  transform-origin: top;
}

.slide-fade-enter,
.slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-active,
.slide-fade-leave-to {
  pointer-events: none;
}

.slide-fade-enter-to,
.slide-fade-leave {
  opacity: 1;
}

.lang-selector {
  text-align: left;
  position: relative;
  width: 100%;

  &:focus-within {
    border-color: $primary;
  }

  input {
    border: none;
    border-radius: 0 var(--border-radius) var(--border-radius) 0;
    width: 100%;
    outline: none;
    padding-left: 7px;
    flex: 1;
    font-size: 16px;
  }

  .input-wrapper {
    margin-left: 5px
  }

  .error-messages {
    padding-top: 4px;
    font-size: 12px;
    color: #dc3545;
    min-height: 26px;
  }

  .selection {
    cursor: pointer;
    font-size: 0.8em;
    display: flex;
    align-items: center;
    padding: 10px;
    border: 0;
    background: none;

    &:focus {
      outline: none;
    }
  }

  .dropdown {
    margin: 0;
    text-align: left;
    list-style: none;
    max-height: 200px;
    overflow-y: scroll;
    position: absolute;
    left: -1px;
    background-color: #fff;
    width: 100%;
    z-index: 20;
    padding: 8px 0;
    top: 40px;
    border-radius: 2px;

    ul {
      display: flex;
      flex-direction: column;
      padding: 0;
    }

    &::-webkit-scrollbar {
      width: 8px;
    }

    /* Track */
    &::-webkit-scrollbar-track {
      background: $light-gray;
      border: 3px solid transparent;
      background-clip: content-box;
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
      background: $success;
      border: 1px solid $success;
      border-radius: 5px;
    }
  }

  .dropdown-arrow {
    transform: scaleY(0.5);
    display: inline-block;
    color: #9ba9c4;
  }

  .dropdown-item {
    display: block;
    width: 100%;
    padding: .45rem 16px;
    clear: both;
    font-weight: normal;
    color: $black;
    text-align: inherit;
    white-space: nowrap;
    background-color: transparent;
    border: 0;
    display: flex;
    flex-direction: row;
    height: 48px;
    align-items: center;
    justify-content: flex-start;
    overflow: hidden;
    cursor: pointer;
    font-size: 14px;

    &.active {
      color: $primary;
      background-color: transparent;
    }

    &.highlight {
      background-color: #f3f3f3;
    }
  }

  .flag {
    margin-left: 5px;
    margin-right: 10px;
    height: auto;
  }

  .dropdown-menu.show {
    max-height: 300px;
    overflow: scroll;
  }
  .countryIso2 {
    margin-right: 10px;
  }
}
</style>
