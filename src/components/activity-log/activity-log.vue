<template lang="pug">
  .activity-log
    base-table(
      :items="activityLogs"
      :headers="headers"
      :custom-pagination="pagination"
      :is-expandable="true"
      :is-external-sort="true"
      :page-size-options="[15, 30, 50]"
      @pageLinkClick="onTablePageLinkClick"
      @pageSizeInput="onTablePageSizeInput"
      @sortOrderChange="onSortOrderChange"
      @rowExpand="onRowExpand"
    )
      template(
        v-slot:row-expand-area='props'
      )
        .activity-log__entities-row
          base-table(
            :items="props.props.item.entities"
            :headers="entityTableHeaders"
            :sortable="false"
            @rowClick="onEntityRowClick"
          )

    .activity-log__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )

    activity-log-detail-modal(
      :show="showActivityLogDetailDialog"
      :entity="selectedEntity"
      @close="onDetailModalClose"
    )

</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import BaseTable from '@/components/v2/base-table/base-table'
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import CurrentOrgMixin from '@/mixins/current-org.mixin'
import CurrentUserMixin from '@/mixins/current-user.mixin'
import { dateTimeFormatter } from '@/utils/global-cell-formatters'
import ActivityLogDetailModal from './activity-log-detail-modal'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'ActivityLog',

  props: {
    userId: {
      type: Number,
      default: 0
    },
    ancestorId: {
      type: Number,
      required: true
    },
    workspaceId: {
      required: false
    },
    pageSize: {
      type: Number,
      default: 30
    },
    search: {
      type: String,
      required: false
    }
  },

  mixins: [
    UserPermissionsMixin,
    CurrentOrgMixin,
    CurrentUserMixin
  ],

  components: {
    ActivityLogDetailModal,
    BaseTable
  },

  data () {
    return {
      entityTableHeaders: [
        {
          text: this.$t('general.stateBefore'),
          value: 'state_before',
          formatter: this.jsonFormatter,
          type: 'json'
        },
        {
          text: this.$t('general.stateAfter'),
          value: 'state_after',
          formatter: this.jsonFormatter,
          type: 'json'
        }
      ],
      loading: false,
      page: 1,
      showActivityLogDetailDialog: false,
      selectedEntity: {},
      ordering: null
    }
  },

  mounted () {
    this.fetchLogs()
  },

  computed: {
    ...mapGetters('workspace', ['activityLogs', 'activityLogsCount']),
    headers () {
      const headers = [
        {
          text: this.$t('general.date'),
          value: 'time',
          formatter: dateTimeFormatter
        },
        {
          text: this.$t('general.user'),
          value: 'user.profile.full_name',
          sortKey: 'user__profile__first_name'
        },
        {
          text: this.$t('general.siteGroup'),
          value: 'node_name',
          sortKey: 'entities__node__name'
        },
        {
          text: this.$t('general.action'),
          value: 'action_type'
        },
        {
          text: this.$t('builder.content'),
          value: 'content_type',
          sortKey: 'content_type__model'
        }
      ]

      if (this.userId) {
        // If on user specific view, remove user column
        headers.splice(1, 1)
      }

      if (this.workspaceId) {
        headers.splice(2, 0, {
          text: this.$t('v2.user.organizationOrWorkspace'),
          value: 'parent_name',
          sortable: false
        })
      }

      return headers
    },
    pagination () {
      return {
        page: this.page,
        pageSize: this.pageSize,
        total: this.activityLogsCount
      }
    }
  },

  watch: {
    ancestorId () {
      // Reset page number
      this.page = 1

      this.fetchLogs()
    },
    search: {
      handler: function () {
        // Reset page number
        this.page = 1

        // Re-fetch users after search change
        this.fetchLogs()

        EventTracker.sendEvent(EVENT_NAMES.ACTIVITY_LOG_SEARCHED)
      },
      deep: true
    }
  },

  methods: {
    ...mapActions('workspace', ['fetchActivityLogs']),
    fetchLogs () {
      let filters = {
        page_size: this.pageSize,
        page: this.page
      }

      if (this.workspaceId) {
        filters.workspace = this.workspaceId
      }

      if (this.ancestorId > -1) {
        filters.ancestor = this.ancestorId
      }

      if (this.userId) {
        filters.user = this.userId
      }

      if (this.search) {
        filters.search = this.search
      }

      if (this.ordering) {
        filters.ordering = this.ordering
      }

      this.loading = true
      this.fetchActivityLogs({ filters }).then((response) => {
        this.loading = false
      })
    },
    onTablePageLinkClick (pageNumber) {
      this.page = pageNumber
      this.fetchLogs()
    },
    onTablePageSizeInput (pageSize) {
      this.pageSize = pageSize

      // Reset page number
      this.page = 1

      this.fetchLogs()
    },
    onSortOrderChange (ordering) {
      this.ordering = ordering

      // Reset page number
      this.page = 1

      this.fetchLogs()
    },
    onRowExpand () {
      EventTracker.sendEvent(EVENT_NAMES.ACTIVITY_LOG_ENTRY_VIEWED)
    },
    onEntityRowClick (row) {
      this.selectedEntity = row
      this.showActivityLogDetailDialog = true
    },
    onDetailModalClose () {
      this.showActivityLogDetailDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .activity-log {
    position: relative;
    width: 100%;

    &__entities-row {
      padding: 30px;
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
  .activity-log ::v-deep {
    .v-datatable { // This is reducing date column's width and make width style property to work
      table-layout: fixed;
    }
  }
</style>
