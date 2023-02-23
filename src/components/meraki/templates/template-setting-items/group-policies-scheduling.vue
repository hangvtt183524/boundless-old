<template lang="pug">
  .group-policies-scheduling
    v-layout(row wrap).group-policies-scheduling__row
      v-flex(xs6 md4 lg3 xl2)
        label {{ $t('v2.merakiTemplates.schedulingEnabled') }}
      v-flex(xs6 md4 lg3 xl2)
        base-switch(
          :value="value.enabled"
          @input="onFieldInput('enabled', $event)"
          :disabled="isFixed"
        )

    v-layout(row wrap).group-policies-scheduling__row(
      v-show="value.enabled === true"
    )
      v-flex(xs12)
        schedule-item(
          :value="value"
          @input="onScheduleInput($event)"
          :is-fixed="isFixed"
        )

</template>

<script>
import BaseSwitch from '@/components/v2/base-switch/base-switch'
import ScheduleItem from './schedule-item'

export default {
  name: 'group-policies-scheduling',
  components: { BaseSwitch, ScheduleItem },
  props: {
    value: {
      required: true
    },
    isFixed: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onFieldInput (field, value) {
      this.$emit('input', {
        ...this.value,
        [field]: value
      })
    },
    onScheduleInput (value) {
      this.$emit('input', {
        ...value,
        enabled: this.value.enabled
      })
    }
  }
}
</script>

<style scoped lang="scss">
  @import "styles/v2/colors.scss";

  .group-policies-scheduling {
    margin-bottom: 30px;
    padding-bottom: 30px;
    border-bottom: 1px solid $gray-xlight;

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
