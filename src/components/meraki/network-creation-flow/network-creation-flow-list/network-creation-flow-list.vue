<template lang="pug">
  .network-creation-flow-list-page.page-content
    .network-creation-flow-list-page__header
      search-input.base-text-input--small.network-creation-flow-list-page__header__search-input(
        :placeholder="$t('v2.merakiNetworkCreation.searchFlows')"
        v-model="search"
      )

      .base-text-input--small.network-creation-flow-list-page__header__actions
        base-button.base-button--green.network-creation-flow-list-page__header__actions__create-button(
          @click="onCreateFlowClick"
        )
          | {{ $t('v2.merakiNetworkCreation.newFlow') }}

    .network-creation-flow-list-page__content
      base-table.network-creation-flow-list-page__content__flow-table(
        :items="tableItems"
        :headers="tableHeaders"
        :actions="tableActions"
        :is-external-sort="true"
        @actionClick="onTableActionClick"
        @loadMore="onScrollEnd"
        @sortOrderChange="onSortOrderChange"
      )
    .network-creation-flow-list-page__loading-indicator(
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
import BaseTable from '@/components/v2/base-table/base-table.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'

import { dateTimeFormatter } from '@/utils/global-cell-formatters'
import SearchInput from '@/components/v2/search-input/search-input'
import ConfirmModal from '@/components/v2/confirm-modal/confirm-modal'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

export default {
  name: 'network-creation-flow-list',
  components: {
    SearchInput,
    BaseTable,
    BaseButton,
    ConfirmModal
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  data () {
    return {
      search: '',
      loading: false,
      tableHeaders: [
        {
          text: this.$t('v2.merakiNetworkCreation.fileName'),
          value: 'file_name'
        },
        {
          text: this.$t('wifi.createdOn'),
          value: 'created_at',
          formatter: dateTimeFormatter
        },
        {
          text: this.$t('v2.merakiNetworkCreation.lastExecuted'),
          value: 'last_executed_at',
          formatter: dateTimeFormatter
        }
      ],
      tableActions: [
        {
          icon: 'visibility',
          type: 'edit'
        },
        {
          icon: '$vuetify.icons.delete',
          type: 'remove'
        }
      ],
      page: 1,
      pageSize: 50,
      ordering: '-created_at'
    }
  },
  mounted () {
    this.fetchFlows()
  },
  computed: {
    ...mapGetters('workspace/network', ['merakiNetworkCreationFlows', 'merakiNetworkCreationFlowsCount']),
    pageCount () {
      return Math.ceil(this.merakiNetworkCreationFlowsCount / this.pageSize)
    },
    tableItems () {
      return this.merakiNetworkCreationFlows.map(flow => {
        return {
          ...flow,
          last_executed_at: flow.executions.length > 0 ? flow.executions[0].created_at : null
        }
      })
    }
  },
  watch: {
    search: {
      handler: function () {
        // Reset page number
        this.page = 1

        // Re-fetch flows after search change
        this.fetchFlows()
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('workspace/network', ['fetchMerakiNetworkCreationFlows', 'deleteMerakiNetworkCreationFlow']),
    fetchFlows () {
      let filters = {
        workspaceId: this.workspaceId,
        page_size: this.pageSize,
        page: this.page,
        search: this.search
      }

      if (this.ordering) {
        filters.ordering = this.ordering
      }

      this.loading = true
      this.fetchMerakiNetworkCreationFlows(filters).finally(() => {
        this.loading = false
      })
    },
    onScrollEnd () {
      if (this.page < this.pageCount && !this.loading) {
        this.$set(this, 'page', this.page + 1)
        this.fetchFlows()
      }
    },
    onSortOrderChange (ordering) {
      this.ordering = ordering

      // Reset page number
      this.page = 1

      this.fetchFlows()
    },
    onTableActionClick (actionType, item) {
      if (actionType === 'edit') {
        this.$router.push({ name: 'NetworkCreationFlowDetail', params: { flowId: item.id } })
      } else if (actionType === 'remove') {
        this.deleteFlow(item)
      }
    },
    onCreateFlowClick () {
      this.$router.push({ name: 'NewNetworkCreationFlow' })
    },
    deleteFlow (flow) {
      this.$refs.confirmModal.open(
        this.$t('errors.warning'),
        this.$t('v2.merakiNetworkCreation.deleteFlowConfirmation')
      ).then(confirm => {
        if (confirm) {
          this.loading = true
          this.deleteMerakiNetworkCreationFlow({
            workspaceId: this.workspaceId,
            flowId: flow.id
          }).then(response => {
            // Re-fetch flows
            this.fetchFlows()

            global.toastr['success'](this.$t('v2.merakiNetworkCreation.deleteFlowSuccess'), this.$t('general.success'))
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style src="./network-creation-flow-list.scss" lang="scss" scoped></style>
