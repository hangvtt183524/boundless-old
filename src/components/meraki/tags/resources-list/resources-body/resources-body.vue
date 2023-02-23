<template lang='pug'>
  .resources-list-body
    .resources-list-body__table
      base-table(
        :items='resources'
        :headers='headers'
        item-key='taggable_entity_id'
        :actions='resourcesActions'
        :is-external-sort="true"
        :with-separator="true"
        :total-items="resourcesCount"
        :multi-selectable="true"
        :total-selectable="true"
        :is-total-selected="isTotalResourcesSelected"
        @itemInput='onItemInput'
        @actionClick='onActionClick'
        @sortOrderChange='onSortOrderChange'
        @loadMore="$emit('loadMore')"
        @rowSelectionChange="onRowSelectionChange"
        @totalSelectionChange="onTotalSelectionChange"
        @headMoreInput="onHeadMoreInput"
      )
</template>

<script>
import BaseTable from '../../../../v2/base-table/base-table'
import UntaggedResourceFilter from '../../column-components/untagged-resource-filter'
import ResourceTagsList from '../../column-components/resource-tags-list/resource-tags-list'
import ListNameCell from '../../column-components/list-name-cell'

import { isValidUsedCount } from '@/utils/meraki-validations'

export default {
  props: {
    resources: {
      type: Array,
      required: true
    },
    resourcesCount: {
      type: Number,
      required: true
    },
    showFullResourcesHeader: {
      type: Boolean
    },
    filterUntagged: {
      type: Boolean
    },
    activeTag: {
      type: Number
    }
  },
  components: {
    BaseTable
  },
  data () {
    return {
      resourcesActions: [],
      isTotalResourcesSelected: false,
      selectedResources: []
    }
  },
  computed: {
    headers () {
      const typeField = {
        text: this.$t('tags.tableHeaderType'),
        value: 'type',
        translation: (val) => this.$t(`tags.resourceType.${val}`)
      }

      const nameField = {
        text: this.$t('tags.tableHeaderName'),
        value: 'name',
        cellComponent: ListNameCell,
        options: {
          noDecoration: true
        }
      }

      const tagsField = {
        text: this.$t('tags.tableHeaderTags'),
        value: 'tags',
        sortable: false,
        cellComponent: ResourceTagsList,
        options: {
          activeTag: this.activeTag
        }
      }

      const modelField = {
        text: this.$t('tags.tableHeaderModel'),
        value: 'model'
      }

      const networkField = {
        text: this.$t('tags.tableHeaderNetwork'),
        value: 'network'
      }

      let tagHeaders
      if (this.showFullResourcesHeader) {
        tagHeaders = [
          typeField,
          {
            ...nameField,
            validations: {
              required: true,
              method: isValidUsedCount
            }
          },
          networkField,
          modelField,
          {
            ...tagsField,
            headMore: {
              component: UntaggedResourceFilter,
              props: {
                value: this.filterUntagged
              }
            }
          }
        ]
      } else {
        tagHeaders = [typeField, nameField, networkField, tagsField]
      }

      // Add organization column
      tagHeaders.splice(2, 0, {
        text: this.$t('v2.organization.settings.merakiOrganization'),
        value: 'organization_name',
        width: '180px',
        selectable: false
      })

      return tagHeaders
    }
  },
  methods: {
    onSortOrderChange (sortBy) {
      this.$emit('sortOrderChange', sortBy)
    },
    onItemInput (item, field, value) {
      this.$set(item, field, value)
    },
    onActionClick (actionType, item) {
    },
    onRowSelectionChange (selectedRows) {
      this.selectedResources = selectedRows

      this.$emit('rowSelectionChange', selectedRows)
    },
    onTotalSelectionChange (isTotalSelected) {
      this.isTotalResourcesSelected = isTotalSelected

      this.$emit('totalSelectionChange', isTotalSelected)
    },
    onHeadMoreInput (header, value) {
      if (header.value === 'tags') {
        // Untagged filter value change
        this.$emit('untaggedFilterChange', value)
      }
    }
  }
}
</script>

<style src="./resources-body.scss" lang="scss" scoped></style>
