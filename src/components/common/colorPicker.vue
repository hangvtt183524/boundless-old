<template lang="pug">
  .color-input-wrap(
  )
    .color-picker(
      ref="picker",
      :style="colorStyle",
      @click="showColorView = !showColorView"
    )
    input.color-input.form-control(
      v-model="inputColor",
      @input="inputColorHandle"
    )
    color-picker(
      theme="light"
      :style="{'width': '218px'}"
      :color="inputColor"
      :sucker-hide="true"
      v-show="showColorView"
      v-click-outside="outsidePicker",
      @changeColor="changeColorHandle"
    )
</template>

<script>

export default {
  name: 'commonColor',
  props: {
    colorSetting: {
      type: Object,
      required: true
    },
    label: {
      type: String,
      default: 'builder.textColor'
    }
  },
  data () {
    return {
      inputColor: this.colorSetting.hex.length > 8 ? this.colorSetting.hex.slice(0, -2) : this.colorSetting.hex,
      showColorView: false
    }
  },
  computed: {
    colorStyle () {
      return {
        'background-color': `rgba(${this.colorSetting.rgba.r}, ${this.colorSetting.rgba.g}, ${this.colorSetting.rgba.b}, ${this.colorSetting.rgba.a})`
      }
    }
  },
  methods: {
    changeColorHandle (color) {
      this.colorSetting.hex = color.rgba.toHexString()
      this.colorSetting.rgba = color.rgba
      this.inputColor = this.colorSetting.hex
    },
    inputColorHandle (val) {
      console.log('value', this.inputColor, this.isHexColor(this.inputColor))
      if (this.isHexColor(this.inputColor)) {
        this.colorSetting.hex = this.inputColor
        this.colorSetting.rgba = {
          ...this.hexToRgb(this.inputColor),
          a: 1
        }
      }
    },
    isHexColor (sNum) {
      return /(^#[0-9A-F]{6}$)/i.test(sNum)
    },
    outsidePicker (e) {
      if (this.showColorView && !this.$refs.picker.isEqualNode(e.target)) {
        this.showColorView = false
      }
    },
    hexToRgb (hex) {
      let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
      hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b
      })
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null
    }
  }
}
</script>

<style lang="scss" scoped>

.form-control {
  height: 30px;
  background: white;
  width: 100%;
  padding: 5px 10px;
  outline: none;
}

.color-input-wrap {
  position: relative;

  .color-picker {
    height: 30px;
    width: 30px;
    position: absolute;
    border: 1px solid #9ba9c4;
    top: 0;
    left: 0;
  }

  .color-input {
    padding-left: 35px !important;
  }
}
</style>
