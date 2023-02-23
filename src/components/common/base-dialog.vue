<template lang="pug">
  v-dialog(
    v-model="showDialog"
    :max-width="maxWidth"
    :persistent="persistent"
    no-click-animation
    scrollable
  )
    v-icon.close-modal(
      v-if="!hideCloseBtn"
      @click.stop="$emit('close')"
    ) close
    v-card
      slot(name="header")
      v-card-text
        v-layout(row)
          v-flex(xs12)
            slot
      slot(name="footer")
</template>

<script>
export default {
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
    hideCloseBtn: {
      tyoe: Boolean,
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

<style lang="scss">
@import "styles/colors.scss";
@import "styles/v2/colors.scss";

.v-dialog {
  padding: 60px;
  background-color: $gray-xlight !important;
  position: relative;
  color: #00082a;
  font-family: 'Fira Sans', sans-serif;

  p {
    color: #00082a;
    font-size: 16px;
  }

  .dialog-heading {
    font-family: 'Fira Sans', sans-serif;
    color: #354c77;
  }

  .dialog-subtitle {
    font-weight: 600;
    font-size: 16px;
    color: #00082a;
  }

  &::-webkit-scrollbar {
    -webkit-appearance: none;
  }

  &::-webkit-scrollbar:vertical {
    width: 11px;
  }

  &::-webkit-scrollbar:horizontal {
    height: 11px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    border: 2px solid $gray-xlight;
    background-color: #bdc9e1;
  }

  &::-webkit-scrollbar-track {
    background-color: $gray-xlight;
    border-radius: 8px;
  }

}

.close-modal {
  position: absolute;
  top: 20px;
  right: 20px;
  color: #a0adc7 !important;
  cursor: pointer;
}

.dialog--scrollable {
  .stepper, .dialog-content {
    -webkit-box-flex: 1;
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;

    .stepper__header, .dialog-content__header {
      -webkit-box-flex: 1;
      -ms-flex: 1 0 auto;
      flex: 1 0 auto;
    }

    .stepper__items, .dialog-content__body {
      max-height: 450px;
      overflow-y: auto !important;
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;

      @media only screen and (min-width: 992px) {
        max-height: 480px;
      }
    }
  }
}
</style>
