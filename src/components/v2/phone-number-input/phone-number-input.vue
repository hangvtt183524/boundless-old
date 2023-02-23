<template lang="pug">
  div.base-text-input.phone-number-input(
    :class="[{'base-text-input--invalid': isValidationStateVisible && !isValid}, {'base-text-input--required': isRequired}, {'base-text-input--has-pre-icon': preIcon}, {'phone-number-input--dropdown-open': isCountryDropdownOpen}]"
  )
    label(
      class="base-text-label"
      v-if="label"
    )
      | {{ label }}
    div.base-text-input__input-container
      v-icon(
        class="base-text-input__pre-icon"
      )
        | $vuetify.icons.phone
      button.phone-number-input__country-selection-trigger(
        @click.stop="toggleDropdown"
      )
        div(
          :class="activeCountry.vtelClass"
        )
          v-icon(
            class="phone-number-input__country-selection-trigger__icon"
          ) {{ isCountryDropdownOpen ? 'arrow_drop_up' : 'arrow_drop_down' }}
      input(
        :type="type"
        :value="value"
        @input="$emit('input', selectionValue.number)"
        @blur="onBlur"
        :placeholder="placeholderValue"
        :disabled="disabled"
        :formatter="format"
        v-on:keypress="isNumber()"
        v-model="phone"
      )
      slot

      perfect-scrollbar.phone-number-input__country-selection-dropdown(
        :class="{open: isCountryDropdownOpen}"
        :options="scrollBarOptions"
        ref="dropdown"
        v-click-outside="clickedOutside"
      )
        ul
          li.phone-number-input__country-selection-dropdown__item(
            :class="optionHighlight(index, pb)"
            :key="pb['iso2']",
            @click.prevent="selectItem(index)",
            @mouseenter.self="pointerSet(index)"
            v-for="(pb, index) in allCountries",
          )
            div(
            :class="pb.vtelClass"
            )
            strong {{ pb.name }}
            span.dial-code +{{ pb.dialCode }}
    div.base-text-input__error-container(
      v-if="errors && errors.length > 0 && touched"
    )
      div.base-text-input__error-container__error(
        v-for="(error, index) of errors"
        :key="index"
      ) {{ error }}

</template>

<script>
import { format, AsYouType, isValidNumber } from 'libphonenumber-js'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import phoneTemp from 'libphonenumber-js/examples.mobile.json'
import allCountries from './countries'

export default {
  name: 'phone-number-input',
  extends: BaseTextInput,
  props: {
    itemHeight: {
      type: Number,
      default: 48
    },
    maxContainerHeight: {
      type: Number,
      default: 200
    }
  },
  data: function () {
    return {
      phone: '',
      allCountries,
      activeCountry: [],
      isCountryDropdownOpen: false,
      pointer: 73,
      countryCode: 33,
      placeholderValue: this.placeholder,
      scrollBarOptions: {
        wheelPropagation: false
      }
    }
  },
  mounted () {
    this.setCountryCode()
    this.selectActiveCountry()
  },
  destroyed () {
    window.removeEventListener('keydown', this.onKeyDown)
  },
  computed: {
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
    isValid: function () {
      if (this.validations) {
        if (this.validations.required && !this.value) {
          return false
        }

        if (this.value && this.validations.methods) {
          for (let i = 0; i < this.validations.methods.length; i++) {
            const methodData = this.validations.methods[i]
            if (!methodData.method(this.value)) {
              return false
            }
          }
        }
      }

      return this.value ? isValidNumber(this.formattedInternationalResult) : true
    },
    selectionValue () {
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
    isCountryDropdownOpen (value) {
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
    }
  },
  methods: {
    isNumber: function (evt) {
      if (!evt) {
        evt = window.event
      }
      const charCode = (evt.which) ? evt.which : evt.keyCode

      if (charCode < 48 || charCode > 57) {
        evt.preventDefault()
      } else {
        return true
      }
    },

    pointerDown () {
      if (this.pointer < this.allCountries.length - 1) {
        this.pointer++
        if (this.$refs.dropdown.$el.scrollTop <= this.pointerPosition - (this.visibleElements - 1) * this.itemHeight) {
          this.$refs.dropdown.$el.scrollTop = this.pointerPosition - (this.visibleElements - 1) * this.itemHeight
        }
      }
    },
    pointerUp () {
      if (this.pointer > 0) {
        this.pointer--
        if (this.$refs.dropdown.$el.scrollTop >= this.pointerPosition) {
          this.$refs.dropdown.$el.scrollTop = this.pointerPosition
        }
      }
    },

    pointerSet (index) {
      this.pointer = index
    },

    selectActiveCountry () {
      this.activeCountry = allCountries[this.pointer]
      this.placeholderValue = format(`+${this.activeCountry.dialCode}${phoneTemp[this.activeCountry.iso2]}`, this.activeCountry && this.activeCountry.iso2, 'National')
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

      this.$emit('input', this.selectionValue.number)
      // Emit the response, includes phone, validity and country
      this.$emit('blur')
      this.isCountryDropdownOpen = false
    },
    format (value) {
      return new AsYouType(this.activeCountry.iso2).input(value)// eslint-disable-line
    },
    onBlur () {
      this.touched = true
    },
    openDropdown () {
      this.isCountryDropdownOpen = true
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
          this.$refs.dropdown.$el.scrollTop = this.pointerPosition
        }
      }
    },

    isCharacterKey (charCode) {
      return ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode === 8)
    },

    toggleDropdown () {
      if (!this.readonly) {
        this.isCountryDropdownOpen = !this.isCountryDropdownOpen
      }
    },

    closePhone () {
      this.isCountryDropdownOpen = false
    },

    clickedOutside () {
      this.isCountryDropdownOpen = false
    },

    optionHighlight (index, option) {
      return {
        'highlight': index === this.pointer,
        'active': option.iso2 === this.activeCountry.iso2
      }
    }
  }
}
</script>

<style src="./phone-number-input.scss" lang="scss" scoped></style>
