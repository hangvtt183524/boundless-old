<template lang="pug">
  v-tooltip.action(
    :class="'tooltip-input ' + className"
    color="grey lighten-4"
    left
    top
  )
    v-icon(
      slot="activator"
      class="tooltip-icon"
      small
    ) help
    span(class="tooltip-text-dark", v-html="label")
</template>

<script>
export default {
  name: 'tooltip',
  props: {
    className: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang='scss'>
  .tooltip-input {
    position: absolute;
  }
  .tooltip-icon {
    color: #9ba9c4 !important;
    cursor: pointer;
  }
  .tooltip-text-dark {
    display: block;
    color: #354c77;
    font-family: 'Quicksand', sans-serif;
    font-weight: 100;
    font-size: 10px;
    line-height: 1.5;
  }

  .label-help {
    top: -16px;
  }
</style>
