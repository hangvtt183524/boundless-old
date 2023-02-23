<template lang="pug">
  .global-device-list-page.page-content
    .global-device-list-page__header
      h4.global-device-list-page__header__page-title
        | {{ $t('venue.devices') }}
      .global-device-list-page__header__actions
        search-input.base-text-input--small(
          :placeholder="$t('general.search')"
          v-model="search"
        )

    .global-device-list-page__content
      base-table(
        :items="deviceList"
        :headers="headers"
        :is-external-sort="true"
        @loadMore="onScrollEnd"
        @sortOrderChange="onSortOrderChange"
      )

    .global-device-list-page__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )

</template>

<script>
import BaseTable from '@/components/v2/base-table/base-table'
import SearchInput from '@/components/v2/search-input/search-input'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'global-device-list-page',
  components: {
    SearchInput,
    BaseTable
  },
  data: function () {
    return {
      loading: false,
      search: '',
      page: 1,
      pageSize: 50,
      ordering: null,
      headers: [
        {
          text: this.$t('general.macAddress'),
          value: 'mac_addresses',
          sortKey: 'mac_addresses__mac_address',
          formatter: this.macAddressCellFormatter
        },
        {
          text: this.$t('general.name'),
          value: 'name'
        },
        {
          text: this.$t('general.workspace'),
          value: 'workspace_name',
          sortable: false
        },
        {
          text: this.$t('general.organization'),
          value: 'organization_name',
          sortable: false
        },
        {
          text: this.$t('venue.venue'),
          value: 'site.name',
          sortable: false
        }
      ]
    }
  },
  mounted () {
    this.fetchAllDevices()
  },
  computed: {
    ...mapGetters('organization/device', ['allDevices', 'allDevicesCount']),
    deviceList () {
      return this.allDevices ? this.allDevices : []
    },
    pageCount () {
      return Math.ceil(this.allDevicesCount / this.pageSize)
    }
  },
  watch: {
    search: {
      handler: function () {
        // Reset page number
        this.page = 1

        // Re-fetch devices after search change
        this.fetchAllDevices()
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('organization/device', ['fetchDevices']),
    fetchAllDevices () {
      let filters = {
        page_size: this.pageSize,
        page: this.page,
        search: this.search
      }

      if (this.ordering) {
        filters.ordering = this.ordering
      }

      this.loading = true
      this.fetchDevices(filters).finally(() => {
        this.loading = false
      })
    },
    onScrollEnd () {
      if (this.page < this.pageCount && !this.loading) {
        this.$set(this, 'page', this.page + 1)
        this.fetchAllDevices()
      }
    },
    onSortOrderChange (ordering) {
      this.ordering = ordering

      // Reset page number
      this.page = 1

      this.fetchAllDevices()
    },
    macAddressCellFormatter (value) {
      if (!value) {
        return ''
      }

      return value[0].mac_address
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";
  @import "styles/v2/base.scss";

  .global-device-list-page {
    background-color: $white;
    position: relative;

    &__header {
      height: 60px;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
      padding: 0 30px 0 0;
      overflow: hidden;

      &__page-title {
        margin-left: 33px;
        line-height: 60px;
        letter-spacing: 1px;
        float: left;
      }

      &__actions {
        float: right;

        .base-text-input {
          margin-top: 15px;
        }
      }
    }

    &__content {
      padding: 44px 40px;
      box-sizing: border-box;
      height: calc(100vh - 180px);
    }

    &__loading-indicator {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba($white, 0.6);
    }
  }
</style>
