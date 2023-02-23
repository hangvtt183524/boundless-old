<template lang="pug">
  template-setting-item.switch-profiles(
    :title="$t('v2.merakiTemplates.switchProfiles')"
    :is-empty="isEmpty"
    :operation-mode="operationMode"
  )
    template(v-slot:actions)
      base-switch.syslog-downloader__dates-switch(
        :value="value.assign_switch_profiles"
        :label="$t('v2.merakiTemplates.assignSwitchProfiles')"
        @input="$emit('settingInput', 'assign_switch_profiles', $event)"
      )

    template(v-slot:sub_header)
      .template-setting-item__header__warning.template-setting-item__header__warning--info(
      ) {{ autoAssignWarning }}

    template(v-slot:default)
      .template-setting-item__content__row(
        v-show="activeItem === null"
      )
        switch-profile.switch-profile(
          v-for="(profile, index) in items"
          :key="index"
          :value="profile"
          @input="onInput(index, ...arguments)"
          @itemInput="onItemInput"
          @deleteClick="onDeleteProfileClick(index)"
          @portDetailViewClick="onPortDetailViewClick(index, ...arguments)"
          :show-field-validation-state="showFieldValidationState"
          :suppress-validation-state-display="isEmpty"
          :operation-mode="operationMode"
          :is-fixed="isFixed"
          :field-suggestions="fieldSuggestions"
          @fieldSuggestionInput="onFieldSuggestionInput"
        )

        span.switch-profiles__add-chart-item-trigger(
          v-if="!isFixed"
          @click="onAddProfileClick"
        ) + {{ $t('v2.merakiTemplates.addSwitchProfile') }}

      switch-profile-port.switch-profiles__active-profile(
        v-if="activePort !== null"
        :value="activePort"
        :suppress-validation-state-display="isEmpty"
        @fieldInput="onPortDetailFieldInput"
        @fieldClear="onPortDetailFieldClear"
        :field-suggestions="fieldSuggestions"
        @fieldSuggestionInput="onFieldSuggestionInput"
      )

</template>

<script>
import TemplateSettingItem from './template-setting-item'
import NetworkTemplateSettingItemMixin from '@/mixins/network-template-setting-item.mixin'
import NetworkTemplateSettingItemMultipleMixin from '@/mixins/network-template-setting-item-multiple.mixin'
import ItemUniqueKeyMixin from '@/mixins/item-unique-key.mixin'
import SwitchProfile from './switch-profiles-item'
import SwitchProfilePort from './switch-profiles-port-item'
import BaseSwitch from '@/components/v2/base-switch/base-switch'
import { getEmptySwitchProfile, getEmptySwitchProfilePort } from './factories'
import _ from 'lodash'

export default {
  name: 'switch-profiles',
  mixins: [
    NetworkTemplateSettingItemMixin,
    NetworkTemplateSettingItemMultipleMixin,
    ItemUniqueKeyMixin
  ],
  components: {
    SwitchProfile,
    SwitchProfilePort,
    TemplateSettingItem,
    BaseSwitch
  },
  data: function () {
    return {
      field_key: 'switch_profiles',
      activePortIndex: null,
      placeholderPort: null
    }
  },
  computed: {
    activePort () {
      if (this.activeItem !== null && this.activePortIndex !== null) {
        const portItem = this.items[this.activeItemIndex].ports[this.activePortIndex]
        if (portItem) {
          return portItem
        }

        // Opening detail view for a placeholder port item. Set placeholderPort and return it
        this.$set(this, 'placeholderPort', this.getEmptyPortItem())
        return this.placeholderPort
      }

      return null
    },
    autoAssignWarning () {
      return this.value.assign_switch_profiles
        ? this.$t('v2.merakiTemplates.assignSwitchProfilesWarning')
        : this.$t('v2.merakiTemplates.ignoreSwitchProfilesWarning')
    },
    nonConfiguredValue () {
      return []
    }
  },
  methods: {
    getEmptyItem () {
      return getEmptySwitchProfile()
    },
    getEmptyPortItem () {
      return getEmptySwitchProfilePort()
    },
    onInput (itemIndex, value) {
      this.addPlaceholderItemIfEmpty()

      this.$emit('settingInput', this.field_key, this.settingValue.map((item, index) => {
        if (index === itemIndex) {
          return value
        }

        return item
      }))
    },
    onItemInput (item, field, value) {
      this.addPlaceholderItemIfEmpty()

      this.$emit('itemInput', item, field, value)
    },
    onPortDetailFieldInput (field, value) {
      this.addPlaceholderItemIfEmpty()
      this.addPlaceholderPortIfEmpty()

      this.$emit('itemInput', this.activePort, field, value)
    },
    onPortDetailFieldClear (fields) {
      this.$emit('itemFieldClear', this.activePort, fields)
    },
    onPortDetailViewClick (profileIndex, portIndex) {
      this.$set(this, 'activePortIndex', portIndex)
      this.$set(this, 'activeItemIndex', profileIndex)
    },
    onBackClick () {
      // Nullifying activePortIndex in addition to regular functionality
      this.$set(this, 'activePortIndex', null)

      NetworkTemplateSettingItemMultipleMixin.methods.onBackClick.bind(this)()
    },
    onAddProfileClick () {
      this.addNewItem()
    },
    onDeleteProfileClick (itemIndex) {
      this.deleteItem(itemIndex)
    },
    getActiveItemName () {
      let name = ''

      if (this.activeItem && this.activePort) {
        if (this.activeItem.name || this.activeItem.switch_model) {
          name += this.activeItem.name ? this.activeItem.name : this.activeItem.switch_model
        }

        if (this.activePort.portId) {
          name += name ? ` / ${this.activePort.portId}` : this.activePort.portId
        }
      }

      return name || this.$t('v2.merakiTemplates.switchProfiles')
    },
    addPlaceholderPortIfEmpty () {
      if (!(this.activeItem && this.activeItem.ports.length > 0)) {
        this.$emit('itemInput', this.activeItem, 'ports', [this.placeholderPort])
        this.placeholderPort = null
      }
    },
    isSettingEmpty (value) {
      // Overwriting mixin method to perform special empty checks for setting
      const emptyStateValueWithPort = { // Case without port already covered by default mixin isSettingEmpty check
        ...this.getEmptyItem(),
        ports: [{
          ...this.getEmptyPortItem()
        }]
      }

      return NetworkTemplateSettingItemMixin.methods.isSettingEmpty.bind(this)(value) ||
        (this.settingValue.length === 1 && this.settingValue[0].ports.length === 1 &&
          _.isEqual(this.settingValue[0], emptyStateValueWithPort))
    }
  }
}
</script>

<style scoped lang="scss">
  @import "styles/v2/colors.scss";

  .switch-profiles {
    .switch-profile:not(:last-child) {
      margin-bottom: 30px;
      padding-bottom: 30px;
      border-bottom: 1px solid $gray-xlight;
    }

    &__add-chart-item-trigger {
      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 15px;
      line-height: 35px;
      text-decoration-line: underline;
      color: $green-medium;
      cursor: pointer;
    }
  }

</style>
