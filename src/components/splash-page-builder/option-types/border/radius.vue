<template lang="pug">
  v-layout.option-type(wrap row)
    v-flex.pt-2(xs4)
      label.pt-1.option-label {{ $t('builder.borderRadius') }}
    v-flex(xs8)
      .input-inline-group
        input.form-control.mt-2.py-1(
          type="text",
          v-model="selectedItem.config.border.radius"
          v-on:keydown.prevent.up="incrementSize"
          v-on:keydown.prevent.down="decrementSize"
        )
        label PX
    v-flex(xs12)
      .input-inline-group
        v-slider(
          :max="200"
          v-model="selectedItem.config.border.radius"
          v-on:keydown.prevent.up="incrementSize"
          v-on:keydown.prevent.down="decrementSize"
        )
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
      this.selectedItem.config.border.radius++
    },
    decrementSize () {
      const size = this.selectedItem.config.border.radius
      if (size >= 1) {
        this.selectedItem.config.border.radius--
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
