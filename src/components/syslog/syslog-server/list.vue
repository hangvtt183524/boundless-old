<template lang="pug">
  .syslog-server-list.page-content
    .syslog-server-list__header
      search-input.base-text-input--small.syslog-server-list__header__search-input(
        :placeholder="$t('general.search')"
        v-model="search"
      )

      .syslog-server-list__header__options
        base-check-box(
          v-if="terminatedSyslogServers.length > 0"
          v-model="isTerminatedServersHidden"
          :label="$t('v2.syslog.hideTerminatedServers')"
        )

      .syslog-server-list__header__actions
        base-button.base-button--green.syslog-server-list__header__actions__action(
          v-if="hasPermission('syslog__create_server', workspaceId)"
          v-show="serversLoaded"
          @click="onLaunchServerClick"
        )
          | {{ $t('v2.syslog.launchServer') }}

    .syslog-server-list__content
      perfect-scrollbar.syslog-server-list__content__scroll-holder(
        :options="{ suppressScrollX: true }"
      )
        .syslog-server-list__content__table-container
          base-table.syslog-server-list__content__template-table(
            :items="filteredSyslogServers"
            :headers="tableHeaders"
            :actions="tableActions"
            :sortable="true"
            @actionClick="onTableActionClick"
          )

    .syslog-server-list__loading-indicator(
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
import { mapActions, mapGetters } from 'vuex'
import BaseTable from '@/components/v2/base-table/base-table.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import ConfirmModal from '@/components/v2/confirm-modal/confirm-modal'
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

import SearchInput from '@/components/v2/search-input/search-input'
import { dateTimeFormatter } from '@/utils/global-cell-formatters'
import BaseCheckBox from '../../v2/base-check-box/base-check-box'

export default {
  name: 'syslog-server-list',
  components: {
    BaseCheckBox,
    SearchInput,
    BaseTable,
    BaseButton,
    ConfirmModal
  },
  mixins: [
    UserPermissionsMixin,
    CurrentNodeSelectionsMixin
  ],
  data () {
    return {
      search: '',
      loading: false,
      serversLoaded: false,
      ordering: '-created_at',
      serverStates: {
        pending: 'pending',
        active: 'active',
        terminating: 'terminating',
        terminated: 'terminated',
        relaunching: 'relaunching'
      },
      maxOrganizationServerCount: 1,
      refreshTimeout: null,
      isTerminatedServersHidden: true
    }
  },
  mounted () {
    this.fetchNodeSyslogServers()
  },
  beforeDestroy () {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout)
    }
  },
  computed: {
    ...mapGetters('workspace/syslog', ['syslogServers']),
    visibleSyslogServers () {
      return (this.isTerminatedServersHidden ? this.nonTerminatedSyslogServers : this.syslogServers).map(server => {
        return {
          ...server,
          deleted_at: server.state === this.serverStates.terminated ? server.updated_at : null
        }
      })
    },
    filteredSyslogServers () {
      return this.visibleSyslogServers.filter(server => {
        return (server.ip_address ? server.ip_address : '').toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
          (server.organization_name ? server.organization_name : '').toLowerCase().indexOf(this.search.toLowerCase()) > -1
      })
    },
    tableHeaders () {
      const tableHeaders = [
        {
          text: this.$t('general.name'),
          value: 'name'
        },
        {
          text: this.$t('general.organization'),
          value: 'organization_name'
        },
        {
          text: this.$t('v2.syslog.ipAddress'),
          value: 'ip_address'
        },
        {
          text: this.$t('v2.syslog.instanceId'),
          value: 'instance_id'
        },
        {
          text: this.$t('general.status'),
          value: 'state',
          formatter: this.statusCellFormatter
        },
        {
          text: this.$t('v2.syslog.dataRetentionPolicy'),
          value: 'data_retention_days',
          formatter: this.dataRetentionPolicyCellFormatter
        },
        {
          text: this.$t('wifi.createdOn'),
          value: 'created_at',
          formatter: dateTimeFormatter
        }
      ]

      if (!this.isTerminatedServersHidden) {
        // Add deleted at header
        tableHeaders.splice(5, 0, {
          text: this.$t('v2.syslog.deletedAt'),
          value: 'deleted_at',
          formatter: dateTimeFormatter
        })
      }

      return tableHeaders
    },
    tableActions () {
      // Construct table actions taking user permissions into account
      const tableActions = [{
        icon: '$vuetify.icons.edit',
        type: 'edit'
      }]

      if (this.hasPermission('syslog__delete_server', this.workspaceId)) {
        tableActions.push({
          icon: '$vuetify.icons.delete',
          type: 'terminate',
          displayCondition: (item) => {
            return item.state === 'active'
          }
        })
      }

      return tableActions
    },
    nonTerminatedSyslogServers () {
      return this.syslogServers.filter(server => server.state !== this.serverStates.terminated)
    },
    terminatedSyslogServers () {
      return this.syslogServers.filter(server => server.state === this.serverStates.terminated)
    }
  },
  watch: {
    workspaceId: {
      handler: function (newValue, oldValue) {
        if (newValue && oldValue && newValue !== oldValue) {
          if (this.refreshTimeout) {
            clearTimeout(this.refreshTimeout)
          }

          this.fetchNodeSyslogServers()
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('workspace/syslog', ['fetchSyslogServers', 'terminateSyslogServer', 'createSyslogServer']),
    fetchNodeSyslogServers () {
      this.fetchSyslogServers({
        workspaceId: this.workspaceId
      }).then(response => {
        this.serversLoaded = true

        // If we have a server in pending or terminating state, re-fetch every 30 seconds
        if (this.syslogServers.filter(
          server => [this.serverStates.pending, this.serverStates.terminating, this.serverStates.relaunching].indexOf(server.state) > -1).length > 0
        ) {
          this.refreshTimeout = setTimeout(this.fetchNodeSyslogServers.bind(this), 10000)
        }
      })
    },
    onLaunchServerClick () {
      this.$router.push({ name: 'NewSyslogServer' })
    },
    onTableActionClick (actionType, item) {
      if (actionType === 'edit') {
        this.$router.push({ name: 'SyslogServerDetail', params: { syslogServerId: item.id } })
      } else if (actionType === 'terminate') {
        this.terminateServer(item)
      }
    },
    terminateServer (item) {
      this.$refs.confirmModal.open(
        this.$t('errors.warning'),
        this.$t('v2.syslog.terminateServerConfirmation')
      ).then(confirm => {
        if (confirm) {
          this.loading = true
          this.terminateSyslogServer({
            workspaceId: this.workspaceId,
            id: item.id
          }).then(response => {
            // Re-fetch syslog servers
            this.fetchNodeSyslogServers()

            global.toastr['success'](this.$t('v2.syslog.terminateServerSuccess'), this.$t('general.success'))
          }).catch(() => {
            global.toastr['error'](this.$t('v2.syslog.terminateServerFailure'), this.$t('general.error'))
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    statusCellFormatter (value) {
      return this.$t(`v2.syslog.instanceStates.${value}`)
    },
    dataRetentionPolicyCellFormatter (value) {
      return this.$t(`v2.syslog.dataRetentionPolicyOptions.${value}`)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .syslog-server-list {
    background-color: $white;
    position: relative;

    &__header {
      height: 60px;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
      padding: 0 30px;
      overflow: hidden;

      &__search-input {
        float: left;
        margin-top: 15px;
      }

      &__options {
        float: left;
        margin-left: 20px;

        .base-check-box {
          margin-top: 20px;
        }
      }

      &__actions {
        float: right;

        .base-button {
          margin-top: 10px;
          margin-left: 10px;
          padding: 0 20px;
        }
      }
    }

    &__content {
      padding: 24px 30px;
      box-sizing: border-box;
      height: calc(100vh - 180px);

      &__scroll-holder {
        height: 100%;
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
