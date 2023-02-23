<template lang="pug">
  template-setting-item.net-flow(
    :title="$t('v2.merakiTemplates.contentFiltering')"
    :deploy-strategy-selector-enabled="isTemplateMode"
    :deploy-strategy-value="deployStrategyValue"
    :operation-mode="operationMode"
    @deployStrategyInput="$emit('deployStrategyInput', field_key, $event)"
    :is-empty="isListFieldsEmpty"
    :customizations="customizations"
    :setting-fields="[field_key]"
    customizations-enabled
    @customizationsClick="$emit('customizationsClick', $event)"
  )
    template(v-slot:default)
      v-layout(row wrap).template-setting-item__content__row(
        v-if="isSettingFieldVisible('allowedUrlPatterns')"
      )
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.allowedUrlPatterns') }}
        v-flex(xs6 md8 lg9 xl10)
          multi-text-input(
            :value="effectiveValue.allowedUrlPatterns"
            @input="onFieldInput('allowedUrlPatterns', $event)"
            :placeholder="$t('v2.placeholders.separateByCommas')"
            :disabled="isFixed"
            @focus="fetchFieldSuggestions(field_key, 'allowedUrlPatterns')"
            :items="getSuggestionsForMultiTextInput(field_key, 'allowedUrlPatterns')"
          )

      v-layout(row wrap).template-setting-item__content__row(
        v-if="isSettingFieldVisible('blockedUrlPatterns')"
      )
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.blockedUrlPatterns') }}
        v-flex(xs6 md8 lg9 xl10)
          multi-text-input(
            :value="effectiveValue.blockedUrlPatterns"
            @input="onFieldInput('blockedUrlPatterns', $event)"
            :placeholder="$t('v2.placeholders.separateByCommas')"
            :disabled="isFixed"
            @focus="fetchFieldSuggestions(field_key, 'blockedUrlPatterns')"
            :items="getSuggestionsForMultiTextInput(field_key, 'blockedUrlPatterns')"
          )

      v-layout(row wrap).template-setting-item__content__row(
        v-if="isSettingFieldVisible('blockedUrlCategories')"
        v-show="contentFilteringCategoryOptions && contentFilteringCategoryOptions.length > 0"
      )
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.blockedUrlCategories') }}
        v-flex(xs6 md8 lg9 xl10)
          base-multi-select(
            :value="effectiveBlockedUrlCategories"
            :items="contentFilteringCategoryOptions"
            @input="onFieldInput('blockedUrlCategories', $event)"
            :search-enabled="true"
            :disabled="isFixed"
          )

      v-layout(row wrap).template-setting-item__content__row(
        v-if="isSettingFieldVisible('urlCategoryListSize')"
      )
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.categoryListSize') }}
        v-flex(xs6 md4 lg3 xl2)
          base-select(
            :items="categoryListSizes"
            :value="effectiveValue.urlCategoryListSize"
            @input="onFieldInput('urlCategoryListSize', $event)"
            :disabled="isFixed"
            clearable
          )

</template>

<script>
import _ from 'lodash'
import TemplateSettingItem from './template-setting-item'
import NetworkTemplateSettingItemMixin from '@/mixins/network-template-setting-item.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import BaseMultiSelect from '@/components/v2/base-multi-select/base-multi-select'
import MultiTextInput from '@/components/v2/multi-text-input/multi-text-input'
import BaseSelect from '@/components/v2/base-select/base-select'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'content-filtering',
  mixins: [
    NetworkTemplateSettingItemMixin,
    CurrentNodeSelectionsMixin
  ],
  components: { BaseMultiSelect, MultiTextInput, BaseSelect, TemplateSettingItem },
  data: function () {
    return {
      field_key: 'content_filtering_settings',
      categoryListSizes: [
        {
          key: 'topSites',
          name: this.$t('v2.merakiTemplates.topSites')
        },
        {
          key: 'fullList',
          name: this.$t('v2.merakiTemplates.fullList')
        }
      ]
    }
  },
  mounted () {
    // If not stored, fetch content filtering categories
    if (!this.contentFilteringCategories || this.contentFilteringCategories.length === 0) {
      this.fetchContentFilteringCategories({
        workspaceId: this.workspaceId
      })
    }
  },
  computed: {
    ...mapGetters('workspace/network', ['contentFilteringCategories', 'defaultContentFilteringCategories']),
    effectiveContentFilteringCategories () {
      return this.contentFilteringCategories && this.contentFilteringCategories.length > 0
        ? this.contentFilteringCategories : this.defaultContentFilteringCategories
    },
    effectiveBlockedUrlCategories () {
      return this.effectiveValue.blockedUrlCategories.map(item => {
        if (item !== null && typeof item === 'object') {
          return item.id
        }

        return item
      })
    },
    emptyValue () {
      return {
        allowedUrlPatterns: [],
        blockedUrlPatterns: [],
        blockedUrlCategories: []
      }
    },
    nonConfiguredValue () {
      return {}
    },
    contentFilteringCategoryOptions: function () {
      return this.effectiveContentFilteringCategories.map(category => {
        return {
          key: category.id,
          name: category.name
        }
      }).sort((first, second) => {
        if (first.name > second.name) {
          return 1
        } else if (second.name > first.name) {
          return -1
        }

        return 0
      })
    },
    isListFieldsEmpty () {
      return this.isEmpty || ['allowedUrlPatterns', 'blockedUrlPatterns', 'blockedUrlCategories'].filter(
        field => !(_.isNil(this.settingValue[field]) || _.isEmpty(this.settingValue[field]))
      ).length === 0
    }
  },
  methods: {
    ...mapActions('workspace/network', ['fetchContentFilteringCategories']),
    onFieldInput (field, value) {
      this.$emit('settingInput', this.field_key, {
        ...this.effectiveValue,
        [field]: value
      })
    },
    isSettingFieldVisible (field) {
      return (this.isTemplateMode || this.isCustomizationMode) ||
        (this.isComplianceMode && !this.isFixed) ||
        !!this.settingValue[field]
    }
  }
}
</script>
