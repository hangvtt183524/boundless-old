<template lang="pug">
  v-layout.option-type(row).wrap.row
    v-flex(xs12).font-weight-bold.my-2
      label.option-label {{ $t('builder.textShadow') }}
    v-flex(xs6).px-1
      label.option-label {{ $t('builder.xPosition') }}
      .input-inline-group.mt-1
        input.form-control.mt-1.pt-1(
          type="number",
          v-model="selectedItem.config.textShadow.x"
          @keydown.prevent.up="incrementSize('x')"
          @keydown.prevent.down="decrementSize('x')"
        )
        label px
    v-flex(xs6).px-1
      label.option-label {{ $t('builder.yPosition') }}
      .input-inline-group.mt-1
        input.form-control.mt-1.pt-1(
          type="number",
          v-model="selectedItem.config.textShadow.y"
          @keydown.prevent.up="incrementSize('y')"
          @keydown.prevent.down="decrementSize('y')"
        )
        label px
    v-flex(xs12).px-1
      label.option-label {{ $t('builder.blur') }}
      .input-inline-group.mt-1
        input.form-control.mt-1.pt-1(
          type="number",
          v-model="selectedItem.config.textShadow.blur"
          @keydown.prevent.up="incrementSize('blur')"
          @keydown.prevent.down="decrementSize('blur')"
        )
        label px
    v-flex(xs12).px-1
      label.option-label {{ $t('builder.color') }}
      .mt-1
        commonColor(:colorSetting="selectedItem.config.textShadow.color", configKey="textShadow")
</template>

<script>
import commonColor from '@/components/common/colorPicker'

export default {
  props: {
    selectedItem: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      shadowTypes: ['outside', 'inside']
    }
  },
  components: {
    commonColor
  },
  methods: {
    incrementSize (key) {
      this.selectedItem.config.textShadow[key]++
    },
    decrementSize (key) {
      this.selectedItem.config.textShadow[key]--
    }
  }
}
</script>

<style lang="scss" scoped>
.input-inline-group {
  position: relative;
  label {
    position: absolute;
    right: 22px;
    top: 5px;
    padding: 3px;
    height: 26px;
    color: #9ba9c4;
  }
}
</style>
