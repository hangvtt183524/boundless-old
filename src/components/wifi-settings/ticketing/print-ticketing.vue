<template lang="pug">
  .container(id="print-section")
    div(style="width:600px!important;margin-top:30px;margin-left:100px;")
      h3 {{ $t('wifi.wifiTicket') }}
      .row(style="align-items: baseline;margin-top:30px;")
        .col-3 {{ ticketData.name }}
        .col-4 {{ ticketData.email }}
        .col-4.offset-1 {{ ticketData.phone }}
      .row(style="align-items: baseline;margin-top: 20px;")
        .col-3 {{ `${$t('wifi.accessCode')}:` }}
        .col-9 {{ ticketData.accessCode }}
      hr
      .row(style="align-items: baseline;margin-top: 20px;")
        .col-3 {{ `${$t('wifi.creationDate')}:` }}
        .col-9 {{ ticketData.creationDate }}
      .row(style="align-items: baseline;margin-top: 20px;")
        .col-3 {{ `${$t('wifi.dailySchedule')}:` }}
        .col-9 {{ ticketData.dailySchedule }}
      .row(style="align-items: baseline;margin-top: 20px;")
        .col-3 {{ `${$t('wifi.forDates')}:` }}
        .col-9 {{ ticketData.forDates }}
</template>

<script>
export default {
  name: 'WifiPrintTemplate',

  props: {
    ticketData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>
