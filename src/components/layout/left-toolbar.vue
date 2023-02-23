<template lang="pug">
  .left-toolbar(
    color="white darken-3" app fixed data-test="left-toolbar"
    :class="{'extended-icon-set': visibleSubGroups.length > 4}"
  )
    .toolbar-wrap
      .bottom-menu
        .toolbar-actions
          v-menu.user-menu.action(
            v-for="subGroup of menuSubGroups"
            :key="subGroup.name"
            v-show="isMenuItemVisible(subGroup)"
            v-model="menuFlags[subGroup.name]"
            top left offset-y open-on-hover data-test="user-menu-1" content-class="left-toolbar-custom-user-menu"
          )
            .doc-img-container.d-flex(
              slot="activator"
              :class="{ 'active': menuFlags[subGroup.name] }"
            )
              img.documentation-image(
                :src='require(`@/assets/images/${subGroup.image}`)'
              )

            v-list(
              v-if="subGroup.name !== 'workspaces'"
              data-test="user-menu-list-1" @click.native="stopPropagation"
            )
              v-list-tile.menu-description
                v-list-tile-content
                  v-list-tile-title {{ $t(`v2.menu.${subGroup.translation}`) }}
              v-list-tile(
                v-for="subMenu of subGroup.submenu"
                :key="`${subGroup.name}_${subMenu.translation}`"
                v-show="isMenuItemVisible(subMenu)"
                :to="subMenu.route ? {name: subMenu.route, params: routeNodeParameters} : null"
                :target="subMenu.target ? subMenu.target : ''"
                :class="{'menu-item--active': subMenu.route && menuIsActive(subMenu.route)}"
                @click="onMenuItemClick(subMenu)"
                data-test="item-org-settings-general"
              )
                v-list-tile-content
                  v-list-tile-title {{ $t(`v2.menu.${subMenu.translation}`) }}

            workspace-selector.workspace-selector(
              v-if="subGroup.name === 'workspaces'"
            )

    contact-us-dialog(:show="showContactFlag", @close="setContactDialogState(false)")
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ContactUsDialog from '../contact/contact-us-dialog'
import MenuTabBar from '../layout/menu-tab-bar.vue'
import NodeSelectionsMixin from '@/mixins/node-selections.mixin'
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import MenuItemDisplayConditionsMixin from '@/mixins/menu-item-display-conditions.mixin'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'
import WorkspaceSelector from './workspace-selector'

export default {
  name: 'bottomToolbar',

  mixins: [
    NodeSelectionsMixin,
    UserPermissionsMixin,
    MenuItemDisplayConditionsMixin
  ],

  components: {
    WorkspaceSelector,
    ContactUsDialog,
    MenuTabBar
  },

  data () {
    return {
      showContactDialog: false,
      menuFlags: {},
      documentation_menu: false,
      support_menu: false,
      profile_menu: false,
      user_roles_menu: false,
      supportSubGroupName: 'support'
    }
  },

  mounted () {
    this.initializeMenuFlags()
  },

  computed: {
    ...mapGetters('user', ['currentUser', 'showContactFlag']),
    menuSubGroups () {
      return this.toolbarMenu.subgroups.map(subGroupItem => {
        return {
          ...subGroupItem,
          type: 'subgroup',
          submenu: this.toolbarMenu.submenu.filter(subMenuItem => {
            return subMenuItem.subgroup === subGroupItem.name
          }).map(subMenuItem => {
            return {
              ...subMenuItem,
              type: 'submenu'
            }
          })
        }
      })
    },
    visibleSubGroups () {
      return this.menuSubGroups.filter(menuItem => this.isMenuItemVisible(menuItem))
    }
  },

  methods: {
    ...mapActions('auth', ['logout']),
    ...mapActions('user', ['setContactDialogFlag']),

    initializeMenuFlags () {
      this.menuSubGroups.forEach(subGroup => {
        this.$set(this.menuFlags, subGroup.name, false)
      })

      this.$set(this.menuFlags, 'workspaces', false)
    },

    logoutUser () {
      this.logout()
    },

    setContactDialogState (flag) {
      this.setContactDialogFlag(flag)
    },

    onClickGettingStarted () {
      window.open('https://docs.google.com/document/d/1QGOt47d9G6K8KikkrY0FA_yOIuHef8hWuvqODqEVwaw/preview')
    },

    onClickContactUs () {
      window.open('https://boundlessdigital.crunch.help/')
    },

    onClickMakeAWish () {
      window.open('https://airtable.com/shrdxAN8QeGFz5b6L')
    },

    stopPropagation (event) {
      let classList = event.target.classList
      if (classList.contains('v-list') || event.target.closest('.menu-description')) {
        event.stopPropagation()
      }
    },

    menuIsActive (mainRoute) {
      let subItem = this.toolbarMenu.submenu.find(item => item.route === mainRoute)

      return !!(
        subItem &&
        ((subItem.route === this.$route.name) ||
          (subItem.tabs && subItem.tabs.map(tab => tab.route).indexOf(this.$route.name) > -1) ||
          (subItem.alternate_routes && subItem.alternate_routes.indexOf(this.$route.name) > -1))
      )
    },

    onMenuItemClick (menuItem) {
      if (menuItem.click_handler && this[menuItem.click_handler]) {
        this[menuItem.click_handler]()
      }

      if (menuItem.subgroup === this.supportSubGroupName) {
        EventTracker.sendEvent(EVENT_NAMES.DOCUMENTATION_OPENED, {
          documentation_page: menuItem.translation
        })
      }
    }
  }
}
</script>

<style lang="scss">
  @import "styles/colors.scss";
  @import "styles/v2/colors.scss";

  .left-toolbar {
    position: relative;
    height: 65px;
    background: #173773;
    padding: 0 32px;

    &.extended-icon-set {
      padding: 0 12px;
    }

    .toolbar-actions {
      margin-right: 0 !important;

      .action {
        & > div {
          padding: 9px 0;
          height: 55px;
          line-height: 55px;
          text-align: center;
          position: relative;
        }

        &:first-child {
          &::before {
            display: none;
          }
        }

        &:not(:last-child) {
          & > div {
            padding-right: 9px;
          }
        }

        .v-icon {
          margin-top: 15px;
          color: $blue-medium;
        }
      }
    }
    .user-menu {
      z-index: 10 !important;
    }

    .doc-img-container {
      padding: 10px;
      &.active {
        background: $blue-medium;
      }
    }

    .support-img-container {
      padding: 11px 13px 13px 11px;
      &.active {
        background: $blue-medium;
      }
    }

    .profile-image-container {
      padding: 11px 13px;
      &.active {
        background: $blue-medium;
      }
    }

    .user-roles-image-container {
      padding: 10px;
      &.active {
        background: $blue-medium;
      }
    }
  }

  .left-toolbar-custom-user-menu {
    min-width: 265px !important;
    min-height: 165px !important;
    left: 0 !important;
    z-index: 3000 !important;
    background: #173773 !important;

    .close-icon {
      position: absolute;
      top: 19px;
      right: 24px;
    }
    .v-list {
      padding: 19px 0 19px 0 !important;
      height: 100%;
      background: #173773 !important;
    }

    .v-list__tile {
      font-size: 14px;
      background: #173773 !important;
      color: #FFF;
      height: 30px;
      padding: 0 24px 0 32px;

      .v-list__tile__avatar {
        min-width: unset;
        margin-right: 10px;
      }

      .disabled-item {
        pointer-events: none;
        text-decoration: line-through !important;
      }
    }
    .v-list__tile:not(:last-child) {
      border-bottom: 1px solid #C8CCD5;
    }
    .menu-item .v-list__tile:hover {
      background: linear-gradient(270deg, rgba(#2260DD, 0.5) 0%, rgba(34, 96, 221, 0) 130.57%) !important;
    }
    .menu-item--active .v-list__tile {
      color: #4b83f0 !important;
    }

    .menu-description {
      background: #173773 !important;

      .v-list__tile {
        color: #FFF;
        text-transform: uppercase;
        font-family: Fira Sans;
        font-style: normal;
        font-weight: bold;
        font-size: 14px;
      }
    }
  }
</style>
