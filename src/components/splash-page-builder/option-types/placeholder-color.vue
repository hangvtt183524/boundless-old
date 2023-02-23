<template lang="pug">
  .option-type
    label.option-label {{ $t('builder.placeholderColor') }}
    .mt-1.flex
      .color-picker.color-white(
        @click="setWhite"
        :class="{selected: selectedItem.config[configKey] == 'white'}"
      )
      .color-picker.color-black(
        @click="setBlack"
        :class="{selected: selectedItem.config[configKey] == 'black'}"
      )
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
      default: 'placeholderColor'
    }
  },
  methods: {
    setWhite () {
      this.selectedItem.config[this.configKey] = 'white'
    },
    setBlack () {
      this.selectedItem.config[this.configKey] = 'black'
    }
  }
}
</script>
<style lang="scss" scoped>
.flex {
  display: flex;
}
.color-picker {
  height: 30px;
  width: 30px;
  border: 1px solid #9ba9c4;
  margin: 5px;
}
.color-white {
  background: white;
}
.color-black {
  background: black;
}
.selected {
  border: 2px solid #db3934;
}
</style>
