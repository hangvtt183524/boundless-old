<template lang="pug">
  .workspace-organization-detail-page.page-content(
    v-if="workspaceOrganization"
  )
    .workspace-organization-detail-page__header
      .workspace-organization-detail-page__header__back-link-container
        v-icon.workspace-organization-detail-page__header__back-link-container__back-icon(
          @click="onBackClick"
        ) keyboard_backspace
      h4.workspace-organization-detail-page__header__page-title
        | {{ workspaceOrganization.name }}
      .workspace-organization-detail-page__header__actions
        base-button.base-button--green.workspace-organization-detail-page__header__actions__action(
          @click="onSaveClick"
          :disabled="!((isOrganizationInfoChanged) && isValid)"
        )
          | {{ $t('general.saveChanges') }}

    .workspace-organization-detail-page__content
      v-layout(row wrap).workspace-organization-detail-page__content__organization-panel
        v-flex(xs12 md6 lg4).workspace-organization-detail-page__content__organization-info-section
          organization-info(
            :workspace-organization="workspaceOrganization"
            :name-update-data="organizationNameUpdateData"
            @nameEditStateChange="onNameEditStateChange"
            @nameInput="onNameInput"
            @deleteFromSystemClick="onDeleteFromSystemClick"
          )

        v-flex(xs12 md6 lg8).workspace-organization-detail-page__content__role-section(
          v-show="workspaceOrganization && workspaceOrganization.id"
        )

      v-layout(row wrap)
        v-flex(xs12)
          activity-log(
            v-if="hasPermission('audit_logs__view', workspaceOrganization.id)"
            :ancestor-id="workspaceOrganization.id"
            :page-size="5"
          )

    .workspace-organization-detail-page__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )

    confirm-modal(
      ref="confirmModal"
    )
    delete-confirm-dialog(ref="deleteConfirm")
    delete-progress-dialog(v-model="deletingOrganization")

</template>
<script>
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import ActivityLog from '@/components/activity-log/activity-log'
import ConfirmModal from '@/components/v2/confirm-modal/confirm-modal'
import { mapActions, mapGetters } from 'vuex'
import OrganizationInfo from './organization-info'
import DeleteConfirmDialog from '@/components/settings/delete-confirm-dialog'
import DeleteProgressDialog from '@/components/settings/delete-progress-dialog'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'
import { ORGANIZATION_DELETE_EVENT } from '@/constants/events'

export default {
  props: {
    workspaceOrganizationId: {
      type: Number
    }
  },
  mixins: [
    UserPermissionsMixin,
    CurrentNodeSelectionsMixin
  ],
  components: {
    DeleteProgressDialog,
    DeleteConfirmDialog,
    OrganizationInfo,
    ActivityLog,
    BaseButton,
    ConfirmModal
  },
  data () {
    return {
      loading: false,
      deletingOrganization: false,
      organizationNameUpdateData: {
        isEditing: false,
        value: '',
        updateErrors: []
      }
    }
  },
  computed: {
    ...mapGetters('layout', ['userWorkspaceOrganizations']),
    workspaceOrganization () {
      return this.userWorkspaceOrganizations.find(item => {
        return item.id === parseInt(this.workspaceOrganizationId)
      })
    },
    isValid () {
      let isValid = true

      if (this.organizationNameUpdateData.isEditing && !this.organizationNameUpdateData.value) {
        isValid = false
      }

      return isValid
    },
    isOrganizationInfoChanged () {
      return (this.organizationNameUpdateData.isEditing &&
        this.organizationNameUpdateData.value !== this.workspaceOrganization.name)
    }
  },
  watch: {
    workspaceOrganization: {
      handler: function (newValue) {
        if (newValue) {
          this.$set(this.organizationNameUpdateData, 'value', newValue.name)
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    ...mapActions('workspace/organization', ['removeWorkspaceOrganization']),
    ...mapActions('organization', ['deleteOrganization', 'updateOrganization']),
    ...mapActions('layout', ['fetchUserWorkspaceOrganizations']),
    onSaveClick () {
      if (!this.isValid) {
        return false
      }

      if (this.isOrganizationInfoChanged) {
        this.updateOrganizationInfo()
      }
    },
    updateOrganizationInfo () {
      const params = {
        id: this.workspaceOrganization.id,
        name: this.organizationNameUpdateData.value
      }

      this.loading = true
      this.updateOrganization(params).then(response => {
        this.$set(this.organizationNameUpdateData, 'value', this.workspaceOrganization.name)

        // Reset organization update state
        this.$set(this.organizationNameUpdateData, 'isEditing', false)

        global.toastr['success'](this.$t('v2.organization.settings.organizationRenameSuccess'), this.$t('general.success'))
      }).finally(() => {
        this.loading = false
      })

      EventTracker.sendEvent(EVENT_NAMES.ORGANIZATION_MODIFIED)
    },
    onDeleteFromSystemClick () {
      const options = {
        color: 'error',
        width: 536,
        confirmText: `${this.$t('organization.deleteResponse')} ${this.workspaceOrganization.name}`,
        deleteButtonText: this.$t('organization.deleteThisOrganizationPermanently')
      }
      this.$refs.deleteConfirm.open(this.$t('organization.deletingOrganization'), options).then((confirm) => {
        if (confirm) {
          this.deletingOrganization = true
          this.deleteOrganization(this.workspaceOrganization.id).then(() => {
            // Trigger re-load of workspace organizations
            this.$eventHub.$emit(ORGANIZATION_DELETE_EVENT)

            // Go to previous page
            this.onBackClick()

            global.toastr['success'](this.$t('v2.workspaces.organizations.deleteFromSystemSuccess'), this.$t('general.success'))
          }).catch(() => {
            global.toastr['error'](this.$t('general.errorOccurred'), this.$t('general.error'))
            this.deletingOrganization = false
          })

          EventTracker.sendEvent(EVENT_NAMES.Workspace_ORGANIZATION_DELETED)
        }
      })
    },
    onNameInput (value) {
      this.$set(this.organizationNameUpdateData, 'value', value)
    },
    onNameEditStateChange () {
      this.$set(this.organizationNameUpdateData, 'isEditing', !this.organizationNameUpdateData.isEditing)

      if (!this.organizationNameUpdateData.editing) {
        // Reset name on cancel edit
        this.organizationNameUpdateData.value = this.workspaceOrganization.name
      }
    },
    onBackClick () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";
  @import "styles/v2/base.scss";

  .workspace-organization-detail-page {
    background-color: $white;
    position: relative;

    &__header {
      height: 60px;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
      padding: 0 30px 0 0;
      overflow: hidden;

      &__back-link-container {
        float: left;
        width: 60px;
        line-height: 60px;
        border-right: 1px solid $gray-xlight;
        text-align: center;

        &__back-icon {
          color: $blue-reserve;
          line-height: 60px;
        }
      }

      &__page-title {
        margin-left: 33px;
        line-height: 60px;
        letter-spacing: 1px;
        float: left;
      }

      &__actions {
        float: right;

        &__action {
          margin: 10px 0 0 13px;
          width: 180px;
        }
      }
    }

    &__content {
      padding: 44px 40px;
      box-sizing: border-box;

      &__organization-panel {
        padding-bottom: 40px;
        border-bottom: 3px solid $gray-xlight;
      }

      &__organization-info-section {
        border-bottom: 1px solid $gray-xlight;
        padding-bottom: 50px;

        @media (min-width: 992px) {
          padding-right: 50px;
          border-bottom: 0;
          padding-bottom: 0;
          border-right: 3px solid $gray-xlight;
        }
      }

      &__role-section {
        @media (min-width: 992px) {
          padding-left: 38px;
        }
      }

      .activity-log {
        margin-top: 27px;
      }
    }

    &__loading-indicator {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(255, 255, 255, 0.6);
    }
  }
</style>
