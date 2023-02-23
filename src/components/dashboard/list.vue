<template lang='pug'>
  .dashboard-list.page-content(
    data-test="user-list"
  )
    .dashboard-list__header
      search-input.base-text-input--small.dashboard-list__header__search-input(
        v-if="hasPermission('dashboards__view', workspaceId)"
        :placeholder="$t('general.search')"
        v-model="search"
      )
      .dashboard-list__header__actions
        base-button.base-button--blue.dashboard-list__header__actions__download-button(
          v-if="hasPermission('dashboards__create', workspaceId)"
          @click="onNewDashboardClick"
        )
          | {{ $t('v2.dashboard.newDashboard') }}

    .dashboard-list__content
      base-table.dashboard-list__content__dashboard-table(
        v-if="hasPermission('dashboards__view', workspaceId)"
        :items="dashboards"
        :headers="tableHeaders"
        :actions="tableActions"
        :is-external-sort="true"
        @actionClick="onTableActionClick"
        @loadMore="onScrollEnd"
        @sortOrderChange="onSortOrderChange"
      )

    .dashboard-list__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )

    confirm-modal(
      ref="confirmModal"
    )

</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

import BaseTable from '@/components/v2/base-table/base-table.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'

import { dateTimeFormatter } from '@/utils/global-cell-formatters'
import SearchInput from '@/components/v2/search-input/search-input'
import ConfirmModal from '@/components/v2/confirm-modal/confirm-modal'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'dashboard-list',
  mixins: [
    UserPermissionsMixin,
    CurrentNodeSelectionsMixin
  ],
  components: {
    ConfirmModal,
    SearchInput,
    BaseTable,
    BaseButton
  },
  data () {
    return {
      search: '',
      loading: false,
      tableHeaders: [
        {
          text: this.$t('general.name'),
          value: 'name'
        },
        {
          text: this.$t('v2.dashboard.widgetCount'),
          value: 'widgets',
          formatter: this.widgetCountCellFormatter
        },
        {
          text: this.$t('wifi.createdBy'),
          value: 'created_by',
          sortKey: 'created_by__profile__first_name'
        },
        {
          text: this.$t('wifi.createdOn'),
          value: 'created_at',
          formatter: dateTimeFormatter
        }
      ],
      page: 1,
      pageSize: 50,
      ordering: null
    }
  },
  mounted () {
    if (this.hasPermission('dashboards__view', this.workspaceId)) {
      this.fetchDashboardList()
    }
  },
  computed: {
    ...mapGetters('workspace/network', ['dashboards', 'dashboardsCount']),
    pageCount () {
      return Math.ceil(this.dashboardsCount / this.pageSize)
    },
    tableActions () {
      // Construct table actions taking user permissions into account
      const tableActions = []

      if (this.hasPermission('dashboards__view', this.workspaceId)) {
        tableActions.push({
          icon: '$vuetify.icons.edit',
          type: 'edit'
        })
      }

      if (this.hasPermission('dashboards__create', this.workspaceId)) {
        tableActions.push({
          icon: '$vuetify.icons.delete',
          type: 'remove'
        })
      }

      return tableActions
    }
  },
  watch: {
    search: {
      handler: function () {
        // Reset page number
        this.page = 1

        // Re-fetch dashboards after search change
        this.fetchDashboardList()
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('workspace/network', ['fetchDashboards', 'deleteDashboard']),
    fetchDashboardList () {
      let filters = {
        page_size: this.pageSize,
        page: this.page,
        search: this.search,
        workspaceId: this.workspaceId
      }

      if (this.ordering) {
        filters.ordering = this.ordering
      }

      this.loading = true
      this.fetchDashboards(filters).finally(() => {
        this.loading = false
      })
    },
    onScrollEnd () {
      if (this.page < this.pageCount && !this.loading) {
        this.$set(this, 'page', this.page + 1)
        this.fetchDashboardList()
      }
    },
    onSortOrderChange (ordering) {
      this.ordering = ordering

      // Reset page number
      this.page = 1

      this.fetchDashboardList()
    },
    onTableActionClick (actionType, item) {
      if (actionType === 'edit') {
        this.$router.push({ name: 'DashboardDetail', params: { dashboardId: item.id } })
      } else if (actionType === 'remove') {
        this.removeDashboard(item)
      }
    },
    onNewDashboardClick () {
      this.$router.push({ name: 'NewDashboard' })

      EventTracker.sendEvent(EVENT_NAMES.CUSTOM_DASHBOARD_STARTED)
    },
    removeDashboard (dashboard) {
      this.$refs.confirmModal.open(
        this.$t('errors.warning'),
        this.$t('v2.dashboard.dashboardDeleteConfirmation')
      ).then(confirm => {
        if (confirm) {
          this.deleteDashboard({
            workspaceId: this.workspaceId,
            id: dashboard.id
          }).then(response => {
            // Re-fetch dashboards
            this.fetchDashboardList()

            global.toastr['success'](this.$t('v2.dashboard.dashboardDeleteSuccess'), this.$t('general.success'))
          }).catch(() => {
            global.toastr['error'](this.$t('v2.dashboard.dashboardDeleteFailure'), this.$t('general.error'))
          })

          EventTracker.sendEvent(EVENT_NAMES.CUSTOM_DASHBOARD_DELETED)
        }
      })
    },
    widgetCountCellFormatter (value) {
      if (!value) {
        return 0
      }

      return value.length
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .dashboard-list {
    background-color: $white;
    position: relative;

    &__header {
      height: 60px;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
      padding: 0 30px;
      overflow: hidden;

      &__search-input {
        float: left;
        margin-top: 15px;
      }

      &__actions {
        float: right;

        .base-button {
          min-width: 180px;
          margin-left: 10px;
          margin-top: 12px;
        }
      }
    }

    &__content {
      padding: 24px 30px;
      box-sizing: border-box;
      height: calc(100vh - 180px);

      &__scroll-area {
        height: 100%;
      }

      &__dashboard-table {
        &__checks {
          min-height: 120px;
          padding: 20px;
        }
      }
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
      background-color: rgba(255, 255, 255, 0.6);
    }
  }

</style>
