<template lang="pug">
  template-setting-item.alert-settings(
    :title="$t('v2.merakiTemplates.alertSettings')"
    :deploy-strategy-selector-enabled="isTemplateMode"
    :deploy-strategy-value="deployStrategyValue"
    :operation-mode="operationMode"
    @deployStrategyInput="$emit('deployStrategyInput', field_key, $event)"
    :is-empty="isEmpty"
    :customizations="customizations"
    :setting-fields="[field_key]"
    customizations-enabled
    @customizationsClick="$emit('customizationsClick', $event)"
  )
    template(v-slot:default)
      v-layout(row wrap).template-setting-item__content__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('wifi.defaultRecipients') }}
        v-flex(xs6 md8 lg9 xl10)
          multi-text-input.multi-text-input--small(
            :value="defaultRecipientSelections"
            :items="defaultRecipientOptions"
            @input="onDefaultRecipientsInput"
            :validations="destinationValidations"
            :show-validation-state="showFieldValidationState"
            :disabled="isFixed"
          )

      .alert-settings__section(
        v-for="alertSection of alertSections"
        :key="alertSection.key"
      )
        v-layout(row wrap).template-setting-item__content__row
          v-flex(xs6 md4 lg3 xl2)
            label {{ $t(`v2.merakiTemplates.alertSections.${alertSection.key}`) }}
          v-flex(xs6 md8 lg9 xl10)
            .alert-settings__section__alert-list
              alert-item(
                v-for="alert of alertSection.alerts"
                :key="alert.field"
                :value="getAlertValue(alert.field)"
                :alert-data="alert"
                :is-defined="getAlertDefinedState(alert.field)"
                :is-fixed="isFixed"
                :http-servers="httpServers"
                @input="onAlertInput"
                :show-field-validation-state="showFieldValidationState"
              )

</template>

<script>
import _ from 'lodash'
import TemplateSettingItem from './template-setting-item'
import NetworkTemplateSettingItemMixin from '@/mixins/network-template-setting-item.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import alerts from './alerts'
import AlertItem from './alert-item'
import MultiTextInput from '@/components/v2/multi-text-input/multi-text-input'
import { mapActions, mapGetters } from 'vuex'
import { isValidEmail, isValidUrl } from '@/utils/form-fields-validation-rules'

export default {
  name: 'alert-settings',
  mixins: [
    NetworkTemplateSettingItemMixin,
    CurrentNodeSelectionsMixin
  ],
  components: { AlertItem, MultiTextInput, TemplateSettingItem },
  data: function () {
    return {
      field_key: 'alert_settings',
      alertSections: alerts,
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
    httpServers () {
      return this.value.http_servers ? this.value.http_servers : []
    },
    alertList () {
      return (this.settingValue && this.settingValue.alerts) ? this.settingValue.alerts : []
    },
    defaultDestinations () {
      return (this.settingValue && this.settingValue.defaultDestinations) ? this.settingValue.defaultDestinations : {
        allAdmins: false,
        emails: [],
        snmp: false,
        httpServerIds: []
      }
    },
    merakiAdminList () {
      return (this.merakiAdmins && this.merakiAdmins.data) ? this.merakiAdmins.data : []
    },
    defaultRecipientOptions () {
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
          name: `Webhook: ${item.name ? item.name : item.url}`,
          key: btoa(item.url)
        }
      })

      return [{
        name: this.allAdminsOptionKey,
        key: this.allAdminsOptionKey
      }].concat(adminEmailOptions)
        .concat(httpServerOptions)
    },
    defaultRecipientSelections () {
      return (this.defaultDestinations.allAdmins ? [this.allAdminsOptionKey] : [])
        .concat(this.defaultDestinations.emails)
        .concat(this.defaultDestinations.httpServerIds)
    },
    nonConfiguredValue () {
      return {}
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

        if (this.defaultDestinations.httpServerIds.filter(serverId => {
          return httpServerKeys.indexOf(serverId) === -1
        }).length > 0) {
          // We have a selected http server which is no longer available, remove it from selections
          this.$emit('settingInput', this.field_key, {
            ...this.settingValue,
            defaultDestinations: {
              ...this.defaultDestinations,
              httpServerIds: this.defaultDestinations.httpServerIds.filter(key => {
                return httpServerKeys.indexOf(key) > -1
              })
            },
            alerts: this.alertList
          })
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('organization/meraki', ['fetchMerakiAdmins']),
    fetchMerakiAdminList () {
      this.fetchMerakiAdmins({
        organizationId: this.organizationId
      })
    },
    getEmptyAlertSettingItem (alertType) {
      return {
        type: alertType,
        enabled: false,
        alertDestinations: {
          emails: [],
          allAdmins: false,
          snmp: false,
          httpServerIds: []
        },
        filters: {}
      }
    },
    getAlertValue (field) {
      const alertValue = this.alertList.filter(alert => {
        return alert.type === field
      })[0]

      if (alertValue) {
        return alertValue
      }

      return this.getEmptyAlertSettingItem(field)
    },
    getAlertDefinedState  (field) {
      return this.alertList.filter(alert => {
        return alert.type === field
      }).length > 0
    },
    onDefaultRecipientsInput (value) {
      const isAllAdminsSelected = value.indexOf(this.allAdminsOptionKey) > -1
      const httpServerKeys = this.httpServers.filter(item => {
        return !!(item.url)
      }).map(item => {
        return btoa(item.url)
      })

      this.$emit('settingInput', this.field_key, {
        ...this.settingValue,
        defaultDestinations: {
          ...this.defaultDestinations,
          allAdmins: isAllAdminsSelected,
          emails: value.filter(key => {
            return key !== this.allAdminsOptionKey && httpServerKeys.indexOf(key) === -1
          }),
          httpServerIds: value.filter(key => {
            return key !== this.allAdminsOptionKey && httpServerKeys.indexOf(key) > -1
          })
        },
        alerts: this.alertList
      })
    },
    isAlertEmpty (alertValue) {
      const emptyAlert = this.getEmptyAlertSettingItem(alertValue.type)

      const alert = { ...alertValue }
      const alertFilters = alert.filters

      // We'll perform filter emptiness checks manually
      alert.filters = emptyAlert.filters

      return _.isEqual(alert, emptyAlert) && this.isFiltersEmpty(alertFilters)
    },
    onAlertInput (alertValue) {
      if (this.isAlertEmpty(alertValue)) {
        // If alert value changed to an empty alert, delete it
        this.$emit('settingInput', this.field_key, {
          ...this.settingValue,
          defaultDestinations: this.defaultDestinations,
          alerts: this.alertList.filter(alert => alert.type !== alertValue.type)
        })
      } else {
        const alertExists = this.alertList.filter(alert => {
          return alert.type === alertValue.type
        }).length > 0

        this.$emit('settingInput', this.field_key, {
          ...this.settingValue,
          defaultDestinations: this.defaultDestinations,
          alerts: alertExists ? this.alertList.map(alert => {
            if (alert.type === alertValue.type) {
              return alertValue
            }

            return alert
          }) : this.alertList.concat([alertValue])
        })
      }
    },
    isSettingEmpty (value) {
      // Overwriting mixin method to perform special empty checks for alert settings
      return _.isNil(value) || _.isEmpty(value) ||
        (
          value.alerts.length === 0 &&
          value.defaultDestinations.allAdmins === false &&
          value.defaultDestinations.snmp === false &&
          value.defaultDestinations.emails.length === 0 &&
          value.defaultDestinations.httpServerIds.length === 0
        )
    },
    isFiltersEmpty (filters) {
      if (_.isNil(filters) || _.isEmpty(filters)) {
        return true
      }

      let empty = true
      for (let key of Object.keys(filters)) {
        empty = empty && (_.isNil(filters[key]) || filters[key] === '' || filters[key] === 0)
      }

      return empty
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .alert-settings {
    &__section {
      &__alert-list {
        margin-top: 10px;
      }
    }
  }
</style>
