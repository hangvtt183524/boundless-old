<template>
  <v-dialog
    v-model="showDialog"
    :max-width="maxWidth"
    :persistent="persistent"
    no-click-animation
    class="base-modal">
    <slot name="header"></slot>
    <slot></slot>
    <slot name="footer"></slot>
  </v-dialog>
</template>

<script>
export default {
  name: 'BaseModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    maxWidth: {
      type: String,
      default: '920'
    },
    persistent: {
      type: Boolean,
      default: false
    },
    scrollable: {
      type: Boolean,
      default: false
    },
    hideCloseButton: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    showDialog: {
      // This fixes the issue when clicking outside the dialog
      // and you can't open it again
      get () {
        return this.show
      },
      set (value) {
        if (!value) {
          this.$emit('close')
        }
      }
    }
  }
}
</script>

<style src="./base-modal.scss" lang="scss"></style>
