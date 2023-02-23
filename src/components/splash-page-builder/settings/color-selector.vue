<template lang="pug">
  .option-type
    commonColor(:colorSetting="pageConfig.background.backgroundColor", :configKey="configKey")
</template>

<script>
import commonColor from '@/components/common/colorPicker'

export default {
  props: {
    pageConfig: {
      type: Object,
      required: true
    },
    label: {
      type: String,
      default: 'builder.textColor'
    },
    configKey: {
      type: String,
      default: 'backgroundColor'
    }
  },
  components: {
    commonColor
  }
}
</script>
