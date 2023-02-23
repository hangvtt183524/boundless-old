<template lang='pug'>
  .remove-tags(v-click-outside='onClickOutside')
    .remove-tags__header
      a(
        href='#'
        @click='onOpenDialog'
        :class="[{'disabled-link': selectedResources.length === 0 }]"
      ) {{ $t('tags.removeTagsLink') }}
    transition(name='slide')
      .remove-tags__dialog(v-show='dialogExpanded')
        label.remove-tags__dialog__label {{$t('tags.removeTagsLabel')}}
        multiselect.remove-tags__dialog__select(
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
        )
          template(v-slot:noOptions)
            span
        .no-resources-hint-text(
          v-if="selectedResources == 0"
        ) *{{$t('tags.noSelectedResourcesWarning')}}
        base-button.remove-tags__dialog__button.base-button--green(
          :disabled='selectedResources.length === 0 || value.length == 0'
          @click='onRemoveTags'
        ) {{$t('tags.remove')}}
</template>

<script>
import BaseButton from '../../../../v2/base-button/base-button'
import MultiTagSelectionMixin from '@/mixins/multi-tag-selection.mixin'

export default {
  name: 'RemoveTags',
  mixins: [
    MultiTagSelectionMixin
  ],
  components: {
    BaseButton
  },
  methods: {
    onRemoveTags () {
      this.dialogExpanded = false
      this.$emit('removeTags', this.value)
      this.value = []
    }
  }
}
</script>

<style src="./remove-tags.scss" lang="scss" scoped></style>
