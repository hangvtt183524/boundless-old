<template lang='pug'>
  v-container(grid-list-md)
    v-layout(row wrap)
      // materialDetails row
      v-flex(xs12)
        v-layout(row)
          v-flex(xs12)
            h2 {{ $t('settings.materialDetails') }} : {{ $t('organization.importCsvXls') }}
            p.mt-4 {{ $t('organization.importMerakiInventoryDescription') }}

      v-flex(xs6)
        v-select(
          :items="inventoryFileTypes"
          :label="$t('general.selectInventoryFileType')"
          v-model="value.inventory_file_type"
          item-text="display_name"
        )
      v-flex.btn-sample-download(
        xs5
        offset-xs1
        data-test="btn-sample-download"
        v-if="value.inventory_file_type"
        @click="downloadSample"
      )
        p {{ $t('inventory.downloadSampleFile', {type: value.inventory_file_type}) }}
      v-flex(xs12 v-if="value.inventory_file_type")
        v-dropzone(
          :options="dropzoneOptions"
          @file-added="fileAdded"
          @removed-file="removedFile"
          ref="fileDropzone"
        )
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

import VDropzone from '@/components/common/v-dropzone'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'CsvImport',
  props: ['value'],
  components: {
    VDropzone
  },
  mounted () {
    if (!this.hasImportOptions) {
      this.fetchDeviceImportOptions(this.selectedOrganization.id)
    }
  },
  computed: {
    ...mapGetters('organization/device', ['deviceImportOptions']),
    ...mapGetters('layout', ['selectedOrganization']),
    hasImportOptions () {
      return !global._.isEmpty(this.deviceImportOptions)
    },
    inventoryFileTypes () {
      if (this.hasImportOptions) {
        return this.deviceImportOptions.data.actions.POST.inventory_file_type.choices
      } else {
        return []
      }
    },
    dropzoneOptions () {
      return {
        acceptedFiles: '.csv, .xls, .xlsx',
        url: '/api/mock/url/',
        dictDefaultMessage: '<i class="fas fa-cloud-upload-alt"></i> ' + this.$t('general.csvXlsFileUpload'),
        autoProcessQueue: false // Do not upload automatically
      }
    }
  },
  methods: {
    ...mapActions('organization/device', ['fetchDeviceImportOptions']),
    fileAdded (file) {
      const newValue = Object.assign({}, this.value, {
        inventory_file: file
      })
      this.$emit('input', newValue)
    },
    removedFile (file) {
      const newValue = Object.assign({}, this.value, {
        inventory_file: null
      })
      this.$emit('input', newValue)
    },
    isValid () {
      return this.value.inventory_file && this.value.inventory_file_type
    },
    downloadSample () {
      const fileName = this.value.inventory_file_type === 'custom' ? 'importcustom.csv' : 'importmeraki.csv'
      const path = process.env.VUE_APP_STATIC_CDN + '/import-device-templates/' + fileName
      window.open(path)
    },
    submit (createSites) {
      const formData = new FormData()
      formData.append('inventory_file_type', this.value.inventory_file_type)
      formData.append('inventory_file', this.value.inventory_file)
      formData.append('create_sites', createSites)
      const data = {
        orgId: this.selectedOrganization.id,
        formData: formData
      }

      EventTracker.sendEvent(EVENT_NAMES.DEVICE_FILE_IMPORTED)

      return this.$store.dispatch('organization/device/csvXlsImport', data)
    }
  }
}
</script>

<style lang="scss" scoped>
  .btn-sample-download {
    display: flex;
    align-items: center;
    p {
      cursor: pointer;
      margin-bottom: 0;
      color: #9ba9c4;
      font-size: 16px;
      font-weight: bold;
      text-transform: capitalize;
      text-decoration: underline;
    }
  }
</style>
