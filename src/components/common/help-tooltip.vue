<template lang="pug">
  v-tooltip(
    color="grey lighten-4 grey--text text--darken-1"
    top
  )
    v-icon(
      :size="iconSize"
      slot="activator"
    ) help
    span(v-html="message")
</template>

<script>
export default {
  name: 'help-tooltip',
  props: {
    message: {
      type: String,
      required: true
    },
    iconSize: {
      type: String,
      default: '18px'
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'styles/colors.scss';

.v-tooltip ::v-deep {
  .v-icon {
    cursor: pointer !important;
    color: $deemed-gray;
    margin-bottom: -2px;
  }
}
</style>
