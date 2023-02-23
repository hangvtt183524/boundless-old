<template lang="pug">
  .organization-setting-item(
    :class="{'organization-setting-item--set-up': isSetUp}"
  )
    v-layout(row wrap)
      v-flex(
        xs1
        v-if="isSetUp !== null"
      ).organization-setting-item__status-icon-container
        v-icon.organization-setting-item__status-icon
          | check_circle
      v-flex(xs5)
        .organization-setting-item__title
          | {{ title }}
        .organization-setting-item__description
          | {{ description }}
      v-flex(
        :class="[{'xs6': isSetUp !== null}, {'xs7': isSetUp === null}]"
      ).organization-setting-item__actions
        img.organization-setting-item__actions__visual(
          v-if="image"
          :src="image"
        )
        slot(name="actions")

    .organization-setting-item__content
      v-layout(row wrap)
        v-flex(
          :class="[{'xs11': isSetUp !== null}, {'offset-xs1': isSetUp !== null}, {'xs12': isSetUp === null}]"
        )
          transition(name="slide")
            .organization-setting-item__content-container(
              v-show="editing"
            )
              slot(name="content")

    .organization-setting-item__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )
</template>

<script>
export default {
  name: 'setting-item',
  props: {
    isSetUp: {
      type: Boolean,
      required: false
    },
    title: {
      type: String
    },
    description: {
      type: String
    },
    loading: {
      type: Boolean,
      default: false
    },
    editing: {
      type: Boolean,
      default: false
    },
    image: {
      type: String,
      required: false
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .organization-setting-item {
    padding: 38px 32px;
    position: relative;

    &__status-icon-container {
      text-align: center;
    }

    &__status-icon {
      color: $gray-light;
    }

    &__title {
      font-family: Fira Sans;
      font-style: normal;
      font-weight: bold;
      font-size: 20px;
      line-height: 24px;
      color: $text-dark;
    }

    &__description {
      font-family: Source Sans Pro;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 18px;
      color: $text-medium;
      margin-top: 10px;
    }

    &__actions {
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      &__visual {
        width: 90px;
        margin: 12px auto 12px 80px;
      }
    }

    &__content-container {
      padding: 20px 0;
    }

    &--set-up {
      .organization-setting-item__status-icon {
        color: $green-medium;
      }
    }

    &__loading-indicator {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(255, 255, 255, 0.6);
    }

    .slide-enter-active {
      transition: all 0.15s;
      transition-timing-function: cubic-bezier(.25,.8,.5,1);
    }

    .slide-leave-active {
      transition: all 0.15s;
      transition-timing-function: cubic-bezier(.25,.8,.5,1);
    }

    .slide-enter-to, .slide-leave {
      max-height: 320px;
      overflow: hidden;
    }

    .slide-enter, .slide-leave-to {
      max-height: 0;
      overflow: hidden;
    }
  }

</style>
