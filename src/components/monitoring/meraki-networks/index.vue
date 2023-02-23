<template lang="pug">
  .meraki-networks-page.page-content(
    :class="{'meraki-networks-page.page-content--has-filters': filterItems.length > 0}"
  )
    .meraki-networks-page__header
      .meraki-networks-page__header__title {{$t('v2.merakiNetworks.networkMonitoring')}} ({{ merakiNetworkBasesCount }})
      search-input.base-text-input--small.meraki-networks-page__header__search-input(
        :placeholder="$t('v2.merakiNetworks.searchNetworks')"
        v-model="search"
      )
      .meraki-networks-page__header__actions
        multi-action.multi-action--small.multi-action--blue.meraki-networks-page__header__actions__action(
          :actions="actions"
          @actionClick="onActionClick"
          :label="$t('v2.merakiNetworks.manageNetworks')"
        )

    .meraki-networks-page__filter-header(
      v-if="filterItems.length > 0"
    )
      .meraki-networks-page__filter-header__title {{$t('v2.merakiClients.filterResults')}}

      base-multi-filter(
        :items="filterItems"
        @change="onChangeMultiFilter"
      )
      .clear

    .meraki-networks-page__content
      base-table.meraki-networks-page__content__device-table(
        :items="merakiNetworkBases"
        :headers="tableHeaders"
        item-key="network_id"
        :total-items="merakiNetworkBasesCount"
        :multi-selectable="true"
        select-on-row-click
        :is-external-sort="true"
        @loadMore="onScrollEnd"
        @rowSelectionChange="onRowSelectionChange"
      )
      .meraki-networks-page__loading-indicator(
        v-if="loading"
      )
        v-progress-circular(
          :size="50"
          indeterminate
          color="#15ac2f"
        )

    clone-networks-modal(
      :show="isCloneNetworksModalVisible"
      :networks="selectedNetworks"
      @close="closeCloneNetworksModal"
    )

</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SearchInput from '@/components/v2/search-input/search-input'
import BaseTable from '@/components/v2/base-table/base-table'
import BaseMultiFilter from '@/components/v2/base-multi-filter/base-multi-filter'
import MultiAction from '@/components/v2/multi-action/multi-action.vue'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import EmptyOrganizationListCheckMixin from '@/mixins/empty-organization-list-check.mixin'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'
import CloneNetworksModal from './clone-networks-modal'

export default {
  name: 'meraki-networks-page',
  components: {
    CloneNetworksModal,
    BaseTable,
    SearchInput,
    BaseMultiFilter,
    MultiAction
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
      selectedNetworks: [],
      isCloneNetworksModalVisible: false,
      tableHeaders: [
        {
          text: this.$t('general.name'),
          value: 'name',
          selected: true,
          width: '200px'
        },
        {
          text: this.$t('general.organizationName'),
          value: 'organization.name',
          width: '180px',
          selected: true
        },
        {
          text: this.$t('general.tags'),
          value: 'tags',
          formatter: (value) => {
            const tagsString = value.join(', ')
            return tagsString.substring(0, 16) + (tagsString.length > 16 ? '...' : '')
          },
          tooltip: true,
          tooltipFormatter: (value) => {
            return value ? value.join('<br>') : ''
          }
        },
        {
          text: this.$t('wifi.type'),
          value: 'type',
          formatter: (value) => {
            return this.$t(`v2.dashboard.entities.${value}`)
          }
        },
        {
          text: this.$t('v2.merakiTemplates.networkTypes'),
          value: 'network_types',
          formatter: (value) => {
            const typesString = value.map(item => this.$t(`v2.merakiTemplates.types.${item}`)).join(', ')
            return typesString.substring(0, 16) + (typesString.length > 16 ? '...' : '')
          },
          tooltip: true,
          tooltipFormatter: (value) => {
            return value ? value.map(item => this.$t(`v2.merakiTemplates.types.${item}`)).join('<br>') : ''
          }
        },
        {
          text: this.$t('v2.merakiTemplates.boundTemplate'),
          value: 'bound_config_template.name'
        },
        {
          text: this.$t('v2.merakiTemplates.boundNetworkCount'),
          value: 'bound_network_count'
        }
      ],
      typeFilterOptions: [
        {
          key: 'network',
          name: this.$t('v2.merakiCommon.targetTypes.network')
        },
        {
          key: 'config_template',
          name: this.$t('v2.merakiCommon.targetTypes.config_template')
        }
      ],
      networkTypeFilterOptions: ['appliance', 'wireless', 'switch', 'cellularGateway', 'environmental', 'camera', 'sensor', 'systemsManager'].map(networkType => {
        return {
          key: networkType,
          name: this.$t(`v2.merakiTemplates.types.${networkType}`)
        }
      }),
      filterItems: []
    }
  },
  mounted () {
    this.initializeFilters()

    this.fetchNetworks()
  },
  computed: {
    ...mapGetters('workspace/network', ['merakiNetworkBases', 'merakiNetworkBasesCount']),
    ...mapGetters('layout', ['userWorkspaceOrganizations']),
    pageCount () {
      return Math.ceil(this.merakiNetworkBasesCount / this.pageSize)
    },
    actions () {
      return [{
        type: 'clone_networks',
        label: this.$t('v2.merakiNetworks.cloneSelectedNetworks'),
        disabled: this.selectedNetworks.length === 0
      }]
    }
  },
  watch: {
    search: {
      handler () {
        // Reset page number
        this.page = 1

        this.fetchNetworks()

        EventTracker.sendEvent(EVENT_NAMES.MONITORED_NETWORKS_SEARCHED)
      },
      deep: true
    },
    userWorkspaceOrganizations: {
      handler () {
        // If component if mounted before workspace organizations is loaded, re-initialize filters to get options
        this.initializeFilters()
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('workspace/network', ['fetchMerakiNetworkBases']),
    initializeFilters () {
      const organizationFilterOptions = this.userWorkspaceOrganizations
        .filter(workspaceOrganization => !!workspaceOrganization.meraki_organization)
        .map(workspaceOrganization => {
          return {
            id: workspaceOrganization.meraki_organization.id,
            name: workspaceOrganization.meraki_organization.name
          }
        })

      this.filterItems = [
        { name: this.$t('general.organization'), selected: false, value: '', valueKey: 'id', key: 'organization', fixedOptions: organizationFilterOptions },
        { name: this.$t('v2.merakiCommon.targetTypes.tag'), selected: false, value: '', valueKey: 'name', key: 'tags', autocompleteKey: 'tag', uniqueByName: true },
        { name: this.$t('wifi.type'), selected: false, value: '', valueKey: 'key', key: 'type', fixedOptions: this.typeFilterOptions },
        { name: this.$t('v2.merakiTemplates.networkTypes'), selected: false, value: '', valueKey: 'key', key: 'network_types[]', fixedOptions: this.networkTypeFilterOptions }
      ]
    },
    getBaseFilters () {
      return {
        workspaceId: this.workspaceId
      }
    },
    onChangeMultiFilter () {
      this.page = 1
      this.fetchNetworks()
    },
    fetchNetworks () {
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
      this.fetchMerakiNetworkBases(filters).finally(() => {
        this.loading = false
      })
    },
    onScrollEnd () {
      if (this.page < this.pageCount && !this.loading) {
        this.$set(this, 'page', this.page + 1)
        this.fetchNetworks()
      }
    },
    onSortOrderChange (ordering) {
      this.ordering = ordering

      // Reset page number
      this.page = 1
      this.fetchNetworks()
    },
    onRowSelectionChange (selectedRows) {
      this.selectedNetworks = selectedRows
    },
    onActionClick (actionKey) {
      if (actionKey === 'clone_networks') {
        this.openCloneNetworksModal()
      }
    },
    openCloneNetworksModal () {
      this.isCloneNetworksModalVisible = true
    },
    closeCloneNetworksModal (isSuccess) {
      this.isCloneNetworksModalVisible = false

      // Re-fetch networks on modal close
      this.fetchNetworks()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .meraki-networks-page {
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
