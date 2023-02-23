<template lang="pug">
  .alert-item
    base-check-box(
      :value="value.enabled"
      :label="$t(`v2.merakiTemplates.alertLabels.${alertData.field}`)"
      @input="onEnabledStateInput"
      :disabled="isFixed"
    )
    .alert-item__parameters(
      v-if="alertData.parameters && alertData.parameters.length > 0"
    )
      .alert-item__parameters__parameter(
        v-for="parameter of alertData.parameters"
        :key="parameter.key"
        :class="`alert-item__parameters__parameter--${parameter.type}`"
      )
        base-select.base-select--small(
          v-if="parameter.type === 'timeout'"
          :value="value.filters[parameter.key]"
          :items="timeoutOptions"
          :label="$t('v2.merakiTemplates.timeout')"
          @input="onParameterInput(parameter.key, $event)"
          :validations="{required: true}"
          :show-validation-state="showFieldValidationState"
          :suppress-validation-state-display="!isDefined"
          :disabled="isFixed"
          clearable
        )
        base-select.base-select--small(
          v-else-if="parameter.type === 'period'"
          :value="value.filters[parameter.key]"
          :items="periodOptions"
          :label="$t('v2.merakiTemplates.period')"
          @input="onParameterInput(parameter.key, $event)"
          :validations="{required: true}"
          :show-validation-state="showFieldValidationState"
          :suppress-validation-state-display="!isDefined"
          :disabled="isFixed"
          clearable
        )
        base-select.base-select--small(
          v-else-if="parameter.type === 'port_selection'"
          :value="value.filters[parameter.key]"
          :items="portOptions"
          :label="$t('wifi.port')"
          @input="onParameterInput(parameter.key, $event)"
          :validations="{required: true}"
          :show-validation-state="showFieldValidationState"
          :suppress-validation-state-display="!isDefined"
          :disabled="isFixed"
          clearable
        )
        data-size-input.data-size-input--small(
          v-else-if="parameter.type === 'data_size'"
          :value="value.filters[parameter.key]"
          :label="$t('v2.merakiTemplates.threshold')"
          @input="onParameterInput(parameter.key, $event)"
          :validations="{required: true}"
          :show-validation-state="showFieldValidationState"
          :suppress-validation-state-display="!isDefined"
          :disabled="isFixed"
        )

    .alert-item__recipients
      .alert-item__recipients__display-trigger(
        @click="onRecipientsDisplayTriggerClick"
      ) {{ recipientsVisible ? $t('alerts.hideAdditionalRecipients') : $t('alerts.showAdditionalRecipients') }}

      multi-text-input.multi-text-input--small(
        v-show="recipientsVisible"
        :value="recipientSelections"
        :items="recipientOptions"
        @input="onRecipientsInput"
        :validations="destinationValidations"
        :disabled="isFixed"
      )

</template>

<script>
import BaseCheckBox from '@/components/v2/base-check-box/base-check-box'
import BaseSelect from '@/components/v2/base-select/base-select'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import DataSizeInput from '@/components/v2/data-size-input/data-size-input'
import MultiTextInput from '@/components/v2/multi-text-input/multi-text-input'
import { mapGetters } from 'vuex'
import { isValidEmail, isValidUrl } from '@/utils/form-fields-validation-rules'

export default {
  name: 'alert-item',
  components: {
    MultiTextInput,
    DataSizeInput,
    BaseTextInput,
    BaseSelect,
    BaseCheckBox
  },
  props: {
    value: {
      type: Object,
      required: true
    },
    alertData: {
      type: Object,
      required: true
    },
    isDefined: {
      type: Boolean,
      required: true
    },
    httpServers: {
      type: Array,
      required: true
    },
    showFieldValidationState: {
      type: Boolean,
      default: false
    },
    isFixed: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      periodOptions: [
        { key: 1200, name: this.$t('v2.merakiTemplates.twentyMinutes') },
        { key: 14400, name: this.$t('v2.merakiTemplates.fourHours') },
        { key: 86400, name: this.$t('v2.merakiTemplates.oneDay') }
      ],
      timeoutOptions: [
        { key: 5, name: this.$t('v2.merakiTemplates.fiveMinutes') },
        { key: 10, name: this.$t('v2.merakiTemplates.10Minutes') },
        { key: 15, name: this.$t('v2.merakiTemplates.fifteenMinutes') },
        { key: 30, name: this.$t('v2.merakiTemplates.thirtyMinutes') },
        { key: 60, name: this.$t('v2.merakiTemplates.sixtyMinutes') }
      ],
      sizeUnitOptions: [
        { key: 'kb', name: 'KB' },
        { key: 'mb', name: 'MB' },
        { key: 'gb', name: 'GB' },
        { key: 'tb', name: 'TB' }
      ],
      portOptions: [
        { key: 'any port', name: 'any port' }
      ],
      recipientsVisible: false,
      allAdminsOptionKey: this.$t('v2.merakiTemplates.addNetworkAdmins'),
      destinationValidations: {
        required: false,
        methods: [
          {
            method: function (value) {
              // Value might be base64 encoded version of a url
              let decodedValue = null
              try {
                decodedValue = window.atob(value)
              } catch (e) { }

              return isValidEmail(value) || (decodedValue && isValidUrl(decodedValue)) || value === this.allAdminsOptionKey
            }.bind(this),
            message: this.$t('alerts.nonEmailRecipientAddError')
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters('organization/meraki', ['merakiAdmins']),
    merakiAdminList () {
      return (this.merakiAdmins && this.merakiAdmins.data) ? this.merakiAdmins.data : []
    },
    recipientOptions () {
      // Static "All admins" option + Meraki network admins + Http Servers

      const adminEmailOptions = this.merakiAdminList.map(item => {
        return {
          name: `${item.name} <${item.email}>`,
          key: item.email
        }
      })

      const httpServerOptions = this.httpServers.filter(item => {
        return !!(item.url)
      }).map(item => {
        return {
          name: `Webhook: ${item.name}`,
          key: btoa(item.url)
        }
      })

      return [{
        name: this.allAdminsOptionKey,
        key: this.allAdminsOptionKey
      }].concat(adminEmailOptions)
        .concat(httpServerOptions)
    },
    recipientSelections () {
      return (this.value.alertDestinations.allAdmins ? [this.allAdminsOptionKey] : [])
        .concat(this.value.alertDestinations.emails)
        .concat(this.value.alertDestinations.httpServerIds)
    }
  },
  watch: {
    httpServers: {
      handler: function () {
        // If http server values change, remove non-existent servers from default recipients list
        const httpServerKeys = this.httpServers.filter(item => {
          return !!(item.url)
        }).map(item => {
          return btoa(item.url)
        })

        if (this.value.alertDestinations.httpServerIds.filter(serverId => {
          return httpServerKeys.indexOf(serverId) === -1
        }).length > 0) {
          // We have a selected http server which is no longer available, remove it from selections
          this.$emit('input', {
            ...this.value,
            alertDestinations: {
              ...this.value.alertDestinations,
              httpServerIds: this.value.alertDestinations.httpServerIds.filter(key => {
                return httpServerKeys.indexOf(key) > -1
              })
            }
          })
        }
      },
      deep: true
    }
  },
  methods: {
    onRecipientsDisplayTriggerClick () {
      this.$set(this, 'recipientsVisible', !this.recipientsVisible)
    },
    onEnabledStateInput (value) {
      this.$emit('input', {
        ...this.value,
        enabled: value
      })
    },
    onRecipientsInput (value) {
      const isAllAdminsSelected = value.indexOf(this.allAdminsOptionKey) > -1
      const httpServerKeys = this.httpServers.filter(item => {
        return !!(item.url)
      }).map(item => {
        return btoa(item.url)
      })

      this.$emit('input', {
        ...this.value,
        alertDestinations: {
          ...this.value.alertDestinations,
          allAdmins: isAllAdminsSelected,
          emails: value.filter(key => {
            return key !== this.allAdminsOptionKey && httpServerKeys.indexOf(key) === -1
          }),
          httpServerIds: value.filter(key => {
            return key !== this.allAdminsOptionKey && httpServerKeys.indexOf(key) > -1
          })
        }
      })
    },
    onParameterInput (field, value) {
      this.$emit('input', {
        ...this.value,
        filters: {
          ...(this.value.filters ? this.value.filters : {}),
          [field]: value
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .alert-item {
    margin-bottom: 25px;

    &__parameters {
      padding-left: 36px;

      &__parameter {
        margin-bottom: 5px;

        ::v-deep {
          label {
            width: 80px;
            display: inline-block;
          }

          .base-select {
            .select-container {
              width: auto;
              min-width: 120px;
            }
          }

          .base-text-input {
            &__input-container {
              display: inline-block;
            }
          }

          .data-size-input {
            &__input-container {
              display: inline-block;
            }
          }
        }
      }
    }

    &__recipients {
      margin-top: 5px;
      padding-left: 36px;

      &__display-trigger {
        color: $green-medium;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 18px;
        cursor: pointer;
        user-select: none;
        margin-bottom: 5px;
      }
    }
  }
</style>
