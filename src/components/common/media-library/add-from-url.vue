<template lang="pug">
  .add-from-url-uploader
    v-layout.loading-layout(v-if="uploadingUrl")
      v-progress-circular(:size="50" indeterminate color="primary")
    v-layout
      v-flex(xs12 md8)
        label {{$t('general.addImageUrl')}}
        base-text-input.base-text-input(
          data-test="upload-url"
          :placeholder="$t('general.sampleImgUrl')"
          v-model="url"
          @input="onInputUrl"
          @blur="$v.url.$touch()"
        )
        div.add-from-url-uploader__invalid-reason(
          v-for="err in urlErrors"
        ) {{ err }}
      v-flex(xs4, offset-xs4 md4 offset-md0)
        base-button(
          v-if="hasPermission('media_library__create', selectedOrganization.id)"
          data-test="btn-upload-url"
          class="base-button--green btn-upload-url"
          :disabled="!isValidImage"
          @click="uploadUrl"
        ) {{$t("general.addToMediaLib")}}
    .preview-img-container(
      v-if="url"
    )
      label {{$t('general.imgPrview')}}
      .preview-img(
        :class="[{ 'no-square-bg': isNoTransparentBg(url) }]"
      )
        .image-wrapper
          img(
            :src="url"
            @load="onImageLoad"
          )
</template>

<script>
import WrongMessage from './media-library-wrong-dialog'
import { required } from 'vuelidate/lib/validators'
import BaseButton from '../../v2/base-button/base-button'
import BaseTextInput from '../../v2/base-text-input/base-text-input'
import { mapGetters } from 'vuex'
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  props: ['uploadingUrl', 'isUploadingSuccess'],
  components: {
    WrongMessage,
    BaseButton,
    BaseTextInput
  },
  mixins: [
    UserPermissionsMixin
  ],
  validations: {
    url: {
      required
    }
  },
  watch: {
    isUploadingSuccess (v) {
      if (v) {
        this.url = ''
      }
    },
    url (v) {
      this.isValidImage = false
    }
  },
  data () {
    return {
      imageMaxSize: 2097152,
      videoMaxSize: 2097152,
      maxFileNameLength: 64,
      message: '',
      url: '',
      options: {
        method: 'GET',
        mode: 'cors',
        cache: 'default'
      },
      fileInfo: {
        height: 0,
        name: '',
        width: 0,
        type: '',
        dataURL: null
      },
      file: null,
      urlError: '',
      uploadFileCount: 0,
      isValidImage: false
    }
  },
  computed: {
    ...mapGetters('layout', ['selectedOrganization']),
    urlErrors () {
      const errors = []
      if (!this.$v.url.$dirty) return errors
      if (!this.$v.url.required) {
        errors.push(this.$t('media.urlRequired'))
        return errors
      }
      if (this.urlError) {
        errors.push(this.urlError)
        return errors
      }
      return errors
    }
  },
  methods: {
    onImageLoad () {
      this.isValidImage = true
    },
    uploadUrl () {
      this.$emit('upload', this.url)

      EventTracker.sendEvent(EVENT_NAMES.MEDIA_ASSET_URL_UPLOADED)
    },
    onInputUrl () {
      this.urlError = ''
    },
    isNoTransparentBg (fileName) {
      var patt = /([^/]*)\.(jpg|jpeg|tiff)$/i
      var result = patt.exec(fileName)
      return !!result
    }
  }
}
</script>

<style lang="scss">
  @import "styles/v2/colors.scss";

  .add-from-url-uploader {
    &__invalid-reason {
      font-family: Fira Sans;
      font-style: italic;
      font-weight: normal;
      font-size: 14px;
      line-height: 22px;
      color: $blue-reserve;
    }

    .loading-layout {
      position: absolute;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
      background: #f8fafc;
      z-index: 9999;
      opacity: .5;
    }
    .v-tabs {
      margin-bottom: 10px;
    }
    label {
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 24px;
      display: flex;
      align-items: center;
      color: $text-medium;
    }
    .btn-upload-url {
      margin-top: 20px;
      width: calc(100% - 19px);
      margin-left: 19px;
    }
    .base-text-input input{
      padding: 9px 13px;
    }
    .preview-img-container {
      margin-top: 25px;

      .preview-img {
        display: inline-flex;
        background-image: url('~@/assets/images/pattern-bg.png');
        background-repeat: repeat;
        .image-wrapper {
          background: linear-gradient(180deg, rgba(#EFF3F8, 0.4) 0%, rgba(#CED8E6, 0.4) 100%);
          position: relative;
          img {
            max-width: 185px;
            max-height: 185px;
          }
        }
        &.no-square-bg {
          background: none;
          .image-wrapper {
            background: none;
            overflow: hidden;
            img {
              width: 185px;
              max-height: unset;
            }
          }
        }
      }
    }
  }
</style>
