<template lang="pug">
  v-menu(
    ref="menu"
    v-model="show"
    :close-on-content-click="false"
    :nudge-right="40"
    :return-value.sync="time"
    :disabled="readonly"
    lazy
    transition="scale-transition"
    offset-y
    full-width
    max-width="290px"
    min-width="290px"
  )
    v-text-field(
      slot="activator"
      :value="formattedValue"
      @input="input"
      v-bind="$attrs"
      readonly
      :clearable="!readonly"
    )
    v-time-picker(
      v-model="time"
      :format="format"
      @change="$refs.menu.save(time)"
      :min="minTime"
      :max="maxTime"
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
    maxTime: {
      type: String,
      default: undefined
    },
    minTime: {
      type: String,
      default: undefined
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  mixins: [
    CurrentUserMixin
  ],
  data () {
    return {
      show: false,
      time: null
    }
  },
  mounted () {
    if (this.value) {
      this.time = this.$moment(this.value, ['h:mm A']).format('HH:mm')
    }
  },
  computed: {
    format () {
      if (this.profile.use_24h_clock) {
        return '24hr'
      } else {
        return 'ampm'
      }
    },
    formattedValue () {
      if (!this.value) {
        return ''
      }
      return this.$moment.utc(this.value, this.timeFormat).format(this.timeFormat)
    }
  },
  methods: {
    input (val) {
      this.$emit('input', val)
    }
  },
  watch: {
    time (val) {
      this.$emit('input', val)
    }
  }
}
</script>
