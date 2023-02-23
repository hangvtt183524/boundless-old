<template lang='pug'>
  base-dialog(
    :show="show"
    @close="close"
    scrollable
    persistent
    max-width="618"
  )
    template(slot="header")
      h2.dialog-heading {{ dialogTitle }}
    v-layout.content.create-wifi-voucher
      step-one(
        v-model="data"
        ref="step1"
        v-show="currentStep === 1"
      )
      step-two(
        v-model="data"
        ref="step2"
        v-show="currentStep === 2"
      )
    template(slot="footer")
      v-card-actions.create-voucher
        v-layout(row wrap)
          v-flex(xs12)
            v-btn(
              v-show="this.currentStep > 1"
              @click.native="currentStep -= 1"
              color="success"
              large
              outline
              round
              :disabled="isLoading"
            ) {{ $t('general.previous') }}

            v-btn(
              :loading="isLoading"
              :disabled="!isDataValid()"
              @click.native="nextStep"
              color="success"
              large
              round
              style="float: right"
            ) {{ continueBtnLabel }}
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CurrentUserMixin from '@/mixins/current-user.mixin'
import ErrorHandlerMixin from '@/mixins/error-handler.mixin'

import baseDialog from '@/components/common/base-dialog'
import stepOne from './step-one'
import stepTwo from './step-two'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  mixins: [
    CurrentUserMixin,
    ErrorHandlerMixin
  ],

  components: {
    baseDialog,
    stepOne,
    stepTwo
  },

  props: {
    wifiCode: {
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
      isLoading: false,
      currentStep: 1,
      data: {
        batchName: '',
        batchDescription: '',
        selectedGroup: null,
        quantityOfVoucher: 1,
        characterLength: 5,
        include_numbers: true,
        include_letters: true,
        include_special_characters: false,
        wifiAccess: 'allDay',
        startDate: this.getDefaultStartDate(),
        endDate: this.getDefaultEndDate(),
        startTime: '00:00',
        endTime: '23:59',
        sessionTimeOut: 1,
        device_per_code: 0
      }
    }
  },

  computed: {
    ...mapGetters('layout', ['selectedOrganization']),
    continueBtnLabel () {
      if (this.currentStep < 2) {
        return this.$t('general.continue')
      } else {
        return this.wifiCode.id ? this.$t('wifi.updateCodes') : this.$t('wifi.generateCodes')
      }
    },
    dialogTitle () {
      if (this.currentStep === 1) return this.$t('wifi.addVoucher')
      else if (this.currentStep === 2) return this.$t('wifi.voucherOptions')
      return ''
    }
  },

  watch: {
    wifiCode (newValue, oldValue) {
      this.currentStep = 1
      if (newValue && newValue.id) {
        this.data = {
          id: newValue.id,
          batchName: newValue.name,
          batchDescription: newValue.description,
          selectedGroup: newValue.node,
          quantityOfVoucher: newValue.code_count,
          characterLength: newValue.password_config.character_length,
          include_numbers: newValue.password_config.include_numbers,
          include_letters: newValue.password_config.include_letters,
          include_special_characters: newValue.password_config.include_special_characters,
          wifiAccess: newValue.validity_window.start_time === '00:00' && newValue.validity_window.end_time === '23:59' ? 'allDay' : 'custom',
          startDate: this.dateFormatter(newValue.validity_window.start_date),
          endDate: this.dateFormatter(newValue.validity_window.end_date),
          startTime: newValue.validity_window.start_time,
          endTime: newValue.validity_window.end_time,
          sessionTimeOut: newValue.session_timeout,
          device_per_code: newValue.device_per_code || 0
        }
      } else {
        this.data = {
          id: null,
          batchName: '',
          batchDescription: '',
          selectedGroup: null,
          quantityOfVoucher: 1,
          characterLength: 5,
          include_numbers: true,
          include_letters: true,
          include_special_characters: false,
          wifiAccess: 'allDay',
          startDate: this.getDefaultStartDate(),
          endDate: this.getDefaultEndDate(),
          startTime: '00:00',
          endTime: '23:59',
          sessionTimeOut: 1,
          device_per_code: 0
        }
      }
    }
  },

  methods: {
    ...mapActions('organization/voucher', ['createVoucher', 'updateVoucher']),

    close (isRefresh = false) {
      this.$emit('close', isRefresh)
      this.clearForm()
    },

    clearForm () {
      this.data = {
        id: null,
        batchName: '',
        batchDescription: '',
        selectedGroup: null,
        quantityOfVoucher: 1,
        characterLength: 5,
        include_numbers: true,
        include_letters: true,
        include_special_characters: false,
        wifiAccess: 'allDay',
        startDate: this.getDefaultStartDate(),
        endDate: this.getDefaultEndDate(),
        startTime: '00:00',
        endTime: '23:59',
        sessionTimeOut: 1,
        device_per_code: 0
      }

      if (this.$refs.step1) {
        this.$refs.step1.$v.$reset()
      }

      if (this.$refs.step2) {
        this.$refs.step2.$v.$reset()
      }

      this.$v.data.$reset()
    },

    getDefaultStartDate () {
      const now = new Date()
      return this.dateFormatter(now)
    },

    getDefaultEndDate () {
      const tomorrow = new Date()
      tomorrow.setDate((new Date()).getDate() + 1)
      return this.dateFormatter(tomorrow)
    },

    nextStep () {
      if (this.currentStep === 2) {
        this.createWifiCode()
      } else {
        this.currentStep += 1
      }
    },

    isDataValid () {
      if (this.currentStep === 1) {
        if (!this.$refs.step1) {
          return true
        } else {
          return this.$refs.step1.isValid()
        }
      } else if (this.currentStep === 2) {
        if (!this.$refs.step2) {
          return true
        } else {
          return this.$refs.step2.isValid()
        }
      }
      return true
    },

    createWifiCode () {
      this.isLoading = true
      let data = {
        name: this.data.batchName,
        description: this.data.batchDescription,
        code_count: this.data.quantityOfVoucher,
        password_config: {
          character_length: this.data.characterLength,
          include_numbers: this.data.include_numbers,
          include_letters: this.data.include_letters,
          include_special_characters: this.data.include_special_characters
        },
        validity_window: {
          start_date: this.dateFormatter(this.data.startDate, 'YYYY-MM-DD', this.dateFormat),
          start_time: this.data.startTime,
          end_date: this.dateFormatter(this.data.endDate, 'YYYY-MM-DD', this.dateFormat),
          end_time: this.data.endTime
        },
        session_timeout: this.data.sessionTimeOut,
        node: this.data.selectedGroup,
        usage_count_type: 'single',
        device_per_code: this.data.device_per_code
      }

      if (this.wifiCode.id) {
        this.updateVoucher({ id: this.wifiCode.id, ...data }).then(response => {
          global.toastr['success'](this.$t('wifi.updateVoucherSuccess'), this.$t('general.success'))
          this.isLoading = false
          this.close(true)
        }).catch(err => {
          this.setErrorData(err)
          this.isLoading = false
        })

        EventTracker.sendEvent(EVENT_NAMES.VOUCHER_CODES_UPDATED)
      } else {
        this.createVoucher(data).then(response => {
          global.toastr['success'](this.$t('wifi.createVoucherSuccess'), this.$t('general.success'))
          this.isLoading = false
          this.close(true)
        }).catch(err => {
          this.setErrorData(err)
          this.isLoading = false
        })

        EventTracker.sendEvent(EVENT_NAMES.VOUCHER_CODES_GENERATED)
      }
    }
  }
}
</script>

<style lang="scss">
  .create-wifi-voucher {
    @media (max-width: 767px) {
      .flex.input-wrap,
      .flex.check-box,
      .flex.date-time-picker {
        padding: 0 !important;
      }
    }
  }
  .v-card__actions.create-voucher {
    .flex {
      @media (max-width: 767px) {
        display: flex;
        flex-direction: column-reverse;
        align-items: center;
        button {
          width: 170px;
          &:first-child {
            margin-top: 10px !important;
          }
        }
      }
    }
  }
</style>
