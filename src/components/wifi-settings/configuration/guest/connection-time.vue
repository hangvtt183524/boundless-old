<template lang="pug">
  div
    v-layout.header-section(row wrap)
      h3.small-heading.py-3
        | {{ $t('organization.connectionTime') }}

      base-switch(
        data-test="enable-switch",
        color="deep-purple lighten-2",
        v-model="connectionTimeEnabled"
      )
    .form-card.round(:class="{ disabled: !connectionTimeEnabled }" disabled="!connectionTimeEnabled")
      v-layout(row wrap)
        v-flex.pr-3(xs7)
          v-select.connection-time(
            data-test="connection-time"
            :items="connectionTimeOptions"
            :label="$t('organization.connectionTime')"
            v-model="connectionTimeOptionModel"
          )
        v-flex.pl-3(xs5)
          v-select.connection-time-unit(
            data-test="connection-time-unit"
            :items="connectionTimeUnitsOptions"
            :label="$t('organization.connectionTimeUnit')"
            item-text="text"
            item-value="seconds"
            v-model="connectionTimeUnitOptionModel"
          )
</template>
<script>
export default {
  props: {
    sessionTimeout: {
      type: Number,
      default: 1800
    },
    sessionTimeoutEnabled: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    this.getData()
  },
  data () {
    return {
      connectionTimeOptionModel: 30,
      connectionTimeOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
      connectionTimeUnitsOptions: [
        { text: this.$t('general.timeUnits.minute'), seconds: 60 },
        { text: this.$t('general.timeUnits.hour'), seconds: 3600 },
        { text: this.$t('general.timeUnits.day'), seconds: 86400 },
        { text: this.$t('general.timeUnits.month'), seconds: 2592000 },
        { text: this.$t('general.timeUnits.year'), seconds: 31104000 }
      ],
      connectionTimeUnitOptionModel: 60,
      totalConnectionTime: 1800,
      connectionTimeEnabled: false
    }
  },
  watch: {
    connectionTimeOptionModel (v) {
      this.calcTotalTime()
    },
    connectionTimeUnitOptionModel (v) {
      this.calcTotalTime()
    },
    connectionTimeEnabled (v) {
      this.calcTotalTime()
    },
    sessionTimeout (newValue, oldValue) {
      this.getData()
    },
    sessionTimeoutEnabled () {
      this.getData()
    }
  },
  methods: {
    calcTotalTime () {
      let totalConnectionTime = this.connectionTimeOptionModel * this.connectionTimeUnitOptionModel || 60
      this.$emit('change', { session_timeout: totalConnectionTime, session_timeout_enabled: this.connectionTimeEnabled })
    },
    getData () {
      for (let i = 0; i < this.connectionTimeUnitsOptions.length; i++) {
        if (this.connectionTimeOptions.includes(this.sessionTimeout / this.connectionTimeUnitsOptions[i].seconds)) {
          this.connectionTimeUnitOptionModel = this.connectionTimeUnitsOptions[i].seconds
          this.connectionTimeOptionModel = this.sessionTimeout / this.connectionTimeUnitsOptions[i].seconds
          this.connectionTimeEnabled = this.sessionTimeoutEnabled
        }
      }
    }
  }
}
</script>
