<template lang='pug'>
  .tags-list
    tags-list-header(
      :selectedTags='selectedTags'
      :downloading="downloading"
      @changeFilter='onTagsFilterChange'
      @deleteTags='deleteTags'
      @downloadTags='downloadTags'
      @replaceTags='onReplaceTags'
    )
    v-layout.tags-list__body(row, wrap)
      v-flex(:class="['tags-list__body__main', activeTag == -1? '': 'xs4']")
        .tags-list__body__main__table
          base-table(
            :items='tags'
            :headers='headers'
            :actions='tagsActions'
            :is-external-sort="true"
            :with-separator="true"
            :total-items="tagsCount"
            :multi-selectable="true"
            :total-selectable="true"
            :is-total-selected="isTotalTagsSelected"
            @itemInput='onItemInput'
            @itemAction="onItemAction"
            @rowSelect='onRowSelect'
            @actionClick='onActionClick'
            @sortOrderChange='onSortOrderChangeForTagsList'
            @loadMore='onLoadMoreTags'
            @rowSelectionChange="onRowSelectionChange"
            @totalSelectionChange="onTotalSelectionChange"
          )
        .tags-list__body__main__loading-indicator(v-if='loading')
          v-progress-circular(:size='50', indeterminate, color='#15ac2f')
      v-flex.taggable-resources-for-atag(v-if='activeTag != -1', xs8)
        tag-resources-header(
          :tagName='activeTagName'
          @close='onClickResourcesCloseAction'
          @renameTag='onRenameTag'
        )
        .taggable-resources-for-atag__body
          resources-body(
            :resources='taggableResourcesForATag'
            :showFullResourcesHeader='false'
            @sortOrderChange='onSortOrderChangeForResourcesList'
            :activeTag='activeTag'
            @loadMore='onLoadMoreResourcesForATag'
          )
        .taggable-resources-for-atag__loading-indicator(v-if='loadingResourcesForATag')
          v-progress-circular(:size='50', indeterminate, color='#15ac2f')
    delete-tag-confirm-dialog(
      :show='showDeleteTagConfirmDialog'
      @close='onCloseDeleteTagConfirmDialog'
      @confirm='onDeleteTagConfirm'
    )

</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import BaseTable from '../../../v2/base-table/base-table'
import ListNameCell from '../column-components/list-name-cell'
import TagsListSimilarTags from '../column-components/similar-tags/similar-tags'
import DeleteTagConfirmDialog from '../column-components/delete-tag-dialog/delete-tag'
import TagsListHeader from './tags-header/tags-header'
import TagResourcesHeader from '../resources-list/tag-resources-header/tag-resources-header'
import ResourcesBody from '../resources-list/resources-body/resources-body'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

import { isValidUsedCount } from '@/utils/meraki-validations'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  props: {
    tagsData: {
      type: Array,
      required: true
    },
    tagsCount: {
      type: Number,
      required: true
    },
    selectedWorkspaceOrganization: {
      default: null
    }
  },
  components: {
    BaseTable,
    ResourcesBody,
    TagResourcesHeader,
    TagsListHeader,
    DeleteTagConfirmDialog
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  data () {
    return {
      search: null,
      searchNetworks: false,
      searchDevices: false,
      searchSwitchPorts: false,
      loading: false,
      downloading: false,
      pageSize: 20,
      tagSortBy: 'name',
      isTotalTagsSelected: false,
      tagPage: 1,
      tagFilter: {},
      tags: [],
      selectedTags: [],
      loadingResourcesForATag: false,
      taggableResourceSortBy: 'type',
      taggableResourcesForATag: [],
      taggableResourcesForATagPage: 1,
      taggableResourcesForATagCount: 0,
      activeTag: -1,
      activeTagName: '',
      showDeleteTagConfirmDialog: false,
      deletingTags: [],
      tagsActions: [
        { type: 'edit', icon: '$vuetify.icons.edit' },
        { type: 'delete', icon: '$vuetify.icons.delete' }
      ]
    }
  },
  computed: {
    ...mapGetters('workspace/network', ['merakiTaggableResourcesForATag']),
    headers () {
      const nameField = {
        text: this.$t('tags.tableHeaderTag'),
        value: 'name',
        cellComponent: ListNameCell
      }

      const useCountField = {
        text: this.$t('tags.tableHeaderUsed'),
        value: 'use_count',
        validations: {
          required: true,
          method: isValidUsedCount
        }
      }

      const similarTagsField = {
        text: this.$t('tags.tableHeaderSimilarTags'),
        value: 'similar_tags',
        selectable: false,
        cellComponent: TagsListSimilarTags
      }

      let tagHeaders
      if (this.activeTag === -1) {
        tagHeaders = [
          nameField,
          useCountField,
          similarTagsField
        ]
      } else {
        tagHeaders = [
          nameField,
          useCountField
        ]
      }

      // Add organization column
      tagHeaders.splice(1, 0, {
        text: this.$t('v2.organization.settings.merakiOrganization'),
        value: 'organization.name',
        width: '180px',
        sortKey: 'organization__name',
        selectable: false
      })

      return tagHeaders
    },
    filters () {
      const filters = {
        workspaceId: this.workspaceId,
        ...this.tagFilter,
        ordering: this.tagSortBy
      }

      // If organization filter is selected, add it to filters
      if (this.selectedWorkspaceOrganization) {
        filters.organization = this.selectedWorkspaceOrganization
      }

      return filters
    }
  },
  watch: {
    tagsData: function (newVal, oldVal) {
      this.initTagsList()
    },
    activeTag: function (newVal, oldVal) {
      this.taggableResourcesForATagPage = 1
      this.fetchTaggableResourcesForATag()
    },
    selectedWorkspaceOrganization: function () {
      this.tagPage = 1
      this.fetchTags()
    },
    merakiTaggableResourcesForATag: {
      handler: function () {
        this.$set(this, 'taggableResourcesForATag', _.cloneDeep(this.merakiTaggableResourcesForATag.data.results).map(item => {
          this.$set(item, 'selected', false)
          return item
        }))
        this.$set(this, 'taggableResourcesForATagCount', this.merakiTaggableResourcesForATag.data.count)
      },
      immediate: true,
      deep: true
    }
  },
  mounted () {
    this.initTagsList()
  },
  methods: {
    onReplaceTags (tags) {
      if (this.isTotalTagsSelected) {
        // Fetch all tag ids and perform the operation on them
        const filters = { ...this.filters }
        filters.page = 1
        filters.page_size = 0
        this.$store.dispatch('workspace/network/fetchTagIds', filters).then(response => {
          this.doReplaceTags(response.data.data, tags[0].name)
        })
      } else {
        this.doReplaceTags(this.selectedTags.map(tag => tag.id), tags[0].name)
      }
    },
    doReplaceTags (tagIds, targetTagName) {
      this.loading = true
      this.$store.dispatch('workspace/network/replaceTag', {
        workspaceId: this.workspaceId,
        tags: tagIds,
        target_tag_name: targetTagName
      }).finally(() => {
        this.loading = false
      })

      EventTracker.sendEvent(EVENT_NAMES.MERAKI_TAG_RENAMED)
    },
    onRenameTag (tags) {
      this.loading = true
      this.activeTagName = tags[0].name
      this.$store.dispatch('workspace/network/replaceTag', {
        workspaceId: this.workspaceId,
        tags: [this.activeTag],
        target_tag_name: tags[0].name
      }).finally(() => {
        this.loading = false
      })

      EventTracker.sendEvent(EVENT_NAMES.MERAKI_TAG_RENAMED)
    },
    downloadTags () {
      if (this.downloading) {
        return
      }

      let filters = {
        workspaceId: this.workspaceId,
        workspaceName: this.selectedWorkspace ? this.selectedWorkspace.name : ''
      }

      this.downloading = true
      this.$store.dispatch('workspace/network/downloadTags', filters).finally(() => {
        this.downloading = false
      })

      EventTracker.sendEvent(EVENT_NAMES.MERAKI_TAG_CSV_DOWNLOADED)
    },
    deleteTags () {
      if (this.isTotalTagsSelected) {
        // Fetch all tag ids and perform the operation on them
        const filters = { ...this.filters }
        filters.page = 1
        filters.page_size = 0
        this.$store.dispatch('workspace/network/fetchTagIds', filters).then(response => {
          this.deletingTags = response.data.data
          this.showDeleteTagConfirmDialog = true
        })
      } else {
        this.deletingTags = this.selectedTags.map(tag => tag.id)
        this.showDeleteTagConfirmDialog = true
      }
    },
    onRowSelect (item) {
      if (this.activeTag === item.id) {
        this.activeTag = -1
        this.activeTagName = ''
      } else {
        this.activeTag = item.id
        this.activeTagName = item.name
      }
    },
    onItemInput (item, field, value) {
      this.$set(item, field, value)
    },
    onItemAction (item, field, value) {
      if (value && value.type === 'nameClick') {
        // Select / De-select tag
        this.onRowSelect(item)
      }
    },
    initTagsList () {
      this.tags = _.cloneDeep(this.tagsData).map(item => {
        this.$set(item, 'selected', false)
        this.$set(item, 'use_count', item.use_count ? item.use_count.toString() : 0)
        return item
      })
      if (this.activeTagName !== '') {
        // this is useful when renamed tag
        const fnt = this.tags.find(tag => tag.name === this.activeTagName)
        if (fnt) {
          this.activeTag = fnt.id
        } else {
          this.activeTagName = ''
          this.activeTag = -1
        }
      }
    },
    onActionClick (actionType, item) {
      if (actionType === 'delete') {
        this.showDeleteTagConfirmDialog = true
        this.deletingTags = [item.id]
      } else if (actionType === 'edit') {
        this.onRowSelect(item)
      }
    },
    onClickResourcesCloseAction () {
      this.activeTag = -1
      this.activeTagName = ''
    },
    onLoadMoreResourcesForATag () {
      if (this.taggableResourcesForATag.length < this.taggableResourcesForATagCount) {
        this.taggableResourcesForATagPage = parseInt(this.taggableResourcesForATag.length / this.pageSize) + 1
        this.fetchTaggableResourcesForATag()
      }
    },
    onSortOrderChangeForResourcesList (sortBy) {
      this.taggableResourcesForATagPage = 1
      this.taggableResourceSortBy = sortBy
      this.fetchTaggableResourcesForATag()
    },
    fetchTaggableResourcesForATag () {
      let filters = {
        workspaceId: this.workspaceId,
        ordering: this.taggableResourceSortBy,
        tag: this.activeTag,
        page_size: this.pageSize,
        page: this.taggableResourcesForATagPage
      }

      this.loadingResourcesForATag = true
      this.$store.dispatch('workspace/network/fetchTaggableResourcesForATag', filters).finally(() => {
        this.loadingResourcesForATag = false
      })
    },
    onLoadMoreTags () {
      if (this.tags.length < this.tagsCount) {
        this.tagPage = parseInt(this.tags.length / this.pageSize) + 1
        this.fetchTags()
      }
    },
    onSortOrderChangeForTagsList (sortBy) {
      this.tagPage = 1
      this.tagSortBy = sortBy
      this.fetchTags()
    },

    onTagsFilterChange (filter) {
      this.tagPage = 1
      this.tagFilter = filter
      this.fetchTags()
    },

    onRowSelectionChange (selectedRows) {
      this.selectedTags = selectedRows
    },
    onTotalSelectionChange (isTotalSelected) {
      this.isTotalTagsSelected = isTotalSelected
    },

    fetchTags () {
      const filters = { ...this.filters }

      // Add pagination filters
      filters.page_size = this.pageSize
      filters.page = this.tagPage

      this.loading = true
      this.$store.dispatch('workspace/network/fetchTags', filters).finally(() => {
        this.loading = false
      })
    },
    onCloseDeleteTagConfirmDialog () {
      this.showDeleteTagConfirmDialog = false
    },
    onDeleteTagConfirm () {
      this.showDeleteTagConfirmDialog = false
      this.loading = true
      this.$store.dispatch('workspace/network/removeTag', {
        workspaceId: this.workspaceId,
        tags: this.deletingTags
      }).finally(() => {
        this.loading = false
      })

      EventTracker.sendEvent(EVENT_NAMES.MERAKI_TAG_DELETED)
    }
  }
}
</script>

<style src="./tags-list.scss" lang="scss" scoped></style>
