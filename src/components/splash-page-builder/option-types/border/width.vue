<template lang="pug">
  .option-type
    label.option-label {{ $t('builder.borderWidth') }}
    .input-inline-group
      input.form-control.mt-2.py-1(
        type="text",
        v-model="selectedItem.config.border.width"
        v-on:keydown.prevent.up="incrementSize"
        v-on:keydown.prevent.down="decrementSize"
      )
      label PX
</template>

<script>
export default {
  props: {
    selectedItem: {
      type: Object,
      required: true
    }
  },
  methods: {
    incrementSize () {
      this.selectedItem.config.border.width++
    },
    decrementSize () {
      const size = this.selectedItem.config.border.width
      if (size >= 1) {
        this.selectedItem.config.border.width--
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.input-inline-group {
  position: relative;
  label {
    position: absolute;
    right: 2px;
    top: 10px;
    padding: 3px;
    height: 26px;
    color: #9ba9c4;
  }
}
</style>
