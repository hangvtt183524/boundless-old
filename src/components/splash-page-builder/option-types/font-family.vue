<template lang="pug">
  .option-type
    label.option-label {{ $t('builder.fontFamily') }}
    multiselect.mt-1(
      :options="settingsConfig.fontFamilies",
      v-model="selectedItem.config[configKey]",
      :show-labels="false",
      :placeholder="$t('builder.selectFontFamily')"
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
    },
    configKey: {
      type: String,
      default: 'fontFamily'
    }
  }
}
</script>
