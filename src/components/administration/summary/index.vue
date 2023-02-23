<template lang="pug">
  .page-content
    v-layout.mb-5
      v-flex(xs12, sm12, md6, lg6)
        h2 {{ $t('v2.menu.organizational_summary') }}
    base-table(
      :name="$t('administration.summary')"
      :loading="loading"
      :table-headers="summaryHeaders"
      :items="summaries"
      :table-pagination="pagination"
      icon="fas fa-image"
      item-key="id"
      hide-icon
      hide-search
      :use-default-pagination="true"
      :total-items="totalItems"
      @fetchData="fetchItems"
      @reloadData="fetchSummaries"
    )
      template(
        slot="row-action"
        slot-scope="slotProps"
      )
        v-tooltip(bottom color="#9AA9C4" light)
          template(v-slot:activator="{ on }")
            .row-popover-item(
              v-if="isPlatformAdministrator"
              @click="viewOrg(slotProps.item)"
              v-on="on"
            )
              v-icon person
          span {{ $t('general.visitOrganization') }}
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import baseTable from '../../common/base-table'
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import DataFormatterMixin from '@/mixins/data-formatter.mixin'

export default {
  name: 'OrganizationalSummary',

  mixins: [
    UserPermissionsMixin,
    DataFormatterMixin
  ],

  components: {
    baseTable
  },

  computed: {
    ...mapGetters('administration', ['summaries'])
  },

  data () {
    return {
      search: '',
      summaryHeaders: [
        { text: this.$t('general.name'), sortable: true, align: 'left', value: 'name', selected: true },
        { text: this.$t('v2.organization.settings.merakiOrganization'), sortable: true, align: 'left', value: 'meraki_organization', selected: true },
        { text: this.$t('user.count'), sortable: true, align: 'left', value: 'user_count', selected: true },
        { text: this.$t('user.activity'), sortable: true, align: 'left', value: 'activity_count', selected: true },
        { text: this.$t('general.venues'), sortable: true, align: 'left', value: 'venue_count', selected: true },
        { text: this.$t('venue.devices'), sortable: true, align: 'left', value: 'device_count', selected: true },
        { text: this.$t('v2.menu.splash_pages'), sortable: true, align: 'left', value: 'splash_page_count', selected: true },
        { text: this.$t('campaign.campaigns'), sortable: true, align: 'left', value: 'campaign_count', selected: true },
        { text: this.$t('media.mediaLibraryUsage'), sortable: true, align: 'left', value: 'media_library_usage', selected: true, formatter: this.dataSizeFormatter },

        { text: this.$t('general.visitors'), sortable: true, align: 'left', value: 'visitor_count', selected: true },
        { text: this.$t('visitors.visitorsDay'), sortable: true, align: 'left', value: 'daily_average_visitor_count', selected: true },
        { text: this.$t('general.reload'), sortable: false, align: 'right', value: 'reload', selected: true },
        { text: 'actions', sortable: false, align: 'center', value: 'actions', selected: true }
      ],
      loading: false,
      pagination: {},
      totalItems: 0
    }
  },

  methods: {
    ...mapActions('administration', ['fetchOrgSummaries']),
    fetchItems (filter) {
      this.pagination = filter
      this.selectedItems = []
      this.fetchSummaries()
    },
    fetchSummaries () {
      let filters = {
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
      this.loading = true
      this.fetchOrgSummaries({ filters }).then((response) => {
        this.totalItems = response.data.data.count
        this.loading = false
      })
    },
    viewOrg (item) {

    },
    formatDataSize (value) {
      value = Number(value)
      if (!value) return ''
      const kbSize = value / 1024
      if (kbSize < 1024) {
        return `${Math.floor(kbSize)} kB`
      }

      const mbSize = kbSize / 1024
      if (mbSize < 1024) {
        return `${mbSize.toFixed(2)} MB`
      }

      const gbSize = mbSize / 1024
      return `${gbSize.toFixed(2)} GB`
    }
  }
}
</script>

<style lang="scss">
  @import "styles/colors.scss";

</style>
