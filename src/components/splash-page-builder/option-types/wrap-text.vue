<template lang="pug">
  .option-type.my-3
    v-switch(:label="'Break Line?'", v-model="selectedItem.config.wrapText", color="blue darken-3" hide-details)
</template>
<script>
export default {
  props: ['selectedItem'],
  watch: {
    'selectedItem.config.wrapText': function (val) {
      this.selectedItem.config.wrapText = val
    }
  }
}
</script>
