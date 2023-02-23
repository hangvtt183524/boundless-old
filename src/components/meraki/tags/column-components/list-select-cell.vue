<template lang='pug'>
  .select-cell
    base-check-box.base-check-box--small(:value='value', v-model='selected')
</template>

<script>
import BaseCheckBox from '../../../v2/base-check-box/base-check-box'
export default {
  name: 'list-select-cell',
  components: { BaseCheckBox },
  props: {
    value: {
      required: true
    },
    item: {
      type: Object
    }
  },
  data: function () {
    return {
      selected: false,
      initialized: false
    }
  },
  watch: {
    value: function (newVal, oldVal) {
      this.selected = newVal
    },
    selected: function (newVal, oldVal) {
      if (this.initialized) {
        this.$emit('input', this.selected)
      }
    }
  },
  mounted () {
    this.selected = this.value
    this.$nextTick(() => {
      this.initialized = true
    })
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
  .select-cell {
    .base-check-box {
      top: 2px;
      position: relative;
    }
  }
</style>
