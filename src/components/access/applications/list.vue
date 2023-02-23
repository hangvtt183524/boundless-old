<template lang="pug">
  .application-list.page-content
    .application-list__top-header
      .application-list__top-header__title
        | {{ $t('v2.access.loginToMerakiOrganizations') }}

      .application-list__top-header__view-modes
        v-btn(
          icon
          @click="onLayoutButtonClick(layouts.row)"
          :class="{'active': layout === layouts.row}"
        )
          v-icon fas fa-th-list
        v-btn(
          icon
          @click="onLayoutButtonClick(layouts.grid)"
          :class="{'active': layout === layouts.grid}"
        )
          v-icon fas fa-th-large

    .application-list__header
      .application-list__header__actions.left
        search-input.base-text-input--small.application-list__header__search-input(
          :placeholder="$t('general.search')"
          v-model="search"
        )

      .application-list__header__actions.right
        base-button.base-button--blue.base-button--rectangular.application-list__header__actions__action(
          v-if="hasPermission('access_control__configure_organization_saml', workspaceId)"
          @click="onAddOrganizationsClick"
        )
          | {{ $t('v2.access.addMerakiOrganization') }}

    .application-list__content
      perfect-scrollbar.application-list__content__scroll-holder(
        :options="{ suppressScrollX: true }"
      )
        .application-list__content__grid-view(
          v-if="layout === layouts.grid"
        )
          application-grid-item(
            v-for="application of filteredOrganizations"
            :key="application.id"
            :application="application"
            :selectable="false"
            :actions="hasPermission('access_control__configure_organization_saml', workspaceId) ? administratorActions : []"
            @click="onApplicationClick(application)"
            @actionClick="onTableActionClick($event, application)"
          )

        .application-list__content__table-container(
          v-if="layout === layouts.row"
        )
          base-table.application-list__content__template-table(
            :items="filteredOrganizations"
            :headers="tableHeaders"
            :actions="tableActions"
            :sortable="false"
            @actionClick="onTableActionClick"
          )

    // Initial white screen to show while state parameters are being loaded
    empty-state.application-list__empty-state(
      v-if="isApplicationsConfigured === null || !currentUser.id"
    )

    // No applications configrued, has permission to configure
    empty-state.application-list__empty-state(
      v-if="userWorkspaceOrganizationsFetched && isApplicationsConfigured === false && hasPermission('access_control__configure_organization_saml', workspaceId)"
      :header-text="$t('v2.access.configureSSO')"
      :message-text="$t('v2.access.configureSSODescription')"
      :actions="[{key: 'configure', text: $t('v2.access.addYourOrganization')}]"
      @actionClick="onEmptyStateActionClick"
    )

    // No applications configrued, no permission to configue
    empty-state.application-list__empty-state(
      v-if="userWorkspaceOrganizationsFetched && isApplicationsConfigured === false && !hasPermission('access_control__configure_organization_saml', workspaceId)"
      :header-text="$t('v2.access.noApplicationsConfigured')"
      :message-text="$t('v2.access.noApplicationsConfiguredDescription')"
    )

    // Has applications configured, no chrome extensioon
    empty-state.application-list__empty-state.empty-state--transparent(
      v-if="isExtensionEmptyStateVisible"
      :header-text="supportsChromeExtensions ? $t('v2.access.installChromeExtension') : $t('v2.access.browserNotSupported')"
      :message-text="supportsChromeExtensions ? $t('v2.access.installChromeExtensionDescription') : $t('v2.access.browserNotSupportedDescription')"
      :actions="supportsChromeExtensions ? [{key: 'extension', text: $t('v2.access.install'), externalLink: extensionUrl}, {key: 'close', text: $t('general.close'), buttonClass: 'base-button--green--negative'}] : [{key: 'close', text: $t('general.close'), buttonClass: 'base-button--green--negative'}]"
      @actionClick="onEmptyStateActionClick"
    )

    .application-list__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )

    configuration-confirm-modal(
      ref="confirmModal"
    )

    disconnect-confirm-modal(
      :workspace-id="workspaceId"
      ref="disconnectConfirmModal"
    )

    job-tracking-modal(
      :persistent="true"
      display-post-run-messages
      ref="jobTrackingModal"
    )

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Bowser from 'bowser'
import BaseTable from '@/components/v2/base-table/base-table.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import SearchInput from '@/components/v2/search-input/search-input'
import EmptyState from '@/components/v2/empty-state/empty-state'

import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import ProductOrganizationsMixin from '@/mixins/product-organizations.mixin'
import ApplicationGridItem from './application-grid-item'
import ApplicationLogoCell from './application-logo-cell'
import JobTrackingModal from '@/components/v2/job-tracking-modal/job-tracking-modal.vue'

import ConfigurationConfirmModal from './configuration-confirm-modal'
import DisconnectConfirmModal from './disconnect-confirm-modal'

const EXTENSION_IDENTIFIER = 'boundlessdigital_extension'
const EXTENSION_INSTALLATION_MESSAGE_KEY = 'is_extension_installed'
const EXTENSION_INSTALLATION_REPLY_KEY = 'is_boundlessdigital_extension_installed'

export default {
  name: 'application-list',
  components: {
    DisconnectConfirmModal,
    ConfigurationConfirmModal,
    ApplicationGridItem,
    EmptyState,
    SearchInput,
    BaseTable,
    BaseButton,
    JobTrackingModal
  },
  mixins: [
    UserPermissionsMixin,
    CurrentNodeSelectionsMixin,
    ProductOrganizationsMixin
  ],
  data () {
    return {
      search: '',
      loading: false,
      page: 1,
      pageSize: 0,
      sortItems: [
        { name: this.$t('media.name'), key: 'name' }
      ],
      layout: 'grid',
      layouts: {
        grid: 'grid',
        row: 'row'
      },
      administratorActions: [
        {
          icon: 'fa-cog',
          type: 'configure',
          tooltip: this.$t('v2.organization.settings.configure'),
          label: this.$t('v2.organization.settings.configure')
        },
        {
          icon: '$vuetify.icons.delete',
          type: 'disconnect',
          tooltip: this.$t('v2.access.disconnect'),
          label: this.$t('v2.access.disconnect')
        },
        {
          icon: 'visibility',
          type: 'preview',
          tooltip: this.$t('v2.access.preview'),
          label: this.$t('v2.access.preview')
        }
      ],
      extensionEnabledBrowsers: ['Chrome', 'Microsoft Edge', 'Firefox'],
      isExtensionEmptyStateVisible: false,
      resolveExtensionCheck: null,
      rejectExtensionCheckTimeout: null
    }
  },
  mounted () {
    this.fetchUserApplications()

    window.addEventListener('message', this.handlePostMessage.bind(this))
  },
  beforeDestroy () {
    window.removeEventListener('message', this.handlePostMessage.bind(this))
  },
  computed: {
    ...mapGetters('workspace/access', ['applications', 'applicationsCount']),
    ...mapGetters('layout', ['userWorkspaceOrganizationsFetched']),
    filteredOrganizations () {
      const sortedApplications = [
        ...this.accessControlOrganizations
      ].filter(organization => {
        // If user is a workspace administrator, display all organizations. Otherwise display only organizations
        // connected to user
        return this.isAdministrator
          ? true
          : this.applications.map(application => application.meraki_organization_id).indexOf(organization.meraki_organization.id) > -1
      }).sort((first, second) => {
        return first.name.toLowerCase() > second.name.toLowerCase()
          ? 1
          : second.name.toLowerCase() > first.name.toLowerCase()
            ? -1
            : 0
      })

      return !this.search ? sortedApplications : sortedApplications.filter(application => {
        return application.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1
      })
    },
    tableHeaders () {
      return [
        {
          text: '',
          value: 'logo_url',
          cellComponent: ApplicationLogoCell,
          sortable: false,
          selectable: false
        },
        {
          text: this.$t('v2.access.merakiOrganization'),
          value: 'name'
        }
      ]
    },
    tableActions () {
      // Construct table actions taking user permissions into account
      let actions = [{
        icon: 'login',
        type: 'login',
        tooltip: this.$t('general.login')
      }]

      if (this.hasPermission('access_control__configure_organization_saml', this.workspaceId)) {
        actions = actions.concat(this.administratorActions)
      }

      return actions
    },
    isApplicationsConfigured () {
      return this.accessControlOrganizations.length > 0
    },
    extensionUrl () {
      const browser = Bowser.getParser(window.navigator.userAgent)
      if (browser.getBrowser().name === 'Firefox') {
        return 'https://addons.mozilla.org/en-US/firefox/addon/boundless-digital-for-meraki/'
      } else {
        // Chrome-based browsers
        return `https://chrome.google.com/webstore/detail/boundless-digital-access/${process.env.VUE_APP_RBAC_EXTENSION_ID}`
      }
    },
    supportsChromeExtensions () {
      const browser = Bowser.getParser(window.navigator.userAgent)
      return this.extensionEnabledBrowsers.indexOf(browser.getBrowser().name) > -1
    },
    isAdministrator () {
      // Has access_control__configure_organization_saml permission at workspace or global level. We do not set acl
      // for administrators when logging in regularly.
      return this.hasPermission('access_control__configure_organization_saml', this.workspaceId)
    }
  },
  watch: {
    workspaceId: {
      handler: function (newValue, oldValue) {
        if (newValue && oldValue && newValue !== oldValue) {
          this.fetchUserApplications()
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('workspace/access', ['fetchApplications', 'getUserApplicationLoginForm', 'getUserACL',
      'configureSAMLIDP', 'disconnectSAMLIDP']),
    ...mapActions('workspace', ['retrieveWorkspaceSetupStatus']),
    ...mapActions('layout', ['fetchUserWorkspaceOrganizations']),
    fetchUserApplications () {
      const filters = {
        workspaceId: this.workspaceId,
        page_size: this.pageSize,
        page: this.page
      }

      this.loading = true
      return this.fetchApplications(filters).finally(() => {
        this.loading = false
      })
    },
    getSAMLApplicationId (organization) {
      const samlApplication = this.applications.find(application => application.meraki_organization_id === organization.meraki_organization.id)
      return samlApplication ? samlApplication.id : null
    },
    configureOrganization (item) {
      return new Promise((resolve, reject) => {
        this.$refs.confirmModal.open(item).then(confirm => {
          if (confirm) {
            this.configureSAMLIDP({
              workspaceId: this.workspaceId,
              targets: [item.meraki_organization.id]
            }).then(response => {
              this.$refs.jobTrackingModal.open(
                response.data.data.id,
                this.$t('v2.access.configuringOrganization'),
                this.$t('v2.access.settingUpAccessControl'),
                this.$t('v2.access.configurationSuccessMessage').replace('{organization_name}', item.name)
              ).then(success => {
                if (success) {
                  // Re-fetch applications and resolve
                  this.fetchUserApplications().then(() => {
                    resolve()
                  })
                } else {
                  reject(new Error('Configuration failed'))
                }
              })
            })
          } else {
            reject(new Error('Configuration cancelled'))
          }
        })
      })
    },
    disconnectOrganization (item) {
      this.$refs.disconnectConfirmModal.open(item).then(confirm => {
        if (confirm) {
          this.disconnectSAMLIDP({
            workspaceId: this.workspaceId,
            targets: [item.meraki_organization.id]
          }).then(response => {
            this.$refs.jobTrackingModal.open(
              response.data.data.id,
              this.$t('v2.access.disconnectingOrganization').replace('{organization_name}', item.name),
              this.$t('v2.access.removingAccessControlConfigurations'),
              this.$t('v2.access.disconnectSuccessMessage').replace('{organization_name}', item.name)
            ).then(success => {
              if (success) {
                // Re-fetch applications
                this.fetchUserApplications()
                this.fetchUserWorkspaceOrganizations({ workspaceId: this.workspaceId })
              }
            })
          })
        }
      })
    },
    onTableActionClick (actionType, item) {
      if (actionType === 'login') {
        this.logIntoApplication(item)
      } else if (actionType === 'configure') {
        this.configureOrganization(item)
      } else if (actionType === 'disconnect') {
        this.disconnectOrganization(item)
      } else if (actionType === 'preview') {
        this.previewApplication(item)
      }
    },
    onApplicationClick (organization) {
      this.loading = true
      this.logIntoApplication(organization)
    },
    logIntoApplication (item) {
      // For administrators, log int without performing extension checks and setting the acl
      if (this.isAdministrator) {
        this.postTargetSelections(item) // Send workspace - organization ids to extension
        this.performLogin(item)

        return
      }

      // Check extension installation state first
      this.checkExtensionInstallation().then(() => {
        // Get user acl
        this.getUserACL().then(response => {
          window.postMessage({
            from: 'boundlessdigital_com',
            key: 'acl',
            value: response.data.data
          }, '*')

          // Log into the application
          this.postTargetSelections(item) // Send workspace - organization ids to extension
          this.performLogin(item)
          this.loading = false
        })
      }).catch(() => {
        this.isExtensionEmptyStateVisible = true
        this.loading = false
      })
    },
    previewApplication (item) {
      // Check extension installation state first
      this.checkExtensionInstallation().then(() => {
        // Set preview mode for extension
        window.postMessage({
          from: 'boundlessdigital_com',
          key: 'preview_mode',
          value: true
        }, '*')

        // Log into the application
        this.postTargetSelections(item) // Send workspace - organization ids to extension
        this.performLogin(item)
      }).catch(() => {
        this.isExtensionEmptyStateVisible = true
      })
    },
    performLogin (item) {
      const samlApplicationId = this.getSAMLApplicationId(item)
      if (!samlApplicationId) {
        // Organization imported into access control, but saml configuration is not done.
        // For administrators, configure saml and then login. For delegate users, display a warning message
        if (this.isAdministrator) {
          this.configureOrganization(item).then(() => {
            // Configuration complete, log in now
            this.performLogin(item)
          })
        } else {
          global.toastr['error'](this.$t('v2.access.applicationNotConfiguredWarningMessage'), this.$t('general.error'))
        }

        this.loading = false
        // Do not proceed
        return
      }

      this.getUserApplicationLoginForm({
        workspaceId: this.workspaceId,
        applicationId: samlApplicationId
      }).then((response) => {
        // Open a new tab with html received in the response
        window.open(URL.createObjectURL(
          new Blob([response.data], { type: 'text/html' })
        ), '_blank')
        this.loading = false
      })
    },
    postTargetSelections (item) {
      // Sends workspace id and organization Meraki id to extension
      window.postMessage({
        from: 'boundlessdigital_com',
        key: 'workspace_id',
        value: this.workspaceId
      }, '*')

      window.postMessage({
        from: 'boundlessdigital_com',
        key: 'organization_meraki_id',
        value: {
          meraki_id: item.meraki_organization.meraki_id,
          organization_url: item.meraki_organization.dashboard_url
        }
      }, '*')
    },
    checkExtensionInstallation () {
      window.postMessage({
        from: 'boundlessdigital_com',
        key: EXTENSION_INSTALLATION_MESSAGE_KEY,
        value: true
      }, '*')

      return new Promise((resolve, reject) => {
        this.resolveExtensionCheck = resolve

        // If we don't hear back from the extension for 500ms, decide that it is not installed
        this.rejectExtensionCheckTimeout = setTimeout(() => {
          this.resolveExtensionCheck = null
          reject(new Error('Extension not installed'))
        }, 500)
      })
    },
    handlePostMessage (event) {
      // Handles "message" events, used to communicate with the extension
      if (event.data.from === EXTENSION_IDENTIFIER &&
        event.data.key === EXTENSION_INSTALLATION_REPLY_KEY &&
        event.data.value
      ) {
        // The extension is installed
        if (this.resolveExtensionCheck) {
          // Clear check reject timeout
          window.clearTimeout(this.rejectExtensionCheckTimeout)

          // We have a resolve method set, call it
          this.resolveExtensionCheck()
        }
      }
    },
    onAddOrganizationsClick () {
      this.$router.push({ name: 'AccessApplicationConfiguration' })
    },
    onLayoutButtonClick (layout) {
      this.layout = layout
    },
    onEmptyStateActionClick (actionType) {
      if (actionType === 'close') {
        this.isExtensionEmptyStateVisible = false
      } else if (actionType === 'extension') {
        this.isExtensionEmptyStateVisible = false
      } else if (actionType === 'configure') {
        // Check if we have api keys, redirect to acl creation page if so. Otherwise, redirect to api key setup page
        this.retrieveWorkspaceSetupStatus({ id: this.workspaceId }).then(response => {
          if (response.data.data.is_set_up) {
            this.$router.push({ name: 'AccessApplicationConfiguration' })
          } else {
            this.$router.push({
              name: 'ExternalApiKeysSetup',
              params: { nextPage: 'AccessApplicationConfiguration', productName: 'access', waitImportCompletion: true }
            })
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.application-list {
  background-color: $white;
  position: relative;

  &__top-header {
    background-color: $white;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    height: 60px;
    padding: 0 26px 0 32px;
    display: flex;
    width: 100%;
    z-index: 1;

    &__title {
      display: inline-block;
      line-height: 60px;
      letter-spacing: 1px;
    }

    &__view-modes {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin: 0 0 0 auto;

      .active.v-btn {
        background: $gray-medium;
        border-radius: 0;
      }

      .v-btn .v-icon {
        color: #9ba9c4;
        font-size: 18px;
      }

      .active.v-btn .v-icon {
        color: $blue-medium;
      }
    }

    @media only screen and (max-width: 767px) {
      padding: 0 5px;
    }
  }

  &__header {
    font-family: Fira Sans;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 22px;
    color: $text-medium;
    display: flex;
    border-bottom: solid 3px #EFF3F8;
    justify-content: space-between;
    align-items: center;
    padding: 0 32px;
    height: 59px;

    .separator {
      display: inline-block;
      width: 1px;
      height: 28px;
      border-right: 1px solid $gray-medium;
    }

    &__actions {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 600px;

      &__action.v-icon {
        color: $blue-dark;
        font-size: 20px;

        &.application-list__header__actions__action--disabled {
          color: $gray-dark;
          cursor: not-allowed;
        }
      }
    }

    &__sort-container {
      display: inline-block;

      .header-sort ::v-deep {
        margin-left: 14px;
        width: 187px;
        display: inline-block;
      }
    }

    &__actions.right {
      justify-content: flex-end;
      flex-wrap: wrap;
      flex: unset;

      .application-list__header__actions__action:not(:first-child) {
        margin-left: 10px;
      }

      .base-button {
        padding: 0 20px;
      }
    }
  }

  &__content {
    padding: 24px 30px;
    box-sizing: border-box;
    height: calc(100vh - 240px);

    &__grid-view {
      max-height: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: flex-start;
      flex: 1;
      border-radius: 5px;
    }

    &__scroll-holder {
      height: 100%;
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
