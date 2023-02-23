<template lang="pug">
  .address-input
    .input-wrapper(:class="cssClass")
      label {{  labelText }}
      input(
        data-test="address-input"
        v-model="address"
        ref="autocomplete"
        :disabled="readonly"
        :readonly="readonly"
        :placeholder="placeholder"
        @click="onClick"
        @blur="onBlur"
        @input="onInput"
        @focus="onFocus"
      )
    .error-messages
      .error-item(v-if="!inputFocused && errorMessages && errorMessages[0]") {{errorMessages[0]}}
</template>

<script>
export default {
  props: {
    value: {
      type: String
    },
    label: {
      type: String,
      default: 'Address'
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
    placeholder: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      inputFocused: false,
      address: '',
      selectedAddress: ''
    }
  },
  mounted () {
    this.autocomplete = new window.google.maps.places.Autocomplete(
      (this.$refs.autocomplete),
      { types: ['geocode'] }
    )

    this.autocomplete.addListener('place_changed', () => {
      let place = this.autocomplete.getPlace()
      this.address = place.formatted_address
      this.selectedAddress = place.formatted_address
      this.$emit('input', place.formatted_address)
      this.$emit('changed', this.formattedJsonAddress(place))
      this.inputFocused = false
    })

    if (this.value) {
      this.address = this.value
    }
  },
  computed: {
    labelText () {
      let requiredText = (this.required) ? '*' : ''
      return this.label + requiredText
    },
    cssClass () {
      return {
        'input--focused': this.inputFocused,
        'input--dirty': this.address,
        'error--text': this.errorMessages.length && !this.inputFocused,
        'readonly': this.readonly
      }
    }
  },
  methods: {
    onClick (e) {
      if (this.readonly) {
        e.preventDefault()
      }
    },
    onBlur () {
      if (this.readonly) {
        return
      }
      this.$emit('input', this.selectedAddress)
      this.$emit('blur')
      this.inputFocused = false
    },
    onInput (e) {
      this.inputFocused = true
      this.$emit('input', e.target.value)
    },
    onFocus () {
      if (this.readonly) {
        return
      }
      this.inputFocused = true
    },
    formattedJsonAddress (place) {
      const keys = [
        'address_components',
        'formatted_address',
        'icon',
        'id',
        'name',
        'place_id',
        'types',
        'url',
        'utc_offset_minutes',
        'vicinity',
        'geometry'
      ]
      const address = {}
      for (let key of keys) {
        address[key] = place[key]
      }

      return address
    }
  },
  watch: {
    value (newValue) {
      if (!newValue) {
        this.address = ''
      } else {
        this.address = newValue
      }
    }
  }
}
</script>

<style lang="scss">
@import "styles/colors.scss";

.address-input {
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
      left: 0;
      color: #9ba9c4;
    }

    &.input--focused label,
    &.input--dirty label {
      transform: translateY(-18px) scale(.75);
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

    &.readonly::before {
      display: none !important;
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
}
</style>
