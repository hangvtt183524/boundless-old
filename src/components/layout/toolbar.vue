<template lang="pug">
  v-toolbar.main-toolbar(color="white darken-3" app fixed data-test="main-toolbar")
    .mobile-top
      img.logo-image(
        data-test="logo"
        :src="logoUrl"
      )
      p.page-title {{ pageTitle }}
      v-toolbar-side-icon.hidden-lg-and-up(@click.stop="toggleDrawer")
    v-navigation-drawer.sidebar-orgselect(
      v-show="isNodeSelectorsVisible"
      dark fixed app stateless
      v-model="drawer"
      :class="{'sidebar-orgselect--large': isOrganizationMenuVisible}"
    )
      organization-selector(
        @menuDisplayStateChange="onOrganizationMenuDisplayStateChange"
      )

    v-navigation-drawer.sidebar-nodeselect(
      v-show="isNodeSelectorsVisible"
      dark fixed app stateless
      v-model="drawer"
      :class="{'sidebar-nodeselect--large': isNodeMenuVisible}"
    )
      group-site-selector(
        :indent-level="0"
        @menuDisplayStateChange="onNodeMenuDisplayStateChange"
      )

    .toolbar-wrap
      .top-menu
        v-spacer
        .top-menu__workspace-name(
          v-if="selectedWorkspace.name"
        )
          | {{ selectedWorkspace.name }}
        top-usermenu-bar

    menu-tab-bar(
      v-if="routeTabs && routeTabs.length > 0"
      :tabs="routeTabs"
      :current-tab="currentRouteTab"
      :selected-org="selectedOrganization"
      :selected-node="selectedNode"
    )
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import toggleNotificationPanel from '@/mixins/toggle-notifications-panel.mixin'
import toggleDrawer from '@/mixins/toggle-drawer.mixin'
import TopUsermenuBar from '../layout/top-usermenu-bar.vue'
import NodeSelectionsMixin from '@/mixins/node-selections.mixin'
import MenuTabBar from '../layout/menu-tab-bar.vue'
import OrganizationSelector from './organization-selector.vue'
import GroupSiteSelector from './group-site-selector.vue'

export default {
  name: 'headerToolbar',

  components: {
    // NavigationBreadcrumbBar,
    TopUsermenuBar,
    MenuTabBar,
    OrganizationSelector,
    GroupSiteSelector
  },

  mixins: [
    toggleNotificationPanel,
    toggleDrawer,
    NodeSelectionsMixin
  ],

  data () {
    return {
      newOrganization: false,
      isOrganizationMenuVisible: false,
      isNodeMenuVisible: false,
      organizationName: '',
      rules: {
        requiredName: (value) => {
          const pattern = /^$|^[a-zA-Z ]+$/
          return pattern.test(value) || this.$t('organization.invalidOrganizationName')
        }
      },
      pageTitle: '',
      captivePortalProductIdentifier: 'captive_portal'
    }
  },

  computed: {
    ...mapGetters(['drawer']),
    ...mapGetters('user', ['currentUser', 'showContactFlag']),

    drawer: {
      get () {
        return this.$store.state.drawer
      },
      set (value) {
        this.$store.commit('UPDATE_DRAWER', value)
      }
    },

    logoUrl () {
      if (this.selectedOrganization.logo && this.selectedOrganization.logo.is_on_dashboard) {
        return this.selectedOrganization.logo.logo_details.url
      } else {
        return require('@/assets/images/boundless-logo.png')
      }
    },
    routeTabs () {
      const tabDetails = this.getCurrentTabData(true)
      if (tabDetails) {
        return tabDetails.tabs
      }

      return null
    },
    currentRouteTab () {
      const tabDetails = this.getCurrentTabData(true)
      if (tabDetails) {
        return tabDetails.currentTab
      }

      return null
    },
    activeProduct () {
      return (this.menu && this.menu.length >= this.activeProductIndex) ? this.menu[this.activeProductIndex] : null
    },
    isNodeSelectorsVisible () {
      return this.activeProductIdentifier === this.captivePortalProductIdentifier &&
        this.userWorkspaceOrganizations.length > 0
    }
  },

  mounted () {
    this.pageTitle = this.$route.meta.title || ''

    // Emit initial tab bar state
    this.$emit('tabBarStateChange', this.routeTabs !== null)
  },

  methods: {
    ...mapActions('auth', ['logout']),
    ...mapActions('user', ['setContactDialogFlag']),

    onOrganizationMenuDisplayStateChange (isVisible) {
      this.isOrganizationMenuVisible = isVisible
    },
    onNodeMenuDisplayStateChange (isVisible) {
      this.isNodeMenuVisible = isVisible
    },
    logoutUser () {
      this.logout()
    },

    createNewOrganization () {
      this.newOrganization = true
    },

    closeCreateNewOrganization () {
      this.newOrganization = false
    },

    getRouteParams () {
      return {
        orgId: (this.selectedOrganization && this.selectedOrganization.id) ? this.selectedOrganization.id : 0,
        nodeId: (this.selectedNode && this.selectedNode.id) ? this.selectedNode.id : 0
      }
    },

    getMenuItemRoutes (menuItem) {
      if (!menuItem.route) {
        return []
      }

      if (typeof menuItem.route === 'object') {
        return Object.values(menuItem.route)
      }

      if (typeof menuItem.route === 'string') {
        return [menuItem.route]
      }

      return []
    },

    getCurrentTabData (strict) {
      // When run in strict mode, tries to find a route that matches current route. When run in non-strict mode, tries
      // to find a route that contains current route

      for (let i = 0; i < this.menu.length; i++) {
        const parent = this.menu[i]

        if (parent.tabs) {
          for (let j = 0; j < parent.tabs.length; j++) {
            const routes = this.getMenuItemRoutes(parent.tabs[j])
            for (let k = 0; k < routes.length; k++) {
              const route = routes[k]

              const menuItemPath = this.$router.resolve({ name: route, params: this.getRouteParams() }).route.path
              if ((strict && route === this.$route.name) ||
                (!strict && menuItemPath && menuItemPath !== '/' && this.$route.path.indexOf(menuItemPath) > -1)) {
                return {
                  tabs: parent.tabs,
                  currentTab: parent.tabs[j]
                }
              }
            }
          }
        }

        if (parent.submenu) {
          for (let j = 0; j < parent.submenu.length; j++) {
            const subMenuItem = parent.submenu[j]

            if (subMenuItem.tabs) {
              for (let k = 0; k < subMenuItem.tabs.length; k++) {
                const routes = this.getMenuItemRoutes(subMenuItem.tabs[k])
                for (let t = 0; t < routes.length; t++) {
                  const route = routes[t]
                  const menuItemPath = this.$router.resolve({ name: route, params: this.getRouteParams() }).route.path

                  if ((strict && route === this.$route.name) ||
                    (!strict && menuItemPath && menuItemPath !== '/' && this.$route.path.indexOf(menuItemPath) > -1)) {
                    return {
                      tabs: subMenuItem.tabs,
                      currentTab: subMenuItem.tabs[k]
                    }
                  }
                }
              }
            }
          }
        }
      }

      if (strict) {
        // If run in strict mode and could not find a route, run again in non-strict mode
        return this.getCurrentTabData(false)
      }

      return null
    }
  },
  watch: {
    '$route' (to, from) {
      this.pageTitle = to.meta.title || ''
    },
    routeTabs: {
      handler: function () {
        this.$emit('tabBarStateChange', this.routeTabs !== null)
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
  @import "styles/colors.scss";
  @import "styles/v2/colors.scss";

  .v-toolbar.main-toolbar {
    box-shadow: none;
    position: absolute !important;
    padding-left: 0 !important;
    height: 55px;
    z-index: 20;
    @media (max-width: 767px) {
      height: 95px;
      position: fixed !important;
    }
    .v-toolbar__content {
      padding: 0 0 0 0;
      height: 100% !important;
      display: flex;
      flex-direction: column;
      @media (max-width: 767px) {
        padding: 0;
      }
      .toolbar-wrap {
        width: 100%;
        height: 100%;
        margin: 0px !important;
        @media (max-width: 767px) {
          height: 40px;
        }
        .top-menu {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;

          &__workspace-name {
            font-family: Overpass;
            font-style: normal;
            font-weight: bold;
            font-size: 14px;
            letter-spacing: 2px;
            color: $text-dark;
          }

          &__logo-container {
            border-right: 1px solid $gray-xlight;
            padding: 0 15px;
            height: 100%;

            @media (max-width: 767px) {
              display: none;
            }

            &__logo {
              height: 35px;
              margin-top: 10px;

              @media (max-width: 767px) {
                height: 30px;
                margin-top: 5px;
              }
            }
          }
        }
        .message-text {
          width: 100%;
          color: #9ba9c4;
          font-size: 14px;
          height: 21px;
        }
      }
      .mobile-top {
        display: none;
        width: 100%;
        height: 55px;
        overflow: hidden;
        background-color: $blue-medium;
        img.logo-image {
          width: 60px;
          height: auto;
          margin-left: 5px;
        }
        p.page-title {
          flex: 1;
          text-align: center;
          color: #FFF;
          font-size: 16px;
          margin-bottom: 0;
        }
        .v-btn {
          color: #FFF;
        }
        @media (max-width: 767px) {
          display: flex;
          align-items: center;
        }
      }
    }
  }

  .v-navigation-drawer.sidebar-orgselect {
    margin-top: 0 !important;
    z-index: 100;
    padding-bottom: 0;
    display: flex;
    flex-direction: column;
    background-color: #FFF !important;
    width: 265px !important;

    &--large {
      width: 350px !important;
      height: 100vh !important;
      z-index: 1000 !important;
      overflow: visible;

      .top-org-selector__selection-trigger {
        box-shadow: 0px 16px 40px rgba(0,0,0,.1);
      }
      .top-org-selector__selection-trigger__splitter {
        border-color: white;
      }
    }

    &.v-navigation-drawer--fixed {
      @media (max-width: 767px) {
        position: fixed;
        top: 0;
        right: 0;
        left: auto;
        width: 265px !important;
        &.v-navigation-drawer--close {
          transform: translateX(300px) !important;
        }
      }
    }
  }

  .v-navigation-drawer.sidebar-nodeselect {
    left: 265px !important;
    margin-top: 0 !important;
    z-index: 100;
    padding-bottom: 0;
    display: flex;
    flex-direction: column;
    background-color: #FFF !important;
    width: 265px !important;

    &--large {
      width: 350px !important;
      height: 100vh !important;
      z-index: 1000 !important;
      overflow: visible;

      .top-group-site-selector__selection-trigger {
        box-shadow: 0px 16px 40px rgba(0,0,0,.1);
      }
      .top-group-site-selector__splitter {
        border-color: white;
      }
    }

    &.v-navigation-drawer--fixed {
      @media (max-width: 767px) {
        position: fixed;
        top: 0;
        right: 0;
        left: auto;
        width: 265px !important;
        &.v-navigation-drawer--close {
          transform: translateX(300px) !important;
        }
      }
    }
  }
</style>
