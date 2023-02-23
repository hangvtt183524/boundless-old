<template lang="pug">
    // delete group modal
    base-dialog(:show="show", max-width='700px', @close="$emit('close')")
      h2.dialog-heading.mb-3 {{ dialogHeading }}
      h4.dialog-subtitle {{ $t(deleteItemWarningMessage) }}

      .text-xs-right.mt-5
        v-btn(@click.native="$emit('close')", round, large) {{ $t('general.close') }}
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DeleteGroupModal',

  props: ['show'],

  computed: {
    ...mapGetters('organization/venue', ['selectedItems']),

    dialogHeading () {
      if (this.selectedItems.length) {
        let deleteMessage = `${this.$t('general.delete')} "${this.selectedItems[0].name}"`

        if (this.selectedItems.length > 1) {
          deleteMessage = `${this.$t('general.delete')} ${this.selectedItems.length} ${this.selectedItems[0].type}s`
        }

        return deleteMessage
      }

      return 'Delete Item'
    },
    deleteItemWarningMessage () {
      if (this.selectedItems.length) {
        let itemType = this.selectedItems[0].type
        let deleteMessage = ''
        if (itemType === 'group') {
          deleteMessage = 'settings.deleteGroupDescription'
        } else if (itemType === 'site') {
          deleteMessage = 'settings.deleteSiteDescription'
        }

        return deleteMessage
      }

      return 'settings.deleteGroup'
    }
  }
}
</script>
