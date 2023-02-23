<template lang="pug">
  div
    // demo button opening the guestWifiParamentersModal
    v-btn.mb-5(color='primary', @click='guestWifiParamentersModal = true')
      | {{ $t('wifi.guestWifiParameters') }} (demo)

    // guestWifiConfigurationModal
    v-dialog(v-model='guestWifiParamentersModal', max-width='900')
      v-card.pa-3
        v-layout(row)
          v-flex(xs12)
            v-tabs(v-model='active', color='white', slider-color='yellow')
              v-layout(row)
                v-flex(xs10)
                  v-tab(ripple)
                    | {{ $t('wifi.accessTicket') }}
                  v-tab(ripple)
                    | {{ $t('wifi.multipleAccess') }}
                  v-tab(ripple)
                    | {{ $t('wifi.sponsors') }}

                v-flex.text-xs-right(xs2 white)
                  v-btn.mt-3(fab, flat, small, @click.native='guestWifiParamentersModal = false')
                    v-icon(small) close

              v-tab-item
                v-card(flat)
                  v-card-text
                    guest-wifi-parameters-ticket-access

              v-tab-item
                v-card(flat)
                  v-card-text
                    guest-wifi-parameters-multiple-access

              v-tab-item
                v-card(flat)
                  v-card-text
                    guest-wifi-parameters-sponsors

        v-card-actions
          v-btn(color='grey', flat, @click.native='guestWifiParamentersModal = false') {{ $t('general.close') }}
</template>

<script>
import guestWifiParametersTicketAccess from './guest-wifi-parameters-ticket-access.vue'
import guestWifiParametersMultipleAccess from './guest-wifi-parameters-multiple-access.vue'
import guestWifiParametersSponsors from './guest-wifi-parameters-sponsors.vue'

export default {
  name: 'GuestWifiParameters',

  components: {
    guestWifiParametersTicketAccess,
    guestWifiParametersMultipleAccess,
    guestWifiParametersSponsors
  },

  data () {
    return {
      active: null,
      guestWifiParamentersModal: false
    }
  }
}
</script>
