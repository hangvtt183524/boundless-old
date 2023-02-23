<template lang='pug'>
  v-container(grid-list-md)
    v-layout(row)
      // materialDetails row
      v-flex(xs12)
        device-import-selection(
          hide-title
          v-model="importMode"
        )

    v-layout(row px-2)
      v-flex(xs12)
        manual-import(
          ref="manualImport"
          v-if="isManualImport"
          v-model="device.manualData"
        )
        csv-import(
          ref="csvImport"
          v-if="isCsvImport"
          v-model="device.fileUploadData"
        )
        vendor-api-import(
          ref="vendorImport"
          v-if="isVendorImport"
          v-model="device.vendorData"
        )
</template>
<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'

import DeviceImportMixin from '@/mixins/device-import.mixin'

import DeviceImportSelection from '@/components/common/device-import/selection'
import ManualImport from '@/components/common/device-import/manual-import'
import CsvImport from '@/components/common/device-import/csv-import'
import VendorApiImport from '@/components/common/device-import/vendor-api-import'

export default {
  mixins: [DeviceImportMixin],
  components: {
    DeviceImportSelection,
    ManualImport,
    CsvImport,
    VendorApiImport
  },

  data () {
    return {
      isSaving: false
    }
  },

  computed: {
    ...mapGetters('layout', ['selectedOrganization'])
  },

  methods: {
    resetData () {
      Object.assign(this.$data, this.$options.data.apply(this))
      this.$nextTick(() => {
        this.resetDeviceData()
      })
    },
    saveManualImport (siteId) {
      const manualData = this.device.manualData.slice()
      manualData.forEach(device => {
        device.parent = siteId
        if (device.mac_address) {
          device.mac_addresses = [{ mac_address: device.mac_address }]
        }
      })
      return this.$store.dispatch('organization/device/createDevice', manualData)
    },
    saveCsvImport (siteId) {
      const uploadData = { ...this.device.fileUploadData }
      const formData = new FormData()
      formData.append('siteId', siteId)
      formData.append('inventory_file_type', uploadData.inventory_file_type)
      formData.append('inventory_file', uploadData.inventory_file)
      const data = {
        orgId: this.selectedOrganization.id,
        formData: formData
      }
      return this.$store.dispatch('organization/device/csvXlsImport', data)
    },
    saveVendorImport (siteId) {
      const vendorData = this.device.vendorData
      const data = {
        orgId: this.selectedOrganization.id,
        site: siteId
      }
      if (this.isMeraki) {
        data.meraki_organization_id = vendorData.selectedMerakiOrg
        return this.$store.dispatch('organization/device/merakiApiImport', data)
      } else if (this.isAruba) {
        data.aruba_ale_id = vendorData.selectedAleId
        return this.$store.dispatch('organization/loadArubaDevices', data)
      }
    },
    saveInventory (siteId) {
      if (this.isManualImport) {
        return this.saveManualImport(siteId)
      } else if (this.isCsvImport) {
        return this.saveCsvImport(siteId)
      } else if (this.isVendorImport) {
        return this.saveVendorImport(siteId)
      }
    }
  },

  watch: {
    device: {
      handler () {
        const vm = this
        Vue.nextTick(function () {
          vm.$emit('change', vm.isImportDataValid())
        })
      },
      deep: true
    },
    importMode () {
      const vm = this
      Vue.nextTick(function () {
        vm.$emit('change', vm.isImportDataValid())
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.material-details-buttons {
  height: 90px;
  padding: 25px 15px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #333;
  background: #eee;
  cursor: pointer;
}
</style>
