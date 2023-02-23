<template lang="pug">
  base-modal(
    class="meraki-de-registration-modal"
    :show="show"
    @close="close"
    max-width="520px"
    :persistent="true"
  )
    template(v-slot:default)
      div.meraki-de-registration-modal__content
        .meraki-de-registration-modal__content__default(
          v-if="state === stateOptions.default && loading === false"
        )
          div.meraki-de-registration-modal__title
            | {{ $t('errors.warning') }}
          div.meraki-de-registration-modal__description
            | {{ $t('v2.organization.settings.merakiDeRegistrationWarning') }}
          div.meraki-de-registration-modal__confirmation
            | {{ $t('v2.organization.settings.deleteConfirmation') }}
          div.meraki-de-registration-modal__actions
            base-button(
              class="base-button--green"
              @click="onDeleteClick"
            ) {{ $t('general.delete') }}
            base-button(
              class="base-button--green--negative"
              @click="close"
            ) {{ $t('general.cancel') }}

        .meraki-de-registration-modal__content__loading(
          v-if="loading"
        )
          div.meraki-de-registration-modal__icon-container
            v-progress-circular.meraki-de-registration-modal__icon-container__icon(
              :size="50"
              indeterminate color="#15ac2f"
            )
          div.meraki-de-registration-modal__description
            | {{ $t('v2.organization.settings.merakiDeRegistrationProgress') }}

        .meraki-de-registration-modal__content__success(
          v-if="state === stateOptions.successful && loading === false"
        )
          div.meraki-de-registration-modal__title
            | {{ $t('general.success') }}
          div.meraki-de-registration-modal__description
            | {{ $t('v2.organization.settings.merakiDeRegistrationSuccess') }}
          div.meraki-de-registration-modal__actions
            base-button(
              class="base-button--green"
              @click="onFinishClick"
            ) {{ $t('general.close') }}

</template>

<script>
import BaseModal from '@/components/v2/base-modal/base-modal.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import { mapActions, mapGetters } from 'vuex'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'meraki-de-registration-modal',
  components: {
    BaseModal,
    BaseButton
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    deleteVenues: {
      type: Boolean,
      default: false
    },
    deleteDevices: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      loading: false,
      stateOptions: {
        default: 'default',
        successful: 'successful'
      },
      state: 'default',
      deRegistrationJob: null,
      jobStatuses: {
        pending: 'pending',
        running: 'running',
        successful: 'successful',
        failed: 'failed'
      }
    }
  },
  computed: {
    ...mapGetters('layout', ['selectedOrganization'])
  },
  methods: {
    ...mapActions('organization/meraki', ['deRegisterMerakiOrganization']),
    ...mapActions('organization', ['fetchOrganization']),
    close () {
      this.$emit('close')
    },
    trackDeRegistrationJob () {
      if (!this.deRegistrationJob) {
        return false
      }

      const jobData = {
        workspaceId: this.workspaceId,
        jobId: this.deRegistrationJob.id
      }

      this.$store.dispatch('workspace/network/fetchLongRunningJob', jobData).then(response => {
        const jobData = response.data.data

        if (jobData.status === this.jobStatuses.successful) {
          this.$set(this, 'loading', false)
          this.$set(this, 'state', this.stateOptions.successful)

          // Re-fetch organization to reset settings state
          this.fetchOrganization(this.$route.params.orgId)
        } else if (jobData.status === this.jobStatuses.failed) {
          if (jobData.events.length && jobData.events.filter(event => {
            return event.code === 'database_error'
          }).length > 0) {
            // Database error. De-registration might be completed by another user
            // Re-fetch current organization and redirect to settings page
            this.fetchOrganization(this.$route.params.orgId)
            this.$router.push({ name: 'OrganizationSettingsExternalIntegrations' })
          }

          this.$set(this, 'loading', false)
        } else if (jobData.status === this.jobStatuses.pending || jobData.status === this.jobStatuses.running) {
          // Set progress info, if any
          // Job still not complete, re-run this method in 2 seconds
          setTimeout(this.trackDeRegistrationJob.bind(this), 2000)
        }
      }).catch(() => {
        this.$set(this, 'loading', false)
      })
    },
    onDeleteClick () {
      this.loading = true
      this.deRegisterMerakiOrganization({
        organizationId: this.selectedOrganization.id,
        remove_associated_venues: this.deleteVenues,
        remove_associated_devices: this.deleteDevices
      }).then(response => {
        this.deRegistrationJob = response.data.data
        this.trackDeRegistrationJob()
      })

      EventTracker.sendEvent(EVENT_NAMES.MERAKI_DATA_REMOVED)
    },
    onFinishClick () {
      this.$router.push({ name: 'OrganizationSettingsExternalIntegrations' })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .meraki-de-registration-modal {
    &__content {
      padding: 35px 0 45px 0;
    }

    &__title {
      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 30px;
      line-height: 26px;

      letter-spacing: 0.5px;
      text-transform: uppercase;
      color: $blue-dark;
      text-align: center;
      margin-bottom: 60px;
    }

    &__description, &__confirmation {
      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 25px;
      text-align: center;
      color: $text-dark;
    }

    &__confirmation {
      font-weight: bold;
      margin-top: 5px;
    }

    &__actions {
      margin-top: 50px;
      text-align: center;

      .base-button {
        margin-right: 20px;
        padding: 0 30px;
      }
    }

    &__icon-container {
      text-align: center;
      margin-top: 30px;
      margin-bottom: 30px;
    }

  }
</style>
