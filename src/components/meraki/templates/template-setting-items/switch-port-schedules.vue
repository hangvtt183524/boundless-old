  <template lang="pug">
  template-setting-item(
    :deploy-strategy-selector-enabled="isTemplateMode"
    :deploy-strategy-value="deployStrategyValue"
    @deployStrategyInput="$emit('deployStrategyInput', field_key, $event)"
    :is-empty="isEmpty"
    :customizations="customizations"
    :setting-fields="[field_key]"
    customizations-enabled
    @customizationsClick="$emit('customizationsClick', $event)"
  ).switch-port-schedules
    template(v-slot:default)
      .switch-port-schedules__schedule(
        v-for="(schedule, index) of items"
        :key="getItemKey(index)"
      )
        v-layout(row wrap).template-setting-item__content__row
          v-flex(xs6 md6 lg2 xl2)
            label {{ $t('general.name') }}
          v-flex(xs5 md4 lg3 xl2)
            base-text-input(
              :value="schedule.name"
              :placeholder="$t('v2.merakiTemplates.scheduleNamePlaceholder')"
              @input="onScheduleFieldInput(index, 'name', $event)"
              :validations="{required: true}"
              :show-validation-state="showFieldValidationState"
              :suppress-validation-state-display="isEmpty"
              :disabled="isFixed"
            )

        v-layout(row wrap).template-setting-item__content__row
          v-flex(xs12)
            schedule-item(
              :value="schedule.portSchedule"
              @input="onScheduleFieldInput(index, 'portSchedule', $event)"
              :is-fixed="isFixed"
            )

        .switch-port-schedules__schedule__actions
          v-icon.switch-port-schedules__schedule__actions__action(
            v-if="!isFixed"
            @click="onDeleteScheduleClick(index)"
          ) $vuetify.icons.delete

      span.switch-port-schedules__add-chart-item-trigger(
        v-if="!isFixed"
        @click="onAddScheduleClick"
      ) + {{ $t('general.addNew') }}

</template>

<script>
import TemplateSettingItem from './template-setting-item'
import NetworkTemplateSettingItemMixin from '@/mixins/network-template-setting-item.mixin'
import ScheduleItem from './schedule-item'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import { getEmptySwitchPortSchedule } from './factories'
import _ from 'lodash'

export default {
  name: 'switch-port-schedules',
  mixins: [
    NetworkTemplateSettingItemMixin
  ],
  components: { ScheduleItem, BaseTextInput, TemplateSettingItem },
  data: function () {
    return {
      field_key: 'switch_port_schedules',
      computeCounter: 0,
      placeholderItem: null
    }
  },
  computed: {
    items () {
      // eslint-disable-next-line no-unused-expressions
      this.computeCounter

      if (!this.isEmpty) {
        return this.settingValue
      }

      // Setting value empty. Set a placeholder item and add it to the list.
      // If we do not define placeholderItem as a data attribute, and directly return a dynamic list here as we do for
      // simple list-type settings, a change in the placeholder item property is not detected by child components.
      this.$set(this, 'placeholderItem', this.getEmptyItem())
      return [this.placeholderItem]
    }
  },
  methods: {
    getEmptyItem () {
      return getEmptySwitchPortSchedule()
    },
    addItem (item) {
      this.$emit('settingInput', this.field_key, [
        ...(this.settingValue ? this.settingValue : []),
        item
      ])
    },
    onAddScheduleClick () {
      if (this.isEmpty) {
        // Do twice if the list is already empty, as one item is displayed as placeholder already
        this.addItem(this.getEmptyItem())
      }

      this.addItem(this.getEmptyItem())
    },
    onScheduleFieldInput (scheduleIndex, field, value) {
      // If inputted a value for placeholder item, add it to the list of items first
      if (this.isEmpty) {
        this.addItem(this.placeholderItem)
        this.placeholderItem = null
      }

      this.$emit('settingInput', this.field_key, [
        ...(this.settingValue ? this.settingValue : []).map((scheduleData, index) => {
          if (index === scheduleIndex) {
            return {
              ...scheduleData,
              [field]: value
            }
          }

          return scheduleData
        })
      ])
    },
    onDeleteScheduleClick (scheduleIndex) {
      if (this.isEmpty) {
        this.computeCounter += 1 // Force re-compute of table items so that row re-renders
        return
      }

      this.$emit('settingInput', this.field_key, [
        ...(this.settingValue ? this.settingValue : []).filter((scheduleData, index) => {
          return index !== scheduleIndex
        })
      ])
    },
    getItemKey (index) {
      // Concatenate compute counter to index so that we can clear validation errors for placeholder item
      return `${index}_${this.computeCounter}`
    },
    isSettingEmpty (value) {
      // Overwriting mixin method to perform special empty checks for setting
      const emptyStateValue = this.getEmptyItem()

      return NetworkTemplateSettingItemMixin.methods.isSettingEmpty.bind(this)(value) ||
        (this.settingValue.length === 1 && _.isEqual(this.settingValue[0], emptyStateValue))
    }
  }
}
</script>

<style scoped lang="scss">
  @import "styles/v2/colors.scss";

  .switch-port-schedules {
    &__schedule {
      position: relative;

      .schedule {
        margin-top: 30px;
        padding-top: 13px;
      }

      &__actions {
        position: absolute;
        right: 10px;
        top: 10px;

        &__action {
          font-size: 16px;
          vertical-align: middle;
          margin-left: 10px;
          cursor: pointer;
        }
      }

      &:not(:last-child) {
        margin-bottom: 30px;
        padding-bottom: 30px;
        border-bottom: 1px solid $gray-xlight;
      }
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
