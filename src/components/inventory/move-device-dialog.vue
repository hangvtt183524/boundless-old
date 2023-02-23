<template lang="pug">
  base-dialog(:show="show" @close="close" max-width="500")
    h2.dialog-heading.mb-3 {{ dialogHeading }}
    node-select(
      :items="nodesWithGroupsDisabled"
      :label="$t('settings.selectSite')"
      :indent-level="0"
      clearable
      single-line
      hide-details
      search-enabled
      v-model="targetNode"
    )
    v-layout.pt-3.text-xs-right(row)
      v-flex(xs12)
        v-btn(
          :disabled="!targetNode"
          :loading="loading"
          @click="move(targetNode)"
          color="success"
          large
          round
        ) {{$t('general.move')}}

</template>
<script>
import MoveDeviceMixin from '@/mixins/move-device.mixin'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    selectedItems: {
      type: Array,
      required: true
    }
  },
  mixins: [
    MoveDeviceMixin
  ],
  methods: {
    close () {
      this.targetNode = null
      this.$emit('close')
    },
    move (targetNode) {
      this.targetNode = null
      this.$emit('move', targetNode)
    }
  }
}
</script>
