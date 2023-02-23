<template lang='pug'>
  v-layout(row wrap)
    // materialDetails row
    v-flex(xs12)
      v-layout(row)
        v-flex(xs12)
          h2.mb-3(v-if="!hideTitle") {{ $t('settings.materialDetails') }}
          p {{ $t('settings.materialDetailsDescription') }}

      v-layout(row wrap)
        v-flex.selection-panel(
          :class="getClass(option)"
          :key="option.type"
          @click="updateData(option.type)"
          ma-1
          v-for="option in importChoices"
        )
          div(v-html="option.label")

</template>
<script>
import DeviceImportMixin from '@/mixins/device-import.mixin'

export default {
  props: {
    value: {
      type: [String, Number],
      required: true
    },
    isBtn: {
      type: Boolean,
      default: false
    },
    hideTitle: {
      type: Boolean,
      default: false
    }
  },
  mixins: [
    DeviceImportMixin
  ],

  computed: {
    importChoices () {
      return [
        {
          type: this.importOptions.manual,
          label: this.$t('organization.createManually'),
          description: this.$t('organization.createManuallyDescription')
        },
        {
          type: this.importOptions.csvXls,
          label: this.$t('organization.importCsvXls'),
          description: this.$t('organization.importCsvXlsDescription')
        },
        {
          type: this.importOptions.vendorApi,
          label: this.$t('organization.importApiVendor'),
          description: this.$t('organization.importApiVendorDescription')
        }
      ]
    }
  },

  methods: {
    getClass (option) {
      return {
        active: this.value === option.type && !this.isBtn,
        'is-btn': this.isBtn
      }
    },
    updateData (value) {
      this.$emit('input', value)
      this.$emit('change')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/components/selection-panel.scss";

.selection-panel ::v-deep {
  min-height: 90px;
  align-items: center;
}
</style>
