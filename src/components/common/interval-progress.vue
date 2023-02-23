<template lang="pug">
  v-progress-linear(
    :indeterminate="query"
    :query="true"
    :active="show"
    v-model="value"
  )
</template>
<script>
export default {
  props: {
    speed: {
      type: Number,
      default: 1000

    },
    increment: {
      type: Number,
      default: 25
    }
  },

  data () {
    return {
      value: 0,
      query: false,
      show: true,
      interval: 0
    }
  },

  mounted () {
    this.queryAndIndeterminate()
  },

  beforeDestroy () {
    clearInterval(this.interval)
  },

  methods: {
    queryAndIndeterminate () {
      const component = this
      this.query = true
      this.show = true
      this.value = 0
      this.query = false

      this.interval = setInterval(() => {
        if (this.value === 100) {
          clearInterval(this.interval)
          component.$emit('finish')
        }
        this.value += this.increment
      }, this.speed)
    }
  }
}
</script>
