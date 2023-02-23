<template lang="pug">
  .page-content
    v-layout.mb-5
      v-flex(xs12, sm12, md6, lg6)
        h2 {{ $t(' wifi.sponsoredAccess ') }}
      v-flex.pb-3(
        text-xs-right
      )
        v-btn.primary-action(
          v-if="hasPermission('sponsored_access__edit_settings', nodeId)"
          color='primary',
          @click.stop='goToSponserPage'
        )
          | {{ $t('wifi.addSponsors') }}
          v-icon add_circle_outline

    base-table(
      v-if="hasPermission('sponsored_access__list', nodeId)"
      :items="sponsorRequestList"
      :table-headers="headers"
      :loading="loading"
      :useDefaultPagination="true",
      item-key="id"
      icon="fas fa-wifi"
      hide-icon
      :total-items="totalItems"
      :search-text="search"
      :hide-actions="false"
      :table-pagination="pagination"
      hide-column-selector
      @fetchData="fetchItems"
      @reloadData="fetchSponsoredAccess"
      @onSearch="searchItems"
    )
      template(slot="row-action", slot-scope="slotProps")
        v-tooltip(bottom color="#9AA9C4" light)
          template(v-slot:activator="{ on }")
            .row-popover-item(@click.prevent.stop="authorizeSponsor(slotProps.item)" v-on="on")
              v-icon(:disabled="slotProps.item.authorized") how_to_reg
          span {{ slotProps.item.authorized ? $t('tooltip.userAuthorized'): $t('tooltip.authorizeVisitor') }}
        v-tooltip(
          v-if="hasPermission('sponsored_access__delete', nodeId)"
          bottom color="#9AA9C4"
          light
        )
          template(v-slot:activator="{ on }")
            .row-popover-item(@click.prevent.stop="removeSponsor(slotProps.item)" v-on="on")
              v-icon delete
          span {{ $t('tooltip.delete') }}

    confirm-dialog(ref="confirmDialog")
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import CurrentUserMixin from '@/mixins/current-user.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

import baseTable from '../common/base-table'
import ConfirmDialog from '@/components/common/confirm-dialog'

export default {
  name: 'WifiSettingsAuthorizationListing',

  mixins: [
    UserPermissionsMixin,
    CurrentUserMixin,
    CurrentNodeSelectionsMixin
  ],

  components: {
    baseTable,
    ConfirmDialog
  },

  data () {
    return {
      headers: [
        { text: this.$t('wifi.visitor'), value: 'visitor', align: 'left', sortable: true, custom_sort_field: 'visitor_email', selected: true },
        { text: this.$t('general.sponsor'), value: 'sponsor_email', align: 'left', sortable: true, selected: true },
        { text: this.$t('venue.venue'), value: 'site', align: 'left', sortable: true, selected: true },
        { text: this.$t('wifi.requestedAt'), value: 'created_at', align: 'left', sortable: true, selected: true, formatter: this.dateTimeFormatter },
        { text: this.$t('wifi.code'), value: 'access_code', align: 'left', sortable: true, selected: true },
        { text: this.$t('wifi.duration'), value: 'session_timeout', align: 'left', sortable: false, selected: true, formatter: this.convertSecToTimes },
        { text: this.$t('wifi.authorized'), value: 'authorized', align: 'left', sortable: true, selected: true },
        { text: this.$t('wifi.authorizedAt'), value: 'authorized_at', align: 'left', sortable: true, selected: true, formatter: this.dateTimeFormatter },
        { text: 'actions', value: 'actions', align: 'center', sortable: false, selected: true },
        { text: this.$t('general.reload'), sortable: false, align: 'center', value: 'reload', selected: true }
      ],
      loading: false,
      search: '',
      totalItems: 0,
      pagination: {}
    }
  },

  computed: {
    ...mapGetters('organization/node', ['sponsorRequestList'])
  },

  methods: {
    ...mapActions('organization/node', ['fetchsSponsorRequestList']),
    fetchItems (filter) {
      this.pagination = filter
      this.fetchSponsoredAccess()
    },
    searchItems (search) {
      this.search = search
      this.pagination.page = 1
      this.fetchSponsoredAccess()
    },
    fetchSponsoredAccess () {
      if (!this.selectedNode.id) return
      let filters = {
        nodeId: this.selectedNode.id,
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
      this.fetchsSponsorRequestList(filters).then((response) => {
        this.totalItems = response.data.data.count
        this.loading = false
      })
    },
    goToSponserPage () {
      this.$router.push({ name: 'AddSponsors' })
    },
    authorizeSponsor (item) {
      if (!item.authorized) {
        window.open(item.authorization_url, '_blank')
      }
    },
    removeSponsor (item) {
      console.log(item)
      this.$refs.confirmDialog.open(
        this.$t('general.confirmTitle', { name: this.$t('wifi.sponsoredAccessRequest') }), this.$t('general.deleteConfirmMessage'), { color: 'error' }
      ).then(confirm => {
        if (confirm) {
          this.$store.dispatch(
            'organization/node/deleteSponsorRequests', { nodeId: this.selectedNode.id, sponsorRequestId: item.id }
          ).finally(() => {
            global.toastr['success'](this.$root.$t('wifi.sponsoredAccessRequestDeletedMessage'), this.$root.$t('general.success'))
            this.fetchSponsoredAccess()
          })
        }
      })
    }
  },

  watch: {
    selectedNode (newId) {
      if (this.hasPermission('sponsored_access__list', this.nodeId)) {
        this.fetchSponsoredAccess()
      }
    }
  }
}
</script>

<style scoped lang="sass">
  .user-list-table-row
    .user-list-table-actions
      opacity: 0
    &:hover
      .user-list-table-actions
        opacity: 1
</style>
