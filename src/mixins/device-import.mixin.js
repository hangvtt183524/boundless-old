import { DEVICE_IMPORT_OPTIONS } from '@/components/common/device-import/constants'

const deviceData = {
  manualData: [{}],
  fileUploadData: {
    organization: null,
    inventory_file_type: null,
    inventory_file: ''
  },
  vendorData: {
    type: '',
    selectedAleId: '',
    selectedMerakiOrg: null
  }
}

let DeviceImportMixin = {
  data () {
    return {
      importMode: '',
      device: JSON.parse(JSON.stringify(deviceData))
    }
  },
  computed: {
    importOptions () {
      return DEVICE_IMPORT_OPTIONS
    },
    isManualImport () {
      return this.importMode === this.importOptions.manual
    },
    isCsvImport () {
      return this.importMode === this.importOptions.csvXls
    },
    isVendorImport () {
      return this.importMode === this.importOptions.vendorApi
    },
    isMeraki () {
      return this.device.vendorData.type === this.importOptions.meraki
    },
    isAruba () {
      return this.device.vendorData.type === this.importOptions.aruba
    }
  },
  methods: {
    resetDeviceData () {
      this.device = Object.assign({}, this.device, JSON.parse(JSON.stringify(deviceData)))
    },
    isImportDataValid () {
      if (this.isManualImport && this.$refs.manualImport) {
        return this.$refs.manualImport.isValid()
      } else if (this.isCsvImport && this.$refs.csvImport) {
        return this.$refs.csvImport.isValid()
      } else if (this.isVendorImport) {
        const vendorData = this.device.vendorData
        if (vendorData.type === this.importOptions.meraki && vendorData.selectedMerakiOrg) {
          return true
        } else if (vendorData.type === this.importOptions.aruba && vendorData.selectedAleId) {
          return true
        }
      }
      return false
    }
  }
}

export default DeviceImportMixin
