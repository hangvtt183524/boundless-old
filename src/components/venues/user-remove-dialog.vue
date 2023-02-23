<template lang="pug">
  base-dialog(:show="show", max-width='540px', @close="$emit('close')")
    v-layout(row)
      v-flex(sm11)
        h2.dialog-heading.py-3 {{ $t('user.deleteAUser') }}
    v-layout(row)
      v-flex(sm12).py-3
        v-checkbox(:label="$t('user.removePermissionsNode')", v-model='confirmUserRemoval')
    v-layout(row)
      v-flex.text-xs-right.pb-3(sm-2)
        v-btn(round, large,  @click.stop="$emit('close')") {{ $t('general.cancel') }}
        v-btn(color='error', round, large, :disabled="!confirmUserRemoval" @click.stop='removeUser()') {{ $t('general.remove') }}
</template>

<script>

import baseDialog from '@/components/common/base-dialog'

export default {
  props: ['show'],
  components: {
    baseDialog
  },
  data () {
    return {
      confirmUserRemoval: false
    }
  },
  methods: {
    removeUser () {
      this.$emit('remove')
    }
  }
}
</script>
