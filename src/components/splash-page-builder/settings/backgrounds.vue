<template lang="pug">
  .sub-panel(@click="onSubpanelClick")
    label {{$t('builder.selectBackgroundType')}}
    v-radio-group(v-model="pageConfig.background.backgroundType")
      v-radio(label="Image", value="image")
      v-radio(label="Solid Color", value="color")
      v-radio(label="Gradient", value="gradient")
    .select-background-color(v-if="pageConfig.background.backgroundType == 'color'")
      label {{$t('builder.selectColor')}}
      color-selector(ref="colorSelector", :page-config="pageConfig")
    .select-background(v-if="pageConfig.background.backgroundType == 'image'")
      label {{$t('builder.selectImage')}}
      img.mt-2(:src="computedBackgroundUrl" :style="{'width': '100%'}" v-if="computedBackgroundUrl")
      v-checkbox.upload-mode(:label="$t('builder.uploadDifferentImage')", v-model="pageConfig.background.backgrounds.useDifferentImage", hide-details)
      v-btn.choose-image(color="primary" @click="showMediaLibrary = true") {{$t('builder.chooseBackground')}}
      backgroundOptions(:config="pageConfig.background")
    .select-background-gradient(v-if="pageConfig.background.backgroundType == 'gradient'")
      label {{ $t('builder.selectGradient') }}
      gradient(:config="pageConfig.background.gradient")
    media-library-dialog(
      v-if="showMediaLibrary"
      :show="showMediaLibrary"
      :media-type="'image'"
      @close="showMediaLibrary = false"
      @select="selectedMedia"
    )
</template>

<script>
import mediaLibraryDialog from '@/components/common/media-library/media-library-dialog'
import colorSelector from './color-selector'
import backgroundOptions from './background-options/index'
import gradient from './gradient/index'

export default {
  props: ['pageConfig', 'devices', 'windowSize'],
  components: {
    mediaLibraryDialog,
    colorSelector,
    backgroundOptions,
    gradient
  },
  data () {
    return {
      showMediaLibrary: false
    }
  },
  computed: {
    computedBackgroundUrl () {
      const backgroundUrl = this.pageConfig.background.backgrounds[this.windowSize]
      return backgroundUrl.replace(/VUE_APP_STATIC_CDN/g, process.env.VUE_APP_STATIC_CDN)
    },
    largestImage () {
      let image = ''
      // this.devices.reverse().map(device => {
      //   if (this.pageConfig.background.backgrounds[device]) {
      //     largestImage = this.pageConfig.background.backgrounds[device]
      //   }
      // })
      return image
    }
  },
  methods: {
    selectedMedia (file) {
      if (this.pageConfig.background.backgrounds.useDifferentImage) {
        this.pageConfig.background.backgrounds[this.windowSize] = file.url
        this.devices.map(device => {
          if (!this.pageConfig.background.backgrounds[device]) {
            this.pageConfig.background.backgrounds[device] = this.largestImage
          }
        })
      } else {
        this.devices.map(device => {
          this.pageConfig.background.backgrounds[device] = file.url
        })
      }
      this.showMediaLibrary = false
    },
    onSubpanelClick (e) {
      if (this.pageConfig.background.backgroundType === 'color' && !e.target.closest('.color-picker') && !e.target.closest('.vc-sketch')) {
        this.$nextTick(() => {
          this.$refs.colorSelector.showColorView = false
        })
      }
    }
  }
}
</script>
<style lang="scss">
  .page-builder {
    .upload-mode {
      height: 80px;

      label {
        height: auto !important;
        margin-top: 0px !important;
        white-space: normal !important;
      }

      .input-group__details {
        height: 0px;
      }
    }
  }
</style>
