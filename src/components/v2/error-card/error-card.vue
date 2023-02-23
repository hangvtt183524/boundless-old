<template lang="pug">
  .error-card(
    v-show="show"
  )
    .error-card__title
      | {{ title }}

    .error-card__content
      slot(name="content")

    v-icon.error-card__close-icon(
      @click="onCloseClick"
  ) close

</template>

<script>

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onCloseClick () {
      this.$emit('closeClick')
    }
  }
}
</script>

<style src="./error-card.scss" lang="scss" scoped></style>
