<template lang="pug">
  .deployment-target-entity-selection(
    :class="[{'deployment-target-entity-selection--has-query-fields': queryFields && queryFields.length > 0}]"
  )
    v-layout.deployment-target-entity-selection__row(row wrap)
      v-flex.deployment-target-entity-selection__column(
        v-if="!isFixed"
        xs12 lg6
      )
        .deployment-target-entity-selection__options
          .deployment-target-entity-selection__options__header
            base-select.deployment-target-entity-selection__options__header__query-field-selection(
              v-if="queryFields && queryFields.length > 0"
              v-model="queryField"
              :items="queryFieldOptions"
            )

            search-input.deployment-target-entity-selection__options__header__search-input(
              v-model="search"
              :placeholder="$t('general.search')"
            )

          .deployment-target-entity-selection__options__list
            base-table(
              :items="targetOptions"
              :headers="headers"
              :sortable="false"
              :multi-selectable="true"
              :total-selectable="isTotalSelectable"
              :is-total-selected="isTotalSelected"
              :selectedRows="selectedTableItems"
              :total-items="total"
              select-on-row-click
              @rowSelect="onRowSelect"
              @rowDeselect="onRowDeselect"
              @loadMore="onOptionsScrollEnd"
              @totalSelectionChange="onTotalSelectionChange"
              key="options"
            )

            .deployment-target-entity-selection__options__list__loading-indicator(
              v-if="loading"
            )
              v-progress-circular(
                :size="50"
                indeterminate
                color="#15ac2f"
              )

      v-flex.deployment-target-entity-selection__column(
        xs12
        :class="[{'lg6': !isFixed}]"
      )
        .deployment-target-entity-selection__selections
          .deployment-target-entity-selection__selections__header
            .deployment-target-entity-selection__selections__header__title
              | {{ $t('general.selections') }}

            .deployment-target-entity-selection__selections__header__action(
              v-if="!isFixed && targetCreationEnabled && targetType === targetTypes.networkBase"
              @click="onAddNewNetworksClick"
            )
              | {{ $t('v2.merakiCommon.createNewNetworks') }}

          .deployment-target-entity-selection__selections__list
            base-table(
              :items="value"
              :headers="selectionHeaders"
              :sortable="true"
              :actions="!isFixed ? selectionTableActions : []"
              @actionClick="onSelectionTableActionClick"
              key="selections"
            )

    deployment-target-new-networks-modal(
      v-if="targetCreationEnabled && targetType === targetTypes.networkBase"
      :organization-choices="newNetworksOrganizationChoices"
      ref="newNetworksModal"
    )

</template>

<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import BaseTable from '@/components/v2/base-table/base-table'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input.vue'
import SearchInput from '@/components/v2/search-input/search-input.vue'
import BaseSelect from '@/components/v2/base-select/base-select'
import DeploymentTargetNewNetworksModal from './deployment-target-new-networks-modal'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
export default {
  name: 'deployment-target-entity-selection',
  components: {
    DeploymentTargetNewNetworksModal,
    BaseTable,
    BaseTextInput,
    SearchInput,
    BaseSelect
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  props: {
    value: {
      type: Array,
      required: true
    },
    targetType: {
      type: String,
      required: true
    },
    filterOrganizations: {
      type: Array,
      default: () => []
    },
    targetCreationEnabled: {
      type: Boolean,
      default: false
    },
    queryFields: {
      type: Array,
      required: false
    },
    isFixed: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      targetTypes: {
        organization: 'organization',
        networkBase: 'network_base', // Both network and config template
        tag: 'tag'
        // Will be added as needed
        // network: 'network',
        // device: 'device'
      },
      networkNameFieldName: 'network_name',
      targetOptions: [],
      queryField: null,
      activeQueryField: null,
      loading: false,
      search: null,
      page: 1,
      pageSize: 50,
      total: 0,
      hasRecords: true,
      selectionTableActions: [
        {
          icon: '$vuetify.icons.delete',
          type: 'remove'
        }
      ]
    }
  },
  mounted () {
    if (!this.isFixed) {
      this.fetchTargetOptions()
    }
    // Select first query field by default, if query fields provided
    if (this.queryFields && this.queryFields.length > 0) {
      this.queryField = this.queryFields[0]
    }
  },
  computed: {
    ...mapGetters('layout', ['userWorkspaceOrganizations']),
    queryFieldOptions () {
      return this.queryFields.map(field => {
        return {
          key: field,
          name: this.$t(`v2.merakiCommon.targetTypes.${field}`)
        }
      })
    },
    headers () {
      const headers = [
        {
          text: this.$t('general.name'),
          value: 'name'
        }
      ]
      if (this.targetType !== this.targetTypes.organization) {
        headers.splice(headers.length, 0, {
          text: this.$t('general.organization'),
          value: 'organization_name'
        })
      }
      if (this.targetType !== this.targetTypes.organization && this.targetType !== this.targetTypes.tag) {
        headers.splice(headers.length, 0, {
          text: this.$t('general.tags'),
          value: 'tags',
          formatter: (value) => {
            const tagsString = value.join(', ')
            return tagsString.substring(0, 16) + (tagsString.length > 16 ? '...' : '')
          },
          tooltip: true,
          tooltipFormatter: (value) => {
            return value ? value.join('<br>') : ''
          }
        })
      }
      return headers
    },
    selectionHeaders () {
      const headers = [
        {
          text: this.$t('general.name'),
          value: 'name'
        }
      ]
      if (this.targetType !== this.targetTypes.organization) {
        headers.splice(headers.length, 0, {
          text: this.$t('general.organization'),
          value: 'organization_name',
          formatter: (value, target) => {
            // For organization targets, return an empty value. Otherwise return organization name of the input
            if (this.targetTypes.organization in target && value === target.name) {
              return ''
            }
            return value
          }
        })
      }
      return headers
    },
    selectedTableItems () {
      return this.isTotalSelected ? [...this.targetOptions] : this.targetOptions.filter(target => {
        return this.value.map(selectedTarget => selectedTarget[this.targetType]).indexOf(target.id) > -1 ||
          this.value.filter(
            selectedTarget => !this.isDetailEntitySelection(selectedTarget)
          ).map(selectedTarget => selectedTarget.organization).indexOf(target.organization_id) > -1
      })
    },
    filteredWorkspaceOrganizations () {
      return this.userWorkspaceOrganizations.filter(
        // Filter to meraki-setup organizations. If filter organizations provided, filter by them as well
        workspaceOrganization => !!workspaceOrganization.meraki_organization &&
          (this.filterOrganizations.length === 0 ||
            this.filterOrganizations.indexOf(workspaceOrganization.meraki_organization.id) > -1)
      )
    },
    newNetworksOrganizationChoices () {
      return this.filteredWorkspaceOrganizations.map(workspaceOrganization => workspaceOrganization.meraki_organization)
    },
    isTotalSelectable () {
      // Total not selectable if a search query is entered, or listing organizations (as all items loaded from local
      // data store in this case).
      return this.targetType !== this.targetTypes.organization && !this.search
    },
    totalSelectionValue () {
      return this.filteredWorkspaceOrganizations.map(workspaceOrganization => {
        const merakiOrganization = workspaceOrganization.meraki_organization
        return {
          organization: merakiOrganization.id,
          name: this.$t('v2.securityCompliance.allNetworks'),
          organization_name: merakiOrganization.name
        }
      })
    },
    isTotalSelected () {
      return _.differenceWith(this.totalSelectionValue, this.value, _.isEqual).length === 0
    }
  },
  watch: {
    userWorkspaceOrganizations (newValue, oldValue) {
      if ((_.isNil(oldValue) || _.isEmpty(oldValue)) && !(_.isNil(newValue) || _.isEmpty(newValue)) &&
        this.targetType === this.targetTypes.organization) {
        // If old values is nil / empty and new value is not (meaning workspace organizations are just loaded,
        // should happen on page refresh on this page), and active target type is organizations, re-calculate targets
        this.fetchTargetOptions()
      }
    },
    search () {
      // Reset page number and clear items
      this.page = 1
      this.targetOptions = []
      this.fetchTargetOptions()
    },
    queryField () {
      if (this.search) {
        // If a query is present and query field changes, re-fetch items
        this.fetchTargetOptions()
      }
    }
  },
  methods: {
    ...mapActions('workspace/network', ['getMerakiEntities']),
    fetchTargetOptions () {
      if (this.search && (this.queryField !== this.activeQueryField)) {
        // If we have a search query, and query field changed, reset page and target options
        this.page = 1
        this.targetOptions = []
      }
      if (this.targetType === this.targetTypes.organization) {
        // Use local workspace organization list for organizations
        this.fetchMerakiOrganizationTargets()
      } else {
        // Fetch from API for other target types
        this.fetchMerakiTargetEntities()
      }
    },
    fetchMerakiOrganizationTargets () {
      // Set all workspace organizations, or apply search filter if any
      let organizationTargets = this.filteredWorkspaceOrganizations.map(workspaceOrganization => {
        return {
          id: workspaceOrganization.meraki_organization.id,
          name: workspaceOrganization.meraki_organization.name,
          organization_id: workspaceOrganization.meraki_organization.id,
          organization_name: workspaceOrganization.meraki_organization.name
        }
      })
      // Apply search filter if any
      if (this.search) {
        organizationTargets = organizationTargets.filter(
          targetOption => targetOption.name.search(new RegExp(this.search, 'i')) > -1
        )
      }
      this.targetOptions = organizationTargets
      this.total = organizationTargets.length
      this.hasRecords = false
    },
    fetchMerakiTargetEntities () {
      const filters = {
        page_size: this.pageSize,
        page: this.page
      }
      if (this.search) {
        filters.query = this.search
        if (this.queryField && (this.queryField !== this.targetType)) {
          // If a query field other than current target type is selected, add it so that the api will query on selected
          // query field
          filters.query_field = this.queryField
        }
      }
      if (this.filterOrganizations.length > 0) {
        filters['organizations'] = this.filterOrganizations
      }
      this.loading = true
      this.getMerakiEntities({ workspaceId: this.workspaceId, entityType: this.targetType, ...filters }).then(response => {
        let items = response.data.data.results
        if (filters.page > 1) {
          // If fetching records for a new page, append new records to the existing ones
          items = this.targetOptions.concat(items)
        }
        this.targetOptions = items
        this.total = response.data.data.count
        this.hasRecords = response.data.data.results.length === this.pageSize
      }).finally(() => {
        this.loading = false
      })
    },
    getTargetOptionSelectionValue (option) {
      const selection = {
        name: option.name,
        organization: option.organization_id,
        organization_name: option.organization_name
      }
      if (this.targetType !== this.targetTypes.organization) {
        selection[this.targetType] = option.id
      }
      return selection
    },
    isDetailEntitySelection (selection) {
      const entityTargets = [
        ...(Object.values(this.targetTypes).filter(target => target !== this.targetTypes.organization)),
        this.networkNameFieldName
      ]
      for (let i = 0; i < entityTargets.length; i++) {
        if (entityTargets[i] in selection) {
          return true
        }
      }
      return false
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
      const currentSelections = this.isTotalSelected ? this.targetOptions.map(option => {
        return this.getTargetOptionSelectionValue(option)
      }) : this.value
      this.$emit('input', currentSelections.filter(selectedTarget => {
        // Filter out de-selected rows themselves, and organization-level selections of de-selected rows
        return deselectedRows.map(row => row.id).indexOf(selectedTarget[this.targetType]) === -1 &&
          !(!this.isDetailEntitySelection(selectedTarget) &&
            deselectedRows.map(row => row.organization_id).indexOf(selectedTarget.organization) > -1)
      }))
    },
    onTotalSelectionChange (isTotalSelected) {
      if (isTotalSelected) {
        this.$emit('input', this.totalSelectionValue)
      } else {
        if (this.isTotalSelected) {
          // If setting isTotalSelected to false from true, select all visible items
          this.$emit('input', this.targetOptions.map(option => {
            return this.getTargetOptionSelectionValue(option)
          }))
        }
      }
    },
    onSelectionTableActionClick (action, item) {
      if (action === 'remove') {
        this.$emit('input', this.value.filter(selectedTarget => selectedTarget !== item))
      }
    },
    onAddNewNetworksClick () {
      this.$refs.newNetworksModal.open().then(newTargets => {
        this.$emit('input', [
          ...this.value,
          ...newTargets
        ])
      })
    },
    onOptionsScrollEnd () {
      // Load next page, if exists
      if (!this.hasRecords) {
        return
      }
      // Increase page number
      this.page += 1
      // Fetch next page of items
      this.fetchTargetOptions()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";
.deployment-target-entity-selection {
  &__options {
    border: 1px solid $gray-light;
    &__header {
      height: 40px;
      overflow: hidden;
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
  &--has-query-fields {
    .deployment-target-entity-selection__options {
      &__header {
        &__query-field-selection {
          width: 150px;
          display: inline-block;
        }
        &__search-input {
          width: calc(100% - 150px);
          display: inline-block;
        }
      }
    }
  }
}
@media only screen and (min-width: 1264px) {
  .deployment-target-entity-selection {
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
  .deployment-target-entity-selection {
    &__selections {
      margin-top: 30px;
    }
  }
}
</style>
