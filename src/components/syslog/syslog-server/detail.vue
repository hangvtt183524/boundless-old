<template lang="pug">
  .syslog-server-detail-page.page-content(
    v-if="syslogServer"
  )
    .syslog-server-detail-page__header
      .syslog-server-detail-page__header__back-link-container
        v-icon.syslog-server-detail-page__header__back-link-container__back-icon(
          @click="onBackClick"
        ) keyboard_backspace
      h4.syslog-server-detail-page__header__page-title
        | {{ isExistingServer ? syslogServer.ip_address : $t('v2.syslog.launchServer') }}

      .syslog-server-detail-page__header__actions
        base-button.base-button--green.syslog-server-detail-page__header__actions__action(
          v-if="isExistingServer ? hasPermission('syslog__edit_server', workspaceId) : hasPermission('syslog__create_server', workspaceId)"
          v-show="!isExistingServer || isUpdateEnabled"
          :disabled="!isValueChanged"
          @click="onSaveServerClick"
        )
          | {{ isExistingServer ? $t('general.saveChanges') : $t('v2.syslog.launchServer') }}

        base-button.base-button--blue.syslog-server-detail-page__header__actions__action(
          v-if="isExistingServer && hasPermission('syslog__reboot_server', workspaceId)"
          v-show="syslogServer.state === serverStates.active"
          @click="onRebootServerClick"
        )
          | {{ $t('v2.syslog.rebootServer') }}

        base-button.base-button--danger.syslog-server-detail-page__header__actions__action(
          v-if="isExistingServer && hasPermission('syslog__delete_server', workspaceId)"
          v-show="syslogServer.state === serverStates.active"
          @click="onTerminateServerClick"
        )
          | {{ $t('v2.syslog.terminateServer') }}

    .syslog-server-detail-page__content
      v-layout(row wrap).syslog-server-detail-page__content__server-panel
        v-flex(xs12 md6 lg4).syslog-server-detail-page__content__server-info-section
          server-info(
            v-if="isExistingServer"
            :server="syslogServer"

          )

          server-configuration(
            :server="syslogServer"
            :editing="editing"
            :is-existing-server="isExistingServer"
            :is-update-enabled="isUpdateEnabled"
            @toggleEditClick="onToggleEditClick"
          )

        v-flex(xs12 md6 lg8).syslog-server-detail-page__content__log-activity-section
          syslog-downloader(
            v-if="isExistingServer && syslogServer.state === serverStates.active"
            :server="syslogServer"
          )

          log-activity(
            v-if="isExistingServer && syslogServer.state === serverStates.active"
            :server="syslogServer"
          )

    .syslog-server-detail-page__loading-indicator(
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
import _ from 'lodash'
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import ConfirmModal from '@/components/v2/confirm-modal/confirm-modal'
import ServerInfo from './server-info'
import ServerConfiguration from './server-configuration'
import SyslogDownloader from './syslog-downloader'
import LogActivity from './log-activity'

export default {
  props: {
    syslogServerId: {
      type: Number,
      required: false
    }
  },
  mixins: [
    UserPermissionsMixin,
    CurrentNodeSelectionsMixin
  ],
  components: {
    SyslogDownloader,
    ServerConfiguration,
    LogActivity,
    ServerInfo,
    BaseButton,
    ConfirmModal
  },
  data () {
    return {
      loading: false,
      editing: false,
      syslogServer: null,
      originalSyslogServer: null,
      serverStates: {
        pending: 'pending',
        active: 'active',
        terminating: 'terminating',
        terminated: 'terminated',
        relaunching: 'relaunching'
      },
      refreshTimeout: null
    }
  },
  mounted () {
    if (this.syslogServerId) {
      this.fetchSyslogServer()
    } else {
      this.$set(this, 'syslogServer', this.getEmptyServer())
      this.$set(this, 'originalSyslogServer', this.getEmptyServer())
    }
  },
  beforeDestroy () {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout)
    }
  },
  computed: {
    isExistingServer () {
      return !!this.syslogServer && !!this.syslogServer.id
    },
    isValueChanged () {
      return !_.isEqual(this.syslogServer, this.originalSyslogServer)
    },
    isUpdateEnabled () {
      return this.syslogServer.state !== this.serverStates.terminated &&
        this.syslogServer.state !== this.serverStates.terminating
    }
  },
  methods: {
    ...mapActions('workspace/syslog', ['retrieveSyslogServer', 'terminateSyslogServer', 'rebootSyslogServer',
      'createSyslogServer', 'updateSyslogServer']),
    getEmptyServer () {
      return {
        elastic_ip: '',
        state: '',
        name: '',
        region: 'eu-west-1', // Fixed for now
        data_retention_days: 365, // Default value
        ip_address: '',
        instance_id: '',
        created_at: '',
        updated_at: ''
      }
    },
    fetchSyslogServer () {
      this.retrieveSyslogServer({
        workspaceId: this.workspaceId,
        id: this.syslogServerId
      }).then(response => {
        this.$set(this, 'syslogServer', response.data.data)
        this.$set(this, 'originalSyslogServer', JSON.parse(JSON.stringify(response.data.data)))

        // If the server is in pending or terminating state, re-fetch every 30 seconds
        if ([this.serverStates.pending, this.serverStates.terminating, this.serverStates.relaunching].indexOf(this.syslogServer.state) > -1) {
          this.refreshTimeout = setTimeout(this.fetchSyslogServer.bind(this), 10000)
        }
      })
    },
    onSaveServerClick () {
      if (this.isExistingServer) {
        this.updateServer()
      } else {
        this.createServer()
      }
    },
    updateServer () {
      const isUpdatingRetentionSettings =
        this.syslogServer.data_retention_days !== this.originalSyslogServer.data_retention_days

      this.loading = true
      this.updateSyslogServer({
        workspaceId: this.workspaceId,
        ...this.syslogServer
      }).then(response => {
        this.$set(this, 'syslogServer', response.data.data)
        this.$set(this, 'originalSyslogServer', JSON.parse(JSON.stringify(response.data.data)))
        this.editing = false

        global.toastr['success'](this.$t('v2.syslog.updateServerSuccess'), this.$t('general.success'))

        if (isUpdatingRetentionSettings) {
          // TODO: Decide on warning colors with designer and update this toast to warning
          global.toastr['success'](this.$t('v2.syslog.retentionDaysUpdateInfo'), this.$t('general.warning'))
        }
      }).catch(() => {
        global.toastr['error'](this.$t('v2.syslog.updateServerFailure'), this.$t('general.error'))
      }).finally(() => {
        this.loading = false
      })
    },
    createServer () {
      this.loading = true
      this.createSyslogServer({
        workspaceId: this.workspaceId,
        ...this.syslogServer
      }).then(response => {
        this.$set(this, 'syslogServer', response.data.data)
        this.$set(this, 'originalSyslogServer', JSON.parse(JSON.stringify(response.data.data)))
        this.editing = false

        global.toastr['success'](this.$t('v2.syslog.createServerSuccess'), this.$t('general.success'))

        // Go back to listing screen
        this.onBackClick()
      }).catch(() => {
        global.toastr['error'](this.$t('v2.syslog.createServerFailure'), this.$t('general.error'))
      }).finally(() => {
        this.loading = false
      })
    },
    onToggleEditClick () {
      this.editing = !this.editing

      if (!this.editing) {
        // Reset syslog server to original state on edit cancel
        this.$set(this, 'syslogServer', JSON.parse(JSON.stringify(this.originalSyslogServer)))
      }
    },
    onRebootServerClick () {
      this.$refs.confirmModal.open(
        this.$t('errors.warning'),
        this.$t('v2.syslog.rebootServerConfirmation')
      ).then(confirm => {
        if (confirm) {
          this.loading = true
          this.rebootSyslogServer({
            workspaceId: this.workspaceId,
            id: this.syslogServer.id
          }).then(response => {
            // Re-fetch syslog server
            this.fetchSyslogServer()

            global.toastr['success'](this.$t('v2.syslog.rebootServerSuccess'), this.$t('general.success'))
          }).catch(() => {
            global.toastr['error'](this.$t('v2.syslog.rebootServerFailure'), this.$t('general.error'))
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    onTerminateServerClick () {
      this.$refs.confirmModal.open(
        this.$t('errors.warning'),
        this.$t('v2.syslog.terminateServerConfirmation')
      ).then(confirm => {
        if (confirm) {
          this.loading = true
          this.terminateSyslogServer({
            workspaceId: this.workspaceId,
            id: this.syslogServer.id
          }).then(response => {
            // Re-fetch syslog server
            this.fetchSyslogServer()

            global.toastr['success'](this.$t('v2.syslog.terminateServerSuccess'), this.$t('general.success'))
          }).catch(() => {
            global.toastr['error'](this.$t('v2.syslog.terminateServerFailure'), this.$t('general.error'))
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    onBackClick () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";
  @import "styles/v2/base.scss";

  .syslog-server-detail-page {
    background-color: $white;
    position: relative;

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

      &__actions {
        float: right;

        &__action {
          margin: 10px 0 0 13px;
          width: 180px;
        }
      }
    }

    &__content {
      padding: 44px 40px;
      box-sizing: border-box;

      &__server-panel {
        height: 100%;
      }

      &__server-info-section {
        border-bottom: 1px solid $gray-xlight;
        padding-bottom: 50px;

        @media (min-width: 992px) {
          padding-right: 50px;
          border-bottom: 0;
          padding-bottom: 0;
          border-right: 3px solid $gray-xlight;
        }

        .server-info {
          margin-bottom: 20px;
        }
      }

      &__log-activity-section {
        @media (min-width: 992px) {
          padding-left: 50px;
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
