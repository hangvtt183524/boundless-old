<template lang="pug">
  .application-configuration-page.page-content
    .application-configuration-page__header
      .application-configuration-page__header__back-link-container
        v-icon.application-configuration-page__header__back-link-container__back-icon(
          @click="onBackClick"
        ) keyboard_backspace
      h4.application-configuration-page__header__title
        | {{ $t('v2.access.configureOrganizations') }}
      base-button.base-button--green.application-configuration-page__header__configure-button(
        :disabled="selectedTableItems.length === 0"
        @click="onConfigureClick"
      )
        | {{ $t('v2.access.addOrganizations') }}

    .application-configuration-page__content
      v-layout.application-configuration-page__row(row wrap)
        v-flex.application-configuration-page__column(xs12 lg6)
          .application-configuration-page__options
            .application-configuration-page__options__header
              search-input.application-configuration-page__options__header__search-input(
                v-model="search"
                :placeholder="$t('general.search')"
              )

            .application-configuration-page__options__list
              base-table(
                :items="visibleOrganizationOptions"
                :headers="headers"
                :sortable="false"
                :multi-selectable="true"
                :selected-rows="selectedTableItems"
                :row-clickable="true"
                :selectable-row-filter="selectableRowFilter"
                :clickable-row-filter="selectableRowFilter"
                @rowSelect="onRowSelect"
                @rowDeselect="onRowDeselect"
                @rowClick="onRowClick"
                key="options"
              )

              .application-configuration-page__options__list__loading-indicator(
                v-if="loading"
              )
                v-progress-circular(
                  :size="50"
                  indeterminate
                  color="#15ac2f"
                )

        v-flex.application-configuration-page__column(xs12 lg6)
          .application-configuration-page__selections
            .application-configuration-page__selections__header
              .application-configuration-page__selections__header__title
                | {{ $t('v2.access.selectedOrganizations') }}

            .application-configuration-page__selections__list
              base-table(
                :items="selectedTableItems"
                :headers="headers"
                :sortable="true"
                :actions="selectionTableActions"
                @actionClick="onSelectionTableActionClick"
                :empty-state-message="$t('v2.access.noOrganizationsSelected')"
                key="selections"
              )

    job-tracking-modal(
      :persistent="true"
      display-post-run-messages
      ref="jobTrackingModal"
    )

    configuration-confirm-modal(
      mode="multiple"
      ref="confirmModal"
    )

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import BaseTable from '@/components/v2/base-table/base-table'
import BaseButton from '@/components/v2/base-button/base-button'
import SearchInput from '@/components/v2/search-input/search-input.vue'
import JobTrackingModal from '@/components/v2/job-tracking-modal/job-tracking-modal.vue'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import ProductOrganizationsMixin from '@/mixins/product-organizations.mixin'
import ConfigurationConfirmModal from './configuration-confirm-modal'

export default {
  name: 'application-configuration',
  components: {
    ConfigurationConfirmModal,
    BaseTable,
    BaseButton,
    SearchInput,
    JobTrackingModal
  },
  mixins: [
    CurrentNodeSelectionsMixin,
    ProductOrganizationsMixin
  ],
  data: function () {
    return {
      loading: false,
      search: null,
      selectedTableItems: [],
      configuredApplications: null,
      headers: [
        {
          text: this.$t('general.organization'),
          value: 'name',
          tooltip: true,
          tooltipFormatter: (value, row) => {
            // Display information on organizations with insufficient access
            return row.max_access === this.fullAccessValue
              ? null
              : this.$t('v2.access.organizationInsufficientAccessTooltip')
          }
        }
      ],
      selectionTableActions: [
        {
          icon: '$vuetify.icons.delete',
          type: 'remove',
          tooltip: this.$t('v2.access.removeFromList')
        }
      ],
      products: ['access_control'],
      fullAccessValue: 'full',
      selectableRowFilter: (row) => {
        // We must have full access to the organization for it to be importable into access control
        return row.max_access === this.fullAccessValue
      }
    }
  },
  mounted () {
    this.fetchManageableOrganizations()
  },
  computed: {
    ...mapGetters('workspace', ['manageableOrganizations']),
    organizationOptions () {
      return this.manageableOrganizations.filter(
        // Filter-out already configured applications.
        organization =>
          this.accessControlOrganizations.map(organization => organization.meraki_organization.meraki_id).indexOf(organization.meraki_id) === -1
      ).map(organization => {
        return {
          name: organization.name,
          id: organization.id,
          max_access: organization.max_access
        }
      }).sort((first, second) => {
        if (first.name.toLowerCase() > second.name.toLowerCase()) {
          return 1
        } else if (second.name.toLowerCase() > first.name.toLowerCase()) {
          return -1
        }

        return 0
      })
    },
    visibleOrganizationOptions () {
      return this.search ? this.organizationOptions.filter(
        organization => organization.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1
      ) : this.organizationOptions
    }
  },
  methods: {
    ...mapActions('workspace/access', ['configureSAMLIDP']),
    ...mapActions('workspace', ['fetchWorkspaceManageableOrganizations']),
    ...mapActions('layout', ['fetchUserWorkspaceOrganizations']),
    ...mapActions('workspace/organization', ['importWorkspaceMerakiOrganizations']),
    fetchManageableOrganizations () {
      const filters = {
        page_size: 0,
        search: this.search,
        workspaceId: this.workspaceId,
        is_imported_external: false,
        inactive_products: this.products
      }

      this.loading = true
      this.fetchWorkspaceManageableOrganizations(filters).finally(() => {
        this.loading = false
      })
    },
    onRowSelect (selectedRows) {
      this.selectedTableItems = [
        ...this.selectedTableItems,
        ...selectedRows
      ]
    },
    onRowDeselect (deselectedRows) {
      this.selectedTableItems = this.selectedTableItems.filter(selectedOrganization => {
        return deselectedRows.map(row => row.id).indexOf(selectedOrganization.id) === -1
      })
    },
    onRowClick (row) {
      if (this.selectedTableItems.indexOf(row) > -1) {
        // Row was selected when clicked, de-select
        this.onRowDeselect([row])
      } else {
        // Row was unselected when clicked, select
        this.onRowSelect([row])
      }
    },
    onSelectionTableActionClick (action, item) {
      this.selectedTableItems = this.selectedTableItems.filter(selectedOrganization => selectedOrganization !== item)
    },
    onConfigureClick () {
      this.$refs.confirmModal.open(null, this.selectedTableItems.length).then(confirm => {
        if (confirm) {
          const organizationIds = this.selectedTableItems.map(selectedOrganization => selectedOrganization.id)
          const organizationMerakiIds = this.manageableOrganizations
            .filter(organization => organizationIds.indexOf(organization.id) > -1)
            .map(organization => organization.meraki_id)

          // Import organizations into access control first, then proceed with configuration
          this.importOrganizations(organizationIds).then(() => {
            // Organizations successfully imported, run configurations now

            // Get Meraki Organization ids for newly imported organizations
            const merakiOrganizationIds = this.accessControlOrganizations
              .filter(organization => organizationMerakiIds.indexOf(organization.meraki_organization.meraki_id) > -1
              )
              .map(organization => organization.meraki_organization.id)
            this.configureOrganizations(merakiOrganizationIds)
          })
        }
      })
    },
    importOrganizations (organizationIds) {
      return new Promise((resolve, reject) => {
        this.importWorkspaceMerakiOrganizations({
          workspaceId: this.workspaceId,
          workspace_api_key_organizations: organizationIds,
          products: this.products
        }).then(response => {
          this.$refs.jobTrackingModal.open(
            response.data.data.id,
            this.$t('organization.connectionProgressTitle'),
            this.$t('organization.connectionProgressDescription')
          ).then(success => {
            if (success) {
              // Re-fetch user organizations, and resolve after they are fetched
              this.fetchUserWorkspaceOrganizations({ workspaceId: this.workspaceId }).then(() => {
                resolve()
              })
            } else {
              reject(new Error('Could not import organizations'))
            }
          })
        })
      })
    },
    configureOrganizations (organizationIds) {
      this.configureSAMLIDP({
        workspaceId: this.workspaceId,
        targets: organizationIds
      }).then(response => {
        this.$refs.jobTrackingModal.open(
          response.data.data.id,
          this.$t('v2.access.deployingUserVendorRole'),
          this.$t('v2.access.deployingUserVendorRoleDescription')
        ).then(success => {
          if (success) {
            // Go back to application listing page
            this.$router.push({ name: 'AccessApplicationList' })
          }
        })
      })
    },
    onBackClick () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .application-configuration-page {
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

      &__title {
        margin-left: 33px;
        line-height: 60px;
        letter-spacing: 1px;
        float: left;
      }

      &__configure-button {
        float: right;
        margin-top: 10px;
        padding: 0 45px;
      }
    }

    &__content {
      padding: 24px 30px;
      box-sizing: border-box;
      height: calc(100vh - 180px);
    }

    &__row:not(:last-child) {
      padding-bottom: 30px;
      margin-bottom: 30px;
      border-bottom: 3px solid $gray-xlight;
    }

    &__options {
      border: 1px solid $gray-light;

      &__header {
        height: 40px;
        overflow: hidden;

        .base-text-input ::v-deep {
          input {
            height: 40px;
            color: $text-dark;
            border: none;
            padding: 9px 54px 9px 35px;
            border-radius: 0;

            &:focus {
              border-color: $green-light;
            }
          }

          .v-icon {
            opacity: 1;
            right: auto;
            left: 8px !important;
            color: $text-medium;
          }

          .search-input__clear-icon {
            display: none;
          }
        }

        .base-select ::v-deep {
          .select-container {
            border-radius: 0;
            border-top-width: 0;
            border-left-width: 0;
            border-bottom-width: 0;
            border-color: $gray-light;
          }

          .options {
            border-color: $gray-light;
          }
        }
      }

      &__option {
        height: 40px;
        line-height: 40px;
        border-bottom: 2px solid $gray-xlight;
        padding: 0 13px;

        .base-check-box {
          line-height: normal;
          margin-top: 10px;
        }
      }

      &__list {
        position: relative;

        .base-table {
          height: 100%;
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
          background-color: rgba($white, 0.6);
        }
      }
    }

    &__selections {
      border: 1px solid $gray-light;

      &__header {
        height: 40px;
        padding: 0 10px;
        overflow: hidden;

        &__title {
          float: left;
          line-height: 40px;
          font-family: Fira Sans;
          font-style: normal;
          font-weight: normal;
          font-size: 14px;
          color: $text-medium;
        }
      }

      &__selection {
        height: 40px;
        line-height: 40px;
        border-bottom: 2px solid $gray-xlight;
        padding: 0 13px 0 40px;
      }
    }
  }

  @media only screen and (min-width: 1264px) {
    .application-configuration-page {
      &__row {
        height: 100%;

        .application-configuration-page__column {
          height: 100%;
        }
      }

      &__options {
        height: 100%;

        &__list {
          height: calc(100% - 40px);
          overflow: hidden;
        }
      }

      &__selections {
        height: 100%;
        margin-left: 30px;

        &__list {
          height: calc(100% - 40px);
          overflow: hidden;

          .base-table {
            height: 100%;
          }
        }
      }
    }
  }

  @media only screen and (max-width: 1263px) {
    .application-configuration-page {
      &__selections {
        margin-top: 30px;
      }
    }
  }

</style>
