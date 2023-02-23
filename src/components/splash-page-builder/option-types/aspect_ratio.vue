<template lang="pug">
  .option-type.mt-4
    v-checkbox(:label="'Preserve Aspect Ratio'", v-model="selectedItem.config.aspectRatio")
</template>
<script>
export default {
  props: ['selectedItem']
}
</script>
