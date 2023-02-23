<template lang="pug">
  base-dialog(
    :show="show"
    @close="$emit('close')"
    max-width="1400"
    scrollable
  )
    .media-library-dialog(data-test="media-library-dialog")
      h2.step-heading.mb-2 {{ $t('media.mediaLibrary') }}
      .media-library-dialog__main
        media-library-header(
          :selected-tab="selectedTab"
          :current-layout="currentLayout"
          :files-count="filesCount"
          @tabChange="onTabHeaderClick"
          @layoutChange="onLayoutChange"
        )
        .media-library-dialog__uploader-body(
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
        .media-library-dialog__lib-body(
          v-show="selectedTab === tabs.myFiles"
        )
          media-library(
            v-if="hasPermission('media_library__view', selectedOrganization.id)"
            ref="mediaLib"
            data-test="media-library"
            :current-layout="currentLayout"
            :loading="isLoading"
            :media-type="mediaType"
            :isSelectedAllItems="isSelectedAllItems"
            :multi-select="multiSelect"
            :show-search-input="true"
            :detail-asset="detailAsset"
            @delete="deleteSelectedFiles"
            @setDetailAsset="setDetailAsset"
            @fetchData="onFetchData"
            @onSelectAll="(val) => isSelectedAllItems = val"
          )
      v-layout(row wrap pt-3)
        v-flex.media-button(xs12)
          v-btn(
            data-test="btn-close"
            large
            round
            @click="$emit('close')"
          ) {{ $t('general.cancel') }}
          v-btn(
            data-test="btn-select"
            color="success"
            large
            round
            @click="selectMediaFile"
            :disabled="!detailAsset"
          ) {{ $t('general.select') }}
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import mediaLibrary from '@/components/common/media-library/media-library'
import addFromUrl from '@/components/common/media-library/add-from-url'
import fileUploader from '@/components/common/media-library/file-uploader'
import CurrentUserMixin from '@/mixins/current-user.mixin'
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import MediaLibraryMixin from '@/mixins/media-library.mixin'
import MediaLibraryHeader from './media-library-header'

export default {
  name: 'MediaLibraryDialog',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    mediaType: {
      type: String,
      default: 'all'
    },
    isShowConfirmMessage: {
      type: Boolean,
      default: true
    }
  },
  components: {
    mediaLibrary,
    addFromUrl,
    fileUploader,
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
      isUploading: false,
      isUploadingSuccess: false,
      isFinihedMultiUploading: false,
      isLoading: false,
      pagination: {},
      isSelectedAllItems: false,
      selectedTab: null,
      tabs: {
        myFiles: 'myFiles',
        uploadFiles: 'uploadFiles',
        addFromURL: 'addFromURL'
      },
      currentLayout: 'grid',
      multiSelect: false
    }
  },
  mounted () {
    this.setDefaultSelectedTab()
  },
  methods: {
    ...mapActions('organization/media', ['fetchFiles', 'uploadFileS3', 'addFile', 'addFileFromUrl', 'deleteFiles', 'updateFile']),
    onUploadMultipleFilesFinish (uploadData) {
      if (uploadData.length > 0) {
        this.$emit('select', uploadData[0].response.data)
      }
      this.isFinihedMultiUploading = true
      if (this.isShowConfirmMessage) {
        global.toastr['success'](this.$t('media.fileUploadedMessage'), this.$t('general.success'))
      }
      this.pagination.page = 1
      this.fetchMediaLibrary()
    },
    onUploadFileFinish (response) {
      if (this.isShowConfirmMessage) {
        global.toastr['success'](this.$t('media.fileUploadedMessage'), this.$t('general.success'))
      }
      this.isUploading = false
      this.$emit('select', response.data.data)

      if (this.hasPermission('media_library__view', this.selectedOrganization.id)) {
        this.pagination.page = 1
        this.fetchMediaLibrary()
      }
    },
    selectMediaFile () {
      this.$emit('select', this.detailAsset)
    }
  },
  computed: {
    ...mapGetters('layout', ['selectedOrganization'])
  }
}
</script>

<style lang="scss" scoped>
@import "../../../styles/v2/colors.scss";

.media-library-dialog {
  &__main {
    position: relative;
  }
  &__uploader-body {
    padding: 97px 37px 37px 37px;
    background: #FFFFFF;
    box-shadow: 5px 0px 10px rgba(0, 0, 0, 0.05);
    height: calc(100vh - 290px);
  }
  &__lib-body {
    padding: 60px 0 0 0;
    background: #FFFFFF;
    box-shadow: 5px 0px 10px rgba(0, 0, 0, 0.05);
    height: calc(100vh - 290px);
  }
  .media-button {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
