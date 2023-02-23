<template lang="pug">
  .modal-wrapper(v-if="show")
    .modal-backdrop.fade.show
    .modal.fade.show
      .modal-dialog.modal-lg
        .modal-content
          .modal-header
            h4.modal-title
              slot(name="modal-title") Modal Title
            button.close(type="button", data-dismiss="modal", aria-label="Close", @click="$emit('close')")
              span(area-hidden="true") x
          .modal-body
            slot
</template>

<script>
export default {
  props: ['show']
}
</script>

<style lang="scss" scoped>
  .modal {
    display: block;
    color: #333;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .modal-dialog {
    margin-top: 20px;
  }

  .modal-body {
    max-height: 85vh;
    overflow-y: auto;
  }
</style>
