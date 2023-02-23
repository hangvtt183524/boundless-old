<template lang="pug">
  .template-list-page.page-content
    .template-list-page__header
      search-input.base-text-input--small.template-list-page__header__search-input(
        :placeholder="$t('v2.merakiTemplates.searchTemplates')"
        v-model="search"
      )

      .base-text-input--small.template-list-page__header__actions
        base-button.base-button--green.template-list-page__header__actions__create-button(
          @click="onCreateTemplateClick"
        )
          | {{ $t('v2.merakiTemplates.newTemplate') }}

    .template-list-page__content
      base-table.template-list-page__content__template-table(
        :items="merakiTemplates"
        :headers="tableHeaders"
        :actions="tableActions"
        :is-external-sort="true"
        @actionClick="onTableActionClick"
        @itemAction="onTableItemAction"
        @loadMore="onScrollEnd"
        @sortOrderChange="onSortOrderChange"
      )
    .template-list-page__loading-indicator(
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

    template-creation-modal(
      :show="showNewTemplateModal"
      @close="closeNewTemplateModal"
    )

</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import BaseTable from '@/components/v2/base-table/base-table.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'

import { dateTimeFormatter } from '@/utils/global-cell-formatters'
import SearchInput from '@/components/v2/search-input/search-input'
import ConfirmModal from '@/components/v2/confirm-modal/confirm-modal'
import TemplateCreationModal from '../template-creation-modal/template-creation-modal'
import InlineEditCell from '@/components/v2/base-table/column-components/inline-edit-cell'
import CurrentProductSelectionsMixin from '@/mixins/current-product-selections.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import EmptyOrganizationListCheckMixin from '@/mixins/empty-organization-list-check.mixin'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'template-list',
  components: {
    TemplateCreationModal,
    SearchInput,
    BaseTable,
    BaseButton,
    ConfirmModal
  },
  mixins: [
    CurrentProductSelectionsMixin,
    CurrentNodeSelectionsMixin,
    EmptyOrganizationListCheckMixin
  ],
  data () {
    return {
      search: '',
      loading: false,
      tableActions: [
        {
          icon: '$vuetify.icons.edit',
          type: 'edit'
        },
        {
          icon: 'file_upload',
          type: 'deploy',
          tooltip: this.$t('v2.merakiTemplates.deploy'),
          fontSize: '22px',
          displayCondition: () => {
            // Do not show on Deployment product
            return this.activeProductIdentifier !== 'deployment'
          }
        },
        {
          icon: 'file_copy',
          type: 'duplicate',
          tooltip: this.$t('general.duplicate')
        },
        {
          icon: '$vuetify.icons.delete',
          type: 'remove'
        }
      ],
      page: 1,
      pageSize: 50,
      ordering: '-updated_at',
      showNewTemplateModal: false,
      selectedTemplate: null
    }
  },
  mounted () {
    this.fetchTemplates()
  },
  computed: {
    ...mapGetters('workspace/network', ['merakiTemplates', 'merakiTemplatesCount']),
    pageCount () {
      return Math.ceil(this.merakiTemplatesCount / this.pageSize)
    },
    tableHeaders () {
      const headers = [
        {
          text: this.$t('general.name'),
          value: 'name',
          cellComponent: InlineEditCell
        },
        {
          text: this.$t('wifi.createdOn'),
          value: 'created_at',
          formatter: dateTimeFormatter
        },
        {
          text: this.$t('v2.securityCompliance.lastUpdated'),
          value: 'updated_at',
          formatter: dateTimeFormatter
        }
      ]

      // If we have any row with legacy_organization_name field set, add corresponding header
      if (this.merakiTemplates.find(item => !!item.legacy_organization_name)) {
        headers.splice(1, 0, {
          text: this.$t('general.organization'),
          value: 'legacy_organization_name'
        })
      }

      return headers
    }
  },
  watch: {
    search: {
      handler: function () {
        // Reset page number
        this.page = 1

        // Re-fetch templates after search change
        this.fetchTemplates()
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('workspace/network', ['fetchMerakiTemplates', 'deleteMerakiTemplate', 'createMerakiTemplate',
      'updateMerakiTemplate', 'updateMerakiTemplateInList']),
    fetchTemplates () {
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
      this.fetchMerakiTemplates(filters).finally(() => {
        this.loading = false
      })
    },
    onScrollEnd () {
      if (this.page < this.pageCount && !this.loading) {
        this.$set(this, 'page', this.page + 1)
        this.fetchTemplates()
      }
    },
    onSortOrderChange (ordering) {
      this.ordering = ordering

      // Reset page number
      this.page = 1

      this.fetchTemplates()
    },
    onTableActionClick (actionType, item) {
      if (actionType === 'edit') {
        this.$router.push({ name: 'TemplateDetail', params: { templateId: item.id } })
      } else if (actionType === 'remove') {
        this.deleteTemplate(item)
      } else if (actionType === 'deploy') {
        this.$router.push({ name: 'TemplateDeployment', params: { templateId: item.id } })
      } else if (actionType === 'duplicate') {
        this.duplicateTemplate(item)
      }
    },
    onTableItemAction (item, field, value) {
      if (value.type === 'update') {
        this.loading = true
        this.updateMerakiTemplate({
          workspaceId: this.workspaceId,
          templateId: item.id,
          ...item,
          [field]: value.value
        }).then(response => {
          // Update item in store
          this.updateMerakiTemplateInList(response.data.data)
        }).finally(() => {
          this.loading = false
        })
      }
    },
    onCreateTemplateClick () {
      this.openNewTemplateModal()
    },
    deleteTemplate (template) {
      this.$refs.confirmModal.open(
        this.$t('errors.warning'),
        this.$t('v2.merakiTemplates.deleteTemplateConfirmation')
      ).then(confirm => {
        if (confirm) {
          this.loading = true
          this.deleteMerakiTemplate({
            workspaceId: this.workspaceId,
            templateId: template.id
          }).then(response => {
            // Re-fetch templates
            this.fetchTemplates()

            global.toastr['success'](this.$t('v2.merakiTemplates.deleteTemplateSuccess'), this.$t('general.success'))
          }).catch(() => {
            this.loading = false
          })

          EventTracker.sendEvent(EVENT_NAMES.FLEXTEMPLATE_DELETED)
        }
      })
    },
    duplicateTemplate (template) {
      this.$refs.confirmModal.open(
        this.$t('errors.warning'),
        this.$t('v2.merakiTemplates.templateDuplicateConfirmation').replace('{template_name}', '<b>' + template.name + '</b>')
      ).then(confirm => {
        if (confirm) {
          this.loading = true
          const duplicate = {
            ...template,
            workspaceId: this.workspaceId,
            name: `Copy of ${template.name}`
          }
          delete duplicate.id

          this.createMerakiTemplate(duplicate).then(() => {
            // Re-fetch roles
            this.fetchTemplates()

            global.toastr['success'](this.$t('v2.merakiTemplates.duplicateTemplateSuccess'), this.$t('general.success'))
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    openNewTemplateModal () {
      this.$set(this, 'showNewTemplateModal', true)
    },
    closeNewTemplateModal () {
      this.$set(this, 'showNewTemplateModal', false)
    }
  }
}
</script>

<style src="./template-list.scss" lang="scss" scoped></style>
