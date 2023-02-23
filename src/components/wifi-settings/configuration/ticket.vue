<template lang="pug">
  v-container(grid-list-md)
    // top paragraphs
    v-layout
      v-flex(xs12, sm12, md6, lg6)
        h2 {{ $t(' wifi.addTicket ') }}
      v-flex.pb-3(xs6, md6, lg6, text-xs-right)
        v-btn.primary-action(color='primary')
          | {{ $t('general.save') }}
          v-icon save

    // personalWifiOptions
    h3.small-heading.mb-3.mt-5 {{ $t('wifi.createANewPersonalWifiTicket') }}

    v-layout(row)
      v-flex.mr-2(xs12 sm6)
        .form-card.round
          v-layout(row)
            v-flex(xs12, sm6)
              v-text-field(:label="$t('general.firstName')", v-model="firstName")
              v-text-field(:label="$t('general.email')", v-model="email")

            v-flex(xs12, sm6)
              v-text-field(:label="$t('general.lastName')", v-model="lastName")
              tel-input(
                :label="$t('general.phoneNumber')"
                v-model="phone"
                :readonly="readonly"
                placeholder="--"
              )

      v-flex.ml-2(xs12 sm6)
        .form-card.round
          v-layout(row)
            v-flex.pt-4(xs12)
              v-layout(row)
                v-flex.switch-label(xs12)
                  span
                    | {{ $t('wifi.wifiAccess') }}
                v-flex.switch-label(xs12)
                  base-switch(color="deep-purple lighten-2", :label-left="$t('wifi.predefined')", :label-right="$t('wifi.customized')" v-model="wifiAccessEnabled")
          v-layout.mt-4(row)
            v-flex(xs12, sm6, v-if="!wifiAccessEnabled")
              v-select(:items='customDurationOptions', v-model='customDuration', :label="$t('wifi.duration')", single-line)

            v-flex(xs12, v-else)
              v-layout(row)
                v-flex(xs12, sm5)
                  date-picker(
                    v-model="wifiStartDate"
                    :label="$t('general.startDate')"
                    :min-date="new Date().toString()"
                    :max-date="wifiEndDate ? wifiEndDate : null"
                    required
                  )
                v-flex(xs12, offset-sm2, sm5)
                  date-picker(
                    v-model="wifiEndDate"
                    :label="$t('general.endDate')"
                    required
                    :min-date="wifiStartDate ? wifiStartDate : new Date().toString()"
                  )
              v-layout(row)
                v-flex(xs12, sm5)
                  time-picker(
                    v-model="wifiStartTime"
                    :label="$t('general.startTime')"
                    required
                    :max-time="wifiStartDate && wifiEndDate && wifiStartDate === wifiEndDate && wifiEndTime ? wifiEndTime : null"
                  )
                v-flex(xs12, offset-sm2, sm5)
                  time-picker(
                    v-model="wifiEndTime"
                    :label="$t('general.endTime')"
                    required
                    :min-time="wifiStartDate && wifiEndDate && wifiStartDate === wifiEndDate && wifiStartTime ? wifiStartTime : null"
                  )

    // shippingConfirmationOptions
    h3.small-heading.mb-3.mt-5 {{ $t('wifi.shippingConfirmationOptions') }}

    v-layout(row)
      v-flex.mr-2(xs12 sm6)
        .form-card.round
          v-layout(row)
            v-flex.switch-label(xs5) {{ $t('wifi.confirmationByEmail') }}
            v-flex(xs7)
              v-switch(v-model="confirmationByEmail", color="deep-purple lighten-2")
          v-layout(row, v-if="confirmationByEmail")
            v-flex(xs12)
              v-text-field(:label="$t('wifi.customizeTheConfirmationMessage')", textarea, v-model="emailConfirmationMessage")

      v-flex.ml-2(xs12, sm6)
        .form-card.round
          v-layout(row)
            v-flex.switch-label(xs5) {{ $t('wifi.confirmationBySMS') }}
            v-flex(xs7)
              v-switch(v-model="confirmationBySms", color="deep-purple lighten-2")
          v-layout(row, v-if="confirmationBySms")
            v-flex(xs12)
              v-text-field(:label="$t('wifi.customizeTheConfirmationMessage')", textarea, v-model="smsConfirmationMessage")

    // passwordOptions
    h3.small-heading.mb-3.mt-5 {{ $t('wifi.passwordOptions') }}

    v-layout(row)
      v-flex.mr-2(xs12 sm6)
        .form-card.round
          base-switch(color="deep-purple lighten-2", :label-left="$t('wifi.predefined')", :label-right="$t('wifi.customized')" v-model="passwordOptionsEnabled")
          v-text-field.mt-2(:label="$t('wifi.setThePasswordManually')", v-if="passwordOptionsEnabled", v-model="customPassword")
      v-flex.ml-2(xs12, sm6)

    v-layout(row)
      v-flex.text-xs-right(xs12)
        v-btn(color="success", outline, large, round)
          v-icon.pr-3 print
          | {{ $t('wifi.printThisTicket') }}
        v-btn(color="success", large, round)
          | {{ $t('wifi.createTicket') }}

</template>

<script>
import DatePicker from '@/components/common/date-picker'
import TimePicker from '@/components/common/time-picker'
import TelInput from '@/components/common/tel-input/input'

export default {
  name: 'WifiConfigurationTicket',
  components: {
    DatePicker,
    TimePicker,
    TelInput
  },
  data () {
    return {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      wifiAccessEnabled: false,
      wifiDuration: '',
      wifiStartDate: '',
      wifiEndDate: '',
      wifiStartTime: '',
      wifiEndTime: '',
      customDuration: '',
      customDurationOptions: [
        { text: '30 min' },
        { text: '1 hr' },
        { text: '12 hr' },
        { text: '24 hr' },
        { text: '7 d' },
        { text: '30 d' }
      ],
      confirmationByEmail: false,
      emailConfirmationMessage: '',
      confirmationBySms: false,
      smsConfirmationMessage: '',
      passwordOptionsEnabled: false,
      customPassword: ''
    }
  },

  methods: {}
}
</script>
<style lang="scss">
  .new-person-help {
    left: 200px;
    top: -16px;
  }
  .shipping-confirmation-help{
    left: 190px;
    top: -16px;
  }
  .password-options-help {
    left: 110px;
    top: -16px;
  }
  .switch-label {
    color: #9ba9c4;
    padding: 0px !important;
  }
  .label-help {
    top: -9px !important;
  }
</style>
