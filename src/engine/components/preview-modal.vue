<template lang="pug">
  .modal-wrapper(v-if="show")
    .modal-backdrop.fade.show
    .modal.fade.show(@click="$emit('close')")
      .modal-dialog.modal-lg.modal-dialog-centered(@click.stop)
        .modal-content
          button.close(type="button", data-dismiss="modal", aria-label="Close", @click="$emit('close')")
              span(area-hidden="true") x
          .modal-body
            h2 {{ $t('engine.previewMode') }}
            p
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

  h2 {
    margin-bottom: 20px;
  }

  .modal-dialog {
    margin-top: 20px;
  }

  .modal-content {
    background-color: rgba(255, 255, 255, 0.9);
  }

  .modal-body {
    max-height: 85vh;
    overflow-y: auto;
    padding: 2rem;
    text-align: center;
  }

  .modal-backdrop.show {
    opacity: 0.2;
  }

  .close {
    position: absolute;
    right: 10px;
    top: 5px;
    z-index: 10;
  }
</style>
