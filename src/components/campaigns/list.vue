<template lang='pug'>
  .page-content
    v-layout.mb-5
      v-flex(xs12, sm12, md6, lg6)
        h2 {{$t('campaign.campaigns')}}
      v-flex.pb-3(
        v-if="hasPermission('campaigns__edit', organizationId)"
        xs6 text-xs-right
      )
        v-btn.primary-action(color='primary', @click.stop='showNewCampaignDialog = true')
          | {{ $t('campaign.newCampaign') }}
          v-icon add_circle_outline
    base-table(
      v-if="hasPermission('campaigns__list', organizationId)"
      :name="$t('general.campaign')"
      :items="campaigns"
      :table-headers="campaignListHeaders"
      :loading="loading"
      :row-clickable="hasPermission('campaigns__view', selectedOrganization.id)"
      :hide-actions="false"
      :selected-items="selectedCampaigns"
      @rowClicked="(val) => goToCampaignDetails(val.id)"
      icon="fas fa-bullhorn"
      item-key="id",
      :selectable="hasPermission('campaigns__delete', organizationId)"
      :select-all="hasPermission('campaigns__delete', organizationId)"
      :show-modify="hasPermission('campaigns__delete', organizationId)"
      :table-pagination="pagination"
      :search-text="search"
      :use-default-pagination="true",
      :total-items="totalItems"
      :is-selected-total="isSelectedTotal"
      :modify-list="modifyList"
      @fetchData="fetchItems"
      @reloadData="onReloadData"
      @onSearch="searchItems"
      @onSelectAll="(val) => isSelectedTotal = val"
      @onChange="(val) => selectedCampaigns = val"
      @delete="onDeleteSelectedCampaigns"
      @columnSelectionChange="onColumnSelectionChange"
      @sortChange="onSortChange"
      v-model="selectedCampaigns"
    )
      template(slot="splashPage", slot-scope="{ item }")
        a.column-link(@click = "goToSplashPage(item.splashpage)") {{ item.splashpage_name }}
      template(slot="device", slot-scope="{ item }")
        a.column-link(@click = "item.device && goToDeviceDetails(item.device)") {{ item.device_name }}
      template(slot="createdBy", slot-scope="{ item }")
        a.column-link(@click = "goToUserDetail(item.created_by)") {{ item.created_by_name }}
      template(slot="node", slot-scope="{ item }")
        a.column-link(@click = "goToNodeDetail(item.node)") {{ item.node_name }}
      template(
        slot="row-action"
        slot-scope="props"
      )
        v-tooltip(bottom color="#9AA9C4" light)
          template(v-slot:activator="{ on }")
            .row-popover-item(
              @click="copyCampaignLink(props.item)"
              v-on="on"
            )
              v-icon link
          span {{ $t('tooltip.copyLinkToClipboard') }}

        v-tooltip(bottom color="#9AA9C4" light)
          template(v-slot:activator="{ on }")
            .row-popover-item(
              v-if="hasPermission('campaigns__delete', organizationId)"
              @click="openDeleteCampaign(props.item.id)"
              v-on="on"
            )
              v-icon delete
          span {{ $t('tooltip.delete') }}

    add-campaign-dialog(
      v-if="hasPermission('campaigns__edit', organizationId)"
      :show="showNewCampaignDialog"
      @close="onCloseCampaign"
    )
    confirm-dialog(ref="confirmDialog")
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import { CAMPAIGN_ADDED_EVENT } from '@/constants/events'

import CurrentUserMixin from '@/mixins/current-user.mixin'
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import TableListingsMixin from '@/mixins/table-listings.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

import addCampaignDialog from './add-campaign-dialog.vue'
import ConfirmDialog from '@/components/common/confirm-dialog'
import baseTable from '../common/base-table'

import copyTextToClipboard from '@/utils/copy-to-clipboard'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'Campaigns',

  mixins: [
    CurrentUserMixin,
    UserPermissionsMixin,
    TableListingsMixin,
    CurrentNodeSelectionsMixin
  ],

  components: {
    addCampaignDialog,
    ConfirmDialog,
    baseTable
  },

  beforeDestroy () {
    this.$eventHub.$off(CAMPAIGN_ADDED_EVENT, this.fetchCampaigns)
  },

  data () {
    return {
      search: '',
      campaignListHeaders: [
        { sortable: false, value: 'icon', selected: true },
        { text: this.$t('general.lastUpdateDate'), sortable: true, value: 'updated_at', selected: true, formatter: this.dateTimeFormatter },
        { text: this.$t('campaign.campaignName'), sortable: true, value: 'name', selected: true },
        { text: this.$t('general.siteGroup'), sortable: true, value: 'node_name', custom_sort_field: 'node__name', type: 'slot', slotName: 'node', selected: true },
        { text: this.$t('general.splashPage'), sortable: true, value: 'splashpage_name', custom_sort_field: 'splashpage__name', type: 'slot', slotName: 'splashPage', selected: true },
        { text: this.$t('general.redirectionType'), sortable: true, value: 'redirection_mode', selected: true, formatter: this.redirectionTypeFormatter },
        { text: this.$t('general.creator'), sortable: true, value: 'created_by_name', custom_sort_field: 'created_by__profile__first_name', type: 'slot', slotName: 'createdBy', selected: true },
        { text: this.$t('general.status'), sortable: true, value: 'status', custom_sort_field: 'is_published', selected: false },
        { text: this.$t('general.reload'), sortable: false, align: 'right', value: 'reload', selected: true },
        { text: 'actions', sortable: false, align: 'center', value: 'actions', selected: true }
      ],
      showNewCampaignDialog: false,
      loading: false,
      totalItems: 0,
      pagination: {
        descending: true,
        rowsPerPage: 10,
        sortBy: 'updated_at'
      },
      selectedCampaigns: [],
      isSelectedTotal: false,
      modifyList: [
        { value: 'delete', title: this.$t('campaign.deleteCampaigns') }
      ]
    }
  },

  computed: {
    ...mapGetters('organization/campaign', ['campaigns'])
  },

  methods: {
    ...mapActions('organization/campaign', ['deleteSelectedCampaigns', 'getCampaignIds']),
    fetchItems (filter) {
      this.pagination = filter
      this.selectedCampaigns = []
      this.fetchCampaigns()
    },
    searchItems (search) {
      this.search = search
      this.pagination.page = 1
      this.isSelectedTotal = false
      this.selectedCampaigns = []
      this.fetchCampaigns()

      EventTracker.sendEvent(EVENT_NAMES.CAMPAIGN_LIST_SEARCHED)
    },
    onReloadData () {
      this.fetchCampaigns()

      EventTracker.sendEvent(EVENT_NAMES.CAMPAIGN_LIST_REFRESHED)
    },
    fetchCampaigns () {
      let filters = {
        orgId: this.organizationId,
        page_size: this.pagination.rowsPerPage,
        page: this.pagination.page
      }
      if (this.pagination.ordering) {
        let ordering = this.pagination.ordering
        if (this.pagination.descending) {
          ordering = `-${ordering}`
        }
        filters.ordering = ordering
      }
      if (this.search) {
        filters.search = this.search
      }
      this.loading = true
      this.$store.dispatch('organization/campaign/fetchCampaigns', filters).then(response => {
        this.totalItems = response.data.data.count
        if (this.isSelectedTotal) {
          this.selectedCampaigns = response.data.data.results
        }
      }).finally(() => {
        this.loading = false
      })
    },
    openDeleteCampaign (id) {
      this.$refs.confirmDialog.open(
        this.$t('general.confirmTitle', { name: this.$t('general.campaign') }), this.$t('general.deleteConfirmMessage'), { color: 'error' }
      ).then(confirm => {
        if (confirm) {
          this.$store.dispatch(
            'organization/campaign/deleteCampaigns', { orgId: this.organizationId, campaignId: id }
          ).finally(() => {
            global.toastr['success'](this.$root.$t('campaign.campaignDeletedMessage'), this.$root.$t('general.success'))
            this.fetchCampaigns()
          })

          EventTracker.sendEvent(EVENT_NAMES.CAMPAIGN_DELETED)
        }
      })
    },
    copyCampaignLink (item) {
      copyTextToClipboard(item.portal_url).then(() => {
        global.toastr['success'](this.$t('general.urlCopied'))
      })

      EventTracker.sendEvent(EVENT_NAMES.CAMPAIGN_URL_COPIED)
    },
    redirectionTypeFormatter (value) {
      return this.$options.filters.capitalize(value.replace(/_/g, ' '))
    },
    onCloseCampaign () {
      this.showNewCampaignDialog = false
      this.fetchCampaigns()
    },
    onDeleteSelectedCampaigns () {
      if (this.isSelectedTotal) {
        this.getCampaignIds({
          orgId: this.organizationId,
          page_size: 0,
          page: 1,
          search: this.search ? this.search : ''
        }).then(response => {
          this.performDeleteSelectedCampaigns(response.data.data)
        })
      } else {
        this.performDeleteSelectedCampaigns(this.selectedCampaigns.map(item => item.id))
      }

      EventTracker.sendEvent(EVENT_NAMES.CAMPAIGN_BATCH_DELETED)
    },
    performDeleteSelectedCampaigns (campaignIds) {
      this.deleteSelectedCampaigns({
        orgId: this.organizationId,
        campaignIds: campaignIds
      }).then(response => {
        global.toastr['success'](this.$t('general.deletedSelectItems'), this.$t('general.success'))
        this.selectedDevices = []
        this.isSelectedTotal = false
        this.fetchCampaigns()
      })
    },
    onColumnSelectionChange () {
      EventTracker.sendEvent(EVENT_NAMES.CAMPAIGN_LIST_CUSTOMIZED)
    },
    onSortChange () {
      EventTracker.sendEvent(EVENT_NAMES.CAMPAIGN_LIST_SORTED)
    }
  }
}
</script>

<style lang="scss">
  @import "styles/colors.scss";
</style>
