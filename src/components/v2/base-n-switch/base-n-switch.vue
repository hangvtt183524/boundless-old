<template lang="pug">
  .base-n-switch
    .base-n-switch__option(
      v-for="item of items"
      :key="item.value"
      @click="$emit('input', item.value)"
      :class="{'base-n-switch__option--active': value === item.value}"
    ) {{ item.text }}
</template>

<script>
export default {
  name: 'base-n-switch',
  props: {
    value: {
      default: null
    },
    items: {
      type: Array
    }
  }
}
</script>

<style src="./base-n-switch.scss" lang="scss" scoped></style>
