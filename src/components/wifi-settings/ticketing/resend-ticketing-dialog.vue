<template lang="pug">
  base-dialog(
    :show="show"
    @close="close"
    max-width="618"
  )
    h2.dialog-heading.mb-3 {{ $t('wifi.wifiTicket') }}
    v-layout.print-ticketing-dialog
      v-flex(xs12)
        v-layout(wrap align-center)
          v-flex(xs12 sm4)
            .wifi-name {{ name }}
          v-flex(xs12 sm5)
            v-layout
              v-icon.pr-2.wifi-icons email
              .wifi-email {{ email }}
          v-flex(xs12 sm3)
            v-layout
              v-icon.pr-2.wifi-icons phone
              .wifi-phone {{ phone }}
        v-layout.access-code-container(row)
          v-flex(sm4 xs5)
            .access-code-text {{ `${$t('wifi.accessCode')}:` }}
          v-flex(sm8 xs7)
            .access-code {{ accessCode }}
        v-layout(row)
          v-flex(sm4 xs5)
            .creation-date-text {{ `${$t('wifi.creationDate')}:` }}
          v-flex(sm8 xs7)
            .creation-date {{ creationDate }}
        v-layout(row)
          v-flex(sm4 xs5)
            .valid-from-text {{ `${$t('wifi.dailySchedule')}:` }}
          v-flex(sm8 xs7)
            .valid-from {{ dailySchedule }}
        v-layout(row)
          v-flex(sm4 xs5)
            .valid-until-text {{ `${$t('wifi.forDates')}:` }}
          v-flex(sm8 xs7)
            .valid-until {{ forDates }}
    v-layout.pt-3.text-xs-center.text-sm-right(row)
      v-flex(xs12)
        v-btn(
          color="success"
          large
          round
          :loading="isLoading"
          @click="resendTicket"
        ) {{ $t('wifi.resendAccessCode') }}
        // v-btn(
        //   color="success"
        //   large
        //   round
        // ) PRINT
</template>

<script>
import { mapActions } from 'vuex'
import CurrentUserMixin from '@/mixins/current-user.mixin'
import ErrorHandlerMixin from '@/mixins/error-handler.mixin'

export default {
  mixins: [
    ErrorHandlerMixin,
    CurrentUserMixin
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
  computed: {
    nodeId () {
      return this.$route.params.nodeId
    }
  },
  data () {
    return {
      name: '',
      email: '',
      phone: '',
      accessCode: '',
      devices: 'Unlimited',
      creationDate: new Date(),
      dailySchedule: '',
      forDates: '',
      isLoading: false
    }
  },
  methods: {
    ...mapActions('organization/ticketing', ['resendTicketing']),
    close () {
      this.$emit('close')
    },
    resendTicket () {
      this.isLoading = true
      this.resendTicketing({ nodeId: this.nodeId, id: this.ticketData.id }).then(response => {
        global.toastr['success'](this.$t('wifi.resendTicketSuccess'), this.$t('general.success'))
        this.isLoading = false
        this.close()
      }).catch(err => {
        console.log(err)
        this.setErrorData(err)
        this.isLoading = false
      })
    }
  },
  watch: {
    ticketData (value, oldValue) {
      if (value) {
        this.name = `${value.first_name} ${value.last_name}`
        this.email = value.email
        this.phone = value.phone
        this.accessCode = value.password
        this.creationDate = this.dateFormatter(value.created_at)
        this.dailySchedule = `${value.validity_window.start_time}  ~  ${value.validity_window.end_time}`
        this.forDates = `${this.dateFormatter(value.validity_window.start_date)}  ~  ${this.dateFormatter(value.validity_window.end_date)}`
      }
    }
  }
}
</script>
<style lang="scss">
  .print-ticketing-dialog {
    .wifi-name {
      color: #354C77;
      font-family: "Fira Sans";
      font-size: 20px;
      font-weight: 600;
      line-height: 25px;
      padding: 10px 0;
    }
    .wifi-email {
      color: #9AA9C4;
      font-family: "Fira Sans";
      font-size: 14px;
      line-height: 18px;
      padding: 10px 0;
    }
    .wifi-phone {
      color: #9AA9C4;
      font-family: "Fira Sans";
      font-size: 14px;
      line-height: 18px;
      padding: 10px 0;
    }

    .wifi-icons {
      font-size: 20px;
      color: #9AA9C4;
    }

    .access-code-container {
      padding: 15px 0;
      border-bottom: 1px solid #D8DEEB;
      margin-bottom: 18px;

      .access-code-text {
        color: #354C77;
        font-family: "Fira Sans";
        font-size: 16px;
        font-weight: 600;
        line-height: 20px;
      }

      .access-code {
        color: #354C77;
        font-family: "Fira Sans";
        font-size: 16px;
        line-height: 20px;
      }
    }

    .simultaneous-devices-text,
    .simultaneous-devices,
    .creation-date-text,
    .creation-date,
    .valid-from-text,
    .valid-from,
    .valid-until-text,
    .valid-until
    {
      color: #354C77;
      font-family:
      "Fira Sans";
      font-size: 14px;
      line-height: 18px;
      padding: 10px 0;
    }
  }
</style>
