<template>
  <v-layout row wrap class="tags-list--header">
    <v-flex lg3 xl4>
      <search-input
          v-model="search"
          class="tags-list--header__search-input"
          @input="onChangeSearchText"
          :placeholder="$t('tags.tagSearchPlaceholder')">
        <v-icon>search</v-icon>
      </search-input>
    </v-flex>
    <v-flex lg9 xl8 class="tags-list--header--search-options">
      <tags-dashboard-filter
        :objectTypes="object_types"
        @change="onChangeFilter"></tags-dashboard-filter>
      <div class="tags-list--header--actions">
        <replace-tags-link
          :actionLinkText="$t('tags.replaceTagsLink')"
          :actionLabelText="$t('tags.replaceTagsLabel')"
          class="replace-tags-link"
          :selectedTags="selectedTags"
          @replaceTags="onReplaceTags"></replace-tags-link>
        <div @click="onClickDeleteTags" :class="['tags-list--header--actions__action-button ml-4', {'tags-list--header--actions__action-button--disabled': !selectedTags.length}]">
          <v-icon>delete</v-icon>
        </div>
        <div @click="$emit('downloadTags')" :class="['tags-list--header--actions__action-button']">
          <span v-if="!downloading">{{ $t('general.csv') }}</span>
          <v-progress-circular v-if="downloading" :size="14" indeterminate></v-progress-circular>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import SearchInput from '../../../../v2/search-input/search-input'
import TagsDashboardFilter from '../../column-components/tags-dashboard-filter/tags-dashboard-filter'
import ReplaceTagsLink from '../../column-components/replace-tags-action/replace-tags'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  props: {
    selectedTags: {
      type: Array
    },
    downloading: {
      type: Boolean
    }
  },
  components: {
    SearchInput,
    TagsDashboardFilter,
    ReplaceTagsLink
  },
  data () {
    return {
      search: null,
      object_types: []
    }
  },
  mounted () {
    this.search = this.merakiTagFilter.search
    this.object_types = this.merakiTagFilter.object_types
  },
  computed: {
    ...mapGetters('workspace/network', ['merakiTagFilter'])
  },
  methods: {
    onChangeSearchText () {
      this.fetchTags()

      EventTracker.sendEvent(EVENT_NAMES.MERAKI_TAGS_SEARCHED)
    },
    onChangeFilter (objectTypes) {
      this.object_types = objectTypes
      this.fetchTags()
    },
    fetchTags () {
      this.$emit('changeFilter', {
        object_types: this.object_types,
        search: this.search
      })
    },
    onReplaceTags (tags) {
      this.$emit('replaceTags', tags)
    },
    onClickDeleteTags () {
      if (this.selectedTags.length > 0) {
        this.$emit('deleteTags')
      }
    }
  }
}
</script>

<style src="./tags-header.scss" lang="scss" scoped></style>
