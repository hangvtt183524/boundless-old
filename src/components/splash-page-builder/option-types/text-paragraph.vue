<template lang="pug">
  .option-type
    label.option-label {{ $t(label) }}
    textarea.form-control(v-model="selectedItem.config[configKey]")
</template>

<script>
export default {
  props: {
    selectedItem: {
      type: Object
    },
    label: {
      type: String,
      default: 'builder.title'
    },
    configKey: {
      type: String,
      default: 'title'
    }
  }
}
</script>
