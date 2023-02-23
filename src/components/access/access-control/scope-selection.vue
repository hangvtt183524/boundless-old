<template lang="pug">
  .scope-selection
    v-layout.scope-selection__row(row wrap)
      v-flex.scope-selection__column(
        xs12 lg6
      )
        .scope-selection__options
          .scope-selection__options__header
            base-select.scope-selection__options__header__query-field-selection(
              v-model="targetType"
              :items="targetTypeOptions"
            )

            search-input.scope-selection__options__header__search-input(
              v-model="search"
              :placeholder="$t('general.search')"
            )

          .scope-selection__options__list
            base-table(
              :items="filteredTargetOptions"
              item-key="identifier"
              :headers="headers"
              :sortable="true"
              :multi-selectable="true"
              select-on-row-click
              :selectedRows="selectedTableItems"
              @rowSelect="onRowSelect"
              @rowDeselect="onRowDeselect"
              :empty-state-message="$t('v2.access.noTargetsAvailable')"
              key="options"
              @loadMore="onScrollEnd"
            )

            .scope-selection__options__list__loading-indicator(
              v-if="loading"
            )
              v-progress-circular(
                :size="50"
                indeterminate
                color="#15ac2f"
              )

      v-flex.scope-selection__column(xs12 lg6)
        .scope-selection__selections
          .scope-selection__selections__header
            .scope-selection__selections__header__title
              | {{ $t('general.selections') }}

          .scope-selection__selections__list
            base-table(
              :items="value"
              :headers="selectionHeaders"
              :sortable="true"
              :actions="selectionTableActions"
              @actionClick="onSelectionTableActionClick"
              key="selections"
              :empty-state-message="$t('v2.access.noTargetsSelected')"
            )

    job-tracking-modal(
      :persistent="true"
      :status-check-interval="500"
      display-post-run-messages
      ref="jobTrackingModal"
    )

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import BaseTable from '@/components/v2/base-table/base-table'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input.vue'
import SearchInput from '@/components/v2/search-input/search-input.vue'
import BaseSelect from '@/components/v2/base-select/base-select'
import JobTrackingModal from '@/components/v2/job-tracking-modal/job-tracking-modal.vue'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

export default {
  name: 'scope-selection',
  components: {
    BaseTable,
    BaseTextInput,
    SearchInput,
    BaseSelect,
    JobTrackingModal
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  props: {
    value: {
      type: Array,
      required: true
    },
    parentOrganizations: {
      type: Array,
      default: () => []
    }
  },
  data: function () {
    return {
      serverSideHandledTargetTypes: [
        'network'
      ],
      targetTypes: {
        organization: 'organization',
        network: 'network',
        network_base: 'network_base',
        configTemplate: 'config_template',
        tag: 'tag'
      },
      targetTypeOptions: ['network', 'config_template', 'tag'].map(item => {
        return {
          key: item,
          name: this.$t(`v2.merakiCommon.targetTypes.${item}`)
        }
      }),
      targetType: 'network',
      targetOptions: [],
      loading: false,
      search: null,
      ordering: null,
      selectionTableActions: [
        {
          icon: '$vuetify.icons.delete',
          type: 'remove'
        }
      ],
      // Query parameters to handle pagination, currently only used if `targetType` is 'network'
      targetApiPaginationQueryParams: {
        paginate: true, // Set to true by default because targetType by default is set to 'network'
        page: 1,
        pageSize: 60,
        totalCount: 0
      }
    }
  },
  mounted () {
    this.fetchTargetOptions()
  },
  computed: {
    ...mapGetters('workspace', ['manageableOrganizations']),
    filteredTargetOptions () {
      // Only handle search on frontend for target types that are do not use server-side pagination
      if (this.search && !this.serverSideHandledTargetTypes.includes(this.targetType)) {
        const searchLowerCased = this.search.toLowerCase()
        return this.targetOptions.filter(
          option => option.name.toLowerCase().indexOf(searchLowerCased) > -1 ||
            option.organization_name.toLowerCase().indexOf(searchLowerCased) > -1
        )
      }
      return this.targetOptions
    },
    parentManageableOrganizationIds () {
      // List of corresponding manageable organization ids for organization Meraki id selections present in
      // parentOrganizations list
      return this.manageableOrganizations
        .filter(organization => this.parentOrganizations.indexOf(organization.meraki_id) > -1)
        .map(organization => organization.id)
    },
    headers () {
      return [
        {
          text: this.$t(`v2.merakiCommon.targetTypes.${this.targetType}`),
          value: 'name'
        },
        {
          text: this.$t('general.organization'),
          value: 'organization_name'
        }
      ]
    },
    selectionHeaders () {
      return [
        {
          text: this.$t('wifi.type'),
          value: 'target_type',
          formatter: (value, item) => {
            const effectiveTargetType = item.network_type ? item.network_type : value
            return this.$t(`v2.merakiCommon.targetTypes.${effectiveTargetType}`)
          }
        },
        {
          text: this.$t('general.name'),
          value: 'name'
        },
        {
          text: this.$t('general.organization'),
          value: 'meraki_organization.name'
        }
      ]
    },
    selectedTableItems () {
      // An entity is included in value, or its parent organization is included in value
      const selectedTargetIdentifiers = this.value.filter(selectedTarget => selectedTarget.target_type === this.effectiveTargetType).map(selectedTarget => this.getTargetIdentifier(selectedTarget))
      const selectedOrganizationTargetIdentifiers = this.value.filter(selectedTarget => selectedTarget.target_type === this.targetTypes.organization).map(selectedTarget => this.getTargetIdentifier(selectedTarget))

      return this.targetOptions.filter(target => {
        return selectedTargetIdentifiers.indexOf(target.identifier) > -1 ||
          selectedOrganizationTargetIdentifiers.indexOf(target.organization_meraki_id) > -1
      })
    },
    effectiveTargetType () {
      return (this.targetType === this.targetTypes.network || this.targetType === this.targetTypes.configTemplate)
        ? this.targetTypes.network_base
        : this.targetType
    }
  },
  watch: {
    targetType () {
      // Clear items and fetch new target type
      this.targetOptions = []

      // Use pagination for network API requests
      this.resetPaginationParams(this.targetType)

      this.fetchTargetOptions()
    },
    search () {
      // Only do server-side search for the target types (e.g. networks) that handle pagination on the backend
      if (this.serverSideHandledTargetTypes.includes(this.targetType)) {
        this.targetOptions = []
        this.resetPaginationParams(this.targetType)
        this.fetchTargetOptions()
      }
    }
  },
  methods: {
    ...mapActions('workspace/network', ['getMerakiExternalEntities']),
    fetchTargetOptions () {
      let filters = {
        api_key_organizations: this.parentManageableOrganizationIds,
        target_types: [this.targetType],
        paginate: false,
        search_term: this.search
      }

      if (this.targetApiPaginationQueryParams.paginate) {
        const { pageSize, page } = this.targetApiPaginationQueryParams
        filters = {
          ...filters,
          paginate: true,
          page_size: pageSize,
          page
        }
      }

      this.loading = true
      this.getMerakiExternalEntities({ workspaceId: this.workspaceId, ...filters }).then(response => {
        if (response.data.data.hasOwnProperty(this.targetType)) {
          // Results returned directly.
          let results = response.data.data[this.targetType]

          // If pagination is used then response has a different structure
          if (this.targetApiPaginationQueryParams.paginate) {
            this.targetApiPaginationQueryParams.page++
            this.targetApiPaginationQueryParams.totalCount = results.count
            results = results.results
          }

          this.targetOptions = this.targetOptions.concat(results.map(option => {
            // As tags don't have Meraki ids, we'll use their names as identifiers
            return {
              ...option,
              identifier: this.targetType === this.targetTypes.tag ? option.name : option.meraki_id
            }
          }))
        } else {
          // A job returned, data needs to be fetched from Meraki. Wait for job completion and call this method again
          this.waitTargetFetchJob(response.data.data.id)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    waitTargetFetchJob (jobId) {
      this.$refs.jobTrackingModal.open(
        jobId,
        this.$t('v2.access.fetchingTargetsFromMeraki'),
        this.$t('v2.access.fetchingTargetsFromMerakiDescription')
      ).then(success => {
        if (success) {
          // Re-try to fetch targets
          this.fetchTargetOptions()
        }
      })
    },
    getTargetOptionSelectionValue (option) {
      const selectionValue = {
        name: option.name,
        meraki_organization: {
          meraki_id: option.organization_meraki_id,
          name: option.organization_name
        },
        target_type: this.effectiveTargetType
      }

      if (option.meraki_id) {
        selectionValue.meraki_id = option.meraki_id
      }

      if (this.effectiveTargetType === this.targetTypes.tag) {
        selectionValue.organization_meraki_id = option.organization_meraki_id
      }

      // If network base target, add network type
      if (this.effectiveTargetType === this.targetTypes.network_base) {
        selectionValue.network_type = this.targetType
      }

      return selectionValue
    },
    onRowSelect (selectedRows) {
      this.$emit('input', [
        ...this.value,
        ...selectedRows.map(option => {
          return this.getTargetOptionSelectionValue(option)
        })
      ])
    },
    onRowDeselect (deselectedRows) {
      this.$emit('input', this.value.filter(selectedTarget => {
        // Filter out de-selected rows themselves, and organization-level selections of de-selected rows
        return !(
          (selectedTarget.target_type === this.effectiveTargetType && deselectedRows.map(row => row.identifier).indexOf(this.getTargetIdentifier(selectedTarget)) > -1) ||
          (selectedTarget.target_type === this.targetTypes.organization && deselectedRows.map(row => row.organization_meraki_id).indexOf(this.getTargetIdentifier(selectedTarget)) > -1)
        )
      }))
    },
    onSelectionTableActionClick (action, item) {
      if (action === 'remove') {
        this.$emit('input', this.value.filter(
          selectedTarget => item.target_type === this.targetTypes.organization
            ? selectedTarget.meraki_organization.meraki_id !== item.meraki_id
            : selectedTarget !== item)
        )
      }
    },
    getTargetIdentifier (target) {
      // For tags, we'll use name as identifier, for other target types, we'll use Meraki ids
      return target.target_type === this.targetTypes.tag ? target.name : target.meraki_id
    },
    onScrollEnd () {
      if (!this.targetApiPaginationQueryParams.paginate || this.loading ||
        this.targetOptions.length === this.targetApiPaginationQueryParams.totalCount) {
        return
      }

      this.fetchTargetOptions()
    },
    resetPaginationParams (targetType) {
      const paginate = this.serverSideHandledTargetTypes.includes(targetType)
      this.targetApiPaginationQueryParams = {
        paginate,
        page: 1,
        pageSize: 60,
        totalCount: 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.scope-selection {

  &__options {
    border: 1px solid $gray-light;

    &__header {
      height: 40px;
      overflow: hidden;

      &__query-field-selection {
        width: 150px;
        display: inline-block;
      }

      &__search-input {
        width: calc(100% - 150px);
        display: inline-block;
      }

      .base-text-input ::v-deep {
        input {
          height: 40px;
          color: $text-dark;
          border: none;
          padding: 9px 54px 9px 35px;
          border-radius: 0;

          &:focus {
            border-color: $green-light;
          }
        }

        .v-icon {
          opacity: 1;
          right: auto;
          left: 8px !important;
          color: $text-medium;
        }

        .search-input__clear-icon {
          display: none;
        }
      }

      .base-select ::v-deep {
        .select-container {
          border-radius: 0;
          border-top-width: 0;
          border-left-width: 0;
          border-bottom-width: 0;
          border-color: $gray-light;
        }

        .options {
          border-color: $gray-light;
        }
      }
    }

    &__option {
      height: 40px;
      line-height: 40px;
      border-bottom: 2px solid $gray-xlight;
      padding: 0 13px;

      .base-check-box {
        line-height: normal;
        margin-top: 10px;
      }
    }

    &__list {
      position: relative;

      .base-table {
        height: 100%;
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
  }

  &__selections {
    border: 1px solid $gray-light;

    &__header {
      height: 40px;
      padding: 0 10px;
      overflow: hidden;

      &__title {
        float: left;
        line-height: 40px;
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        color: $text-medium;
      }

      &__action {
        float: right;
        line-height: 40px;
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 15px;
        text-decoration-line: underline;
        color: $blue-reserve;
        cursor: pointer;
      }
    }

    &__selection {
      height: 40px;
      line-height: 40px;
      border-bottom: 2px solid $gray-xlight;
      padding: 0 13px 0 40px;
    }
  }
}

@media only screen and (min-width: 1264px) {
  .scope-selection {
    height: 100%;

    &__row, &__column {
      height: 100%;
    }

    &__options {
      height: 100%;

      &__list {
        height: calc(100% - 40px);
        overflow: hidden;
      }
    }

    &__selections {
      height: 100%;
      margin-left: 30px;

      &__list {
        height: calc(100% - 40px);
        overflow: hidden;
      }
    }
  }
}

@media only screen and (max-width: 1263px) {
  .scope-selection {
    &__selections {
      margin-top: 30px;
    }
  }
}

</style>
