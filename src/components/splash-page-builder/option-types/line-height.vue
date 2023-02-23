<template lang="pug">
  .option-type
    label.option-label {{ $t(label) }}
    .input-inline-group
      input.form-control.mt-2.py-1(
        type="number",
        v-model="lineHeight"
        v-on:keydown.prevent.up="incrementSize"
        v-on:keydown.prevent.down="decrementSize"
      )
      multiselect(
        v-model="selectedUnit",
        label="text",
        :options="units",
        placeholder=""
        :show-labels="false",
      )
</template>

<script>
export default {
  props: {
    selectedItem: {
      type: Object,
      required: true
    },
    label: {
      type: String,
      default: 'builder.lineHeight'
    },
    configKey: {
      type: String,
      default: 'lineHeight'
    }
  },
  data () {
    return {
      selectedUnit: {
        text: 'px',
        value: 'px'
      },
      units: [
        {
          text: 'px',
          value: 'px'
        },
        {
          text: 'em',
          value: 'em'
        }
      ],
      lineHeight: 5
    }
  },
  mounted () {
    this.setItem()
  },
  watch: {
    selectedUnit (value) {
      this.selectedItem.config[this.configKey] = parseFloat(this.selectedItem.config[this.configKey]) + value.value
    },
    lineHeight (value) {
      this.selectedItem.config[this.configKey] = parseFloat(value) + this.selectedUnit.value
    }
  },
  methods: {
    setItem () {
      this.lineHeight = this.selectedItem.config[this.configKey] ? parseFloat(this.selectedItem.config[this.configKey]) : 1
      this.selectedUnit = {
        value: this.selectedItem.config[this.configKey] ? this.selectedItem.config[this.configKey].substr(this.lineHeight.toString().length) : 'em',
        text: this.selectedItem.config[this.configKey] ? this.selectedItem.config[this.configKey].substr(this.lineHeight.toString().length).toUpperCase() : 'em'
      }
    },
    incrementSize () {
      this.lineHeight++
      this.selectedItem.config[this.configKey] = this.lineHeight + this.selectedUnit.value
    },
    decrementSize () {
      if (this.lineHeight >= 2) {
        this.lineHeight--
        this.selectedItem.config[this.configKey] = this.lineHeight + this.selectedUnit.value
      }
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
.multiselect__input {
  width: 30% !important;
}
.multiselect__content-wrapper {
  width: 90% !important;
}
</style>
