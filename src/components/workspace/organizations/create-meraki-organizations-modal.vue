<template lang="pug">
  base-modal(
    class="create-meraki-organizations-modal"
    :show="show"
    @close="close"
    max-width="430px"
  )
    template(v-slot:header)
      div.create-meraki-organizations-modal__header
        v-layout(row wrap)
          v-flex(xs12)
            div.create-meraki-organizations-modal__title
              | {{ $t('v2.workspaces.organizations.createMerakiOrganizations') }}

    template(v-slot:default)
      div.create-meraki-organizations-modal__content
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
              | {{ $t('general.organizationNames') }}

            .create-meraki-organizations-modal__content__organization-row(
              v-for="(organizationName, index) of organizationNames"
            )
              v-layout(row wrap)
                v-flex(xs8 lg9)
                  base-text-input(
                    :value="organizationName"
                    @input="onOrganizationNameInput($event, index)"
                  )
                v-flex(xs4 lg3).create-meraki-organizations-modal__content__organization-row__actions
                  v-icon.create-meraki-organizations-modal__content__organization-row__actions__action(
                    v-if="organizationNames.length > 1"
                    @click="onRemoveOrganizationClick(index)"
                  ) close

                  v-icon.create-meraki-organizations-modal__content__organization-row__actions__action(
                    v-if="index === organizationNames.length - 1 && organizationNames.length < maxOrganizationCount"
                    @click="onAddOrganizationClick"
                  ) add

          v-flex(xs12)
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
      div.create-meraki-organizations-modal__footer
        v-layout(row wrap)
          v-flex(xs12)
            base-button(
              class="base-button--green"
              @click="onCreateClick"
              :disabled="!isValid"
            ) {{ $t('general.create') }}
            base-button(
              class="base-button--green--negative"
              @click="close"
            ) {{ $t('general.cancel') }}

      div.create-meraki-organizations-modal__loading-indicator(v-if="loading")
        v-progress-circular(
          :size="50"
          indeterminate color="#15ac2f"
        )

      job-tracking-modal(
        :persistent="true"
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
    }
  },

  data () {
    return {
      maxOrganizationCount: 10,
      loading: false,
      selectedApiKey: null,
      organizationNames: [''],
      isStrictSynchronizationEnabled: false,
      workspaceApiKeys: null,
      products: ['network_management']
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
      return !!this.selectedApiKey && this.organizationNames.length > 0 &&
        this.organizationNames.filter(name => !name).length === 0
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
    ...mapActions('workspace/organization', ['createWorkspaceMerakiOrganizations']),
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
    onOrganizationNameInput (value, index) {
      this.$set(this.organizationNames, index, value)
    },
    onCreateClick () {
      this.loading = true
      this.createWorkspaceMerakiOrganizations({
        workspaceId: this.workspaceId,
        workspace_api_key: this.selectedApiKey,
        organization_names: this.organizationNames,
        products: this.products,
        strict_synchronization: this.isStrictSynchronizationEnabled
      }).then(response => {
        this.$refs.jobTrackingModal.open(
          response.data.data.id,
          this.$t('v2.workspaces.organizations.creatingOrganizations'),
          this.$t('v2.workspaces.organizations.creatingOrganizationsDescription')
        ).then(success => {
          this.loading = false

          if (success) {
            // Re-fetch Workspace organizations and user root nodes
            this.fetchUserWorkspaceOrganizations({ workspaceId: this.workspaceId })

            this.close()
          }
        })

        EventTracker.sendEvent(EVENT_NAMES.MANAGED_ORGANIZATION_CREATED, {
          count: this.organizationNames.length,
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
      this.selectedApiKey = null
      this.organizationNames = ['']
      this.isStrictSynchronizationEnabled = false
    },
    onAddOrganizationClick () {
      this.organizationNames = [...this.organizationNames, '']
    },
    onRemoveOrganizationClick (index) {
      this.organizationNames = this.organizationNames.filter((item, itemIndex) => itemIndex !== index)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .create-meraki-organizations-modal {
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

      &__organization-row {
        margin-bottom: 10px;

        &__actions {
          &__action {
            cursor: pointer;
            line-height: 40px;
            margin-left: 10px;
            font-size: 24px;
          }
        }
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
