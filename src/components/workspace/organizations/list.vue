<template lang="pug">
  .workspace-organization-list-page.page-content
    .workspace-organization-list-page__header
      search-input.base-text-input--small.workspace-organization-list-page__header__search-input(
        :placeholder="$t('v2.workspaces.organizations.searchOrganizations')"
        v-model="search"
        :input-delay="0"
      )

      .base-text-input--small.workspace-organization-list-page__header__actions
        multi-action.multi-action--small.multi-action--blue.workspace-organization-list-page__header__actions__action(
          :actions="actions"
          @actionClick="onActionClick"
          :label="$t('v2.workspaces.organizations.manageOrganizations')"
        )

    .workspace-organization-list-page__content
      perfect-scrollbar.workspace-organization-list-page__content__scroll-holder(
        :options="{ suppressScrollX: true }"
      )
        .workspace-organization-list-page__content__table-container
          base-table.workspace-organization-list-page__content__template-table(
            :items="filteredWorkspaceOrganizations"
            :headers="tableHeaders"
            :actions="tableActions"
            :multi-selectable="isPlatformAdministrator || hasPermission('workspaces__import_organization', workspaceId)"
            @rowSelectionChange="onRowSelectionChange"
            @actionClick="onTableActionClick"
          )

    .workspace-organization-list-page__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )

    create-meraki-organizations-modal(
      :show="isMerakiOrganizationCreationModalVisible"
      @close="closeMerakiOrganizationCreationModal"
    )

    clone-meraki-organization-modal(
      v-if="!!selectedMerakiOrganization"
      :show="isMerakiOrganizationCloneModalVisible"
      :source-organization="selectedMerakiOrganization"
      @close="closeMerakiOrganizationCloneModal"
    )

    confirm-modal(
      ref="confirmModal"
    )

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import BaseTable from '@/components/v2/base-table/base-table.vue'
import MultiAction from '@/components/v2/multi-action/multi-action.vue'
import ConfirmModal from '@/components/v2/confirm-modal/confirm-modal'
import CreateMerakiOrganizationsModal from './create-meraki-organizations-modal'
import CloneMerakiOrganizationModal from './clone-meraki-organization-modal'
import NodeSelectionsMixin from '@/mixins/node-selections.mixin'
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import EmptyOrganizationListCheckMixin from '@/mixins/empty-organization-list-check.mixin'

import SearchInput from '@/components/v2/search-input/search-input'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'
import { ORGANIZATION_DELETE_EVENT } from '@/constants/events'

export default {
  name: 'workspace-organization-list',
  components: {
    CreateMerakiOrganizationsModal,
    CloneMerakiOrganizationModal,
    SearchInput,
    BaseTable,
    MultiAction,
    ConfirmModal
  },
  mixins: [
    NodeSelectionsMixin,
    UserPermissionsMixin,
    EmptyOrganizationListCheckMixin
  ],
  data () {
    return {
      search: '',
      loading: false,
      tableHeaders: [
        {
          text: this.$t('general.name'),
          value: 'name'
        }
      ],
      tableActions: [
        {
          icon: '$vuetify.icons.edit',
          type: 'edit'
        }
      ],
      selectedOrganizations: [],
      ordering: '-created_at',
      isMerakiOrganizationCreationModalVisible: false,
      isMerakiOrganizationCloneModalVisible: false,
      products: ['network_management']
    }
  },
  computed: {
    ...mapGetters('layout', ['userWorkspaceOrganizations']),
    filteredWorkspaceOrganizations () {
      return this.networkManagementOrganizations.filter(workspaceOrganization => {
        return workspaceOrganization.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1
      })
    },
    actions () {
      const actions = []

      if (this.hasPermission('workspaces__import_organization', this.workspaceId)) {
        actions.push({
          type: 'import_workspace_organizations',
          label: this.$t('v2.workspaces.organizations.newWorkspaceOrganization')
        })
      }

      if (this.hasPermission('workspaces__import_organization', this.workspaceId)) {
        actions.push({
          type: 'create_meraki_organizations',
          label: this.$t('v2.workspaces.organizations.createMerakiOrganizations')
        })
      }

      if (this.hasPermission('workspaces__import_organization', this.workspaceId)) {
        actions.push({
          type: 'clone_meraki_organization',
          label: this.$t('v2.workspaces.organizations.cloneMerakiOrganization'),
          disabled: !this.selectedMerakiOrganization
        })
      }

      if (this.isPlatformAdministrator) {
        actions.push({
          type: 'delete_organizations',
          label: this.$t('v2.workspaces.organizations.deleteSelectedOrganizations'),
          disabled: this.selectedOrganizations.length === 0
        })
      }

      return actions
    },
    selectedMerakiOrganization () {
      // Only valid if a single organization is selected and it is connected to Meraki
      return (this.selectedOrganizations.length === 1 && !!this.selectedOrganizations[0].meraki_organization)
        ? this.selectedOrganizations[0] : null
    }
  },
  watch: {
    search: {
      handler: function () {
        // Reset page number
        this.page = 1

        EventTracker.sendEvent(EVENT_NAMES.MANAGED_ORGANIZATIONS_SEARCHED)
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('workspace/organization', ['bulkDeleteOrganizationsFromSystem']),
    ...mapActions('layout', ['fetchUserWorkspaceOrganizations']),
    onTableActionClick (actionType, item) {
      if (actionType === 'edit') {
        this.$router.push({ name: 'OrganizationDetail', params: { workspaceOrganizationId: item.id } })
      }
    },
    onRowSelectionChange (selectedRows) {
      this.selectedOrganizations = selectedRows
    },
    onActionClick (actionKey) {
      if (actionKey === 'import_workspace_organizations') {
        this.onImportWorkspaceOrganizationsClick()
      } else if (actionKey === 'create_meraki_organizations') {
        this.onCreateMerakiOrganizationsClick()
      } else if (actionKey === 'clone_meraki_organization') {
        this.onCloneMerakiOrganizationClick()
      } else if (actionKey === 'delete_organizations') {
        this.onDeleteSelectedOrganizationsClick()
      }
    },
    onDeleteSelectedOrganizationsClick () {
      this.$refs.confirmModal.open(
        this.$t('errors.warning'),
        this.$t('v2.workspaces.organizations.deleteSelectedOrganizationsConfirmation')
      ).then(confirm => {
        if (confirm) {
          this.loading = true
          this.bulkDeleteOrganizationsFromSystem({
            workspaceId: this.workspaceId,
            ids: this.selectedOrganizations.map(organization => organization.id)
          }).then(response => {
            // Trigger re-load of workspace organizations
            this.$eventHub.$emit(ORGANIZATION_DELETE_EVENT)

            global.toastr['success'](this.$t('v2.workspaces.organizations.deleteSelectedOrganizationsSuccess'), this.$t('general.success'))
          }).catch(() => {
            global.toastr['error'](this.$t('v2.workspaces.organizations.deleteSelectedOrganizationsFailure'), this.$t('general.error'))
          }).finally(() => {
            this.loading = false
          })

          EventTracker.sendEvent(EVENT_NAMES.ORGANIZATION_BATCH_DELETED)
        }
      })
    },
    onImportWorkspaceOrganizationsClick () {
      this.$router.push({ name: 'OrganizationImport' })
    },
    onCreateMerakiOrganizationsClick () {
      this.$set(this, 'isMerakiOrganizationCreationModalVisible', true)
    },
    closeMerakiOrganizationCreationModal () {
      this.$set(this, 'isMerakiOrganizationCreationModalVisible', false)
    },
    onCloneMerakiOrganizationClick () {
      this.$set(this, 'isMerakiOrganizationCloneModalVisible', true)
    },
    closeMerakiOrganizationCloneModal () {
      this.$set(this, 'isMerakiOrganizationCloneModalVisible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .workspace-organization-list-page {
    background-color: $white;
    position: relative;

    &__header {
      height: 60px;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
      padding: 0 30px;
      overflow: hidden;

      &__search-input {
        float: left;
        margin-top: 15px;
      }

      &__actions {
        float: right;

        &__action {
          width: 200px;
          margin-top: 14px;
          margin-left: 10px;
        }
      }
    }

    &__content {
      padding: 24px 30px;
      box-sizing: border-box;
      height: calc(100vh - 180px);

      &__scroll-holder {
        height: 100%;
      }

      &__table-container {
        padding: 30px;
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
