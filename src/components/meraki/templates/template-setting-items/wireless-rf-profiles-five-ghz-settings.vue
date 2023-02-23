<template lang="pug">
  .wireless-rf-profiles-five-ghz-settings
    .wireless-rf-profiles-five-ghz-settings__title
      | {{ $t('v2.merakiTemplates.5GhzSettings') }}

    v-layout(row wrap).wireless-rf-profiles-five-ghz-settings__row
      v-flex(xs6 md4 lg3 xl2)
        label {{ $t('v2.merakiTemplates.channelWidth') }}
      v-flex(xs6 md2 lg2 xl1)
        base-select(
          :items="channelWidthOptions"
          :value="value.channelWidth"
          @input="onFieldInput('channelWidth', $event)"
          :validations="{ required: true }"
          :show-validation-state="showFieldValidationState"
          :disabled="isFixed"
        )

    v-layout(row wrap).wireless-rf-profiles-five-ghz-settings__row
      v-flex(xs6 md4 lg3 xl2)
        label {{ $t('v2.merakiTemplates.usedChannels') }}
      v-flex(xs6 md8 lg9 xl10)
        base-multi-select(
          :items="channelOptions"
          :value="value.validAutoChannels"
          @input="onFieldInput('validAutoChannels', $event)"
          :validations="{ required: true }"
          :show-validation-state="showFieldValidationState"
          :search-enabled="false"
          :disabled="isFixed"
        )

    v-layout(row wrap).wireless-rf-profiles-five-ghz-settings__row
      v-flex(xs6 md4 lg3 xl2)
        label {{ $t('v2.merakiTemplates.radioTransmitPowerRange') }}
      v-flex(xs6 md8 lg8 xl8)
        base-slider-input(
          :value="powerRangers"
          :options="powerRangeOptions"
          @input="onPowerRangeInput($event)"
          :disabled="isFixed"
        )

    v-layout(row wrap).wireless-rf-profiles-five-ghz-settings__row
      v-flex(xs6 md4 lg3 xl2)
        label {{ $t('v2.merakiTemplates.minimumReceivedPower') }}
      v-flex(xs6 md8 lg8 xl8)
        base-slider-input(
          :value="value.rxsop"
          :options="rxSopOptions"
          @input="onFieldInput('rxsop', $event)"
          :disabled="isFixed"
        )

    v-layout(row wrap).wireless-rf-profiles-five-ghz-settings__row
      v-flex(xs6 md4 lg3 xl2)
        label {{ $t('v2.merakiTemplates.minimumBitrate') }}
      v-flex(xs6 md8 lg8 xl8)
        base-slider-input(
          :value="value.minBitrate"
          :options="minimumBitrateOptions"
          @input="onFieldInput('minBitrate', $event)"
          :disabled="isFixed"
        )

</template>

<script>
import BaseSelect from '@/components/v2/base-select/base-select'
import BaseMultiSelect from '@/components/v2/base-multi-select/base-multi-select'
import BaseSliderInput from '@/components/v2/base-slider-input/base-slider-input'

export default {
  name: 'wireless-rf-profiles-five-ghz-settings',
  components: { BaseMultiSelect, BaseSelect, BaseSliderInput },
  props: {
    value: {
      required: true
    },
    showFieldValidationState: {
      type: Boolean,
      default: false
    },
    isFixed: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      channelOptions: [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136,
        140, 144, 149, 153, 157, 161, 165].map(option => {
        return {
          key: option,
          name: option
        }
      }),
      powerRangeOptions: {
        min: 8,
        max: 30,
        interval: 1
      },
      minimumBitrateOptions: {
        min: 6,
        max: 54,
        marks: [6, 9, 12, 18, 24, 36, 48, 54],
        adsorb: true,
        included: true
      },
      rxSopOptions: {
        min: -96,
        max: -65,
        interval: 1
      },
      channelWidthOptions: [
        {
          key: 'auto',
          name: this.$t('general.auto')
        },
        {
          key: '20',
          name: '20'
        },
        {
          key: '40',
          name: '40'
        },
        {
          key: '80',
          name: '80'
        }
      ]
    }
  },
  computed: {
    powerRangers () {
      return [this.value.minPower, this.value.maxPower]
    }
  },
  methods: {
    onFieldInput (field, value) {
      this.$emit('input', {
        ...this.value,
        [field]: value
      })
    },
    onPowerRangeInput (value) {
      this.$emit('input', {
        ...this.value,
        minPower: value[0],
        maxPower: value[1]
      })
    }
  }
}
</script>

<style scoped lang="scss">
  @import "styles/v2/colors.scss";

  .wireless-rf-profiles-five-ghz-settings {
    &__title {
      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 18px;
      line-height: 26px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: $blue-dark;
    }

    &__row {
      margin-top: 10px;

      label {
        line-height: 40px;
        padding-right: 10px;
        display: block;
      }
    }
  }

</style>
