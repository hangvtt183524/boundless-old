<template lang="pug">
  .workspace-list-page.page-content
    .workspace-list-page__header
      search-input.base-text-input--small.workspace-list-page__header__search-input(
        :placeholder="$t('v2.workspaces.searchWorkspaces')"
        v-model="search"
      )

      .base-text-input--small.workspace-list-page__header__actions
        base-button.base-button--green.workspace-list-page__header__actions__create-button(
          @click="onCreateWorkspaceClick"
        )
          | {{ $t('v2.workspaces.newWorkspace') }}

    .workspace-list-page__content
      base-table.workspace-list-page__content__template-table(
        :items="workspaces"
        :headers="tableHeaders"
        :actions="tableActions"
        :is-external-sort="true"
        @actionClick="onTableActionClick"
        @loadMore="onScrollEnd"
        @sortOrderChange="onSortOrderChange"
      )
    .workspace-list-page__loading-indicator(
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

export default {
  name: 'workspace-list',
  components: {
    SearchInput,
    BaseTable,
    BaseButton,
    ConfirmModal
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
          text: this.$t('wifi.createdOn'),
          value: 'created_at',
          formatter: dateTimeFormatter
        }
      ],
      tableActions: [
        {
          icon: '$vuetify.icons.edit',
          type: 'edit'
        },
        {
          icon: '$vuetify.icons.delete',
          type: 'remove'
        }
      ],
      page: 1,
      pageSize: 50,
      ordering: '-created_at',
      showNewTemplateModal: false
    }
  },
  mounted () {
    this.fetchWorkspaceList()
  },
  computed: {
    ...mapGetters('workspace', ['workspaces', 'workspacesCount']),
    pageCount () {
      return Math.ceil(this.workspacesCount / this.pageSize)
    }
  },
  watch: {
    search: {
      handler: function () {
        // Reset page number
        this.page = 1

        // Re-fetch templates after search change
        this.fetchWorkspaceList()
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('workspace', ['fetchWorkspaces', 'deleteWorkspace']),
    fetchWorkspaceList () {
      let filters = {
        page_size: this.pageSize,
        page: this.page,
        search: this.search
      }

      if (this.ordering) {
        filters.ordering = this.ordering
      }

      this.loading = true
      this.fetchWorkspaces(filters).finally(() => {
        this.loading = false
      })
    },
    onScrollEnd () {
      if (this.page < this.pageCount && !this.loading) {
        this.$set(this, 'page', this.page + 1)
        this.fetchWorkspaceList()
      }
    },
    onSortOrderChange (ordering) {
      this.ordering = ordering

      // Reset page number
      this.page = 1

      this.fetchWorkspaceList()
    },
    onTableActionClick (actionType, item) {
      if (actionType === 'edit') {
        this.$router.push({ name: 'Detail', params: { workspaceItemId: item.id } })
      } else if (actionType === 'remove') {
        this.deleteWorkspaceItem(item)
      }
    },
    onCreateWorkspaceClick () {
      this.$router.push({ name: 'NewWorkspace' })
    },
    deleteWorkspaceItem (workspace) {
      this.$refs.confirmModal.open(
        this.$t('errors.warning'),
        this.$t('v2.workspaces.deleteWorkspaceConfirmation')
      ).then(confirm => {
        if (confirm) {
          this.loading = true
          this.deleteWorkspace({
            id: workspace.id
          }).then(response => {
            // Re-fetch templates
            this.fetchWorkspaceList()

            global.toastr['success'](this.$t('v2.workspaces.deleteWorkspaceSuccess'), this.$t('general.success'))
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

  @import "styles/v2/colors.scss";

  .workspace-list-page {
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

      &__scroll-area {
        height: 100%;
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
