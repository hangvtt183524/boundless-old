<template lang='pug'>
  v-container(grid-list-md)
    v-layout(row)
      // materialDetails row
      v-flex(xs12)
        v-layout(row)
          v-flex(xs12)
            h2 {{ $t('settings.materialDetails') }} : {{ $t('organization.importApiVendor') }}
            p.mt-4 {{ $t('inventory.importVendorApiDescription') }}

    v-layout.card(row wrap px-5 py-4)
      v-flex(xs12)
        v-select(
          data-test="vendor-select"
          :items="vendorChoices"
          :label="$t('general.selectVendor')"
          @change="changeType"
          :value="value.type"
          required
        )
      transition
        meraki-api-selection.xs12(
          data-test="meraki-api-selection"
          v-if="value.type === 'meraki'"
          v-loading="fetchingMerakiOrgs"
          :value="value.selectedMerakiOrg"
          @input="changeValue"
          @loading="loadingMeraki"
          ref="meraki"
        )
        aruba-api-selection.xs12(
          data-test="aruba-api-selection"
          v-if="value.type === 'aruba'"
          :value="value.selectedAleId"
          @input="changeValue"
          ref="aruba"
        )
      v-flex(
        v-if="errors.message"
        xs12
      )
        v-alert(
          :value="true"
          color="error"
          icon="warning"
          outline
        )
          | {{ errors.message }}
    </v-alert>
</template>
<script>
import ArubaApiSelection from './aruba-api-selection'
import MerakiApiSelection from './meraki-api-selection'

import DeviceImportMixin from '@/mixins/device-import.mixin'

export default {
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          type: '',
          selectedAleId: '',
          selectedMerakiOrg: ''
        }
      }
    },
    errors: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  mixins: [DeviceImportMixin],
  components: {
    ArubaApiSelection,
    MerakiApiSelection
  },
  data () {
    return {
      fetchingMerakiOrgs: false
    }
  },
  computed: {
    vendorChoices () {
      return [
        // {
        //   value: this.importOptions.aruba,
        //   text: 'Aruba ALE'
        // },
        {
          value: this.importOptions.meraki,
          text: 'Meraki'
        }
      ]
    },
    isMeraki () {
      return this.value.type === this.importOptions.meraki
    },
    isAruba () {
      return this.value.type === this.importOptions.aruba
    }
  },
  methods: {
    changeType (newType) {
      const value = { ...this.value }
      this.$set(value, 'type', newType)
      this.$emit('input', value)
    },
    changeValue (newValue) {
      const value = { ...this.value }
      if (this.isMeraki) {
        this.$set(value, 'selectedMerakiOrg', newValue)
      } else if (this.isAruba) {
        this.$set(value, 'selectedAleId', newValue)
      }
      this.$emit('input', value)
    },
    submit (createSites) {
      if (this.isMeraki) {
        return this.$refs.meraki.submit(createSites)
      } else {
        return this.$refs.aruba.submit(createSites)
      }
    },
    loadingMeraki (value) {
      this.fetchingMerakiOrgs = value
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
