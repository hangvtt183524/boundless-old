<template lang='pug'>
  .untagged-resource-filter
    base-check-box.base-check-box--small(
      :value='value'
      :label="$t('tags.untaggedResourceFilter')"
      v-model='selected'
    )
</template>

<script>
import BaseCheckBox from '../../../v2/base-check-box/base-check-box'
export default {
  name: 'untagged-resource-filter',
  components: { BaseCheckBox },
  props: {
    value: {
      required: true
    }
  },
  data: function () {
    return {
      selected: false,
      initialized: false
    }
  },
  watch: {
    value: function (newVal, oldVal) {
      this.selected = newVal
    },
    selected: function (newVal, oldVal) {
      if (this.initialized) {
        this.$emit('input', this.selected)
      }
    }
  },
  mounted () {
    this.selected = this.value
    this.$nextTick(() => {
      this.initialized = true
    })
  },
  methods: {}
}
</script>

<style lang="scss">
  .untagged-resource-filter {
    display: inline-block;
    vertical-align: middle;
    padding-top: 5px;
    margin-left: 50px;

    .check-box-display {
      margin: 3px;

      .checked-icon {
        color: white !important;
      }
    }

    i {
      transform: rotate(0) !important;
      margin: -3px;
    }
  }
</style>
