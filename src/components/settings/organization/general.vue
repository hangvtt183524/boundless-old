<template lang="pug">
  .general-settings(data-test="settings-general-page")
    .gemeral-settings__content
      organization-name-setting-item(
        v-if="hasPermission('organizations__rename', selectedOrganization.id)"
      )
      delete-organization-data-setting-item(
        v-if="hasPermission('organizations__delete', selectedOrganization.id)"
      )

</template>

<script>
import { mapGetters } from 'vuex'

import OrganizationNameSettingItem from './organization-name-setting-item'
import DeleteOrganizationDataSettingItem from './delete-organization-data-setting-item'

import UserPermissionsMixin from '@/mixins/user-permissions.mixin'

export default {
  components: {
    DeleteOrganizationDataSettingItem,
    OrganizationNameSettingItem
  },
  mixins: [
    UserPermissionsMixin
  ],
  computed: {
    ...mapGetters('layout', ['selectedOrganization'])
  }
}
</script>

<style lang="scss">
  @import "styles/v2/colors.scss";

  .general-settings {
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
