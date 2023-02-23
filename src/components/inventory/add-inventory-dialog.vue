<template lang='pug'>
  base-dialog(:show="show" @close="close" scrollable)
    .add-inventory-dialog(data-test="add-inventory-dialog")
      h2.step-heading.mb-2 {{ wizardTitle }}
      v-stepper(v-model="currentStep")
        v-stepper-items
          v-stepper-content(step="1")
            div.py-0
              device-import-selection(
                @change="nextStep"
                is-btn
                v-model="importMode"
              )

          v-stepper-content(step="2")
            div.py-0
              manual-import(
                data-test="manual-import"
                :errors="errorData"
                @clearErrors="clearErrors"
                ref="manualImport"
                v-if="isManualImport"
                v-model="device.manualData"
              )
              csv-import(
                data-test="csv-import"
                ref="csvImport"
                v-if="isCsvImport"
                v-model="device.fileUploadData"
              )
              vendor-api-import(
                data-test="vendor-api-import"
                :errors="errorData"
                ref="vendorImport"
                v-if="isVendorImport"
                v-model="device.vendorData"
              )

          v-stepper-content(step="3")
            .step-3(data-test="step-3")
              v-layout(row wrap)
                v-flex(xs12)
                  v-layout(row)
                    v-flex(xs12)
                      h2 {{ $t('general.finish') }}
                      p.mt-2(v-if="!isManualImport" data-test='devices-added') {{ devicesAdded }} {{ $t('general.devicesAdded') }}
                      p.mt-2(v-if="!isManualImport" data-test='devices-ignored') {{ devicesIgnored }} {{ $t('general.devicesIgnored') }} {{ devicesIgnoredReason && `(${devicesIgnoredReason})` }}
                      p.mt-2(v-if="!isManualImport && isCreateSiteandAssocciate" data-test='sites-added') {{ sitesAdded }} {{ $t('general.sitesAdded') }}
                      p.mt-2(v-if="!isManualImport && isCreateSiteandAssocciate" data-test='sites-ignored') {{ sitesIgnored }} {{ $t('general.sitesIgnored') }} {{ sitesIgnoredReason && `(${sitesIgnoredReason})` }}

                      p.mt-4 {{ $t('organization.viewDocumentationDescription') }}
                v-flex(pt-5 xs12 text-xs-center)
                  v-btn(
                    color="success"
                    large
                    outline
                    round
                    @click="openDocumentation"
                  ) {{ $t('general.viewDocumentation') }}

        v-layout(
          row wrap pt-3
          v-show="currentStep > 1"
        )
          v-flex(xs4)
            v-btn(
              data-test="btn-prev"
              v-if="currentStep < 3"
              @click.native="currentStep -= 1"
              color="success"
              large
              outline
              round
            ) {{$t('general.previous')}}
          v-flex.action-right(xs8)
            v-checkbox.create-site(
              data-test="create-test"
              v-if="hasPermission('venues__create', selectedOrganization.id) && currentStep === 2 && !isManualImport"
              :label="$t('inventory.createSiteandAssocciate')"
              v-model="isCreateSiteandAssocciate"
            )
            v-btn(
              data-test="btn-next"
              v-if="currentStep"
              :disabled="continueDisabled()"
              :loading="isSaving"
              @click.native="nextStep"
              color="success"
              large
              round
            ) {{ continueBtnLabel }}
</template>

<script>
import { mapGetters } from 'vuex'

import { DEVICE_ADDED_EVENT } from '@/constants/events'

import DeviceImportSelection from '@/components/common/device-import/selection'
import ManualImport from '@/components/common/device-import/manual-import'
import CsvImport from '@/components/common/device-import/csv-import'
import MerakiApiImport from '@/components/common/device-import/meraki-api-import'
import ArubaApiImport from '@/components/common/device-import/aruba-api-import'
import VendorApiImport from '@/components/common/device-import/vendor-api-import'

import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import DeviceImportMixin from '@/mixins/device-import.mixin'
import ErrorHandlerMixin from '@/mixins/error-handler.mixin'

export default {
  props: ['show'],
  data () {
    return {
      currentStep: 1,
      isSaving: false,
      isCreateSiteandAssocciate: false,
      devicesAdded: 0,
      devicesIgnored: 0,
      devicesIgnoredReason: '',
      sitesAdded: 0,
      sitesIgnored: 0,
      sitesIgnoredReason: ''
    }
  },
  components: {
    ArubaApiImport,
    DeviceImportSelection,
    ManualImport,
    CsvImport,
    MerakiApiImport,
    VendorApiImport
  },
  mixins: [
    UserPermissionsMixin,
    DeviceImportMixin,
    ErrorHandlerMixin
  ],
  computed: {
    ...mapGetters('layout', ['selectedOrganization']),
    orgId () {
      return this.selectedOrganization.id
    },
    continueBtnLabel () {
      if (this.currentStep < 2) {
        return this.$t('general.continue')
      } else if (this.currentStep === 2) {
        return this.$t('general.importDevices')
      } else {
        return this.$t('general.close')
      }
    },
    wizardTitle () {
      if (this.currentStep < 3) {
        return `${this.$t('inventory.stepWizardTitle')[this.currentStep - 1]}`
      }
      return ''
    }
  },
  methods: {
    openDocumentation () {
      this.close()
      const routeData = this.$router.resolve({ name: 'documentation' })
      window.open(routeData.href, '_blank')
    },
    saveInventory () {
      if (this.isManualImport) {
        this.submit(this.$refs.manualImport)
      } else if (this.isCsvImport) {
        this.submit(this.$refs.csvImport)
      } else if (this.isVendorImport) {
        this.submit(this.$refs.vendorImport)
      }
    },
    clearErrors (index) {
      this.errorData[index] = {}
    },
    submit (ref) {
      this.isSaving = true
      // Do not pass orgID/siteId so that it will be imported
      // in the current organization
      if (!this.isManualImport) {
        ref.submit(this.isCreateSiteandAssocciate).then(response => {
          const data = response.data.data

          this.devicesAdded = data.devices_added
          this.devicesIgnored = data.devices_ignored
          this.sitesAdded = data.sites_added
          this.sitesIgnored = data.sites_ignored

          if (data.devices_ignored_reasons || data.devices_ignored_reasons.length > 0) {
            if (data.devices_ignored_reasons.includes('devices_already_exist')) {
              this.devicesIgnoredReason = this.$t('general.devicesAlreadyExist')
            }
          }

          if (data.sites_ignored_reasons || data.sites_ignored_reasons.length > 0) {
            if (data.sites_ignored_reasons.includes('devices_already_exist')) {
              this.sitesIgnoredReason = this.$t('general.sitesAlreadyExist')
            }
          }

          this.$eventHub.$emit(DEVICE_ADDED_EVENT)
          this.showSuccessMessage()
          this.currentStep += 1
        }).catch(err => {
          this.setErrorData(err)
        }).finally(() => {
          this.isSaving = false
        })
      } else {
        ref.submit().then(response => {
          this.$eventHub.$emit(DEVICE_ADDED_EVENT)
          this.showSuccessMessage()
          this.currentStep += 1
        }).catch(err => {
          this.setErrorData(err)
        }).finally(() => {
          this.isSaving = false
        })
      }
    },
    resetData () {
      Object.assign(this.$data, this.$options.data.apply(this))
      this.$nextTick(() => {
        this.resetDeviceData()
      })
    },
    close () {
      this.$emit('close')
      this.resetData()
    },
    showSuccessMessage () {
      const successMessage = this.$t('inventory.savedSuccessfully')
      global.toastr['success'](successMessage, this.$t('general.success'))
    },
    continueDisabled () {
      if (this.currentStep === 2) {
        return !this.isImportDataValid()
      } else if (this.currentStep === 3) {
        return false
      } else {
        return true
      }
    },
    nextStep () {
      if (this.currentStep < 2) {
        this.currentStep += 1
      } else if (this.currentStep === 2) {
        this.saveInventory()
      } else {
        this.close()
      }
    }
  },
  watch: {
    'device.vendorData': function () {
      this.clearErrorData()
    }
  }
}
</script>

<style lang="scss">
.action-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .create-site {
    height: 30px;
  }
}
.add-inventory-dialog {
  .dropzone .dz-progress {
    display: none !important;
  }
}
</style>
