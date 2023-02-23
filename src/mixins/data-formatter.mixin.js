let DataFormatterMixin = {
  methods: {
    dataSizeFormatter (value) {
      const size = Number(value)
      if (!size) return ''

      const kbSize = size / 1024
      if (kbSize < 1024) {
        return `${kbSize.toFixed(1)} ${this.$t('general.units.kiloByte')}`
      }

      const mbSize = kbSize / 1024
      if (mbSize < 1024) {
        return `${mbSize.toFixed(1)} ${this.$t('general.units.megaByte')}`
      }

      const gbSize = mbSize / 1024
      if (gbSize < 1024) {
        return `${gbSize.toFixed(2)} ${this.$t('general.units.gigaByte')}`
      }
    }
  }
}

export default DataFormatterMixin
