import { mapGetters } from 'vuex'

const MediaLibraryMixin = { // This is used on media-library-dialog.vue and media-library/index.vue
  computed: {
    ...mapGetters('organization/media', ['files', 'filesCount'])
  },
  methods: {
    onFetchData (value) {
      this.pagination = value
      this.fetchMediaLibrary()
    },
    async asyncUploadFile (file, pre) {
      const data = pre.data
      if (data.presigned_post) {
        try {
          let formData = new FormData()
          Object.keys(data.presigned_post.fields).map(key => {
            formData.append(key, data.presigned_post.fields[key])
          })
          formData.append('file', file)
          await this.uploadFileS3({ url: data.presigned_post.url, data: formData })
          return await this.updateFile({ id: data.id, asset_type: data.asset_type, uploaded: true, width: file.width, height: file.height, original_width: file.width, original_height: file.height })
        } catch (error) {
          return error
        }
      }
      return file
    },
    getFileType (type) {
      if (type.includes('image/')) {
        return 'image'
      } else if (type.includes('video/')) {
        return 'video'
      }
      return 'none'
    },
    deleteDetailAsset (file) {
      this.isLoading = true
      this.detailAsset = null

      this.deleteFile(file).then(() => {
        global.toastr['success'](this.$t('media.fileDeletedMessage'), this.$t('general.success'))
        this.pagination.page = 1

        // Update page on media library component so we're in sync with current data
        this.$refs.mediaLib.page = 1

        this.fetchMediaLibrary()
      }).catch(() => {
        this.isLoading = false
      })
    },
    performDeleteFilesList (fileIds) {
      this.deleteFiles({
        fileIds: fileIds
      }).then(() => {
        global.toastr['success'](this.$t('media.fileDeletedMessage'), this.$t('general.success'))
        this.isSelectedAllItems = false
        this.selectedFiles = []
        this.pagination.page = 1

        // Update page on media library component so we're in sync with current data
        this.$refs.mediaLib.page = 1

        this.fetchMediaLibrary()
      }).catch(() => {
        this.isLoading = false
      })
    },
    deleteSelectedFiles () {
      if (this.multiSelect) { // on multi select mode, remove checked files
        this.isLoading = true
        if (this.isSelectedAllItems) {
          this.getFileIds({
            orgId: this.orgId,
            page_size: 0,
            page: 1,
            search: this.pagination.search ? this.pagination.search : ''
          }).then(response => {
            this.performDeleteFilesList(response.data.data)
          })
        } else {
          this.performDeleteFilesList(this.selectedFiles.map(file => file.id))
        }
      } else {
        this.deleteDetailAsset(this.detailAsset)
      }
    },
    onTabHeaderClick (tabKey) {
      this.selectedTab = tabKey
    },
    onLayoutChange (newLayout) {
      this.currentLayout = newLayout
    },
    fetchMediaLibrary (options) {
      if (!options) {
        options = {}
      }
      const orgId = this.$route.params.orgId
      let filter = {
        orgId,
        page_size: this.pagination.pageSize,
        page: this.pagination.page,
        ordering: this.pagination.sortBy,
        search: this.pagination.search
      }
      if (this.pagination.search) {
        filter.search = this.pagination.search
      }
      if (this.pagination.filterBy) {
        filter.asset_type = this.pagination.filterBy
      }
      this.isLoading = true
      this.fetchFiles(filter).then((response) => {
        this.isLoading = false
        if (!this.firstTimeLoadFinished) {
          this.firstTimeLoadFinished = true
          if (response.data.data.count === 0) {
            this.onTabHeaderClick(this.tabs.uploadFiles)
          }
        }
        if (options.autoSelectLatest) {
          this.detailAsset = response.data.data.results[0]
        }
      }).catch(() => {
        this.isLoading = false
      })
    },
    setDetailAsset (file) {
      this.detailAsset = file
    },
    uploadMultipleFiles (uploadData) {
      this.isFinihedMultiUploading = false
      Promise.all(uploadData.map(item => this.asyncUploadFile(item.file, item.response))).then((res) => {
        this.onUploadMultipleFilesFinish(uploadData)
      })
    },
    uploadFile (file) {
      const orgId = this.$route.params.orgId
      let payload = {
        name: file.name,
        original_size: file.size,
        content_type: file.type,
        lastModifiedDate: file.lastModifiedDate,
        asset_type: this.getFileType(file.type)
      }
      if (payload.asset_type === 'image') {
        payload.original_width = file.width
        payload.original_height = file.height
      }
      this.isUploading = true
      this.addFile({ orgId, ...payload }).then(response => {
        const data = response.data.data
        if (data.presigned_post) {
          let formData = new FormData()
          Object.keys(data.presigned_post.fields).map(key => {
            formData.append(key, data.presigned_post.fields[key])
          })
          formData.append('file', file)
          this.uploadFileS3({ url: data.presigned_post.url, data: formData }).then(() => {
            this.updateFile({ id: data.id, asset_type: data.asset_type, uploaded: true }).then((response) => {
              this.onUploadFileFinish(response)
            }).catch(() => {
              this.isUploading = false
            })
          }).catch(() => {
            this.isUploading = false
          })
        }
      }).catch(() => {
        this.isUploading = false
      })
    },
    uploadFileFromUrl (url) {
      const orgId = this.$route.params.orgId
      let payload = {
        url: url
      }

      this.isUploading = true
      this.addFileFromUrl({ orgId, ...payload }).then(response => {
        this.onUploadFileFinish(response)
        this.isUploading = false
      }).catch(() => {
        this.isUploading = false
      })
    },
    setDefaultSelectedTab () {
      if (this.hasPermission('media_library__view', this.selectedOrganization.id)) {
        this.selectedTab = 'myFiles'
      } else if (this.hasPermission('media_library__create', this.selectedOrganization.id)) {
        this.selectedTab = 'uploadFiles'
      }

      return null
    }
  }
}

export default MediaLibraryMixin
