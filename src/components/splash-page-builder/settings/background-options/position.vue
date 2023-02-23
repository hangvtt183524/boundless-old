<template lang="pug">
  .option-type.my-2
    label.option-label {{ $t('builder.position')}}
    multiselect.mt-1(
      v-model="selectedPosition",
      label="text",
      :options="positions",
      :show-labels="false",
      placeholder="",
      @input="changePosition"
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
      selectedPosition: {
        text: this.config.backgroundPosition,
        value: this.config.backgroundPosition.replace(' ', '-')
      },
      positions: [
        {
          text: 'left top',
          value: 'left-top'
        },
        {
          text: 'left center',
          value: 'left-center'
        },
        {
          text: 'left bottom',
          value: 'left-bottom'
        },
        {
          text: 'right top',
          value: 'right-top'
        },
        {
          text: 'right center',
          value: 'right-center'
        },
        {
          text: 'right bottom',
          value: 'right-bottom'
        },
        {
          text: 'center top',
          value: 'center-top'
        },
        {
          text: 'center center',
          value: 'center-center'
        },
        {
          text: 'center bottom',
          value: 'center-bottom'
        }
      ]
    }
  },
  methods: {
    changePosition (val) {
      this.config.backgroundPosition = val.text
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
