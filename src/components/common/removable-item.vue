<template lang="pug">
  v-fade-transition
    div(data-test="removable-item")
      v-layout.removable-item(row wrap)
        v-flex(xs11)
          v-layout(row wrap)
            slot
        slot(name="action")
          v-flex(xs1 :class="actionClass")
            v-btn.btn__close(
              data-test="btn-remove"
              :disabled="!removable"
              color="error"
              fab
              flat
              small
              @click.stop="$emit('remove')"
            )
              v-icon close
</template>

<script>
export default {
  props: {
    removable: {
      type: Boolean,
      default: true
    },
    actionClass: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.removable-item {
  background-color: white;
  border-radius: 5px;
}
</style>
