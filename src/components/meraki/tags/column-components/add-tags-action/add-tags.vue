<template lang='pug'>
  .add-tags(v-click-outside='onClickOutside')
    .add-tags__header
      a(
        href='#'
        @click='onOpenDialog'
        :class="[{'disabled-link': selectedResources.length === 0 }]"
      ) {{ $t('tags.addTagsLink') }}
    transition(name='slide')
      .add-tags__dialog(v-show='dialogExpanded')
        label.add-tags__dialog__label {{$t('tags.addTagsLabel')}}
        multiselect.add-tags__dialog__select(
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
        base-button.add-tags__dialog__button.base-button--green(
          :disabled='selectedResources.length === 0 || value.length == 0'
          @click='onAddTags'
        ) {{$t('tags.add')}}
</template>

<script>
import MultiTagSelectionMixin from '@/mixins/multi-tag-selection.mixin'
import BaseButton from '../../../../v2/base-button/base-button'

export default {
  name: 'AddTags',
  mixins: [
    MultiTagSelectionMixin
  ],
  components: {
    BaseButton
  },
  methods: {
    onAddTags () {
      this.dialogExpanded = false
      this.$emit('addTags', this.value)
      this.value = []
    }
  }
}
</script>
<style src="./multiselect.scss" lang="scss"></style>
<style src="./add-tags.scss" lang="scss" scoped></style>
