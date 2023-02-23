<template lang='pug'>
  v-layout(row, wrap)
    v-flex(xs12, lg12)
      .resources-list__header
        v-layout(row, wrap)
          v-flex(lg3 xl4)
            search-input.resources-list__header__search-input(
              v-model='search'
              @input='onChangeSearchText'
              :placeholder="$t('tags.resourceSearchPlaceholder')"
            )
              v-icon search
          v-flex.resources-list__header__search-options(lg9 xl8)
            tags-dashboard-filter(
              :objectTypes='object_types'
              @change='onChangeFilter'
            )
            .resources-list__header__actions
              add-tags-link.add-tags-link(
                :selectedResources='selectedResources'
                @addTags='onAddTags'
              )
              remove-tags-link.remove-tags-link(
                :selectedResources='selectedResources'
                @removeTags='onRemoveTags'
              )
</template>

<script>
import { mapGetters } from 'vuex'
import BaseTextInput from '../../../../v2/base-text-input/base-text-input'
import SearchInput from '../../../../v2/search-input/search-input'
import TagsDashboardFilter from '../../column-components/tags-dashboard-filter/tags-dashboard-filter'
import AddTagsLink from '../../column-components/add-tags-action/add-tags'
import RemoveTagsLink from '../../column-components/remove-tags-action/remove-tags'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  props: {
    selectedResources: {
      type: Array,
      required: true
    }
  },
  components: {
    BaseTextInput,
    SearchInput,
    TagsDashboardFilter,
    AddTagsLink,
    RemoveTagsLink
  },
  data () {
    return {
      search: null,
      object_types: []
    }
  },
  mounted () {
    this.search = this.merakiTaggableResourcesFilter.search
    this.object_types = this.merakiTaggableResourcesFilter.object_types
  },
  computed: {
    ...mapGetters('workspace/network', ['merakiTaggableResourcesFilter'])
  },
  methods: {
    onChangeSearchText () {
      this.fetchTaggableResources()

      EventTracker.sendEvent(EVENT_NAMES.MERAKI_TAGGED_RESOURCES_SEARCHED)
    },
    onChangeFilter (objectTypes) {
      this.object_types = objectTypes
      this.fetchTaggableResources()
    },
    fetchTaggableResources () {
      this.$emit('changeFilter', {
        object_types: this.object_types,
        search: this.search
      })
    },
    onAddTags (tags) {
      this.$emit('addTags', tags)
    },
    onRemoveTags (tags) {
      this.$emit('removeTags', tags)
    }
  }
}
</script>

<style src="./resources-header.scss" lang="scss" scoped></style>
