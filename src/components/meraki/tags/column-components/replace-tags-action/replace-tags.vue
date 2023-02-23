<template lang='pug'>
  .replace-tags(v-click-outside='onClickOutside')
    .replace-tags__header
      a(
        href='#'
        @click='onOpenDialog'
        :class="[{'disabled-link': selectedTags.length === 0 }]"
      ) {{ actionLinkText }}
    transition(name='slide')
      .replace-tags__dialog(v-show='dialogExpanded')
        label.replace-tags__dialog__label {{ actionLabelText }}
        multiselect.replace-tags__dialog__select(
          v-model='value'
          tag-placeholder='Add this as new tag'
          placeholder='Search or add'
          label='name'
          track-by='name'
          :options='tagOptions'
          :multiple='true'
          :taggable='true'
          @tag='addTag'
          @search-change='onSearchChange'
          :hide-selected='true'
          :max='1'
        )
          template(v-slot:noOptions)
            span
        .no-tags-hint-text(
          v-if="selectedTags == 0"
        ) *{{$t('tags.noSelectedTagsWarning')}}
        base-button.replace-tags__dialog__button.base-button--green(
          :disabled='selectedTags == 0 || value.length == 0'
          @click='onReplaceTags'
        ) {{$t('tags.replace')}}
</template>

<script>
import BaseButton from '../../../../v2/base-button/base-button'
import MultiTagSelectionMixin from '@/mixins/multi-tag-selection.mixin'

export default {
  name: 'ReplaceTags',
  props: {
    actionLinkText: {
      required: true,
      type: String
    },
    actionLabelText: {
      required: true,
      type: String
    },
    selectedTags: {
      type: Array,
      required: true
    }
  },
  mixins: [
    MultiTagSelectionMixin
  ],
  components: {
    BaseButton
  },
  methods: {
    onOpenDialog () {
      if (this.selectedTags.length > 0) {
        this.dialogExpanded = true
      }
    },
    onReplaceTags () {
      this.dialogExpanded = false
      this.$emit('replaceTags', this.value)
      this.value = []
    }
  }
}
</script>

<style src="./replace-tags.scss" lang="scss" scoped></style>
