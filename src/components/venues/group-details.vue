<template lang="pug">
  .page-content.venue-details
    .venue-progress(v-if="isLoading")
      v-progress-circular(:size="50" indeterminate color="primary")
    v-layout(row v-if="!isLoading")
      // google map section
      v-flex(xs12)
        google-map(
          :center="center"
          :markers="markers"
        )

    v-layout.mt-5(row)
      v-flex.mr-2(xs12 sm6 v-if="selectedNode.type === 'site'")
        v-layout(row)
          v-flex(xs12)
            h3.small-heading.mb-3 {{ $t('settings.establishmentInformation') }}
        v-layout(row)
          establishment-info(
            @setSiteData="setSiteData"
            @setOrgOrGroupData="setOrgOrGroupData"
            :hide-actions="false"
          )
      establishment-info(
        v-else
        @setSiteData="setSiteData"
        @setOrgOrGroupData="setOrgOrGroupData"
        :hide-actions="false"
      )
      // tags column
      v-flex.ml-2(
        v-if="selectedNode.type !== 'organization'"
        xs12 sm6
      )
        v-layout(row)
          v-flex(xs12)
            h3.small-heading.mb-3 {{ $t('general.tags') }}
        v-layout(row)
          v-flex(xs12)
            .form-card.round
              v-layout(row)
                v-flex(xs12)
                  p.py-4 {{ $t('general.addTagDescription') }}
                  tags-input(
                    v-model="tags"
                    @input="submitTags"
                    :disabled="false"
                  )

    v-layout(row).mt-5
      // materialDetails column
      v-flex(xs12)
        h3.small-heading.mb-3 {{ $t('inventory.deviceListings') }}
        v-layout(row)
          v-flex(xs12)
            base-table(
              :name="$t('general.device')"
              :associated="{ value: 'site', name: $t('general.site') }"
              :items="deviceListings",
              :table-headers="deviceListingsHeader",
              icon="fas fa-wifi",
              :use-default-pagination="true"
              :selected-items="devicesToBeMoved"
              @move="moveSelectedDevice"
              @addTags="addTagsDevices"
              @remove="onRemoveSelectedDevices"
              @delete="onDeleteSelectedDevices"
              :table-pagination="devicePagination"
              :hide-actions="false"
              item-key="id"
              row-clickable
              selectable
              select-all
              show-modify
              :modify-list="modifyList"
              v-model="selectedDevices"
              :loading="deviceLoading"
              :search-text="searchDevice"
              :total-items="deviceTotalItems"
              @onSelectAll="(val) => isSelectedTotalDevice = val"
              @onChange="(val) => selectedDevices = val"
              :is-selected-total="isSelectedTotalDevice"
              @fetchData="deviceFetchItems"
              @reloadData="fetchCurrentDevices"
              @onSearch="searchDeviceItems"
              @rowClicked="(val) => goToDeviceDetails(val.id)"
            )
              template(slot="site", slot-scope="{ item }")
                a.column-link(@click = "goToNodeDetail(item.parent)") {{ siteNameFormatter(item.site) }}
              template(slot="row-action" slot-scope="props")
                v-tooltip(bottom color="#9AA9C4" light)
                  template(v-slot:activator="{ on }")
                    .row-popover-item(@click="deleteCurrentDevice(props.item.id)" v-on="on")
                      v-icon delete
                  span {{ $t('tooltip.delete') }}

              template(slot="tags" slot-scope="{ item }")
                template(v-if="Array.isArray(item.tags)")
                  v-chip(
                    v-for="(tag, index) in item.tags"
                    :key="index"
                    small
                  )
                    | {{ tag }}
                v-chip(
                  v-else
                  small
                )
                  | {{ item.tags }}

    v-layout(row v-if="!(getAppFeatures==='production')").mt-5
      // status column
      v-flex(xs12)
        h3.small-heading.mb-3 {{ $t('general.status') }}
        .status-wrapper
          .status-block
            .status-text {{ $t('settings.receptionProbData') }}
            .status-button.success
              v-icon sentiment_very_satisfied

          .status-block
            .status-text {{ $t('settings.peerSyslogData') }}
            .status-button.warning
              v-icon sentiment_satisfied
          .status-block
            .status-text {{ $t('settings.wallenGarden') }}
            .status-button.error
              v-icon sentiment_dissatisfied

    v-layout(row).mt-5
      // detailsOfUsersOfThisSite row
      v-flex(xs12)
          h3.small-heading.mb-3 {{ $t('user.userListings') }}
          base-table(
            :items="userListings"
            :table-headers="userListingsHeaders"
            :use-default-pagination="true"
            :hide-actions="false"
            item-key="id"
            icon="fas fa-user"
            row-clickable
            :loading="userLoading"
            :table-pagination="userPagination"
            @rowClicked="onUserItemClick"
            :search-text="searchUser"
            :total-items="userTotalItems"
            @fetchData="fetchUserItems"
            @reloadData="fetchUsers"
            @onSearch="searchUserItems"
          )
            template(
              slot="row-action"
              slot-scope="props"
            )
              v-tooltip(bottom color="#9AA9C4" light)
                template(v-slot:activator="{ on }")
                  .row-popover-item(
                    @click.prevent.stop="showUserRemoveDialog(props.item)"
                    v-on="on"
                  )
                    v-icon delete
                span {{ $t('tooltip.delete') }}
    confirm-dialog(ref="confirmDialog")
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import ManageableNodesMixin from '@/mixins/manageable-nodes.mixin'
import CurrentUserMixin from '@/mixins/current-user.mixin'
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import TableListingsMixin from '@/mixins/table-listings.mixin'

import EstablishmentInfo from './establishment-info'
import EditablePanel from '@/components/common/editable-panel'
import NodeSelect from '@/components/common/node-select'
import baseTable from '@/components/common/base-table'
import googleMap from '@/components/common/google-map.vue'
import tagsInput from '@/components/common/tags-input'

import ConfirmDialog from '@/components/common/confirm-dialog'

export default {
  name: 'ConfigurationGroupDetails',

  mixins: [
    ManageableNodesMixin,
    CurrentUserMixin,
    UserPermissionsMixin,
    TableListingsMixin
  ],

  components: {
    EstablishmentInfo,
    EditablePanel,
    NodeSelect,
    baseTable,
    googleMap,
    tagsInput,
    ConfirmDialog
  },

  data () {
    return {
      isLoading: true,
      isEditingEstablishmentForm: false,
      isLoadingEstablishmentForm: false,
      center: {
        lat: 48.857117,
        lng: 2.3494571
      },
      markers: [],
      tags: [],
      groupData: [],
      deviceListingsHeader: [
        { sortable: false, value: 'icon', selected: true },
        { text: this.$t('general.name'), sortable: true, value: 'name', selected: true },
        { text: this.$t('general.macAddress'), sortable: false, value: 'mac_addresses', custom_sort_field: 'mac_addresses__mac_address', selected: true, formatter: this.macAddressesFormatter },
        { text: this.$t('general.siteGroup'), sortable: true, value: 'site', custom_sort_field: 'parent__name', selected: true, type: 'slot', slotName: 'site' },
        { text: this.$t('general.model'), sortable: true, value: 'model_name', custom_sort_field: 'model__name', selected: true },
        { text: this.$t('general.vendor'), sortable: true, value: 'vendor_name', custom_sort_field: 'vendor__name', selected: true },
        { text: this.$t('general.ipAddress'), sortable: true, value: 'ip_address', selected: true },
        { text: this.$t('general.tags'), sortable: false, align: 'left', value: 'tags', type: 'slot', slotName: 'tags', selected: true },
        { text: this.$t('general.campaign'), sortable: true, value: 'campaigns', custom_sort_field: 'campaigns__name', selected: true, formatter: this.campaignsFormatter },
        { text: this.$t('general.reload'), sortable: false, align: 'right', value: 'reload', selected: true },
        { text: 'actions', sortable: false, align: 'center', value: 'actions', selected: true }
      ],
      deviceListings: [],
      userListingsHeaders: [
        { sortable: false, value: 'icon', selected: true },
        { text: this.$t('general.name'), align: 'left', value: 'profile.full_name', custom_sort_field: 'profile__first_name', selected: true },
        { text: this.$t('general.email'), align: 'left', value: 'email', selected: true },
        { text: this.$t('general.phoneNumber'), align: 'right', value: 'profile.phone', custom_sort_field: 'profile__phone', selected: true },
        { text: this.$t('general.role'), sortable: false, align: 'left', value: 'role', selected: true },
        { text: this.$t('general.jobTitle'), align: 'left', value: 'profile.job_title', custom_sort_field: 'profile__job_title', selected: true },
        { text: this.$t('general.lastConnected'), align: 'left', value: 'last_login', selected: true, formatter: this.dateTimeFormatter },
        { text: this.$t('general.reload'), sortable: false, align: 'right', value: 'reload', selected: true },
        { text: 'actions', sortable: false, align: 'center', value: 'actions', selected: true }
      ],
      userListings: [],
      selectedDevice: {},
      selectedDevices: [],
      userRemoveDialog: false,
      selectedUser: {},
      searchUser: '',
      userLoading: false,
      userTotalItems: 0,
      userPagination: {
        rowsPerPage: 5
      },
      searchDevice: '',
      deviceLoading: false,
      deviceTotalItems: 0,
      devicePagination: {
        rowsPerPage: 5
      },
      isSelectedTotalDevice: false,
      modifyList: [
        { value: 'tags', title: this.$t('venue.tagsVenue') },
        { value: 'move', title: this.$t('venue.moveToAnotherVenue') },
        { value: 'remove', title: this.$t('venue.removeFromVenue') },
        { value: 'delete', title: this.$t('venue.deleteFromOrganization') }
      ]
    }
  },
  computed: {
    ...mapGetters('layout', ['selectedOrganization', 'selectedNode']),
    selectGroup () {
      return this.nodesWithTypeAndIndentation.filter(item => item.type === 'organization' || item.type === 'group')
    },
    devicesToBeMoved () {
      if (global._.isEmpty(this.selectedDevice)) {
        return this.selectedDevices
      } else {
        return [this.selectedDevice]
      }
    },
    getAppFeatures: function () {
      return process.env.VUE_APP_FEATURES
    },
    nodeId () {
      return this.$route.params.nodeId
    }
  },
  watch: {
    nodeId (newValue, oldValue) {
      this.userPagination = {
        descending: false,
        page: 1,
        rowsPerPage: 20,
        ordering: 'profile__first_name'
      }
      this.devicePagination = {
        descending: false,
        page: 1,
        rowsPerPage: 20,
        ordering: 'name'
      }
      this.isLoading = true
      if (this.searchUser) {
        this.searchUser = ''
      } else {
        this.fetchUsers()
      }
      if (this.searchDevice) {
        this.searchDevice = ''
      } else {
        this.fetchCurrentDevices()
      }
    }
  },
  methods: {
    ...mapActions('organization/site', ['updateSite', 'updateGroup']),
    ...mapActions('organization/device', [
      'fetchDevices',
      'getDeviceIds',
      'deleteDevice',
      'addTagsSelectedDevices',
      'moveSelectedDevices',
      'removeSelectedDevice',
      'deleteSelectedDevices'
    ]),
    ...mapActions('organization/user', ['fetchNodeUsers']),
    ...mapActions('organization/node', ['removeSelectedUsers']),
    cancelEstablishmentForm () {
      this.isEditingEstablishmentForm = false
    },
    editEstablishmentForm () {
      this.isEditingEstablishmentForm = true
    },
    submitEstablishmentForm () {

    },
    submitTags (tags) {
      if (this.selectedNode.type === 'site') {
        this.updateSite({ id: this.selectedNode.id, tags })
      } else if (this.selectedNode.type === 'group') {
        this.updateGroup({ id: this.selectedNode.id, tags })
      }
    },
    getChoices (key) {
      try {
        return this.options[key].choices
      } catch (TypeError) {
        return []
      }
    },
    cleanData () {
      this.tags = []
      this.center = {
        lat: 48.857117,
        lng: 2.3494571
      }
      this.markers = []
      this.groupData = []
    },
    setSiteData (siteData) {
      if (siteData.tags) {
        this.tags = siteData.tags
      }
      const address = siteData.address
      if (address && address.latitude && address.longitude) {
        this.center = {
          lat: address.latitude,
          lng: address.longitude
        }
        this.markers = [{
          lat: address.latitude,
          lng: address.longitude
        }]
      }
      this.isLoading = false
    },
    setOrgOrGroupData (response) {
      if (response.tags) {
        this.tags = response.tags
      }
      const mapMarkers = []
      response.results.map(result => {
        if (result.address && result.address.latitude && result.address.longitude) {
          mapMarkers.push({
            lat: result.address.latitude,
            lng: result.address.longitude
          })
        }
      })
      this.center = mapMarkers[0]
      this.markers = mapMarkers
      this.groupData = response
      this.isLoading = false
    },
    campaignsFormatter (campaigns) {
      return campaigns.map(campaign => campaign.name).join(', ')
    },
    macAddressesFormatter (macAddresses) {
      return macAddresses.map(item => item.mac_address).join(', ')
    },
    siteNameFormatter (site) {
      if (!site) {
        return null
      }
      if (typeof site === 'string') {
        return site
      } else if (typeof site === 'object') {
        const currentNode = this.userOrganizationNodes.find(item => item.id === site.id) || {}
        return currentNode.name || ''
      }
      return ''
    },
    moveSelectedDevice (targetNode) {
      if (this.isSelectedTotalDevice) {
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
    addTagsDevices (tags) {
      if (this.isSelectedTotalDevice) {
        this.getDeviceIds({
          ancestor: this.selectedOrganization.id,
          page_size: 0,
          page: 1,
          search: this.search ? this.search : ''
        }).then(response => {
          this.performAddTagsDevices(tags, response.data.data)
        })
      } else {
        this.performAddTagsDevices(tags, this.devicesToBeMoved.map(item => item.id))
      }
    },
    performAddTagsDevices (tags, deviceIds) {
      this.addTagsSelectedDevices({
        tags,
        deviceIds: deviceIds
      }).then(response => {
        this.clearSelectedDevices()
        this.isSelectedTotal = false
        this.fetchCurrentDevices()
      })
    },
    onRemoveSelectedDevices () {
      if (this.isSelectedTotalDevice) {
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
      if (this.isSelectedTotalDevice) {
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
    clearSelectedDevices () {
      if (global._.isEmpty(this.selectedDevice)) {
        this.selectedDevices = []
      }
      this.selectedDevice = {}
    },
    deleteCurrentDevice (deviceId) {
      this.$refs.confirmDialog.open(
        this.$t('general.confirmTitle', { name: this.$t('general.device') }), this.$t('general.deleteConfirmMessage'), { color: 'error' }
      ).then(confirm => {
        if (confirm) {
          this.deleteDevice(deviceId).then(response => {
            this.fetchCurrentDevices()
            const index = this.selectedDevices.map(item => item.id).indexOf(deviceId)
            if (index !== -1) {
              this.selectedDevices.splice(index, 1)
            }
          })
        }
      })
    },
    deviceFetchItems (filter) {
      this.devicePagination = filter
      this.selectedDevices = []
      this.fetchCurrentDevices()
    },
    searchDeviceItems (search) {
      this.searchDevice = search
      this.isSelectedTotalDevice = false
      this.selectedDevices = []
      this.devicePagination.page = 1
      this.fetchCurrentDevices()
    },
    fetchCurrentDevices () {
      let filters = {
        ancestor: this.nodeId,
        page_size: this.devicePagination.rowsPerPage,
        page: this.devicePagination.page
      }
      if (this.devicePagination.ordering) {
        let ordering = this.devicePagination.ordering
        if (this.devicePagination.descending) {
          ordering = `-${ordering}`
        }
        filters.ordering = ordering
      }
      if (this.searchDevice) {
        filters.search = this.searchDevice
      }
      this.deviceLoading = true
      this.fetchDevices(filters).then(response => {
        const data = response.data.data
        this.deviceListings = data.results || []
        if (this.isSelectedTotalDevice) {
          this.selectedDevices = data.results
        }
        this.deviceTotalItems = data.count
      }).finally(() => {
        this.deviceLoading = false
      })
    },
    onUserItemClick (item) {
      this.$router.push({ name: 'UserDetail', params: { userId: item.id } })
    },
    showUserRemoveDialog (user) {
      this.$refs.confirmDialog.open(
        this.$t('general.confirmTitle', { name: this.$t('general.user') }), this.$t('general.deleteConfirmMessage'), { color: 'error' }
      ).then(confirm => {
        if (confirm) {
          this.selectedUser = user
          this.removeSelectedUser()
        }
      })
    },
    fetchUserItems (filter) {
      this.userPagination = filter
      this.fetchUsers()
    },
    searchUserItems (search) {
      this.searchUser = search
      this.userPagination.page = 1
      this.fetchUsers()
    },
    fetchUsers () {
      let filters = {
        nodeId: this.nodeId,
        page_size: this.userPagination.rowsPerPage,
        page: this.userPagination.page
      }
      if (this.userPagination.ordering) {
        let ordering = this.userPagination.ordering
        if (this.userPagination.descending) {
          ordering = `-${ordering}`
        }
        filters.ordering = ordering
      }
      if (this.searchUser) {
        filters.search = this.searchUser
      }
      this.userLoading = true
      this.fetchNodeUsers(filters).then(response => {
        const data = response.data.data
        this.userListings = data.results || []
        this.userTotalItems = data.count
        this.userLoading = false
      }).catch(() => {
        this.userLoading = false
      })
    },
    removeSelectedUser () {
      this.removeSelectedUsers({
        nodeId: this.selectedNode.id,
        userIds: [this.selectedUser.id]
      }).then(response => {
        this.selectedUser = {}
        this.fetchUsers()
      })
    },
    getOrdering () {
      let ordering = this.devicePagination.ordering
      if (this.devicePagination.descending) {
        ordering = `-${ordering}`
      }
      return ordering
    }
  }
}
</script>

<style lang="scss" scoped>
  .status-help {
    top: -2px;
    left: 80px;
  }
</style>

<style lang="scss">
.venue-details {
  .status-wrapper {
    display: flex;
  }

  .status-block {
    display: flex;
    margin-right: 20px;

    .status-text {
      color: #00082a;
      font-size: 14px;
      background: white;
      border-radius: 5px;
      padding: 15px 25px;
      flex: 1;
      min-width: 220px;
    }

    .status-button {
      height: 51px;
      width: 51px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 5px;
      margin-left: 5px;

      .v-icon {
        color: white;
      }

      &.success {
        background-color: #10bf73;
      }

      &.error {
        background-color: #e76262;
      }

      &.warning {
        background-color: #f0ab26;
      }
    }
  }
  .venue-progress {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
  }
}
</style>
