<template lang="pug">
  .files-container(data-test="media-container" ref="filesContainer")
    .file-item(v-for="(file, index) in files", data-test="media-item" :class="{'active': isActive(file), 'detail-media': isDetailMedia(file)}", @click="(e) => selectDetailAsset(e, file)")
      .file-item__checkbox-container(
        v-if="multiSelect && !hideAction"
      )
        base-check-box.base-check-box--small(
          data-test="media-item-checkbox"
          :value="!!isActive(file)"
          @click="(e) => selectFile(e, file)"
        )
      .preview-img(
        v-if="file.asset_type === 'image'"
        :class="[{ 'no-square-bg': isNoTransparentBg(file.name) }]"
      )
        .image-wrapper
          img(
            :src="getFileUrl(file)"
          )
      video(controls v-if="file.asset_type === 'video'")
        source(:src="getFileUrl(file)" :type="file.content_type")
      .preview-icon(v-if="file.asset_type === 'none'")
        v-icon fas fa-video
      .file-details
        .file-name-container(:alt="file.name")
          span.file-name {{ getNoExtensionFileName(file.name) }}
          span.file-extension {{ getFileExtension(file.name) }}
        span.file-date(:alt="file.updated_at") {{ $moment(file.updated_at).format('L') }}
        span.file-size {{ getFileSize(file.size) }}
    div.text-xs-center.no-available(data-test="no-available" :style="{'display': !files.length ? 'block' : 'none'}")
      | {{ $t('general.noDataAvailable') }}
</template>

<script>
import { mapGetters } from 'vuex'
import deleteMediaDialog from '@/components/common/media-library/delete-media-dialog'
import BaseCheckBox from '@/components/v2/base-check-box/base-check-box'
import BaseNSwitch from '@/components/v2/base-n-switch/base-n-switch'
import BaseSelect from '@/components/v2/base-select/base-select'
import BaseTable from '@/components/v2/base-table/base-table'

export default {
  components: {
    deleteMediaDialog,
    BaseCheckBox,
    BaseNSwitch,
    BaseSelect,
    BaseTable
  },
  props: {
    multiSelect: {
      type: Boolean,
      default: true
    },
    selectedFiles: {
      type: Array,
      default: () => []
    },
    hideAction: {
      type: Boolean,
      default: false
    },
    detailAsset: {
      type: Object
    }
  },
  data () {
    return {
    }
  },
  mounted () {
    try {
      var vm = this
      var scrollEl = vm.$refs.filesContainer
      if (scrollEl) {
        scrollEl.addEventListener('scroll', function () {
          if (this.scrollTop + this.clientHeight >= this.scrollHeight - 5) {
            vm.onLoadMoreFiles()
          }
        })
      }
    } catch (err) {
      console.log('error', err)
    }
  },
  computed: {
    ...mapGetters('organization/media', ['files'])
  },
  methods: {
    isActive (file) {
      let found = this.selectedFiles.find((f) => f.id === file.id)

      return (found)
    },
    isDetailMedia (file) {
      if (this.detailAsset && this.detailAsset.id === file.id) {
        return true
      }
      return false
    },
    getFileUrl (file) {
      return file.url || file.original_url
    },
    getNoExtensionFileName (fileName) {
      var patt = /([^/]*\.)([^.]*)$/
      var result = patt.exec(fileName)
      return result ? result[1] : fileName
    },
    getFileExtension (fileName) {
      var patt = /([^/]*)\.([^.]*)$/
      var result = patt.exec(fileName)
      return result ? result[2] : ''
    },
    onLoadMoreFiles () {
      this.$emit('loadMore')
    },
    selectFile (e, file) {
      this.$emit('selectFile', e, file)
    },
    selectDetailAsset (e, file) {
      this.$emit('setDetailAsset', file)
    },
    getFileSize (bytes) {
      var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      if (bytes === 0) return '0 Byte'
      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
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
@import "styles/colors.scss";
@import "../../../styles/v2/colors.scss";

.files-container {
  overflow-y: auto;
  max-height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 1;
  border-radius: 5px;

  .no-available {
    padding: 40px;
    text-align: center;
    font-size: 16px;
    width: 100%;
  }

  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: #C8CCD5;
    opacity: 0.5;
    border-radius: 6px;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: #8796B2;
    border-radius: 6px;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #666;
  }

  .no-available {
    padding: 40px;
    text-align: center;
    font-size: 16px;
    width: 100%;
  }

  .file-item {
    flex: 1;
    max-width: 220px;
    margin: 5px;
    border: 2px solid #EFF3F8;
    position: relative;

    &__checkbox-container {
      position: absolute;
      z-index: 1;
      top: 8px;
      right: 8px;
      padding: 3px;
      border-radius: 2px;
      background-color: white;
      display: flex;
      transition: all 0.2s ease-in-out;
      cursor: pointer;
      padding: 3px;
    }
    &.detail-media {
      border: 2px solid;
      border-color: $primary !important;
    }

    .file-details {
      padding: 11px 14px 9px 14px;
      background: $gray-xlight;
    }

    .file-name-container {
      display: block;
      width: 100%;
      flex: 2;

      font-family: Fira Sans;
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      color: #53575A;

      .file-name, .file-extension {
        display: inline-block;
        vertical-align: bottom;
        white-space: nowrap;
        overflow: hidden;
      }
      .file-name {
        text-overflow: ellipsis;
        max-width: calc(100% - 3.68em);
      }
      .file-extension {
        max-width: calc(100% - 2.76em);
        direction: rtl;
      }
    }
    .file-date {
      display: none;
      flex: 1;
      color: #a9b1c0;
    }

    .file-size {
      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 22px;
      color: #53575A;
    }

    .preview-icon {
      height: 200px;
      width: 200px;
      background: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: center;

      .v-icon {
        color:#9ba9c4;
      }
    }
    .preview-img {
      background-image: url('~@/assets/images/pattern-bg.png');
      background-repeat: repeat;
      width: 216px;
      height: 150px;
      position: relative;
      cursor: pointer;
      .image-wrapper {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        background: linear-gradient(180deg, rgba(#EFF3F8, 0.4) 0%, rgba(#CED8E6, 0.4) 100%);
        height: 100%;
        img {
          position: relative;
          top:50%;
          left:50%;
          max-width:calc(100% - 2px);
          max-height:calc(100% - 2px);
          -webkit-transform:translate(-50%,-50%);
          -moz-transform:translate(-50%,-50%);
          -ms-transform:translate(-50%,-50%);
          -o-transform:translate(-50%,-50%);
          transform: translate(-50%,-50%);
        }
      }
      &.no-square-bg {
        background: none;
        .image-wrapper {
          background: none;
          overflow: hidden;

          img {
            width: calc(100% - 2px);
            max-height: unset;
          }
        }
      }
    }
    video {
      display: block;
      width: 216px;
      height: 150px;
      background: #f8fafc;
      outline: none;
    }
  }
}
</style>
