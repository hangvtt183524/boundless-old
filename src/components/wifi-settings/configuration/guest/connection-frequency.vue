<template lang="pug">
  div
    v-layout.header-section(row wrap)
      h3.small-heading.py-3
        | {{ $t('wifi.limitConnectionFrequency') }}

      base-switch(
        data-test="enable-switch",
        color="deep-purple lighten-2",
        v-model="enableConnectionFrequency"
      )
    .form-card.round(:class="{ disabled: !enableConnectionFrequency }" disabled="!enableConnectionFrequency")
      v-layout(row wrap)
        v-flex.pr-3(xs7)
          v-select.connection-limit(:items='connectionLimit', data-test="connection-limit" v-model='connectionLimitModel', :label="$t(' organization.frequencyLimit ')")
        v-flex.pl-3(xs5)
          v-select.connection-frequency(
            data-test="connection-frequency"
            :items='connectionFrequency'
            item-text="text"
            item-value="seconds"
            v-model='connectionFrequencyModel'
            :label="$t('organization.frequency')")
</template>
<script>
export default {
  props: {
    frequencyLimitActive: {
      type: Boolean,
      default: false
    },
    frequencyLimitDuration: {
      type: Number,
      default: 3600
    },
    frequencyLimit: {
      type: Number,
      default: 1
    }
  },
  mounted () {
    this.getData()
  },
  data () {
    return {
      enableConnectionFrequency: false,
      connectionFrequencyModel: 3600,
      connectionFrequency: [
        { text: this.$t('wifi.perHour'), seconds: 3600 },
        { text: this.$t('wifi.perDay'), seconds: 86400 },
        { text: this.$t('wifi.perWeek'), seconds: 604800 },
        { text: this.$t('wifi.perMonth'), seconds: 2592000 }
      ],
      connectionLimit: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      connectionLimitModel: 1
    }
  },
  watch: {
    enableConnectionFrequency (v) {
      this.makeParams()
    },
    connectionLimitModel (v) {
      this.makeParams()
    },
    connectionFrequencyModel (v) {
      this.makeParams()
    },
    frequencyLimitActive (v) {
      this.getData()
    },
    frequencyLimitDuration (v) {
      this.getData()
    },
    frequencyLimit (v) {
      this.getData()
    }
  },
  methods: {
    makeParams () {
      const data = {
        frequency_limit_active: this.enableConnectionFrequency,
        frequency_limit_duration: this.connectionFrequencyModel,
        frequency_limit: this.connectionLimitModel
      }
      this.$emit('change', data)
    },
    getData () {
      this.connectionLimitModel = this.frequencyLimit
      this.connectionFrequencyModel = this.frequencyLimitDuration
      this.enableConnectionFrequency = this.frequencyLimitActive
    }
  }
}
</script>
