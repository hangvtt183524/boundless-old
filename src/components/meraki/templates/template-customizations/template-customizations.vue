<template lang="pug">
  .template-customizations
    .template-customizations__header
      .template-customizations__header__back-link-container
        v-icon.template-customizations__header__back-link-container__back-icon(
          @click="onBackClick"
        ) keyboard_backspace
      h4.template-customizations__header__page-title
        | {{ $t('v2.merakiTemplates.customizationsFor') }} {{ template.name }}

      .template-customizations__header__filters
        .template-customizations__header__filters__filter
          .template-customizations__header__filters__filter__label
            | {{ $t('v2.merakiTemplates.filterBySetting') }}
          .template-customizations__header__filters__filter__input
            base-select(
              :items="settingOptions"
              v-model="settingFilter"
            )

      .template-customizations__header__actions
        base-button.base-button--green.template-customizations__header__actions__action(
          @click="$emit('saveClick')"
          :disabled="!isValueChanged"
        ) {{ $t('general.saveChanges') }}
        base-button.base-button--blue--negative.template-detail-page__template-management__header__actions__action(
          @click="onResetClick"
          :disabled="!isValueChanged"
        ) {{ $t('builder.reset') }}

    .template-customizations__content
      perfect-scrollbar.template-customizations__content__scroll-area
        template-customization-item(
          v-for="(customizationItem, index) of displayedCustomizations"
          :key="index"
          :value="customizationItem"
          :template="template"
          :field-suggestions="fieldSuggestions"
          @input="onCustomizationItemInput(index, $event)"
          @removeClick="onCustomizationItemRemoveClick(index)"
          @fieldSuggestionInput="onFieldSuggestionInput"
        )
        span.template-customizations__add-item-trigger(
          @click="onAddCustomizationClick"
        ) + {{ $t('general.addNew') }}

</template>

<script>
import TemplateCustomizationItem from './template-customization-item'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import BaseSelect from '@/components/v2/base-select/base-select'
import settingFieldComponents from './setting-field-components'
import _ from 'lodash'

export default {
  name: 'template-customizations',
  components: {
    TemplateCustomizationItem,
    BaseButton,
    BaseSelect
  },
  props: {
    value: {
      type: Array,
      required: true
    },
    fieldSuggestions: {
      type: Object
    },
    template: {
      type: Object
    },
    originalTemplate: {
      type: Object
    },
    defaultSettingFilter: {
      type: String,
      required: false
    }
  },
  data: function () {
    return {
      settingComponentMapping: settingFieldComponents,
      settingFilter: null
    }
  },
  mounted () {
    this.settingFilter = this.defaultSettingFilter || null
  },
  computed: {
    settingOptions () {
      const settings = Object.entries(this.settingComponentMapping).map(item => item[0])
      return [{
        key: null,
        name: this.$t('v2.merakiTemplates.allSettings')
      }].concat(
        settings.map(item => {
          return {
            key: item,
            name: this.$t(`v2.configurationCompliance.fields.${item}`)
          }
        })
      )
    },
    isEmpty () {
      return !(this.value && this.value.length > 0)
    },
    filteredCustomizations () {
      if (!this.settingFilter) {
        return this.value
      }

      return this.value.filter(item => item.setting === this.settingFilter)
    },
    isFilteredCustomizationsEmpty () {
      return this.filteredCustomizations.length === 0
    },
    displayedCustomizations () {
      // Add placeholder item if empty
      return this.isFilteredCustomizationsEmpty
        ? [this.getEmptyCustomizationItem()]
        : this.filteredCustomizations
    },
    isValueChanged () {
      return !_.isEqual(this.value, this.originalTemplate.customizations)
    }
  },
  methods: {
    getEmptyCustomizationItem () {
      return {
        setting: this.settingFilter,
        value: null,
        clear_configurations: false,
        target_networks: [],
        target_tag_names: [],
        for_all_targets: false
      }
    },
    addCustomizationItem (item) {
      this.$emit('input', [
        ...this.value,
        item
      ])
    },
    onAddCustomizationClick () {
      if (this.isFilteredCustomizationsEmpty) {
        // Add a 2nd time if adding when only the placeholder item is being displayed
        setTimeout(() => {
          this.addCustomizationItem(this.getEmptyCustomizationItem())
        }, 50)
      }

      this.addCustomizationItem(this.getEmptyCustomizationItem())
    },
    onCustomizationItemInput (index, value) {
      if (this.isFilteredCustomizationsEmpty) {
        // Add an item if only the placeholder item is being displayed
        this.addCustomizationItem(value)
      } else {
        // Find customization index among all items
        const actualIndex = this.value.indexOf(this.filteredCustomizations[index])
        this.$emit('input', this.value.map((item, itemIndex) => {
          if (itemIndex === actualIndex) {
            return value
          }

          return item
        }))
      }

      // If setting changed to something other than current filter, update filter
      if (this.settingFilter && value.setting !== this.settingFilter) {
        this.settingFilter = value.setting
      }
    },
    onCustomizationItemRemoveClick (index) {
      if (this.isFilteredCustomizationsEmpty) {
        // Removing placeholder item, We need to do nothing
        return
      }

      const actualIndex = this.value.indexOf(this.filteredCustomizations[index])
      this.$emit('input', this.value.filter((item, itemIndex) => itemIndex !== actualIndex))
    },
    onBackClick () {
      this.$emit('backClick')
    },
    onResetClick () {
      this.$emit('input', JSON.parse(JSON.stringify(this.originalTemplate.customizations)))
    },
    onFieldSuggestionInput (setting, field, suggestions) {
      this.$emit('fieldSuggestionInput', setting, field, suggestions)
    }
  }
}
</script>

<style src="./template-customizations.scss" lang="scss" scoped></style>
