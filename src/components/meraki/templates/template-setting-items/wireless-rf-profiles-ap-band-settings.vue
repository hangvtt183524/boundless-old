<template lang="pug">
  .wireless-rf-profiles-ap-band-settings
    v-layout(row wrap).wireless-rf-profiles-ap-band-settings__row
      v-flex(xs6 md4 lg3 xl2)
        label {{ $t('v2.merakiTemplates.operationMode') }}
      v-flex(xs6 md4 lg3 xl2)
        base-select(
          :items="operationModes"
          :value="value.bandOperationMode"
          @input="onFieldInput('bandOperationMode', $event)"
          :validations="{ required: true }"
          :show-validation-state="showFieldValidationState"
          :disabled="isFixed"
        )

    v-layout(row wrap).wireless-rf-profiles-ap-band-settings__row(
      v-show="value.bandOperationMode === 'dual'"
    )
      v-flex(xs6 md4 lg3 xl2)
        label {{ $t('v2.merakiTemplates.bandSteeringEnabled') }}
      v-flex(xs6 md4 lg3 xl2)
        base-switch(
          :value="value.bandSteeringEnabled"
          @input="onFieldInput('bandSteeringEnabled', $event)"
          :disabled="isFixed"
        )

</template>

<script>
import BaseSelect from '@/components/v2/base-select/base-select'
import BaseSwitch from '@/components/v2/base-switch/base-switch'

export default {
  name: 'wireless-rf-profiles-ap-band-settings',
  components: { BaseSelect, BaseSwitch },
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
      operationModes: [
        {
          key: 'dual',
          name: this.$t('v2.merakiTemplates.dualBand')
        },
        {
          key: '5ghz',
          name: this.$t('v2.merakiTemplates.5BandOnly')
        },
        {
          key: '2.4ghz',
          name: this.$t('v2.merakiTemplates.24BandOnly')
        }
      ]
    }
  },
  methods: {
    onFieldInput (field, value) {
      this.$emit('input', {
        ...this.value,
        [field]: value
      })
    }
  }
}
</script>

<style scoped lang="scss">
  @import "styles/v2/colors.scss";

  .wireless-rf-profiles-ap-band-settings {
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
