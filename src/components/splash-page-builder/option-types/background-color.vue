<template lang="pug">
  .option-type
    label.option-label {{ $t('builder.backgroundColor') }}
    .mt-1
      commonColor(:colorSetting="selectedItem.config[configKey]", :configKey="configKey")
</template>

<script>
import commonColor from '@/components/common/colorPicker'

export default {
  props: {
    selectedItem: {
      type: Object,
      required: true
    },
    configKey: {
      type: String,
      default: 'backgroundColor'
    }
  },
  components: {
    'commonColor': commonColor
  }
}
</script>
