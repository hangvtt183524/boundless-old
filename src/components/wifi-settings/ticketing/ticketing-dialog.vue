<template lang="pug">
  base-dialog(
    :show="show"
    :persistent="true"
    :scrollable="true"
    @close="close"
    max-width="620"
  )
    template(slot="header")
      h2.dialog-heading {{ ticketData.id ? $t('wifi.updateTicket') : $t('wifi.createTicket') }}
    v-layout.ticketing-dialog
      v-flex(xs12)
        v-layout(wrap)
          v-flex(xs12, sm6, pr-2, class="input-wrap")
            v-text-field(
              v-model='data.first_name'
              :label="$t('general.firstName')"
              :error-messages="getErrors('first_name')"
              @input="$v.data.first_name.$touch"
              @blur="$v.data.first_name.$touch"
              required
              :disabled="isUsed || (ticketData.id && !hasPermission('ticketing__edit', nodeId))"
            )
          v-flex(xs12, sm6, pl-2, class="input-wrap")
            v-text-field(
              v-model='data.last_name'
              :label="$t('general.lastName')"
              :error-messages="getErrors('last_name')"
              @input="$v.data.last_name.$touch"
              @blur="$v.data.last_name.$touch"
              required
              :disabled="isUsed ||  (ticketData.id && !hasPermission('ticketing__edit', nodeId))"
            )
        v-layout(wrap)
          v-flex(xs12, sm6, pr-2, class="input-wrap")
            tel-input.phone(
              :placeholder="$t('general.phoneNumber')"
              v-model="data.phone"
              :error-messages="getErrors('phone')"
              :readonly="isUsed ||  (ticketData.id && !hasPermission('ticketing__edit', nodeId))"
            )
          v-flex(xs12, sm6, pl-2, class="input-wrap")
            v-text-field.email(
              :label="$t('general.email')"
              v-model="data.email"
              @input="$v.data.email.$touch"
              @blur="$v.data.email.$touch"
              required
              :disabled="isUsed ||  (ticketData.id && !hasPermission('ticketing__edit', nodeId))"
            )
        v-layout(wrap)
          v-flex(xs12, sm6, pr-2, class="input-wrap")
            v-select(
              :items='numberOfSimultaneousDeviceOptions'
              :label="$t('wifi.numberDifferentDevices')"
              v-model='data.device_limit'
            )
        v-layout.password-section(row)
          v-flex(xs12, sm12)
            v-layout(row align-center)
              v-text-field.new-password(
                :label="$t('login.password')"
                v-model="data.password"
                required
                :disabled="isUsed ||  (ticketData.id && !hasPermission('ticketing__edit', nodeId))"
              )
              v-btn.btn-cached(
                depressed
                icon
                color="primary"
                :disabled="!data.include_numbers && !data.include_letters && !data.include_special_characters"
                @click="reGeneratePassword"
                v-show="!isUsed && (!ticketData.id || hasPermission('ticketing__edit', nodeId))"
              )
                v-icon cached
                span {{ $t('wifi.generatePassword') }}
        v-layout(row align-center mt-2)
          .advanced-password-options(@click="onClickPasswordOptions" :class="{'expand': data.isExpandOptions}") {{ $t('wifi.advancedPasswordOptions') }}
        v-layout(wrap mt-3 v-if="data.isExpandOptions" align-baseline)
          v-flex(xs12 sm6, md3 pr-2 pl-2)
            v-text-field.password-length(
              :label="$t('wifi.characterLength')"
              v-model="data.characterLength"
              :min="5"
              type="number"
              :disabled="isUsed ||  (ticketData.id && !hasPermission('ticketing__edit', nodeId))"
            )
          v-flex.check-box(xs12 sm6 md3 mt-3 pr-2 pl-2)
            v-checkbox(
              color="primary"
              v-model="data.include_numbers"
              :label="$t('wifi.numbers')"
              :disabled="isUsed ||  (ticketData.id && !hasPermission('ticketing__edit', nodeId))"
            )
          v-flex.check-box(xs12 sm6, md3 mt-3 pr-2 pl-2)
            v-checkbox(
              color="primary"
              v-model="data.include_letters"
              :label="$t('wifi.letters')"
              :disabled="isUsed ||  (ticketData.id && !hasPermission('ticketing__edit', nodeId))"
            )
          v-flex.check-box(xs12 sm6, md3 mt-3 pr-2 pl-2)
            v-checkbox(
              color="primary"
              v-model="data.include_special_characters"
              :label="$t('wifi.specialCharacters')"
              :disabled="isUsed ||  (ticketData.id && !hasPermission('ticketing__edit', nodeId))"
            )
        v-layout(row wrap mb-1)
          v-flex(xs12 sm12 :class="data.isExpandOptions ? '' : 'mt-2'")
            .wifi-access-text {{ $t('wifi.availableTimeQuestion') }}
          v-flex(xs12 sm8)
            v-radio-group(
              v-model="data.wifiAccess"
            )
              v-layout(row)
                v-flex(sm6 xs5)
                  v-radio(
                    color="primary"
                    :label="$t('wifi.allDay')"
                    value="allDay"
                    :disabled=" (ticketData.id && !hasPermission('ticketing__edit', nodeId))"
                  )
                v-flex(sm6 xs7)
                  v-radio(
                    color="primary"
                    :label="$t('wifi.customSchedule')"
                    value="custom"
                    :disabled=" (ticketData.id && !hasPermission('ticketing__edit', nodeId))"
                  )
        v-layout(wrap v-if="data.wifiAccess === 'custom'")
          v-flex.date-time-picker(xs12 sm6 pr-2)
            time-picker(
              v-model="data.startTime"
              :label="$t('general.startTime')"
              required
              :max-time="startMaxTime"
              :error-messages="getErrors('startTime')"
              @input="$v.data.startTime.$touch"
              @blur="$v.data.startTime.$touch"
              :readonly=" (ticketData.id && !hasPermission('ticketing__edit', nodeId))"
            )
          v-flex.date-time-picker(xs12 sm6 pl-2)
            time-picker(
              v-model="data.endTime"
              :label="$t('general.endTime')"
              required
              :min-time="endMinTime"
              :error-messages="getErrors('endTime')"
              :readonly="!data.startTime ||  (ticketData.id && !hasPermission('ticketing__edit', nodeId))"
              @input="$v.data.endTime.$touch"
              @blur="$v.data.endTime.$touch"
            )
        v-layout(row wrap :class="{'mt-2': data.wifiAccess === 'allDay'}")
          v-flex(xs12 sm12)
            .wifi-access-text {{ $t('wifi.availableDateQuestion') }}
          v-flex.date-time-picker(xs12 sm6 pr-2)
            date-picker(
              v-model="data.startDate"
              :label="$t('general.startDate')"
              :min-date="new Date().toISOString()"
              :max-date="startMaxDate"
              :error-message="getErrors('startDate')"
              @input="$v.data.startDate.$touch"
              @blur="$v.data.startDate.$touch"
              required
              :readonly=" (ticketData.id && !hasPermission('ticketing__edit', nodeId))"
            )
          v-flex.date-time-picker(xs12 sm6 pl-2)
            date-picker(
              v-model="data.endDate"
              :label="$t('general.endDate')"
              :min-date="endMinDate"
              :error-message="getErrors('endDate')"
              @input="$v.data.endDate.$touch"
              @blur="$v.data.endDate.$touch"
              required
              :readonly=" (ticketData.id && !hasPermission('ticketing__edit', nodeId))"
            )
        v-layout(mb-4)
          v-flex(xs12)
            .wifi-access-text {{ $t('wifi.setConfirm') }}
        v-layout
          v-checkbox(
              color="primary"
              v-model="data.confirmationByEmail"
              :label="$t('wifi.confirmationByEmail')"
              :disabled="isUsed ||  (ticketData.id && !hasPermission('ticketing__edit', nodeId))"
            )
        v-layout(v-if="data.confirmationByEmail" row wrap)
          v-flex(xs12)
            v-text-field(
              v-model="data.confirmationEmailSubject"
              auto-grow
              textarea
              :label="$t('wifi.confirmMessageSubject')"
              rows="2"
              counter
              maxlength="200"
              required
              :error-messages="getErrors('confirmationEmailSubject')"
              @input="$v.data.confirmationEmailSubject.$touch"
              @blur="$v.data.confirmationEmailSubject.$touch"
              :disabled="isUsed ||  (ticketData.id && !hasPermission('ticketing__edit', nodeId))"
            )
          v-flex(xs12)
            v-text-field(
              v-model="data.confirmationEmail"
              auto-grow
              textarea
              :label="$t('wifi.confirmMessage')"
              rows="2"
              counter
              maxlength="200"
              required
              :error-messages="getErrors('confirmationEmail')"
              @input="$v.data.confirmationEmail.$touch"
              @blur="$v.data.confirmationEmail.$touch"
              :disabled="isUsed ||  (ticketData.id && !hasPermission('ticketing__edit', nodeId))"
            )
        v-layout(mt-2)
          v-checkbox(
              color="primary"
              v-model="data.confirmationBySms"
              :label="$t('wifi.confirmationBySMS')"
              :disabled="isUsed ||  (ticketData.id && !hasPermission('ticketing__edit', nodeId))"
            )
        v-layout(v-if="data.confirmationBySms")
          v-flex(xs12)
            v-text-field(
              v-model="data.confirmationSms"
              auto-grow
              textarea
              :label="$t('wifi.confirmSMS')"
              rows="2"
              counter
              maxlength="30"
              required
              :error-messages="getErrors('confirmationSms')"
              @input="$v.data.confirmationSms.$touch"
              @blur="$v.data.confirmationSms.$touch"
              :disabled="isUsed ||  (ticketData.id && !hasPermission('ticketing__edit', nodeId))"
            )
    template(slot="footer")
      v-card-actions
        v-layout.text-xs-center.text-sm-right(row)
          v-flex(xs12)
            v-btn(
              v-if="ticketData.id ? hasPermission('ticketing__edit', nodeId) : hasPermission('ticketing__create', nodeId)"
              color="success"
              large
              round
              :loading="isLoading"
              :disabled="!isDataValid()"
              @click="submitTicketing"
            ) {{ ticketData.id ? $t('wifi.updateTicket') : $t('wifi.createTicket') }}
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { email, required, maxLength } from 'vuelidate/lib/validators'
import PasswordGenerator from 'strict-password-generator'
import { isValidNumber } from 'libphonenumber-js'

import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import ErrorHandlerMixin from '@/mixins/error-handler.mixin'
import CurrentUserMixin from '@/mixins/current-user.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

import TelInput from '@/components/common/tel-input/input'
import DatePicker from '@/components/common/date-picker'
import TimePicker from '@/components/common/time-picker'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  components: {
    DatePicker,
    TelInput,
    TimePicker
  },
  mixins: [
    UserPermissionsMixin,
    CurrentUserMixin,
    ErrorHandlerMixin,
    CurrentNodeSelectionsMixin
  ],
  props: {
    ticketData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      data: {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        isExpandOptions: false,
        characterLength: 5,
        include_numbers: true,
        include_letters: true,
        include_special_characters: false,
        wifiAccess: 'allDay',
        startDate: null,
        endDate: null,
        startTime: null,
        endTime: null,
        confirmationByEmail: false,
        confirmationEmail: '',
        confirmationEmailSubject: '',
        confirmationBySms: false,
        confirmationSms: '',
        device_limit: 0
      },
      numberOfSimultaneousDeviceOptions: [
        { text: 'Unlimited', value: 0 },
        { text: '1', value: 1 },
        { text: '2', value: 2 },
        { text: '3', value: 3 },
        { text: '4', value: 4 },
        { text: '5', value: 5 }
      ],
      isLoading: false
    }
  },
  validations: {
    data: {
      first_name: {
        required,
        maxLength: maxLength(32)
      },
      last_name: {
        required,
        maxLength: maxLength(32)
      },
      email: {
        email
      },
      phone: {
        maxLength: maxLength(256) // Dummy validation so that vueErrors method won't fail
      },
      password: {
        required
      },
      startDate: {
        required
      },
      startTime: {
        required
      },
      endDate: {
        required
      },
      endTime: {
        required
      },
      confirmationEmail: {
        required
      },
      confirmationEmailSubject: {
        required
      },
      confirmationSms: {
        required
      }
    }
  },
  watch: {
    ticketData (newValue, oldValue) {
      if (newValue && newValue.id) {
        this.data = {
          first_name: newValue.first_name,
          last_name: newValue.last_name,
          email: newValue.email,
          phone: newValue.phone,
          password: newValue.password,
          characterLength: Number(newValue.password_config.character_length),
          include_numbers: newValue.password_config.include_numbers,
          include_letters: newValue.password_config.include_letters,
          include_special_characters: newValue.password_config.include_special_characters,
          startDate: this.dateFormatter(newValue.validity_window.start_date),
          endDate: this.dateFormatter(newValue.validity_window.end_date),
          startTime: newValue.validity_window.start_time,
          endTime: newValue.validity_window.end_time,
          confirmationByEmail: newValue.confirmation_email_enabled,
          confirmationEmail: newValue.confirmation_email_body,
          confirmationEmailSubject: newValue.confirmation_email_subject,
          confirmationBySms: newValue.confirmation_sms_enabled,
          confirmationSms: newValue.confirmation_sms_body,
          wifiAccess: newValue.validity_window.start_time === '00:00' && newValue.validity_window.end_time === '23:59' ? 'allDay' : 'custom',
          device_limit: newValue.device_limit
        }
      } else {
        this.data = {
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          password: '',
          isExpandOptions: false,
          characterLength: 5,
          include_numbers: true,
          include_letters: true,
          include_special_characters: false,
          wifiAccess: 'allDay',
          startDate: null,
          endDate: null,
          startTime: null,
          endTime: null,
          confirmationByEmail: false,
          confirmationEmail: '',
          confirmationEmailSubject: '',
          confirmationBySms: false,
          confirmationSms: '',
          device_limit: 0
        }
      }
    },
    'data.confirmationByEmail': function (value) {
      if (value) {
        this.data.confirmationEmail = this.data.confirmationEmail || this.$t('wifi.defaultConfirmationEmail')
        this.data.confirmationEmailSubject = this.data.confirmationEmailSubject || this.$t('wifi.defaultConfirmationEmailSubject')
      }
    },
    'data.confirmationBySms': function (value) {
      if (value) {
        this.data.confirmationSms = this.data.confirmationSms || this.$t('wifi.defaultConfirmationSMS')
      }
    }
  },
  computed: {
    ...mapGetters('layout', ['selectedNode']),
    startMaxDate () {
      if (this.data.endDate) {
        return this.strToDate(this.data.endDate).toISOString()
      }
      return null
    },
    endMinDate () {
      if (this.data.startDate) {
        return this.strToDate(this.data.startDate).toISOString()
      }
      return new Date().toISOString()
    },
    startMaxTime () {
      if (this.data.endTime) {
        return this.data.endTime
      }
      return null
    },
    endMinTime () {
      if (this.data.startTime) {
        return this.data.startTime
      }
      return null
    },
    emailError () {
      const errors = []
      !this.data.email && errors.push(this.$t('errors.required'))
      this.data.email && this.$v.data.email.$invalid && errors.push(this.$t('general.emailValid'))
      return errors
    },
    phoneValidation () {
      return isValidNumber(this.data.phone)
    },
    isUsed () {
      return this.ticketData && !!this.ticketData.used_at
    }
  },
  methods: {
    ...mapActions('organization/ticketing', ['createTicketing', 'updateTicketing']),
    close (isRefresh = false) {
      this.$emit('close', isRefresh)
      this.clearForm()
    },
    clearForm () {
      this.data = {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        isExpandOptions: false,
        characterLength: 5,
        include_numbers: true,
        include_letters: true,
        include_special_characters: false,
        wifiAccess: 'allDay',
        startDate: null,
        endDate: null,
        startTime: null,
        endTime: null,
        confirmationByEmail: false,
        confirmationEmail: '',
        confirmationEmailSubject: '',
        confirmationBySms: false,
        confirmationSms: '',
        device_limit: 0
      }
      this.$v.data.$reset()
    },
    reGeneratePassword () {
      const passwordGenerator = new PasswordGenerator()
      const options = {
        upperCaseAlpha: false,
        lowerCaseAlpha: this.data.include_letters,
        number: this.data.include_numbers,
        specialCharacter: this.data.include_special_characters,
        minimumLength: Number(this.data.characterLength),
        maximumLength: Number(this.data.characterLength)
      }
      const password = passwordGenerator.generatePassword(options)
      this.data.password = password.toUpperCase()
    },
    onClickPasswordOptions () {
      this.data = {
        ...this.data,
        isExpandOptions: !this.data.isExpandOptions
      }
    },
    strToDate (value, format = null) {
      return this.$moment(value, format || this.dateFormat)
    },
    getErrors (fieldName) {
      const vueErrors = this.getVueErrors(`data.${fieldName}`)
      if (vueErrors.length > 0) {
        return vueErrors
      } else {
        return this.getErrorMessages(fieldName)
      }
    },
    displayNonFieldErrors () {
      (this.errorData.non_field_errors || []).forEach(error => {
        if (error.code === 'unique') {
          global.toastr['error'](this.$t('wifi.ticketPasswordNonUnique'), this.$t('general.error'))
        }
      })
    },
    isDataValid () {
      let invalid = this.$v.data.first_name.$invalid || this.$v.data.last_name.$invalid
      invalid = invalid || this.$v.data.email.$invalid
      invalid = invalid || this.$v.data.password.$invalid
      invalid = invalid || this.$v.data.startDate.$invalid
      invalid = invalid || this.$v.data.endDate.$invalid
      if (this.data.wifiAccess === 'custom') {
        const fields = [
          'startTime',
          'endTime'
        ]
        for (let field of fields) {
          if (this.$v.data[field].$invalid) {
            return false
          }
        }
      }
      invalid = invalid || (this.data.confirmationByEmail && (!this.data.email || this.$v.data.confirmationEmail.$invalid))
      invalid = invalid || (this.data.confirmationBySms && (!this.data.phone || !this.phoneValidation || this.$v.data.confirmationSms.$invalid))
      return !invalid
    },
    submitTicketing () {
      this.isLoading = true
      let data = {
        first_name: this.data.first_name,
        last_name: this.data.last_name,
        email: this.data.email || null,
        phone: this.data.phone,
        password: this.data.password,
        password_config: {
          character_length: this.data.characterLength,
          include_numbers: this.data.include_numbers,
          include_letters: this.data.include_letters,
          include_special_characters: this.data.include_special_characters
        },
        validity_window: {
          start_date: this.dateFormatter(this.data.startDate, 'YYYY-MM-DD', this.dateFormat),
          start_time: this.data.wifiAccess === 'custom' ? this.data.startTime : '00:00',
          end_date: this.dateFormatter(this.data.endDate, 'YYYY-MM-DD', this.dateFormat),
          end_time: this.data.wifiAccess === 'custom' ? this.data.endTime : '23:59'
        },
        confirmation_email_enabled: this.data.confirmationByEmail,
        confirmation_email_body: this.data.confirmationEmail,
        confirmation_email_subject: this.data.confirmationEmailSubject,
        confirmation_sms_enabled: this.data.confirmationBySms,
        confirmation_sms_body: this.data.confirmationSms,
        device_limit: this.data.device_limit,
        node: this.selectedNode.id
      }

      if (this.ticketData.id) {
        this.updateTicketing({ id: this.ticketData.id, ...data }).then(response => {
          global.toastr['success'](this.$t('wifi.updateTicketSuccess'), this.$t('general.success'))
          this.isLoading = false
          this.close(true)
        }).catch(err => {
          this.setErrorData(err)
          this.displayNonFieldErrors()

          this.isLoading = false
        })
      } else {
        this.createTicketing(data).then(response => {
          global.toastr['success'](this.$t('wifi.addTicketSuccess'), this.$t('general.success'))
          this.isLoading = false
          this.close(true)
        }).catch(err => {
          this.setErrorData(err)
          this.displayNonFieldErrors()

          this.isLoading = false
        })

        EventTracker.sendEvent(EVENT_NAMES.GUEST_TICKET_CREATED)
      }
    }
  }
}
</script>
<style lang="scss">
  .ticketing-dialog {
    @media (max-width: 767px) {
      .flex.input-wrap,
      .flex.check-box,
      .flex.date-time-picker {
        padding: 0 !important;
      }
    }
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
    .password-section {
      .btn-cached {
        width: fit-content;
        border-radius: 4px;
        background-color: #4C83F0;
        padding: 5px 10px;
        i {
          font-size: 18px;
          margin-right: 5px;
        }
        &.v-btn.v-btn--disabled {
          background-color: rgba(0,0,0,.12)!important;
        }
        @media (max-width: 767px) {
          i {
            margin-right: 0;
          }
          span {
            display: none;
          }
        }
      }
    }
    .simultaneous-text {
      color: #354C77;
      font-family: "Fira Sans";
      font-size: 14px;
      font-weight: 600;
      line-height: 18px;
      margin: 30px 0px 20px 0px;
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
    .password-length {
      &.v-text-field {
        height: auto;
      }
      .v-input__slot {
        margin-bottom: 0;
      }
      .v-text-field__details {
        display: none;
      }
    }
    .tel-input.phone {
      .dropdown {
        min-width: unset;
      }
    }
  }
</style>
