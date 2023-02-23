<template lang="pug">
  .log-content
    img(:src="computedImgSrc" :style="{'width': '100%'}" v-if="selectedItem.config.src")
    v-btn(color="primary" @click="showMediaLibrary = true") {{$t('builder.chooseLogo')}}
    media-library-dialog(
      v-if="showMediaLibrary"
      :show="showMediaLibrary"
      :media-type="'image'"
      @close="showMediaLibrary = false"
      @select="onSelectLogo"
    )
</template>
<script>
import mediaLibraryDialog from '@/components/common/media-library/media-library-dialog'
export default {
  props: ['selectedItem'],
  components: {
    mediaLibraryDialog
  },
  data () {
    return {
      showMediaLibrary: false,
      dimension: 154
    }
  },
  computed: {
    computedImgSrc () {
      return this.selectedItem.config.src.replace(/VUE_APP_STATIC_CDN/g, process.env.VUE_APP_STATIC_CDN)
    }
  },
  methods: {
    onSelectLogo (file) {
      let width = this.dimension.toFixed(1) + 'px'
      let height = this.dimension.toFixed(1) + 'px'
      if (file.width && file.height) {
        if (file.width >= file.height) {
          height = 'auto'
        } else {
          width = 'auto'
        }
      } else {
        height = 'auto'
      }
      this.selectedItem.config.src = file.url
      this.selectedItem.config.width = width
      this.selectedItem.config.height = height
      this.showMediaLibrary = false
      this.$emit('logo-changed')
    }
  }
}
</script>
