<template lang="pug">
  .base-slider-input(
    :class="[{'base-slider-input--disabled': disabled}, {'base-slider-input--reversed': reversed}, {'base-slider-input--empty': value === null}]"
  )
    label.base-slider-input__label(
      v-if="label"
    ) {{ label }}

    .base-slider-input__input-container
      vue-slider(
        v-bind="sliderOptions"
        :value="value"
        @drag-start="onDragStart"
        @drag-end="onDragEnd"
        @change="onChange"
      )
        template(slot="label" slot-scope="{ label, active }")
          span(:class="['vue-slider-piecewise-label', { active }]") {{ formatLabel(label) }}

</template>

<script>
import VueSlider from 'vue-slider-component'

export default {
  name: 'base-slider-input',
  components: {
    VueSlider
  },
  props: {
    value: {
      default: ''
    },
    options: {
      type: Object,
      default: () => {}
    },
    labelFormatter: {
      type: Function,
      required: false
    },
    label: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    reversed: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      updatedValue: this.value,
      dragging: false,
      defaultOptions: {
        piecewise: true,
        piecewiseLabel: true,
        tooltip: null,
        marks: true
      }
    }
  },
  computed: {
    sliderOptions () {
      return Object.assign({}, this.defaultOptions, this.options)
    }
  },
  methods: {
    formatLabel (value) {
      if (!this.labelFormatter) {
        return value
      } else {
        return this.labelFormatter(value)
      }
    },
    onDragStart () {
      this.dragging = true
    },
    onDragEnd () {
      this.dragging = false
      this.$emit('input', this.updatedValue)
    },
    onChange (value) {
      this.$set(this, 'updatedValue', value)

      if (!this.dragging) {
        this.$emit('input', this.updatedValue)
      }
    }
  }
}
</script>

<style src="./base-slider-input.scss" lang="scss" scoped></style>
<style src="./vue-slider-override.scss" lang="scss"></style>
