<template lang="pug">
  v-navigation-drawer.sidebar-main(
    dark fixed app stateless
    v-model="drawer"
    v-show="userWorkspaces.length > 0"
  )
    side-menu

    left-toolbar
</template>

<script>
import * as $ from 'jquery'
import { mapGetters } from 'vuex'

import SideMenu from './side-menu.vue'
import NodeSelectionsMixin from '@/mixins/node-selections.mixin'
import toggleDrawer from '@/mixins/toggle-drawer.mixin'
import OrganizationSelector from './organization-selector.vue'
import GroupSiteSelector from './group-site-selector.vue'
import LeftToolbar from './left-toolbar'

export default {
  name: 'leftNavigation',

  data: function () {
    return {
      hasTabBar: false
    }
  },

  mixins: [
    NodeSelectionsMixin,
    toggleDrawer
  ],
  components: {
    OrganizationSelector,
    GroupSiteSelector,
    SideMenu,
    LeftToolbar
  },
  computed: {
    ...mapGetters(['drawer']),
    drawer: {
      get () {
        return this.$store.state.drawer
      },
      set (value) {
        this.$store.commit('UPDATE_DRAWER', value)
      }
    }
  },
  methods: {
    onTabBarStateChange (hasTabBar) {
      this.hasTabBar = hasTabBar
    },
    closeSideMenu () {
      if ($('body').hasClass('sidebar-mini')) {
        $('.sidebar-main').addClass('no-hover')
        setTimeout(() => {
          $('.sidebar-main').removeClass('no-hover')
        }, 500)
      } else {
        this.toggleDrawer()
      }
    }
  }
}
</script>

<style lang="scss">
  @import "styles/v2/colors.scss";

  .v-navigation-drawer.sidebar-main {
    margin-top: 0 !important;
    z-index: 101;
    padding-bottom: 0;
    display: flex;
    flex-direction: column;
    background-color: #132a54 !important;
    width: 265px !important;
    overflow: visible;
    @media (min-width: 768px) and (max-width: 1024px) {
      width: 60px !important;
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

  .application .theme--dark.navigation-drawer,
  .theme--dark .navigation-drawer {
    background-color: #132A54;
  }
</style>
