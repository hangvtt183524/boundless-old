<template lang="pug" xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  setting-item.delete-workspace-data-setting-item(
    :is-set-up="null"
    :title="$t('v2.workspaces.settings.deleteWorkspaceTitle')"
    :description="$t('v2.workspaces.settings.deleteWorkspaceDescription')"
  )
    template(v-slot:actions)
      base-button(
        class="base-button--danger--negative"
        @click="onDeleteClick"
      ) {{ $t('v2.workspaces.settings.deleteThisWorkspace') }}

    template(v-slot:content)
      delete-confirm-dialog(
        ref="confirm"
      )
      delete-success-dialog(
        :show="deleteSuccess"
        :success-message="$t('v2.workspaces.settings.workspaceDeleteSuccess')"
        :redirect-message="$t('v2.workspaces.settings.workspaceDeleteRedirectMessage')"
      )
      delete-progress-dialog(
        v-model="deletingWorkspace"
        :heading-text="$t('v2.workspaces.settings.deleteWorkspaceProgressHeading')"
        :description-text="$t('v2.workspaces.settings.deleteWorkspaceProgressDescription')"
      )

</template>

<script>
import { mapActions } from 'vuex'
import SettingItem from '../setting-item.vue'
import DeleteConfirmDialog from '../delete-confirm-dialog'
import DeleteSuccessDialog from '../delete-success-dialog'
import DeleteProgressDialog from '../delete-progress-dialog'
import BaseButton from '@/components/v2/base-button/base-button'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

export default {
  name: 'delete-workspace-data-setting-item',
  components: {
    BaseButton,
    SettingItem,
    DeleteConfirmDialog,
    DeleteSuccessDialog,
    DeleteProgressDialog
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  data () {
    return {
      deletingWorkspace: false,
      deleteSuccess: false
    }
  },
  methods: {
    ...mapActions('workspace', ['deleteWorkspace']),
    onDeleteClick () {
      const options = {
        color: 'error',
        width: 536,
        confirmText: `${this.$t('organization.deleteResponse')} ${this.selectedWorkspace.name}`,
        deleteButtonText: this.$t('organization.deleteThisOrganizationPermanently')
      }
      this.$refs.confirm.open(this.$t('v2.workspaces.settings.deleteWorkspaceProgressHeading'), options).then((confirm) => {
        if (confirm) {
          this.deletingWorkspace = true
          this.deleteWorkspace({
            id: this.selectedWorkspace.id
          }).then(response => {
            setTimeout(() => (this.deleteSuccess = true), 300)
          }).catch(() => {
            global.toastr['error'](this.$t('general.errorOccurred'), this.$t('general.error'))
            this.deletingWorkspace = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

  .delete-workspace-data-setting-item {
    .base-button {
      width: 254px;
    }
  }
</style>
