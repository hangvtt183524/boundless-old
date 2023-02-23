<template>
  <div class="base-radio">
    <input
      type="radio"
      :name="name"
      :checked="isChecked"
      :disabled="disabled"
      ref="radioInput"
    />
    <div
      class="radio-display"
      @click="onClick()"
      ref="radioDisplay">
      <v-icon class="checked-icon">lens</v-icon>
    </div>
    <label
      class="base-radio-label"
      @click="onLabelClick">{{ label }}</label>
  </div>
</template>

<script>
export default {
  name: 'BaseRadio',
  props: {
    value: {
      type: String,
      default: ''
    },
    radioValue: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isChecked: function () {
      return this.value === this.radioValue
    }
  },
  methods: {
    onClick () {
      this.$emit('input', this.radioValue)
    },
    onLabelClick () {
      this.$refs.radioDisplay.click()
    }
  }
}
</script>

<style src="./base-radio.scss" lang="scss" scoped></style>
