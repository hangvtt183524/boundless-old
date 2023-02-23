<template lang="pug">
  .page-content
    v-layout.mb-5
      v-flex(xs12, sm12, md6, lg6)
        h2 {{ $t('wifi.wifiVoucherCode') }}
      v-flex.pb-3(
        text-xs-right
      )
        v-btn.primary-action.fixed-right(
          v-if="hasPermission('wifi_access_codes__create', nodeId)"
          color='primary',
          @click.stop='gotoCreateCode'
        )
          .action {{ $t('wifi.createVouchers') }}
          v-icon add_circle_outline

    base-table(
      v-if="hasPermission('wifi_access_codes__list', nodeId)"
      :items="voucherList"
      :table-headers="headers"
      :loading="loading"
      :useDefaultPagination="true",
      item-key="id"
      icon="fas fa-wifi"
      selectable
      select-all
      :row-clickable="hasPermission('wifi_access_codes__view', nodeId)"
      :search-text="search"
      :total-items="totalItems"
      :hide-actions="false"
      :selected-items="selectedItems"
      :is-selected-total="isSelectedTotal"
      :table-pagination="pagination"
      hide-column-selector
      @fetchData="fetchItems"
      @reloadData="fetchCodes"
      @onSearch="searchItems"
      @onSelectAll="(val) => isSelectedTotal = val"
      @onChange="(val) => selectedItems = val"
      v-model="selectedItems"
      @rowClicked="(val) => viewVoucher(val)"
    )
      template(slot="row-action", slot-scope="slotProps")
        v-tooltip(
          v-if="hasPermission('wifi_access_codes__delete', nodeId)"
          bottom color="#9AA9C4"
          light
        )
          template(v-slot:activator="{ on }")
            .row-popover-item(@click.prevent.stop="deleteItem(slotProps.item)" v-on="on")
              v-icon delete
          span {{ $t('tooltip.delete') }}

        v-tooltip(
          v-if="hasPermission('wifi_access_codes__view', nodeId)"
          bottom color="#9AA9C4"
          light
        )
          template(v-slot:activator="{ on }")
            .row-popover-item(@click.prevent.stop="downloadData(slotProps.item, 0)" v-on="on")
              download-csv
          span {{ $t('tooltip.downloadCSV') }}

        v-tooltip(
          v-if="hasPermission('wifi_access_codes__view', nodeId)"
          bottom color="#9AA9C4"
          light
        )
          template(v-slot:activator="{ on }")
            .row-popover-item(@click.prevent.stop="downloadData(slotProps.item, 1)" v-on="on")
              v-icon.excel fa fa-file-excel
          span {{ $t('tooltip.downloadXLS') }}

        v-tooltip(
          v-if="hasPermission('wifi_access_codes__edit', nodeId)"
          bottom color="#9AA9C4"
          light
        )
          template(v-slot:activator="{ on }")
            .row-popover-item(@click.prevent.stop="editItem(slotProps.item)" v-on="on")
              v-icon edit
          span {{ $t('tooltip.edit') }}

        v-tooltip(
          v-if="hasPermission('wifi_access_codes__view', nodeId)"
          bottom color="#9AA9C4"
          light
        )
          template(v-slot:activator="{ on }")
            .row-popover-item(@click.prevent.stop="viewCodes(slotProps.item)" v-on="on")
              v-icon visibility
          span {{ $t('tooltip.view', {name: 'Code List'}) }}

    create-wifi-voucher(
      :show="showCreateWifiCodeDialog"
      :wifi-code="selectedAccessCode"
      @close="onCloseDialog"
    )
    view-wifi-voucher(
      :show="showViewWifiCodeDialog"
      :wifi-code="selectedAccessCode"
      @download="downloadData"
      @viewCodes="viewCodes"
      @close="onCloseViewDialog"
    )
</template>

<script>
import { mapActions } from 'vuex'

import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import CurrentUserMixin from '@/mixins/current-user.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

import baseTable from '../common/base-table'
import createWifiVoucher from './wifi-codes/create-wifi-voucher.vue'
import viewWifiVoucher from './wifi-codes/view-wifi-voucher.vue'
import downloadCsv from '@/components/icons/download-csv'
import downloadXls from '@/components/icons/download-xls'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'WifiVoucherListing',

  mixins: [
    CurrentUserMixin,
    UserPermissionsMixin,
    CurrentNodeSelectionsMixin
  ],

  components: {
    baseTable,
    createWifiVoucher,
    viewWifiVoucher,
    downloadCsv,
    downloadXls
  },

  data () {
    return {
      voucherList: [],
      headers: [
        { value: 'icon', align: 'left', sortable: false, width: 50, selected: true },
        { text: this.$t('venue.venue'), value: 'node_name', align: 'left', sortable: true, selected: true },
        { text: this.$t('wifi.batchName'), value: 'name', align: 'left', sortable: false, selected: true },
        { text: this.$t('wifi.batchSize'), value: 'code_count', align: 'left', sortable: false, selected: true },
        { text: this.$t('wifi.createdBy'), value: 'createdByName', align: 'left', sortable: false, selected: true },
        { text: this.$t('wifi.createdOn'), value: 'created_at', align: 'left', sortable: false, selected: true, formatter: this.dateFormatter },
        { text: this.$t('wifi.expiresOn'), value: 'expiresOn', align: 'left', sortable: false, selected: true },
        { text: 'actions', value: 'actions', align: 'center', sortable: false, selected: true },
        { text: this.$t('general.reload'), sortable: false, align: 'center', value: 'reload', selected: true }
      ],
      search: '',
      loading: false,
      totalItems: 0,
      isSelectedTotal: false,
      selectedItems: [],
      pagination: {},
      showCreateWifiCodeDialog: false,
      showViewWifiCodeDialog: false,
      selectedAccessCode: {}
    }
  },

  methods: {
    ...mapActions('organization/voucher', ['fetchVouchers', 'deleteVoucher', 'downloadVoucherCodes']),
    fetchItems (filter) {
      this.pagination = filter
      this.selectedItems = []
      this.fetchCodes()
    },
    searchItems (search) {
      this.search = search
      this.selectedItems = false
      this.pagination.page = 1
      this.fetchCodes()
    },
    fetchCodes () {
      let filters = {
        nodeId: this.nodeId,
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

      this.fetchVouchers(filters).then((response) => {
        this.totalItems = response.data.data.count
        this.voucherList = response.data.data.results.map(item => {
          item.expiresOn = `${item.validity_window.end_date} ${item.validity_window.end_time}`
          item.createdByName = item.created_by && item.created_by.profile ? item.created_by.profile.full_name : ''
          return item
        })
        if (this.isSelectedTotal) {
          this.selectedItems = response.data.data.results
        }
      }).finally(() => {
        this.loading = false
      })
    },
    gotoCreateCode () {
      this.selectedAccessCode = {}
      this.showCreateWifiCodeDialog = true
    },
    editItem (item) {
      this.selectedAccessCode = global._.cloneDeep(item)
      this.showCreateWifiCodeDialog = true
    },
    viewVoucher (item) {
      this.selectedAccessCode = global._.cloneDeep(item)
      this.showViewWifiCodeDialog = true
    },
    viewCodes (item) {
      this.$router.push({ name: 'VoucherCodes', params: { voucherId: item.id } })

      EventTracker.sendEvent(EVENT_NAMES.VOUCHER_CODES_VIEWED)
    },
    deleteItem (item) {
      this.loading = true
      this.deleteVoucher({ nodeId: this.nodeId, id: item.id }).then((response) => {
        this.loading = false
        global.toastr['success'](this.$t('wifi.deleteVoucherSuccess'), this.$t('general.success'))
        this.fetchCodes()
      }).catch(() => {
        this.loading = false
      })

      EventTracker.sendEvent(EVENT_NAMES.VOUCHER_CODES_DELETED)
    },
    downloadData (item, type) {
      let filters = {
        nodeId: this.nodeId,
        batch_config: item.id,
        page_size: this.pagination.rowsPerPage,
        page: this.pagination.page,
        type
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

      this.downloadVoucherCodes(filters).then((response) => {
        var downloadUrl = URL.createObjectURL(response.data)
        var a = document.createElement('a')
        a.href = downloadUrl
        let fileName = [
          this.selectedOrganization.name || '',
          this.selectedNode.name || '',
          item.name,
          'codes'
        ].filter(item => item).join('-')
        a.download = `${fileName}.${type === 0 ? 'csv' : 'xlsx'}`
        document.body.appendChild(a)
        a.click()
      })

      if (type === 0) {
        EventTracker.sendEvent(EVENT_NAMES.VOUCHER_CSV_DOWNLOADED)
      } else {
        EventTracker.sendEvent(EVENT_NAMES.VOUCHER_XLS_DOWNLOADED)
      }
    },
    onCloseDialog (isRefresh = false) {
      this.showCreateWifiCodeDialog = false
      if (isRefresh) {
        this.fetchCodes()
      }
    },
    onCloseViewDialog (isEdit = false) {
      this.showViewWifiCodeDialog = false
      if (isEdit) {
        this.showCreateWifiCodeDialog = true
      }
    }
  },

  watch: {
    nodeId (newId) {
      if (this.hasPermission('wifi_access_codes__list', this.nodeId)) {
        this.fetchCodes()
      }
    }
  }
}
</script>

<style scoped lang="scss">
  @media (max-width: 767px) {
    .v-btn.primary-action.fixed-right {
      top: 0;
    }
  }
</style>
