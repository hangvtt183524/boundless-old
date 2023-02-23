<template lang="pug">
  v-layout.option-type(row).text-xs-center.wrap.row
    label.option-label {{ $t('builder.placeholderOpacity') }}
    .input-inline-group.mt-1
      multiselect(
        v-model="selectedOpacity",
        label="text",
        :options="opacities",
        @input="changeOpacity()"
        placeholder=""
        :show-labels="false"
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
      default: 'placeholderOpacity'
    }
  },
  data () {
    return {
      padding: null,
      selectedOpacity: null,
      opacities: [
        {
          text: '0.5',
          value: 0.5
        },
        {
          text: '0.6',
          value: 0.6
        },
        {
          text: '0.7',
          value: 0.7
        },
        {
          text: '0.8',
          value: 0.8
        },
        {
          text: '0.9',
          value: 0.9
        },
        {
          text: '1.0',
          value: 1
        }
      ]
    }
  },
  created () {
    this.initSetItem()
  },
  methods: {
    initSetItem () {
      const placeholderOpacity = this.selectedItem.config[this.configKey]

      this.selectedOpacity = this.opacities.find(opacity => opacity.value === placeholderOpacity)
    },
    changeOpacity () {
      this.selectedItem.config[this.configKey] = this.selectedOpacity.value
    }
  }
}
</script>

<style lang="scss" scoped>
.input-inline-group {
  width: 100%;
  position: relative;
}
</style>
