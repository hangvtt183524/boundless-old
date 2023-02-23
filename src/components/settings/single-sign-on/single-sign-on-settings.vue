<template lang="pug">
  .single-sign-on-settings
    single-sign-on-setting-item(
      v-for="provider of providers"
      :key="provider.provider"
      v-show="!editing || (editing && activeProvider.provider === provider.provider)"
      :provider="provider.provider"
      :title="provider.title"
      :description="provider.description"
      :image="provider.image"
      @addProviderClick="onAddProviderClick"
    )
    .single-sign-on-settings__content(
      v-show="editing"
    )
      single-sign-on-setting-detail(
        :provider="activeProvider"
        v-if="editing"
        @saveClick="onSaveClick"
        @cancelClick="onCancelClick"
        @deleteClick="onDeleteClick"
      )

    .single-sign-on-settings__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )

    confirm-modal(
      ref="confirmModal"
    )
</template>

<script>
import { mapActions } from 'vuex'
import SingleSignOnSettingItem from './single-sign-on-setting-item'
import BaseTable from '@/components/v2/base-table/base-table'
import SingleSignOnSettingDetail from './single-sign-on-setting-detail'
import ConfirmModal from '@/components/v2/confirm-modal/confirm-modal'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'single-sign-on-settings',
  components: {
    SingleSignOnSettingDetail,
    BaseTable,
    SingleSignOnSettingItem,
    ConfirmModal
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  data: function () {
    return {
      loading: false,
      editing: false,
      activeProvider: {},
      providers: [
        {
          provider: 'okta',
          title: this.$t('v2.organization.settings.okta'),
          description: this.$t('v2.organization.settings.oktaDescription'),
          image: require('@/assets/images/okta-logo.svg')
        },
        {
          provider: 'onelogin',
          title: this.$t('v2.organization.settings.oneLogin'),
          description: this.$t('v2.organization.settings.oneLoginDescription'),
          image: require('@/assets/images/onelogin-logo.svg')
        },
        {
          provider: 'other',
          title: this.$t('v2.organization.settings.saml2'),
          description: this.$t('v2.organization.settings.saml2Description'),
          image: require('@/assets/images/saml2-logo.svg')
        }
      ]
    }
  },
  computed: {
    rootNode () {
      return this.selectedWorkspace
    },
    identityProviders () {
      return (this.rootNode && this.rootNode.identity_providers) ? this.rootNode.identity_providers : []
    }
  },
  methods: {
    ...mapActions('workspace', ['updateWorkspace']),
    onAddProviderClick (providerType) {
      const existingProvider = this.identityProviders.filter(provider => {
        return provider.provider === providerType
      })[0]

      if (existingProvider) {
        this.$set(this, 'activeProvider', JSON.parse(JSON.stringify(existingProvider)))
      } else {
        this.$set(this, 'activeProvider', this.getEmptyProvider(providerType))
      }

      this.$set(this, 'editing', true)
    },
    getEmptyProvider (providerType) {
      return {
        provider: providerType,
        login_url: null,
        public_certificate: null,
        role_mappings: []
      }
    },
    onSaveClick (provider) {
      const providerData = {
        ...provider,
        role_mappings: provider.role_mappings.filter(roleMappingData => {
          return roleMappingData.role.id !== null && roleMappingData.node.id !== null
        }).map(roleMappingData => {
          return {
            role: roleMappingData.role.id,
            node: roleMappingData.node.id
          }
        })
      }

      const identityProviders = JSON.parse(JSON.stringify(this.identityProviders))
      const existingProvider = identityProviders.filter(provider => {
        return provider.provider === providerData.provider
      })[0]
      if (existingProvider) {
        identityProviders[identityProviders.indexOf(existingProvider)] = providerData
      } else {
        identityProviders.push(providerData)
      }

      this.loading = true
      this.updateWorkspace({
        id: this.selectedWorkspace.id,
        identity_providers: identityProviders
      }).then(response => {
        this.$set(this, 'editing', false)
        global.toastr['success'](this.$t('v2.organization.settings.providerSaveSuccess'), this.$t('general.success'))
      }).finally(() => {
        this.loading = false
      })

      EventTracker.sendEvent(EVENT_NAMES.DASHBOARD_SSO_CONFIGURED, {
        provider: provider.provider
      })
    },
    onDeleteClick (providerType) {
      this.$refs.confirmModal.open(
        this.$t('errors.warning'),
        this.$t('v2.organization.settings.providerDeleteConfirm').replace('{provider_name}', '<b>' + providerType + '</b>')
      ).then(confirm => {
        if (confirm) {
          const identityProviders = JSON.parse(JSON.stringify(this.identityProviders.filter(provider => {
            return provider.provider !== providerType
          })))

          this.loading = true
          this.updateWorkspace({
            id: this.selectedWorkspace.id,
            identity_providers: identityProviders
          }).then(response => {
            this.$set(this, 'editing', false)
            global.toastr['success'](this.$t('v2.organization.settings.providerDeleteSuccess'), this.$t('general.success'))
          }).finally(() => {
            this.loading = false
          })

          EventTracker.sendEvent(EVENT_NAMES.DASHBOARD_SSO_REMOVED, {
            provider: providerType
          })
        }
      })
    },
    onCancelClick () {
      this.$set(this, 'editing', false)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .single-sign-on-settings {

    .single-sign-on-setting-item {
      border-bottom: 3px solid $gray-xlight;
    }

    &__content {
      padding: 40px;
    }

    &__loading-indicator {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(255, 255, 255, 0.6);
    }
  }

</style>
