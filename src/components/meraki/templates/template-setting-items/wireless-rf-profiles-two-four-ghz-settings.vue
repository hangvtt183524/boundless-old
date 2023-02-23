<template lang="pug">
  .wireless-rf-profiles-two-four-ghz-settings
    .wireless-rf-profiles-two-four-ghz-settings__title
      | {{ $t('v2.merakiTemplates.24GhzSettings') }}

    v-layout(row wrap).wireless-rf-profiles-two-four-ghz-settings__row
      v-flex(xs6 md4 lg3 xl2)
        label {{ $t('v2.merakiTemplates.usedChannels') }}
      v-flex(xs6 md5 lg4 xl3)
        base-multi-select(
          :items="channelOptions"
          :value="value.validAutoChannels"
          @input="onFieldInput('validAutoChannels', $event)"
          :validations="{ required: true }"
          :show-validation-state="showFieldValidationState"
          :disabled="isFixed"
        )

    v-layout(row wrap).wireless-rf-profiles-two-four-ghz-settings__row
      v-flex(xs6 md4 lg3 xl2)
        label {{ $t('v2.merakiTemplates.radioTransmitPowerRange') }}
      v-flex(xs6 md8 lg8 xl8)
        base-slider-input(
          :value="powerRangers"
          :options="powerRangeOptions"
          @input="onPowerRangeInput($event)"
          :disabled="isFixed"
        )

    v-layout(row wrap).wireless-rf-profiles-two-four-ghz-settings__row
      v-flex(xs6 md4 lg3 xl2)
        label {{ $t('v2.merakiTemplates.minimumReceivedPower') }}
      v-flex(xs6 md8 lg8 xl8)
        base-slider-input(
          :value="value.rxsop"
          :options="rxSopOptions"
          @input="onFieldInput('rxsop', $event)"
          :disabled="isFixed"
        )

    v-layout(row wrap).wireless-rf-profiles-two-four-ghz-settings__row
      v-flex(xs6 md4 lg3 xl2)
        label {{ $t('v2.merakiTemplates.minimumBitrate') }}
      v-flex(xs6 md8 lg8 xl8)
        base-slider-input(
          :value="value.minBitrate"
          :options="minimumBitrateOptions"
          @input="onFieldInput('minBitrate', $event)"
          :disabled="isFixed"
        )

    v-layout(row wrap).wireless-rf-profiles-two-four-ghz-settings__row
      v-flex(xs6 md4 lg3 xl2)
        label {{ $t('v2.merakiTemplates.axEnabled') }}
      v-flex(xs6 md4 lg3 xl2)
        base-switch(
          :value="value.axEnabled"
          @input="onFieldInput('axEnabled', $event)"
          :disabled="isFixed"
        )

</template>

<script>
import BaseSelect from '@/components/v2/base-select/base-select'
import BaseSwitch from '@/components/v2/base-switch/base-switch'
import BaseMultiSelect from '@/components/v2/base-multi-select/base-multi-select'
import BaseSliderInput from '@/components/v2/base-slider-input/base-slider-input'

export default {
  name: 'wireless-rf-profiles-two-four-ghz-settings',
  components: { BaseMultiSelect, BaseSelect, BaseSwitch, BaseSliderInput },
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
      channelOptions: [1, 6, 11].map(option => {
        return {
          key: option,
          name: option
        }
      }),
      powerRangeOptions: {
        min: 5,
        max: 30,
        interval: 1
      },
      minimumBitrateOptions: {
        min: 1,
        max: 54,
        marks: [1, 2, 5.5, 6, 9, 11, 12, 18, 24, 36, 48, 54],
        adsorb: true,
        included: true
      },
      rxSopOptions: {
        min: -96,
        max: -65,
        interval: 1
      }
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

  .wireless-rf-profiles-two-four-ghz-settings {
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
