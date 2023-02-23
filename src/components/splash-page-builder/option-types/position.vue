<template lang="pug">
  v-layout.option-type(row wrap)
    v-flex.mt-3.px-1(xs12)
      label.option-label {{ $t('builder.position') }}
      .input-inline-group
        multiselect.mt-1(
          v-model="selectedItem.config.position.type",
          label="text",
          placeholder="",
          :options="positionTypes",
          :show-labels="false"
        )
    v-flex.mt-3.px-1(xs12)
      label.option-label {{ $t('builder.display') }}
      .input-inline-group
        multiselect.mt-1(
          v-model="selectedItem.config.display",
          label="text",
          placeholder="",
          :options="displayTypes",
          :show-labels="false"
        )
    v-flex.mt-3.px-1(xs6)
      label.option-label {{ $t('builder.top') }}
      .input-inline-group
        .inputWrapper
          input.form-control.mt-1.py-1(
            type="number",
            v-model="position.top"
            :disabled="selectedUnit.top.value === 'auto'"
            @input="changePosition('top')"
            @keydown.prevent.up="incrementSize('top')"
            @keydown.prevent.down="decrementSize('top')"
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
    v-flex.mt-3.px-1(xs6)
      label.option-label {{ $t('builder.right') }}
      .input-inline-group
        .inputWrapper
          input.form-control.mt-1.py-1(
            type="number",
            v-model="position.right"
            :disabled="selectedUnit.right.value === 'auto'"
            @input="changePosition('right')"
            @keydown.prevent.up="incrementSize('right')"
            @keydown.prevent.down="decrementSize('right')"
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
    v-flex.mt-3(xs6)
      label.option-label {{ $t('builder.left') }}
      .input-inline-group
        .inputWrapper
          input.form-control.mt-1.py-1(
            type="number",
            v-model="position.left"
            :disabled="selectedUnit.left.value === 'auto'"
            @input="changePosition('left')"
            @keydown.prevent.up="incrementSize('left')"
            @keydown.prevent.down="decrementSize('left')"
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
    v-flex.mt-3.px-1(xs6)
      label.option-label {{ $t('builder.bottom') }}
      .input-inline-group
        .inputWrapper
          input.form-control.mt-1.py-1(
            type="number",
            v-model="position.bottom"
            :disabled="selectedUnit.bottom.value === 'auto'"
            @input="changePosition('bottom')"
            @keydown.prevent.up="incrementSize('bottom')"
            @keydown.prevent.down="decrementSize('bottom')"
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
</template>

<script>
export default {
  props: {
    selectedItem: {
      type: Object,
      required: true
    },
    settingsConfig: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      positionTypes: [
        {
          text: 'static',
          value: 'static'
        },
        {
          text: 'relative',
          value: 'relative'
        },
        {
          text: 'fixed',
          value: 'fixed'
        },
        {
          text: 'absolute',
          value: 'absolute'
        },
        {
          text: 'sticky',
          value: 'sticky'
        }
      ],
      displayTypes: [
        {
          text: 'inline',
          value: 'inline'
        },
        {
          text: 'block',
          value: 'block'
        },
        {
          text: 'inline-block',
          value: 'inline-block'
        },
        {
          text: 'flex',
          value: 'flex'
        },
        {
          text: 'none',
          value: 'none'
        }
      ],
      position: null,
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
      const position = this.selectedItem.config.position
      this.position = {}
      this.position.top = position.top !== 'auto' ? parseFloat(position.top) : 'auto'
      this.position.bottom = position.bottom !== 'auto' ? parseFloat(position.bottom) : 'auto'
      this.position.left = position.left !== 'auto' ? parseFloat(position.left) : 'auto'
      this.position.right = position.right !== 'auto' ? parseFloat(position.right) : 'auto'

      this.selectedUnit = {}
      this.selectedUnit.top = {
        value: position.top !== 'auto'
          ? position.top.substr(this.position.top.toString().length)
          : 'auto',
        text: position.top !== 'auto'
          ? position.top.substr(this.position.top.toString().length).toUpperCase()
          : 'Auto'
      }
      this.selectedUnit.left = {
        value: position.left !== 'auto'
          ? position.left.substr(this.position.left.toString().length)
          : 'auto',
        text: position.left !== 'auto'
          ? position.left.substr(this.position.left.toString().length).toUpperCase()
          : 'Auto'
      }
      this.selectedUnit.right = {
        value: position.right !== 'auto'
          ? position.right.substr(this.position.right.toString().length)
          : 'auto',
        text: position.right !== 'auto'
          ? position.right.substr(this.position.right.toString().length).toUpperCase()
          : 'Auto'
      }
      this.selectedUnit.bottom = {
        value: position.bottom !== 'auto'
          ? position.bottom.substr(this.position.bottom.toString().length)
          : 'auto',
        text: position.bottom !== 'auto'
          ? position.bottom.substr(this.position.bottom.toString().length).toUpperCase()
          : 'Auto'
      }
    },
    changePosition (key) {
      this.selectedItem.config.position[key] = this.position[key] === 'auto'
        ? 'auto'
        : this.position[key] + this.selectedUnit[key].value
    },
    setPosition (key, value) {
      this.position = {
        top: key === 'top' ? value : this.position.top,
        right: key === 'right' ? value : this.position.right,
        left: key === 'left' ? value : this.position.left,
        bottom: key === 'bottom' ? value : this.position.bottom
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
    changeUnit (key) {
      if (this.selectedUnit[key].value === 'auto' && this.position[key] !== 'auto') {
        this.selectedItem.config.position[key] = 'auto'
        this.setPosition(key, 'auto')
        this.setUnit(key, { value: 'auto', text: 'auto' })
      } else if (this.selectedUnit[key].value !== 'auto' && this.position[key] === 'auto') {
        this.setPosition(key, 5)
        this.setUnit(key, { value: this.selectedUnit[key].value, text: this.selectedUnit[key].text })
        this.selectedItem.config.position[key] = this.position[key] + this.selectedUnit[key].value
      } else {
        this.setUnit(key, { value: this.selectedUnit[key].value, text: this.selectedUnit[key].text })
        this.selectedItem.config.position[key] = this.position[key] + this.selectedUnit[key].value
      }
    },
    incrementSize (key) {
      if (this.position[key] === 'auto') {
        this.selectedItem.config.position[key] = 'auto'
      } else {
        this.position = {
          left: key === 'left' ? parseInt(this.position.left) + 1 : this.position.left,
          right: key === 'right' ? parseInt(this.position.right) + 1 : this.position.right,
          top: key === 'top' ? parseInt(this.position.top) + 1 : this.position.top,
          bottom: key === 'bottom' ? parseInt(this.position.bottom) + 1 : this.position.bottom
        }
        this.selectedItem.config.position[key] = this.position[key] + this.selectedUnit[key].value
      }
    },
    decrementSize (key) {
      if (this.position[key] === 'auto') {
        this.selectedItem.config.position[key] = 'auto'
      } else {
        this.position = {
          left: key === 'left' ? parseInt(this.position.left) - 1 : this.position.left,
          right: key === 'right' ? parseInt(this.position.right) - 1 : this.position.right,
          top: key === 'top' ? parseInt(this.position.top) - 1 : this.position.top,
          bottom: key === 'bottom' ? parseInt(this.position.bottom) - 1 : this.position.bottom
        }
        this.selectedItem.config.position[key] = this.position[key] + this.selectedUnit[key].value
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
      &:disabled {
        background: #EEEEEE !important;
      }
    }
  }
  .selectUnitWrapper {
    width: 50%;
  }
}
</style>
