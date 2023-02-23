<template lang="pug" xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  setting-item.export-organization-data-setting-item(
    :is-set-up="null"
    :title="$t('v2.organization.settings.exportOrganizationTitle')"
    :description="$t('v2.organization.settings.exportOrganizationDescription')"
  )
    template(v-slot:actions)
      base-button(
        class="base-button--green"
        @click="onExportClick"
        :loading="exporting"
      ) {{ $t('v2.organization.settings.exportAllOrganizationData') }}

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import SettingItem from '../setting-item.vue'
import BaseButton from '@/components/v2/base-button/base-button'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'export-organization-data-setting-item',
  components: {
    BaseButton,
    SettingItem
  },
  data: function () {
    return {
      exporting: false
    }
  },
  computed: {
    ...mapGetters('layout', ['selectedOrganization'])
  },
  methods: {
    ...mapActions('organization', ['exportOrganization']),
    onExportClick () {
      this.exporting = true
      this.exportOrganization(this.selectedOrganization.id).then(response => {
        global.toastr['success'](this.$t('gdpr.successExport'), this.$t('general.success'))
      }).finally(() => {
        this.exporting = false
      })

      EventTracker.sendEvent(EVENT_NAMES.ORGANIZATION_DATA_EXPORTED)
    }
  }
}
</script>

<style lang="scss" scoped>

  .export-organization-data-setting-item {
    .base-button {
      width: 254px;
    }
  }
</style>
