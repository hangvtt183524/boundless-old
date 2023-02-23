<template lang="pug">
  template-setting-item.template-tags(
    :title="$t('general.tags')"
    :deploy-strategy-selector-enabled="isTemplateMode"
    :deploy-strategy-value="deployStrategyValue"
    :operation-mode="operationMode"
    @deployStrategyInput="$emit('deployStrategyInput', field_key, $event)"
    :is-empty="isEmpty"
  )
    template(v-slot:default)

      v-layout(
        row wrap
      ).template-setting-item__content__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('general.tags') }}
        v-flex(xs6 md8 lg9 xl10)
          multi-text-input(
            :value="settingValue || []"
            @input="onInput"
            :disabled="isFixed"
            :placeholder="$t('v2.placeholders.separateByCommas')"
            @newItemInput="onNewTagInput"
            :items="tagSuggestions[newTagValue] || []"
          )

</template>

<script>
import _ from 'lodash'
import { mapActions } from 'vuex'
import TemplateSettingItem from './template-setting-item'
import NetworkTemplateSettingItemMixin from '@/mixins/network-template-setting-item.mixin'
import MultiTextInput from '@/components/v2/multi-text-input/multi-text-input'

export default {
  name: 'tags',
  mixins: [
    NetworkTemplateSettingItemMixin
  ],
  components: {
    MultiTextInput,
    TemplateSettingItem
  },
  data: function () {
    return {
      field_key: 'tags',
      tagSuggestions: {},
      newTagValue: ''
    }
  },
  computed: {
    nonConfiguredValue () {
      return []
    }
  },
  methods: {
    ...mapActions('workspace/network', ['fetchTagSuggestions']),
    onInput (value) {
      this.$emit('settingInput', this.field_key, value)
    },
    onNewTagInput: _.debounce(function (value) {
      this.newTagValue = value

      // Suggestions for current value not fetched yet, fetch tam
      if (!this.tagSuggestions.hasOwnProperty(value)) {
        this.fetchSuggestions(value)
      }
    }, 400),
    fetchSuggestions (query) {
      this.fetchTagSuggestions({
        workspaceId: this.workspaceId,
        query: query
      }).then((response) => {
        this.$set(this.tagSuggestions, query, response.data.data.map(item => {
          return {
            key: item.name,
            name: item.name
          }
        }))
      })
    }
  }
}
</script>
