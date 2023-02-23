<template lang="pug">
  .file-uploader(:class="{'multi-completed': isMultiCompleted}")
    v-card(
      v-if="hasPermission('media_library__create', selectedOrganization.id)"
      flat
    )
      .dropzone(ref="dropzoneElement" id="dropzone")
      button#fileUploadTrigger
    wrong-message(:show="showWrongMessage" :message="message" @close="showWrongMessage = false")
</template>

<script>
import Dropzone from 'dropzone'
import WrongMessage from './media-library-wrong-dialog'
import Ls from '@/services/ls'
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import { mapGetters } from 'vuex'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

const API_URL = process.env.VUE_APP_API_URL

export default {
  props: ['isFinihedMultiUploading'],
  components: {
    WrongMessage
  },
  mixins: [
    UserPermissionsMixin
  ],
  mounted () {
    const orgId = this.$route.params.orgId
    const vm = this
    let uploadLimitOptions = {
      upto: 5,
      image: '2 MB',
      video: '2 MB',
      fileSize: '2 MB'
    }

    let options = {
      clickable: '#fileUploadTrigger', // '#file-upload-button',
      url: `${API_URL}/organization/${orgId}/asset/`,
      method: 'post',
      acceptedFiles: '.png, .gif, .jpeg, .jpg, video/*',
      timeout: 100000,
      dictDefaultMessage: `<div class="media-upload-text">
          <img src="${require('@/assets/images/image-avatar.svg')}">
          <h4>${vm.$t('general.fileDragAndDrop')}</h4>
          <h6>${vm.$t('general.smallOr')}</h6>
          <button onclick="clickFileUpload()">${vm.$t('general.browseForUpload')}</button>
          <h5>${vm.$t('general.maxFileSizeAndCount', uploadLimitOptions)}</h5>
        </div>`,
      headers: {
        'Authorization': `Bearer ${Ls.get('auth.token')}`,
        'Accept': 'application/json',
        'Cache-Control': '',
        'X-Requested-With': ''
      },
      autoProcessQueue: true,
      accept (file, done) {
        vm.isMultiCompleted = false
        if (vm.addedFiles.length > 0) {
          vm.addedFiles.map(addedFile => {
            vm.dropzone.removeFile(addedFile)
          })
          vm.addedFiles = []
        }
        const fileType = vm.getFileType(file.type)
        if (fileType === 'image' && file.size > vm.imageMaxSize) {
          done(vm.$t('media.wrongMessage', { type: fileType, size: uploadLimitOptions.image }))
        } else if (fileType === 'video' && file.size > vm.videoMaxSize) {
          vm.message = vm.$t('media.wrongMessage', { type: fileType, size: uploadLimitOptions.video })
          vm.showWrongMessage = true
          vm.dropzone.removeFile(file)
          done(vm.$t('media.wrongMessage', { type: fileType, size: uploadLimitOptions.video }))
        } else if (fileType === 'none') {
          done(vm.$t('media.invalidFile'))
        } else if (file.name.length > vm.maxFileNameLength) {
          done(vm.$t('media.fileNameLength', { size: vm.maxFileNameLength }))
        } else {
          vm.uploadFileCount = vm.uploadFileCount + 1
          done()
        }
      },
      thumbnail (file, dataUrl) {
        file.previewElement.children[0].children[0].src = dataUrl
        vm.addedFiles.push(file)
        if (vm.addedFiles.length > uploadLimitOptions.upto) {
          vm.dropzone.removeAllFiles(true)
          vm.message = vm.$t('media.wrongLimitMessage')
          vm.showWrongMessage = true
          return null
        }
      },
      sending (file, xhr, formData) {
        formData.append('name', file.name)
        formData.append('original_size', file.size)
        formData.append('content_type', file.type)
        const fileType = vm.getFileType(file.type)
        formData.append('asset_type', fileType)
        if (fileType === 'image') {
          formData.append('original_width', 0)
          formData.append('original_height', 0)
        }
      },
      success (file, response) {
        vm.uploadData.push({ file, response })

        EventTracker.sendEvent(EVENT_NAMES.MEDIA_ASSET_FILE_UPLOADED)
      },
      complete () {
        if (vm.uploadData.length && vm.uploadData.length === vm.uploadFileCount) {
          vm.$emit('multiUpload', vm.uploadData)
          vm.$refs.dropzoneElement.style.pointerEvents = 'none'
          vm.uploadData = []
          vm.uploadFileCount = 0
          vm.addedFileCount = 0
        }
      }
    }
    this.dropzone = new Dropzone(this.$refs.dropzoneElement, options)
    window.clickFileUpload = vm.dropzoneUpload

    // Register vanilla javascript click handler for error mark
    this.registerErrorMarkClickHandler()
  },
  destroyed () {
    // Remove the click handler added on component mount
    this.deRegisterErrorMarkClickHandler()
  },
  watch: {
    isFinihedMultiUploading (v) {
      this.isMultiCompleted = v
      if (v) {
        this.$refs.dropzoneElement.style.pointerEvents = 'initial'
      }
    }
  },
  data () {
    return {
      imageMaxSize: 2097152,
      videoMaxSize: 2097152,
      maxFileNameLength: 64,
      showWrongMessage: false,
      message: '',
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
      uploadData: [],
      addedFiles: [],
      uploadFileCount: 0,
      isMultiCompleted: false
    }
  },
  computed: {
    ...mapGetters('layout', ['selectedOrganization'])
  },
  methods: {
    getFileType (type) {
      if (type.includes('image/')) {
        return 'image'
      } else if (type.includes('video/')) {
        return 'video'
      }
      return 'none'
    },
    dropzoneUpload () {
      this.dropzone.hiddenFileInput.click()
    },
    initImageInfo () {
      this.fileInfo = {
        height: 0,
        name: '',
        width: 0,
        type: '',
        dataURL: null
      }
      this.file = null
    },
    onErrorMarkClick (event) {
      if (event.target.className === 'dz-error-mark') {
        // Click on error mark, remove the added files
        this.dropzone.removeAllFiles(true)
      }
    },
    registerErrorMarkClickHandler () {
      this.$el.addEventListener('click', this.onErrorMarkClick)
    },
    deRegisterErrorMarkClickHandler () {
      this.$el.removeEventListener('click', this.onErrorMarkClick)
    }
  }
}
</script>

<style lang="scss">
@import '../../../../node_modules/dropzone/dist/dropzone.css';
@import '../../../styles/v2/colors.scss';

.file-uploader {
  #fileUploadTrigger {
    display: none;
  }
  &.multi-completed {
    .dropzone {
      .dz-preview.dz-processing {
        .dz-progress {
          height: 35px;
          width: 35px;
          border-radius: 50%;
          background-color: #FFF;
          border: 3px solid #ccb508;
          text-align: center;
          &:before {
            background-color: transparent;
            content: '\2713';
            color: #fd3f01;
            font-size: 24px;
            animation: none;
          }
        }
      }
    }
  }
  .dropzone {
    min-height: 100px;
    width: 100%;
    border: 0;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    position: relative;
    margin-bottom: 10px;
    background: $gray-xlight;
    border: 2px dashed #8796B2;
    box-sizing: border-box;

    &.dz-started {
      .dz-message {
        display: none !important;
      }
    }
    .dz-message {
      display: flex;
      font-size: 16px;
      color: #9ba9c4;
      margin: 20px 0px;

      svg {
        margin-right: 10px;
      }

      .media-upload-text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        h4 {
          font-family: Fira Sans;
          font-style: normal;
          font-weight: 600;
          font-size: 16px;
          line-height: 26px;
          text-align: center;
          color: #223D70;
        }

        h5 {
          font-style: normal;
          font-weight: 600;
          font-size: 14px;
          line-height: 18px;
          text-align: center;
          color: $text-medium;
        }

        h6 {
          font-style: normal;
          font-weight: normal;
          font-size: 16px;
          line-height: 20px;
          text-align: center;
          color: $text-medium;
          margin-bottom: 10px;
        }

        button {
          background: #FFFFFF;
          border: 1px solid $blue-medium;
          box-sizing: border-box;
          border-radius: 36px;
          margin-bottom: 17px;
          padding: 0 36px;
          outline: none;

          font-style: normal;
          font-weight: 600;
          font-size: 16px;
          line-height: 36px;
          display: flex;
          align-items: center;
          text-align: center;

          color: $text-medium;

          &:hover {
            border-width: 2px;
            line-height: 34px;
            text-decoration-line: underline;
          }
          &:focus {
            border: 2px solid $blue-medium;
            color: $blue-medium;
            text-decoration-line: underline;
            line-height: 34px;
          }
          &:active {
            border: 2px solid $blue-medium;
            background: $gray-medium;
            color: $text-medium;
            line-height: 34px;
          }
        }

        img {
          width: 54px;
          width: 40px;
          margin-bottom: 35px;
          margin-right: 0px;
          color: rgba(0,0,0,.54);
        }
      }
    }

    .dropzone-loader {
      position: absolute;
      height: 122px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 5;
      background: rgba($white, 0.8)
    }

    &.dz-drag-hover {
      background-color:  #f8fafc;
    }
    .dz-preview.dz-processing {
      span {
        display: none !important;
      }
      .dz-progress,
      .dz-progress:before {
        width: 80px;
        margin: 0 auto;
        left: 0;
        right: 0;
        transition: none;
      }
      .dz-progress {
        background-color: #b3d4fc;
        display: -webkit-flex;
        display: flex;
      }
      .dz-progress:before {
        background-color: #3f51b5;
        content: '';
        -webkit-animation: running-progress 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        animation: running-progress 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      }
      @-webkit-keyframes running-progress {
        0% { margin-left: 0px; margin-right: 100%; }
        50% { margin-left: 25%; margin-right: 0%; }
        100% { margin-left: 100%; margin-right: 0; }
      }
      @keyframes running-progress {
        0% { margin-left: 0px; margin-right: 100%; }
        50% { margin-left: 25%; margin-right: 0%; }
        100% { margin-left: 100%; margin-right: 0; }
      }
    }
    .dz-preview.dz-error {
      .dz-progress {
        display: none !important;
      }
      .dz-error-mark {
        margin: -5px 0 0 -18px;
        z-index: 200;
        pointer-events: all;
        &:before {
          cursor: pointer;
          background-color: #FFF;
          content: '✖';
          color: #fd3f01;
          font-size: 24px;
          animation: none;
          padding: 0 7px;
          border-radius: 50%;
          border: 3px solid #ccb508;
        }
        svg {
          display: none;
        }
      }
    }
  }
}
</style>
