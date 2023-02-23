// Mixin providing methods to clean network template fields prior to save
import _ from 'lodash'
import { isObjectEmpty } from '@/utils/functions'
import { getEmptyGroupPolicy, getEmptyL7FirewallRule, getEmptySwitchQOSRule, getEmptyMxOneToOneNatRule,
  getEmptySwitchPortSchedule, getEmptySwitchProfilePort, getEmptyWirelessRfProfile, getEmptySSID } from '@/components/meraki/templates/template-setting-items/factories'

export default {
  methods: {

    clean () {
      Object.keys(this.template).forEach(fieldKey => {
        const cleanMethodIdentifier = `clean_${fieldKey}`
        if (
          !!this.template[fieldKey] &&
          !_.isEmpty(this.template[fieldKey]) &&
          this.hasOwnProperty(cleanMethodIdentifier)
        ) {
          const existingSettings = _.cloneDeep(this.template[fieldKey])
          this.$set(this.template, fieldKey, this[cleanMethodIdentifier](existingSettings))
        }
      })
    },

    clean_generic_list_settings (settings, nonConfiguredValue, emptyItemValue) {
      nonConfiguredValue = nonConfiguredValue || null

      const cleanedSettings = settings ? settings.filter(item => {
        let isEmpty = isObjectEmpty(item)
        if (emptyItemValue) {
          isEmpty = isEmpty || _.isEqual(item, emptyItemValue)
        }

        return !isEmpty
      }) : settings

      // If setting as a whole is empty after cleaning empty list fields, remove the setting completely
      return isObjectEmpty(cleanedSettings) ? nonConfiguredValue : cleanedSettings
    },

    clean_generic_setting_with_sub_list (settings, listFieldKeys, nonConfiguredValue) {
      nonConfiguredValue = nonConfiguredValue || {}

      let cleanedSettings = { ...settings }
      listFieldKeys.forEach(listFieldKey => {
        cleanedSettings = {
          ...cleanedSettings,
          [listFieldKey]: settings[listFieldKey]
            ? settings[listFieldKey].filter(item => !isObjectEmpty(item))
            : settings[listFieldKey]
        }
      })

      // If setting as a whole is empty after cleaning empty list fields, remove the setting completely
      return isObjectEmpty(cleanedSettings) ? nonConfiguredValue : cleanedSettings
    },

    clean_traffic_analysis_settings (settings) {
      return this.clean_generic_setting_with_sub_list(settings, ['customPieChartItems'])
    },

    clean_syslog_servers (settings) {
      return this.clean_generic_list_settings(settings)
    },

    clean_snmp_settings (settings) {
      return this.clean_generic_setting_with_sub_list(settings, ['users'])
    },

    clean_http_servers (settings) {
      return this.clean_generic_list_settings(settings)
    },

    clean_vlans (settings) {
      return this.clean_generic_list_settings(settings)
    },

    clean_static_routes (settings) {
      return this.clean_generic_list_settings(settings)
    },

    clean_mx_l3_firewall_rules (settings) {
      return this.clean_generic_list_settings(settings)
    },

    clean_mx_cellular_firewall_rules (settings) {
      return this.clean_generic_list_settings(settings)
    },

    clean_mx_l7_firewall_rules (settings) {
      return this.clean_generic_list_settings(settings, null, getEmptyL7FirewallRule())
    },

    clean_mx_port_forwarding_rules (settings) {
      return this.clean_generic_list_settings(settings)
    },

    clean_switch_acl_rules (settings) {
      return this.clean_generic_list_settings(settings)
    },

    clean_switch_qos_rules (settings) {
      return this.clean_generic_list_settings(settings, null, getEmptySwitchQOSRule())
    },

    clean_traffic_shaping_settings (settings) {
      return this.clean_generic_setting_with_sub_list(settings, ['rules'])
    },

    clean_mx_1_to_1_nat_rules (settings) {
      // Clean allowedInbound list first
      let cleanedSettings = settings.map(item => {
        return {
          ...item,
          allowedInbound: item.allowedInbound.filter(subItem => !isObjectEmpty(subItem))
        }
      })

      // Now clean the top-level items
      const emptyRule = getEmptyMxOneToOneNatRule()
      cleanedSettings = cleanedSettings.filter(item => !(isObjectEmpty(item) || _.isEqual(item, emptyRule)))

      // If setting as a whole is empty after cleaning empty list fields, remove the setting completely
      return isObjectEmpty(cleanedSettings) ? null : cleanedSettings
    },

    clean_mx_1_to_many_nat_rules (settings) {
      // Clean portRules list first
      let cleanedSettings = settings.map(item => {
        return {
          ...item,
          portRules: item.portRules.filter(subItem => !isObjectEmpty(subItem))
        }
      })

      // Now clean the top-level items
      cleanedSettings = cleanedSettings.filter(item => !isObjectEmpty(item))

      // If setting as a whole is empty after cleaning empty list fields, remove the setting completely
      return isObjectEmpty(cleanedSettings) ? null : cleanedSettings
    },

    clean_group_policies (settings) {
      const emptyL7Rule = getEmptyL7FirewallRule()
      const emptyGroupPolicy = getEmptyGroupPolicy()

      // Clean inner lists first
      let cleanedSettings = settings.map(item => {
        return {
          ...item,
          firewallAndTrafficShaping: {
            ...item.firewallAndTrafficShaping,
            l3FirewallRules: item.firewallAndTrafficShaping.l3FirewallRules.filter(subItem => !isObjectEmpty(subItem)),
            l7FirewallRules: item.firewallAndTrafficShaping.l7FirewallRules.filter(subItem => !(isObjectEmpty(subItem) || _.isEqual(subItem, emptyL7Rule))),
            trafficShapingRules: item.firewallAndTrafficShaping.trafficShapingRules.filter(subItem => !isObjectEmpty(subItem))
          },
          bonjourForwarding: {
            ...item.bonjourForwarding,
            rules: item.bonjourForwarding.rules.filter(subItem => !isObjectEmpty(subItem))
          }
        }
      })

      // Now clean the top-level items
      cleanedSettings = cleanedSettings.filter(item => !(isObjectEmpty(item) || _.isEqual(item, emptyGroupPolicy)))

      return isObjectEmpty(cleanedSettings) ? null : cleanedSettings
    },

    clean_switch_port_schedules (settings) {
      return this.clean_generic_list_settings(settings, null, getEmptySwitchPortSchedule())
    },

    clean_switch_profiles (settings) {
      // Clean ports list first
      const emptyPort = getEmptySwitchProfilePort()

      let cleanedSettings = settings.map(item => {
        return {
          ...item,
          ports: item.ports.filter(subItem => !(isObjectEmpty(subItem) || _.isEqual(emptyPort, subItem)))
        }
      })

      // Now clean the top-level items
      cleanedSettings = cleanedSettings.filter(item => !isObjectEmpty(item))

      // If setting as a whole is empty after cleaning empty list fields, remove the setting completely
      return isObjectEmpty(cleanedSettings) ? [] : cleanedSettings
    },

    clean_wireless_rf_profiles (settings) {
      return this.clean_generic_list_settings(settings, null, getEmptyWirelessRfProfile())
    },

    clean_ssids (settings) {
      // Clean sub lists first
      let cleanedSettings = settings.map(item => {
        const cleanedItem = { ...item }
        if (cleanedItem.traffic_shaping_settings.rules) {
          cleanedItem.traffic_shaping_settings.rules = cleanedItem.traffic_shaping_settings.rules.filter(rule => !isObjectEmpty(rule))
        }

        if (cleanedItem.mr_l3_firewall_rules) {
          cleanedItem.mr_l3_firewall_rules = cleanedItem.mr_l3_firewall_rules.filter(rule => !isObjectEmpty(rule))
        }

        if (cleanedItem.definition.radiusServers) {
          cleanedItem.definition.radiusServers = cleanedItem.definition.radiusServers.filter(server => !isObjectEmpty(server))
        }

        if (cleanedItem.definition.radiusAccountingServers) {
          cleanedItem.definition.radiusAccountingServers = cleanedItem.definition.radiusAccountingServers.filter(server => !isObjectEmpty(server))
        }

        return cleanedItem
      })

      // Now clean the top-level items
      const emptySSID = getEmptySSID()
      cleanedSettings = cleanedSettings.filter(item => !(isObjectEmpty(item) || _.isEqual(item, emptySSID)))

      // If setting as a whole is empty after cleaning empty list fields, remove the setting completely
      return isObjectEmpty(cleanedSettings) ? [] : cleanedSettings
    }
  }
}
