<template lang="pug">
  .option-type
    label.option-label {{ $t('builder.borderColor') }}
    .mt-1
      commonColor(:colorSetting="selectedItem.config.border.color", :label="label", config-key="border")
</template>

<script>
import commonColor from '@/components/common/colorPicker'

export default {
  props: {
    selectedItem: {
      type: Object,
      required: true
    },
    label: {
      type: String,
      default: 'builder.textColor'
    }
  },
  components: {
    'commonColor': commonColor
  }
}
</script>

<style lang="scss">
.hu-color-picker {
  width: 100%;
}
</style>
