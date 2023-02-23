<template lang="pug">
  vue-slider(
    v-bind="sliderOptions"
    v-model="rangeModel"
    @drag-end="dragEnd"
    @change="callback"
    :tooltip="tooltip"
    :interval="interval"
    :marks="true"
    :process="process"
    :dot-options="dotOptions"
    :order="order"
  )
    template(slot="tooltip" slot-scope="{ value }")
      span(:class="['time-range-tooltip']") {{ formatTooltip(value) }}
    template(slot="label" slot-scope="{ label, active }")
      span(:class="['vue-slider-piecewise-label', { active }]") {{ formatLabel(label) }}
</template>

<script>
import VueSlider from 'vue-slider-component'

export default {
  props: {
    index: {
      type: [Number, String],
      required: false
    },
    value: {
      type: [Array, Number, String],
      required: true
    },
    tooltip: {
      type: String,
      default: 'none',
      required: false
    },
    labelFormatter: {
      type: Function,
      required: false
    },
    tooltipFormatter: {
      type: Function,
      required: false
    },
    options: {
      type: Object,
      default: () => {}
    },
    changeValue: {
      type: Function
    },
    interval: {
      type: Number,
      required: false
    },
    order: {
      type: Boolean,
      required: false,
      default: true
    },
    dotOptions: {
      type: Array,
      required: false,
      default: () => []
    },
    process: {
      type: Function
    }
  },
  watch: {
    value (v) {
      this.rangeModel = v
    }
  },
  components: {
    VueSlider
  },

  data () {
    return {
      defaultOptions: {
        width: '100%',
        height: 4,
        dotSize: 14,
        tooltip: false,
        piecewise: true,
        piecewiseLabel: true,
        piecewiseStyle: {
          'backgroundColor': '#ccc',
          'visibility': 'visible',
          'width': '12px',
          'height': '12px'
        },
        piecewiseActiveStyle: {
          'backgroundColor': '#9575cd'
        },
        labelActiveStyle: {
          'color': '#9575cd'
        }
      },
      rangeModel: null,
      updatedValue: null
    }
  },
  computed: {
    sliderOptions () {
      return Object.assign({}, this.defaultOptions, this.options)
    }
  },
  mounted () {
    this.rangeModel = this.value
  },
  methods: {
    formatLabel (value) {
      if (!this.labelFormatter) {
        return value
      } else {
        return this.labelFormatter(value)
      }
    },
    formatTooltip (value) {
      if (!this.tooltipFormatter) {
        return value
      } else {
        return this.tooltipFormatter(value)
      }
    },
    dragEnd () {
      if (this.changeValue) {
        this.changeValue(this.updatedValue)
      }
      this.$emit('callback', {
        index: this.index,
        value: this.updatedValue
      })
    },
    callback (val) {
      this.updatedValue = val
      if (this.changeValue) {
        this.changeValue(this.updatedValue)
      }
      this.$emit('callback', {
        index: this.index,
        value: this.updatedValue
      })
    }
  }
}
</script>

<style lang="scss">
.vue-slider {
  .vue-slider-process {
    background-color: #9575cd;
  }
  &.vue-slider-disabled {
    opacity: .5;
  }
  .vue-slider-rail {
    border-radius: 4px;
    background-color: #D8DEEB;
  }
  .vue-slider-mark {
    color: #000;
    font-size: 12px;
    padding-top: 8px;
    top: 10px;
    width: fit-content !important;
    background: transparent;
    .vue-slider-mark-step {
      width: 2px;
      height: 12px;
      background: #D8DEEB;
      left: 0;
      right: 0;
      margin: auto;
      &.vue-slider-mark-step-active {
        background: #9575CD;
      }
    }
    &:first-child {
      margin-left: 1px;
    }
    &:last-child {
      margin-left: -1px;
    }
  }
  .vue-slider-dot {
    z-index: 10 !important;
    background-color: #FFF;
    width: 10px;
    height: 10px;
    box-shadow: 0 0 1px 0 rgba(0,0,0,0.12), 0 1px 1px 0 rgba(0,0,0,0.24);
    border-radius: 50%;
  }
}
.vue-slider .vue-slider-piecewise-dot {
  position: absolute;
  left: 50%;
  top: 10px !important;
  width: 100%;
  height: 100%;
  display: inline-block;
  background-color: rgba(0,0,0,.16);
  border-radius: 50%;
  transform: translate(-50%,-50%);
  z-index: 2;
  transition: all .3s;
  background-color: rgb(149, 117, 205);
  visibility: visible;
  width: 1px !important;
  height: 16px !important;
}

.vue-slider.vue-slider-horizontal-reverse .vue-slider-piecewise-label,
.vue-slider.vue-slider-horizontal .vue-slider-piecewise-label {
  position: absolute;
  display: inline-block;
  top: 100%;
  left: 50%;
  white-space: nowrap;
  font-size: 12px;
  color: #333;
  transform: translate(-50%,8px);
  visibility: visible;
}

.vue-slider .vue-slider-dot {
  z-index: 3 !important;
}
</style>
