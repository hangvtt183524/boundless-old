<template lang='pug'>
  .tags-dashboard
    v-layout(row, wrap)
      v-flex(xs12, lg12)
        .tags-dashboard__header
          base-tab-header(
            :class="['tab-header--underlined', 'tab-header--blue', {'tab-header--active': selectedViewMode === viewModes.manageTags}]"
            @click='onTabHeaderClick(viewModes.manageTags)'
          )
            | {{ $t('tags.tagsTab') }} ({{ tagsCount }})
          base-tab-header(
            :class="['tab-header--underlined', 'tab-header--blue', {'tab-header--active': selectedViewMode === viewModes.manageResources}]"
            @click='onTabHeaderClick(viewModes.manageResources)'
          )
            | {{ $t('tags.resourcesTab') }} ({{ taggableResourcesCount }})

          base-select.tags-dashboard__header__organization-select(
            v-model="selectedWorkspaceOrganization"
            :items="workspaceOrganizationOptions"
            :placeholder="$t('general.workspace')"
          )

    tags-list(
      v-if='selectedViewMode === viewModes.manageTags'
      :tagsData='tags'
      :tagsCount='tagsCount'
      :selected-workspace-organization="selectedWorkspaceOrganization"
    )
    resources-list(
      v-if='selectedViewMode === viewModes.manageResources'
      :resourcesData='taggableResources'
      :resourcesCount='taggableResourcesCount'
      :showFullResourcesHeader='true'
      :selected-workspace-organization="selectedWorkspaceOrganization"
    )

</template>

<script>
import BaseTabHeader from '../../../v2/base-tab-header/base-tab-header'
import BaseSelect from '@/components/v2/base-select/base-select'
import TagsList from '../tags-list/tags-list'
import ResourcesList from '../resources-list/resources-list'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import EmptyOrganizationListCheckMixin from '@/mixins/empty-organization-list-check.mixin'
import { mapGetters } from 'vuex'

export default {
  name: 'tags',
  components: {
    BaseTabHeader,
    BaseSelect,
    TagsList,
    ResourcesList
  },
  mixins: [
    CurrentNodeSelectionsMixin,
    EmptyOrganizationListCheckMixin
  ],
  data () {
    return {
      pageSize: 20,
      tags: [],
      selectedWorkspaceOrganization: null,
      taggableResources: [],
      viewModes: {
        manageTags: 'manageTags',
        manageResources: 'manageResources'
      },
      selectedViewMode: null
    }
  },
  computed: {
    ...mapGetters('workspace/network', ['merakiTags', 'merakiTaggableResources']),
    ...mapGetters('layout', ['userWorkspaceOrganizations']),
    workspaceOrganizationOptions () {
      // Valid options are those with Meraki integration set up.
      return [{
        key: null,
        name: this.$t('tags.allOrganizations')
      }].concat(this.userWorkspaceOrganizations.filter(workspaceOrganization => {
        return !!workspaceOrganization.meraki_organization
      }).map(workspaceOrganization => {
        return {
          key: workspaceOrganization.id,
          name: workspaceOrganization.name
        }
      }))
    },
    tagsCount () {
      return this.merakiTags && this.merakiTags.data ? this.merakiTags.data.count : 0
    },
    taggableResourcesCount () {
      return this.merakiTaggableResources && this.merakiTaggableResources.data ? this.merakiTaggableResources.data.count : 0
    }
  },
  watch: {
    merakiTags: {
      handler: function () {
        this.$set(this, 'tags', this.merakiTags.data.results)
      },
      immediate: true,
      deep: true
    },
    merakiTaggableResources: {
      handler: function () {
        this.$set(this, 'taggableResources', this.merakiTaggableResources.data.results)
      },
      immediate: true,
      deep: true
    },
    selectedWorkspaceOrganization: function () {
      // On organization filter change, fetch data for non-visible tab so that its count refreshes with corrent value
      if (this.selectedViewMode === this.viewModes.manageTags) {
        this.fetchTaggableResources()
      } else {
        this.fetchTags()
      }
    }
  },
  mounted () {
    this.fetchTags()
    this.fetchTaggableResources()

    this.setDefaultSelectedTab()
  },
  methods: {
    onTabHeaderClick: function (tabKey) {
      this.selectedViewMode = tabKey
      switch (tabKey) {
        case this.viewModes.manageTags:
          this.$router.push({ name: 'Tags' })
          break
        case this.viewModes.manageResources:
          this.$router.push({ name: 'TagsResources' })
          break
      }
    },
    setDefaultSelectedTab () {
      // Get default selected tab depending on current path
      switch (this.$router.currentRoute.name) {
        case 'TagsResources':
          this.selectedViewMode = this.viewModes.manageResources
          break
        default:
          this.selectedViewMode = this.viewModes.manageTags
      }
    },
    fetchTags () {
      let filters = {
        workspaceId: this.workspaceId,
        search: this.search,
        ordering: 'name',
        page_size: this.pageSize,
        page: 1
      }

      // If organization filter is selected, add it to filters
      if (this.selectedWorkspaceOrganization) {
        filters.organization = this.selectedWorkspaceOrganization
      }

      this.$store.dispatch('workspace/network/fetchTags', filters).finally(() => {
      })
    },
    fetchTaggableResources () {
      let filters = {
        workspaceId: this.workspaceId,
        search: this.search,
        ordering: 'name',
        page_size: this.pageSize,
        page: 1
      }

      // If organization filter is selected, add it to filters
      if (this.selectedWorkspaceOrganization) {
        filters.organization = this.selectedWorkspaceOrganization
      }

      this.$store.dispatch('workspace/network/fetchTaggableResources', filters)
    }
  }
}
</script>

<style src="./tags-dashboard.scss" lang="scss" scoped></style>
