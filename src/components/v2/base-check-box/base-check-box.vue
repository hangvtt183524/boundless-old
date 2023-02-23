<template>
  <div
    :class="['base-check-box', {'base-check-box--disabled': disabled}]"
    @click="stopPropagation"
  >
    <input
      type="checkbox"
      :checked="value"
      @change="onChange"
      :disabled="disabled"
      ref="checkInput"
    />
    <div class="check-box-display" @click="onClick()">
      <v-icon class="checked-icon">check</v-icon>
    </div>
    <label class="base-check-box-label" v-if="label" @click="onClick()">{{ label }}</label>
  </div>
</template>

<script>
export default {
  name: 'BaseCheckBox',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onClick () {
      if (this.disabled) {
        return false
      }

      this.$emit('click')
      this.$refs.checkInput.click()
    },
    onChange ($event) {
      this.$emit('input', $event.target.checked)
    },
    stopPropagation ($event) {
      $event.stopPropagation()
    }
  }
}
</script>

<style src="./base-check-box.scss" lang="scss" scoped></style>
