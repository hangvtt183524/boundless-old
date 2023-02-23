<template lang="pug">
  base-modal(
    class="workspace-external-api-key-detail-modal"
    :show="show"
    @close="close"
    max-width="430px"
  )
    template(v-slot:header)
      div.workspace-external-api-key-detail-modal__header
        v-layout(row wrap)
          v-flex(xs12)
            div.workspace-external-api-key-detail-modal__title
              | {{ $t('general.apiKey') }}

    template(v-slot:default)
      div.workspace-external-api-key-detail-modal__content
        v-layout(row wrap)
          v-flex(xs12)
            base-text-input(
              v-model='apiKey.name'
              :label="$t('general.name')"
              class="base-text-input--multiline"
            )

        v-layout(row wrap)
          v-flex(xs12)
            base-select(
              v-model='apiKey.vendor'
              :items="vendorOptions"
              :label="$t('general.vendor')"
              :disabled="true"
            )

        v-layout(row wrap)
          v-flex(xs12)
            base-text-input(
              v-if="isExistingKey"
              :value='apiKey.api_key_display'
              :label="$t('general.apiKey')"
              class="base-text-input--multiline"
              :disabled="true"
            )
            base-text-input(
              v-if="!isExistingKey"
              v-model='apiKey.api_key'
              :label="$t('general.apiKey')"
              class="base-text-input--multiline"
            )

    template(v-slot:footer)
      div.workspace-external-api-key-detail-modal__footer
        v-layout(row wrap)
          v-flex(xs12)
            base-button(
              class="base-button--green"
              @click="onSaveClick"
              :disabled="!(isValid && isValueChanged)"
            ) {{ isExistingKey ? $t('general.save') : $t('general.add') }}
            base-button(
              class="base-button--green--negative"
              @click="close"
            ) {{ $t('general.cancel') }}

      div.workspace-external-api-key-detail-modal__loading-indicator(v-if="loading")
        v-progress-circular(
          :size="50"
          indeterminate color="#15ac2f"
        )

      job-tracking-modal(
        :persistent="true"
        :dismissible="true"
        ref="jobTrackingModal"
      )

</template>

<script>
import { mapActions } from 'vuex'

import BaseModal from '@/components/v2/base-modal/base-modal.vue'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import BaseSelect from '@/components/v2/base-select/base-select.vue'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import CurrentUserMixin from '@/mixins/current-user.mixin'
import JobTrackingModal from '@/components/v2/job-tracking-modal/job-tracking-modal.vue'
import _ from 'lodash'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  components: {
    BaseModal,
    BaseTextInput,
    BaseButton,
    BaseSelect,
    JobTrackingModal
  },
  mixins: [
    CurrentNodeSelectionsMixin,
    CurrentUserMixin
  ],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    keyData: {
      required: false
    }
  },
  data () {
    return {
      loading: false,
      apiKey: {},
      originalApiKey: {},
      vendorOptions: [
        {
          name: 'Meraki',
          key: 'meraki'
        }
      ]
    }
  },
  mounted () {
    this.resetForm()
  },
  watch: {
    show (v) {
      if (v === true) {
        this.resetForm()
      }
    }
  },

  computed: {
    isExistingKey () {
      return !!this.keyData
    },
    isValid () {
      return this.isExistingKey ? (!!this.apiKey.name) : (!!this.apiKey.name && !!this.apiKey.api_key)
    },
    isValueChanged () {
      return !_.isEqual(this.apiKey, this.originalApiKey)
    }
  },

  methods: {
    ...mapActions('workspace', ['createWorkspaceExternalApiKey', 'updateWorkspaceExternalApiKey']),
    close (isSaved) {
      this.$emit('close', isSaved)
    },
    resetForm () {
      if (this.isExistingKey) {
        this.$set(this, 'apiKey', JSON.parse(JSON.stringify(this.keyData)))
      } else {
        this.$set(this, 'apiKey', {
          api_key: null,
          name: this.$t('v2.workspaces.externalApiKeys.usersKey').replace('{user_name}', this.currentUser.profile.full_name),
          vendor: 'meraki'
        })
      }

      this.$set(this, 'originalApiKey', JSON.parse(JSON.stringify(this.apiKey)))
    },
    onSaveClick () {
      let saveMethod
      if (this.isExistingKey) {
        // Updating an existing api key
        saveMethod = this.updateWorkspaceExternalApiKey
      } else {
        // Creating a new api key
        saveMethod = this.createWorkspaceExternalApiKey
      }

      this.loading = true
      saveMethod({
        ...this.apiKey,
        workspaceId: this.workspaceId
      }).then(response => {
        if (this.isExistingKey) {
          global.toastr['success'](this.$t('v2.workspaces.externalApiKeys.updateApiKeySuccess'), this.$t('general.success'))
          EventTracker.sendEvent(EVENT_NAMES.API_KEY_MODIFIED)

          this.close(true)
        } else {
          global.toastr['success'](this.$t('v2.workspaces.externalApiKeys.addApiKeySuccess'), this.$t('general.success'))
          EventTracker.sendEvent(EVENT_NAMES.API_KEY_ADDED)

          this.$refs.jobTrackingModal.open(
            response.data.data.id,
            this.$t('v2.workspaces.externalApiKeys.syncProgressTitle'),
            this.$t('v2.workspaces.externalApiKeys.syncProgressDescription')
          ).then(success => {
            if (success) {
              global.toastr['success'](this.$t('v2.workspaces.externalApiKeys.syncSuccess'), this.$t('general.success'))
            }

            this.close(true)
          })
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .workspace-external-api-key-detail-modal {
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
      padding-bottom: 60px;

      label {
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 41px;
        color: $text-medium;
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
