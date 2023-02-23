<template lang="pug">
  .external-integrations(
    data-test="settings-external-integrations-page"
  )
    //- .external-integrations__header
    //-   base-tab-header(
    //-     :class="['tab-header--underlined', 'tab-header--blue', {'tab-header--active': selectedTab === tabs.hardwareIntegrations}]"
    //-     @click="onTabHeaderClick(tabs.hardwareIntegrations)"
    //-     v-if="hasPermission('organizations__configure_meraki', selectedOrganization.id) || hasPermission('organizations__configure_aruba_ale', selectedOrganization.id)"
    //-   )
    //-     | {{ $t('v2.organization.settings.hardwareIntegrations') }}

    .external-integrations__content
      .external-integrations__content__tab(
        v-show="selectedTab === tabs.hardwareIntegrations"
      )
        meraki-setting-item(
          v-if="hasPermission('organizations__configure_meraki', selectedOrganization.id)"
        )
        ale-configuration-setting-item(
          v-if="hasPermission('organizations__configure_aruba_ale', selectedOrganization.id)"
        )

</template>

<script>
import { mapGetters } from 'vuex'

import BaseTabHeader from '@/components/v2/base-tab-header/base-tab-header.vue'
import MerakiSettingItem from './meraki-integration/meraki-setting-item.vue'
import AleConfigurationSettingItem from './ale-configuration-setting-item'
import EmailConfigurationSettingItem from './email-configuration-setting-item'
import SmsConfigurationSettingItem from './sms-configuration-setting-item'
import SocialOauthSettingItem from './social-oauth-setting-item'

import UserPermissionsMixin from '@/mixins/user-permissions.mixin'

export default {
  components: {
    SocialOauthSettingItem,
    SmsConfigurationSettingItem,
    EmailConfigurationSettingItem,
    AleConfigurationSettingItem,
    BaseTabHeader,
    MerakiSettingItem
  },
  mixins: [
    UserPermissionsMixin
  ],
  data: function () {
    return {
      tabs: {
        hardwareIntegrations: 'hardwareIntegrations'
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
      this.selectedTab = this.tabs.hardwareIntegrations
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

        .social-oauth-setting-item {
          border-bottom: 3px solid $gray-xlight;
        }
      }
    }
  }
</style>
