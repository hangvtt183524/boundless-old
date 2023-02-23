<template lang='pug'>
  .select-cell
    base-check-box.base-check-box--small(
      v-if="isSelectable"
      :value='isSelected'
      @click="onClick"
      :disabled="!!maxSelectCount && !isSelected && (selectedRows.length >= maxSelectCount)"
    )
</template>

<script>
import BaseCheckBox from '@/components/v2/base-check-box/base-check-box'

export default {
  name: 'list-select-cell',
  components: { BaseCheckBox },
  props: {
    item: {
      type: Object
    },
    selectedRows: {
      type: Array,
      required: true
    },
    itemKey: {
      type: String,
      required: true
    },
    selectableRowFilter: {
      type: Function,
      required: false
    },
    maxSelectCount: {
      required: false
    }
  },
  computed: {
    isSelected () {
      return this.selectedRows.map(row => row[this.itemKey]).indexOf(this.item[this.itemKey]) > -1
    },
    isSelectable () {
      return !this.selectableRowFilter || this.selectableRowFilter(this.item)
    }
  },
  methods: {
    onClick () {
      this.$emit('input', !this.isSelected)
    }
  }
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
