<template lang="pug">
  div
    v-layout.header-section(row wrap)
      h3.small-heading.py-3
        | {{ $t(' organization.bandwidthLimitation ') }}

      base-switch(
        data-test="enable-switch",
        color="deep-purple lighten-2",
        v-model="enableBandwidthLimitation"
      )
    .form-card.round(:class="{ disabled: !enableBandwidthLimitation }" disabled="!enableBandwidthLimitation" )
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
    bandwidthLimited: {
      type: Boolean,
      default: false
    },
    uploadBandwidthLimit: {
      type: Number,
      default: 100 * 1024
    },
    downloadBandwidthLimit: {
      type: Number,
      default: 100 * 1024
    }
  },
  mounted () {
    this.getData()
  },
  data () {
    return {
      enableBandwidthLimitation: false,
      download: `100 ${this.$t('general.units.kiloBits')}/${this.$t('general.units.second')}`,
      downloadValue: 100 * 1024,
      upload: `100 ${this.$t('general.units.kiloBits')}/${this.$t('general.units.second')}`,
      uploadValue: 100 * 1024,
      sliderValues: [
        { value: 100 * 1024, text: `100 ${this.$t('general.units.kiloBits')}/${this.$t('general.units.second')}` },
        { value: 250 * 1024, text: `250 ${this.$t('general.units.kiloBits')}/${this.$t('general.units.second')}` },
        { value: 500 * 1024, text: `500 ${this.$t('general.units.kiloBits')}/${this.$t('general.units.second')}` },
        { value: 750 * 1024, text: `750 ${this.$t('general.units.kiloBits')}/${this.$t('general.units.second')}` },
        { value: 1 * 1024 * 1024, text: `1 ${this.$t('general.units.megaBits')}/${this.$t('general.units.second')}` },
        { value: 2 * 1024 * 1024, text: `2 ${this.$t('general.units.megaBits')}/${this.$t('general.units.second')}` },
        { value: 5 * 1024 * 1024, text: `5 ${this.$t('general.units.megaBits')}/${this.$t('general.units.second')}` },
        { value: 10 * 1024 * 1024, text: `10 ${this.$t('general.units.megaBits')}/${this.$t('general.units.second')}` }
      ]
    }
  },
  watch: {
    enableBandwidthLimitation () {
      this.makeParams()
    },
    bandwidthLimited () {
      this.getData()
    },
    uploadBandwidthLimit () {
      this.getData()
    },
    downloadBandwidthLimit () {
      this.getData()
    }
  },
  methods: {
    getData () {
      this.enableBandwidthLimitation = this.bandwidthLimited
      this.downloadValue = this.downloadBandwidthLimit || 100 * 1024
      this.uploadValue = this.uploadBandwidthLimit || 100 * 1024
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
        download_bandwidth_limit: this.downloadValue,
        upload_bandwidth_limit: this.uploadValue,
        bandwidth_limited: this.enableBandwidthLimitation
      }
      this.$emit('change', data)
    }
  },
  computed: {
    sliderOptions () {
      return {
        data: this.sliderValues.map(item => item.text),
        disabled: !this.enableBandwidthLimitation
      }
    }
  }
}
</script>
