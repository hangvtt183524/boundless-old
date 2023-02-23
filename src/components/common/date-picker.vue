<template lang="pug">
  v-menu(
    :close-on-content-click="false"
    :format="format"
    :disabled="readonly"
    v-model="show"
    lazy
    offset-y
    full-width
    max-width="width"
    min-width="width"
  )
    v-text-field(
      slot="activator"
      :value="value"
      @input="input"
      :error-messages="errorMessage"
      v-bind="$attrs"
      :clearable="!readonly"
      readonly
    )
    v-date-picker(
      v-model="date"
      no-title
      @input="show = false"
      :min="dateFormatter(minDate, 'YYYY-MM-DD')"
      :max="dateFormatter(maxDate, 'YYYY-MM-DD')"
      :first-day-of-week="this.profile.first_day_of_week"
      :width="width"
    )
</template>
<script>
import CurrentUserMixin from '@/mixins/current-user.mixin'

export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    format: {
      type: String,
      default: 'L' // 09/04/2018
    },
    maxDate: {
      type: [String, Object],
      default: undefined
    },
    minDate: {
      type: [String, Object],
      default: undefined
    },
    width: {
      type: Number,
      default: 290
    },
    readonly: {
      type: Boolean,
      default: false
    },
    errorMessage: {
      type: Array,
      defualt: []
    }
  },
  mixins: [
    CurrentUserMixin
  ],
  mounted () {
    if (this.value) {
      this.date = this.strToDate(this.value).format('YYYY-MM-DD')
    }
  },
  data () {
    return {
      show: false,
      date: null
    }
  },
  watch: {
    date (val) {
      const formattedDate = this.formatDate(this.date)
      this.$emit('input', formattedDate)
    },
    value (val) {
      if (val) {
        this.date = this.strToDate(val).format('YYYY-MM-DD')
      }
    }
  },
  methods: {
    formatDate (date) {
      // Formats date based on User preference
      return this.dateFormatter(date)
    },
    input (val) {
      this.$emit('input', val)
    }
  }
}
</script>
<style lang="scss">
  .v-menu__activator {
    .theme--light.v-text-field>.v-input__control>.v-input__slot:before {
      background: none;
      border-top: 1px solid #f5f6fa !important;
      border-bottom: 1px solid #e2e7f0 !important;
    }
  }
</style>
