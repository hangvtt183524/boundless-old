<template lang='pug'>
  span(
    :class="['name-cell', { 'name-cell--no-decoration': !value || (options && options.noDecoration) }]"
    @click="onNameClick"
  )
    | {{value || '-'}}
</template>

<script>
export default {
  name: 'list-name-cell',
  props: {
    value: {
      required: true
    },
    item: {
      type: Object
    },
    options: {
      type: Object
    }
  },
  methods: {
    onNameClick () {
      this.$emit('action', {
        type: 'nameClick'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../../styles/v2/colors";

  .name-cell {
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 32px;
    cursor: pointer;

    text-decoration-line: underline;
    color: $blue-medium;

    &--no-decoration {
      text-decoration: none;
    }
  }
</style>
