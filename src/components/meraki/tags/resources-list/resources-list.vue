<template lang='pug'>
  .resources-list
    resources-header(
      @changeFilter='onBaseFilterChange'
      @addTags='onAddTags'
      @removeTags='onRemoveTags'
      :selectedResources='selectedResources'
    )
    .resources-list__body-container
      resources-body(
        :resources='resources'
        :resources-count='resourcesCount'
        :showFullResourcesHeader='showFullResourcesHeader'
        :filterUntagged='filterUntagged'
        @untaggedFilterChange='onUntaggedFilterChange'
        @sortOrderChange='onSortOrderChange'
        @loadMore='onLoadMoreResources'
        @rowSelectionChange="onRowSelectionChange"
        @totalSelectionChange="onTotalSelectionChange"
      )
    .resources-list__loading-indicator(v-if='loading')
      v-progress-circular(:size='50', indeterminate, color='#15ac2f')
</template>

<script>
import _ from 'lodash'
import ResourcesHeader from './resources-header/resources-header'
import ResourcesBody from './resources-body/resources-body'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  props: {
    resourcesData: {
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
    selectedWorkspaceOrganization: {
      default: null
    }
  },
  components: {
    ResourcesHeader,
    ResourcesBody
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  data () {
    return {
      resources: [],
      loading: false,
      pageSize: 20,
      taggableResourcesPage: 1,
      baseFilter: {},
      filterUntagged: false,
      sortBy: 'type',
      isTotalResourcesSelected: false,
      selectedResources: []
    }
  },
  watch: {
    resourcesData: function (newVal, oldVal) {
      this.initResourcesList()
    },
    selectedWorkspaceOrganization: function () {
      this.taggableResourcesPage = 1
      this.fetchTaggableResources()
    }
  },
  mounted () {
    this.initResourcesList()
  },
  computed: {
    filters () {
      const filters = {
        workspaceId: this.workspaceId,
        ...this.baseFilter,
        ordering: this.sortBy
      }

      if (this.filterUntagged === true) {
        filters.tagged = false
      }

      // If organization filter is selected, add it to filters
      if (this.selectedWorkspaceOrganization) {
        filters.organization = this.selectedWorkspaceOrganization
      }

      return filters
    }
  },
  methods: {
    initResourcesList () {
      this.resources = _.cloneDeep(this.resourcesData).map(item => {
        this.$set(item, 'selected', false)
        return item
      })
    },
    onLoadMoreResources () {
      if (this.resources.length < this.resourcesCount) {
        this.taggableResourcesPage = parseInt(this.resources.length / this.pageSize) + 1
        this.fetchTaggableResources()
      }
      this.taggableResourcesPage += 1
    },
    onBaseFilterChange (baseFilter) {
      this.taggableResourcesPage = 1
      this.baseFilter = baseFilter
      this.fetchTaggableResources()
    },
    onUntaggedFilterChange (value) {
      this.taggableResourcesPage = 1
      this.filterUntagged = value
      this.fetchTaggableResources()
    },
    onSortOrderChange (sortBy) {
      this.taggableResourcesPage = 1
      this.sortBy = sortBy
      this.fetchTaggableResources()
    },
    fetchTaggableResources () {
      const filters = { ...this.filters }

      // Add pagination filters
      filters.page_size = this.pageSize
      filters.page = this.taggableResourcesPage

      this.loading = true
      this.$store.dispatch('workspace/network/fetchTaggableResources', filters).finally(() => {
        this.loading = false
      })
    },
    onRowSelectionChange (selectedRows) {
      this.selectedResources = selectedRows
    },
    onTotalSelectionChange (isTotalSelected) {
      this.isTotalResourcesSelected = isTotalSelected
    },
    onAddTags (tags) {
      if (this.isTotalResourcesSelected) {
        // Fetch all resource ids and perform the operation on them
        const filters = { ...this.filters }
        filters.page = 1
        filters.page_size = 0
        this.$store.dispatch('workspace/network/fetchTaggableResourceIds', filters).then(response => {
          this.doAddTags(response.data.data, tags)
        })
      } else {
        this.doAddTags(this.selectedResources.map(item => item.taggable_entity_id), tags)
      }
    },
    doAddTags (entityIds, tags) {
      this.loading = true
      const params = {
        workspaceId: this.workspaceId,
        entities: entityIds,
        tags: tags.map(item => item.name)
      }
      this.$store.dispatch('workspace/network/addTagsToTaggableResources', params).finally(() => {
        this.loading = false
      })

      EventTracker.sendEvent(EVENT_NAMES.MERAKI_RESOURCE_TAGGED)
    },
    onRemoveTags (tags) {
      if (this.isTotalResourcesSelected) {
        // Fetch all resource ids and perform the operation on them
        const filters = { ...this.filters }
        filters.page = 1
        filters.page_size = 0
        this.$store.dispatch('workspace/network/fetchTaggableResourceIds', filters).then(response => {
          this.doRemoveTags(response.data.data, tags)
        })
      } else {
        this.doRemoveTags(this.selectedResources.map(item => item.taggable_entity_id), tags)
      }
    },
    doRemoveTags (entityIds, tags) {
      this.loading = true
      const params = {
        workspaceId: this.workspaceId,
        entities: entityIds,
        tags: tags.map(item => item.name)
      }
      this.$store.dispatch('workspace/network/removeTagsFromTaggableResources', params).finally(() => {
        this.loading = false
      })

      EventTracker.sendEvent(EVENT_NAMES.MERAKI_RESOURCE_UNTAGGED)
    }
  }
}
</script>

<style src="./resources-list.scss" lang="scss" scoped></style>
