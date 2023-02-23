<template lang="pug">
  .meraki-setting-detail
    .meraki-setting-detail__api-key
      .meraki-setting-detail__api-key__header
        h4.meraki-setting-detail__api-key__header__page-title
          | {{ $t('v2.organization.settings.editMerakiSetup') }}
      .meraki-setting-detail__api-key__content
        v-layout(row wrap).meraki-setting-detail__api-key__content__row
          v-flex(xs11 offset-xs1)
            base-switch(
              class="base-switch-container--multiline"
              :label="$t('v2.organization.settings.strictSynchronization')"
              v-model="isStrictSynchronizationEnabled"
            )
            base-button(
              class="base-button--green"
              @click="onUpdateConfigurationClick"
              :disabled="isStrictSynchronizationEnabled === this.selectedOrganization.meraki_organization.strict_synchronization"
            )
              | {{ $t('general.save') }}

    .meraki-setting-detail__de-register
      v-layout(row wrap)
        v-flex(xs6 md4 lg3).meraki-setting-detail__de-register__actions
          .meraki-setting-detail__meraki-organization
            | {{ $t('v2.organization.settings.merakiOrganization') }}:
            .meraki-setting-detail__meraki-organization__name
              | {{ selectedOrganization.meraki_organization.name }}
          .meraki-setting-detail__refresh-data(
            @click="onRefreshData"
          )
            | {{ $t('general.refreshData') }}
          .meraki-setting-detail__de-register__actions__entity-selections
            .meraki-setting-detail__de-register__actions__entity-selections__item(
              :class="{'meraki-setting-detail__de-register__actions__entity-selections__item--active': selectedEntityOption === entityOptions.venues}"
              @click="onEntityOptionClick(entityOptions.venues)"
            )
              base-check-box.meraki-setting-detail__de-register__actions__entity-selections__item__check-box(
                v-model="venuesSelected"
              )
              span.meraki-setting-detail__de-register__actions__entity-selections__item__label
                | {{ $t('general.venues') }}
              span.meraki-setting-detail__de-register__actions__entity-selections__item__count
                | ({{ associatedSitesCount }})
            .meraki-setting-detail__de-register__actions__entity-selections__item(
              :class="{'meraki-setting-detail__de-register__actions__entity-selections__item--active': selectedEntityOption === entityOptions.devices}"
              @click="onEntityOptionClick(entityOptions.devices)"
            )
              base-check-box.meraki-setting-detail__de-register__actions__entity-selections__item__check-box(
                v-model="devicesSelected"
              )
              span.meraki-setting-detail__de-register__actions__entity-selections__item__label
                | {{ $t('venue.devices') }}
              span.meraki-setting-detail__de-register__actions__entity-selections__item__count
                | ({{ associatedDevicesCount }})
          .meraki-setting-detail__de-register__actions__action(
            @click="onDeRegisterClick"
          )
            | {{ $t('v2.organization.settings.deregisterMerakiAction') }}

        v-flex(xs6 md8 lg9).meraki-setting-detail__de-register__entities
          .meraki-setting-detail__de-register__entities__entity-list(
            v-show="selectedEntityOption === entityOptions.venues"
          )
            h4.meraki-setting-detail__de-register__entities__entity-list__title
              | {{ $t('general.venues') }}
            .meraki-setting-detail__de-register__entities__entity-list__items
              v-layout(row wrap)
                v-flex(xs6 md4 lg4).meraki-setting-detail__de-register__entities__entity-list__items__item(
                  v-for="venue of associatedSites"
                  :key="venue.id"
                ) {{ venue.name }}
            .meraki-setting-detail__de-register__entities__entity-list__page-buttons(
              v-if="associatedSitesPageButtons.length > 0"
            )
              .meraki-setting-detail__de-register__entities__entity-list__page-buttons__button(
                v-for="(page, index) of associatedSitesPageButtons"
                :class="[{'meraki-setting-detail__de-register__entities__entity-list__page-buttons__button--current': sitesPage === page}, {'meraki-setting-detail__de-register__entities__entity-list__page-buttons__button--separator': page === '...'}]"
                :key="index"
                @click="onSitesPageLinkClick(page)"
              ) {{ page }}

          .meraki-setting-detail__de-register__entities__entity-list(
            v-show="selectedEntityOption === entityOptions.devices"
          )
            h4.meraki-setting-detail__de-register__entities__entity-list__title
              | {{ $t('venue.devices') }}
            .meraki-setting-detail__de-register__entities__entity-list__items
              v-layout(row wrap)
                v-flex.meraki-setting-detail__de-register__entities__entity-list__items__item(
                  xs6 md4 lg4
                  v-for="device of associatedDevices"
                  :key="device.id"
                ) {{ device.name }}
            .meraki-setting-detail__de-register__entities__entity-list__page-buttons(
              v-if="associatedDevicesPageButtons.length > 0"
            )
              .meraki-setting-detail__de-register__entities__entity-list__page-buttons__button(
                v-for="(page, index) of associatedDevicesPageButtons"
                :class="[{'meraki-setting-detail__de-register__entities__entity-list__page-buttons__button--current': devicesPage === page}, {'meraki-setting-detail__de-register__entities__entity-list__page-buttons__button--separator': page === '...'}]"
                :key="index"
                @click="onDevicesPageLinkClick(page)"
              ) {{ page }}

    meraki-de-registration-modal(
      :show="isDeRegistrationModalVisible"
      :delete-venues="venuesSelected"
      :delete-devices="devicesSelected"
      @close="onDeRegistrationModalClose"
    )

    confirm-modal(
      ref="confirmModal"
    )

    job-tracking-modal(
      mode="organization"
      :persistent="true"
      ref="jobTrackingModal"
    )

    .meraki-setting-detail__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import BaseButton from '@/components/v2/base-button/base-button'
import BaseCheckBox from '@/components/v2/base-check-box/base-check-box'
import MerakiDeRegistrationModal from './meraki-de-registration-modal'
import ConfirmModal from '@/components/v2/confirm-modal/confirm-modal'
import BaseSwitch from '@/components/v2/base-switch/base-switch'
import JobTrackingModal from '@/components/v2/job-tracking-modal/job-tracking-modal'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'meraki-setting-detail',
  components: {
    JobTrackingModal,
    MerakiDeRegistrationModal,
    BaseCheckBox,
    BaseButton,
    BaseTextInput,
    ConfirmModal,
    BaseSwitch
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  data: function () {
    return {
      loading: false,
      apiKey: null,
      venuesSelected: true,
      devicesSelected: true,
      entityOptions: {
        venues: 'venues',
        devices: 'devices'
      },
      selectedEntityOption: 'venues',
      isDeRegistrationModalVisible: false,
      isStrictSynchronizationEnabled: false,
      pageSize: 40,
      sitesPage: 1,
      devicesPage: 1
    }
  },
  mounted () {
    this.fetchAssociatedEntities(false)

    this.isStrictSynchronizationEnabled = this.selectedOrganization.meraki_organization.strict_synchronization
  },
  computed: {
    ...mapGetters('layout', ['selectedOrganization']),
    ...mapGetters('organization/meraki', ['associatedSites', 'associatedSitesCount']),
    ...mapGetters('workspace/network', ['associatedDevices', 'associatedDevicesCount']),
    associatedSitesPageButtons () {
      return this.getAssociatedEntitiesPageButtons(this.associatedSitesCount, this.sitesPage)
    },
    associatedDevicesPageButtons () {
      return this.getAssociatedEntitiesPageButtons(this.associatedDevicesCount, this.devicesPage)
    }
  },
  watch: {
    selectedOrganization: {
      handler: function () {
        this.fetchAssociatedEntities(false)

        this.isStrictSynchronizationEnabled = this.selectedOrganization.meraki_organization.strict_synchronization
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('organization/meraki', ['fetchAssociatedSites', 'synchronizeMerakiOrganization',
      'setMerakiOrganizationStrictSynchronization']),
    ...mapActions('organization', ['updateOrganization', 'fetchOrganization']),
    ...mapActions('workspace/network', ['fetchAssociatedDevices']),
    fetchAssociatedSiteList (showLoadingSpinner) {
      if (showLoadingSpinner) {
        this.loading = true
      }

      this.fetchAssociatedSites({
        organizationId: this.selectedOrganization.id,
        page_size: this.pageSize,
        page: this.sitesPage
      }).finally(() => {
        this.loading = false
      })
    },
    fetchAssociatedDeviceList (showLoadingSpinner) {
      if (showLoadingSpinner) {
        this.loading = true
      }

      this.fetchAssociatedDevices({
        workspaceId: this.workspaceId,
        organization: this.selectedOrganization.id,
        page_size: this.pageSize,
        page: this.devicesPage
      }).finally(() => {
        this.loading = false
      })
    },
    fetchAssociatedEntities (showLoadingSpinner) {
      if (!(this.selectedOrganization && this.selectedOrganization.id)) {
        // Initialization not complete yet
        return false
      }

      this.sitesPage = 1
      this.devicesPage = 1

      this.fetchAssociatedSiteList(showLoadingSpinner)
      this.fetchAssociatedDeviceList(showLoadingSpinner)
    },
    getAssociatedEntitiesPageButtons: function (totalItems, page) {
      const pageButtons = []

      const pageCount = Math.ceil(totalItems / this.pageSize)

      if (pageCount > 1) {
        for (let i = page - 2; i <= page + 2; i++) {
          if (i > 0 && i <= pageCount) {
            pageButtons.push(i)
          }
        }

        // Add first and last page links, if not added
        if (pageButtons.indexOf(1) === -1) {
          if (pageButtons.indexOf(2) === -1) {
            pageButtons.unshift(1, '...')
          } else {
            pageButtons.unshift(1)
          }
        }

        if (pageButtons.indexOf(pageCount) === -1) {
          if (pageButtons.indexOf(pageCount - 1) === -1) {
            pageButtons.push('...', pageCount)
          } else {
            pageButtons.push(pageCount)
          }
        }
      }

      return pageButtons
    },
    onSitesPageLinkClick (pageNumber) {
      this.sitesPage = pageNumber
      this.fetchAssociatedSiteList(true)
    },
    onDevicesPageLinkClick (pageNumber) {
      this.devicesPage = pageNumber
      this.fetchAssociatedDeviceList(true)
    },
    onBackClick () {
      this.$router.go(-1)
    },
    onEntityOptionClick (option) {
      this.selectedEntityOption = option
    },
    onUpdateConfigurationClick () {
      if (this.isStrictSynchronizationEnabled && !this.selectedOrganization.meraki_organization.strict_synchronization) {
        this.$refs.confirmModal.open(
          this.$t('errors.warning'),
          this.$t('v2.organization.settings.strictSynchronizationEnableWarning')
        ).then(confirm => {
          if (confirm) {
            this.updateConfiguration()
          }
        })
      } else {
        this.updateConfiguration()
      }
    },
    updateConfiguration () {
      this.loading = true
      this.setMerakiOrganizationStrictSynchronization({
        organizationId: this.$route.params.orgId,
        strict_synchronization: this.isStrictSynchronizationEnabled
      }).then(response => {
        // Check if a direct result or a job is returned
        if (response.data.data.hasOwnProperty('strict_synchronization')) {
          this.isStrictSynchronizationEnabled = response.data.data.strict_synchronization

          // To update strict synchronization value in store
          this.fetchOrganization(this.$route.params.orgId)

          this.loading = false
          global.toastr['success'](this.$t('v2.organization.settings.settingsSuccessfullySaved'), this.$t('general.success'))
        } else {
          // A job is returned, open job tracking modal
          this.openConfigurationJobTrackingModal(response.data.data.id)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    openConfigurationJobTrackingModal (jobId) {
      this.$refs.jobTrackingModal.open(
        jobId,
        this.$t('v2.organization.settings.enablingStrictSynchronization'),
        this.$t('v2.organization.settings.enablingStrictSynchronizationDescription')
      ).then(() => {
        this.loading = false

        // To update strict synchronization value in store
        this.fetchOrganization(this.$route.params.orgId)
      })
    },
    onRefreshData () {
      this.synchronizeMerakiOrganization({
        organizationId: this.$route.params.orgId
      }).then(response => {
        this.$refs.jobTrackingModal.open(
          response.data.data.id,
          this.$t('organization.connectionProgressTitle'),
          this.$t('organization.connectionProgressDescription')
        )
      })

      EventTracker.sendEvent(EVENT_NAMES.MERAKI_DATA_REFRESHED)
    },
    onDeRegisterClick () {
      this.isDeRegistrationModalVisible = true
    },
    onDeRegistrationModalClose () {
      this.isDeRegistrationModalVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";
  @import "styles/v2/base.scss";

  .meraki-setting-detail {
    width: 100%;
    position: relative;

    &__meraki-organization {
      padding: 40px 40px 20px 40px;
      &__name {
        font-weight: bold;
      }
    }

    &__refresh-data {
      margin-right: 10px;
      cursor: pointer;
      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 15px;
      line-height: 20px;
      text-align: right;
      color: $green-medium;
      text-decoration-line: underline;
    }

    &__api-key {
      background-color: $white;

      &__header {
        height: 60px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        box-sizing: border-box;
        padding: 0 30px 0 0;
        overflow: hidden;

        &__back-link-container {
          float: left;
          width: 60px;
          line-height: 60px;
          border-right: 1px solid $gray-xlight;
          text-align: center;

          &__back-icon {
            color: $blue-reserve;
            line-height: 60px;
          }
        }

        &__page-title {
          margin-left: 33px;
          line-height: 60px;
          letter-spacing: 1px;
          float: left;
        }
      }

      &__content {
        padding: 16px 0 39px 0;

        &__row {
          &:not(:first-child) {
            margin-top: 20px;
          }
        }

        .base-text-input {
          width: 300px;
          display: inline-block;
        }

        .base-switch-container {
          display: inline-block;
        }

        .base-button {
          padding: 0 32px;
          margin-left: 20px;
        }
      }
    }

    &__de-register {
      margin-top: 27px;
      background-color: $white;

      &__actions {
        box-shadow: 5px 0 10px rgba(0, 0, 0, 0.05);

        &__description {
          padding: 28px 37px;

          font-family: Fira Sans;
          font-style: normal;
          font-weight: normal;
          font-size: 15px;
          line-height: 20px;
          color: $text-medium;
        }

        &__entity-selections {
          border-top: 2px solid $gray-xlight;

          &__item {
            cursor: pointer;
            height: 40px;
            line-height: 40px;
            padding-left: 37px;
            border-bottom: 2px solid $gray-xlight;

            &__check-box {
              margin-right: 15px;
              position: relative;
              top: 5px;
            }

            &__label, &__count {
              font-family: Fira Sans;
              font-style: normal;
              font-weight: 500;
              font-size: 15px;
              color: $text-medium;
            }

            &__count {
              margin-left: 5px;
            }

            &--active {
              background-color: $blue-dark;

              .meraki-setting-detail__de-register__actions__entity-selections__item__label,
              .meraki-setting-detail__de-register__actions__entity-selections__item__count {
                color: $white;
              }
            }
          }
        }

        &__action {
          margin: 32px 37px;
          cursor: pointer;

          font-family: Fira Sans;
          font-style: normal;
          font-weight: normal;
          font-size: 15px;
          line-height: 20px;
          text-align: left;
          color: $green-medium;

          text-decoration-line: underline;
        }
      }

      &__entities {
        padding: 29px 50px;

        &__entity-list {
          &__items {
            margin-top: 25px;
            overflow: hidden;

            &__item {
              font-family: Source Sans Pro;
              font-style: normal;
              font-weight: normal;
              font-size: 14px;
              line-height: 26px;
              color: $text-medium;
              float: left;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              padding-right: 70px;
            }
          }

          &__page-buttons {
            margin-top: 27px;
            text-align: right;

            &__button {
              display: inline-block;
              width: 30px;
              height: 30px;
              text-align: center;
              line-height: 30px;
              border: 1px solid $gray-dark;
              border-radius: 4px;
              margin-left: 6px;
              cursor: pointer;

              font-family: Source Sans Pro;
              font-style: normal;
              font-weight: 600;
              font-size: 13px;
              color: $gray-dark;

              &--current {
                background-color: $blue-reserve;
                color: $white;
              }

              &--separator {
                border: none;
                margin: 0 6px;
                cursor: default;
                position: relative;
                top: -4px;
              }
            }
          }
        }
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
