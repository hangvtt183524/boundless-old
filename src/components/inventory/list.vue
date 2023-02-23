<template lang='pug'>
  .page-content(data-test="inventory-list")
    v-layout.mb-5
      v-flex(xs12, sm12, md6, lg6)
        h2 {{$t('inventory.deviceInventory')}}
      v-flex.pb-3(xs6, md6, lg6, text-xs-right)
        v-btn.primary-action(
          color="primary", data-test="btn-create-device" @click.stop="showNewDeviceInventory = true"
          v-if="hasPermission('devices__import', organizationId)"
        )
          | {{ $t("inventory.newDevice") }}
          v-icon add_circle_outline

    base-table.devices-table(
      v-if="hasPermission('devices__list', organizationId)"
      :name="$t('general.device')"
      :associated="{ value: 'site', name: $t('general.site') }"
      :loading="loading"
      :table-headers="headers"
      :items="devicesWithSite"
      :selected-items="devicesToBeMoved"
      :is-selected-total="isSelectedTotal"
      :table-pagination="pagination"
      icon="wifi"
      item-key="id"
      selectable
      select-all
      show-modify
      hide-column-selector
      :modify-list="modifyList"
      :search-text="search"
      :use-default-pagination="true"
      :total-items="totalItems"
      @move="moveSelectedDevice"
      @remove="onRemoveSelectedDevices"
      @delete="onDeleteSelectedDevices"
      @download="onDownload"
      @fetchData="fetchItems"
      @reloadData="onReloadData"
      @onSearch="searchItems"
      @onSelectAll="(val) => isSelectedTotal = val"
      @onChange="(val) => selectedDevices = val"
      @sortChange="onSortChange"
      v-model="selectedDevices"
    )
      template(slot="row-action" slot-scope="props")
        v-tooltip(
          bottom color="#9AA9C4" light
          v-if="hasPermission('devices__move', organizationId)"
        )
          template(v-slot:activator="{ on }")
            .row-popover-item(@click="moveDevice(props.item)" v-on="on")
              v-icon fas fa-arrows-alt
          span {{ $t('tooltip.move') }}

        v-tooltip(
          bottom color="#9AA9C4" light
          v-if="hasPermission('devices__remove_from_organization', organizationId)"
        )
          template(v-slot:activator="{ on }")
            .row-popover-item(@click="deleteCurretnDevice(props.item)" v-on="on")
              v-icon delete
          span {{ $t('tooltip.delete') }}

      template(slot="site", slot-scope="{ item }")
        a.column-link(@click = "goToNodeDetail(item.parent)") {{ item.site }}
    add-inventory-dialog(:show="showNewDeviceInventory", @close="onCloseCreateDevice")
    move-device-dialog(
      :selected-items="devicesToBeMoved"
      :show="showMoveDeviceDialog"
      @close="hideMoveDeviceDialog"
      @move="moveSelectedDevice"
    )
    delete-warning-dialog(
      :show="showDeleteDialog"
      :name="deleteDeviceName"
      :message="deleteWarningMessage"
      @close="showDeleteDialog = false"
    )
    confirm-dialog(ref="confirmDialog")
</template>

<script>
import { mapActions } from 'vuex'

import { DEVICE_ADDED_EVENT } from '@/constants/events'

import MoveDevice from './move-device.vue'
import MoveDeviceDialog from './move-device-dialog'
import WifiIcon from '@/components/icons/wifi'
import TableListingsMixin from '@/mixins/table-listings.mixin'
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import CurrentUserMixin from '@/mixins/current-user.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import addInventoryDialog from './add-inventory-dialog'
import baseTable from '../common/base-table'
import ConfirmDialog from '@/components/common/confirm-dialog'
import deleteWarningDialog from '../common/delete-warning-dialog'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  components: {
    MoveDevice,
    MoveDeviceDialog,
    WifiIcon,
    addInventoryDialog,
    baseTable,
    ConfirmDialog,
    deleteWarningDialog
  },

  mixins: [
    TableListingsMixin,
    UserPermissionsMixin,
    CurrentUserMixin,
    CurrentNodeSelectionsMixin
  ],

  beforeDestroy () {
    this.$eventHub.$off(DEVICE_ADDED_EVENT)
    this.isSelectedTotal = false
    this.clearSelectedDevices()
  },

  data () {
    return {
      devices: [],
      headers: [
        { sortable: false, value: 'icon', selected: true },
        { text: this.$t('general.name'), sortable: true, value: 'name', selected: true },
        { text: this.$t('general.macAddress'), sortable: false, value: 'mac_addresses', custom_sort_field: 'mac_addresses__mac_address', selected: true, formatter: this.macAddressesFormatter },
        { text: this.$t('general.siteGroup'), sortable: true, value: 'site', custom_sort_field: 'parent__name', type: 'slot', slotName: 'site', selected: true },
        { text: this.$t('general.vendor'), sortable: true, value: 'vendor_name', custom_sort_field: 'vendor__name', selected: true },
        { text: this.$t('general.ipAddress'), sortable: true, value: 'ip_address', selected: false },
        { text: 'actions', sortable: false, align: 'center', value: 'actions', selected: true },
        { text: this.$t('general.reload'), sortable: false, align: 'center', value: 'reload', selected: true }
      ],
      search: '',
      selectedDevice: {},
      selectedDevices: [],
      showNewDeviceInventory: false,
      showMoveDeviceDialog: false,
      showDeleteDialog: false,
      deleteWarningMessage: '',
      deleteDeviceName: '',
      moveMenu: false,
      loading: false,
      totalItems: 0,
      pagination: {
        descending: false,
        rowsPerPage: 10,
        sortBy: 'name'
      },
      isSelectedTotal: false
    }
  },

  computed: {
    selectedDeviceIds () {
      return this.selectedDevices.map(item => item.id).toString()
    },
    devicesToBeMoved () {
      if (global._.isEmpty(this.selectedDevice)) {
        return this.selectedDevices
      } else {
        return [this.selectedDevice]
      }
    },
    devicesWithSite () {
      return this.devices.map(item => {
        item.site = item.is_deployed ? item.parent_name : ''
        return item
      })
    },
    modifyList () {
      const modifyList = []

      if (this.hasPermission('devices__move', this.organizationId)) {
        modifyList.push({ value: 'move', title: this.$t('venue.moveToAnotherVenue') })
      }

      if (this.hasPermission('devices__remove_from_venue', this.organizationId)) {
        modifyList.push({ value: 'remove', title: this.$t('venue.removeFromVenue') })
      }

      if (this.hasPermission('devices__remove_from_organization', this.organizationId)) {
        modifyList.push({ value: 'delete', title: this.$t('venue.deleteFromOrganization') })
      }

      return modifyList
    }
  },

  methods: {
    ...mapActions('organization/device', [
      'fetchDevices',
      'getDeviceIds',
      'removeSelectedDevice',
      'deleteSelectedDevices',
      'deleteDevice',
      'moveSelectedDevices',
      'downloadDevices'
    ]),
    fetchItems (filter) {
      this.selectedDevices = []
      this.pagination = filter
      this.fetchCurrentDevices()
    },
    searchItems (search) {
      this.search = search
      this.isSelectedTotal = false
      this.selectedDevices = []
      this.pagination.page = 1
      this.fetchCurrentDevices()

      EventTracker.sendEvent(EVENT_NAMES.DEVICE_INVENTORY_SEARCHED)
    },
    onReloadData () {
      this.fetchCurrentDevices()

      EventTracker.sendEvent(EVENT_NAMES.DEVICE_INVENTORY_REFRESHED)
    },
    clearSelectedDevices () {
      if (global._.isEmpty(this.selectedDevice)) {
        this.selectedDevices = []
      }
      this.selectedDevice = {}
      this.moveMenu = false
      this.showMoveDeviceDialog = false
    },
    fetchCurrentDevices () {
      this.clearSelectedDevices()
      let filters = {
        ancestor: this.organizationId,
        page_size: this.pagination.rowsPerPage,
        page: this.pagination.page
      }
      if (this.pagination.ordering) {
        filters.ordering = this.getOrdering()
      }
      if (this.search) {
        filters.search = this.search
      }
      this.loading = true
      this.fetchDevices(filters).then(response => {
        this.totalItems = response.data.data.count
        const data = response.data.data
        this.devices = data.results
        if (this.isSelectedTotal) {
          this.selectedDevices = data.results
        }
      }).finally(() => {
        this.loading = false
      })
    },
    moveDevice (device) {
      this.selectedDevice = device
      this.showMoveDeviceDialog = true
    },
    moveSelectedDevice (targetNode) {
      if (this.isSelectedTotal) {
        this.getDeviceIds({
          ancestor: this.selectedOrganization.id,
          page_size: 0,
          page: 1,
          search: this.search ? this.search : ''
        }).then(response => {
          this.performMoveSelectedDevice(targetNode, response.data.data)
        })
      } else {
        this.performMoveSelectedDevice(targetNode, this.devicesToBeMoved.map(item => item.id))
      }

      EventTracker.sendEvent(EVENT_NAMES.DEVICE_MOVED_TO_VENUE)
    },
    performMoveSelectedDevice (targetNode, deviceIds) {
      this.moveSelectedDevices({
        targetNode: targetNode,
        deviceIds: deviceIds
      }).then(response => {
        if (this.devicesToBeMoved.length === 1) {
          global.toastr['success'](this.$t('inventory.movedDevice'), this.$t('general.success'))
        } else {
          global.toastr['success'](this.$t('inventory.movedDevices'), this.$t('general.success'))
        }
        this.clearSelectedDevices()
        this.isSelectedTotal = false
        this.fetchCurrentDevices()
      })
    },
    onRemoveSelectedDevices () {
      if (this.isSelectedTotal) {
        this.getDeviceIds({
          ancestor: this.selectedOrganization.id,
          page_size: 0,
          page: 1,
          search: this.search ? this.search : ''
        }).then(response => {
          this.performRemoveSelectedDevices(response.data.data)
        })
      } else {
        this.performRemoveSelectedDevices(this.devicesToBeMoved.map(item => item.id))
      }

      EventTracker.sendEvent(EVENT_NAMES.DEVICE_REMOVED_FROM_VENUE)
    },
    performRemoveSelectedDevices (deviceIds) {
      this.removeSelectedDevice({
        deviceIds: deviceIds
      }).then(response => {
        global.toastr['success'](this.$t('inventory.removedDevices'), this.$t('general.success'))
        this.clearSelectedDevices()
        this.isSelectedTotal = false
        this.fetchCurrentDevices()
      })
    },
    onDeleteSelectedDevices () {
      if (this.isSelectedTotal) {
        this.getDeviceIds({
          ancestor: this.selectedOrganization.id,
          page_size: 0,
          page: 1,
          search: this.search ? this.search : ''
        }).then(response => {
          this.performDeleteSelectedDevices(response.data.data)
        })
      } else {
        this.performDeleteSelectedDevices(this.devicesToBeMoved.map(item => item.id))
      }

      EventTracker.sendEvent(EVENT_NAMES.DEVICE_REMOVED_FROM_ORGANIZATION)
    },
    performDeleteSelectedDevices (deviceIds) {
      this.deleteSelectedDevices({
        deviceIds: deviceIds
      }).then(response => {
        global.toastr['success'](this.$t('general.deletedSelectItems'), this.$t('general.success'))
        this.clearSelectedDevices()
        this.isSelectedTotal = false
        this.fetchCurrentDevices()
      })
    },
    deleteCurretnDevice (device) {
      if (device.site) {
        // Device associated to a site, show related warning
        const associatedName = 'Site'
        this.deleteWarningMessage = this.$t('general.itemAssociated', {
          name: device.name,
          associatedToName: associatedName
        }) + ' ' + this.$t('general.itmsAssociatedText', {
          associatedToName: associatedName
        })
        this.deleteDeviceName = device.name
        this.showDeleteDialog = true
      } else {
        this.$refs.confirmDialog.open(
          this.$t('general.confirmTitle', { name: this.$t('general.device') }), this.$t('general.deleteConfirmMessage'), { color: 'error' }
        ).then(confirm => {
          if (confirm) {
            this.deleteDevice(device.id).then(response => {
              global.toastr['success'](this.$t('inventory.removedDevice'), this.$t('general.success'))
              this.fetchCurrentDevices()
            })
          }
        })
      }
    },
    macAddressesFormatter (macAddresses) {
      return macAddresses.map(item => item.mac_address).join(', ')
    },
    hideMoveDeviceDialog () {
      this.showMoveDeviceDialog = false
      this.selectedDevice = {}
    },
    onDownload (data) {
      this.downloadDevices({ ancestor: this.organizationId, ...data }).then(response => {
      })
    },
    getOrdering () {
      let ordering = this.pagination.ordering
      if (this.pagination.descending) {
        ordering = `-${ordering}`
      }
      return ordering
    },
    onCloseCreateDevice () {
      this.showNewDeviceInventory = false
      this.fetchCurrentDevices()
    },
    onSortChange () {
      EventTracker.sendEvent(EVENT_NAMES.DEVICE_INVENTORY_SORTED)
    }
  }
}
</script>
