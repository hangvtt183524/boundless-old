<!--suppress ALL -->
<template lang="pug">
  .tel-input.page-component(
    :style="inputContainerStyle"
    :class="selectedClass"
    @click.prevent.stop="selectItem"
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
        :placeholder="translated.placeholder"
        :readonly="readonly"
        :single-line="singleLine"
        :state="state"
        @blur="onBlur"
        @focus="inputFocused = true"
        @input="onInput"
        v-on:keypress="isNumber()"
        v-model="phone"
        :style="inputStyle"
        :class="placeholderClass"
      )
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
            @click.prevent="selectCountryItem(index)",
            @mouseenter.self="pointerSet(index)"
            v-for="(pb, index) in allCountries",
          )
            div(:class="pb.vtelClass")
            strong {{ pb.name }}
            span.dial-code +{{ pb.dialCode }}
    .action-block(v-if="!disableRemove && !config.disableRemove")
      .action.remove-action(@click.stop.prevent="removeInput")
        font-awesome-icon(:icon="timesCircleIcon")
</template>

<script>
import { format, AsYouType, isValidNumber } from 'libphonenumber-js'

import commonStyles from '../../../../engine/mixins/component-common-styles'
import componentStyles from '../../../../engine/mixins/component-styles/tel-input/input'
import selectedItemMixin from '../../mixins/selected-item-mixin'
import removeItemMixin from '../../mixins/remove-item-mixin'
import translationMixin from '../../mixins/translation-mixin'
import allCountries from './countries'

export default {
  name: 'vue-tel-input',
  mixins: [
    commonStyles,
    componentStyles,
    selectedItemMixin,
    removeItemMixin,
    translationMixin
  ],
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
    },
    pageConfig: {
      type: Object,
      required: true
    },
    selectedItem: {
      required: true
    },
    selectedPage: {
      required: true
    },
    component: {
      type: Object,
      required: true
    },
    disableRemove: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    this.setCountryCode()
    this.selectActiveCountry()

    // close country selection dropdown when click inside iframe
    this.iframeElement = this.$el.closest('body')
    if (this.iframeElement) {
      this.iframeElement.removeEventListener('click', this.closePhone)
      this.iframeElement.addEventListener('click', this.closePhone)
    }
    // close country selection dropdown when click outside iframe on main window
    window.removeEventListener('click', this.closePhone)
    window.addEventListener('click', this.closePhone)
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
    'selectedItem.id': {
      handler (value) {
        // disable dropdown when other item is selected
        if (value !== this.index) {
          this.open = false
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

    selectCountryItem (index) {
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

    selectActiveCountry () {
      this.activeCountry = allCountries[this.pointer]
      this.placeholderName = this.$t('builder.phonePlaceHolder')
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

    selectPhoneItem (index) {
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
        this.selectPhoneItem(this.pointer)
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
