<template lang="pug">
  .menu-tab-bar
    ul
      li(
        v-for="tab in tabs"
        :key="tab.translation"
        :class="{'active': currentTab === tab}"
        v-show="isTabHeaderVisible(tab)"
      )
        router-link.page-link(
          v-if="isMenuItemEnabled(tab) && !tab.labelOnly"
          :to="{ name: getMenuItemRoute(tab) }"
        ) {{ $t(`v2.menu.${tab.translation}`) }}
        a.page-link(
          v-else
        ) {{ $t(`v2.menu.${tab.translation}`) }}
        span.link-splitter
</template>

<script>
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import MenuItemDisplayConditionsMixin from '@/mixins/menu-item-display-conditions.mixin'

export default {
  name: 'menu-tab-bar',
  mixins: [
    UserPermissionsMixin,
    MenuItemDisplayConditionsMixin
  ],
  props: {
    tabs: Array,
    currentTab: Object,
    selectedOrg: {
      type: Object,
      default: () => {
        return { id: 0 }
      }
    }
  },
  methods: {
    isMenuItemEnabled (tab) {
      return this.checkMenuItemConditions(tab)
    },

    getMenuItemRoute (menuItem) {
      // Route is plain string or undefined
      return menuItem.route
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .menu-tab-bar {
    position: absolute;
    top: 100%;
    width: 100%;
    left: 0;
    background-color: #132A54;

    ul {
      list-style: none;
      user-select: none;
      padding-left: 0;

      li {
        display: inline-block;
        height: 45px;

        .link-splitter {
          height: 22px;
          margin-top: 12px;
        }

        .page-link {
          padding: 12px 25px;
          line-height: 45px;
          font-family: Fira Sans;
          font-style: normal;
          font-size: 15px;
          color: $white;
          text-decoration: none;
        }

        &.active {
          background-color: $blue-reserve;

          .page-link {
            font-weight: 600;
          }
        }

        &.disabled {
          cursor: not-allowed;
          background: $gray-light;
        }

        &:not(:last-child) {
          .link-splitter {
            border-right: 1px solid rgba($gray-dark, .2)
          }
        }
      }
    }
  }
</style>
