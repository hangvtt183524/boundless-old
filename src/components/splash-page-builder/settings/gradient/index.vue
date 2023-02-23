<template lang="pug">
  .option-wrapper.mt-2
    .option-categorgy-body
      linearGradient(:config="config")

</template>

<script>
import linearGradient from './linear-gradient'

export default {
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  components: {
    linearGradient
  }
}
</script>

<style>

</style>
