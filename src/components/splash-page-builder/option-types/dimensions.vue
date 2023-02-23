<template lang="pug">
  v-layout.option-type(row wrap)
    v-flex.mt-3(xs4)
      label.option-label {{ $t('builder.width') }}
    v-flex(xs8)
      .input-inline-group.mt-1
        input.form-control.mt-2.py-1(
          type="number",
          v-model="width"
          @keydown.prevent.up="incrementWidth"
          @keydown.prevent.down="decrementWidth"
          @input="changeWidth"
          :disabled="selectedWidthUnit.value === 'auto'"
        )
        multiselect(
          v-model="selectedWidthUnit",
          label="text",
          :options="widthUnits",
          placeholder=""
          :show-labels="false",
        )
    v-flex.mt-3(xs4)
      label.option-label {{ $t('builder.height') }}
    v-flex(xs8)
      .input-inline-group.mt-1
        input.form-control.mt-2.py-1(
          type="number",
          v-model="height"
          @keydown.prevent.up="incrementHeight"
          @keydown.prevent.down="decrementHeight"
          @input="changeHeight"
          :disabled="selectedHeightUnit.value === 'auto'"
        )
        multiselect(
          v-model="selectedHeightUnit",
          label="text",
          :options="heightUnits",
          placeholder=""
          :show-labels="false",
        )
</template>

<script>
export default {
  props: ['selectedItem'],
  data () {
    return {
      width: 10,
      height: 10,
      ratio: 1,
      selectedWidthUnit: {
        text: 'px',
        value: 'px'
      },
      selectedHeightUnit: {
        text: 'px',
        value: 'px'
      },
      widthUnits: [
        {
          text: 'px',
          value: 'px'
        },
        {
          text: '%',
          value: '%'
        },
        {
          text: 'vw',
          value: 'vw'
        },
        {
          text: 'auto',
          value: 'auto'
        }
      ],
      heightUnits: [
        {
          text: 'px',
          value: 'px'
        },
        {
          text: '%',
          value: '%'
        },
        {
          text: 'vh',
          value: 'vh'
        },
        {
          text: 'auto',
          value: 'auto'
        }
      ]
    }
  },
  created () {
    this.setInitialWidthHeight()
    this.resetUnitAndAspectRatio()
  },
  watch: {
    selectedItemWidth (value) {
      this.resetUnitAndAspectRatio()
    },
    selectedItemHeight (value) {
      this.resetUnitAndAspectRatio()
    },
    selectedWidthUnit (value) {
      if (value.value === 'auto') {
        this.selectedItem.config.width = 'auto'
      } else {
        this.selectedItem.config.width = this.width + value.value
      }
    },
    selectedHeightUnit (value) {
      if (value.value === 'auto') {
        this.selectedItem.config.height = 'auto'
      } else {
        this.selectedItem.config.height = this.height + value.value
      }
    }
  },
  methods: {
    incrementHeight () {
      this.height = this.roundValue(parseFloat(this.height) + 1)
      this.selectedItem.config.height = this.height + this.selectedHeightUnit.value
      this.onChangeHeight()
    },
    decrementHeight () {
      if (this.height >= 2) {
        this.height = this.roundValue(this.height - 1)
        this.selectedItem.config.height = this.height + this.selectedHeightUnit.value
        this.onChangeHeight()
      }
    },
    changeHeight () {
      this.selectedItem.config.height = this.height + this.selectedHeightUnit.value
      this.onChangeHeight()
    },
    onChangeHeight () {
      if (this.selectedWidthUnit.value !== 'auto' && this.selectedHeightUnit.value !== 'auto') {
        if (this.preserveAspectRatio) {
          this.width = this.roundValue(this.height * this.ratio)
          this.selectedItem.config.width = this.roundValue(this.height * this.ratio).toString() + this.selectedHeightUnit.value
        } else {
          this.ratio = this.width / this.height
        }
      }
    },
    incrementWidth () {
      this.width = this.roundValue(parseFloat(this.width) + 1)
      this.selectedItem.config.width = this.width + this.selectedWidthUnit.value
      this.onChangeWidth()
    },
    decrementWidth () {
      if (this.width >= 2) {
        this.width = this.roundValue(this.width - 1)
        this.selectedItem.config.width = this.width + this.selectedWidthUnit.value
        this.onChangeWidth()
      }
    },
    changeWidth () {
      this.selectedItem.config.width = this.width + this.selectedWidthUnit.value
      this.onChangeWidth()
    },
    onChangeWidth () {
      if (this.selectedWidthUnit.value !== 'auto' && this.selectedHeightUnit.value !== 'auto') {
        if (this.preserveAspectRatio) {
          this.height = this.roundValue(this.width / this.ratio)
          this.selectedItem.config.height = this.roundValue(this.width / this.ratio).toString() + this.selectedWidthUnit.value
        } else {
          this.ratio = this.width / this.height
        }
      }
    },
    roundValue (val) {
      return val.toFixed(1)
    },
    setInitialWidthHeight () {
      const width = this.selectedItem.config.width
      const height = this.selectedItem.config.height
      if (width !== 'auto') {
        const widthFloat = parseFloat(this.selectedItem.config.width)
        this.width = widthFloat.toFixed(1)
      }
      if (height !== 'auto') {
        const heightFloat = parseFloat(this.selectedItem.config.height)
        this.height = heightFloat.toFixed(1)
      }
    },
    resetUnitAndAspectRatio () {
      const nonUnitRegEx = /[0-9.-]/g
      const width = this.selectedItem.config.width
      const height = this.selectedItem.config.height
      if (width === 'auto') {
        this.selectedWidthUnit = {
          value: 'auto',
          text: 'auto'
        }
      } else {
        this.selectedWidthUnit = {
          value: width ? width.replace(nonUnitRegEx, '') : 'px',
          text: width ? width.replace(nonUnitRegEx, '') : 'px'
        }
        // const widthFloat = parseFloat(this.selectedItem.config.width)
        // this.width = widthFloat.toFixed(1)
      }
      if (height === 'auto') {
        this.selectedHeightUnit = {
          value: 'auto',
          text: 'auto'
        }
      } else {
        this.selectedHeightUnit = {
          value: height ? height.replace(nonUnitRegEx, '') : 'px',
          text: height ? height.replace(nonUnitRegEx, '') : 'px'
        }
        // const heightFloat = parseFloat(this.selectedItem.config.height)
        // this.height = heightFloat.toFixed(1)
      }

      if (this.selectedWidthUnit.value !== 'auto' && this.selectedHeightUnit.value !== 'auto' &&
            parseFloat(this.width) !== 0 && parseFloat(this.height) !== 0) {
        this.ratio = this.width / this.height
      }
    }
  },
  computed: {
    preserveAspectRatio: {
      get () {
        return this.selectedItem.config.aspectRatio
      },
      set (value) {
        this.selectedItem.config.aspectRatio = value
      }
    },
    selectedItemWidth () {
      return this.selectedItem.config.width
    },
    selectedItemHeight () {
      return this.selectedItem.config.height
    }
  }
}
</script>

<style lang="scss" scoped>
.input-inline-group {
  position: relative;
  display: flex;
  input {
    width: 66% !important;
    height: 35px !important;
  }
  input:disabled {
    color: lightgrey;
  }
}
.multiselect {
  width: 30% !important;
  position: absolute;
  right: 2px;
  top: 2px;
  padding: 3px;
  height: 26px;
  color: #9ba9c4;
}
</style>
