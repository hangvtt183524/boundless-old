<template lang="pug">
  v-flex
    v-select(
      v-if="aleIds.length"
      @change="change"
      :items="aleIds"
      :label="$t('general.selectAleId')"
      :value="value"
      required
    )

    p.pt-2(v-if="!aleIds.length")
      | {{ $t('inventory.noAleId') }}.
      | {{ $t('inventory.addAleId') }}
      | {{ $t('inventory.editAleId') }}&nbsp;
      router-link(
        :to="{ name: 'OrganizationSettingsExternalIntegrations' }"
      )
        | {{ $t('general.organizationSettings') }}.

    v-layout(row wrap v-if="!aleIds.length")
      v-flex(xs12)
        add-ale-form

</template>
<script>
import { mapGetters } from 'vuex'

import AddAleForm from '@/components/settings/organization/add-ale-form'

export default {
  props: ['value'],
  components: {
    AddAleForm
  },
  computed: {
    ...mapGetters('layout', ['selectedOrganization']),
    aleIds () {
      return this.selectedOrganization.aruba_ale_ids.map(item => item.aruba_ale_id)
    },
    hasAleId () {
      return this.aleIds.length > 0
    }
  },
  methods: {
    change (selectedAleId) {
      this.$emit('input', selectedAleId)
    },
    submit (createSites) {
      const data = {
        aruba_ale_id: this.value,
        create_sites: createSites
      }
      return this.$store.dispatch('organization/loadArubaDevices', data)
    }
  }
}
</script>
