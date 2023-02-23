<template lang="pug">
  .option-type.my-2
    label.option-label {{ $t('builder.direction')}}
    multiselect.mt-1.mb-2(
      v-model="selectedDirection",
      label="text",
      :options="directions",
      :show-labels="false",
      placeholder="",
      @input="changeDirection"
    )
    label.option-label.mt-2 {{ $t('builder.colorStops') }}
    .colorStop.select-option(v-for="(colorStop, index) in config.gradientColors" :key="index", :class="{'focused': focused == index}")
      commonColor.my-1(
        :colorSetting="colorStop",
        @focus="focused = index",
        @blur="focused = -1"
      )
      .input-action(v-if="index > 1", @click="removeColorStop(index)")
        v-icon fa-times-circle
    v-btn.ma-0.mt-2(small, round, color="success", @click="addColorStop") Add More Color Stops
</template>

<script>
import commonColor from '@/components/common/colorPicker'

export default {
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  components: {
    commonColor
  },
  data () {
    return {
      focused: -1,
      selectedDirection: {
        text: this.config.gradientDirection,
        value: this.config.gradientDirection.replace(' ', '-')
      },
      directions: [
        {
          text: 'bottom',
          value: 'bottom'
        },
        {
          text: 'top',
          value: 'top'
        },
        {
          text: 'left',
          value: 'left'
        },
        {
          text: 'right',
          value: 'right'
        },
        {
          text: 'top right',
          value: 'top-right'
        },
        {
          text: 'top left',
          value: 'top-left'
        },
        {
          text: 'bottom left',
          value: 'bottom-left'
        },
        {
          text: 'bottom right',
          value: 'bottom-right'
        }
      ]
    }
  },
  methods: {
    changeDirection (val) {
      this.config.gradientDirection = val.text
    },
    addColorStop () {
      this.config.gradientColors.push({
        rgba: {
          r: 255,
          g: 255,
          b: 255,
          a: 1
        },
        hex: '#ffffff'
      })
    },
    removeColorStop (index) {
      this.config.gradientColors.splice(index, 1)
    }
    // addOption () {
    //   this.selectedItem.config.options.push('')
    // },
    // removeOption (index) {
    //   this.selectedItem.config.options.splice(index, 1)
    // }
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
