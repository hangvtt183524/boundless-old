<template lang="pug">
  .file-details-view
    .file-details-view__header
      base-tab-header(
        :class="['tab-header--underlined', 'tab-header--blue', {'tab-header--active': selectedTab === tabs.imageDetails}]"
        @click='onTabHeaderClick(tabs.imageDetails)'
      )
        | {{ $t('media.imageDetails') }}
      base-tab-header(
        :class="['tab-header--underlined', 'tab-header--blue', {'tab-header--active': selectedTab === tabs.metaData}]"
        @click='onTabHeaderClick(tabs.metaData)'
      )
        | {{ $t('media.metaData') }}
      .file-details-view__header__close
        v-icon(
          @click="$emit('close')", data-test="btn-show-grid"
        ) close
    .file-details-view__body
      .preview-media
        .preview-img(
          v-if="selectedFile.asset_type === 'image'"
          data-test="preview-image"
          @click="showCropper(selectedFile)"
          :class="[{ 'no-square-bg': isNoTransparentBg(selectedFile.name) }]"
        )
          .image-wrapper
            img(:src="getFileUrl(selectedFile)")
        video(controls  data-test="preview-video" v-if="selectedFile.asset_type === 'video'")
          source(:src="getFileUrl(selectedFile)" :type="selectedFile.content_type")
      .file-details-view__body__image-details(
        v-if="selectedTab === tabs.imageDetails"
      )
        .file-details-view__body__image-details__items
          .file-details-view__body__image-details__items__item
            label.file-name(:alt="selectedFile.name") {{ $t('general.name') }}:
            span {{ selectedFile.name }}
          .file-details-view__body__image-details__items__item
            label.file-size {{ $t('media.size') }}:
            span {{ getFileSize(selectedFile.size) }}
          .file-details-view__body__image-details__items__item(
            v-if="selectedFile.asset_type === 'image'"
          )
            label.file-dimensions {{ $t('media.dimensions') }}:
            span {{ Math.round(selectedFile.width) }} x {{ Math.round(selectedFile.height) }}
          .file-details-view__body__image-details__items__item
            label.file-mime {{ $t('media.mimeType') }}:
            span {{ selectedFile.content_type }}
          .file-details-view__body__image-details__items__item
            label.file-mime {{ $t('media.uploadedDate') }}:
            span {{ $moment(selectedFile.updated_at).format('L') }}
          .file-details-view__body__image-details__items__item
            label.file-mime {{ $t('media.uploadedBy') }}:
            span {{ selectedFile.updated_by_name }}
          .file-details-view__body__image-details__items__item
            label.file-url {{ $t('media.publicUrl') }}:
            span
              a.copy-url(
                alt="Copy to clipboard"
                data-test="btn-copy-url"
                @click="copyFileUrlToClipboard(getFileUrl(selectedFile))"
              ) Copy url
          .file-details-view__body__image-details__items__item
            span.url(
              @click="onClickViewAsset(selectedFile)"
            ) {{ getFileUrl(selectedFile) }}
        //- .file-details-view__body__image-details__actions
        //-   base-button(
        //-     v-if="hasPermission('media_library__view', selectedOrganization.id)"
        //-     data-test="btn-view-asset"
        //-     class="base-button--green"
        //-     @click="onClickViewAsset(selectedFile)"
        //-   ) {{ $t('media.viewAsset') }}

        //-   base-button(
        //-     v-if="hasPermission('media_library__delete', selectedOrganization.id)"
        //-     data-test="btn-delete-asset"
        //-     v-show="!hideAction"
        //-     class="base-button--danger"
        //-     @click="showConfirmDialog"
        //-   ) {{ $t('media.deleteFile') }}
      .file-details-view__body__meta-data(
        v-if="selectedTab === tabs.metaData"
      )
        .file-details-view__body__meta-data__detail-input
          label {{ $t('media.title') }}
          base-text-input.base-text-input(
            data-test="title-input"
            placeholder="---"
            v-model="selectedFile.title"
          )
        .file-details-view__body__meta-data__detail-input
          label {{ $t('media.caption') }}
          base-text-input.base-text-input(
            data-test="caption-input"
            placeholder="Best berries in the world"
            v-model="selectedFile.caption"
          )
        .file-details-view__body__meta-data__detail-input
          label {{ $t('media.altText') }}
          base-text-input.base-text-input(
            data-test="alt-input"
            placeholder="---"
            v-model="selectedFile.alt_text"
          )
        base-button(
          v-if="hasPermission('media_library__edit', selectedOrganization.id)"
          data-test="btn-update-meta"
          v-show="!hideAction"
          class="base-button--green"
          @click="updateMetaData"
          :loading="saving"
        ) {{ $t('media.save') }}
    confirm-dialog(ref="confirmDialog")
</template>
<script>
import copyTextToClipboard from '@/utils/copy-to-clipboard'
import ConfirmDialog from '@/components/common/confirm-dialog'
import BaseTabHeader from '@/components/v2/base-tab-header/base-tab-header'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import BaseButton from '@/components/v2/base-button/base-button'
import { mapGetters } from 'vuex'
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  props: {
    selectedFile: {
      type: Object,
      default () {
        return {}
      }
    },
    hideAction: {
      type: Boolean,
      default: false
    },
    saving: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ConfirmDialog,
    BaseTabHeader,
    BaseTextInput,
    BaseButton
  },
  mixins: [
    UserPermissionsMixin
  ],
  data () {
    return {
      selectedTab: 'imageDetails',
      tabs: {
        imageDetails: 'imageDetails',
        metaData: 'metaData'
      }
    }
  },
  computed: {
    ...mapGetters('layout', ['selectedOrganization'])
  },
  methods: {
    updateMetaData () {
      this.$emit('onSaveMetaData', this.selectedFile)

      EventTracker.sendEvent(EVENT_NAMES.MEDIA_ASSET_META_DATA_CHANGED)
    },
    getFileUrl (file) {
      return file.url || file.original_url
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
    },
    copyFileUrlToClipboard (url) {
      copyTextToClipboard(url).then(() => {
        global.toastr['success'](this.$t('general.urlCopied'))
      })
    },
    showCropper (file) {
      this.$emit('onCrop', file)
    },
    showConfirmDialog () {
      this.$refs.confirmDialog.open(
        this.$t('general.confirmTitle', { name: this.$t('media.file') }), this.$t('general.deleteConfirmMessage'), { color: 'error' }
      ).then(confirm => {
        if (confirm) {
          this.$emit('deleteFile', this.selectedFile)
        }
      })
    },
    onTabHeaderClick (tabKey) {
      this.selectedTab = tabKey
    },
    onClickViewAsset (selectedFile) {
      window.open(this.getFileUrl(selectedFile))
    }
  }
}
</script>
<style lang="scss">
@import 'styles/v2/colors.scss';

.file-details-view {
  width: 100%;

  &__header {
    background-color: $white;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    height: 60px;
    display: flex;

    &__close {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin: 0 0 0 auto;

      .v-icon {
        color: #9ba9c4;
        font-size: 18px;
        padding: 16px;

        &:hover {
          font-weight: bold;
        }
      }
    }

    @media only screen and (max-width: 767px) {
      padding: 0 5px;
    }

    .tab-header--blue {
      border-color: $blue-medium;
    }

    .tab-header--underlined.tab-header--blue.tab-header--active {
      color: $blue-medium;
    }

    .tab-header {
      min-width: auto;
      padding: 0 20px;

      @media only screen and (max-width: 1264px) {
        padding: 0 10px;
      }

      @media only screen and (max-width: 1024px) {
        padding: 0 5px;
      }

      @media only screen and (max-width: 767px) {
        font-size: 15px;
      }
    }

    .tab-header:first-child { // image details
      width: 149px;
    }
    .tab-header:nth-child(2) { // meta data
      width: 136px;
    }

    .tab-header:not(:last-child) {
      margin-right: 7px;
    }
  }

  &__body {
    &__image-details {
      &__actions {
        margin-top: 20px;
        padding: 16px;

        display: flex;
        justify-content: space-around;
        .base-button {
          width: 50%;
        }
      }
      &__items {
        width: 100%;

        &__item {
          width: 100%;
          position: relative;
          padding: 0 31px 0 21px;
          display: flex;
          justify-content: space-between;

          &:nth-child(2n + 1) {
            background: rgba(#EFF3F8, 0.5);
          }
          label {
            font-family: Fira Sans;
            font-style: normal;
            font-weight: 500;
            font-size: 15px;
            line-height: 32px;
            color: #53575A;
          }
          span {
            font-family: Fira Sans;
            font-style: normal;
            font-weight: normal;
            font-size: 15px;
            line-height: 32px;
            text-align: right;
            color: #53575A;
          }
          a.copy-url {
            font-family: Fira Sans;
            font-style: normal;
            font-weight: normal;
            font-size: 15px;
            line-height: 32px;
            text-decoration-line: underline;
            color: #15AC2F;
          }
          .url {
            overflow-x: hidden;
            cursor: pointer;
            white-space: nowrap;
            font-family: Fira Sans;
            font-style: normal;
            font-weight: normal;
            font-size: 15px;
            line-height: 32px;
            text-align: right;
            text-decoration-line: underline;
            color: #53575A;

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
          }
        }
      }
    }
    &__meta-data {
      padding: 17px;

      &__detail-input {
         margin-top: 10px;
         label {
           line-height: 20px;
         }
      }
      .base-button {
        margin-top: 22px;
        width: 100%;
      }
    }
  }

  .preview-media {
    width: 100%;
    padding: 16px;

    .preview-img {
      height: 200px;
      cursor: pointer;
      position: relative;
      background-image: url('~@/assets/images/pattern-bg.png');
      background-repeat: repeat;

      .image-wrapper {
        width: 100%;
        height: 100%;
        position: relative;
        background: linear-gradient(180deg, rgba(#EFF3F8, 0.4) 0%, rgba(#CED8E6, 0.4) 100%);

        img {
          max-width: 100%;
          max-height: 100%;
          position: absolute;
          top: 50%;
          left: 50%;
          -webkit-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
        }
      }

      &.no-square-bg {
        background: none;
        .image-wrapper {
          background: none;
          overflow: hidden;
          img {
            width: 100%;
            max-height: unset;
          }
        }
      }
    }
    video {
      width: 100%;
      outline: none;
    }
  }
}
</style>
