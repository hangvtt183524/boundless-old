<template lang="pug">
  .option-type.my-2
    label.option-label {{ $t('builder.repeat')}}
    multiselect.mt-1(
      v-model="selectedRepeat",
      label="text",
      :options="repeats",
      :show-labels="false",
      placeholder="",
      @input="changeRepeat"
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
      selectedRepeat: {
        text: this.config.backgroundRepeat,
        value: this.config.backgroundRepeat
      },
      repeats: [
        {
          text: 'repeat',
          value: 'repeat'
        },
        {
          text: 'repeat-x',
          value: 'repeat-x'
        },
        {
          text: 'repeat-y',
          value: 'repeat-y'
        },
        {
          text: 'no-repeat',
          value: 'no-repeat'
        },
        {
          text: 'round',
          value: 'round'
        },
        {
          text: 'space',
          value: 'space'
        }
      ]
    }
  },
  methods: {
    changeRepeat (val) {
      this.config.backgroundRepeat = val.text
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
