<template lang='pug'>
  .click-action-header-cell(
    :class="{'click-action-header-cell--disabled': disabled}"
  )
    .click-action-header-cell__action(
      @click="onActionClick"
    )
      v-icon(
        v-if="icon"
      ) {{ icon }}
      span(
        v-if="text"
      ) {{ text }}

</template>

<script>
export default {
  name: 'click-action-header-cell',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      required: false
    },
    text: {
      type: String,
      required: false
    }
  },
  methods: {
    onActionClick () {
      if (this.disabled) {
        return false
      }

      this.$emit('input', {
        action: 'click'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "@/styles/v2/colors.scss";

  .click-action-header-cell {
    &__action {
      cursor: pointer;
      vertical-align: middle;
      color: $blue-reserve;

      .v-icon {
        opacity: 1 !important;  // Always visible
        color: $blue-reserve !important;
        vertical-align: middle;
        margin-right: 5px;
      }

      span {
        vertical-align: middle;
      }
    }

    &--disabled {
      .click-action-header-cell__action {
        cursor: not-allowed;
        color: $gray-light;

        .v-icon {
          color: $gray-light !important;
        }
      }
    }
  }
</style>
