<template lang="pug">
  .option-type.my-2
    label.option-label {{ $t('builder.size')}}
    multiselect.mt-1(
      v-model="selectedSize",
      label="text",
      :options="sizes",
      :show-labels="false",
      placeholder="",
      @input="changeSize"
    )
</template>

<script>
export default {
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      selectedSize: {
        text: this.config.backgroundSize,
        value: this.config.backgroundSize
      },
      sizes: [
        {
          text: 'auto',
          value: 'auto'
        },
        {
          text: 'cover',
          value: 'cover'
        },
        {
          text: 'contain',
          value: 'contain'
        }
      ]
    }
  },
  methods: {
    changeSize (val) {
      this.config.backgroundSize = val.value
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/colors.scss";
@import "styles/v2/colors.scss";

.alignment-buttons {
  display: flex;
  width: 100%;

  .align-button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 2px;
    background: white;
    padding: 5px;
    border: 1px solid $gray-xlight;

    .v-icon {
      color: #9ba9c4;
      font-size: 20px;
    }

    &.active {
      border: 1px solid #4b83f0;

      .v-icon {
        color: #4b83f0;
      }
    }
  }
}
</style>
