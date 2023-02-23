<template lang="pug">
  .workspace-general-settings(data-test="settings-general-page")
    .workspace-general-settings__content
      workspace-name-setting-item(
        v-if="hasPermission('workspaces__edit', selectedWorkspace.id)"
      )
      delete-workspace-data-setting-item(
        v-if="hasPermission('workspaces__delete', selectedWorkspace.id)"
      )

</template>

<script>
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import DeleteWorkspaceDataSettingItem from './delete-workspace-data-setting-item'
import WorkspaceNameSettingItem from './workspace-name-setting-item'

export default {
  components: {
    DeleteWorkspaceDataSettingItem,
    WorkspaceNameSettingItem
  },
  mixins: [
    UserPermissionsMixin,
    CurrentNodeSelectionsMixin
  ]
}
</script>

<style lang="scss">
  @import "styles/v2/colors.scss";

  .workspace-general-settings {
    width: 100%;

    .organization-setting-item:not(:last-child) {
      border-bottom: 3px solid $gray-xlight;
    }
  }

  .dialog.deleting-org {
    background-color: transparent !important;
    box-shadow: none;
    -webkit-box-shadow: none;
  }
</style>
