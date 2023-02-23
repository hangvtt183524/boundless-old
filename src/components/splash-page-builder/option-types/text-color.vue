<template lang="pug">
  .option-type
    label.option-label {{ $t(label) }}
    .mt-1
      commonColor(
        :colorSetting="selectedItem.config[configKey]",
        :configKey="configKey")
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
    },
    configKey: {
      type: String,
      default: 'color'
    }
  },
  components: {
    commonColor
  }
}
</script>
