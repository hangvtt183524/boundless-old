<template lang="pug">
  .option-type
    label.option-label {{ $t(label) }}
    textarea.form-control(v-model="selectedItem.config[configKey]", :style="textAreaStyle")
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
    minHeight: {
      type: String,
      default: '60px'
    }
  },
  computed: {
    textAreaStyle () {
      return {
        'min-height': this.minHeight
      }
    }
  }
}
</script>
