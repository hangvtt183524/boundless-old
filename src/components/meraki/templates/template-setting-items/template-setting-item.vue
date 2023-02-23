<template lang="pug">
 .template-setting-item(
   :class="{'template-setting-item--customization-mode': isCustomizationMode, 'template-setting-item--has-customizations': hasCustomizations}"
 )
   .template-setting-item__header(
     v-if="!isCustomizationMode"
   )
     .template-setting-item__header__top-row
       .template-setting-item__header__title(
         v-show="titleVisible"
       )
         span.template-setting-item__header__title__text
          | {{ title }}
         v-tooltip(
           v-if="customizationsEnabled && title"
           bottom :color="'#223d70'" light
         )
           template(v-slot:activator="{ on }")
             v-icon(
               v-on="on"
               @click="$emit('customizationsClick', settingFields[0])"
             ) dashboard_customize
           span {{ $t('v2.merakiTemplates.customizations') }}

       .template-setting-item__header__actions
         slot(name="actions")

         base-switch.syslog-downloader__dates-switch(
           v-if="deployStrategySelectorEnabled"
           :value="deployStrategyValue === deployStrategies.extend"
           :yes-label="$t('v2.merakiTemplates.extendExistingSettings')"
           :no-label="$t('v2.merakiTemplates.replaceExistingSettings')"
           @input="$emit('deployStrategyInput', $event)"
         )

     .template-setting-item__header__sub-header
       slot(name="sub_header")

       .template-setting-item__header__left-warning(
         v-if="hasCustomizations"
       ) {{ $t('v2.merakiTemplates.settingHasCustomizations') }}

       .template-setting-item__header__warning(
         v-if="warning"
         :class="`template-setting-item__header__warning--${warning.class}`"
       ) {{ warning.text }}

   .template-setting-item__content
      slot(name="default")

</template>

<script>
import BaseSwitch from '@/components/v2/base-switch/base-switch'
import NetworkSettingOperationModeMixin from '@/mixins/network-setting-operation-mode.mixin'

export default {
  name: 'template-setting-item',
  mixins: [
    NetworkSettingOperationModeMixin
  ],
  components: {
    BaseSwitch
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    titleVisible: {
      type: Boolean,
      default: true
    },
    deployStrategySelectorEnabled: {
      type: Boolean,
      default: false
    },
    deployStrategyValue: {
      type: String,
      required: false
    },
    isEmpty: {
      type: Boolean,
      required: false
    },
    settingFields: {
      type: Array,
      default: () => []
    },
    customizations: {
      type: Array,
      default: () => []
    },
    customizationsEnabled: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      deployStrategies: {
        extend: 'extend',
        overwrite: 'overwrite'
      }
    }
  },
  computed: {
    warning () {
      if (this.deployStrategySelectorEnabled) {
        if (this.deployStrategyValue === this.deployStrategies.extend) {
          return {
            text: this.$t('v2.merakiTemplates.extendSettingsWarning').replace('{setting_name}', this.title.toLowerCase()),
            class: 'info'
          }
        } else {
          if (this.isEmpty) {
            return {
              text: this.$t('v2.merakiTemplates.clearSettingsWarning').replace('{setting_name}', this.title.toLowerCase()),
              class: 'danger'
            }
          } else {
            return {
              text: this.$t('v2.merakiTemplates.replaceSettingsWarning').replace('{setting_name}', this.title.toLowerCase()),
              class: 'danger'
            }
          }
        }
      }

      return null
    },
    hasCustomizations () {
      // Returns true if we have a custmozation for any field covered by this setting item
      return this.customizations.map(item => item.setting).filter(settingField => this.settingFields.includes(settingField)).length > 0
    }
  }
}
</script>

<style scoped lang="scss">
  @import "styles/v2/colors.scss";

  .template-setting-item {
    padding: 44px 40px;
    border-bottom: 3px solid $gray-xlight;

    &__header {
      padding-bottom: 10px;
      border-bottom: 1px solid $gray-xlight;

      &__top-row {
        overflow: hidden;
      }

      &__title {
        float: left;

        &__text {
          font-family: Fira Sans;
          font-style: normal;
          font-weight: normal;
          font-size: 18px;
          line-height: 30px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: $blue-dark;
          vertical-align: middle;
        }

        .v-icon {
          font-size: 14px;
          margin-left: 10px;
          vertical-align: middle;
        }
      }

      &__actions {
        float: right;
      }

      &__sub-header {
        overflow: hidden;
      }

      &__warning {
        float: right;
        width: 50%;
        margin-top: 10px;
        text-align: right;
        font-family: Fira Sans;
        font-style: italic;
        font-weight: normal;
        font-size: 13px;
        line-height: 16px;
        color: $blue-reserve;

        &--danger {
          color: $danger;
        }
      }

      &__left-warning {
        float: left;
        width: 50%;
        margin-top: 10px;
        text-align: left;
        font-family: Fira Sans;
        font-style: italic;
        font-weight: normal;
        font-size: 13px;
        line-height: 16px;
        color: $warning;

        &--info {
          color: $blue-reserve;
        }
      }
    }

    &__content {
      margin-top: 15px;

      &__row {
        margin-top: 10px;
      }

      &__separator {
        margin-bottom: 30px;
        padding-bottom: 30px;
        border-bottom: 1px solid $gray-xlight;
      }

      label {
        line-height: 40px;
        padding-right: 10px;
        display: block;
      }
    }

    &__info {
      font-family: Fira Sans;
      font-style: italic;
      font-weight: normal;
      font-size: 14px;
      line-height: 22px;
      color: $blue-reserve;
    }

    &--customization-mode {
      padding: 0;
      border-bottom-width: 0;

      .template-setting-item__content {
        margin-top: 0;

        &__row {
          margin-top: 0;
          margin-bottom: 10px;
        }
      }
    }

    &--has-customizations {
      .template-setting-item__header {

      }
    }
  }
</style>
