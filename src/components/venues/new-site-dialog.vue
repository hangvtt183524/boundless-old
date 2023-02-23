<template lang="pug">
  // new site modal
  base-dialog(
    :show="show"
    @close="close"
    max-width="900"
    scrollable
  )
    .new-site-dialog(data-test="new-site-dialog")
      h2.step-heading.mb-2 {{ stepTitle }}
      v-stepper(v-model="currentStep")
        v-stepper-header
          v-stepper-step(
            :complete="currentStep > 1"
            step="1"
          )

          v-divider
          v-stepper-step(
            :complete="currentStep > 2"
            step="2"
          )

          v-divider
          v-stepper-step(step="3")

        v-stepper-items
          v-stepper-content(step="1")
            div
              new-site-step1(
                ref="siteData"
                v-model="siteData"
              )

          v-stepper-content(step="2")
            div
              new-site-step2(
                ref="deviceImport"
                @change="setImportDataValid"
              )

          v-stepper-content(step="3")
            div
              new-site-step3(
                :error-message="errorMessage"
                :error-message-extra="errorMessageExtra"
                )

      v-layout(row wrap pt-3)
        v-flex(xs12)
          v-btn(
            data-test="btn-previous"
            v-show="currentStep > 1 && !errorMessage"
            @click.native="currentStep = currentStep - 1"
            color="success"
            large
            round
          ) {{ $t('general.previous') }}

          v-btn(
            data-test="btn-next"
            @click.native="nextStep"
            :loading="loading"
            :disabled="continueDisabled()"
            color="success"
            large
            round
            style="float: right"
          ) {{ continueLabel }}

          v-btn(
            data-test="btn-skip"
            v-show="currentStep === 2"
            @click.native="skipDeviceImport"
            color="success"
            large
            outline
            round
            style="float: right"
          ) {{ $t('general.skip') }}
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import { NODE_LIST_CHANGE_EVENT, SITE_ADDED_EVENT } from '@/constants/events'

import NewSiteStep1 from './new-site-step1.vue'
import NewSiteStep2 from './new-site-step2.vue'
import NewSiteStep3 from './new-site-step3.vue'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  props: ['show'],

  components: {
    NewSiteStep1,
    NewSiteStep2,
    NewSiteStep3
  },

  data () {
    return {
      loading: false,
      currentStep: 1,
      importDataValid: false,
      skipImport: false,
      siteData: {},
      errorMessage: '',
      errorMessageExtra: ''
    }
  },

  computed: {
    ...mapGetters('layout', ['selectedOrganization']),
    stepTitle () {
      if (this.currentStep === 1) {
        return this.$t('settings.establishmentInformation')
      } else if (this.currentStep === 2) {
        return this.$t('settings.materialDetails')
      } else {
        return this.$t('general.finish')
      }
    },
    continueLabel () {
      if (this.currentStep < 3) {
        return this.$t('general.continue')
      } else if (this.errorMessage) {
        return this.$t('general.close')
      } else {
        return this.$t('general.finish')
      }
    }
  },

  methods: {
    ...mapActions('organization/site', ['createSite']),
    close (newSiteAdded) {
      this.$emit('close')
      Object.assign(this.$data, this.$options.data.apply(this))
      if (this.$refs.deviceImport) {
        this.$refs.deviceImport.resetData()
      }
      if (this.$refs.siteData) {
        this.$refs.siteData.clearErrorData()
      }
      if (newSiteAdded) {
        this.$eventHub.$emit(SITE_ADDED_EVENT)
      }
    },
    continueDisabled () {
      if (this.currentStep === 1) {
        if (!this.$refs.siteData) {
          return true
        } else {
          return !this.$refs.siteData.isValid()
        }
      } else if (this.currentStep === 2) {
        return !this.importDataValid
      } else {
        return false
      }
    },
    setImportDataValid (value) {
      this.importDataValid = value
    },
    skipDeviceImport () {
      this.skipImport = true
      this.currentStep = 3
    },
    nextStep () {
      if (this.currentStep < 3) {
        this.currentStep += 1
      } else if (this.errorMessage) {
        this.close()
      } else {
        this.submit()
      }
    },
    showSuccess () {
      global.toastr['success'](this.$t('general.dataSaveSuccess'), this.$t('general.success'))
    },
    submit () {
      this.loading = true
      if (!this.siteData.parent) {
        this.siteData.parent = this.selectedOrganization.id
      }

      this.createSite(this.siteData).then(response => {
        this.$eventHub.$emit(NODE_LIST_CHANGE_EVENT)
        if (!this.skipImport) {
          const data = response.data.data
          this.$refs.deviceImport.saveInventory(data.id).then(() => {
            this.close(true)
            this.showSuccess()
          }).catch(err => {
            this.loading = false
            this.errorMessage = `${this.$t('venue.siteSuccessDeviceError')} ${this.$t('venue.importDevice')}`

            // Go over possible known error cases here
            const errorObject = err.response.data.error
            if (errorObject.detail && errorObject.detail.length && errorObject.detail[0].mac_addresses &&
              errorObject.detail[0].mac_addresses[0].mac_address &&
              errorObject.detail[0].mac_addresses[0].mac_address[0].code === 'unique') {
              this.errorMessageExtra = this.$t('inventory.deviceMacAddressNotUnique')
            }
          })
        } else {
          this.close(true)
          this.showSuccess()
        }
      })

      EventTracker.sendEvent(EVENT_NAMES.VENUE_CREATION_FINISHED)
    }
  }
}
</script>
