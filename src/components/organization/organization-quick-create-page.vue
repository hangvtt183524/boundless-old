<template lang="pug">
  div.organization-quick-create-page
    div.sections
      div.organization-quick-create-page__section
        .organization-quick-create-page__section__header
          .organization-quick-create-page__section__header__back-link-container
            v-icon.organization-quick-create-page__section__header__back-link-container__back-icon(
              @click="onBackClick"
            ) keyboard_backspace
          .organization-create-page__header__tab-headers
            v-layout(row wrap)
              v-flex(xs3 md3 lg2 xl1)
                base-tab-header(
                  :class="['tab-header--blue tab-header--underlined', 'tab-header--active']"
                ) {{ $t('organization.connectViaAPI') }}
              v-flex(xs9 md9 lg10 xl11)
                .cisco-meraki-logo-container
                  img(src="@/assets/images/meraki-logo.png")

        .organization-quick-create-page__section__body
          v-layout(row wrap).organization-quick-create-page__section__body__row.organization-quick-create-page__section__body__row--input-column
            v-flex(xs10 md7 meraki-api-key-container)
              div.organization-quick-create-page__section__body__row__input-column
                base-select(
                  v-if="apiKeyInputMode === apiKeyInputModes.existing"
                  v-model="workspaceApiKey"
                  :items="apiKeyChoices"
                  :label="$t('organization.selectMerakiAPIKey')"
                  :validations="{required: true}"
                )
                base-text-input(
                  v-if="apiKeyInputMode === apiKeyInputModes.new"
                  v-model="apiKey"
                  :label="$t('organization.enterMerakiAPIKey')"
                  class="base-text-input--multiline"
                  :validations="{required: true}"
                )
                .organization-quick-create-page__section__body__row__input-column__input-mode-switch-trigger(
                  @click="onApiKeyInputModeSwitchClick"
                )
                  | {{ apiKeyInputMode === apiKeyInputModes.existing ? $t('v2.organization.enterNew') : $t('v2.organization.selectExisting') }}

            v-flex(xs10 md5 meraki-choose-organization-container)
              div.organization-quick-create-page__section__body__row__input-column
                label.organization-select-label
                  | {{ $t('organization.chooseMerakiOrganization') }}
                base-select(
                  v-model="selectedMerakiOrganization"
                  :items="organizationChoices"
                  :validations="{required: true}"
                  ref="selectOrganizationRef"
                  :search-enabled="true"
                  :search-placeholder="$t('v2.user.selectOrganization')"
                  :loading="apiKeysLoading"
                )

          v-layout(row wrap).strict-synchronization-flag-row
            v-flex(xs10 md7)
              div.organization-quick-create-page__section__body__row__input-column
                base-check-box(
                  v-model="isStrictSynchronizationEnabled"
                  :label="$t('v2.organization.setup.enableStrictSynchronization')"
                )

          v-layout(row wrap).organization-quick-create-page__section__body__row
            span.organization-quick-create-page__invalid-reason(
              v-if="showFetchOrganizationFailReason"
            ) * {{ $t('organization.merakiConnectionApiInvalidReason')}}
          v-layout(row wrap).organization-quick-create-page__section__body__row.organization-quick-create-page__section__body__row--button-column
            v-flex(xs12)
              base-button(
                class="base-button--green"
                @click="onImportClick"
                :disabled="!isImportButtonEnabled"
              ) {{ $t('general.import') }}

      div.organization-quick-create-page__section
        div.help-trigger.organization-quick-create-page__section__header(
          @click="onHelpTriggerClick"
        )
          span.help-trigger__text {{ $t('organization.apiConnectionHelpTrigger') }}
          v-icon.help-trigger__icon(
            v-if="!helpSectionVisible"
          ) arrow_drop_down
          v-icon.help-trigger__icon(
            v-if="helpSectionVisible"
          ) arrow_drop_up
        transition(name="slide")
          .organization-quick-create-page__section__body(
            v-show="helpSectionVisible"
          )
            meraki-connection-help-section

    .organization-quick-create-page__loading-indicator(v-if="loading")
      v-progress-circular(
        :size="50"
        indeterminate color="#15ac2f")

    job-tracking-modal(
      :persistent="true"
      display-post-run-messages
      ref="jobTrackingModal"
    )
</template>

<script>
import _ from 'lodash'
import { mapActions } from 'vuex'
import BaseTabHeader from '@/components/v2/base-tab-header/base-tab-header.vue'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input.vue'
import BaseSelect from '@/components/v2/base-select/base-select.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import BaseCheckBox from '@/components/v2/base-check-box/base-check-box'
import JobTrackingModal from '@/components/v2/job-tracking-modal/job-tracking-modal.vue'
import MerakiConnectionHelpSection from './setup/meraki-connection-help/meraki-connection-help-section.vue'
import NodeSelectionsMixin from '@/mixins/node-selections.mixin'

export default {
  name: 'organization-quick-create-page',
  components: {
    BaseCheckBox,
    BaseTabHeader,
    BaseTextInput,
    BaseSelect,
    BaseButton,
    MerakiConnectionHelpSection,
    JobTrackingModal
  },
  mixins: [
    NodeSelectionsMixin
  ],
  data: function () {
    return {
      apiKey: '',
      workspaceApiKeys: null,
      workspaceApiKey: null,
      merakiOrganizations: [],
      selectedMerakiOrganization: null,
      showFetchOrganizationFailReason: false,
      isStrictSynchronizationEnabled: false,
      helpSectionVisible: false,
      loading: false,
      apiKeysLoading: false,
      apiKeyInputMode: 'new',
      apiKeyInputModes: {
        existing: 'existing',
        new: 'new'
      },
      products: ['captive_portal']
    }
  },
  mounted () {
    // Fetch workspace api keys on load
    this.fetchExternalApiKeys()
  },
  computed: {
    organizationChoices () {
      return this.merakiOrganizations.map(organization => {
        return {
          key: organization.id,
          name: organization.name,
          disabled: this.isImportedIntoOtherWorkspace(organization) || this.isImportedIntoCaptivePortal(organization),
          tooltip: this.isImportedIntoOtherWorkspace(organization)
            ? this.$t('v2.organization.setup.alreadyRegistered')
            : this.isImportedIntoCaptivePortal(organization)
              ? this.$t('v2.organization.setup.alreadyImportedIntoCaptivePortal')
              : null
        }
      }).sort((a, b) => a.name.localeCompare(b.name))
    },
    selectedOrganizationOption () {
      return this.organizationChoices.find(item => item.key === this.selectedMerakiOrganization)
    },
    isImportButtonEnabled () {
      return (this.apiKey || this.workspaceApiKey) && this.selectedMerakiOrganization
    },
    apiKeyChoices () {
      return (this.workspaceApiKeys || []).map(apiKey => {
        const apiKeyDisplay = `****${apiKey.api_key_display.substring(apiKey.api_key_display.length - 4)}`
        return {
          key: apiKey.id,
          name: `${apiKey.name} (${apiKeyDisplay})`
        }
      })
    },
    apiKeysLoaded () {
      return this.workspaceApiKeys !== null
    },
    apiKeyValue () {
      return this.apiKeyInputMode === this.apiKeyInputModes.existing
        ? this.workspaceApiKey
        : this.apiKey
    }
  },
  watch: {
    apiKeyValue: {
      handler: _.debounce(function () {
        // Un-set selected organization
        this.selectedMerakiOrganization = null
        this.merakiOrganizations = []

        if (this.apiKeyValue) {
          this.fetchMerakiOrganizations()
        }
      }, 400)
    }
  },
  methods: {
    ...mapActions('organization/meraki', ['fetchApiKeyOrganizations']),
    ...mapActions('workspace', ['fetchWorkspaceExternalApiKeys', 'clearWorkspaceSetupStatus']),
    ...mapActions('workspace/organization', ['importWorkspaceExternalMerakiOrganizations']),
    ...mapActions('layout', ['fetchUserWorkspaceOrganizations']),
    fetchExternalApiKeys () {
      this.apiKeysLoading = true
      this.fetchWorkspaceExternalApiKeys({
        workspaceId: this.workspaceId,
        page_size: 0
      }).then(response => {
        const activeApiKeys = response.data.data.filter(apiKey => apiKey.is_valid === true)

        // If we have api keys, default to selecting an existing api key, otherwise default to entering new api key
        this.apiKeyInputMode = activeApiKeys.length > 0
          ? this.apiKeyInputModes.existing
          : this.apiKeyInputModes.new

        this.workspaceApiKeys = activeApiKeys

        // If existing key mode, select first api key by default
        if (this.apiKeyInputMode === this.apiKeyInputModes.existing) {
          this.workspaceApiKey = this.workspaceApiKeys[0].id
        }
      }).finally(() => {
        this.apiKeysLoading = false
      })
    },
    fetchMerakiOrganizations () {
      const data = {}

      if (this.apiKeyInputMode === this.apiKeyInputModes.existing) {
        data.workspace_api_key = this.workspaceApiKey
      }

      if (this.apiKeyInputMode === this.apiKeyInputModes.new) {
        data.api_key = this.apiKey
      }

      this.apiKeysLoading = true
      this.fetchApiKeyOrganizations(data).then(response => {
        this.merakiOrganizations = response.data.data
      }).catch((error) => {
        // Display errors in known structure
        if (error && error.response && error.response.data && error.response.data.error &&
            error.response.data.error.detail && error.response.data.error.detail.non_field_errors) {
          error.response.data.error.detail.non_field_errors.forEach(errorDetail => {
            if (errorDetail.code) {
              this.showFetchOrganizationFailReason = true
            }
          })
        }
      }).finally(() => {
        this.apiKeysLoading = false
        if (this.organizationChoices.length === 1) {
          this.selectedMerakiOrganization = this.organizationChoices[0].key
        } else if (this.organizationChoices.length > 1) {
          this.$refs.selectOrganizationRef.onDropdownHandleClick()
        }
      })
    },
    onImportClick () {
      const data = {
        workspaceId: this.workspaceId,
        external_meraki_organizations: [{
          meraki_id: this.selectedMerakiOrganization,
          name: this.selectedOrganizationOption.name
        }],
        products: this.products,
        strict_synchronization: this.isStrictSynchronizationEnabled
      }

      if (this.apiKeyInputMode === this.apiKeyInputModes.existing) {
        data.workspace_api_key = this.workspaceApiKey
      }

      if (this.apiKeyInputMode === this.apiKeyInputModes.new) {
        data.api_key = this.apiKey
      }

      this.loading = true
      this.importWorkspaceExternalMerakiOrganizations(data).then(response => {
        this.$refs.jobTrackingModal.open(
          response.data.data.id,
          this.$t('organization.connectionProgressTitle'),
          this.$t('organization.connectionProgressDescription')
        ).then(success => {
          if (success) {
            this.onImportSuccess()
          }
        })
      }).finally(() => {
        this.loading = false
      })
    },
    onImportSuccess () {
      global.toastr['success'](this.$t('v2.organization.createOrganizationSuccess'), this.$t('general.success'))

      // Select and redirect to the newly created organization
      this.fetchUserWorkspaceOrganizations({
        workspaceId: this.workspaceId
      }).then(() => {
        // Locate our newly created organization in the response
        const organization = this.captivePortalOrganizations.find(
          organization =>
            organization.meraki_organization &&
            organization.meraki_organization.meraki_id === this.selectedMerakiOrganization
        )
        if (organization) {
          // Select organization and its root node
          this.selectOrganization(organization)
          this.selectNode({ id: organization.id })

          // Redirect to device listing page
          this.$router.push({
            name: 'OrganizationInventory',
            params: { ...this.$route.params, orgId: organization.id, nodeId: organization.id }
          })
        }
      })

      // Clear workspace setup status, as we might have created a new api key
      this.clearWorkspaceSetupStatus()
    },
    onHelpTriggerClick () {
      this.helpSectionVisible = !this.helpSectionVisible
    },
    onApiKeyInputModeSwitchClick () {
      // Alternate input mode
      this.apiKeyInputMode = this.apiKeyInputMode === this.apiKeyInputModes.existing
        ? this.apiKeyInputModes.new
        : this.apiKeyInputModes.existing

      // Clear entered api key
      this.apiKey = ''
    },
    isImportedIntoOtherWorkspace (organization) {
      return organization.manager_workspace && organization.manager_workspace.id !== this.workspaceId
    },
    isImportedIntoCaptivePortal (organization) {
      return organization.manager_workspace &&
        organization.manager_workspace.id === this.workspaceId &&
        organization.connected_products.indexOf(this.productIdentifiers.captivePortal) > -1
    },
    onBackClick () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../styles/v2/colors";

.organization-quick-create-page {
  background-color: $white;
  width: 100%;
  position: relative;

  &__invalid-reason {
    font-family: Fira Sans;
    font-style: italic;
    font-weight: normal;
    font-size: 14px;
    line-height: 22px;
    color: $blue-reserve;
  }

  &__section {

    &__header {
      height: 59px;
      padding: 0 60px 0 0;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
      user-select: none;

      &__back-link-container {
        float: left;
        width: 60px;
        line-height: 60px;
        height: 60px;
        border-right: 1px solid $gray-xlight;
        text-align: center;

        &__back-icon {
          color: $blue-reserve;
          line-height: 60px;
        }
      }

      &__tab-headers {
        width: calc(100% - 60px);
      }

      &.help-trigger {
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 59px;
        color: $blue-reserve;
        cursor: pointer;

        .help-trigger__text {
          vertical-align: middle;
        }

        .help-trigger__icon {
          line-height: 59px;
          color: $blue-reserve;
          float: right;
        }
      }

      .cisco-meraki-logo-container {
        float: right;
        vertical-align: middle;
        line-height: 60px;

        img {
          width: 86px;
        }
      }
    }

    &__body {
      padding: 30px 56px;

      .organization-select-label {
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 41px;
        color: $text-medium;
      }

      &__row {
        margin-bottom: 25px;
        &--input-column {
          margin-bottom: 5px;
        }
        &--button-column {
          margin-bottom: 0;
        }
        &__input-column {
          margin-right: 21px;
          position: relative;

          &__input-mode-switch-trigger {
            position: absolute;
            top: 0;
            right: 0;

            cursor: pointer;
            font-family: Fira Sans;
            font-style: italic;
            font-weight: normal;
            line-height: 41px;
            font-size: 14px;
            color: $blue-reserve;
            user-select: none;
          }
        }
        .meraki-api-key-container {
          max-width: 350px;
        }
        .meraki-choose-organization-container {
          max-width: 300px;
        }
      }

      .strict-synchronization-flag-row {
        margin-top: 20px;
      }

      .organization-quick-create-page-help {
        margin-top: 35px;
      }
    }

    &:not(:last-child) {
      border-bottom: 3px solid $gray-xlight;
    }

    &:last-child {
      .organization-quick-create-page__section__header {
        padding-left: 60px;
      }
    }
  }

  .slide-enter-active {
    transition-duration: 0.1s;
    transition-timing-function: linear;
  }

  .slide-leave-active {
    transition-duration: 0.1s;
    transition-timing-function: linear;
  }

  .slide-enter-to, .slide-leave {
    max-height: 100px;
    overflow: hidden;
  }

  .slide-enter, .slide-leave-to {
    overflow: hidden;
    max-height: 0;
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
