<template lang="pug">
  .option-type
    label.option-label {{ $t('builder.fontWeight') }}
    multiselect.mt-1(
      v-model="selectedWeight",
      label="text",
      :options="weights",
      :show-labels="false",
      :placeholder="$t('builder.selectFontWeight')",
      @input="changeWeight"
    )
</template>

<script>
export default {
  props: {
    selectedItem: {
      type: Object,
      required: true
    },
    configKey: {
      type: String,
      default: 'fontWeight'
    }
  },
  data () {
    return {
      selectedWeight: {
        text: '400 - Normal',
        value: 400
      },
      weights: [
        {
          text: '100 - Thin',
          value: 100
        },
        {
          text: '200 - Extra Light',
          value: 200
        },
        {
          text: '300 - Light',
          value: 300
        },
        {
          text: '400 - Normal',
          value: 400
        },
        {
          text: '500 - Medium',
          value: 500
        },
        {
          text: '600 - Semibold',
          value: 600
        },
        {
          text: '700 - Bold',
          value: 700
        },
        {
          text: '800 - Extra Bold',
          value: 800
        },
        {
          text: '900 - Black',
          value: 900
        }
      ]
    }
  },
  methods: {
    changeWeight (val) {
      this.selectedItem.config[this.configKey] = val.value
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
