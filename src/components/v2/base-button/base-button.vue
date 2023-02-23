<template lang="pug">
  button(
    :class="['base-button', {'base-button--loading': loading}]"
    @click="onClick"
    ref="button"
  )
    .base-button__content(
      v-show="!loading"
    )
      slot

    v-progress-circular.base-button__loading-indicator(
      v-if="loading"
      :size="20"
      indeterminate
    )

</template>

<script>
export default {
  name: 'base-button',
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onClick () {
      if (this.loading) {
        return false
      }

      this.$emit('click')

      // Remove focus from button once clicked
      this.$refs.button.blur()
    }
  }
}
</script>

<style src="./base-button.scss" lang="scss" scoped></style>
