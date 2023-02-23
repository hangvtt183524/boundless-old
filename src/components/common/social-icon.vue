<template lang="pug">
  v-icon(:class="`${type} fab fa-${type}`")
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: true
    }
  }
}
</script>
<style lang="scss" scoped>
/* Used in prepend-social-icon directive */
.prepend-social-icon {
  margin-right: 20px !important;
}
</style>
