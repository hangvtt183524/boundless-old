<template>
  <div class="" :class="['base-card', {'base-card--no-text': !text}, {'base-card--selected': isSelected}, {'base-card--has-active-content': activeContentProvided}]">
    <div class="base-card-content" @click="onClick">
      <div v-if="icon" class="card-icon-container">
        <v-icon>{{ icon }}</v-icon>
      </div>
      <div class="base-card-title">{{ title }}</div>
      <div
        v-if="text"
        class="base-card-text">{{ text }}</div>
    </div>
    <div
      class="active-content"
      v-show="activeContentProvided && isSelected">
      <slot
        name="activeContent"></slot>
    </div>
    <slot
        name="additionContent"></slot>
  </div>
</template>

<script>
export default {
  name: 'BaseCard',
  props: {
    value: {
      type: String,
      default: ''
    },
    cardValue: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: null
    }
  },
  data: function () {
    return {
      selected: false
    }
  },
  computed: {
    isSelected: function () {
      return this.value === this.cardValue
    },
    activeContentProvided: function () {
      return this.$slots.activeContent
    }
  },
  methods: {
    onClick () {
      this.$emit('input', this.cardValue)
    }
  }
}
</script>

<style src="./base-card.scss" lang="scss" scoped></style>
