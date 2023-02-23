<template lang="pug">
  .view-snapshot(:class="{'view-snapshot--image-ok': url !== null}")
    .view-container
      img.view-snapshot__image(:src="url" v-if="url")
      .view-snapshot__waiting-container(v-if="!url && fetching")
        grid-loader(:loading="true" color="#15AC2F" class="view-spinner")
        .view-snapshot__waiting-label Retrieving snapshot
        .view-snapshot__waiting-description We are trying to connect with your camera. This usually takes around 15 seconds.
      .view-snapshot__no-image-container(v-if="!url && !fetching")
        img(:src="require('../../../assets/images/no-image.svg')")
        .view-snapshot__no-image-description At this time image is not available.

</template>

<script>
import GridLoader from 'vue-spinner/src/GridLoader.vue'

export default {
  name: 'ViewSnapshot',

  props: {
    url: {
      type: String,
      default: '@/assets/images/placeholder.jpg'
    },
    fetching: {
      type: Boolean
    }
  },
  components: {
    GridLoader
  }
}
</script>

<style lang="scss">
@import "../../../styles/v2/colors";

.view-snapshot {
  width: 100%;
  height: 100%;
  max-height: 465px;
  background: white;
  box-shadow: 5px 0px 10px rgba(0, 0, 0, 0.05);

  &--image-ok {
    background: transparent
  }

  .view-container {
    width: 100%;
    height: 100%;
    text-align: center;
  }
  &__image {
    border-radius: 5px;
    max-width: 100%;
    max-height: 100%;
    height: 100%;
    object-fit: cover;
  }
  &__waiting-container {
    padding: 56px;
  }
  .view-spinner {
    margin: 0 auto;
    padding-top: 79px;
  }

  &__waiting-label {
    margin-top: 60px;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 26px;

    letter-spacing: 1px;
    text-transform: uppercase;
    color: #223D70;
  }

  &__waiting-description {
    margin-top: 13px;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 22px;
    color: $text-medium;
  }

  &__no-image-container {
    padding: 56px;

    img {
      margin-top: 95px;
    }
  }
  &__no-image-description {
    margin-top: 42px;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 22px;

    color: $text-medium;
  }
}

</style>
