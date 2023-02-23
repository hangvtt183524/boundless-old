<template lang="pug">
  .meraki-devices-page.page-content(
    :class="{'meraki-devices-page.page-content--has-filters': filterItems.length > 0}"
  )
    .meraki-devices-page__header
      .meraki-devices-page__header__title {{$t('v2.merakiDevices.deviceMonitoring')}} ({{merakiMonitoringDevicesCount}})
      search-input.base-text-input--small.meraki-devices-page__header__search-input(
        :placeholder="$t('v2.merakiDevices.searchDevices')"
        v-model="search"
      )
      .meraki-devices-page__header__actions
        .meraki-devices-page__header__actions__csv-btn(
          @click="onDownloadDevicesClick"
        )
          span(
            v-if="!downloading"
          ) {{ $t('general.csv') }}
          v-progress-circular.action_loading-indicator(
            v-if="downloading"
            :size="14"
            indeterminate
          )
        multi-action.multi-action--small.multi-action--blue.meraki-devices-page__header__actions__action(
          :actions="actions"
          @actionClick="onActionClick"
          :label="$t('v2.merakiDevices.manageDevices')"
        )

    .meraki-devices-page__filter-header(
      v-if="filterItems.length > 0"
    )
      .meraki-devices-page__filter-header__title {{$t('v2.merakiClients.filterResults')}}

      base-multi-filter(
        :items="filterItems"
        @change="onChangeMultiFilter"
      )
      .clear

    .meraki-devices-page__content
      base-table.meraki-devices-page__content__device-table(
        :items="tableItems"
        :headers="selectedTableHeaders"
        :actions="tableActions"
        :total-items="merakiMonitoringDevicesCount"
        :multi-selectable="true"
        :total-selectable="true"
        :is-total-selected="isTotalDevicesSelected"
        :is-external-sort="true"
        @actionClick="onTableActionClick"
        @loadMore="onScrollEnd"
        @sortOrderChange="onSortOrderChange"
        @rowSelectionChange="onRowSelectionChange"
        @totalSelectionChange="onTotalSelectionChange"
      )
      .meraki-devices-page__loading-indicator(
        v-if="loading"
      )
        v-progress-circular(
          :size="50"
          indeterminate
          color="#15ac2f"
        )

    move-devices-modal(
      :show="isMoveDevicesModalVisible"
      :devices="selectedDevices"
      @close="closeMoveDevicesModal"
    )

</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SearchInput from '@/components/v2/search-input/search-input'
import BaseTable from '@/components/v2/base-table/base-table'
import BaseColumnSelector from '@/components/v2/base-column-selector/base-column-selector'
import ResourceTagsList from '@/components/meraki/tags/column-components/resource-tags-list/resource-tags-list'
import BaseMultiFilter from '@/components/v2/base-multi-filter/base-multi-filter'
import MultiAction from '@/components/v2/multi-action/multi-action.vue'
import MoveDevicesModal from './move-devices-modal'
import ConnectionStatus from './column-components/connection-status/connection-status'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import EmptyOrganizationListCheckMixin from '@/mixins/empty-organization-list-check.mixin'
import { booleanFormatter } from '@/utils/global-cell-formatters'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'meraki-devices-page',
  components: {
    BaseTable,
    SearchInput,
    BaseColumnSelector,
    BaseMultiFilter,
    MultiAction,
    MoveDevicesModal,
    ConnectionStatus
  },
  mixins: [
    CurrentNodeSelectionsMixin,
    EmptyOrganizationListCheckMixin
  ],
  data: function () {
    return {
      search: '',
      page: 1,
      pageSize: 20,
      ordering: null,
      loading: false,
      downloading: false,
      isTotalDevicesSelected: false,
      selectedDevices: [],
      isMoveDevicesModalVisible: false,
      filterItems: [
        { name: this.$t('v2.merakiClients.network'), selected: false, value: '', valueKey: 'id', key: 'meraki_network', autocompleteKey: 'network', showOrganizationName: true },
        { name: this.$t('v2.merakiClients.networkTag'), selected: false, value: '', valueKey: 'name', key: 'network_tags', autocompleteKey: 'tag', uniqueByName: true },
        { name: this.$t('v2.merakiClients.deviceTag'), selected: false, value: '', valueKey: 'name', key: 'device_tags', autocompleteKey: 'tag', uniqueByName: true }
      ],
      tableHeaders: [
        {
          text: this.$t('general.status'),
          value: 'connection_status',
          cellComponent: ConnectionStatus,
          selected: true
        },
        {
          text: this.$t('general.name'),
          value: 'name',
          selected: true,
          width: '200px'
        },
        {
          text: this.$t('wifi.type'),
          value: 'type',
          selected: true,
          formatter: this.deviceTypeCellFormatter,
          width: '200px'
        },
        {
          text: this.$t('v2.merakiClients.network'),
          value: 'network.name',
          selected: true,
          width: '200px'
        },
        {
          text: this.$t('v2.merakiDevices.serialNumber'),
          value: 'serial_number',
          selected: true,
          width: '200px'
        },
        {
          text: this.$t('general.macAddress'),
          value: 'mac_address',
          selected: true
        },
        {
          text: this.$t('general.model'),
          value: 'model',
          selected: true
        },
        {
          text: this.$t('v2.merakiDevices.firmwareVersion'),
          value: 'firmware_version',
          selected: true
        },
        {
          text: this.$t('tags.tableHeaderTags'),
          value: 'tags',
          selected: true,
          cellComponent: ResourceTagsList,
          width: '320px',
          options: {
            activeTag: null
          }
        },
        {
          text: this.$t('v2.merakiDevices.wan1Status'),
          value: 'wan1.status',
          selected: true
        },
        {
          text: this.$t('v2.merakiDevices.wan1PrivateIP'),
          value: 'wan1.private_ip',
          selected: true
        },
        {
          text: this.$t('v2.merakiDevices.wan1PublicIP'),
          value: 'wan1.public_ip',
          selected: true
        },
        {
          text: this.$t('v2.merakiDevices.wan1Gateway'),
          value: 'wan1.gateway',
          selected: true
        },
        {
          text: this.$t('v2.merakiDevices.wan1UsingStaticIP'),
          value: 'wan1.is_using_static_ip',
          selected: true,
          formatter: booleanFormatter
        },
        {
          text: this.$t('v2.merakiDevices.wan2Status'),
          value: 'wan2.status',
          selected: true
        },
        {
          text: this.$t('v2.merakiDevices.wan2PrivateIP'),
          value: 'wan2.private_ip',
          selected: true
        },
        {
          text: this.$t('v2.merakiDevices.wan2PublicIP'),
          value: 'wan2.public_ip',
          selected: true
        },
        {
          text: this.$t('v2.merakiDevices.wan2Gateway'),
          value: 'wan2.gateway',
          selected: true
        },
        {
          text: this.$t('v2.merakiDevices.wan2UsingStaticIP'),
          value: 'wan2.is_using_static_ip',
          selected: true,
          formatter: booleanFormatter
        }
      ],
      tableActions: [
        {
          icon: '$vuetify.icons.edit',
          type: 'edit'
        }
      ]
    }
  },
  mounted () {
    // Add organization level headers / filters
    this.tableHeaders.splice(2, 0, {
      text: this.$t('general.organizationName'),
      value: 'organization_name',
      width: '180px',
      selected: true
    })

    this.filterItems.splice(0, 0, {
      name: this.$t('general.organization'),
      selected: false,
      value: '',
      valueKey: 'id',
      key: 'organization',
      fixedOptions: this.userWorkspaceOrganizations.map(workspaceOrganization => {
        return {
          id: workspaceOrganization.id,
          name: workspaceOrganization.name
        }
      })
    })

    this.fetchDevices()
  },
  computed: {
    ...mapGetters('workspace/network', ['merakiMonitoringDevices', 'merakiMonitoringDevicesCount']),
    ...mapGetters('layout', ['userWorkspaceOrganizations']),
    pageCount () {
      return Math.ceil(this.merakiMonitoringDevicesCount / this.pageSize)
    },
    selectedTableHeaders () {
      return this.tableHeaders.filter(header => header.selected)
    },
    tableItems () {
      return this.merakiMonitoringDevices.map(device => {
        return {
          ...device,
          connection_status: {
            last_status: device.last_status,
            last_seen: device.last_seen
          },
          wan1: device.uplinks.filter(uplink => {
            return uplink.interface === 'WAN 1'
          })[0] || null,
          wan2: device.uplinks.filter(uplink => {
            return uplink.interface === 'WAN 2'
          })[0] || null
        }
      })
    },
    actions () {
      return [{
        type: 'move_devices',
        label: this.$t('v2.merakiDevices.moveSelectedDevices'),
        disabled: this.selectedDevices.length === 0
      }]
    }
  },
  watch: {
    search: {
      handler () {
        // Reset page number
        this.page = 1

        this.fetchDevices()

        EventTracker.sendEvent(EVENT_NAMES.MONITORED_DEVICES_SEARCHED)
      },
      deep: true
    },
    userWorkspaceOrganizations: {
      handler () {
        // If component if mounted before workspace organizations is loaded, update fixed options list for organization
        // filter item on workspace organizations load
        const organizationFilterItem = this.filterItems.find(item => {
          return item.key === 'organization'
        })

        if (organizationFilterItem) {
          this.$set(organizationFilterItem, 'fixedOptions', this.userWorkspaceOrganizations.map(workspaceOrganization => {
            return {
              id: workspaceOrganization.id,
              name: workspaceOrganization.name
            }
          }))
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('workspace/network', ['fetchMerakiMonitoringDevices', 'downloadMerakiMonitoringDevices']),
    getBaseFilters () {
      return {
        workspaceId: this.workspaceId
      }
    },
    onChangeMultiFilter () {
      this.page = 1
      this.fetchDevices()
    },
    fetchDevices () {
      let filters = this.getBaseFilters()

      filters.page_size = this.pageSize
      filters.page = this.page
      filters.search = this.search

      this.filterItems.forEach(filter => {
        if (filter.selected) {
          filters[filter.key] = filter.value
        }
      })

      if (this.ordering) {
        filters.ordering = this.ordering
      }

      this.loading = true
      this.fetchMerakiMonitoringDevices(filters).finally(() => {
        this.loading = false
      })
    },
    onScrollEnd () {
      if (this.page < this.pageCount && !this.loading) {
        this.$set(this, 'page', this.page + 1)
        this.fetchDevices()
      }
    },
    onSortOrderChange (ordering) {
      this.ordering = ordering

      // Reset page number
      this.page = 1
      this.fetchDevices()
    },
    deviceTypeCellFormatter (value) {
      return this.$t(`v2.merakiDevices.devicesTypes.${value}`)
    },
    onRowSelectionChange (selectedRows) {
      this.selectedDevices = selectedRows
    },
    onTotalSelectionChange (isTotalSelected) {
      this.isTotalDevicesSelected = isTotalSelected
    },
    onTableActionClick (action, item) {
      if (action === 'edit') {
        this.$router.push({ name: 'MerakiDeviceDetail', params: { deviceId: item.id } })
      }
    },
    onActionClick (actionKey) {
      if (actionKey === 'move_devices') {
        this.openMoveDevicesModal()
      }
    },
    openMoveDevicesModal () {
      this.isMoveDevicesModalVisible = true
    },
    closeMoveDevicesModal (isSuccess) {
      this.isMoveDevicesModalVisible = false

      // Re-fetch devices on modal close
      this.fetchDevices()
    },
    onDownloadDevicesClick () {
      if (this.downloading) {
        return
      }

      const filters = this.getBaseFilters()
      filters.workspaceName = this.selectedWorkspace.name
      filters.search = this.search

      this.filterItems.forEach(filter => {
        if (filter.selected) {
          filters[filter.key] = filter.value
        }
      })

      if (this.ordering) {
        filters.ordering = this.ordering
      }

      if (this.selectedDevices.length) {
        filters.ids = this.selectedDevices.map(item => item.id).join(',')
      }

      this.downloading = true
      this.downloadMerakiMonitoringDevices(filters).finally(() => {
        this.downloading = false
      })

      EventTracker.sendEvent(EVENT_NAMES.MONITORED_DEVICES_CSV_DOWNLOADED)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .meraki-devices-page {
    background-color: $white;
    position: relative;
    height: calc(100vh - 160px);

    &__header {
      height: 60px;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
      padding: 0 30px;

      &__title {
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 18px;
        line-height: 60px;
        text-transform: uppercase;
        color: #53575A;
        display: inline-block;
        margin-right: 60px;
      }

      &__search-input {
        display: inline-block;
        line-height: 60px;
        width: 262px;
      }

      &__actions {
        float: right;
        line-height: 60px;
        overflow: hidden;

        &__action {
          display: inline-block;
          width: 200px;
          margin-top: 14px;
          margin-left: 10px;
        }

        &__csv-btn {
          display: inline-block;
          float: left;
          margin-top: 14px;
          width: 36px;
          height: 36px;
          line-height: 36px;
          background-color: $blue-dark;
          border-radius: 4px;
          cursor: pointer;
          text-align: center;
          text-transform: uppercase;
          margin-left: 5px;
          font-family: Fira Sans;
          font-style: normal;
          font-weight: 600;
          font-size: 13px;
          color: #fff;
          user-select: none;
        }
      }
    }

    &__filter-header {
      min-height: 60px;
      border-bottom: solid #EFF3F8 3px;
      box-sizing: border-box;
      padding: 0 30px;

      &__title {
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 60px;
        color: #1146AE;
        margin-right: 60px;
        float: left;
      }

      .base-multi-filter{
        float: left;
        margin: 12px 0;
      }
    }

    &__content {
      padding: 24px 30px;
      box-sizing: border-box;
      height: calc(100% - 120px);
      position: relative;

      &__scroll-area {
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

    .clear {
      clear: both;
    }
  }
</style>
