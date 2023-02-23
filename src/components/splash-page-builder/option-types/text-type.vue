<template lang="pug">
  .option-type
    label.option-label {{ $t(label) }}
    input.form-control(type="text", v-model="selectedItem.config[configKey]" :disabled="disabled")
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
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>
