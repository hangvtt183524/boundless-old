<template lang="pug">
  .warning-box
    .warning-box__title
      | {{ title }}
    .warning-box__box
      .warning-box__box__description(
        v-html="description"
      )
      .warning-box__box__warning
        | {{ subWarning }}

</template>

<script>
export default {
  name: 'acl-warning-fox',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    subWarning: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.warning-box {
  line-height: 20px;
  font-family: Fira Sans;
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  color: $text-medium;
  text-align: center;
  background-color: $warning;
  border: 1px solid $gray-light;
  padding: 8px 10px;

  &__title {
    font-weight: 600;
  }

  &__box {
    margin-top: 5px;
    &__warning {
      margin-top: 5px;
      font-weight: 600;
    }
  }
}

</style>
