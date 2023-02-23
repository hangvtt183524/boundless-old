<template lang="pug">
  .external-integrations(
    data-test="settings-external-integrations-page"
  )
    .external-integrations__content
      .external-integrations__content__tab(
        v-show="selectedTab === tabs.singleSignOn"
        v-if="hasPermission('organizations__configure_sso_settings', selectedOrganization.id)"
      )
        single-sign-on-settings
</template>

<script>
import { mapGetters } from 'vuex'

import BaseTabHeader from '@/components/v2/base-tab-header/base-tab-header.vue'

import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import SingleSignOnSettings from './single-sign-on/single-sign-on-settings'

export default {
  components: {
    SingleSignOnSettings,
    BaseTabHeader
  },
  mixins: [
    UserPermissionsMixin
  ],
  data: function () {
    return {
      tabs: {
        singleSignOn: 'singleSignOn'
      },
      selectedTab: null
    }
  },
  mounted () {
    this.setDefaultSelectedTab()
  },
  computed: {
    ...mapGetters('layout', ['selectedOrganization'])
  },
  methods: {
    onTabHeaderClick (tab) {
      this.selectedTab = tab
    },
    setDefaultSelectedTab () {
      // Get default selected tab depending on user permissions
      this.selectedTab = this.tabs.singleSignOn
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .external-integrations {
    width: 100%;
    background-color: $white;

    &__header {
      padding: 0 42px;
      background-color: $white;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
      height: 60px;

      @media only screen and (max-width: 767px) {
        padding: 0 5px;
      }

      .tab-header {
        min-width: auto;
        padding: 0 20px;

        @media only screen and (max-width: 1264px) {
          padding: 0 10px;
        }

        @media only screen and (max-width: 1024px) {
          padding: 0 5px;
        }

        @media only screen and (max-width: 767px) {
          font-size: 15px;
        }
      }

      .tab-header:not(:last-child) {
        margin-right: 69px;

        @media only screen and (max-width: 1264px) {
          margin-right: 30px;
        }

        @media only screen and (max-width: 1024px) {
          margin-right: 10px;
        }

        @media only screen and (max-width: 767px) {
          margin-right: 5px;
        }
      }
    }

    .organization-setting-item:not(:last-child) {
      border-bottom: 3px solid $gray-xlight;
    }

    &__content {
      &__tab {
        &__header {
          padding: 39px 49px;
          font-family: Fira Sans;
          font-style: normal;
          font-weight: normal;
          font-size: 14px;
          line-height: 17px;
          color: $text-medium;
          border-bottom: 3px solid $gray-xlight;
        }
      }
    }
  }
</style>
