<template lang="pug">
  .base-flat-select
    .base-flat-select__scroll-container(
      ref="scrollContainer"
    )
      .base-flat-select__options-container
        .base-flat-select__options-container__option(
          v-for="item of items"
          :key="item.key"
          @click="onOptionClick(item)"
          :class="{'base-flat-select__options-container__option--selected': item.key === value}"
        )
          .base-flat-select__options-container__option__text-container {{ item.name }}
    .base-flat-select__left-scroll
      v-icon.base-flat-select__right-scroll__icon(
      @click="onScrollLeftClick"
      ) arrow_left
    .base-flat-select__right-scroll
      v-icon.base-flat-select__right-scroll__icon(
        @click="onScrollRightClick"
      ) arrow_right
</template>

<script>
export default {
  name: 'base-flat-select',
  props: {
    value: {
      default: null
    },
    items: {
      type: Array,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    validations: {
      type: Object,
      required: false
    }
  },
  methods: {
    onOptionClick (item) {
      this.$emit('input', item.key)
    },
    onScrollRightClick () {
      const scrollValue = this.$refs.scrollContainer.scrollLeft + 200

      // Animate to right
      window.$(this.$refs.scrollContainer).animate({ scrollLeft: scrollValue }, 100)
    },
    onScrollLeftClick () {
      const scrollValue = this.$refs.scrollContainer.scrollLeft - 200

      // Animate to left
      window.$(this.$refs.scrollContainer).animate({ scrollLeft: scrollValue }, 100)
    }
  }
}
</script>

<style src="./base-flat-select.scss" lang="scss" scoped></style>
