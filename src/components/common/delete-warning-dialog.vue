<template lang="pug">
    // delete group modal
    base-dialog(:show="show", max-width='700px', @close="$emit('close')")
      h2.dialog-heading.mb-3 {{ dialogHeading }}
      h4.dialog-subtitle {{ message }}

      .text-xs-right.mt-5
        v-btn(@click.native="$emit('close')", round, large) {{ $t('general.close') }}
</template>

<script>
export default {
  name: 'DeleteGroupModal',
  props: ['show', 'message', 'name'],
  computed: {
    dialogHeading () {
      if (this.name) {
        let deleteMessage = `Delete "${this.name}"`
        return deleteMessage
      }

      return 'Delete Item'
    }
  }
}
</script>
