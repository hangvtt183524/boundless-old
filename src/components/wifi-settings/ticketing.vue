<template lang="pug">
  .ticketing-page.page-content
    v-layout.mb-5
      v-flex(xs12, sm12, md6, lg6)
        h2 {{ $t(' wifi.ticketing ') }}
      v-flex.pb-3(
        text-xs-right
      )
        v-btn.primary-action.fixed-right(
          v-if="hasPermission('ticketing__create', nodeId)"
          color='primary',
          @click.stop='gotoAddTicket'
        )
          .action {{ $t('wifi.createWifiTicket') }}
          v-icon add_circle_outline

    base-table(
      v-if="hasPermission('ticketing__list', nodeId)"
      :items="ticketings"
      :table-headers="headers"
      :loading="loading"
      :useDefaultPagination="true",
      item-key="id"
      icon="fas fa-wifi"
      selectable
      select-all
      :row-clickable="hasPermission('ticketing__view', nodeId)"
      :total-items="totalItems"
      :search-text="search"
      :hide-actions="false"
      :selected-items="selectedItems"
      :is-selected-total="isSelectedTotal"
      hide-column-selector
      @fetchData="fetchItems"
      @reloadData="fetchTickets"
      @onSearch="searchItems"
      @onSelectAll="(val) => isSelectedTotal = val"
      @onChange="(val) => selectedItems = val"
      @rowClicked="(val) => editTicket(val)"
      v-model="selectedItems"
    )
      template(slot="row-action", slot-scope="slotProps")
        v-tooltip(
          v-if="hasPermission('ticketing__delete', nodeId)"
          bottom color="#9AA9C4"
          light
        )
          template(v-slot:activator="{ on }")
            .row-popover-item(@click.prevent.stop="deleteTicket(slotProps.item)" v-on="on")
              v-icon delete
          span {{ $t('tooltip.delete') }}

        v-tooltip(bottom color="#9AA9C4" light)
          template(v-slot:activator="{ on }")
            .row-popover-item(@click.prevent.stop="resendTicket(slotProps.item)" v-on="on")
              v-icon send
          span {{ $t('tooltip.resend', {name: 'Access Code'}) }}

        v-tooltip(
          v-if="hasPermission('ticketing__view', nodeId)"
          bottom color="#9AA9C4"
          light
        )
          template(v-slot:activator="{ on }")
            .row-popover-item(@click.prevent.stop="printTicket(slotProps.item)" v-on="on")
              v-icon print
          span {{ $t('tooltip.print') }}

        v-tooltip(
          v-if="hasPermission('ticketing__view', nodeId)"
          bottom color="#9AA9C4"
          light
        )
          template(v-slot:activator="{ on }")
            .row-popover-item(@click.prevent.stop="editTicket(slotProps.item)" v-on="on")
              v-icon edit
          span {{ $t('tooltip.edit') }}

    resend-ticketing-dialog(:show="showResendTicketingDialog" :ticket-data="selectedTicket" @close="closePrintTicketingDialog")
    ticketing-dialog(:show="showTicketingDialog" :ticket-data="selectedTicket" @close="closeTicketingDialog")
    printTicketing(:ticket-data="printData" v-show="false")
</template>

<script>
import { mapActions } from 'vuex'

import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import CurrentUserMixin from '@/mixins/current-user.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

import baseTable from '../common/base-table'
import ticketingDialog from './ticketing/ticketing-dialog'
import resendTicketingDialog from './ticketing/resend-ticketing-dialog'
import printTicketing from './ticketing/print-ticketing'

export default {
  name: 'WifiTicketingList',

  mixins: [
    UserPermissionsMixin,
    CurrentUserMixin,
    CurrentNodeSelectionsMixin
  ],

  components: {
    baseTable,
    ticketingDialog,
    resendTicketingDialog,
    printTicketing
  },

  data () {
    return {
      ticketings: [],
      headers: [
        { value: 'icon', align: 'left', sortable: false, width: 50, selected: true },
        { text: this.$t('wifi.ticketPassword'), value: 'password', align: 'left', sortable: false, selected: true },
        { text: this.$t('wifi.creatorName'), value: 'created_by.profile.full_name', align: 'left', sortable: false, selected: true },
        { text: this.$t('wifi.creatorEmail'), value: 'created_by.email', align: 'left', sortable: false, selected: true },
        { text: this.$t('wifi.visitor'), value: 'email', align: 'left', sortable: false, selected: true },
        { text: this.$t('wifi.authenticationDate'), value: 'used_at', align: 'left', sortable: false, selected: true, formatter: this.dateTimeFormatter },
        { text: this.$t('general.siteGroup'), value: 'node_name', align: 'left', sortable: false, selected: true },
        { text: 'actions', value: 'actions', align: 'center', sortable: false, selected: true },
        { text: this.$t('general.reload'), sortable: false, align: 'center', value: 'reload', selected: true }
      ],
      loading: false,
      search: '',
      isSelectedTotal: false,
      selectedItems: [],
      totalItems: 0,
      pagination: {
        descending: false,
        rowsPerPage: 10,
        sortBy: 'first_name'
      },
      printData: {},
      showTicketingDialog: false,
      showResendTicketingDialog: false,
      selectedTicket: {}
    }
  },

  methods: {
    ...mapActions('organization/ticketing', ['fetchTicketings', 'deleteTicketing']),
    fetchItems (filter) {
      this.pagination = filter
      this.selectedItems = []
      this.fetchTickets()
    },
    searchItems (search) {
      this.search = search
      this.selectedItems = false
      this.selectedUsers = []
      this.pagination.page = 1
      this.fetchTickets()
    },
    fetchTickets () {
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

      this.fetchTicketings(filters).then((response) => {
        this.totalItems = response.data.data.count
        this.ticketings = response.data.data.results
        if (this.isSelectedTotal) {
          this.selectedItems = response.data.data.results
        }
      }).finally(() => {
        this.loading = false
      })
    },
    gotoAddTicket () {
      this.selectedTicket = {}
      this.showTicketingDialog = true
    },
    editTicket (item) {
      this.selectedTicket = global._.cloneDeep(item)
      this.showTicketingDialog = true
    },
    deleteTicket (item) {
      this.loading = true
      this.deleteTicketing({ nodeId: this.nodeId, id: item.id }).then((response) => {
        this.loading = false
        global.toastr['success'](this.$t('wifi.deleteTicketSuccess'), this.$t('general.success'))
        this.fetchTickets()
      }).catch(error => {
        this.loading = false
        console.log(error)
      })
    },
    resendTicket (item) {
      this.selectedTicket = global._.cloneDeep(item)
      this.showResendTicketingDialog = true
    },
    printTicket (item) {
      this.printData = {
        name: `${item.first_name} ${item.last_name}`,
        email: item.email,
        phone: item.phone,
        accessCode: item.password,
        creationDate: this.dateFormatter(item.created_at),
        dailySchedule: `${item.validity_window.start_time}  ~  ${item.validity_window.end_time}`,
        forDates: `${this.dateFormatter(item.validity_window.start_date)}  ~  ${this.dateFormatter(item.validity_window.end_date)}`
      }
      setTimeout(() => {
        this.$htmlToPaper('print-section', () => {})
      }, 500)
    },
    closeTicketingDialog (isRefresh = false) {
      this.showTicketingDialog = false
      if (isRefresh) {
        this.fetchTickets()
      }
    },
    closePrintTicketingDialog () {
      this.showResendTicketingDialog = false
    }
  },

  watch: {
    nodeId (newId) {
      this.fetchTickets()
    }
  }
}
</script>

<style lang="scss">
  .ticketing-page {
    @media (max-width: 767px) {
      .v-btn.primary-action.fixed-right {
        top: 0;
      }
    }
  }
</style>
