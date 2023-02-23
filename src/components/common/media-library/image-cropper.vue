<template lang="pug">
    // new group modal
    base-dialog(
      :show="show"
      @close="close"
      max-width="900"
      scrollable
    )
      .image-cropper(data-test="image-cropper")
        h2.step-heading.mb-2 {{ $t('media.imageCropper') }}
        v-layout(row)
          v-flex(xs12)
            .cropper-editor
              vue-cropper(
                ref="cropper"
                :guides="true"
                :view-mode="1"
                :src="data.original_url || data.url"
                alt="Source Image"
                :img-style="{ 'width': '820px', 'height': '500px' }"
              )
              .cropper-editor__loading-indicator(v-if="isUploading")
                v-progress-circular(:size="50" indeterminate color="primary")

        v-layout(row wrap pt-3)
          v-flex(xs12)
            .crop-control(data-test="crop-control")
              v-btn-toggle.crop-item-group
                v-tooltip(top color="white")
                  v-btn.crop-item(color="success" data-test="btn-move" slot="activator" @click="$refs.cropper.setDragMode('move')")
                    v-icon.crop-icon fas fa-arrows-alt
                  span {{ $t('media.move') }}
                v-tooltip(top color="white")
                  v-btn.crop-item(color="success" data-test="btn-crop" slot="activator" @click="$refs.cropper.setDragMode('crop')")
                    v-icon.crop-icon fas fa-crop
                  span {{ $t('media.crop') }}
              v-btn-toggle.crop-item-group
                v-tooltip(top color="white")
                  v-btn.crop-item(color="success" data-test="btn-desktop" slot="activator" @click="$refs.cropper.setAspectRatio(1919 / 1081)")
                    v-icon.crop-icon fas fa-desktop
                  span {{ $t('media.desktop') }}
                v-tooltip(top color="white")
                  v-btn.crop-item(color="success" data-test="btn-tablet" slot="activator" @click="$refs.cropper.setAspectRatio(768 / 1024)")
                    v-icon.crop-icon fas fa-tablet-alt
                  span {{ $t('media.tablet') }}
                v-tooltip(top color="white")
                  v-btn.crop-item(color="success" data-test="btn-mobile" slot="activator" @click="$refs.cropper.setAspectRatio(414 / 736)")
                    v-icon.crop-icon fas fa-mobile-alt
                  span {{ $t('media.mobile') }}
                v-tooltip(top color="white")
                  v-btn.crop-item(color="success" data-test="btn-free" slot="activator" @click="$refs.cropper.setAspectRatio(null)")
                    v-icon.crop-icon fas fa-compress
                  span {{ $t('media.free') }}

              v-btn-toggle.crop-item-group
                v-tooltip(top color="white")
                  v-btn.crop-item(color="success" data-test="btn-arrow-left" slot="activator" @click="$refs.cropper.move(-10, 0)")
                    v-icon.crop-icon fas fa-arrow-left
                  span {{ $t('media.moveLeft') }}
                v-tooltip(top color="white")
                  v-btn.crop-item(color="success" data-test="btn-arrow-right" slot="activator" @click="$refs.cropper.move(10, 0)")
                    v-icon.crop-icon fas fa-arrow-right
                  span {{ $t('media.moveRight') }}
                v-tooltip(top color="white")
                  v-btn.crop-item(color="success" data-test="btn-arrow-up" slot="activator" @click="$refs.cropper.move(0, -10)")
                    v-icon.crop-icon fas fa-arrow-up
                  span {{ $t('media.moveTop') }}
                v-tooltip(top color="white")
                  v-btn.crop-item(color="success" data-test="btn-arrow-down" slot="activator" @click="$refs.cropper.move(0, 10)")
                    v-icon.crop-icon fas fa-arrow-down
                  span {{ $t('media.moveBottom') }}

              v-btn-toggle.crop-item-group
                v-tooltip(top color="white")
                  v-btn.crop-item(color="success" data-test="btn-rotate" slot="activator" @click="$refs.cropper.rotate(-45)")
                    v-icon.crop-icon fas fa-undo
                  span {{ $t('media.rotateRevert45') }}
                v-tooltip(top color="white")
                  v-btn.crop-item(color="success" data-test="btn-rotate-revert" slot="activator" @click="$refs.cropper.rotate(45)")
                    v-icon.crop-icon fas fa-redo
                  span {{ $t('media.rotate45') }}

              v-btn-toggle.crop-item-group
                v-tooltip(top color="white")
                  v-btn.crop-item(color="success" data-test="btn-scale-x" slot="activator" @click="cropScaleX()")
                    v-icon.crop-icon fas fa-arrows-alt-h
                  span {{ $t('media.scaleX') }}
                v-tooltip(top color="white")
                  v-btn.crop-item(color="success" data-test="btn-scale-y" slot="activator" @click="cropScaleY()")
                    v-icon.crop-icon fas fa-arrows-alt-v
                  span {{ $t('media.scaleY') }}

              v-btn-toggle.crop-item-group
                v-tooltip(top color="white")
                  v-btn.crop-item(color="success" data-test="btn-reset" slot="activator" @click="$refs.cropper.reset()")
                    v-icon.crop-icon fas fa-sync-alt
                  span {{ $t('media.reset') }}
              v-btn(
                data-test="btn-crop-image"
                color="success"
                large
                round
                outline
                @click="cropImage"
              ) {{ $t('media.crop') }}
</template>

<script>
import VueCropper from 'vue-cropperjs'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'ImageCropper',
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          original_url: '',
          url: ''
        }
      }
    },
    show: {
      type: Boolean,
      default: false
    },
    isUploading: {
      type: Boolean,
      default: false
    }
  },
  components: {
    VueCropper
  },
  data () {
    return {
      aspectRatio: null,
      scaleX: -1,
      scaleY: -1
    }
  },
  methods: {
    cropScaleX () {
      this.$refs.cropper.scaleX(this.scaleX)
      this.scaleX = this.scaleX === -1 ? 1 : -1
    },
    cropScaleY () {
      this.$refs.cropper.scaleY(this.scaleY)
      this.scaleY = this.scaleY === -1 ? 1 : -1
    },
    cropReset () {
      this.$refs.cropper.reset()
      this.scaleX = -1
      this.scaleY = -1
    },
    close () {
      this.$emit('close')
    },
    cropImage () {
      const scale = this.$refs.cropper.getData()
      this.$refs.cropper.getCroppedCanvas().toBlob((blob) => {
        let payload = {
          id: this.data.id,
          name: this.data.name,
          cropped_size: blob.size,
          content_type: blob.type,
          asset_type: this.data.asset_type,
          cropped_width: parseInt(scale.width, 10),
          cropped_height: parseInt(scale.height, 10),
          scale
        }
        this.$emit('crop', blob, payload)
      })

      EventTracker.sendEvent(EVENT_NAMES.MEDIA_ASSET_CROPPED)
    }
  }
}
</script>
<style lang="scss">
.cropper-editor {
  width: 820px;
  height: 500px;

  &__loading-indicator {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.6);
  }
}
.crop-control {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .crop-item-group {
    .crop-item {
      opacity: 1 !important;
      width: 40px !important;
      .crop-icon {
        color: #fff !important;
        font-size: 15px;
      }
    }
  }
}

</style>
