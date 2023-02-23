<template lang="pug">
  div.page-selector
    v-menu.page-menu(
      :close-on-content-click="false"
      :nudge-bottom="10"
      offset-y
      transition="slide-y-transition"
      v-model="menu"
    )
      h3.page-menu-heading(slot="activator")
        span {{selectedGroup}} - {{selectedPage.name}}
        span.caret-icon(v-show="menu")
          v-icon(small) fas fa-caret-up
        span.caret-icon(v-show="!menu")
          v-icon(small) fas fa-caret-down
      v-card.page-menu-dropdown
        ul.page-list
          li.page-group(v-for="group in groups")
            .page-title {{group.name}}
            ul
              li.page-item(
                v-for="page in group.pages",
                :key="page.name",
                :class="{'active': selectedPage.id == page.id}"
                @click="selectPage(page, group.name)"
              )
                span.page-item-icon
                  v-icon(small) fas fa-check
                span {{ page.name }}
</template>

<script>
export default {
  props: ['selectedPage'],
  data () {
    return {
      selectedGroup: 'Guest Wifi',
      menu: false,
      search: '',
      groups: [
        {
          name: 'Guest Wifi',
          pages: [
            {
              id: 1,
              name: 'Guest Form',
              component: 'guest-form',
              configKey: 'guestForm',
              routeName: 'guest'
            },
            {
              id: 2,
              name: 'Guest Social',
              component: 'guest-social',
              configKey: 'guestSocial',
              routeName: 'social'
            },
            {
              id: 10,
              name: 'Ticketing',
              component: 'ticketing',
              configKey: 'ticketing',
              routeName: 'ticketing'
            },
            {
              id: 11,
              name: 'Codes',
              component: 'codes',
              configKey: 'codes',
              routeName: 'codes'
            }
          ]
        },
        {
          name: 'Sponsoring',
          pages: [
            {
              id: 3,
              name: 'Sponsor Page',
              component: 'sponsor-page',
              configKey: 'sponsorPage',
              routeName: 'sponsor'
            },
            {
              id: 4,
              name: 'Sponsor Code',
              component: 'sponsor-code',
              configKey: 'sponsorCode',
              routeName: 'sponsor-code'
            },
            {
              id: 5,
              name: 'Sponsor Wait',
              component: 'sponsor-wait',
              configKey: 'sponsorWait',
              routeName: 'sponsor-wait'
            },
            {
              id: 6,
              name: 'Sponsor Authorization',
              component: 'sponsor-auth',
              configKey: 'sponsorAuth',
              routeName: 'sponsor-auth'
            }
          ]
        },
        {
          name: 'SMS Access',
          pages: [
            {
              id: 12,
              name: 'SMS Registration',
              component: 'sms-registration',
              configKey: 'smsRegistration',
              routeName: 'sms-reg'
            },
            {
              id: 7,
              name: 'SMS Access Code',
              component: 'sms-access-code',
              configKey: 'smsAccessCode',
              routeName: 'sms-access-code'
            }
          ]
        },
        {
          name: 'User / Password',
          pages: [
            {
              id: 13,
              name: 'User Login',
              component: 'user-login',
              configKey: 'userLogin',
              routeName: 'user-login'
            }
          ]
        },
        {
          name: 'Single Sign On',
          pages: [
            {
              id: 15,
              name: 'SSO',
              component: 'sso',
              configKey: 'sso',
              routeName: 'sso'
            }
          ]
        },
        {
          name: 'Generic',
          pages: [
            {
              id: 8,
              name: 'Wifi Unavailable Page',
              component: 'wifi-unavailable-page',
              configKey: 'wifiUnavailablePage',
              routeName: 'wifi-unavailable-page'
            },
            {
              id: 9,
              name: 'Access Granted Page',
              component: 'access-granted-page',
              configKey: 'accessGrantedPage',
              routeName: 'access-granted-page'
            }
          ]
        },
        {
          name: 'Wifi4eu',
          pages: [
            {
              id: 14,
              name: 'Wifi4eu',
              component: 'wifi4eu',
              configKey: 'wifi4eu',
              routeName: 'wifi4eu'
            }
          ]
        }
      ]
    }
  },
  methods: {
    selectPage (page, group) {
      this.$emit('select', page)
      this.selectedGroup = group
      this.menu = false
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/colors.scss";
  @import "styles/v2/colors.scss";

  .page-selector {
    position: absolute;
    left: 10px;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .page-menu {
    font-family: 'Fira Sans', sans-serif;

    .page-menu-heading {
      font-size: 18px;
      color: $primary;
      position: relative;
    }

    .caret-icon {
      position: absolute;
      top: 5px;
      margin-left: 6px;
      top: 0px;
    }

    .v-menu__content {
      box-shadow: none !important;
    }

  }

  .v-flex {
    display: flex;
  }

  .page-menu-dropdown {
    padding: 30px;
    box-shadow: none !important;
    border: 1px solid $light-gray;
    min-width: 400px;
  }

  .page-menu-button {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    color: #ffffff;
    background-color: $primary;
    height: 40px;
    width: 40px;

    &:hover {
      background-color: lighten($primary, 5%);
    }

    .v-icon {
      color: #ffffff;
    }

    &.new-page {
      padding: 0 10px;
      width: auto;
      font-size: 20px;

      .circle-container {
        margin-left: 5px;
      }
    }
  }

  .circle-container {
    border-radius: 100px;
    border: 1px solid #ffffff;
    height: 26px;
    width: 26px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .page-list {
    list-style-type: none;
    padding: 0;
    max-height: 230px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 8px;
    }

    /* Track */
    &::-webkit-scrollbar-track {
      background: $light-gray;
      border: 3px solid transparent;
      background-clip: content-box;
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
      background: $success;
      border: 1px solid $success;
      border-radius: 5px;
    }

    .page-group {
      margin-right: 5px;
      margin-top: 10px;
      ul {
        padding: 0;
      }
      .page-title {
        padding: 5px 10px;
        border-radius: 5px;
        display: block;
        background: $gray-xlight;
        margin: 5px 0;
        color: #8995ae;
      }
    }

    .page-item {
      padding: 5px 10px;
      cursor: pointer;
      border-radius: 5px;
      margin-top: 2px;
      position: relative;

      .page-item-icon {
        display: none;
        color: #ffffff;
        margin-right: 5px;
        position: absolute;
        top: 5px;
        right: 5px;

        svg {
          color: #ffffff;
        }
      }

      &:hover {
        background-color: lighten($light-gray, 5%);
      }

      &.active {
        background-color: $primary;
        color: #ffffff;

        .page-item-icon {
          display: block;
        }
      }
    }
  }
</style>
