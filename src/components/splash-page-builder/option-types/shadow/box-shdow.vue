<template lang="pug">
  v-layout.option-type(row).wrap.row
    v-flex(xs12).font-weight-bold.my-2
      label.option-label {{ $t('builder.boxShadow') }}
    v-flex(xs6).px-1
      label.option-label {{ $t('builder.xPosition') }}
      .input-inline-group.mt-1
        input.form-control.mt-1.pt-1(
          type="number",
          v-model="selectedItem.config.boxShadow.x"
          @keydown.prevent.up="incrementSize('x')"
          @keydown.prevent.down="decrementSize('x')"
        )
        label px
    v-flex(xs6).px-1
      label.option-label {{ $t('builder.yPosition') }}
      .input-inline-group.mt-1
        input.form-control.mt-1.pt-1(
          type="number",
          v-model="selectedItem.config.boxShadow.y"
          @keydown.prevent.up="incrementSize('y')"
          @keydown.prevent.down="decrementSize('y')"
        )
        label px
    v-flex(xs6).px-1
      label.option-label {{ $t('builder.blur') }}
      .input-inline-group.mt-1
        input.form-control.mt-1.pt-1(
          type="number",
          v-model="selectedItem.config.boxShadow.blur"
          @keydown.prevent.up="incrementSize('blur')"
          @keydown.prevent.down="decrementSize('blur')"
        )
        label px
    v-flex(xs6).px-1
      label.option-label {{ $t('builder.spread') }}
      .input-inline-group.mt-1
        input.form-control.mt-1.pt-1(
          type="number",
          v-model="selectedItem.config.boxShadow.spread"
          @keydown.prevent.up="incrementSize('spread')"
          @keydown.prevent.down="decrementSize('spread')"
        )
        label px
    v-flex(xs12).px-1
      label.option-label {{ $t('builder.color') }}
      .mt-1
        commonColor(:colorSetting="selectedItem.config.boxShadow.color", configKey="boxShadow")
    v-flex(xs12).px-1.pt-1
      label.option-label {{ $t('builder.shadowType') }}
      multiselect.mt-1(
        v-model="selectedItem.config.boxShadow.type",
        :options="shadowTypes",
        :show-labels="false",
        placeholder=""
      )
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
      this.selectedItem.config.boxShadow[key]++
    },
    decrementSize (key) {
      this.selectedItem.config.boxShadow[key]--
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
