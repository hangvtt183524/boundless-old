<template lang='pug'>
  v-app.layout-main(
    :class="{'layout-main--full-width': isFullWidthMode}"
    data-test='logged-in' v-if="!loading"
  )
      left-navigation()
      .overlay(
        :class="{'visible': drawer}"
        @click.stop="toggleDrawer")
      .layout-main-content
        toolbar(
          @tabBarStateChange="onTabBarStateChange"
        )

        v-content(
          :class="{'has-tab-bar': hasTabBar}"
        )
          v-container.main-container(fluid, :loading="loading")
            v-layout
              router-view
        // v-footer(app)

        activity-indicator(:show="showActivityIndicator")

        no-permissions-info-modal(
          :show="showNoPermissionsModal",
          @close="closeNoPermissionsModal"
        )
        security-check-failure-info-modal(
          :show="showSecurityCheckFailureInfoModal",
          @close="closeSecurityCheckFailureInfoModal"
        )

  // Loading screen
  v-app(v-else)
    v-container.main-container(fill-height)
      b-loader

</template>

<script>
import * as $ from 'jquery'
import { mapGetters, mapActions } from 'vuex'
import { NODE_LIST_CHANGE_EVENT, ORGANIZATION_DELETE_EVENT } from '@/constants/events'

import BLoader from '@/components/common/b-loader.vue'
import activityIndicator from '../common/activity-indicator.vue'
import leftNavigation from '../layout/left-navigation.vue'
import toolbar from '../layout/toolbar.vue'

import toggleDrawer from '@/mixins/toggle-drawer.mixin'
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import NodeSelectionsMixin from '@/mixins/node-selections.mixin'

import NoPermissionsInfoModal from '@/components/organization/no-permissions-info-modal'
import SecurityCheckFailureInfoModal from '@/components/organization/security-check-failure-info-modal'

import HelpCrunchService from '@/services/helpcrunch'
import { EventTracker } from '@/services/event-tracker'

export default {
  name: 'LayoutMain',

  components: {
    BLoader,
    leftNavigation,
    toolbar,
    activityIndicator,
    SecurityCheckFailureInfoModal,
    NoPermissionsInfoModal
  },

  mixins: [
    toggleDrawer,
    UserPermissionsMixin,
    NodeSelectionsMixin
  ],

  data () {
    return {
      loading: true,
      hasTabBar: false,
      showNoPermissionsModal: false,
      showSecurityCheckFailureInfoModal: false,
      awaitingOrganizationSwitchChecks: false
    }
  },

  computed: {
    ...mapGetters(['showActivityIndicator']),
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('workspace/network', ['userDashboards']),
    ...mapGetters('workspace', ['userSecurityChecks']),
    ...mapGetters('layout', ['userOrganizationNodes', 'selectedOrganizationDataFetched', 'menu']),
    ...mapGetters(['drawer']),

    isFullWidthMode () {
      return this.userWorkspaces.length === 0
    }
  },

  mounted () {
    this.bootstrap().then(() => {
      this.$store.dispatch('user/fetchUserRoles', this.currentUser.id)
        .finally(() => {
          this.performPermittedProductChecks()

          this.loading = false
        })
    })

    // Fetch list of workspaces
    this.fetchUserWorkspaces().then((response) => {
      if (response.data.data.length === 0) {
        // No workspaces for user, open workspace creation page
        this.openWorkspaceCreatePage()
      }

      this.selectActiveWorkspace()
    })

    this.initializeUI()

    // Initialize and show chat widget on main layout
    HelpCrunchService.showWidget()

    this.$eventHub.$on(NODE_LIST_CHANGE_EVENT, this.fetchCurrentOrganizationManagedNodes)
    this.$eventHub.$on(ORGANIZATION_DELETE_EVENT, this.reloadWorkspaceOrganizations)
  },

  beforeDestroy () {
    this.$eventHub.$off(NODE_LIST_CHANGE_EVENT)

    // Hide chat widget when leaving main layout
    HelpCrunchService.hideWidget()
  },

  watch: {
    currentUser (user) {
      if (user && user.profile && user.profile.language) {
        this.$i18n.locale = user.profile.language
      }

      if (user && user.profile) {
        // Identify user in event tracker
        EventTracker.identifyUser(user.email, {
          email: user.email,
          firstName: user.profile.first_name ? user.profile.first_name : '',
          lastName: user.profile.last_name ? user.profile.last_name : '',
          user_uuid: user.secret_id
        })

        // If help crunch integration is set, set its user and language
        if (window.HelpCrunch) {
          HelpCrunchService.updateUser({
            user_id: user.secret_id,
            email: user.email,
            name: user.profile.full_name ? user.profile.full_name : '',
            phone: user.profile.phone ? user.profile.phone : ''
          })

          if (user.profile.language) {
            HelpCrunchService.setLanguage(user.profile.language)
          }
        }

        // If Pendo integration is set, identify user in pendo
        if (window.pendo) {
          window.pendo.initialize({
            visitor: {
              id: user.secret_id,
              email: user.email,
              full_name: user.profile.full_name ? user.profile.full_name : ''
            },
            account: {
              id: this.workspaceId
            }
          })
        }
      }
    },

    selectedWorkspace (value, oldValue) {
      if (value.id && (!oldValue || value.id !== oldValue.id)) {
        // Workspace changed, load workspace organizations, if not initial load
        if (oldValue && oldValue.id) {
          this.reloadWorkspaceOrganizations().then(() => {
            // If on an organization product, redirect to organization node
            if (this.isOnOrganizationProduct) {
              if (this.selectedOrganization.id !== null) {
                this.redirectToNode(this.selectedOrganization, this.selectedOrganization.id)
              } else {
                // No workspace organizations, open organization creation page
                this.openOrganizationCreatePage()
              }
            }
          })
        }

        // On workspace change, fetch user dashboards if not fetched
        if (!this.userDashboards.hasOwnProperty(value.id)) {
          this.fetchUserDashboards({ workspaceId: value.id })
        }

        // Identify user here to set its organization field
        EventTracker.identifyUser(this.currentUser.email, {
          email: this.currentUser.email,
          firstName: this.currentUser.profile.first_name,
          lastName: this.currentUser.profile.last_name,
          user_uuid: this.currentUser.secret_id
        })
      }

      if (window.FS) {
        window.FS.identify(this.currentUser.id, {
          orgName: value.name,
          userName: this.currentUser.profile.full_name,
          email: this.currentUser.email
        })
      }

      // If help crunch integration is set, set user organization data
      if (window.HelpCrunch) {
        HelpCrunchService.setCustomData({
          organization: (value && value.name) ? value.name : ''
        })
      }
    },

    selectedOrganization (value, oldValue) {
      if (value.id && (!oldValue || value.id !== oldValue.id)) {
        // On organization change, fetch organization nodes
        this.fetchCurrentOrganizationManagedNodes().then(() => {
          // Call selectNode even if node has not changed here to update selected node fields
          if (this.selectedOrganizationDataFetched) {
            this.performOrganizationSwitchChecks()
          } else {
            // Full organization data not fetched yet, set this flag so that we can perform checks once data fetched
            this.awaitingOrganizationSwitchChecks = true
          }
        })
      }
    },

    selectedNode (value, oldValue) {
      if (value && oldValue && value.id && oldValue.id && (value.id !== oldValue.id)) {
        // On node change for correction, redirect to node if we are on an organization product
        if (value.correction === true && this.isOnOrganizationProduct) {
          this.redirectToNode(this.selectedOrganization, value.id)
        }
      }
    },

    selectedOrganizationDataFetched (value) {
      if (value && this.awaitingOrganizationSwitchChecks) {
        // Awaiting organization switch checks perform them
        this.performOrganizationSwitchChecks()
      }
    },

    userSecurityChecks (value, oldValue) {
      if (value && value.success === false) {
        // Security checks updated to failure status. Display info modal.
        this.openSecurityCheckFailureInfoModal()
      }
    },

    $route: {
      handler: function (newValue, oldValue) {
        // Set active product depending on current url
        const routeProducts = this.getProductsForRoute(newValue, this.menu)
        if (routeProducts.length > 0 && routeProducts.indexOf(this.activeProductIndex) === -1) {
          // Route belongs to another product than current one. Switch to first one.
          this.setActiveProductIndex(routeProducts[0])
        }
      },
      immediate: true
    },

    menu: {
      handler: function (newValue, oldValue) {
        if (newValue.length > 0 && oldValue.length === 0) {
          // Set active product depending on current url, possible route handler triggered before menu was loaded
          const routeProducts = this.getProductsForRoute(this.$route, this.menu)
          if (routeProducts.length > 0 && routeProducts.indexOf(this.activeProductIndex) === -1) {
            // Route belongs to other products than current one. Switch to first one.
            this.setActiveProductIndex(routeProducts[0])
          }
        }
      }
    },

    activeProductIdentifier: {
      handler: function (newValue, oldValue) {
        if (!!oldValue && newValue !== oldValue &&
          this.isOnOrganizationProduct &&
          this.captivePortalOrganizations.length === 0
        ) {
          // No available organizations, open organization creation screen
          this.openOrganizationCreatePage()
        }
      },
      deep: true
    }
  },

  methods: {
    ...mapActions(['bootstrap']),
    ...mapActions('workspace', ['clearWorkspaceUserSecurityChecks']),
    ...mapActions('workspace', ['setPendingInvitationId']),
    ...mapActions('workspace/network', ['fetchUserDashboards']),
    ...mapActions('layout', ['setActiveProductIndex', 'fetchUserWorkspaces', 'fetchUserWorkspaceOrganizations',
      'selectNode']),

    onTabBarStateChange (hasTabBar) {
      this.hasTabBar = hasTabBar
    },
    initializeUI () {
      const width = $(window).width()
      if (width < 1024 && width >= 768) {
        $('body').addClass('sidebar-mini')
      } else {
        $('body').removeClass('sidebar-mini')
      }

      if (width < 768 && this.drawer) {
        this.toggleDrawer()
      }

      $(window).resize((event) => {
        const width = event.target.outerWidth
        if (width < 1024 && width >= 768) {
          $('body').addClass('sidebar-mini')
        } else {
          $('body').removeClass('sidebar-mini')
        }
        if (width >= 768 && !this.drawer) {
          this.toggleDrawer()
        }
      })
    },
    openNoPermissionsModal () {
      this.showNoPermissionsModal = true
    },
    closeNoPermissionsModal () {
      this.showNoPermissionsModal = false
    },
    openSecurityCheckFailureInfoModal () {
      // Close other modals that could be open at this stage
      this.closeNoPermissionsModal()

      this.showSecurityCheckFailureInfoModal = true
    },
    closeSecurityCheckFailureInfoModal () {
      this.showSecurityCheckFailureInfoModal = false

      // Clear security checks in state after closing modal
      this.clearWorkspaceUserSecurityChecks()
    },
    performPermittedProductChecks () {
      // To be called after user roles loaded, if current product is not permitted for user, switches product to first
      // available one
      // Skips if we are on an organization product
      const permittedProducts = this.menu.filter(product => this.isProductPermitted(product))
      if (permittedProducts.length > 0 &&
        permittedProducts.map(product => product.identifier).indexOf(this.activeProduct.identifier) === -1 &&
        !this.isOnOrganizationProduct) {
        // Current product not permitted, switch
        const productIndex = this.menu.indexOf(permittedProducts[0])

        this.setActiveProductIndex(productIndex)
        this.redirectToProductDefaultPage(this.menu[productIndex])
      }
    },
    performOrganizationSwitchChecks () {
      // Update flag to false
      this.awaitingOrganizationSwitchChecks = false

      if (this.showSecurityCheckFailureInfoModal === true) {
        // If security check modal is open, do not perform other checks
        return false
      }

      if (!this.hasAnyOrganizationPermission()) {
        // Show related info modal if user has no permissions for current organization
        this.openNoPermissionsModal()
      }
    },
    reloadWorkspaceOrganizations () {
      // To be called when organizations deleted or selected workspace changed, re-loads workspace organizations
      // and if selected organization is not in the list, selects a new one

      return new Promise((resolve) => {
        this.fetchUserWorkspaceOrganizations({ workspaceId: this.workspaceId }).then(() => {
          const workspaceOrganizationIds = this.captivePortalOrganizations.map(organization => organization.id)
          if (workspaceOrganizationIds.indexOf(this.selectedOrganizationId) === -1) {
            // We deleted selected organization, select another organization
            const workspaceOrganization = this.captivePortalOrganizations[0]
            if (workspaceOrganization) {
              this.selectOrganization(workspaceOrganization)
              this.selectNode({ id: workspaceOrganization.id })
            } else {
              // No workspace organizations
              this.clearOrganizationSelections()
            }
          }

          resolve()
        })
      })
    },
    openWorkspaceCreatePage () {
      this.$router.push({ name: 'CreateWorkspace' })
    },
    openOrganizationCreatePage () {
      this.$router.push({ name: 'CreateOrganizationModeSelect' })
    }
  }
}
</script>

<style lang="scss">
@import "styles/colors.scss";
@import "styles/v2/colors.scss";

.layout-main {
  // Add strict padding-top because Vuetify doesn't size the content with 2 toolbars properly
  .application--wrap {
    display: block;
    position: relative;
    top: 0;
    height: 100vh;
    overflow-x: hidden;
  }
  .overlay {
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.5);
    z-index: 99;
    position: fixed;
    display: none;
    @media (max-width: 767px) {
      &.visible {
        display: block;
        touch-action: none;
      }
    }
  }
  .v-content {
    padding-top: 85px !important;
    padding-left: 0 !important;
    max-height: 100vh;
    overflow-y: auto;

    @media (max-width: 767px) {
      padding-top: 125px !important;
    }

    &.has-tab-bar {
      padding-top: 130px !important;

      @media (max-width: 767px) {
        padding-top: 170px !important;
      }
    }
  }

  .main-container {
    padding-left: 30px !important;
    padding-right: 30px !important;
    padding-top: 0;
    padding-bottom: 30px;

    background: $gray-xlight;
  }

  .page-content {
    width: 100%;
    // margin-top: 55px;

    &.no-margin {
      margin-top: 0;
    }
  }

  .layout-main-content {
    position: relative;
    width: calc(100% - 265px);
    right: 0;
    height: 100%;
    float: right;
    z-index: 100;
    @media (min-width: 768px) and (max-width: 1024px) {
      width: calc(100% - 60px);
    }
    @media (max-width: 767px) {
      width: 100%;
    }
  }

  &--full-width {
    .layout-main-content {
      width: 100%;

      @media (min-width: 768px) and (max-width: 1024px) {
        width: 100%;
      }
    }
  }

  .v-tooltip__content {
    margin-top: 5px;
    padding: 3px 8px;
    &:before,
    &:after {
      display: none;
    }
    span {
      color: #FFF !important;
      font-size: 14px !important;
    }
  }
}

</style>
