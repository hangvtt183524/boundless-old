<template lang="pug">
  v-text-field(
    :label="label"
    :placeholder="placeholder"
    :value="value"
    class="readonly-input"
    readonly
    v-bind="$attrs"
  )
</template>
<script>
export default {
  props: {
    value: {
      type: [String, Number],
      required: false
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '--'
    }
  }
}
</script>

<style lang="scss" scoped>

.readonly-input ::v-deep {
  .input-group__details:before,
  .input-group__details:after,
  .input-group__input i,
  .input-group__counter,
  .dropdown-arrow {
    display: none !important;
  }
}
</style>
