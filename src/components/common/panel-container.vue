<template lang="pug">
  div
    .title
      v-layout(row)
        v-flex.py-3(xs12)
          slot(name="title")
            h3.small-heading {{ title }}

    v-layout(row wrap :class="{ disabled: disabled, readonly: disabled }")
      v-card.body.panel-container(:class="{ readonly: readonly }")
        v-card-text.pt-0.pb-4.px-4
          slot
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="scss" scoped>
@import 'styles/components/panel.scss';
</style>
