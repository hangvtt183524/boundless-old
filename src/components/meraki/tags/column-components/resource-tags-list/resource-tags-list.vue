<template>
  <div class="resource-tags">
    <div class="resource-tags__list">
      <span v-for="tag of activeTags" :key="tag.id" class="resource-tags__list__item">
        <span :class="['item_text', { 'active': options.activeTag == tag.id } ]">{{tag.name}}</span>
        <v-icon v-if="!options.hideCloseBtn && removingTags.indexOf(tag.name) === -1" class="item_remove" @click="removeTag(tag)">close</v-icon>
      </span>
      <span v-for="tag of inactiveTags" :key="tag.id" class="resource-tags__list__item">
        <span :class="['item_text', { 'active': options.activeTag == tag.id } ]">{{tag.name}}</span>
        <v-icon v-if="!options.hideCloseBtn &&removingTags.indexOf(tag.name) === -1" class="item_remove" @click="removeTag(tag)">close</v-icon>
      </span>
    </div>
  </div>
</template>

<script>
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'ResourceTagsList',
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  props: {
    value: {
      type: Array
    },
    item: {
      type: Object
    },
    options: {
      type: Object
    }
  },
  data () {
    return {
      removingTags: []
    }
  },
  computed: {
    activeTags () {
      return this.value.filter(tag => tag.id === this.options.activeTag)
    },
    inactiveTags () {
      return this.value.filter(tag => tag.id !== this.options.activeTag)
    }
  },
  methods: {
    removeTag (tag) {
      this.removingTags.push(tag.name)
      this.$store.dispatch('workspace/network/removeTagsFromTaggableResources', {
        workspaceId: this.workspaceId,
        entities: [this.item.taggable_entity_id],
        tags: [tag.name]
      }).finally(() => {
        this.removingTags = this.removingTags.filter(e => e !== tag.name)
      })

      EventTracker.sendEvent(EVENT_NAMES.MERAKI_RESOURCE_UNTAGGED)
    }
  }
}
</script>

<style src="./resource-tags-list.scss" lang="scss" scoped></style>
