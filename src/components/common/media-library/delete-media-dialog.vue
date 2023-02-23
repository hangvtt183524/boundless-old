<template lang="pug">
  base-dialog(:show="show", max-width='600px', @close="$emit('close')")
    .delete-confirm-dialog(data-test="delete-confirm-dialog")
      v-layout(row)
        v-flex(sm11)
          h2.dialog-heading.py-3 {{ $t('media.deleteMediaLibrary') }}
      v-layout(row)
        v-flex(sm12).py-3
          p {{ $t('media.attentionYouDeleteMedia') }}
      v-layout(row)
        v-flex.text-xs-right.pb-3(sm-2)
          v-btn(round, large, data-test="btn-cancel" @click.stop="$emit('close')") {{ $t('general.cancel') }}
          v-btn(color='error', data-test="btn-confirm" round, large, @click.stop='removeUser()') {{ $t('general.remove') }}
</template>

<script>

import baseDialog from '@/components/common/base-dialog'

export default {
  props: ['show'],
  components: {
    baseDialog
  },
  methods: {
    removeUser () {
      this.$emit('remove')
    }
  }
}
</script>
