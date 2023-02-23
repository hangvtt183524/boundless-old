<template lang="pug">
  v-select(
    :items="availabilities"
    :label="$t('contact.availability')"
    :value="value"
    @input="input"
    v-bind="$attrs"
  )
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  props: ['value'],
  computed: {
    ...mapGetters('user', ['currentUser']),
    availabilities () {
      let morningTime = '9:00am - 12:00pm'
      let afternoonTime = '2:00pm - 5:00pm'
      const timezone = this.currentUser.profile.timezone_display.split(' ')[0]

      if (this.currentUser.profile.use_24h_clock) {
        morningTime = '9:00 - 12:00'
        afternoonTime = '14:00 - 17:00'
      }

      return [
        `${this.$t('general.morning')} (${morningTime}) ${timezone}`,
        `${this.$t('general.afternoon')} (${afternoonTime}) ${timezone}`
      ]
    }
  },
  methods: {
    input (value) {
      this.$emit('input', value)
    }
  }
}
</script>
