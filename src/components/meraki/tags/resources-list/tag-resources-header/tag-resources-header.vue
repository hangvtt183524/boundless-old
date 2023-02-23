<template lang='pug'>
  v-layout(row, wrap)
    v-flex(xs12, lg12)
      .resources-list__header
        .resources-list__header__details
          span.selected--tag-label {{$t('tags.selectedTagLabel')}}
          | :
          span.selected--tag-text {{tagName}}
          replace-tags-link.rename-tag-link(
            :actionLinkText="$t('tags.renameTagLink')"
            :actionLabelText="$t('tags.renameTagLabel')"
            :selectedTags='[{name: tagName}]'
            @replaceTags='onRenameTag'
          )
          span.resources-list__header__actions
            a(href='#', @click="$emit('close')") {{ $t('tags.closeLink') }}
</template>

<script>

import ReplaceTagsLink from '../../column-components/replace-tags-action/replace-tags'

export default {
  props: {
    tagName: {
      type: String
    }
  },
  components: {
    ReplaceTagsLink
  },
  data () {
    return {
    }
  },
  methods: {
    onRenameTag (tags) {
      this.$emit('renameTag', tags)
    }
  }
}
</script>

<style src="./tag-resources-header.scss" lang="scss" scoped></style>
