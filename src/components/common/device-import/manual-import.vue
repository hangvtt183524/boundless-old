<template lang='pug'>
  v-container(grid-list-md)
    v-layout(row)
      // materialDetails row
      v-flex(xs12)
        v-layout(row)
          v-flex(xs12)
            h2 {{ $t('settings.materialDetails') }} : {{ $t('organization.createManually') }}
            p.mt-4 {{ $t('organization.createManuallyDescription') }}

    removable-item.py-3.pl-3.pr-1.my-3(
      data-test="manual-device-info"
      v-for="(device, index) in value"
      :key="index"
      :removable="index > 0"
      @remove="removeDevice(index)"
    )

      v-flex(xs12 sm12 px-2)
        node-name-input(
          :error-messages="getDeviceNameError(index)"
          @input="clearNameError(index)"
          @blur="validateName(index)"
          data-test="device-name"
          :label="$t('settings.routerName')"
          required
          v-model="device.name"
        )

      v-flex(xs12 sm6 px-2)
        v-text-field.mac-address(
          data-test="mac-address"
          :label="$t('general.macAddress')"
          :error-messages="getMacAddressError(index)"
          @input="clearMacAddressError(index)"
          @blur="validateMacAddress(index)"
          required
          v-model="device.mac_address"
        )

      v-flex(xs12 sm6 px-2)
        v-select.device-vendor(
          data-test="device-vendor"
          :items="deviceVendors"
          :label="$t('general.routerVendor')"
          item-text="name"
          item-value="id"
          required
          v-model="device.vendor"
        )

    v-layout(row)
      v-flex.text-xs-right(xs12)
        v-btn(
          data-test="btn-add-device"
          :disabled="!errors"
          color="success"
          outline
          round
          @click.native="addDevice"
        ) {{ $t(' general.addAnother ') }}

</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { macAddress } from '@/validators'

import RemovableItem from '@/components/common/removable-item'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  props: {
    value: {
      type: Array,
      default: () => {
        return [{}]
      }
    },
    errors: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {
    RemovableItem
  },
  mounted () {
    if (!this.deviceVendors.length) {
      this.fetchDeviceVendors()
    }
  },
  computed: {
    ...mapGetters('organization/device', ['deviceVendors']),
    ...mapGetters('layout', ['selectedOrganization'])
  },
  methods: {
    ...mapActions('organization/device', ['fetchDeviceVendors']),
    getMacAddressError (index) {
      if (this.value[index].mac_address_error && !Array.isArray(this.value[index].mac_address_error)) {
        return this.value[index].mac_address_error
      }
      if (!this.errors) return
      const error = this.errors[index]
      const macError = error && error.mac_addresses ? error.mac_addresses[0].mac_address[0] : {}
      if (macError.code === 'unique') {
        return this.$t('general.macAddressAlreadyExists')
      }
    },
    getDeviceNameError (index) {
      const error = []
      if (this.value[index].name_error) {
        return this.value[index].name_error
      }
      return error
    },
    clearNameError (index) {
      this.$set(this.value[index], 'name_error', [])
      this.$emit('clearErrors', index)
    },
    validateName (index) {
      if (!this.value[index].name) {
        this.$set(this.value[index], 'name_error', this.$t('errors.required'))
      } else {
        this.$set(this.value[index], 'name_error', [])
      }
    },
    clearMacAddressError (index) {
      this.$set(this.value[index], 'mac_address_error', [])
      this.$emit('clearErrors', index)
    },
    validateMacAddress (index) {
      if (!this.value[index].mac_address) {
        this.$set(this.value[index], 'mac_address_error', this.$t('errors.required'))
      } else {
        this.value.forEach(device => {
          if (device.mac_address && !macAddress(device.mac_address)) {
            this.$set(device, 'mac_address_error', this.$t('general.invalidMacAddress'))
          } else {
            this.$set(device, 'mac_address_error', [])
          }
        })
      }
    },
    addDevice () {
      const newValue = this.value.slice()
      newValue.push({})
      this.$emit('input', newValue)
    },
    removeDevice (index) {
      const newValue = this.value.slice()
      newValue.splice(index, 1)
      this.$emit('input', newValue)
    },
    isValid () {
      for (let item of this.value) {
        if (!item.name || !item.vendor || !item.mac_address) {
          return false
        } else if (item.name.length > 64) {
          return false
        } else if (!macAddress(item.mac_address)) {
          return false
        }
      }
      return true
    },
    submit (parentId) {
      let parent = this.selectedOrganization.id
      if (parentId) {
        parent = parentId
      }
      this.value.forEach(device => {
        device.parent = parent
        if (device.mac_address) {
          device.mac_addresses = [{ mac_address: device.mac_address }]
        }
      })

      EventTracker.sendEvent(EVENT_NAMES.DEVICE_MANUALLY_IMPORTED)

      return this.$store.dispatch('organization/device/createDevice', this.value)
    }
  }
}
</script>

<style lang="scss" scoped>
.removable-item ::v-deep {
  .mac-label {
    margin-bottom: 18px !important;
  }
}
</style>
