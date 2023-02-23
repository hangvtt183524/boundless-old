<template lang="pug">
  editable-panel(title="General" is-readonly)
    v-form
      v-layout(row wrap)
        v-flex(xs12 md6 px-3)
          v-text-field(
            label="Last Connection"
            value="Last 30 minutes"
            :readonly="true"
          )
        v-flex(xs12 md6 px-3)
          v-text-field(
            label="Member for"
            value="1 Year"
            :readonly="true"
          )

</template>

<script>
import EditablePanel from '@/components/common/editable-panel'
import FlexMixin from '@/mixins/flex.mixin'

export default {
  name: 'GeneralInfo',
  components: {
    EditablePanel
  },
  mixins: [
    FlexMixin
  ]
}
</script>
