<template lang="pug">
  v-container
    v-layout.elevation-1(row)
      v-flex(xs12)
        v-tabs(v-model='active', color='white', slider-color='yellow')
          v-tab(ripple, :to="{name: 'WifiSettingsParametersGuest'}")
            | {{ $t('wifi.guest') }}
          v-tab(ripple, :to="{name: 'WifiSettingsParametersSecured'}")
            | {{ $t('wifi.secured') }}

    v-layout.elevation-1(row)
      v-flex.white.pa-3(xs12)
        router-view
</template>

<script>
import WifiSettingsParametersGuest from './guest.vue'
import WifiSettingsParametersSecured from './secured.vue'

export default {
  name: 'WifiSettingsParameters',

  components: {
    WifiSettingsParametersGuest,
    WifiSettingsParametersSecured
  },

  data () {
    return {
      active: null
    }
  },

  methods: {
    newWifiAccess () {
      console.log('newWifiAccess')
    }
  }
}
</script>
