<template lang="pug">
  base-modal(
    class="clone-meraki-organization-modal"
    :show="show"
    @close="close"
    max-width="430px"
  )
    template(v-slot:header)
      div.clone-meraki-organization-modal__header
        v-layout(row wrap)
          v-flex(xs12)
            div.clone-meraki-organization-modal__title
              | {{ $t('v2.workspaces.organizations.cloneMerakiOrganizationTitle').replace('{organization_name}', sourceOrganization.name) }}

    template(v-slot:default)
      div.clone-meraki-organization-modal__content
        v-layout(
          row wrap
          v-show="!(apiKeysLoading || apiKeysEmpty)"
        )
          v-flex(xs12)
            label
              | {{ $t('general.apiKey') }}
            base-select(
              v-model='selectedApiKey'
              :items='apiKeyChoices'
            )

          v-flex(xs12)
            label
              | {{ $t('v2.workspaces.organizations.organizationName') }}
            base-text-input(
              v-model="organizationName"
            )

          v-flex.clone-meraki-organization-modal__content__check-box-row(xs12)
            base-check-box(
              v-model="isStrictSynchronizationEnabled"
              :label="$t('v2.organization.setup.enableStrictSynchronization')"
            )

        v-layout(
          row wrap
          v-show="!apiKeysLoading && apiKeysEmpty"
        )
          v-flex(xs12)
            .no-api-key-error-message
              | {{ $t('v2.workspaces.externalApiKeys.noApiKeyMessage') }}

            router-link(
              :to="{ name: 'ExternalApiKeys' }"
            ) {{ $t('v2.workspaces.externalApiKeys.apiKeyStore') }}

    template(v-slot:footer)
      div.clone-meraki-organization-modal__footer
        v-layout(row wrap)
          v-flex(xs12)
            base-button(
              class="base-button--green"
              @click="onCloneClick"
              :disabled="!isValid"
            ) {{ $t('general.clone') }}
            base-button(
              class="base-button--green--negative"
              @click="close"
            ) {{ $t('general.cancel') }}

      div.clone-meraki-organization-modal__loading-indicator(v-if="loading")
        v-progress-circular(
          :size="50"
          indeterminate color="#15ac2f"
        )

      job-tracking-modal(
        :persistent="true"
        :dismissible="true"
        display-post-run-messages
        :dismiss-info="$t('v2.workspaces.organizations.cloneDismissInfo')"
        ref="jobTrackingModal"
      )
</template>

<script>
import { mapActions } from 'vuex'

import BaseModal from '@/components/v2/base-modal/base-modal.vue'
import JobTrackingModal from '@/components/v2/job-tracking-modal/job-tracking-modal.vue'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input.vue'
import BaseSelect from '@/components/v2/base-select/base-select.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import BaseCheckBox from '@/components/v2/base-check-box/base-check-box'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  components: {
    BaseSelect,
    BaseModal,
    JobTrackingModal,
    BaseTextInput,
    BaseButton,
    BaseCheckBox
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    sourceOrganization: {
      required: true
    }
  },

  data () {
    return {
      loading: false,
      selectedApiKey: null,
      organizationName: null,
      isStrictSynchronizationEnabled: false,
      workspaceApiKeys: null
    }
  },

  watch: {
    show (v) {
      if (v === true) {
        this.resetForm()

        if (this.workspaceApiKeys === null) {
          this.fetchExternalApiKeys()
        }
      }
    },
    workspaceId: {
      handler: function (newValue, oldValue) {
        if (newValue && oldValue && newValue !== oldValue) {
          // Workspace Changed, reset api keys
          this.workspaceApiKeys = null
        }
      }
    }
  },

  computed: {
    isValid () {
      return !!this.selectedApiKey && !!this.organizationName
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
    apiKeysLoading () {
      return this.workspaceApiKeys === null
    },
    apiKeysEmpty () {
      return this.workspaceApiKeys !== null && this.workspaceApiKeys.length === 0
    }
  },

  methods: {
    ...mapActions('workspace', ['fetchWorkspaceExternalApiKeys']),
    ...mapActions('workspace/organization', ['cloneWorkspaceMerakiOrganization']),
    ...mapActions('layout', ['fetchUserWorkspaceOrganizations']),
    fetchExternalApiKeys () {
      this.loading = true
      this.fetchWorkspaceExternalApiKeys({
        workspaceId: this.workspaceId,
        page_size: 0
      }).then(response => {
        this.$set(this, 'workspaceApiKeys', response.data.data.filter(apiKey => apiKey.is_valid === true))
      }).finally(() => {
        this.loading = false
      })
    },
    onCloneClick () {
      this.loading = true
      this.cloneWorkspaceMerakiOrganization({
        workspaceId: this.workspaceId,
        workspace_api_key: this.selectedApiKey,
        source_organization: this.sourceOrganization.id,
        clone_organization_name: this.organizationName,
        strict_synchronization: this.isStrictSynchronizationEnabled
      }).then(response => {
        this.$refs.jobTrackingModal.open(
          response.data.data.id,
          this.$t('v2.workspaces.organizations.cloningMerakiOrganization').replace('{organization_name}', this.sourceOrganization.name),
          this.$t('v2.workspaces.organizations.cloningMerakiOrganizationDescription')
        ).then(success => {
          this.loading = false

          if (success) {
            // Re-fetch Workspace organizations and user workspace organizations
            this.fetchUserWorkspaceOrganizations({ workspaceId: this.workspaceId })
          }

          this.close()
        })

        EventTracker.sendEvent(EVENT_NAMES.MANAGED_ORGANIZATION_CLONED, {
          strict: this.isStrictSynchronizationEnabled
        })
      }).catch(() => {
        global.toastr['error'](this.$t('v2.workspaces.organizations.createOrganizationsFailure'), this.$t('general.error'))
        this.loading = false
      })
    },
    close () {
      this.$emit('close')
    },
    resetForm () {
      const cloneText = this.$t('general.clone')

      this.selectedApiKey = null
      this.organizationName = this.sourceOrganization ? `${this.sourceOrganization.name} - ${cloneText}` : null
      this.isStrictSynchronizationEnabled = false
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .clone-meraki-organization-modal {
    position: relative;

    &__header {

    }

    &__title {
      font-family: Fira Sans;
      font-style: normal;
      font-weight: 600;
      font-size: 21px;
      line-height: 25px;
      color: $blue-dark;
    }

    &__content {
      margin-top: 16px;
      min-height: 120px;

      label {
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 41px;
        color: $text-medium;
      }

      &__check-box-row {
        margin-top: 10px;
      }

      .no-api-key-error-message {
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 22px;
        color: $text-medium;
        margin-bottom: 20px;
      }
    }

    &__footer {
      margin-top: 30px;

      .base-button {
        margin-right: 24px;
      }
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
