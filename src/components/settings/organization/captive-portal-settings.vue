<template lang="pug">
  .external-integrations(
    data-test="settings-external-integrations-page"
  )
    .external-integrations__header
      base-tab-header(
        :class="['tab-header--underlined', 'tab-header--blue', {'tab-header--active': selectedTab === tabs.branding}]"
        @click="onTabHeaderClick(tabs.branding)"
        v-if="hasPermission('organizations__edit_logo', selectedOrganization.id)"
      )
        | {{ $t('v2.organization.settings.branding') }}
      base-tab-header(
        :class="['tab-header--underlined', 'tab-header--blue', {'tab-header--active': selectedTab === tabs.communicationProviders}]"
        @click="onTabHeaderClick(tabs.communicationProviders)"
        v-if="hasPermission('organizations__configure_sms_provider', selectedOrganization.id) || hasPermission('organizations__configure_email_provider', selectedOrganization.id)"
      )
        | {{ $t('v2.organization.settings.communicationProviders') }}
      base-tab-header(
        :class="['tab-header--underlined', 'tab-header--blue', {'tab-header--active': selectedTab === tabs.socialLogin}]"
        @click="onTabHeaderClick(tabs.socialLogin)"
        v-if="hasPermission('organizations__configure_oauth_settings', selectedOrganization.id)"
      )
        | {{ $t('v2.organization.settings.socialLogin') }}
      base-tab-header(
        :class="['tab-header--underlined', 'tab-header--blue', {'tab-header--active': selectedTab === tabs.mist}]"
        @click="onTabHeaderClick(tabs.mist)"
        v-if="hasPermission('wifi_settings__edit', selectedOrganization.id)"
      )
        | {{ $t('v2.organization.settings.mist') }}

    .external-integrations__content
      .external-integrations__content__tab(
        v-show="selectedTab === tabs.branding"
      )
        branding(
          v-if="hasPermission('organizations__edit_logo', selectedOrganization.id)"
        )
      .external-integrations__content__tab(
        v-show="selectedTab === tabs.communicationProviders"
      )
        email-configuration-setting-item(
          v-if="hasPermission('organizations__configure_email_provider', selectedOrganization.id)"
        )
        sms-configuration-setting-item(
          v-if="hasPermission('organizations__configure_sms_provider', selectedOrganization.id)"
        )

      .external-integrations__content__tab(
        v-show="selectedTab === tabs.socialLogin"
        v-if="hasPermission('organizations__configure_oauth_settings', selectedOrganization.id)"
      )
        .external-integrations__content__tab__header
          | {{ $t('v2.organization.settings.oauthSettingsDescription') }}
        social-oauth-setting-item(provider="facebook")
        social-oauth-setting-item(provider="twitter")
        social-oauth-setting-item(provider="instagram")
        social-oauth-setting-item(provider="linkedin")
        social-oauth-setting-item(provider="google")

      .external-integrations__content__tab(
        v-show="selectedTab === tabs.mist"
        v-if="hasPermission('wifi_settings__edit', selectedOrganization.id)"
      )
        .external-integrations__content__tab__header
          | {{ $t('v2.organization.settings.mistSettingsDescription') }}

        mist(
          v-if="hasPermission('wifi_settings__edit', selectedOrganization.id)"
        )

</template>

<script>
import { mapGetters } from 'vuex'

import BaseTabHeader from '@/components/v2/base-tab-header/base-tab-header.vue'
import EmailConfigurationSettingItem from './email-configuration-setting-item'
import SmsConfigurationSettingItem from './sms-configuration-setting-item'
import SocialOauthSettingItem from './social-oauth-setting-item'

import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import Branding from './branding'
import Mist from './mist'

export default {
  components: {
    Branding,
    Mist,
    SocialOauthSettingItem,
    SmsConfigurationSettingItem,
    EmailConfigurationSettingItem,
    BaseTabHeader
  },
  mixins: [
    UserPermissionsMixin
  ],
  data: function () {
    return {
      tabs: {
        branding: 'branding',
        communicationProviders: 'communicationProviders',
        socialLogin: 'socialLogin',
        mist: 'mist'
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
      switch (tab) {
        case this.tabs.branding:
          this.$router.push({ name: 'OrganizationSettingsBranding' })
          break
        case this.tabs.communicationProviders:
          this.$router.push({ name: 'OrganizationSettingsCommunicationProviders' })
          break
        case this.tabs.socialLogin:
          this.$router.push({ name: 'OrganizationSettingsSocialLogin' })
          break
        case this.tabs.mist:
          this.$router.push({ name: 'OrganizationSettingsMist' })
          break
      }
    },
    setDefaultSelectedTab () {
      // Get default selected tab depending on user permissions
      switch (this.$router.currentRoute.name) {
        case 'OrganizationSettingsBranding':
          if (this.hasPermission('organizations__edit_logo', this.selectedOrganization.id)) {
            this.selectedTab = this.tabs.branding
          }
          break
        case 'OrganizationSettingsCommunicationProviders':
          if (this.hasPermission('organizations__configure_email_provider', this.selectedOrganization.id) ||
            this.hasPermission('organizations__configure_sms_provider', this.selectedOrganization.id)) {
            this.selectedTab = this.tabs.communicationProviders
          }
          break
        case 'OrganizationSettingsSocialLogin':
          if (this.hasPermission('organizations__configure_oauth_settings', this.selectedOrganization.id)) {
            this.selectedTab = this.tabs.socialLogin
          }
          break
        case 'OrganizationSettingsMist':
          if (this.hasPermission('wifi_settings__edit', this.selectedOrganization.id)) {
            this.selectedTab = this.tabs.mist
          }
          break
      }

      if (!this.selectedTab) {
        this.redirectToAvailableTab()
      }
    },
    redirectToAvailableTab () {
      // To be called when tab for current route is not available due to permission checks. Will redirect to first
      // available tab
      if (this.hasPermission('organizations__edit_logo', this.selectedOrganization.id)) {
        this.onTabHeaderClick(this.tabs.branding)
      } else if (this.hasPermission('organizations__configure_email_provider', this.selectedOrganization.id) ||
        this.hasPermission('organizations__configure_sms_provider', this.selectedOrganization.id)) {
        this.onTabHeaderClick(this.tabs.communicationProviders)
      } else if (this.hasPermission('organizations__configure_oauth_settings', this.selectedOrganization.id)) {
        this.onTabHeaderClick(this.tabs.socialLogin)
      } else if (this.hasPermission('wifi_settings__edit', this.selectedOrganization.id)) {
        this.onTabHeaderClick(this.tabs.mist)
      }
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
