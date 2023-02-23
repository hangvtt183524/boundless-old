<template lang='pug'>
  .page-content
    v-layout.mb-5
      v-flex(xs12, sm12, md6, lg6)
        h2 {{$t('general.splashPage')}}
      v-flex.pb-3(
        v-show="hasPermission('templates__create', organizationId)"
        xs6 text-xs-right
      )
        v-btn.primary-action(
          color='primary'
          @click.stop='onNewSplashPageClick'
          :loading="creating"
        )
          | {{ $t('splash.newSplash') }}
          v-icon add_circle_outline
    base-table(
      v-if="hasPermission('templates__view', organizationId)"
      :name="$t('general.splashPage')"
      :associated="{ value: 'campaigns', name: $t('general.campaign') }"
      :items="splashPages"
      :table-headers="splashListHeaders"
      :loading="loading"
      :hide-actions="false"
      :row-clickable="hasPermission('templates__edit', organizationId)"
      @rowClicked="(val) => goToSplashPage(val.id)"
      :selected-items="selectedSplashPages"
      :table-pagination="pagination"
      icon="fas fa-image"
      item-key="id"
      :selectable="hasPermission('templates__delete', organizationId)"
      :select-all="hasPermission('templates__delete', organizationId)"
      :show-modify="hasPermission('templates__delete', organizationId)"
      :search-text="search"
      :use-default-pagination="true"
      :total-items="totalItems"
      :is-selected-total="isSelectedTotal"
      :modify-list="modifyList"
      @fetchData="fetchItems"
      @reloadData="onReloadData"
      @onSearch="searchItems"
      @onSelectAll="(val) => isSelectedTotal = val"
      @onChange="(val) => selectedSplashPages = val"
      @delete="onDeleteSelectedSplashPages"
      @columnSelectionChange="onColumnSelectionChange"
      @sortChange="onSortChange"
      v-model="selectedSplashPages"
    )
      template(slot="campaigns", slot-scope="{ item }")
        .campaign-item
          a.column-link(v-for="campaign in item.campaigns" @click = "goToCampaignDetails(campaign.id)") {{ `${campaign.name}, ` }}
      template(slot="createdBy", slot-scope="{ item }")
        a.column-link(@click = "goToUserDetail(item.created_by)") {{ item.created_by_name }}
      template(
        slot="row-action"
        slot-scope="slotProps"
      )
        v-tooltip(bottom color="#9AA9C4" light v-if="slotProps.item.url")
          template(v-slot:activator="{ on }")
            .row-popover-item(
              @click="openPreviewURL(slotProps.item)"
              v-on="on"
            )
              v-icon visibility
          span {{ $t('tooltip.previewPage') }}

        v-tooltip(bottom color="#9AA9C4" light)
          template(v-slot:activator="{ on }")
            .row-popover-item(
              v-if="hasPermission('templates__delete', organizationId)"
              @click="deleteSplashPage(slotProps.item)"
              v-on="on"
            )
              v-icon delete
          span {{ $t('tooltip.delete') }}

        v-tooltip(bottom color="#9AA9C4" light)
          template(v-slot:activator="{ on }")
            .row-popover-item(
              v-if="hasPermission('templates__create', organizationId)"
              @click="cloneSplashPage(slotProps.item)"
              v-on="on"
            )
              v-icon file_copy
          span {{ $t('tooltip.copy') }}

    delete-warning-dialog(
      :show="showDeleteDialog"
      :name="selectedItem.name"
      :message="$t('splash.deleteCampaigns')"
      @close="showDeleteDialog = false"
    )
    clone-confirm-dialog(
      :show="showCloneDialog"
      :name="selectedItem.name"
      @confirmed="cloneConfirmed"
      @close="showCloneDialog = false"
    )
    confirm-dialog(ref="confirmDialog")
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import { SPLASH_PAGE_ADDED_EVENT } from '@/constants/events'

import CurrentUserMixin from '@/mixins/current-user.mixin'
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import TableListingsMixin from '@/mixins/table-listings.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import baseTable from '../common/base-table'
import deleteWarningDialog from '../common/delete-warning-dialog'
import cloneConfirmDialog from '../common/clone-confirm-dialog'
import ConfirmDialog from '@/components/common/confirm-dialog'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'SplashPages',
  mixins: [
    CurrentUserMixin,
    UserPermissionsMixin,
    TableListingsMixin,
    CurrentNodeSelectionsMixin
  ],
  mounted () {
    if (global._.isEmpty(this.splashPageOptions)) {
      this.fetchSplashPageOptions(this.organizationId)
    }
  },

  beforeDestroy () {
    this.$eventHub.$off(SPLASH_PAGE_ADDED_EVENT)
  },

  components: {
    baseTable,
    deleteWarningDialog,
    cloneConfirmDialog,
    ConfirmDialog
  },

  data () {
    return {
      search: '',
      splashListHeaders: [
        { sortable: false, value: 'icon', selected: true },
        { text: this.$t('general.lastUpdateDate'), sortable: true, value: 'updated_at', selected: true, formatter: this.dateTimeFormatter },
        { text: this.$t('general.name'), sortable: true, value: 'name', selected: true },
        { text: this.$t('general.campaign'), sortable: false, value: 'campaigns', type: 'slot', slotName: 'campaigns', selected: true },
        { text: this.$t('general.pageType'), sortable: true, value: 'default_page', selected: true, formatter: this.defaultPageFormatter },
        { text: this.$t('general.creator'), sortable: true, value: 'created_by_name', custom_sort_field: 'created_by__profile__first_name', type: 'slot', slotName: 'createdBy', selected: true },
        { text: this.$t('general.status'), sortable: true, value: 'published_version', selected: false, formatter: this.statusFormatter },
        { text: this.$t('general.publishedOn'), sortable: true, value: 'published_datetime', selected: false },
        { text: this.$t('general.reload'), sortable: false, align: 'right', value: 'reload', selected: true },
        { text: 'actions', sortable: false, align: 'center', value: 'actions', selected: true }
      ],
      showDeleteDialog: false,
      showCloneDialog: false,
      selectedItem: {},
      loading: false,
      creating: false,
      totalItems: 0,
      pagination: {
        descending: true,
        rowsPerPage: 10,
        sortBy: 'updated_at'
      },
      selectedSplashPages: [],
      isSelectedTotal: false,
      modifyList: [
        { value: 'delete', title: this.$t('splash.deleteSplashPages') }
      ]
    }
  },
  computed: {
    ...mapGetters('organization', ['splashPages'])
  },

  methods: {
    ...mapActions('organization/splashpage', ['fetchSplashPageOptions', 'getSplashPageIds', 'createSplashPage']),
    ...mapActions('organization', ['deleteSelectedSplashPages']),
    fetchItems (filter) {
      this.pagination = filter
      this.selectedSplashPages = []
      this.fetchSplashPages()
    },
    searchItems (search) {
      this.search = search
      this.pagination.page = 1
      this.isSelectedTotal = false
      this.selectedSplashPages = []
      this.fetchSplashPages()

      EventTracker.sendEvent(EVENT_NAMES.SPLASH_PAGE_LIST_SEARCHED)
    },
    statusFormatter (publishedVersion) {
      return publishedVersion ? this.$t('general.published') : this.$t('general.draft')
    },
    defaultPageFormatter (defaultPage) {
      return defaultPage ? this.$t('splash.' + defaultPage) : ''
    },
    campaignsFormatter (campaigns) {
      return campaigns.map(campaign => campaign.name).join(', ')
    },
    onReloadData () {
      this.fetchSplashPages()

      EventTracker.sendEvent(EVENT_NAMES.SPLASH_PAGE_LIST_REFRESHED)
    },
    fetchSplashPages () {
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
      this.$store.dispatch('organization/fetchSplashPages', filters).then(response => {
        this.totalItems = response.data.data.count
        if (this.isSelectedTotal) {
          this.selectedSplashPages = response.data.data.results
        }
        this.loading = false
      }).catch(err => {
        console.log(err)
        this.loading = false
      })
    },
    openAnalytics () {
      console.log('Analytics')
    },
    cloneConfirmed (arg) {
      this.showCloneDialog = false
      this.loading = true
      this.$store.dispatch('organization/cloneSplashPage', { orgId: this.organizationId, id: this.selectedItem.id, name: arg }).then(response => {
        global.toastr['success'](this.$t('splash.cloneSplash'), this.$t('general.success'))
        this.fetchSplashPages()
        this.loading = false
        this.goToSplashPage(response.data.data.id)
      }).catch(err => {
        console.log(err)
      })
    },
    cloneSplashPage (item) {
      this.selectedItem = item
      this.showCloneDialog = true

      EventTracker.sendEvent(EVENT_NAMES.SPLASH_PAGE_DUPLICATED)
    },
    deleteSplashPage (item) {
      this.$refs.confirmDialog.open(
        this.$t('general.confirmTitle', { name: this.$t('general.splashPage') }), this.$t('general.deleteConfirmMessage'), { color: 'error' }
      ).then(confirm => {
        if (confirm) {
          if (item.campaigns && item.campaigns.length) {
            this.selectedItem = item
            this.showDeleteDialog = true
            return
          }
          this.loading = true
          this.$store.dispatch('organization/deleteSplashPage', { orgId: this.organizationId, id: item.id }).then(response => {
            global.toastr['success'](this.$t('splash.deleteSplash'), this.$t('general.success'))
            this.fetchSplashPages()
            this.loading = false
          }).catch(err => {
            console.log(err)
          })

          EventTracker.sendEvent(EVENT_NAMES.SPLASH_PAGE_DELETED)
        }
      })
    },
    onNewSplashPageClick () {
      this.creating = true
      this.createSplashPage({
        orgId: this.selectedOrganization.id,
        payload: {
          type: 'guest'
        }
      }).then(response => {
        setTimeout(() => {
          this.$router.push({ name: 'SplashPageBuilder', params: { splashId: response.data.data.id } })
        }, 1500)

        this.$eventHub.$emit(SPLASH_PAGE_ADDED_EVENT)
      }).catch(() => {
        this.creating = false
      })

      EventTracker.sendEvent(EVENT_NAMES.SPLASH_PAGE_CREATED)
    },
    onDeleteSelectedSplashPages () {
      if (this.isSelectedTotal) {
        this.getSplashPageIds({
          orgId: this.organizationId,
          page_size: 0,
          page: 1,
          search: this.search ? this.search : ''
        }).then(response => {
          this.performDeleteSelectedSplashPages(response.data.data)
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.performDeleteSelectedSplashPages(this.selectedSplashPages.map(item => item.id))
      }

      EventTracker.sendEvent(EVENT_NAMES.SPLASH_PAGE_BATCH_DELETED)
    },
    performDeleteSelectedSplashPages (splashPageIds) {
      this.deleteSelectedSplashPages({
        orgId: this.organizationId,
        splashPageIds: splashPageIds
      }).then(response => {
        global.toastr['success'](this.$t('general.deletedSelectItems'), this.$t('general.success'))
        this.selectedSplashPages = []
        this.isSelectedTotal = false
        this.fetchSplashPages()
      }).catch(err => {
        console.log(err)
      })
    },
    openPreviewURL (item) {
      if (item.url) {
        window.open(item.url, '_blank')

        EventTracker.sendEvent(EVENT_NAMES.SPLASH_PAGE_PREVIEWED)
      }
    },
    onColumnSelectionChange () {
      EventTracker.sendEvent(EVENT_NAMES.SPLASH_PAGE_LIST_CUSTOMIZED)
    },
    onSortChange () {
      EventTracker.sendEvent(EVENT_NAMES.SPLASH_PAGE_LIST_SORTED)
    }
  }
}
</script>
