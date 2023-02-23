import { mapActions, mapGetters } from 'vuex'

import { NODE_LIST_CHANGE_EVENT } from '@/constants/events'

let DeleteItemMixin = {
  computed: {
    ...mapGetters('organization/venue', ['selectedItems']),
    ...mapGetters('layout', ['selectedOrganization'])
  },
  methods: {
    ...mapActions('organization/venue', ['deleteSelectedSites', 'deleteSelectedGroups', 'deleteSelectedDevices', 'deleteSelectedFloors', 'toggleDeleteDialog']),

    removeItems () {
      let selectedItemsLength = this.selectedItems.length
      let itemType = this.selectedItems[0].type

      if (itemType === 'group') {
        this.deleteSelectedGroups().then(() => {
          this.fireGroupsDeletedMessage(selectedItemsLength)
          this.fetchNodes()
        }).catch(err => {
          this.$store.commit('UPDATE_WARNING_PANEL', { message: err.message, show: true })
        })
      } else if (itemType === 'site') {
        this.deleteSelectedSites().then(() => {
          this.fireSitesDeletedMessage(selectedItemsLength)
          this.fetchNodes()
        }).catch(err => {
          this.$store.commit('UPDATE_WARNING_PANEL', { message: err.message, show: true })
        })
      } else if (itemType === 'device') {
        this.deleteSelectedDevices().then(() => {
          this.fireDevicesDeletedMessage(selectedItemsLength)
          this.fetchNodes()
        }).catch(err => {
          this.$store.commit('UPDATE_WARNING_PANEL', { message: err.message, show: true })
        })
      } else if (itemType === 'floor') {
        this.deleteSelectedFloors().then(() => {
          this.fireFloorsDeletedMessage(selectedItemsLength)
          this.fetchNodes()
        }).catch(err => {
          this.$store.commit('UPDATE_WARNING_PANEL', { message: err.message, show: true })
        })
      }
    },
    fetchNodes () {
      this.$eventHub.$emit(NODE_LIST_CHANGE_EVENT)
    },
    fireGroupsDeletedMessage (selectedItemsLength) {
      if (selectedItemsLength > 1) {
        global.toastr['success'](this.$root.$t('venue.deleteGroupsMessage'), this.$root.$t('general.success'))
      } else {
        global.toastr['success'](this.$root.$t(`venue.deleteGroupMessage`), this.$root.$t('general.success'))
      }
    },
    fireSitesDeletedMessage (selectedItemsLength) {
      if (selectedItemsLength > 1) {
        global.toastr['success'](this.$root.$t('venue.sitesDeletedMessage'), this.$root.$t('general.success'))
      } else {
        global.toastr['success'](this.$root.$t('venue.siteDeletedMessage'), this.$root.$t('general.success'))
      }
    },
    fireDevicesDeletedMessage (selectedItemsLength) {
      if (selectedItemsLength > 1) {
        global.toastr['success'](this.$root.$t('venue.devicesDeletedMessage'), this.$root.$t('general.success'))
      } else {
        global.toastr['success'](this.$root.$t('venue.deviceDeletedMessage'), this.$root.$t('general.success'))
      }
    },
    fireFloorsDeletedMessage (selectedItemsLength) {
      if (selectedItemsLength > 1) {
        global.toastr['success'](this.$root.$t('venue.floorsDeletedMessage'), this.$root.$t('general.success'))
      } else {
        global.toastr['success'](this.$root.$t('venue.floorDeletedMessage'), this.$root.$t('general.success'))
      }
    }
  }
}

export default DeleteItemMixin
