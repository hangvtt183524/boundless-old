<template lang="pug">
  .page-content
    v-layout.mb-5
      v-flex(xs12, sm12, md6, lg6)
        h2 {{ $t('wifi.codesInVoucher') }}
    base-table(
      :items="codesList"
      :table-headers="headers"
      :loading="loading"
      :useDefaultPagination="true",
      item-key="id"
      icon="fas fa-wifi"
      :search-text="search"
      :total-items="totalItems"
      hide-actions
      :table-pagination="pagination"
      @fetchData="fetchItems"
      @reloadData="fetchCodes"
      @onSearch="searchItems"
    )
</template>

<script>
import { mapActions } from 'vuex'

import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import CurrentUserMixin from '@/mixins/current-user.mixin'

import baseTable from '../../common/base-table'

export default {
  name: 'WifiVoucherCodeListing',

  mixins: [
    CurrentUserMixin,
    UserPermissionsMixin
  ],

  components: {
    baseTable
  },

  data () {
    return {
      codesList: [],
      headers: [
        { value: 'icon', align: 'left', sortable: false, width: 50, selected: true },
        { text: this.$t('wifi.code'), value: 'password', align: 'left', sortable: true, selected: true },
        { text: this.$t('wifi.usageCount'), value: 'usage_count', align: 'left', sortable: true, selected: true },
        { text: this.$t('wifi.lastSeen'), value: 'last_seen', align: 'left', sortable: true, selected: true, formatter: this.dateTimeFormat },
        { text: this.$t('wifi.loginTime'), value: 'login_time', align: 'left', sortable: true, selected: true, formatter: this.dateTimeFormat },
        { text: this.$t('general.reload'), sortable: false, align: 'right', value: 'reload', selected: true },
        { text: 'actions', value: 'actions', align: 'center', sortable: false, selected: true }
      ],
      search: '',
      loading: false,
      totalItems: 0,
      pagination: {}
    }
  },

  computed: {
    nodeId () {
      return this.$route.params.nodeId
    },
    voucherId () {
      return this.$route.params.voucherId
    }
  },

  methods: {
    ...mapActions('organization/voucher', ['fetchVoucherCodes']),
    fetchItems (filter) {
      this.pagination = filter
      this.fetchCodes()
    },
    searchItems (search) {
      this.search = search
      this.pagination.page = 1
      this.fetchCodes()
    },
    fetchCodes () {
      let filters = {
        nodeId: this.nodeId,
        batch_config: this.voucherId,
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
      // this.loading = true

      this.fetchVoucherCodes(filters).then((response) => {
        this.totalItems = response.data.data.count
        this.codesList = response.data.data.results
      }).catch(error => {
        console.log(error)
        this.loading = false
      }).finally(() => {
        this.loading = false
      })
    }
  },

  watch: {
    nodeId (newId) {
      this.fetchCodes()
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
