<template lang='pug'>
  v-container(grid-list-md)
    v-layout(row)
      // materialDetails row
      v-flex(xs12)
        v-layout(row)
          v-flex(xs12)
            h2 {{ $t('settings.materialDetails') }} : {{ $t('organization.importAruba') }}
            p.mt-4 {{ $t('organization.importArubaDescription') }}

    v-layout.card(row wrap px-5 py-4)
      aruba-api-selection.xs12(
        ref="aruba"
        :value="value"
        @input="change"
      )

</template>
<script>
import ArubaApiSelection from './aruba-api-selection'

export default {
  props: ['value'],
  components: {
    ArubaApiSelection
  },
  methods: {
    change (selectedAleId) {
      this.$emit('input', selectedAleId)
    },
    submit (siteId) {
      return this.$refs.aruba.submit(siteId)
    }
  }
}
</script>
