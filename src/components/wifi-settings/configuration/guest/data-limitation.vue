<template lang="pug">
  div
    v-layout.header-section(row wrap)
      h3.small-heading.py-3
        | {{ $t('organization.dataLimitation') }}

      base-switch(
        data-test="enable-switch",
        color="deep-purple lighten-2",
        v-model="enableDataLimitation"
      )
    .form-card.round(:class="{ disabled: !enableDataLimitation }" disabled="!enableDataLimitation")
      v-layout(row wrap)
        v-flex.slider-display
          label.slider-title {{ $t('general.download') }}
          label.slider-value {{ download }}
        v-flex(xs12)
          slider-wrapper(
            data-test="download-slider"
            :value="download"
            :options="sliderOptions"
            :changeValue="changeDownloadValue"
          )
      v-layout(row wrap mt-5)
        v-flex.slider-display
          label.slider-title {{ $t('general.upload') }}
          label.slider-value {{ upload }}
        v-flex(xs12)
          slider-wrapper(
            data-test="upload-slider"
            :value="upload"
            :options="sliderOptions"
            :changeValue="changeUploadValue"
          )

</template>
<script>
import SliderWrapper from '@/components/common/slider-wrapper'

export default {
  components: {
    SliderWrapper
  },
  props: {
    dataLimited: {
      type: Boolean,
      default: false
    },
    uploadDataLimit: {
      type: Number,
      default: 8 * 1 * 1024 * 1024
    },
    downloadDataLimit: {
      type: Number,
      default: 8 * 1 * 1024 * 1024
    }
  },
  data () {
    return {
      enableDataLimitation: false,
      download: `1 ${this.$t('general.units.megaByte')}`,
      downloadValue: 8 * 1 * 1024 * 1024,
      upload: `1 ${this.$t('general.units.megaByte')}`,
      uploadValue: 8 * 1 * 1024 * 1024,
      sliderValues: [
        { value: 8 * 1 * 1024 * 1024, text: `1 ${this.$t('general.units.megaByte')}` },
        { value: 8 * 5 * 1024 * 1024, text: `5 ${this.$t('general.units.megaByte')}` },
        { value: 8 * 10 * 1024 * 1024, text: `10 ${this.$t('general.units.megaByte')}` },
        { value: 8 * 50 * 1024 * 1024, text: `50 ${this.$t('general.units.megaByte')}` },
        { value: 8 * 100 * 1024 * 1024, text: `100 ${this.$t('general.units.megaByte')}` },
        { value: 8 * 250 * 1024 * 1024, text: `250 ${this.$t('general.units.megaByte')}` },
        { value: 8 * 500 * 1024 * 1024, text: `500 ${this.$t('general.units.megaByte')}` },
        { value: 8 * 1 * 1024 * 1024 * 1024, text: `1 ${this.$t('general.units.gigaByte')}` },
        { value: 8 * 2 * 1024 * 1024 * 1024, text: `2 ${this.$t('general.units.gigaByte')}` },
        { value: 8 * 5 * 1024 * 1024 * 1024, text: `5 ${this.$t('general.units.gigaByte')}` },
        { value: 8 * 10 * 1024 * 1024 * 1024, text: `10 ${this.$t('general.units.gigaByte')}` }
      ]
    }
  },
  mounted () {
    this.getData()
  },
  watch: {
    enableDataLimitation () {
      this.makeParams()
    },
    dataLimited () {
      this.getData()
    },
    uploadDataLimit () {
      this.getData()
    },
    downloadDataLimit () {
      this.getData()
    }
  },
  methods: {
    getData () {
      this.enableDataLimitation = this.dataLimited
      this.downloadValue = this.downloadDataLimit || 8 * 1 * 1024 * 1024
      this.uploadValue = this.uploadDataLimit || 8 * 1 * 1024 * 1024
      this.download = this.sliderValues.find(item => item.value === this.downloadValue).text
      this.upload = this.sliderValues.find(item => item.value === this.uploadValue).text
    },
    changeDownloadValue (val) {
      this.download = val
      this.downloadValue = this.sliderValues.filter(item => item.text === val)[0].value
      this.makeParams()
    },
    changeUploadValue (val) {
      this.upload = val
      this.uploadValue = this.sliderValues.filter(item => item.text === val)[0].value
      this.makeParams()
    },
    makeParams () {
      const data = {
        download_data_limit: this.downloadValue,
        upload_data_limit: this.uploadValue,
        data_limited: this.enableDataLimitation
      }
      this.$emit('change', data)
    }
  },
  computed: {
    sliderOptions () {
      return {
        data: this.sliderValues.map(item => item.text),
        disabled: !this.enableDataLimitation
      }
    }
  }
}
</script>
