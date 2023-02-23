<template lang="pug">
  .page-content.media-index(data-test="media-library-home")
    .media-index__main(
      :class="[{'media-index__main--extended': !detailAsset || selectedTab !== tabs.myFiles}]"
    )
      media-library-header(
        :selected-tab="selectedTab"
        :current-layout="currentLayout"
        :files-count="filesCount"
        @tabChange="onTabHeaderClick"
        @layoutChange="onLayoutChange"
      )
      .media-index__main__body
        .media-index__main__body__uploader(
          v-if="selectedTab !== tabs.myFiles"
        )
          file-uploader(
            v-if="selectedTab === tabs.uploadFiles"
            @multiUpload="uploadMultipleFiles"
            :isFinihedMultiUploading="isFinihedMultiUploading"
          )
          add-from-url(
            v-if="selectedTab === tabs.addFromURL"
            @upload="uploadFileFromUrl"
            :uploadingUrl="isUploading"
            :isUploadingSuccess="isUploadingSuccess"
          )
        .media-index__main__body__library
          media-library(
            v-if="hasPermission('media_library__view', selectedOrganization.id)"
            v-show="selectedTab === tabs.myFiles"
            ref="mediaLib"
            data-test="media-library"
            :loading="isLoading"
            :hide-action="false"
            :detail-asset="detailAsset"
            :selected-files = "selectedFiles"
            :isSelectedAllItems="isSelectedAllItems"
            :current-layout="currentLayout"
            :multi-select="multiSelect"
            @select="(val) => selectedFiles = val"
            @setDetailAsset="setDetailAsset"
            @delete="deleteSelectedFiles"
            @crop="showCropper"
            @onSave="updateMetaData"
            @fetchData="onFetchData"
            @onSelectAll="(val) => isSelectedAllItems = val"
          )
    .media-index__file-details(
      v-if="detailAsset && selectedTab === tabs.myFiles"
    )
      file-details(
        data-test="media-details"
        :hide-action="false"
        :selected-file="detailAsset"
        :saving="isSaving"
        @deleteFile="deleteDetailAsset"
        @onCrop="showCropper"
        @onSaveMetaData="updateMetaData"
        @close="closeFileDetails"
      )
    image-cropper(
      v-if="showCropperModal"
      :is-uploading="isUploading"
      :show="showCropperModal"
      :data="cropperFile"
      @close="showCropperModal = false"
      @crop="imageCrop"
    )
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'

import CurrentUserMixin from '@/mixins/current-user.mixin'
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import MediaLibraryMixin from '@/mixins/media-library.mixin'

import mediaLibrary from '@/components/common/media-library/media-library'
import addFromUrl from '@/components/common/media-library/add-from-url'
import fileUploader from '@/components/common/media-library/file-uploader'
import imageCropper from '@/components/common/media-library/image-cropper'
import mediaLibraryDialog from '@/components/common/media-library/media-library-dialog'
import fileDetails from '@/components/common/media-library/file-details'
import MediaLibraryHeader from '@/components/common/media-library/media-library-header'

export default {
  components: {
    imageCropper,
    mediaLibrary,
    addFromUrl,
    fileUploader,
    fileDetails,
    mediaLibraryDialog,
    MediaLibraryHeader
  },
  mixins: [
    CurrentUserMixin,
    UserPermissionsMixin,
    MediaLibraryMixin
  ],
  data () {
    return {
      detailAsset: null,
      selectedFiles: [],
      isLoading: false,
      isUploading: false,
      isUploadingSuccess: false,
      isSaving: false,
      isFinihedMultiUploading: false,
      showCropperModal: false,
      cropperFile: '',
      pagination: {},
      isSelectedAllItems: false,
      selectedTab: null,
      tabs: {
        myFiles: 'myFiles',
        uploadFiles: 'uploadFiles',
        addFromURL: 'addFromURL'
      },
      currentLayout: 'grid',
      multiSelect: true
    }
  },
  mounted () {
    this.setDefaultSelectedTab()
  },
  computed: {
    ...mapGetters('layout', ['selectedOrganization']),
    orgId () {
      return this.$route.params.orgId
    }
  },
  watch: {
    files (v) {
      if (this.detailAsset) {
        const index = v.findIndex(item => item.id === this.detailAsset.id)
        if (index !== -1) {
          this.detailAsset = v[index]
        } else {
          this.detailAsset = null
        }
      }
      if (this.isSelectedAllItems) {
        this.selectedFiles = v
      }
    },
    selectedOrganization: {
      handler: function () {
        if (!this.selectedTab) {
          this.setDefaultSelectedTab()
        }
      },
      deep: true
    },
    userActions: {
      handler: function (newValue) {
        if (!this.selectedTab) {
          this.setDefaultSelectedTab()
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('organization/media', ['fetchFiles', 'uploadFileS3', 'addFile', 'addFileFromUrl', 'uploadCropped', 'deleteFiles', 'deleteFile', 'updateFile', 'getFileIds']),
    onUploadMultipleFilesFinish (uploadData) {
      global.toastr['success'](this.$t('media.fileUploadedMessage'), this.$t('general.success'))
      this.isFinihedMultiUploading = true
      this.pagination.page = 1

      // Update page on media library component so we're in sync with current data
      this.$refs.mediaLib.page = 1

      this.onTabHeaderClick(this.tabs.myFiles)
      this.fetchMediaLibrary({
        autoSelectLatest: true
      })
    },
    onUploadFileFinish (response) {
      global.toastr['success'](this.$t('media.fileUploadedMessage'), this.$t('general.success'))
      this.isUploading = false
      this.isUploadingSuccess = true

      if (this.hasPermission('media_library__view', this.selectedOrganization.id)) {
        this.onTabHeaderClick(this.tabs.myFiles)
        this.setDetailAsset(response.data.data)
        this.pagination.page = 1

        // Update page on media library component so we're in sync with current data
        this.$refs.mediaLib.page = 1

        this.fetchMediaLibrary()
      }
    },
    showCropper (file) {
      this.showCropperModal = true
      this.cropperFile = file
    },
    imageCrop (file, payload) {
      const orgId = this.selectedOrganization.id
      this.isUploading = true
      this.uploadCropped({ orgId, ...payload }).then(response => {
        const data = response.data.data
        if (data.presigned_post) {
          let formData = new FormData()
          Object.keys(data.presigned_post.fields).map(key => {
            formData.append(key, data.presigned_post.fields[key])
          })
          formData.append('file', file)
          this.uploadFileS3({ url: data.presigned_post.url, data: formData }).then(() => {
            this.updateFile({ ...payload }).then((response) => {
              global.toastr['success'](this.$t('media.croppedImageeUploadedMessage'), this.$t('general.success'))
              this.pagination.page = 1
              this.fetchMediaLibrary()
              this.showCropperModal = false
              this.isUploading = false
            }).catch(() => {
              this.showCropperModal = false
              this.isUploading = false
            })
          }).catch(() => {
            this.showCropperModal = false
            this.isUploading = false
          })
        }
      }).catch(() => {
        this.showCropperModal = false
      })
    },
    updateMetaData (file) {
      var metaDataParams = _.pickBy(file, (value, key) => {
        return ['file', 'cropped_file', 'compressed_file'].indexOf(key) === -1
      })

      this.isSaving = true
      this.updateFile(metaDataParams).then((response) => {
        const resFile = response.data.data
        const index = this.files.map(item => item.id).indexOf(resFile.id)
        if (index !== -1) {
          this.files[index] = resFile
        }
        this.selectedFiles[0] = resFile
        global.toastr['success'](this.$t('media.updateFileMetaData'), this.$t('general.success'))
      }).finally(() => {
        this.isSaving = false
      })
    },
    closeFileDetails () {
      this.detailAsset = null
    }
  }
}
</script>

<style lang="scss">
@import "../../styles/v2/colors.scss";

.media-index {
  &__main {
    background: white;
    height: calc(100vh - 115px);
    width: calc(100% - 369px);
    float: left;
    position: relative;

    &.media-index__main--extended {
      width: 100%;
    }

    &__body {
      height: 100%;
      padding-top: 60px;

      &__uploader {
        padding: 37px;
        background: #FFFFFF;
        box-shadow: 5px 0px 10px rgba(0, 0, 0, 0.05);
        height: calc(100vh - 175px);
      }
      &__library {
        height: 100%;
      }
    }
  }
  &__file-details {
    float: right;
    background: #FFFFFF;
    box-shadow: 5px 0px 10px rgba(0, 0, 0, 0.05);
    margin-left: 21px;
    width: 348px;
    height: calc(100vh - 115px);
  }
}
</style>
