<template lang="pug">
  vue-dropzone(
    :options="dropzoneOptions"
    @vdropzone-file-added="fileAdded"
    @vdropzone-removed-file="removedFile"
    @vdropzone-success="success"
    id="dropzone"
    ref="dropzone"
  )
</template>

<script>
import VueDropzone from 'vue2-dropzone' // Use exact 3.5.2 version, later version has SyntaxError: Expected ':' issue on IE

import Ls from '@/services/ls.js'

export default {
  props: {
    options: {
      type: Object,
      required: false
    }
  },
  components: {
    VueDropzone
  },
  computed: {
    dropzoneOptions () {
      const defaultOptions = {
        method: 'put',
        thumbnailWidth: 180,
        thumbnailHeight: 150,
        dictDefaultMessage: '<i class="fas fa-cloud-upload-alt"></i> ' + this.$t('general.fileUpload'),

        // If you restrict single file, you need to set this to 2
        // so that you can select a new file instead of removing
        // the selected file first
        maxFiles: 2,

        // This is a custom option for clearing previously selected files
        // when you want single file only, see `fileAdded` method for more info
        multiple: false,

        addRemoveLinks: true,
        headers: this.headers
      }
      if (this.options) {
        Object.assign(defaultOptions, {}, this.options)
      }
      return defaultOptions
    },
    headers () {
      const AUTH_TOKEN = Ls.get('auth.token')
      const headers = {
        'Cache-Control': null
      }
      if (AUTH_TOKEN) {
        headers['Authorization'] = `Bearer ${AUTH_TOKEN}`
      }
      return headers
    }
  },

  methods: {
    fileAdded (file) {
      if (!this.dropzoneOptions.multiple) {
        /*
           Dropzone still displays added files even if the max limit has exceeded.
           This method removes the existing file and display the selected one.
         */
        const dropzoneComponent = this.$refs.dropzone
        if (dropzoneComponent.dropzone.files.length > this.dropzoneOptions.maxFiles - 1) {
          dropzoneComponent.removeFile(dropzoneComponent.dropzone.files[0])
        }
      }
      this.$emit('file-added', file)
    },
    removedFile (file, error, xhr) {
      this.$emit('removed-file', file)
    },
    success (file, response) {
      this.$emit('success', { file, response })
    }
  }
}
</script>
