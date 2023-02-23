<template lang="pug">
  .workspace-external-api-key-list-page.page-content
    .workspace-external-api-key-list-page__header
      search-input.base-text-input--small.workspace-external-api-key-list-page__header__search-input(
        :placeholder="$t('general.search')"
        v-model="search"
      )

      .base-text-input--small.workspace-external-api-key-list-page__header__actions
        base-button.base-button--green.workspace-external-api-key-list-page__header__actions__action(
          @click="onAddApiKeyClick"
        )
          | {{ $t('v2.workspaces.externalApiKeys.addApiKey') }}

    .workspace-external-api-key-list-page__content
      base-table.workspace-external-api-key-list-page__content__template-table(
        :items="externalApiKeyTableItems"
        :headers="tableHeaders"
        :actions="tableActions"
        :is-expandable="true"
        @actionClick="onTableActionClick"
        @loadMore="onScrollEnd"
        @sortOrderChange="onSortOrderChange"
        @rowExpand="onRowExpand"
      )
        template(
          v-slot:row-expand-area='props'
        )
          .workspace-external-api-key-list-page__content__template-table__organizations
            workspace-external-api-key-accessible-organization-list(
              :apiKeyId="props.props.item.id"
            )

    .workspace-external-api-key-list-page__loading-indicator(
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

    external-api-key-detail-modal(
      :show="isApiKeyDetailModalVisible"
      :key-data="activeApiKey"
      @close="closeApiKeyDetailModal"
    )

    job-tracking-modal(
      :persistent="true"
      :dismissible="true"
      ref="jobTrackingModal"
    )

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import BaseTable from '@/components/v2/base-table/base-table.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import ConfirmModal from '@/components/v2/confirm-modal/confirm-modal'
import ExternalApiKeyDetailModal from './detail-modal'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import SearchInput from '@/components/v2/search-input/search-input'
import JobTrackingModal from '@/components/v2/job-tracking-modal/job-tracking-modal.vue'
import { dateTimeFormatter, booleanFormatter } from '@/utils/global-cell-formatters'
import WorkspaceExternalApiKeyAccessibleOrganizationList from './accessible-organization-list'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'workspace-organization-list',
  components: {
    WorkspaceExternalApiKeyAccessibleOrganizationList,
    SearchInput,
    BaseTable,
    BaseButton,
    ConfirmModal,
    ExternalApiKeyDetailModal,
    JobTrackingModal
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  data () {
    return {
      loading: false,
      tableHeaders: [
        {
          text: this.$t('general.name'),
          value: 'name'
        },
        {
          text: this.$t('v2.workspaces.externalApiKeys.administrator'),
          value: 'administrator_email',
          formatter: (value, item) => {
            return item.administrator_name ? `${item.administrator_name} <${value}>` : value
          }
        },
        {
          text: this.$t('general.apiKey'),
          value: 'api_key_list_display',
          sortable: false
        },
        {
          text: this.$t('v2.workspaces.externalApiKeys.isValid'),
          value: 'is_valid',
          formatter: booleanFormatter,
          sortable: false
        },
        {
          text: this.$t('v2.workspaces.externalApiKeys.accessibleOrganizations'),
          value: 'organizations_count',
          sortable: false
        },
        {
          text: this.$t('wifi.createdBy'),
          value: 'created_by.profile.full_name',
          sortKey: 'created_by__profile__first_name'
        },
        {
          text: this.$t('wifi.createdOn'),
          value: 'created_at',
          formatter: dateTimeFormatter
        },
        {
          text: this.$t('v2.workspaces.externalApiKeys.lastRefreshedOn'),
          value: 'refreshed_at',
          formatter: dateTimeFormatter
        }
      ],
      tableActions: [
        {
          icon: '$vuetify.icons.edit',
          type: 'edit'
        },
        {
          icon: 'refresh',
          type: 'refresh_organizations'
        },
        {
          icon: '$vuetify.icons.delete',
          type: 'remove'
        }
      ],
      search: '',
      page: 1,
      pageSize: 20,
      ordering: 'created_at',
      activeApiKey: null,
      isApiKeyDetailModalVisible: false
    }
  },
  mounted () {
    this.fetchExternalApiKeys()
  },
  computed: {
    ...mapGetters('workspace', ['externalApiKeys', 'externalApiKeysCount']),
    externalApiKeyTableItems () {
      return this.externalApiKeys.map(apiKey => {
        return {
          ...apiKey,
          api_key_list_display: `********${apiKey.api_key_display.substring(apiKey.api_key_display.length - 4)}`
        }
      })
    }
  },
  watch: {
    search: {
      handler: function () {
        // Reset page number
        this.page = 1

        this.fetchExternalApiKeys()

        EventTracker.sendEvent(EVENT_NAMES.API_KEYS_SEARCHED)
      },
      deep: true
    },
    workspaceId: {
      handler: function (newValue, oldValue) {
        if (newValue && oldValue && newValue !== oldValue) {
          this.page = 1

          this.fetchExternalApiKeys()
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('workspace', ['fetchWorkspaceExternalApiKeys', 'deleteWorkspaceExternalApiKey', 'refreshWorkspaceExternalApiKeyOrganizations']),
    fetchExternalApiKeys () {
      this.loading = true
      this.fetchWorkspaceExternalApiKeys({
        workspaceId: this.workspaceId,
        page_size: this.pageSize,
        page: this.page,
        search: this.search,
        ordering: this.ordering
      }).finally(() => {
        this.loading = false
      })
    },
    onScrollEnd () {
      if (this.page < this.pageCount && !this.loading) {
        this.$set(this, 'page', this.page + 1)
        this.fetchExternalApiKeys()
      }
    },
    onSortOrderChange (ordering) {
      this.ordering = ordering

      // Reset page number
      this.page = 1

      this.fetchExternalApiKeys()
    },
    onTableActionClick (actionType, item) {
      if (actionType === 'edit') {
        this.showApiKeyDetailModal(item)
      } else if (actionType === 'refresh_organizations') {
        this.refreshApiKeyOrganizations(item)
      } else if (actionType === 'remove') {
        this.deleteExternalApiKey(item)
      }
    },
    deleteExternalApiKey (apiKey) {
      this.$refs.confirmModal.open(
        this.$t('errors.warning'),
        this.$t('v2.workspaces.externalApiKeys.deleteApiKeyConfirmation')
      ).then(confirm => {
        if (confirm) {
          this.loading = true
          this.deleteWorkspaceExternalApiKey({
            workspaceId: this.workspaceId,
            id: apiKey.id
          }).then(response => {
            // Re-fetch items
            this.fetchExternalApiKeys()

            global.toastr['success'](this.$t('v2.workspaces.externalApiKeys.deleteApiKeySuccess'), this.$t('general.success'))
          }).catch(() => {
            this.loading = false
          })

          EventTracker.sendEvent(EVENT_NAMES.API_KEY_DELETED)
        }
      })
    },
    refreshApiKeyOrganizations (apiKey) {
      this.loading = true
      this.refreshWorkspaceExternalApiKeyOrganizations({
        workspaceId: this.workspaceId,
        id: apiKey.id
      }).then(response => {
        this.$refs.jobTrackingModal.open(
          response.data.data.id,
          this.$t('v2.workspaces.externalApiKeys.syncProgressTitle'),
          this.$t('v2.workspaces.externalApiKeys.syncProgressDescription')
        ).then(success => {
          if (success) {
            global.toastr['success'](this.$t('v2.workspaces.externalApiKeys.syncSuccess'), this.$t('general.success'))
          }
        })
      }).finally(() => {
        this.loading = false
      })

      EventTracker.sendEvent(EVENT_NAMES.API_KEY_ORGANIZATIONS_REFRESHED)
    },
    onAddApiKeyClick () {
      this.showApiKeyDetailModal(null)
    },
    showApiKeyDetailModal (apiKey) {
      this.activeApiKey = apiKey
      this.isApiKeyDetailModalVisible = true
    },
    closeApiKeyDetailModal (isSaved) {
      this.isApiKeyDetailModalVisible = false

      if (isSaved) {
        this.fetchExternalApiKeys()
      }
    },
    onRowExpand () {
      EventTracker.sendEvent(EVENT_NAMES.API_KEY_ORGANIZATIONS_VIEWED)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .workspace-external-api-key-list-page {
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
          margin-top: 10px;
          margin-left: 10px;
          padding: 0 20px;
        }
      }
    }

    &__content {
      padding: 24px 30px;
      box-sizing: border-box;
      height: calc(100vh - 180px);

      &__template-table {
        height: 100%;
        &__organizations {
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
