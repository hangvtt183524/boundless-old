<template lang="pug">
  .general-settings(
    data-test="settings-general-settings-page"
  )
    .general-settings__header
      base-tab-header(
        :class="['tab-header--underlined', 'tab-header--blue', {'tab-header--active': selectedTab === tabs.general}]"
        @click="onTabHeaderClick(tabs.general)"
        v-if="hasPermission('workspaces__edit', selectedWorkspace.id) || hasPermission('workspaces__delete', selectedWorkspace.id)"
      )
        | {{ $t('v2.organization.settings.general') }}
      base-tab-header(
        :class="['tab-header--underlined', 'tab-header--blue', {'tab-header--active': selectedTab === tabs.branding}]"
        @click="onTabHeaderClick(tabs.branding)"
        v-if="hasPermission('workspaces__edit_logo', selectedWorkspace.id)"
      )
        | {{ $t('v2.organization.settings.branding') }}
      base-tab-header(
        :class="['tab-header--underlined', 'tab-header--blue', {'tab-header--active': selectedTab === tabs.security}]"
        @click="onTabHeaderClick(tabs.security)"
        v-if="hasPermission('workspaces__configure_security_settings', selectedWorkspace.id)"
      )
        | {{ $t('v2.organization.settings.security') }}

    .general-settings__content
      .general-settings__content__tab(
        v-show="selectedTab === tabs.general"
      )
        general
    .external-integrations__content__tab(
      v-show="selectedTab === tabs.branding"
    )
      branding
    .external-integrations__content__tab(
      v-show="selectedTab === tabs.security"
    )
      security

</template>

<script>
import BaseTabHeader from '@/components/v2/base-tab-header/base-tab-header.vue'
import General from './general.vue'
import Branding from './branding.vue'
import Security from '../security.vue'

import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

export default {
  components: {
    BaseTabHeader,
    General,
    Branding,
    Security
  },
  mixins: [
    UserPermissionsMixin,
    CurrentNodeSelectionsMixin
  ],
  data: function () {
    return {
      tabs: {
        general: 'general',
        branding: 'branding',
        security: 'security'
      },
      selectedTab: null
    }
  },
  mounted () {
    this.setDefaultSelectedTab()
  },
  methods: {
    onTabHeaderClick (tab) {
      this.selectedTab = tab
      switch (tab) {
        case this.tabs.general:
          this.$router.push({ name: 'SettingsGeneral' })
          break
        case this.tabs.branding:
          this.$router.push({ name: 'SettingsBranding' })
          break
        case this.tabs.security:
          this.$router.push({ name: 'SettingsSecurity' })
          break
      }
    },
    setDefaultSelectedTab () {
      // Get default selected tab depending on user permissions
      switch (this.$router.currentRoute.name) {
        case 'WorkspaceSettingsGeneral':
          if (this.hasPermission('workspaces__edit', this.selectedWorkspace.id) ||
            this.hasPermission('workspaces__delete', this.selectedWorkspace.id)) {
            this.selectedTab = this.tabs.general
          }
          break
        case 'WorkspaceSettingsBranding':
          if (this.hasPermission('workspaces__edit_logo', this.selectedWorkspace.id)) {
            this.selectedTab = this.tabs.branding
          }
          break
        case 'WorkspaceSettingsSecurity':
          if (this.hasPermission('workspaces__configure_security_settings', this.selectedWorkspace.id)) {
            this.selectedTab = this.tabs.security
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
      if (this.hasPermission('workspaces__edit', this.selectedWorkspace.id) ||
        this.hasPermission('workspaces__delete', this.selectedWorkspace.id)) {
        this.onTabHeaderClick(this.tabs.general)
      } else if (this.hasPermission('workspaces__edit_logo', this.selectedWorkspace.id)) {
        this.onTabHeaderClick(this.tabs.branding)
      } else if (this.hasPermission('workspaces__configure_security_settings', this.selectedWorkspace.id)) {
        this.onTabHeaderClick(this.tabs.security)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .general-settings {
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
        margin-right: 20px;

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
