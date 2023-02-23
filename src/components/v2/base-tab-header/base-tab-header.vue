<template>
  <button class="tab-header" @click="onClick">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'BaseTabHeader',
  methods: {
    onClick () {
      this.$emit('click')
    }
  }
}
</script>

<style src="./base-tab-header.scss" lang="scss" scoped></style>
