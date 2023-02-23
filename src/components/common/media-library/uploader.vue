<template lang="pug">
  .uploader(:class="{'multi-completed': isMultiCompleted}")
    v-tabs(
      fixed-tabs
    )
      v-tabs-slider(color="yellow")
      v-tab(href="#tab-1"
        data-test="file-tab") {{$t("media.file")}}
      v-tab(href="#tab-2"
        data-test="url-tab") {{$t("media.url")}}
      v-tab-item(
        key="1"
        value="tab-1"
      )
        v-card(flat)
          .dropzone(ref="dropzoneElement" id="dropzone")
      v-tab-item(
        key="2"
        value="tab-2"
      )
        v-card.url-card(flat)
          v-layout.loading-layout(v-if="uploadingUrl")
            v-progress-circular(:size="50" indeterminate color="primary")
          v-layout.wrap.mb-3
            .form-card.small
              v-flex(xs12)
                v-text-field.url-upload(
                  v-model="url"
                  data-test="upload-url"
                  required
                  :label="$t('general.imageUrl')"
                  @blur="$v.url.$touch()"
                  @input="onInputUrl()"
                  :error-messages="getUrlErrors()"
                )
              v-flex(xs4, offset-xs4)
                v-btn.success(block
                  data-test="btn-upload-url"
                  round
                  :disabled="!url"
                  @click.prevent="getFileData"
                ) {{$t("general.upload")}}
    wrong-message(:show="showWrongMessage" :message="message" @close="showWrongMessage = false")
</template>

<script>
import Dropzone from 'dropzone'
import WrongMessage from './media-library-wrong-dialog'
import Ls from '@/services/ls'
import { required } from 'vuelidate/lib/validators'

const API_URL = process.env.VUE_APP_API_URL

export default {
  props: ['isFinihedMultiUploading', 'uploadingUrl', 'isUploadingSuccess'],
  components: {
    WrongMessage
  },
  validations: {
    url: {
      required
    }
  },
  mounted () {
    const orgId = this.$route.params.orgId
    const vm = this
    let uploadLimitOptions = {
      upto: 5,
      image: '2 MB',
      video: '2 MB'
    }

    let options = {
      url: `${API_URL}/organization/${orgId}/asset/`,
      method: 'post',
      acceptedFiles: '.png, .gif, .jpeg, .jpg, video/*',
      timeout: 100000,
      dictDefaultMessage: `<div class="media-upload-text">
          <i class="fas fa-cloud-upload-alt icon"></i>
          <h4>${vm.$t('general.fileUploadMediaLibrary')}</h4>
          <h5>${vm.$t('general.uploadMediaLibraryLimit', uploadLimitOptions)}</h5>
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
  },
  watch: {
    isFinihedMultiUploading (v) {
      this.isMultiCompleted = v
      if (v) {
        this.$refs.dropzoneElement.style.pointerEvents = 'initial'
      }
    },
    isUploadingSuccess (v) {
      if (v) {
        this.url = ''
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
      urlError: 'test',
      uploadData: [],
      addedFiles: [],
      uploadFileCount: 0,
      isMultiCompleted: false
    }
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
    getFileExtension (type) {
      const extension = type.split('/')[1]
      return extension
    },
    getFileData () {
      this.getMeta(this.url)
      var request = new Request(this.url)
      fetch(request, this.options).then((response) => {
        response.blob().then((res) => {
          if (res.type === 'text/html') {
            this.urlError = this.$t('media.urlError')
            return
          }
          if (res.size > this.imageMaxSize) {
            this.urlError = this.$t('media.wrongMessage', {
              type: this.$t('media.image'),
              size: '2 MB'
            })
            return
          }
          this.fileInfo.name = this.getFilename(this.url) || this.makeFileName(6)
          this.fileInfo.name = `${this.fileInfo.name}.${this.getFileExtension(res.type)}`
          this.fileInfo.type = res.type
          this.file = new File([res], this.fileInfo.name, { type: this.fileInfo.type })
          var reader = new FileReader()
          reader.onload = () => {
            const base64Flag = `data:${this.fileInfo.type};base64,`
            const b64 = reader.result.replace(/^data:.+;base64,/, '')
            this.fileInfo.dataURL = base64Flag + b64
            if (this.fileInfo.width) {
              this.uploadFile()
            }
          }
          reader.readAsDataURL(res)
        }).catch(() => {
          this.urlError = this.$t('media.urlError')
        })
      }).catch((error) => {
        console.error(error)
        this.urlError = this.$t('media.corsError')
      })
    },
    uploadFile () {
      this.file.dataURL = this.fileInfo.dataURL
      this.file.width = this.fileInfo.width
      this.file.height = this.fileInfo.height
      this.$emit('upload', this.file)
      this.initImageInfo()
    },
    getMeta (url) {
      var img = new Image()
      img.addEventListener('load', (imgInfo) => {
        this.fileInfo.width = imgInfo.path[0].naturalWidth
        this.fileInfo.height = imgInfo.path[0].naturalHeight
        if (this.fileInfo.dataURL) {
          this.uploadFile()
        }
      })
      img.src = url
    },
    getFilename (url) {
      if (url) {
        const m = url.toString().match(/.*\/(.+?)\./)
        if (m && m.length > 1) {
          return m[1]
        }
      }
      return ''
    },
    makeFileName (length) {
      var fileName = ''
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      const charactersLength = characters.length
      for (var i = 0; i < length; i++) {
        fileName += characters.charAt(Math.floor(Math.random() * charactersLength))
      }
      return fileName
    },
    initImageInfo () {
      this.$v.url.$reset()
      this.fileInfo = {
        height: 0,
        name: '',
        width: 0,
        type: '',
        dataURL: null
      }
      this.file = null
    },
    getUrlErrors () {
      const errors = []
      if (!this.$v.url.$dirty) return errors
      !this.$v.url.required && errors.push(this.$t('media.urlRequired'))
      return errors.length > 0 ? errors : this.urlError
    },
    onInputUrl () {
      this.urlError = ''
      this.$v.url.$reset()
    }
  }
}
</script>

<style lang="scss">
@import '../../../../node_modules/dropzone/dist/dropzone.css';
.uploader {
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
    background: white;
    border: 0;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    position: relative;
    margin-bottom: 10px;
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
          font-weight: 300;
          margin-bottom: 10px;
        }

        h5 {
          font-weight: 300;
        }

        .icon {
          font-size: 20px;
          margin-bottom: 10px;
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
      background: rgba(255, 255 ,255, 0.8)
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
        &:before {
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
  .url-card {
    &.theme--light.v-sheet {
      height: 165px;
      border: 1px solid #d9d9d9;
      .form-card {
        background: #f8fafc;
      }
    }
  }
}
</style>
