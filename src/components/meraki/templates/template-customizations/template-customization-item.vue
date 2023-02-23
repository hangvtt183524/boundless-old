<template lang="pug">
  .template-customization-item
    v-layout(row wrap)
      v-flex(xs12 md6 lg4 xl3)
        .template-customization-item__meta-column
          base-select(
            :items="settingOptions"
            :value="value.setting"
            @input="onFieldInput('setting', $event)"
            :label="$t('v2.merakiTemplates.setting')"
          )
          base-multi-select(
            :value="selectedTargetNetworkOptions"
            :items="targetNetworkOptions"
            @input="onTargetNetworkInput"
            :search-enabled="true"
            :disabled-when-empty="false"
            :label="$t('wifi.networks')"
            :placeholder="$t('v2.merakiCommon.startTypingNetworks')"
            @searchInput="onNetworkTargetSearchInput"
          )
          multi-text-input(
            :value="value.target_tag_names"
            :items="targetTagOptions"
            @input="onFieldInput('target_tag_names', $event)"
            :label="$t('general.tags')"
            :placeholder="$t('v2.placeholders.separateByCommas')"
            @newItemInput="onTagTargetSearchInput"
          )

          .template-customization-item__meta-column__actions
            .template-customization-item__meta-column__actions__action.remove-action(
              @click="$emit('removeClick')"
            ) {{ $t('general.remove') }}
            .template-customization-item__meta-column__actions__action(
              v-if="value.setting && hasTemplateSetting"
              @click="onFillFromTemplateClick"
            ) {{ $t('v2.merakiTemplates.fillFromTemplate') }}

      v-flex(xs12 md6 lg8 xl9)
        base-switch.customize-switch(
          v-show="value.setting"
          :value="!value.clear_configurations"
          @input="onFieldInput('clear_configurations', !$event)"
          :yes-label="$t('v2.merakiTemplates.customizeConfigurations')"
          :no-label="$t('v2.merakiTemplates.clearConfigurations')"
        )
        .template-customization-item__warning(
          v-show="value.setting && value.clear_configurations"
        )
          | {{ $t('v2.merakiTemplates.clearConfigurationsWarning').replace('{setting_name}', $t(`v2.configurationCompliance.fields.${value.setting}`)) }}

        component(
          v-if="value.setting && !value.clear_configurations && isComponentRenderEnabled(settingComponentMapping[value.setting])"
          v-bind="settingComponentProps[value.setting] || {}"
          v-bind:is="settingComponents[settingComponentMapping[value.setting]]"
          :value="templateFormattedValue"
          :field-suggestions="fieldSuggestions"
          @settingInput="onSettingInput"
          @itemInput="onSettingItemInput"
          @itemFieldClear="onSettingItemFieldClear"
          @fieldSuggestionInput="onFieldSuggestionInput"
          operation-mode="customization"
        )

</template>

<script>
import _ from 'lodash'
import { mapActions } from 'vuex'
import NetworkSettingsPageMixin from '@/mixins/network-settings-page.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import BaseSelect from '@/components/v2/base-select/base-select'
import BaseMultiSelect from '@/components/v2/base-multi-select/base-multi-select'
import MultiTextInput from '@/components/v2/multi-text-input/multi-text-input'
import BaseSwitch from '@/components/v2/base-switch/base-switch'
import settingFieldComponents from './setting-field-components'

export default {
  name: 'template-customization-item',
  mixins: [
    NetworkSettingsPageMixin,
    CurrentNodeSelectionsMixin
  ],
  components: {
    BaseSelect,
    BaseMultiSelect,
    MultiTextInput,
    BaseSwitch
  },
  props: {
    value: {
      type: Object,
      required: true
    },
    template: {
      type: Object
    },
    fieldSuggestions: {
      type: Object
    }
  },
  data: function () {
    return {
      settingComponentMapping: settingFieldComponents,
      networkSearchTargetOptions: [],
      tagSearchTargetOptions: [],
      settingComponentProps: { // Component props specific to settings
        vlans: {
          visibleFields: ['vlans']
        },
        vlans_state: {
          visibleFields: ['vlans_state']
        },
        switch_settings: {
          visibleFields: ['switch_settings']
        },
        switch_stp_settings: {
          visibleFields: ['switch_stp_settings']
        },
        switch_multicast_settings: {
          visibleFields: ['switch_multicast_settings']
        },
        switch_mtu_settings: {
          visibleFields: ['switch_mtu_settings']
        }
      }
    }
  },
  computed: {
    templateFormattedValue () {
      // Return value in template field format, as expected by template setting items
      return {
        [this.selectedSetting]: this.value.value
      }
    },
    settingOptions () {
      const settings = Object.entries(this.settingComponentMapping).map(item => item[0])
      return settings.map(item => {
        return {
          key: item,
          name: this.$t(`v2.configurationCompliance.fields.${item}`)
        }
      })
    },
    selectedSetting () {
      return this.value.setting
    },
    targetNetworkOptions () {
      // Current items + suggestions by entered text
      const targetOptions = this.value.target_networks.map(target => {
        return {
          key: target.id,
          name: `${target.organization_name}: ${target.name}`,
          network_name: target.name,
          organization_name: target.organization_name
        }
      })

      this.networkSearchTargetOptions.forEach(target => {
        if (!targetOptions.find(targetOption => {
          return targetOption.key === target.id
        })) {
          targetOptions.push({
            key: target.id,
            name: `${target.organization_name}: ${target.name}`,
            network_name: target.name,
            organization_name: target.organization_name
          })
        }
      })

      return targetOptions
    },
    selectedTargetNetworkOptions () {
      return this.value.target_networks.map(target => target.id)
    },
    targetTagOptions () {
      return this.tagSearchTargetOptions.map(target => {
        return {
          key: target.name,
          name: target.name
        }
      })
    },
    hasTemplateSetting () {
      return this.value.setting &&
        !_.isNil(this.template[this.value.setting]) &&
        !_.isEmpty(this.template[this.value.setting])
    }
  },
  watch: {
    selectedSetting: {
      handler: function (newVal, oldVal) {
        // Load components for setting
        const componentKey = this.settingComponentMapping[this.selectedSetting]
        if (!componentKey) {
          return
        }

        if (!this.settingComponents[componentKey]) {
          this.loadSettingComponent(componentKey)
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions('workspace/network', ['fetchMerakiTargetSuggestions', 'fetchTagSuggestions']),
    onNetworkTargetSearchInput (searchText) {
      if (!searchText) {
        // Do not run empty query
        return
      }

      this.fetchMerakiTargetSuggestions({
        workspaceId: this.workspaceId,
        query: searchText,
        target_types: ['network']
      }).then(response => {
        this.$set(this, 'networkSearchTargetOptions', response.data.data)
      })
    },
    onTagTargetSearchInput: _.debounce(function (searchText) {
      if (!searchText) {
        // Do not run empty query
        return
      }

      this.fetchTagSuggestions({
        workspaceId: this.workspaceId,
        query: searchText
      }).then(response => {
        this.$set(this, 'tagSearchTargetOptions', response.data.data)
      })
    }, 400),
    onTargetNetworkInput (value) {
      this.$emit('input', {
        ...this.value,
        target_networks: this.targetNetworkOptions.filter(item => value.indexOf(item.key) > -1).map(item => {
          return {
            id: item.key,
            name: item.network_name,
            organization_name: item.organization_name
          }
        })
      })
    },
    onFieldInput (field, value) {
      const updatedData = {
        ...this.value,
        [field]: value
      }

      if (field === 'setting') {
        // On setting change, reset value and clear_configurations flag
        updatedData.value = null
        updatedData.clear_configurations = false
      } else if (field === 'clear_configurations' && value === true) {
        // On clear_configurations flag change, reset value to null if setting this to true
        updatedData.value = null
      }

      this.$emit('input', updatedData)
    },
    onSettingInput (field, value) {
      this.$emit('input', {
        ...this.value,
        value: value
      })
    },
    onSettingItemInput (item, field, value) {
      this.$set(item, field, value)
    },
    onSettingItemFieldClear (item, fields) {
      fields.forEach(field => {
        delete item[field]
      })
    },
    onFieldSuggestionInput (setting, field, suggestions) {
      this.$emit('fieldSuggestionInput', setting, field, suggestions)
    },
    onFillFromTemplateClick () {
      // Set value from template
      this.onSettingInput(null, this.template[this.value.setting])
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.template-customization-item {
  padding: 20px 0;
  margin-bottom: 20px;
  border-bottom: 3px solid $gray-xlight;

  &__meta-column {
    min-height: 100%;
    padding-right: 20px;
    margin-right: 20px;
    border-right: 1px solid $gray-xlight;
    position: relative;

    &__actions {
      position: absolute;
      right: 20px;
      top: 0;

      &__action {
        float: right;
        margin-left: 15px;

        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 41px;

        text-decoration-line: underline;
        cursor: pointer;
        user-select: none;
        color: $blue-reserve;

        &.remove-action {
          color: $text-warning;
        }
      }
    }
  }

  .customize-switch {
    margin-bottom: 20px;
  }

  &__warning {
    margin-bottom: 20px;
    font-family: Fira Sans;
    font-style: italic;
    font-weight: normal;
    font-size: 13px;
    line-height: 16px;
    color: $danger;
  }
}

</style>
