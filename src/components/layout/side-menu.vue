<template lang="pug">
  .main-menu(v-click-outside="clickedOutside")
    .top-title(
      @click="onProductMenuTriggerClick()"
      :class="{'activated': !isProductMenuOpen, [activeProductItem.class]: true}"
    )
      span(v-if="isProductMenuOpen") {{ $t(`v2.menu.selectProduct`) }}
      span(v-else) {{ $t(`v2.menu.${activeProductItem.translation}`) }}
      .top-title__expand +
      .top-title__separator-line
    .top-product-container(v-if="isProductMenuOpen")
      perfect-scrollbar.main-menu__scroll-area
        .top-product(
          v-for="(menuItem, i) in products"
          v-show="isMenuItemVisible(menuItem) && !menuItem.is_shared_subgroup"
          :key="i"
          app
          @click="selectProduct(i)"
          :class="menuItem.class"
        )
          .top-product__title {{ $t(`v2.menu.${menuItem.translation}`) }}
          .top-product__description {{ menuItem.description }}
    div(v-if="!isProductMenuOpen")
      v-list.top-subgroup-container
        .menu-blocker(
          v-if="isMenuBlocked"
        )
        perfect-scrollbar.main-menu__scroll-area
          component(
            v-for="(subGroupItem, sgindex) in activeProductItem.subgroups"
            :is="subGroupItem.always_open? 'div': 'v-list-group'"
            v-show="isMenuItemVisible(subGroupItem)"
            :class="{'always_open': subGroupItem.always_open}"
            :key="sgindex"
          )
            .v-list__group__header(
              v-if="subGroupItem.always_open"
            )
              v-list-tile.top-subgroup(
                @click.native="redirectLink(getFitSubMenu(subGroupItem, activeProductItem.submenu))"
              )
                .top-subgroup__title-icon
                  img(:src="getSubGroupIcon(subGroupItem)")
                .top-subgroup__title {{subGroupItem.name}}

            template(v-slot:activator v-if="!subGroupItem.always_open")
              v-list-tile.top-subgroup(
                @click.native="redirectLink(getFitSubMenu(subGroupItem, activeProductItem.submenu))"
                :class="{'menu-item': subGroupItem.leaf, 'active-link': fitSubMenuIsActive(subGroupItem, activeProductItem.submenu), 'disabled-item': !fitSubmenuHasActiveRoute(subGroupItem, activeProductItem.submenu)}"
              )
                v-list-tile-action.top-subgroup__title-icon
                  img(:src="getSubGroupIcon(subGroupItem)")
                v-list-tile-title.top-subgroup__title
                  span {{subGroupItem.name}}
                  .top-subgroup__title__expand(
                    v-if="!subGroupItem.leaf"
                  ) +

            v-list-tile(
              v-for="(subMenuItem, index) in subGroupItem.submenu"
              v-if="!subGroupItem.leaf"
              v-show="isMenuItemVisible(subMenuItem)"
              :key="index"
              @click.native="redirectLink(subMenuItem)"
              :class="{'menu-item': true, 'submenu-item': true, 'active-link': menuIsActive(subMenuItem), 'disabled-item': !hasActiveRoute(subMenuItem)}"
            )
              v-list-tile-title.top-subgroup-item(v-text="subMenuItem.title ? subMenuItem.title : $t(`v2.menu.${subMenuItem.translation}`)")
</template>

<script>
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'

import MenuItemDisplayConditionsMixin from '@/mixins/menu-item-display-conditions.mixin'
import NodeSelectionsMixin from '@/mixins/node-selections.mixin'
import toggleDrawer from '@/mixins/toggle-drawer.mixin'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  mixins: [
    MenuItemDisplayConditionsMixin,
    NodeSelectionsMixin,
    toggleDrawer
  ],
  data () {
    return {
      isProductMenuOpen: false
    }
  },
  computed: {
    ...mapGetters('user', ['currentUser']),
    ...mapGetters(['drawer']),
    ...mapGetters('layout', ['activeProductIndex']),
    ...mapGetters('workspace/network', ['userDashboards']),

    products () {
      return this.menu.map(product => {
        return {
          ...product,
          subgroups: product.subgroups.map(subgroup => {
            return {
              ...subgroup,
              submenu: product.submenu.filter(submenuItem => {
                return submenuItem.subgroup === subgroup.name
              }).map(submenuItem => {
                return {
                  ...submenuItem,
                  type: 'submenu'
                }
              }),
              type: 'subgroup'
            }
          }),
          type: 'product'
        }
      })
    },
    activeProductItem () {
      const activeProductItem = this.products[this.activeProductIndex]

      // If active product has dashboards menu, add user dashboards
      const dashboardsSubGroup = activeProductItem.subgroups.find(subGroup => subGroup.name === 'dashboards')
      if (dashboardsSubGroup) {
        return {
          ...activeProductItem,
          subgroups: activeProductItem.subgroups.map(subGroup => {
            if (subGroup.name === 'dashboards') {
              return {
                ...dashboardsSubGroup,
                submenu: dashboardsSubGroup.submenu.concat((this.getActiveUserDashboards() || []).map(userDashboard => {
                  return {
                    'subgroup': 'dashboards',
                    'title': userDashboard.name,
                    'route': 'UserDashboard',
                    'route_parameters': {
                      'dashboardId': userDashboard.id
                    }
                  }
                }))
              }
            }

            return subGroup
          })
        }
      }

      return activeProductItem
    },

    isMenuBlocked () {
      return this.isOnOrganizationProduct && this.userWorkspaceOrganizations.length === 0
    }
  },
  methods: {
    ...mapActions('auth', ['logout']),
    ...mapActions('user', ['setContactDialogFlag']),
    ...mapActions('layout', ['setActiveProductIndex']),

    clickedOutside () {
      this.isProductMenuOpen = false
    },

    onProductMenuTriggerClick () {
      this.isProductMenuOpen = !this.isProductMenuOpen

      if (this.isProductMenuOpen) {
        EventTracker.sendEvent(EVENT_NAMES.PRODUCT_SELECTOR_OPENED)
      }
    },

    selectProduct (index) {
      this.isProductMenuOpen = false
      if (this.activeProductIndex === index) {
        return
      }

      // Active product index is already set on a watcher on current route. Setting here as well to be able to select
      // current product in cases where a path is listed under multiple products.
      this.setActiveProductIndex(index)

      // On product change, redirect to current product default page
      this.redirectToProductDefaultPage(this.menu[index])

      EventTracker.sendEvent(EVENT_NAMES.PRODUCT_SELECTED)
    },

    getFitSubMenu (subGroupItem, submenu) {
      if (!subGroupItem.leaf) {
        return {}
      }
      for (var i = 0; i < submenu.length; i++) {
        if (submenu[i].subgroup === subGroupItem.name) {
          return submenu[i]
        }
      }
      return {}
    },

    getActiveUserDashboards () {
      return this.userDashboards[this.workspaceId]
    },

    redirectLink (subItem, staticRouterName = '') {
      // Global route params + menu item-specific route params
      const routeParams = {
        ...this.getRouteParams(),
        ...(subItem.route_parameters || {})
      }

      if (!staticRouterName) {
        if (subItem.route) {
          this.$router.push({ name: this.getMenuItemRoute(subItem), params: routeParams, query: this.getRouteQuery(subItem) })
        } else if (subItem.tabs && subItem.tabs.length > 0) {
          // Open first tab
          for (let i = 0; i < subItem.tabs.length; i++) {
            const tab = subItem.tabs[i]
            if (this.isMenuItemPermitted(tab) && tab.route) {
              this.$router.push({ name: this.getMenuItemRoute(tab), params: routeParams, query: this.getRouteQuery(subItem) })
              break
            }
          }
        }
      } else {
        this.$router.push({ name: staticRouterName })
      }
    },
    menuIsActive (subItem) {
      if (!subItem) {
        return false
      }

      // Current route directly matches menu item
      if ((this.getMenuItemRoute(subItem) === this.$route.name) &&
        (!subItem.route_parameters || _.some([this.$route.params], subItem.route_parameters))) {
        return true
      }

      // Current route matches one of menu item's tabs
      if ((subItem.tabs && subItem.tabs.map(tab => this.getMenuItemRoute(tab)).indexOf(this.$route.name) > -1)) {
        return true
      }

      // Current route path contains menu item or one of its tabs
      const menuItems = [subItem, ...(subItem.tabs || [])].filter(item => !!item.route)
      const commonRouteParams = this.getRouteParams()
      for (let i = 0; i < menuItems.length; i++) {
        const menuItem = menuItems[i]
        const routeParams = {
          ...commonRouteParams,
          ...(menuItem.route_parameters || {})
        }

        const routePath = this.$router.resolve({ name: this.getMenuItemRoute(menuItem), params: routeParams }).route.path

        if (!routePath || routePath === '/') {
          // Paths resolve to root when first loading the page
          continue
        }

        if (this.$route.path.indexOf(routePath) > -1) {
          return true
        }
      }

      return false
    },
    fitSubMenuIsActive (subGroupItem, submenu) {
      let menuItem = this.getFitSubMenu(subGroupItem, submenu)
      return this.menuIsActive(menuItem)
    },
    fitSubmenuHasActiveRoute (subGroupItem, submenu) {
      let menuItem = this.getFitSubMenu(subGroupItem, submenu)
      return this.hasActiveRoute(menuItem)
    },
    hasActiveRoute (subItem) {
      const routeParams = {
        ...this.getRouteParams(),
        ...(subItem.route_parameters || {})
      }

      // TODO: this is generating lots of warnings for `missing param for named route "": Expected "" to be defined`
      const link = this.$router.resolve({
        name: this.getMenuItemRoute(subItem),
        params: routeParams
      })

      if (link && link.href !== '/') {
        return true
      }

      return false
    },
    closeMenu (index) {
      setTimeout(() => {
        this.setInvisibleSubMenu()
      },
      300)
    },
    openMenu (index) {
      setTimeout(() => {
        if (
          (document.querySelector(`.menuItems-${index - 1} .sub-menu`) &&
          document.querySelector(`.menuItems-${index - 1} .sub-menu`).style.visibility === 'visible') ||
          (document.querySelector(`.menuItems-${index + 1} .sub-menu`) &&
          document.querySelector(`.menuItems-${index + 1} .sub-menu`).style.visibility === 'visible')
        ) {
          document.querySelector(`.menuItems-${index} .sub-menu`).style.visibility = 'none'
        } else {
          document.querySelector(`.menuItems-${index} .sub-menu`).style.visibility = 'visible'
        }
      },
      300)
    },
    setInvisibleSubMenu () {
      Array.from(Array(this.menu.length)).map((_, ind) => {
        document.querySelector(`.menuItems-${ind} .sub-menu`).style.visibility = 'hidden'
      })
    },
    getRouteQuery (subItem) {
      let query = {}
      if (subItem.keepQuery) {
        query = this.$route.query || {}
      }
      return query
    },
    getMenuIcon (menuItem) {
      if (!menuItem.image) {
        return ''
      }
      return require(`@/assets/images/menu-icons/${menuItem.image}`)
    },
    getSubGroupIcon (subGroupItem) {
      if (!subGroupItem.icon) {
        return ''
      }
      return require(`@/assets/images/menu-icons/${subGroupItem.icon}.svg`)
    },
    openContactDialog () {
      this.toggleDrawer()
      this.setContactDialogFlag(true)
    },
    logoutUser () {
      this.logout()
    }
  }
}
</script>

<style lang="scss">
  @import "styles/v2/colors.scss";

  .top-title {
    height: 55px;
    cursor: pointer;
    background: none;

    font-family: Overpass;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 20px;
    align-items: center;
    color: #FFF;
    padding: 18px;
    user-select: none;
    position: relative;

    &__expand {
      position: absolute;
      right: 20px;
      top: 19px;
      transform: rotate(-45deg);
      transition: transform 0.5s;
    }
    &__separator-line {
      height: 2px;
      width: 100vw;
      position: absolute;
      top: 55px;
      left: 0;
    }

    &.network-management {
      .top-title__separator-line {
        background: linear-gradient(148.06deg, #7671EE 1.43%, #4944C2 89.91%);
      }
    }
    &.captive-portal {
      .top-title__separator-line {
        background: linear-gradient(135.6deg, #28C69F 3.55%, #00AA81 63.15%);
      }
    }
    &.deployment {
      .top-title__separator-line {
        background: linear-gradient(155.12deg, #B31D94 5.12%, #702AB2 110.94%);
      }
    }
    &.boundless-security {
      .top-title__separator-line {
        background: linear-gradient(138.45deg, #2260DD 4.36%, #1146AE 88.54%);
      }
    }
    &.logs {
      .top-title__separator-line {
        background: linear-gradient(135.6deg, #28C69F 3.55%, #00AA81 63.15%);
      }
    }
    &.access {
      .top-title__separator-line {
        background: linear-gradient(138.45deg, #2260DD 4.36%, #1146AE 88.54%);
      }
    }

    &.activated {
      &.network-management {
        background: linear-gradient(148.06deg, #7671EE 1.43%, #4944C2 89.91%);
        .top-title__separator-line {
          background: linear-gradient(148.06deg, #7671EE 1.43%, #4944C2 89.91%);
        }
      }
      &.captive-portal {
        background: linear-gradient(135.6deg, #28C69F 3.55%, #00AA81 63.15%);
        .top-title__separator-line {
          background: linear-gradient(135.6deg, #28C69F 3.55%, #00AA81 63.15%);
        }
      }
      &.deployment {
        background: linear-gradient(155.12deg, #B31D94 5.12%, #702AB2 110.94%);
        .top-title__separator-line {
          background: linear-gradient(155.12deg, #B31D94 5.12%, #702AB2 110.94%);
        }
      }
      &.boundless-security {
        background: linear-gradient(138.45deg, #2260DD 4.36%, #1146AE 88.54%);
        .top-title__separator-line {
          background: linear-gradient(138.45deg, #2260DD 4.36%, #1146AE 88.54%);
        }
      }
      &.logs {
        background: linear-gradient(135.6deg, #28C69F 3.55%, #00AA81 63.15%);
        .top-title__separator-line {
          background: linear-gradient(135.6deg, #28C69F 3.55%, #00AA81 63.15%);
        }
      }
      &.access {
        background: linear-gradient(138.45deg, #2260DD 4.36%, #1146AE 88.54%);
        .top-title__separator-line {
          background: linear-gradient(138.45deg, #2260DD 4.36%, #1146AE 88.54%);
        }
      }
      .top-title__expand {
        transform: rotate(0);
      }
    }
  }
  .top-product {
    height: 169px;
    padding: 27px 32px;
    cursor: pointer;

    &.network-management:hover {
      background: linear-gradient(148.06deg, #7671EE 1.43%, #4944C2 89.91%);
    }
    &.captive-portal:hover {
      background: linear-gradient(135.6deg, #28C69F 3.55%, #00AA81 63.15%);
    }
    &.deployment:hover {
      background: linear-gradient(155.12deg, #B31D94 5.12%, #702AB2 110.94%);
    }
    &.boundless-security:hover {
      background: linear-gradient(138.45deg, #2260DD 4.36%, #1146AE 88.54%);
    }
    &.logs:hover {
      background: linear-gradient(135.6deg, #28C69F 3.55%, #00AA81 63.15%);
    }
    &.access:hover {
      background: linear-gradient(138.45deg, #2260DD 4.36%, #1146AE 88.54%);
    }
    &__title {
      font-family: Overpass;
      font-style: normal;
      font-weight: bold;
      font-size: 18px;
      line-height: 16px;
      align-items: center;
      color: #FFF;
    }
    &__description {
      margin-top: 12px;
      font-family: Overpass;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 20px;
      color: #FFF;
    }
  }
  .top-subgroup-container {
    padding-top: 24px !important;
    height: calc(100vh - 120px);
    position: relative;

    .menu-blocker {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 1;
      background-color: rgba($blue-dark, .9);
    }
  }
  .top-product-container {
    height: calc(100vh - 120px);
  }

  .top-subgroup {
    border-top: solid #173773 1px;
    padding: 0 0 0 24px !important;
    cursor: pointer;

    &__title-icon {
      width: 26px;
    }
    &__title {
      font-family: Overpass;
      font-style: normal;
      font-weight: normal;
      font-size: 15px;
      line-height: 23px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #FFF;
      user-select: none;

      &__expand {
        font-family: Overpass;
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 16px;
        color: #FFF;
        position: absolute;
        right: 0;
        top: 3px;
      }
    }
  }
  .v-list__group__header--active {
    .top-subgroup__title__expand {
      transform: rotate(-45deg);
    }
  }

  .top-subgroup-item {
    padding-left: 32px;
    font-family: Fira Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 18px;
    color: #FFF;
  }
  .sidebar-mini {
    .sidebar-main {
      .main-menu {
        .v-list__group {
          &__header {
            pointer-events: none !important;
            .v-list__tile {
              &__expand__icon {
                display: none;
              }
            }
          }
        }
      }
      &:not(.no-hover):not(.sidebar-main--large):hover {
        width: 245px !important;
        .container-logo .logo-wrapper .thumb {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-right: 18px;
          .close {
            display: block;
          }
          .logo-image {
            margin-left: 10px;
          }
        }
        .main-menu {
          .v-list__group {
            &__header {
              .v-list__tile {
                &__expand__icon {
                  display: block;
                }
              }
            }
            .sidebar-mini-icon {
              display: none;
            }
          }
        }
      }
    }
  }

  .main-menu {
    height: calc(100vh - 65px);
    background-color: #132A54 !important;

    &__scroll-area {
      height: 100%;
      & > :first-child {
        .top-subgroup {
          border-top: none;
        }
      }
    }

    .v-list__group {
      .sidebar-mini-icon {
        display: none;
        @media (min-width: 768px) and (max-width: 1024px) {
          display: block;
        }
      }
      .v-list__tile__action {
        min-width: unset;
        @media (min-width: 768px) and (max-width: 1024px) {
          min-width: 20px;
        }
      }
      &__header {
        &:hover {
          background: linear-gradient(270deg, rgba(#2260DD, 0.5) 0%, rgba(34, 96, 221, 0) 130.57%) !important;
        }
        &--active {
          &:hover {
            background: transparent !important;
          }
          &.v-list__group__header--sub-group .v-list__group__header__prepend-icon .v-icon {
            transform: none;
            color: #FFF;
          }
          .v-list__tile {
            &__expand__icon {
              &:before{ transform: rotate(90deg); }
              &:after{ transform: rotate(180deg); }
            }
          }
        }
        .v-list__group__header__append-icon {
          display: none;
        }
        .menu-icon {
          width: 41px;
          padding-left: 23px;
          padding-right: 0;
          margin-right: 20px;
          min-width: unset;
          color: #FFF !important;
          @media (min-width: 768px) and (max-width: 1024px) {
            padding-left: 22px;
            margin-right: 15px;
          }
          .v-icon {
            font-size: 18px;
          }
        }
        .v-list__tile {
          padding-right: 30px;
          padding-left: 0;
          @media (min-width: 768px) and (max-width: 1024px) {
            padding-right: 24px;
          }
          .v-list__tile__action {
            @media (min-width: 768px) and (max-width: 1024px) {
              min-width: unset;
            }
          }
          &__expand__icon {
            position: relative;
            width: 12px;
            height: 12px;
            opacity: .7;
            &:before,
            &:after{
              content: "";
              position: absolute;
              background-color: #FFF;
              transition: transform 0.25s ease-out;
            }

            /* Vertical line */
            &:before{
              top: 0;
              left: 50%;
              width: 2px;
              height: 12px;
              margin-left: -1px;
            }

            /* horizontal line */
            &:after{
              top: 50%;
              left: 0;
              width: 100%;
              height: 2px;
              margin-top: -1px;
            }
          }
        }
      }
    }

    .always_open {
      .v-list__group__header {
        pointer-events: none !important;
      }
    }
    .v-list__group__header--active:hover {
      background: transparent;
    }

    .menu-item {
      cursor: pointer;

      &:hover {
        background: linear-gradient(270deg, rgba(#2260DD, 0.5) 0%, rgba(34, 96, 221, 0) 130.57%);
      }
      &.active-link {
        background: linear-gradient(270deg, #2260DD 0%, rgba(34, 96, 221, 0) 130.57%);
        position: relative;
        .top-subgroup__title {
          font-weight: bold;
        }
        .top-subgroup-item {
          font-weight: bold;
        }

        &.submenu-item {
          background: linear-gradient(270deg, #2B71FD -14.34%, rgba(34, 96, 221, 0) 148.3%);
        }
        .submenu__expand__icon {
          display: block;
        }
        .v-list__tile:hover {
          background-color: transparent !important;
        }
      }
      &.disabled-item {
        pointer-events: none;
        text-decoration: line-through !important;
      }
    }

    .mobile-side {
      display: none;
      @media (max-width: 767px) {
        display: block;
      }
    }

    .ps .ps__rail-y:hover, .ps .ps__rail-y:focus, .ps .ps__rail-y.ps--clicking {
      background: transparent;
    }
  }
</style>
