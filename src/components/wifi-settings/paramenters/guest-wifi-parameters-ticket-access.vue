<template lang="pug">
  div
    h1 {{ $t('wifi.accessTicket') }}
    // top paragraphs
    v-layout.pb-5(row)
      v-flex(xs12)
        p {{ $t('etc.loremShort') }}

        h4
          | {{ $t('wifi.createANewPersonalWifiTicket') }}
          v-icon.ml-5(small) help
        h5
          | {{ $t('wifi.personalInformation') }}

    // general info
    v-layout(row)
      v-flex(xs12, sm6)
        v-text-field(:label="$t('general.firstName')")
        v-text-field(:label="$t('general.email')")

      v-flex(xs12, sm6)
        v-text-field(:label="$t('general.lastName')")
        v-text-field(:label="$t('general.phoneNumber')")

    // wifi access
    v-layout(row)
      v-flex(xs12, sm6)
        v-layout(row)
          v-flex(xs12, sm12, md6)
            | {{ $t('wifi.wifiAccess') }}
          v-flex(xs12, sm4, md2)
            | {{ $t('general.yes') }}
          v-flex(xs12, sm4, md2)
            v-switch(v-model="switch1", color="success")
          v-flex(xs12, sm4, md2)
            | {{ $t('general.no') }}

    // connectionTimeOptions
    v-layout(row)
      v-flex(xs12, sm6)
        v-select(:items='connectionTimeOptions', v-model='connectionTimeOptionModel', :label="$t('wifi.duration')", single-line)

      v-flex(xs12, sm6)
        v-layout(row)
          v-flex(xs6)
            v-text-field(:label="$t('wifi.startDate')")
          v-flex(xs6)
            v-text-field(:label="$t('wifi.endDate')")

    v-divider.my-5

    // shippingConfirmationOptions
    v-layout(row)
      v-flex(xs12, sm6)
        h4
          | {{ $t('wifi.shippingConfirmationOptions') }}
          v-icon.ml-5(small) help

    // confirmationByEmail
    v-layout(row)
      v-flex(xs12, sm5)
        v-layout(row)
          v-flex(xs9, sm10)
            | {{ $t('wifi.confirmationByEmail') }}
          v-flex(xs3, sm2)
            v-switch(v-model="switch2", color="success")

    v-layout(row)
      v-flex(xs12)
        v-text-field(:label="$t('wifi.customizeTheConfirmationMessage')", textarea)

    // confirmationBySMS
    v-layout(row)
      v-flex(xs12, sm5)
        v-layout(row)
          v-flex(xs9, sm10)
            | {{ $t('wifi.confirmationBySMS') }}
          v-flex(xs3, sm2)
            v-switch(v-model="switch3", color="success")

    v-layout(row)
      v-flex(xs12)
        v-text-field(:label="$t('wifi.customizeTheConfirmationMessage')", textarea)

    v-divider.my-5

    // passwordOptions
    v-layout(row)
      v-flex(xs12, sm6)
        h4
          | {{ $t('wifi.passwordOptions') }}
          v-icon.ml-5(small) help

    v-layout(row)
      v-flex(xs12, sm6)
        v-layout(row)
          v-flex(xs5)
            | {{ $t('wifi.byDefault') }}
          v-flex(xs2)
            v-switch(v-model="switch1", color="success")
          v-flex(xs5)
            | {{ $t('wifi.customize') }}

    v-layout(row)
      v-flex(xs12, sm6)
        h5 {{ $t('wifi.shippingConfirmationOptions') }}
        v-text-field(:label="$t(' wifi.setThePasswordManually ')")

    v-layout(row)
      v-flex(xs6)
        v-btn
          v-icon.pr-3 print
          | {{ $t('wifi.printThisTicket') }}
      v-flex.text-xs-right(xs6)
        v-btn(color="primary")
          | {{ $t('wifi.createTicket') }}
</template>

<script>
export default {
  name: 'GuestWifiParametersTicketAccess',

  data () {
    return {
      switch1: '',
      switch2: '',
      switch3: '',
      connectionTimeOptionModel: '',
      connectionTimeOptions: [
        { text: '30 min' },
        { text: '1 hr' },
        { text: '12 hr' },
        { text: '24 hr' },
        { text: '7 d' },
        { text: '30 d' }
      ]
    }
  }
}
</script>
