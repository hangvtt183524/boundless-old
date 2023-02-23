<template lang="pug">
  template-setting-item.firewalled-services(
    :title="$t('v2.merakiTemplates.securityApplianceServices')"
    :operation-mode="operationMode"
    :customizations="customizations"
    :setting-fields="[field_key]"
    customizations-enabled
    @customizationsClick="$emit('customizationsClick', $event)"
  )
    template(v-slot:default)
      .firewalled-services__service(
        v-for="service of services"
        :key="service"
        v-show="isServiceSettingsVisible(service)"
      )
        v-layout(row wrap).template-setting-item__content__row
          v-flex(xs6 md4 lg3 xl2)
            label {{ $t(`v2.merakiTemplates.${service}`) }}
          v-flex(xs6 md4 lg3 xl2)
            base-select(
              :items="accessOptions"
              :value="serviceValues[service].access"
              @input="onFieldInput(service, 'access', $event)"
              :disabled="isFixed"
              clearable
            )

        v-layout(row wrap).template-setting-item__content__row(
          v-if="serviceValues[service].access === 'restricted'"
        )
          v-flex(xs6 md4 lg3 xl2)
            label {{ $t('v2.merakiTemplates.allowedIpAddressRanges') }}
          v-flex(xs6 md6 lg6 xl4)
            multi-text-input(
              :value="serviceValues[service].allowedIps"
              @input="onFieldInput(service, 'allowedIps', $event)"
              :placeholder="$t('v2.placeholders.separateByCommas')"
              :validations="allowedIpsValidations"
              :show-validation-state="showFieldValidationState"
              :disabled="isFixed"
              @focus="fetchFieldSuggestions(field_key, 'allowedIps')"
              :items="allowedIpSuggestions"
            )

</template>

<script>
import _ from 'lodash'
import TemplateSettingItem from './template-setting-item'
import NetworkTemplateSettingItemMixin from '@/mixins/network-template-setting-item.mixin'
import BaseSelect from '@/components/v2/base-select/base-select'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import MultiTextInput from '@/components/v2/multi-text-input/multi-text-input'
import { isValidIpAddress, isValidCidr } from '@/utils/form-fields-validation-rules'

export default {
  name: 'firewalled-services',
  mixins: [
    NetworkTemplateSettingItemMixin
  ],
  components: { MultiTextInput, BaseSelect, BaseTextInput, TemplateSettingItem },
  props: {
    value: {
      required: true
    }
  },
  data: function () {
    return {
      field_key: 'firewalled_services',
      accessOptions: [
        {
          key: 'blocked',
          name: this.$t('v2.merakiTemplates.blocked')
        },
        {
          key: 'unrestricted',
          name: this.$t('v2.merakiTemplates.unrestricted')
        },
        {
          key: 'restricted',
          name: this.$t('v2.merakiTemplates.restricted')
        }
      ],
      services: ['web', 'ICMP', 'SNMP'],
      allowedIpsValidations: {
        required: true,
        methods: [
          {
            method: function (value) {
              return isValidIpAddress(value) || isValidCidr(value)
            },
            message: this.$t('v2.merakiTemplates.nonIpOrRangeAddError')
          }
        ]
      }
    }
  },
  mounted () {
    // Update validations for compliance mode
    if (this.isComplianceMode || this.isCustomizationMode) {
      this.$set(this.allowedIpsValidations, 'required', false)
    }
  },
  computed: {
    settingValue () {
      return this.value[this.field_key] ? this.value[this.field_key] : []
    },
    serviceValues () {
      const serviceValues = {}

      this.services.forEach(serviceType => {
        serviceValues[serviceType] = this.settingValue.filter(service => {
          return service.service === serviceType
        })[0] || this.getEmptyServiceItem(serviceType)
      })

      return serviceValues
    },
    allowedIpSuggestions () {
      const suggestions = this.getFieldSuggestions(this.field_key, 'allowedIps')
      return suggestions ? suggestions.map(item => { return { key: item, name: item } }) : null
    }
  },
  methods: {
    getEmptyServiceItem (serviceType) {
      return {
        service: serviceType,
        access: null,
        allowedIps: []
      }
    },
    updateServiceItem (updatedValue) {
      const existingService = this.settingValue.filter(service => {
        return service.service === updatedValue.service
      })[0]

      if (existingService) {
        const itemIndex = this.settingValue.indexOf(existingService)
        this.$emit('settingInput', this.field_key, this.settingValue.map((service, index) => {
          if (index === itemIndex) {
            return updatedValue
          }

          return service
        }))
      } else {
        this.$emit('settingInput', this.field_key, [
          ...this.settingValue,
          updatedValue
        ])
      }
    },
    deleteServiceItem (serviceType) {
      this.$emit('settingInput', this.field_key, this.settingValue.filter(service => service.service !== serviceType))
    },
    onFieldInput (serviceType, field, value) {
      const serviceValue = this.settingValue.filter(service => {
        return service.service === serviceType
      })[0] || this.getEmptyServiceItem(serviceType)

      if (field === 'access' && _.isNil(value)) {
        // Deleting service item
        this.deleteServiceItem(serviceType)
      } else {
        this.updateServiceItem({
          ...serviceValue,
          [field]: value
        })
      }
    },
    isServiceSettingsVisible (serviceType) {
      return (this.isTemplateMode || this.isCustomizationMode) ||
        (this.isComplianceMode && !this.isFixed) ||
        this.settingValue.filter(service => {
          return service.service === serviceType
        }).length > 0
    }
  }
}
</script>

<style scoped lang="scss">
  @import "styles/v2/colors.scss";

  .firewalled-services {
    &__service {
      &:not(:last-child) {
        margin-bottom: 30px;
        padding-bottom: 30px;
        border-bottom: 1px solid $gray-xlight;
      }
    }
  }

</style>
