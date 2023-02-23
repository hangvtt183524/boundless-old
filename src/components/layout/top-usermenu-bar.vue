<template lang="pug">
  .usermenu-bar
    span.splitter(
      v-show="!menuVisible"
    )
    v-menu.user-menu.action(top right offset-y open-on-hove data-test="user-menu-2" content-class="top-usermenu-bar-custom-menu" v-model="menuVisible")
      .user-profile-container.d-flex(
        slot="activator"
        :class="{ 'active': menuVisible }"
      )
        .profile-image-container
          img.profile-image(
            :src='require(`@/assets/images/profile-avatar.svg`)'
          )
        .profile-name
          | {{currentUser.profile.full_name}}
        v-icon.user-profile-trigger__icon(
          v-if="!menuVisible"
        ) arrow_drop_down
        v-icon.user-profile-trigger__icon(
          v-if="menuVisible"
        ) arrow_drop_up
      v-list(@click.native="stopPropagation")
        v-list-tile(
          v-show="userWorkspaces.length > 0"
        ).menu-item(:to="{name: 'UserProfile'}")
          v-list-tile-action.menu-item__icon
            img(:src='require(`@/assets/images/settings_black.svg`)')
          v-list-tile-title {{ $t("general.myProfile") }}
        v-list-tile.menu-item(@click="logoutUser")
          v-list-tile-action.menu-item__icon.logout
            img(:src='require(`@/assets/images/logout.svg`)')
          v-list-tile-title
            span {{ $t("general.logout") }}
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'
import NodeSelectionsMixin from '@/mixins/node-selections.mixin'

export default {
  mixins: [NodeSelectionsMixin],

  props: ['menu'],

  data () {
    return {
      menuVisible: false
    }
  },

  computed: {
    ...mapGetters('user', ['currentUser'])
  },

  watch: {
    '$route' (to, from) {
      this.generateCrumbs(true)
    },
    selectedOrganization (to, from) {
      this.generateCrumbs(true)
    },
    selectedNode (to, from) {
      this.generateCrumbs(true)
    }
  },

  methods: {
    ...mapActions('auth', ['logout']),

    logoutUser () {
      this.logout()

      EventTracker.sendEvent(EVENT_NAMES.USER_LOGGED_OUT)
    }
  }
}
</script>

<style lang="scss">
  @import "styles/v2/colors.scss";

  .usermenu-bar {
    padding: 0;
    margin-left: 24px;

    .splitter {
      border-left: solid 2px #e2e8f1;
      font-size: 33px;
      vertical-align: middle;
    }
    .user-profile-container {
      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 22px;
      color: $text-dark;
      display: inline-block;
      margin-right: 5px;
      padding: 17px 20px 17px 14px;
      vertical-align: middle;

      &.active {
        background: rgba(#EFF3F8, .5);
      }

      .profile-image-container {
        width: 26px;
        height: 26px;
        display: inline-block;
        vertical-align: middle;

        .profile-image {
          width: 26px;
          height: 26px;
          object-fit: scale-down;
        }
      }
      .profile-name {
        margin: 0 0 0 16px;
        display: inline-block;
        vertical-align: middle;
        width: 94px;
        line-height: 26px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;

        font-family: Overpass;
        font-style: normal;
        font-size: 14px;
        letter-spacing: 1.5px;
        color: $text-dark;
      }
      .user-profile-trigger__icon {
        color: #E2E8F1;
      }
    }
  }
  .top-usermenu-bar-custom-menu {
    width: 198px !important;
    top: 54px !important;
    right: 0 !important;
    left: unset !important;
    z-index: 3000 !important;

    .menu-item__icon {
      position: absolute;
      left: 17px;

      &.logout {
        left: 19px;
      }
    }

    .v-list {
      padding: 0 !important;
    }
    .v-list__tile__title {
      padding-left: 37px;
    }
  }
</style>
