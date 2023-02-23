<template lang="pug">
  .wifi-clients-page.page-content
    .wifi-clients-page__header
      .wifi-clients-page__header__title {{$t('v2.merakiClients.clientAnalytics')}} ({{merakiClientsCount}})
      search-input.base-text-input--small.wifi-clients-page__header__search-input(
        :placeholder="$t('v2.merakiClients.searchClients')"
        v-model="search"
      )
      base-date-range-filter(
        @change="onChangeDateRangeFilter"
      )
      .wifi-clients-page__header__actions
        .wifi-clients-page__header__actions__csv-btn(
          @click="onDownloadClients"
        )
          span(
            v-if="!downloading"
          ) {{ $t('general.csv') }}
          v-progress-circular.action_loading-indicator(
            v-if="downloading"
            :size="14"
            indeterminate
          )

    .wifi-clients-page__filter-header
      .wifi-clients-page__filter-header__title {{$t('v2.merakiClients.filterResults')}}

      base-multi-filter(
        :items="filterItems"
        @change="onChangeMultiFilter"
      )
      base-column-selector.wifi-clients-page__filter-header__select-columns(
        :columns="tableHeaders"
        :tree-data="treeData"
        :tree-values="treeSelectedValues"
        :is-tree="false"
      )
      .clear

    .wifi-clients-page__content
      base-table.wifi-clients-page__content__user-table(
        :items="merakiClients"
        :headers="selectedTableHeaders"
        :is-external-sort="true"
        :show-indices="true"
        :row-clickable="true"
        @rowClick="onRowClick"
        @loadMore="onScrollEnd"
        @sortOrderChange="onSortOrderChange"
      )
      .wifi-clients-page__loading-indicator(
        v-if="loading"
      )
        v-progress-circular(
          :size="50"
          indeterminate
          color="#15ac2f"
        )

    job-tracking-modal(
      persistent
      suppress-default-messages
      ref="jobTrackingModal"
    )

</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SearchInput from '@/components/v2/search-input/search-input'
import BaseTable from '@/components/v2/base-table/base-table'
import BaseColumnSelector from '@/components/v2/base-column-selector/base-column-selector'
import BaseMultiFilter from '@/components/v2/base-multi-filter/base-multi-filter'
import BaseDateRangeFilter from '@/components/v2/base-date-range-filter/base-date-range-filter'
import ResourceTagsList from '@/components/meraki/tags/column-components/resource-tags-list/resource-tags-list'
import ConnectionStatus from './column-components/connection-status/connection-status'
import JobTrackingModal from '@/components/v2/job-tracking-modal/job-tracking-modal.vue'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import EmptyOrganizationListCheckMixin from '@/mixins/empty-organization-list-check.mixin'
import { dateTimeFormatter, dataSizeFormatter } from '@/utils/global-cell-formatters'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'wifi-clients-page',
  components: {
    BaseTable,
    SearchInput,
    BaseColumnSelector,
    BaseMultiFilter,
    BaseDateRangeFilter,
    JobTrackingModal
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
      filterItems: [
        { name: this.$t('v2.merakiClients.network'), selected: false, value: '', valueKey: 'id', key: 'meraki_network', autocompleteKey: 'network', showOrganizationName: true },
        { name: this.$t('v2.merakiClients.networkTag'), selected: false, value: '', valueKey: 'name', key: 'network_tags', autocompleteKey: 'tag', uniqueByName: true },
        { name: this.$t('v2.merakiClients.deviceTag'), selected: false, value: '', valueKey: 'name', key: 'recent_device_tags', autocompleteKey: 'tag', uniqueByName: true },
        { name: this.$t('v2.merakiClients.switchPort'), selected: false, value: '', valueKey: 'id', key: 'switch_port' },
        { name: this.$t('v2.merakiClients.VLAN'), selected: false, value: '', valueKey: 'id', key: 'vlan' },
        { name: this.$t('v2.merakiClients.SSID'), selected: false, value: '', valueKey: 'name', key: 'ssid', autocompleteKey: 'ssid', showOrganizationName: true }
      ],
      tableHeaders: [
        { text: this.$t('general.status'), value: 'is_connected', cellComponent: ConnectionStatus, selected: true },
        { text: this.$t('general.description'), value: 'description', selected: true },
        { text: this.$t('v2.merakiClients.networkName'), value: 'meraki_network.name', sortKey: 'meraki_network__name', width: '180px', selected: true },
        { text: this.$t('general.macAddress'), value: 'mac_address', selected: true },
        { text: this.$t('v2.merakiClients.ipv4Address'), value: 'ip_address', selected: true },
        { text: this.$t('general.ssid'), value: 'ssid', width: '180px', selected: true },
        { text: this.$t('v2.merakiClients.os'), value: 'os', width: '180px', selected: true },

        { text: this.$t('v2.merakiClients.firstSeen'), value: 'first_seen', formatter: dateTimeFormatter, width: '180px', selected: true },
        { text: this.$t('v2.merakiClients.lastSeen'), value: 'last_seen', formatter: dateTimeFormatter, width: '180px', selected: true },
        { text: this.$t('v2.merakiClients.dataReceived'), value: 'data_received', formatter: dataSizeFormatter, width: '120px', selected: true },
        { text: this.$t('v2.merakiClients.dataSent'), value: 'data_sent', formatter: dataSizeFormatter, width: '120px', selected: true },
        { text: this.$t('v2.merakiClients.manufacturer'), value: 'manufacturer', selected: true },
        { text: this.$t('v2.merakiClients.ipv6Address'), value: 'ip_v6_address', selected: true },

        { text: this.$t('v2.merakiClients.vlan'), value: 'vlan', selected: true },
        { text: this.$t('v2.merakiClients.switchPort'), value: 'switch_port', selected: true },
        { text: this.$t('v2.merakiClients.deviceName'), value: 'recent_device.name', width: '180px', selected: true },
        { text: this.$t('v2.merakiClients.deviceMacAddress'), value: 'recent_device.mac_address', selected: true },
        { text: this.$t('v2.merakiClients.deviceTags'), value: 'recent_device_tags', width: '200px', sortable: false, cellComponent: ResourceTagsList, options: { activeTag: null, hideCloseBtn: true }, selected: true },
        { text: this.$t('v2.merakiClients.networkTags'), value: 'meraki_network_tags', width: '200px', sortable: false, cellComponent: ResourceTagsList, options: { activeTag: null, hideCloseBtn: true }, selected: true },
        { text: this.$t('v2.merakiClients.mdnsName'), value: 'mdns_name', selected: true },
        { text: this.$t('v2.merakiClients.dhcpHostName'), value: 'dhcp_host_name', selected: true },
        { text: this.$t('general.user'), value: 'user', selected: true }
      ],
      treeData: [
        {
          id: 1,
          name: this.$t('monitoring.basic'),
          children: []
        },
        {
          id: 2,
          name: this.$t('monitoring.clientData'),
          children: []
        },
        {
          id: 3,
          name: this.$t('monitoring.technical'),
          children: []
        },
        {
          id: 4,
          name: this.$t('social.form'),
          children: []
        },
        {
          id: 5,
          name: this.$t('social.instagram'),
          children: []
        },
        {
          id: 6,
          name: this.$t('social.facebook'),
          children: []
        },
        {
          id: 7,
          name: this.$t('social.google'),
          children: []
        },
        {
          id: 8,
          name: this.$t('social.linkedin'),
          children: []
        },
        {
          id: 9,
          name: this.$t('social.twitter'),
          children: []
        },
        {
          id: 10,
          name: this.$t('monitoring.briteVerify'),
          children: []
        }
      ],
      treeSelectedValues: [],
      dateRangeFilter: null
    }
  },
  mounted () {
    // Add organization-level headers / filters
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

    this.tableHeaders.map((header, index) => {
      if (header.parentId) {
        const item = {
          id: `${header.parentId} - ${index}`,
          name: header.text
        }
        this.treeData[header.parentId - 1].children.push(item)
        if (header.selected) {
          this.treeSelectedValues.push(item.id)
        }
        header.treeId = `${header.parentId} - ${index}`
      }
      return header
    })

    this.fetchClients()
  },
  computed: {
    ...mapGetters('workspace/network', ['merakiClients', 'merakiClientsCount']),
    ...mapGetters('layout', ['userWorkspaceOrganizations']),
    pageCount () {
      return Math.ceil(this.merakiClientsCount / this.pageSize)
    },
    organizationId () {
      return this.$route.params.orgId
    },
    selectedTableHeaders () {
      return this.tableHeaders.filter(header => header.selected)
    }
  },
  watch: {
    search: {
      handler () {
        // Reset page number
        this.page = 1

        this.fetchClients()

        EventTracker.sendEvent(EVENT_NAMES.MONITORED_CLIENTS_SEARCHED)
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
    ...mapActions('workspace/network', ['fetchMerakiClients', 'downloadMerakiClients']),
    ...mapActions('workspace/network', ['fetchLongRunningJob']),
    getBaseFilters () {
      return {
        workspaceId: this.workspaceId
      }
    },
    getListFilters () {
      let filters = this.getBaseFilters()

      filters.page_size = this.pageSize
      filters.page = this.page
      filters.search = this.search

      this.filterItems.forEach(filter => {
        if (filter.selected) {
          filters[filter.key] = filter.value
        }
      })

      if (this.dateRangeFilter) {
        filters = {
          ...filters,
          ...this.dateRangeFilter
        }
      }

      if (this.ordering) {
        filters.ordering = this.ordering
      }

      return filters
    },
    onChangeMultiFilter () {
      this.page = 1
      this.fetchClients()

      EventTracker.sendEvent(EVENT_NAMES.MONITORED_CLIENTS_FILTERED)
    },
    onChangeDateRangeFilter (filter) {
      this.dateRangeFilter = filter
      this.page = 1
      this.fetchClients()
    },
    fetchClients () {
      this.loading = true
      this.fetchMerakiClients(this.getListFilters()).finally(() => {
        this.loading = false
      })
    },
    onDownloadClients () {
      if (this.downloading) {
        return
      }

      this.downloading = true
      this.downloadMerakiClients(this.getListFilters()).then(response => {
        this.$refs.jobTrackingModal.open(
          response.data.data.id,
          this.$t('v2.merakiClients.exportingClients'),
          this.$t('v2.merakiClients.exportingClientsDescription')
        ).then(success => {
          if (success) {
            // Download now
            this.downloadClientList(response.data.data.id)
          }
        })
      }).finally(() => {
        this.downloading = false
      })

      EventTracker.sendEvent(EVENT_NAMES.MONITORED_CLIENTS_CSV_DOWNLOADED)
    },
    downloadClientList (jobId) {
      // Fetch the export client job to get the private export id, then download the file
      this.fetchLongRunningJob({
        workspaceId: this.workspaceId,
        jobId: jobId
      }).then(response => {
        const successEvent = response.data.data.events.find(event => event.code === 'clients_export_success')
        const exportKey = successEvent.extra_info

        window.open(`${process.env.VUE_APP_API_URL}/private-export/?key=${exportKey}`, '_blank')
      })
    },
    onRowClick (item) {
      this.$router.push({ name: 'WifiClientDetail', params: { clientId: item.id } })
    },
    onScrollEnd () {
      if (this.page < this.pageCount && !this.loading) {
        this.$set(this, 'page', this.page + 1)
        this.fetchClients()
      }
    },
    onSortOrderChange (ordering) {
      this.ordering = ordering

      // Reset page number
      this.page = 1
      this.fetchClients()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .wifi-clients-page {
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

      .base-date-range-filter {
        display: inline-block;
        margin: 0 13px;
      }

      &__actions {
        float: right;
        line-height: 60px;

        &__csv-btn {
          display: inline-block;
          width: 30px;
          height: 30px;
          line-height: 30px;
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
      border-bottom: solid #EFF3F8 3px;
      box-sizing: border-box;
      padding: 0 30px;
      min-height: 60px;

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

      &__select-columns {
        display: inline-block;
        position: absolute;
        right: 38px;
        z-index: 2;
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
