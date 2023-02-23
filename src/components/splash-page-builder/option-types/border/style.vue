<template lang="pug">
  .option-type
    label.option-label {{ $t('builder.borderStyle') }}
    multiselect.mt-1(
      :options="settingsConfig.borderStyles",
      v-model="selectedItem.config.border.style",
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
    }
  }
}
</script>
