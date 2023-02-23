<template lang="pug" xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  setting-item.delete-organization-data-setting-item(
    :is-set-up="null"
    :title="$t('v2.organization.settings.deleteOrganizationTitle')"
    :description="$t('v2.organization.settings.deleteOrganizationDescription')"
  )
    template(v-slot:actions)
      base-button(
        class="base-button--danger--negative"
        @click="onDeleteClick"
      ) {{ $t('v2.organization.settings.deleteThisOrganization') }}

    template(v-slot:content)
      delete-confirm-dialog(ref="confirm")
      delete-success-dialog(:show="deleteSuccess")
      delete-progress-dialog(v-model="deletingOrganization")

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import SettingItem from '../setting-item.vue'
import BaseButton from '@/components/v2/base-button/base-button'
import DeleteConfirmDialog from '../delete-confirm-dialog'
import DeleteSuccessDialog from '../delete-success-dialog'
import DeleteProgressDialog from '../delete-progress-dialog'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'delete-organization-data-setting-item',
  components: {
    BaseButton,
    SettingItem,
    DeleteConfirmDialog,
    DeleteSuccessDialog,
    DeleteProgressDialog
  },
  data () {
    return {
      deletingOrganization: false,
      deleteSuccess: false
    }
  },
  computed: {
    ...mapGetters('layout', ['selectedOrganization'])
  },
  methods: {
    ...mapActions('organization', ['deleteOrganization']),
    onDeleteClick () {
      const options = {
        color: 'error',
        width: 536,
        confirmText: `${this.$t('organization.deleteResponse')} ${this.selectedOrganization.name}`,
        deleteButtonText: this.$t('organization.deleteThisOrganizationPermanently')
      }
      this.$refs.confirm.open(this.$t('organization.deletingOrganization'), options).then((confirm) => {
        if (confirm) {
          this.deletingOrganization = true
          this.deleteOrganization(this.selectedOrganization.id).then(response => {
            setTimeout(() => (this.deleteSuccess = true), 300)
          }).catch(() => {
            global.toastr['error'](this.$t('general.errorOccurred'), this.$t('general.error'))
            this.deletingOrganization = false
          })

          EventTracker.sendEvent(EVENT_NAMES.ORGANIZATION_DELETED)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

  .delete-organization-data-setting-item {
    .base-button {
      width: 254px;
    }
  }
</style>
