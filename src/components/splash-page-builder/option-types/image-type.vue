<template lang="pug">
  .option-type
    label.option-label Image
    input.form-control(type="file")
</template>

<script>
export default {
  props: {
    selectedItem: {
      type: Object
    }
  }
}
</script>
