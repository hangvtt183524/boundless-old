<template lang="pug">
  .template-setting-category-list-item
    .template-setting-category-list-item__header(
      @click="onHeaderClick"
    )
      .template-setting-category-list-item__header__title
        | {{ $t('v2.merakiTemplates.settingCategories.' + category.key) }}
      v-icon.template-setting-category-list-item__header__icon
        | {{ isExpanded ? 'arrow_drop_up' : 'arrow_drop_down' }}

    .template-setting-category-list-item__sections(
      v-show="isExpanded"
    )
      .template-setting-category-list-item__sections__section(
        v-for="section of category.sections"
        :key="section.key"
        @click="onSectionClick(section)"
        :class="{'template-setting-category-list-item__sections__section--selected': selectedSection && selectedSection.key === section.key}"
      )
        .template-setting-category-list-item__sections__section__title
          | {{ $t('v2.merakiTemplates.settingCategories.' + section.key) }}

</template>

<script>
export default {
  name: 'template-setting-category-list-item',
  props: {
    category: {
      type: Object,
      required: true
    },
    selectedSection: {
      required: true
    },
    initiallyExpanded: {
      type: Boolean,
      required: false
    }
  },
  data: function () {
    return {
      isExpanded: false
    }
  },
  mounted () {
    if (this.initiallyExpanded) {
      this.isExpanded = this.initiallyExpanded
    }
  },
  methods: {
    onHeaderClick () {
      this.isExpanded = !this.isExpanded
    },
    onSectionClick (section) {
      this.$emit('sectionSelect', section)
    }
  }
}
</script>

<style src="./template-setting-category-list-item.scss" lang="scss" scoped></style>
