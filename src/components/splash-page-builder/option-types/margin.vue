<template lang="pug">
  v-layout.option-type(row).text-xs-center.wrap.row
    v-flex(offset-xs3)
    v-flex(xs6)
      //- label.option-label {{ $t('builder.top') }}
      .input-inline-group.mt-1
        .inputWrapper
          input.form-control.mt-1.pt-1(
            type="number",
            v-model="margin.top"
            :disabled="selectedUnit.top.value === 'auto'"
            @input="changeMargin('top')"
            @keydown.prevent.up="incrementMargin('top')"
            @keydown.prevent.down="decrementMargin('top')"
          )
        .selectUnitWrapper
          multiselect(
            v-model="selectedUnit.top",
            label="text",
            :options="units",
            @input="changeUnit('top')"
            placeholder=""
            :show-labels="false"
          )
    v-flex(offset-xs3)
    v-flex(xs5)
      //- label.option-label {{ $t('builder.left') }}
      .input-inline-group.mt-1
        .inputWrapper
          input.form-control.mt-1.pt-1(
            type="number",
            v-model="margin.left"
            :disabled="selectedUnit.left.value === 'auto'"
            @input="changeMargin('left')"
            @keydown.prevent.up="incrementMargin('left')"
            @keydown.prevent.down="decrementMargin('left')"
          )
        .selectUnitWrapper
          multiselect(
            v-model="selectedUnit.left",
            label="text",
            :options="units",
            @input="changeUnit('left')"
            placeholder=""
            :show-labels="false"
          )
    v-flex(offset-xs2)
    v-flex(xs5)
      //- label.option-label {{ $t('builder.right') }}
      .input-inline-group.mt-1
        .inputWrapper
          input.form-control.mt-1.pt-1(
            type="number",
            v-model="margin.right"
            :disabled="selectedUnit.right.value === 'auto'"
            @input="changeMargin('right')"
            @keydown.prevent.up="incrementMargin('right')"
            @keydown.prevent.down="decrementMargin('right')"
          )
        .selectUnitWrapper
          multiselect(
            v-model="selectedUnit.right",
            label="text",
            :options="units",
            @input="changeUnit('right')"
            placeholder=""
            :show-labels="false"
          )
    v-flex(offset-xs3)
    v-flex(xs6)
      //- label.option-label {{ $t('builder.left') }}
      .input-inline-group.mt-1
        .inputWrapper
          input.form-control.mt-1.pt-1(
            type="number",
            v-model="margin.bottom"
            :disabled="selectedUnit.bottom.value === 'auto'"
            @input="changeMargin('bottom')"
            @keydown.prevent.up="incrementMargin('bottom')"
            @keydown.prevent.down="decrementMargin('bottom')"
          )
        .selectUnitWrapper
          multiselect(
            v-model="selectedUnit.bottom",
            label="text",
            :options="units",
            @input="changeUnit('bottom')"
            placeholder=""
            :show-labels="false"
          )
    v-flex(offset-xs3)
</template>

<script>
export default {
  props: {
    selectedItem: {
      type: Object,
      required: true
    },
    configKey: {
      type: String,
      default: 'margin'
    }
  },
  data () {
    return {
      margin: null,
      selectedUnit: null,
      units: [
        {
          text: 'px',
          value: 'px'
        },
        {
          text: '%',
          value: '%'
        },
        {
          text: 'auto',
          value: 'auto'
        }
      ]
    }
  },
  created () {
    this.initSetItem()
  },
  methods: {
    initSetItem () {
      const margin = this.selectedItem.config.margin
      this.margin = {}
      this.margin.top = margin.top !== 'auto' ? parseFloat(margin.top) : 'auto'
      this.margin.bottom = margin.bottom !== 'auto' ? parseFloat(margin.bottom) : 'auto'
      this.margin.left = margin.left !== 'auto' ? parseFloat(margin.left) : 'auto'
      this.margin.right = margin.right !== 'auto' ? parseFloat(margin.right) : 'auto'

      this.selectedUnit = {}
      this.selectedUnit.top = {
        value: margin.top !== 'auto'
          ? margin.top.substr(this.margin.top.toString().length)
          : 'auto',
        text: margin.top !== 'auto'
          ? margin.top.substr(this.margin.top.toString().length).toUpperCase()
          : 'Auto'
      }
      this.selectedUnit.left = {
        value: margin.left !== 'auto'
          ? margin.left.substr(this.margin.left.toString().length)
          : 'auto',
        text: margin.left !== 'auto'
          ? margin.left.substr(this.margin.left.toString().length).toUpperCase()
          : 'Auto'
      }
      this.selectedUnit.right = {
        value: margin.right !== 'auto'
          ? margin.right.substr(this.margin.right.toString().length)
          : 'auto',
        text: margin.right !== 'auto'
          ? margin.right.substr(this.margin.right.toString().length).toUpperCase()
          : 'Auto'
      }
      this.selectedUnit.bottom = {
        value: margin.bottom !== 'auto'
          ? margin.bottom.substr(this.margin.bottom.toString().length)
          : 'auto',
        text: margin.bottom !== 'auto'
          ? margin.bottom.substr(this.margin.bottom.toString().length).toUpperCase()
          : 'Auto'
      }
    },
    setMargin (key, value) {
      this.margin = {
        top: key === 'top' ? value : this.margin.top,
        right: key === 'right' ? value : this.margin.right,
        left: key === 'left' ? value : this.margin.left,
        bottom: key === 'bottom' ? value : this.margin.bottom
      }
    },
    setUnit (key, value) {
      this.selectedUnit = {
        top: key === 'top' ? value : this.selectedUnit.top,
        right: key === 'right' ? value : this.selectedUnit.right,
        left: key === 'left' ? value : this.selectedUnit.left,
        bottom: key === 'bottom' ? value : this.selectedUnit.bottom
      }
    },
    changeMargin (key) {
      this.selectedItem.config.margin[key] = this.margin[key] === 'auto'
        ? 'auto'
        : this.margin[key] + this.selectedUnit[key].value
    },
    changeUnit (key) {
      if (this.selectedUnit[key].value === 'auto' && this.margin[key] !== 'auto') {
        this.selectedItem.config.margin[key] = 'auto'
        this.setMargin(key, 'auto')
        this.setUnit(key, { value: 'auto', text: 'auto' })
      } else if (this.selectedUnit[key].value !== 'auto' && this.margin[key] === 'auto') {
        this.setMargin(key, 5)
        this.setUnit(key, { value: this.selectedUnit[key].value, text: this.selectedUnit[key].text })
        this.selectedItem.config.margin[key] = this.margin[key] + this.selectedUnit[key].value
      } else {
        this.setUnit(key, { value: this.selectedUnit[key].value, text: this.selectedUnit[key].text })
        this.selectedItem.config.margin[key] = this.margin[key] + this.selectedUnit[key].value
      }
    },
    incrementMargin (key) {
      if (this.margin[key] === 'auto') {
        this.selectedItem.config.margin[key] = 'auto'
      } else {
        this.margin = {
          left: key === 'left' ? parseInt(this.margin.left) + 1 : this.margin.left,
          right: key === 'right' ? parseInt(this.margin.right) + 1 : this.margin.right,
          top: key === 'top' ? parseInt(this.margin.top) + 1 : this.margin.top,
          bottom: key === 'bottom' ? parseInt(this.margin.bottom) + 1 : this.margin.bottom
        }
        this.selectedItem.config.margin[key] = this.margin[key] + this.selectedUnit[key].value
      }
    },
    decrementMargin (key) {
      if (typeof this.margin[key] === 'number' && this.margin[key] >= 1) {
        this.margin = {
          left: key === 'left' ? parseInt(this.margin.left) - 1 : this.margin.left,
          right: key === 'right' ? parseInt(this.margin.right) - 1 : this.margin.right,
          top: key === 'top' ? parseInt(this.margin.top) - 1 : this.margin.top,
          bottom: key === 'bottom' ? parseInt(this.margin.bottom) - 1 : this.margin.bottom
        }
        this.selectedItem.config.margin[key] = this.margin[key] + this.selectedUnit[key].value
      } else if (this.margin[key] === 'auto') {
        this.selectedItem.config.margin[key] = 'auto'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.input-inline-group {
  position: relative;
  display: flex;
  .inputWrapper {
    width: 50% !important;
    input {
      height: 38px !important;
    }
  }
  .selectUnitWrapper {
    width: 50%;
  }
}
</style>
