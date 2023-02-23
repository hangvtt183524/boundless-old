<template lang="pug">
  base-dialog(:show="show", @close="$emit('close')")
    v-layout(row)
      v-flex(xs12)
        h2.dialog-heading.mb-1 {{ $t('errors.warning') }}
        h4.dialog-subtitle.mt-3.red--text {{ warningPanel.message }}
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'warning-dialog',
  props: ['show'],
  computed: {
    ...mapGetters(['warningPanel'])
  }
}
</script>

<style scoped>

</style>
