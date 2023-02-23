<template lang='pug'>
  v-container(grid-list-md)
    v-layout(row)
      // materialDetails row
      v-flex(xs12)
        v-layout(row)
          v-flex(xs12)
            h2 {{ $t('settings.materialDetails') }} : {{ $t('organization.importMeraki') }}
            p.mt-4 {{ $t('organization.importMerakiDescription') }}

    v-layout.card.px-5.pa-4(
      row
      wrap
    )
      meraki-api-selection.xs12(
        ref="meraki"
        :value="value"
        @input="change"
      )

</template>
<script>
import MerakiApiSelection from './meraki-api-selection'

export default {
  props: ['value'],
  components: {
    MerakiApiSelection
  },
  methods: {
    change (selectedOrg) {
      this.$emit('input', selectedOrg)
    },
    submit (siteId) {
      return this.$refs.meraki.submit(siteId)
    }
  }
}
</script>
