<!--suppress ALL -->
<template lang="pug">
  .tel-input(
    :style="inputContainerStyle"
  )
    label(v-show="config.showLabel", :style="inputLabelStyle") {{ translated.label }}
    .input-wrapper(
      :class="wrapperClass"
    )
      button.selection(
        @click.prevent="toggleDropdown"
        :style="{ backgroundColor: inputStyle['background-color']}"
      )
        div(:class="activeCountry.vtelClass")
        span.dropdown-arrow(
          :style="{'color': config.color.hex}"
        ) {{ open ? '▲' : '▼' }}
      input(
        :formatter="format"
        :placeholder="placeholderName"
        :readonly="readonly"
        :single-line="singleLine"
        :state="state"
        :name="config.fieldName"
        @blur="onBlur"
        @focus="inputFocused = true"
        @input="onInput"
        v-on:keypress="isNumber()"
        v-model="phone"
        :style="inputStyle"
        :class="placeholderClass"
      )
    .error-messages(v-if="$v.$anyError && config.fieldRequired && !$v.phone.required")
      .error-item Field is Required
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
            v-for="(pb, index) in allCountries",
          )
            div(:class="pb.vtelClass")
            strong {{ pb.name }}
            span.dial-code +{{ pb.dialCode }}
</template>

<script>
import { format, AsYouType, isValidNumber } from 'libphonenumber-js'
import { required, helpers } from 'vuelidate/lib/validators'
import commonStyles from '../../mixins/component-common-styles'
import componentStyles from '../../mixins/component-styles/tel-input/input'
import translationMixin from '../../mixins/translation-mixin'
// import phoneTemp from 'libphonenumber-js/examples.mobile.json'
import allCountries from './countries'

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
    },
    config: {
      type: Object,
      required: true
    },
    lang: {
      type: String
    },
    defaultLang: {
      type: String
    },
    index: {
      type: Number,
      required: true
    }
  },
  mixins: [
    commonStyles,
    componentStyles,
    translationMixin
  ],
  mounted () {
    this.setCountryCode()
    this.selectActiveCountry()

    this.$eventHub.$on('VALIDATE_INPUTS', () => {
      this.$v.phone.$touch()
    })
  },
  created () {
    if (this.value) {
      this.phone = this.value
      this.phone = this.formattedResult
    }
    this.selectDefaultCountry()
  },
  data () {
    return {
      phone: '',
      allCountries,
      activeCountry: [],
      open: false,
      justClickedDropdown: false,
      inputFocused: false,
      pointer: 73,
      countryCode: 33,
      placeholderName: this.placeholder,
      error: ''
    }
  },
  beforeMount () {
    this.placeholderName = this.translated.placeholder
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
  validations () {
    let obj = {
      phone: {
        empty: (value) => {
          return (value) => !helpers.req(value)
        }
      }
    }

    if (this.config.fieldRequired) {
      obj.phone.required = required
    }

    return obj
  },
  watch: {
    '$v': {
      handler (value) {
        this.$emit('valid', {
          index: this.index,
          valid: !value.phone.$anyError
        })
      },
      deep: true
    },
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
      this.phone = this.formattedResult
      if (value !== '') this.setCountryCode()
      this.selectActiveCountry()
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
      // this.placeholderName = format(`+${this.activeCountry.dialCode}${phoneTemp[this.activeCountry.iso2]}`, this.activeCountry && this.activeCountry.iso2, 'National')
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

    selectDefaultCountry () {
      if (this.config.defaultSelection) {
        allCountries.forEach((country, pointer) => {
          if (country.name === this.config.defaultSelection.country) {
            this.pointer = pointer
            this.selectActiveCountry()
          }
        })
      }
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
      this.$v.phone.$touch()
      // Emit input event in case v-model is used in the parent
      this.error = ''
      this.$emit('input', this.response.number)
      // Emit the response, includes phone, validity and country
      this.$emit('onInput', this.response)
    },
    onBlur () {
      this.$v.phone.$touch()
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
        if (this.open) {
          this.justClickedDropdown = true
        }
      }
    },

    clickedOutside () {
      if (!this.justClickedDropdown) {
        this.open = false
      }
      this.justClickedDropdown = false
    },

    closePhone () {
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

.tel-input {
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
    display: flex;
    align-content: center;
    justify-content: center;
    position: relative;
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
    z-index: 20;
    padding: 8px 0;
    top: 0;
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
    height: auto;
  }

  .dropdown-menu.show {
    max-height: 300px;
    overflow: scroll;
  }
}
</style>
