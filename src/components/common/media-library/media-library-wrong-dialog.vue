<template lang="pug">
    // delete group modal
    base-dialog(:show="show", max-width='700px', @close="$emit('close')")
      h2.dialog-heading.mb-3 {{ $t('media.mediaLibrary') }}
      h4.dialog-subtitle {{ $t(message) }}

      .text-xs-right.mt-5
        v-btn(@click.native="$emit('close')", round, large) {{ $t('general.close') }}
</template>

<script>

export default {
  name: 'DeleteGroupModal',

  props: ['show', 'message']
}
</script>
