<!--suppress ALL -->
<template lang="pug">
  .tel-input(
    :class="{'tel-input--readonly': readonly}"
  )
    .input-wrapper(
      :class="wrapperClass"
    )
      button.selection(
        data-test="open-phone-flags-button"
        @click.stop="toggleDropdown"
      )
        div(:class="activeCountry.vtelClass")
        span.dropdown-arrow {{ open ? '▲' : '▼' }}
      label {{ labelText }}
      input(
        data-test="phone-input"
        :formatter="format"
        :placeholder="placeholderName"
        :readonly="readonly"
        :single-line="singleLine"
        :state="state"
        @blur="onBlur"
        @focus="inputFocused = true"
        @input="onInput"
        v-on:keypress="isNumber()"
        v-model="phone"
      )
    .error-messages(data-test="phone-error-messages")
      .error-item(v-if="error || errorMessages[0]" data-test="phone-error") {{ error || errorMessages[0] }}
    v-slide-y-transition
      .dropdown(
        :class="{open: open}"
        ref="dropdown"
        v-click-outside="clickedOutside"
      )
        ul
          li.dropdown-item(
            :data-test="`phone-flag-${pb['iso2']}`"
            :class="optionHighlight(index, pb)"
            :key="pb['iso2']",
            @click.prevent="selectItem(index)",
            @mouseenter.self="pointerSet(index)"
            v-for="(pb, index) in allCountries",
          )
            div(:class="pb.vtelClass")
            strong {{ pb.name }}
            span.dial-code +{{ pb.dialCode }}
</template>

<script>
import { format, AsYouType, isValidNumber } from 'libphonenumber-js'
import phoneTemp from 'libphonenumber-js/examples.mobile.json'
import allCountries from './countries'
import '../../../engine/components/tel-input/tel-input.css'
// import 'vue-tel-input/dist/vue-tel-input.css'

export default {
  name: 'vue-tel-input',
  props: {
    value: {
      type: String
    },
    label: {
      type: String,
      default: 'Phone Number'
    },
    itemHeight: {
      type: Number,
      default: 48
    },
    maxContainerHeight: {
      type: Number,
      default: 200
    },
    errorMessages: {
      type: Array,
      default () {
        return []
      }
    },
    required: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    singleLine: {
      type: Boolean,
      default: false
    },
    placeholder: {
      placeholder: String,
      default: ''
    }
  },
  mounted () {
    this.setCountryCode()
    this.selectActiveCountry()

    this.modalElement = this.$el.closest('.v-dialog')
    if (this.modalElement) {
      this.modalElement.removeEventListener('click', this.closePhone)
      this.modalElement.addEventListener('click', this.closePhone)
    }
  },
  created () {
    if (this.value) {
      this.phone = this.value
      this.phone = this.formattedResult
    }
  },
  data () {
    return {
      phone: '',
      allCountries,
      activeCountry: [],
      open: false,
      inputFocused: false,
      pointer: 73,
      countryCode: 33,
      placeholderName: this.placeholder,
      error: ''
    }
  },
  computed: {
    wrapperClass () {
      return {
        'error--text': this.errorMessages.length || this.error,
        'input--dirty': this.phone,
        'input--focused': this.inputFocused,
        'input--placeholder': this.placeholderName,
        'no-value': !this.phone
      }
    },
    mode () {
      if (!this.phone) {
        return ''
      }
      if (this.phone[0] === '+') {
        return 'code'
      }
      if (this.phone[0] === '0') {
        return 'prefix'
      }
      return 'normal'
    },
    labelText () {
      if (!this.label) {
        return ''
      }
      let requiredText = (this.required) ? '*' : ''
      return this.label + requiredText
    },
    formattedInternationalResult () {
      if (!this.mode || !this.allCountries) {
        return ''
      }
      let phone = this.phone
      if (this.mode === 'code') {
        // If user manually type the country code
        const formatter = new AsYouType()// eslint-disable-line
        formatter.input(this.phone)
      } else if (this.mode === 'prefix') {
        // Remove the first '0' if this is a '0' prefix number
        // Ex: 0432421999
        phone = this.phone.slice(1)
      }

      return format(phone, this.activeCountry && this.activeCountry.iso2, 'International')
    },
    formattedResult () {
      // Calculate phone number based on mode
      if (!this.mode || !this.allCountries) {
        return ''
      }
      let phone = this.phone
      if (this.mode === 'code') {
        // If user manually type the country code
        const formatter = new AsYouType()// eslint-disable-line
        formatter.input(this.phone)
      } else if (this.mode === 'prefix') {
        // Remove the first '0' if this is a '0' prefix number
        // Ex: 0432421999
        phone = this.phone.slice(1)
      }
      return format(phone, this.activeCountry && this.activeCountry.iso2, 'National')
    },
    state () {
      return isValidNumber(this.formattedInternationalResult)
    },
    response () {
      let number = this.formattedInternationalResult && this.formattedInternationalResult.replace(/ /g, '')
      return {
        number,
        isValid: this.state,
        country: this.activeCountry.name
      }
    },
    pointerPosition () {
      return this.pointer * this.itemHeight
    },
    visibleElements () {
      return this.maxContainerHeight / this.itemHeight
    }
  },
  watch: {
    state (value) {
      if (value) {
        // If mode is 'prefix', keep the number as user typed,
        // Otherwise format it
        if (this.mode !== 'prefix') {
          this.phone = this.formattedResult
        }
      }
    },
    open (value) {
      if (value) {
        window.removeEventListener('keydown', this.onKeyDown)
        window.addEventListener('keydown', this.onKeyDown)
      } else {
        window.removeEventListener('keydown', this.onKeyDown)
      }
    },
    value (value) {
      this.phone = value
      if (value !== '') this.setCountryCode()
      this.selectActiveCountry()
      this.phone = this.formattedResult
    },
    readonly (value) {
      if (this.phone === '') {
        this.pointer = 73
        this.selectActiveCountry()
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
      if (this.pointer < this.allCountries.length - 1) {
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
      this.activeCountry = allCountries[this.pointer]
      this.placeholderName = format(`+${this.activeCountry.dialCode}${phoneTemp[this.activeCountry.iso2]}`, this.activeCountry && this.activeCountry.iso2, 'National')
      this.$emit('onInput', this.response)
    },

    setCountryCode () {
      const that = this
      allCountries.forEach(function (d, i) {
        if (that.phone.includes('+' + d.dialCode)) {
          that.pointer = i
          that.countryCode = d.dialCode
          return true
        }
      })
    },

    selectItem (index) {
      if (this.countryCode === allCountries[index].dialCode) return

      this.pointer = index
      this.countryCode = allCountries[index].dialCode
      this.selectActiveCountry()

      if (!this.state && this.phone) {
        this.error = this.$t('general.phoneValid')
      }
      this.$emit('input', this.response.number)
      // Emit the response, includes phone, validity and country
      this.$emit('blur')
      this.open = false
    },
    format (value) {
      return new AsYouType(this.activeCountry.iso2).input(value)// eslint-disable-line
    },
    onInput () {
      // Emit input event in case v-model is used in the parent
      this.error = ''
      this.$emit('input', this.response.number)
      // Emit the response, includes phone, validity and country
      this.$emit('onInput', this.response)
    },
    onBlur () {
      if (!this.state && this.phone) {
        this.error = this.$t('general.phoneValid')
      }
      this.$emit('blur')
      this.inputFocused = false
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
        let countryIndex = this.allCountries.findIndex((item) => {
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
      if (!this.readonly) {
        this.open = !this.open
      }
    },

    closePhone () {
      this.open = false
    },

    clickedOutside () {
      this.open = false
    },

    optionHighlight (index, option) {
      return {
        'highlight': index === this.pointer,
        'active': option.iso2 === this.activeCountry.iso2
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

.tel-input {
  text-align: left;
  position: relative;
  padding-top: 18px;

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
    height: 30px;
    font-size: 16px;
  }

  .input-wrapper {
    display: flex;
    align-content: center;
    justify-content: center;
    position: relative;

    label {
      display: inline-block;
      font-size: 16px;
      line-height: 30px;
      height: 30px;
      max-width: 90%;
      min-width: 0;
      overflow: hidden;
      pointer-events: none;
      text-align: left;
      text-overflow: ellipsis;
      -webkit-transform-origin: top left;
      transform-origin: top left;
      -webkit-transition: .4s cubic-bezier(.25,.8,.25,1);
      transition: .4s cubic-bezier(.25,.8,.25,1);
      white-space: nowrap;
      width: 100%;
      z-index: 0;
      position: absolute;
      top: 0;
      left: 64px;
      color: #9ba9c4;
    }

    &.input--placeholder label,
    &.input--focused label,
    &.input--focused label,
    &.input--dirty label {
      transform: translateY(-18px) scale(.75);
      left: 0;
    }

    &::before {
      content: "";
      position: absolute;
      top: 100%;
      width: 100%;
      border-top: 1px solid #f5f6fa;
      border-bottom: 1px solid #e2e7f0;
    }

    &::after {
      content: "";
      position: absolute;
      left: 0;
      top: 100%;
      transition: .3s cubic-bezier(.4,0,.2,1);
      background-color: $primary;
      top: 100%;
      height: 2px;
      -webkit-transform: scaleX(0);
      transform: scaleX(0);
      -webkit-transform-origin: center center 0;
      transform-origin: center center 0;
      width: 100%;
      z-index: 1;
    }

    &.input--focused::after {
      transform: scaleX(1);
    }

    &.error--text::before {
      border-top-color: none;
      border-bottom-color: $red;
    }

    &.error--text::after {
      background-color: $red;
    }

  }

  .error-messages {
    padding-top: 4px;
    font-size: 12px;
    color: $red;
    min-height: 26px;
  }

  .selection {
    cursor: pointer;
    font-size: 0.8em;
    display: flex;
    align-items: center;
    padding-right: 5px;
    border: 0;

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
    min-width: 400px;
    z-index: 20;
    padding: 8px 0;
    top: 0;
    border-radius: 2px;

    visibility: hidden;

    &.open {
      visibility: visible;
    }

    ul {
      display: flex;
      flex-direction: column;
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
    font-weight: 400;
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

    &.active {
      color: $primary;
    }

    &.highlight {
      background-color: #f3f3f3;
    }

    img {
      width: 25px;
      margin-right: 25px;
    }

    .dial-code {
      margin-left: 5px;
      color: #9ba9c4;
    }
  }

  .flag {
    margin-left: 5px;
    margin-right: 10px;
  }

  .dropdown-menu.show {
    max-height: 300px;
    overflow: scroll;
  }

  &--readonly {
    input {
      color: rgba(0,0,0,.38);
    }
  }
}
</style>
