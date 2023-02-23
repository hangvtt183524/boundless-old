<template lang="pug">
  v-layout.option-type(row).text-xs-center.wrap.row
    v-flex(offset-xs3)
    v-flex(xs6)
      //- label.option-label {{ $t('builder.top') }}
      .input-inline-group.mt-1
        .inputWrapper
          input.form-control.mt-1.pt-1(
            type="number",
            v-model="padding.top"
            :disabled="selectedUnit.top.value === 'auto'"
            @input="changepadding('top')"
            @keydown.prevent.up="incrementpadding('top')"
            @keydown.prevent.down="decrementpadding('top')"
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
            v-model="padding.left"
            :disabled="selectedUnit.left.value === 'auto'"
            @input="changepadding('left')"
            @keydown.prevent.up="incrementpadding('left')"
            @keydown.prevent.down="decrementpadding('left')"
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
            v-model="padding.right"
            :disabled="selectedUnit.right.value === 'auto'"
            @input="changepadding('right')"
            @keydown.prevent.up="incrementpadding('right')"
            @keydown.prevent.down="decrementpadding('right')"
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
            v-model="padding.bottom"
            :disabled="selectedUnit.bottom.value === 'auto'"
            @input="changepadding('bottom')"
            @keydown.prevent.up="incrementpadding('bottom')"
            @keydown.prevent.down="decrementpadding('bottom')"
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
      default: 'padding'
    }
  },
  data () {
    return {
      padding: null,
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
      const padding = this.selectedItem.config.padding
      this.padding = {}
      this.padding.top = padding.top !== 'auto' ? parseFloat(padding.top) : 'auto'
      this.padding.bottom = padding.bottom !== 'auto' ? parseFloat(padding.bottom) : 'auto'
      this.padding.left = padding.left !== 'auto' ? parseFloat(padding.left) : 'auto'
      this.padding.right = padding.right !== 'auto' ? parseFloat(padding.right) : 'auto'

      this.selectedUnit = {}
      this.selectedUnit.top = {
        value: padding.top !== 'auto'
          ? padding.top.substr(this.padding.top.toString().length)
          : 'auto',
        text: padding.top !== 'auto'
          ? padding.top.substr(this.padding.top.toString().length).toUpperCase()
          : 'Auto'
      }
      this.selectedUnit.left = {
        value: padding.left !== 'auto'
          ? padding.left.substr(this.padding.left.toString().length)
          : 'auto',
        text: padding.left !== 'auto'
          ? padding.left.substr(this.padding.left.toString().length).toUpperCase()
          : 'Auto'
      }
      this.selectedUnit.right = {
        value: padding.right !== 'auto'
          ? padding.right.substr(this.padding.right.toString().length)
          : 'auto',
        text: padding.right !== 'auto'
          ? padding.right.substr(this.padding.right.toString().length).toUpperCase()
          : 'Auto'
      }
      this.selectedUnit.bottom = {
        value: padding.bottom !== 'auto'
          ? padding.bottom.substr(this.padding.bottom.toString().length)
          : 'auto',
        text: padding.bottom !== 'auto'
          ? padding.bottom.substr(this.padding.bottom.toString().length).toUpperCase()
          : 'Auto'
      }
    },
    setpadding (key, value) {
      this.padding = {
        top: key === 'top' ? value : this.padding.top,
        right: key === 'right' ? value : this.padding.right,
        left: key === 'left' ? value : this.padding.left,
        bottom: key === 'bottom' ? value : this.padding.bottom
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
    changepadding (key) {
      this.selectedItem.config.padding[key] = this.padding[key] === 'auto'
        ? 'auto'
        : this.padding[key] + this.selectedUnit[key].value
    },
    changeUnit (key) {
      if (this.selectedUnit[key].value === 'auto' && this.padding[key] !== 'auto') {
        this.selectedItem.config.padding[key] = 'auto'
        this.setpadding(key, 'auto')
        this.setUnit(key, { value: 'auto', text: 'Auto' })
      } else if (this.selectedUnit[key].value !== 'auto' && this.padding[key] === 'auto') {
        this.setpadding(key, 5)
        this.setUnit(key, { value: this.selectedUnit[key].value, text: this.selectedUnit[key].text })
        this.selectedItem.config.padding[key] = this.padding[key] + this.selectedUnit[key].value
      } else {
        this.setUnit(key, { value: this.selectedUnit[key].value, text: this.selectedUnit[key].text })
        this.selectedItem.config.padding[key] = this.padding[key] + this.selectedUnit[key].value
      }
    },
    incrementpadding (key) {
      if (this.padding[key] === 'auto') {
        this.selectedItem.config.padding[key] = 'auto'
      } else {
        this.padding = {
          left: key === 'left' ? parseInt(this.padding.left) + 1 : this.padding.left,
          right: key === 'right' ? parseInt(this.padding.right) + 1 : this.padding.right,
          top: key === 'top' ? parseInt(this.padding.top) + 1 : this.padding.top,
          bottom: key === 'bottom' ? parseInt(this.padding.bottom) + 1 : this.padding.bottom
        }
        this.selectedItem.config.padding[key] = this.padding[key] + this.selectedUnit[key].value
      }
    },
    decrementpadding (key) {
      if (typeof this.padding[key] === 'number' && this.padding[key] >= 1) {
        this.padding = {
          left: key === 'left' ? parseInt(this.padding.left) - 1 : this.padding.left,
          right: key === 'right' ? parseInt(this.padding.right) - 1 : this.padding.right,
          top: key === 'top' ? parseInt(this.padding.top) - 1 : this.padding.top,
          bottom: key === 'bottom' ? parseInt(this.padding.bottom) - 1 : this.padding.bottom
        }
        this.selectedItem.config.padding[key] = this.padding[key] + this.selectedUnit[key].value
      } else if (this.padding[key] === 'auto') {
        this.selectedItem.config.padding[key] = 'auto'
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
