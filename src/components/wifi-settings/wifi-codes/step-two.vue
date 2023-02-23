<template lang="pug">
  .wifi-step-two
    v-layout(row wrap mt-3 align-baseline)
      v-flex(xs12 sm12 mt-2 mb-2)
        .section-title {{ $t('wifi.accessDuration') }}
      v-flex(xs12 sm6 pr-2)
        v-select(
          :items='sessionTimeOutOptions'
          :label="$t('wifi.sessionTimeout')"
          v-model='value.sessionTimeOut'
        )
      v-flex(xs12 sm6)
        v-select(
          :items='numberOfSimultaneousDeviceOptions'
          :label="$t('wifi.numberDifferentDevices')"
          v-model='value.device_per_code'
        )
      v-flex(xs12)
        v-layout(row align-center mt-2)
          .section-title {{ $t('wifi.accessCodeOptions') }}
      v-layout(wrap mt-3 align-end)
        v-flex(xs12 sm6, md2 pr-2 pl-2 class="input-wrap")
          v-text-field.password-length(
            :label="$t('wifi.characterLength')"
            v-model="value.characterLength"
            :min="5"
            :max="128"
            type="number"
            :error-messages="getErrors('characterLength')"
            @keypress="onPasswordLengthKeyPress($event)"
            @paste="onPasswordLengthPaste($event)"
            @input="$v.value.characterLength.$touch"
            @blur="$v.value.characterLength.$touch"
          )
        v-flex.check-box(xs12 sm6, md3 mt-3 pr-2 pl-2)
          v-checkbox(
            color="primary"
            v-model="value.include_numbers"
            :label="$t('wifi.numbers')"
            hide-details
          )
        v-flex.check-box(xs12 sm6, md3 mt-3 pr-2 pl-2)
          v-checkbox(
            color="primary"
            v-model="value.include_letters"
            :label="$t('wifi.letters')"
            hide-details
          )
        v-flex.check-box(xs12 sm6, md4 mt-3 pr-2 pl-2)
          v-checkbox(
            color="primary"
            v-model="value.include_special_characters"
            :label="$t('wifi.specialCharacters')"
            hide-details
          )
      v-layout(row v-if="invalidPasswordOption()")
        .password-error {{ $t('errors.selectAnyPasswordOption') }}
      v-layout(row wrap mb-1)
        v-flex(xs12 sm12 mt-4)
          .wifi-access-text {{ $t('wifi.availableWifiQuestion') }}
        v-flex(xs12 sm8)
          v-radio-group(
            v-model="value.wifiAccess"
          )
            v-layout(row)
              v-flex(sm6 xs5)
                v-radio(
                  color="primary"
                  :label="$t('wifi.allDay')"
                  value="allDay"
                )
              v-flex(sm6 xs7)
                v-radio(
                  color="primary"
                  :label="$t('wifi.customSchedule')"
                  value="custom"
                )
      v-layout(wrap v-if="value.wifiAccess === 'custom'")
        v-flex.date-time-picker(xs12 sm6 pr-2)
          time-picker(
            v-model="value.startTime"
            :label="$t('general.startTime')"
            required
            :max-time="startMaxTime"
            :error-message="getErrors('startTime')"
            @input="$v.value.startTime.$touch"
            @blur="$v.value.startTime.$touch"
          )
        v-flex.date-time-picker(xs12 sm6 pl-2)
          time-picker(
            v-model="value.endTime"
            :label="$t('general.endTime')"
            required
            :min-time="endMinTime"
            :error-message="getErrors('endTime')"
            @input="$v.value.endTime.$touch"
            @blur="$v.value.endTime.$touch"
          )
      v-layout(row wrap :class="{'mt-4': value.wifiAccess === 'allDay'}")
        v-flex(xs12 sm12)
          .wifi-access-text {{ $t('wifi.availableCodesValidQuestion') }}
        v-flex.date-time-picker(xs12 sm6 pr-2)
          date-picker(
            v-model="value.startDate"
            :label="$t('general.startDate')"
            :min-date="new Date().toISOString()"
            :max-date="startMaxDate"
            required
            :error-message="getErrors('startDate')"
            @input="$v.value.startDate.$touch"
            @blur="$v.value.startDate.$touch"
          )
        v-flex.date-time-picker(xs12 sm6 pl-2)
          date-picker(
            v-model="value.endDate"
            :label="$t('general.endDate')"
            :min-date="endMinDate"
            required
            :error-message="getErrors('endDate')"
            @input="$v.value.endDate.$touch"
            @blur="$v.value.endDate.$touch"
          )

</template>

<script>
import { required } from 'vuelidate/lib/validators'

import DatePicker from '@/components/common/date-picker'
import TimePicker from '@/components/common/time-picker'

import ErrorHandlerMixin from '@/mixins/error-handler.mixin'
import CurrentUserMixin from '@/mixins/current-user.mixin'
import { isNumber } from '@/utils/functions'

const accessCodeCharacterLengthValid = (value) => {
  const numericValue = Number(value)
  return numericValue && Number.isInteger(numericValue) && numericValue >= 5 && numericValue <= 128
}

export default {
  props: ['value'],
  components: {
    DatePicker,
    TimePicker
  },
  mixins: [
    CurrentUserMixin,
    ErrorHandlerMixin
  ],
  data () {
    return {
      sessionTimeOutOptions: [
        { text: '1 hr', value: 1 },
        { text: '3 hr', value: 3 },
        { text: '6 hr', value: 6 },
        { text: '12 hr', value: 12 },
        { text: '24 hr', value: 24 },
        { text: '7 d', value: 168 },
        { text: '30 d', value: 720 }
      ],
      numberOfSimultaneousDeviceOptions: [
        { text: 'Unlimited', value: 0 },
        { text: '1', value: 1 },
        { text: '2', value: 2 },
        { text: '3', value: 3 },
        { text: '4', value: 4 },
        { text: '5', value: 5 }
      ]
    }
  },

  validations: {
    value: {
      startDate: {
        required
      },
      endDate: {
        required
      },
      startTime: {
        required
      },
      endTime: {
        required
      },
      characterLength: {
        required,
        accessCodeCharacterLengthValid
      }
    }
  },
  methods: {
    onPasswordLengthKeyPress (event) {
      const charCode = event.which ? event.which : event.keyCode
      if ((charCode > 31 && (charCode < 48 || charCode > 57))) {
        event.preventDefault()
      }

      return true
    },
    onPasswordLengthPaste (event) {
      const value = event.clipboardData.getData('text')
      if (!isNumber(value)) {
        event.preventDefault()
      }

      return true
    },
    getErrors (fieldName) {
      const vueErrors = this.getVueErrors(`value.${fieldName}`)
      if (vueErrors.length > 0) {
        return vueErrors
      } else {
        return this.getErrorMessages(fieldName)
      }
    },
    isValid () {
      if (!(this.value.include_numbers || this.value.include_letters || this.value.include_special_characters)) {
        return false
      }

      // Check validity of password config character length
      if (!this.value.characterLength || !isNumber(this.value.characterLength) ||
        !accessCodeCharacterLengthValid(this.value.characterLength)) {
        return false
      }

      if (this.value.wifiAccess === 'custom') {
        return !this.$v.value.$invalid
      } else {
        return !this.$v.value.startDate.$invalid && !this.$v.value.endDate.$invalid
      }
    },
    invalidPasswordOption () {
      return !(this.value.include_numbers || this.value.include_letters || this.value.include_special_characters)
    }
  },
  computed: {
    startMaxDate () {
      if (this.value.endDate) {
        return this.strToDate(this.value.endDate).toISOString()
      }
      return null
    },
    endMinDate () {
      if (this.value.startDate) {
        return this.strToDate(this.value.startDate).toISOString()
      }
      return new Date().toISOString()
    },
    startMaxTime () {
      if (this.value.endTime) {
        return this.value.endTime
      }
      return null
    },
    endMinTime () {
      if (this.value.startTime) {
        return this.value.startTime
      }
      return null
    }
  }
}
</script>
<style lang="scss">
.wifi-step-two {
  .advanced-password-options {
    color: #354C77;
    font-family: "Fira Sans";
    font-size: 14px;
    line-height: 18px;
    padding-right: 25px;
    position: relative;
    cursor: pointer;
    &:before,
    &:after{
      content: "";
      position: absolute;
      background-color: #9ba9c4;
      transition: transform 0.25s ease-out;
    }

    /* Vertical line */
    &:before{
      top: 4px;
      right: 4px;
      width: 2px;
      height: 10px;
    }

    /* horizontal line */
    &:after{
      top: 8px;
      right: 0;
      width: 10px;
      height: 2px;
    }
    &.expand {
      &:before{ transform: rotate(90deg); }
      &:after{ transform: rotate(180deg); }
    }
  }
  .section-title {
    color: #354C77;
    font-family: "Fira Sans";
    font-size: 14px;
    font-weight: 600;
    line-height: 18px;
  }

  .wifi-access-text {
      color: #354C77;
      font-family: "Fira Sans";
      font-size: 14px;
      font-weight: 600;
      line-height: 18px;
      margin: 10px 0px 0;
    }
  .v-input--radio-group--column {
    margin-top: 5px;
    .v-input__control {
      width: 100%;
      .v-input__slot {
        margin-bottom: 0;
      }
      .v-messages {
        display: none;
      }
    }
  }
  .password-error {
    margin-top: 10px;
    color: #ec5f59 !important;
    font-size: 12px;
  }

  .v-text-field:not(.search-input):not(.v-textarea).password-length {
    height: 49px;

    .v-input__control {
      position: relative;
    }

    .v-text-field__details {
      position: absolute;
      top: 32px;
    }
  }
}
</style>
