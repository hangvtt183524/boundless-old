<template lang="pug">
  #base-switch.base-switch
    label.label-left {{ labelLeft }}
    v-switch(
      :color="color"
      :label="labelRight"
      :class="{reverse: reverse}"
      :disabled="readonly"
      @change="changed"
      hide-details
      ref="vSwitch"
      v-model="model"
    )
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: 'primary'
    },
    value: {
      type: Boolean,
      required: true
    },
    labelLeft: {
      type: String,
      default: ''
    },
    labelRight: {
      type: String,
      default: ''
    },
    reverse: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      model: this.value
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (newValue) {
        if (this.reverse) {
          newValue = !newValue
        }
        this.model = newValue
      }
    }
  },
  methods: {
    changed (value) {
      if (this.reverse) {
        value = !value
      }
      this.$emit('input', value)
      this.$emit('change', value)
    }
  }
}
</script>

<style lang="scss">
  .base-switch {
    display: flex;
    label {
      font-family: 'Fira Sans', sans-serif;
      padding-right: 14px;
      color: rgba(0,0,0,.54);
      display: inline-block;
      font-size: 16px;
      line-height: 30px;
      height: 30px;
      pointer-events: none;
      text-align: left;
      white-space: nowrap;
      font-weight: normal;
    }

    .input-group {
      flex: auto;
      width: auto;
    }

    .input-group label {
      padding-right: 0;
      max-width: none !important;
      width: auto;
    }
    .v-input--switch {
      margin: 0px;
      height: 30px;
    }
  }
  #base-switch {
    .reverse {
      .input-group--selection-controls__toggle:not(.input-group--selection-controls__toggle--active) {
        opacity: .5;
      }
      .input-group--selection-controls__toggle--active {
        opacity: 1;
        background: rgba(0,0,0,.38) !important;
      }
      .input-group--selection-controls__container {
        color: inherit !important;
      }

      .input-group--selection-controls__ripple {
        color: rgba(0,0,0,.38);
      }

      .input-group--selection-controls__ripple:not(.input-group--selection-controls__ripple--active) {
        color: inherit;
      }

      .input-group--selection-controls__ripple:not(.input-group--selection-controls__ripple--active):after {
        background: currentColor !important;
      }

      .input-group--selection-controls__ripple--active:after {
        background: #fafafa;
      }
    }
  }
</style>
