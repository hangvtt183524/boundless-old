<template lang="pug">
  .option-wrapper.mt-2
    .option-categorgy-body
      backgroundSize(:config="config")
      backgroundPosition(:config="config")
      backgroundRepeat(:config="config")

</template>

<script>
import backgroundSize from './size'
import backgroundPosition from './position'
import backgroundRepeat from './repeat'

export default {
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  components: {
    backgroundSize,
    backgroundPosition,
    backgroundRepeat
  },
  data () {
    return {
      panel: [true, false, false]
    }
  }
}
</script>

<style>

</style>
