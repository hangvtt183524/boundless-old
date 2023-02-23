<template lang="pug">
  template-setting-item.ssid-availability(
    :operation-mode="operationMode"
  )
    template(v-slot:default)
      v-layout(row wrap).template-setting-item__content__row()
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.visible') }}
        v-flex(xs6 md4 lg3 xl2)
          base-switch(
            :value="settingValue.visible"
            @input="onFieldInput('visible', $event)"
            :disabled="isFixed"
          )

      v-layout(row wrap).template-setting-item__content__row()
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.availableOnAllAPs') }}
        v-flex(xs6 md8 lg9 xl10)
          base-switch(
            :value="settingValue.availableOnAllAps"
            @input="onFieldInput('availableOnAllAps', $event)"
            :disabled="isFixed"
          )

          multi-text-input.mt-3(
            v-show="settingValue.availableOnAllAps === false"
            :value="settingValue.availabilityTags || []"
            @input="onFieldInput('availabilityTags', $event)"
            :disabled="isFixed"
            :placeholder="$t('v2.merakiTemplates.availableTags')"
            @newItemInput="onNewTagInput"
            :items="tagSuggestions[newTagValue] || []"
          )

</template>

<script>
import NetworkTemplateSettingItemMixin from '@/mixins/network-template-setting-item.mixin'
import TemplateSettingItem from './template-setting-item'
import BaseSwitch from '@/components/v2/base-switch/base-switch'
import MultiTextInput from '@/components/v2/multi-text-input/multi-text-input'
import { mapActions } from 'vuex'
import _ from 'lodash'

export default {
  name: 'ssid-availability',
  mixins: [
    NetworkTemplateSettingItemMixin
  ],
  components: { BaseSwitch, MultiTextInput, TemplateSettingItem },
  data: function () {
    return {
      field_key: 'definition',
      tagSuggestions: {},
      newTagValue: ''
    }
  },
  computed: {

  },
  methods: {
    ...mapActions('workspace/network', ['fetchTagSuggestions']),
    onFieldInput (field, value) {
      this.$emit('settingInput', this.field_key, {
        ...this.settingValue,
        [field]: value
      })
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

<style scoped lang="scss">
  @import "styles/v2/colors.scss";

  .ssid-availability {

  }

</style>
