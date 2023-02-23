// Mixin providing validation methods for network template fields
import _ from 'lodash'
import { isValidPort, isValidPortRange, isValidPortList, isValidCidr, isValidCidrWithPort, isValidCidrWithPortRange,
  isValidHostname, isValidIpAddress, isValidUrl, isValidNonNegativeInteger, isValidVlan, isValidSwitchPortVlan,
  isValidDomainWildcard, isValidPolicyObjectOrGroup } from '@/utils/form-fields-validation-rules'

export default {
  methods: {
    displayValidationFailureMessages (settingName, additionalMessages) {
      global.toastr['error'](this.$t('v2.merakiTemplates.settingsInvalidMessage').replace('{setting_name}', settingName), this.$t('general.error'))

      if (additionalMessages) {
        additionalMessages.forEach(message => {
          global.toastr['error'](message, this.$t('general.error'))
        })
      }
    },

    displaySSIDValidationFailureMessages (settingName, ssidName, additionalMessages) {
      global.toastr['error'](this.$t('v2.merakiTemplates.SSIDSettingsInvalidMessage').replace('{setting_name}', settingName).replace('{ssid_name}', ssidName), this.$t('general.error'))

      if (additionalMessages) {
        additionalMessages.forEach(message => {
          global.toastr['error'](message, this.$t('general.error'))
        })
      }
    },

    validate () {
      let validationResult = true

      Object.keys(this.template).forEach(fieldKey => {
        const validationMethodIdentifier = `validate_${fieldKey}`
        if (
          !!this.template[fieldKey] &&
          !_.isEmpty(this.template[fieldKey]) &&
          this.hasOwnProperty(validationMethodIdentifier)
        ) {
          validationResult &= this[validationMethodIdentifier](this.template[fieldKey])
        }
      })

      return validationResult
    },

    validate_traffic_analysis_settings (settings) {
      let isValid = true
      const messages = []

      if (!settings.mode) {
        isValid = false
      }

      settings.customPieChartItems.forEach((item, index) => {
        if (!(!!item.name && !!item.type && !!item.value)) {
          isValid = false
        }

        if (
          (item.type === 'port' && !isValidPort(item.value)) ||
          (item.type === 'host' && !isValidHostname(item.value)) ||
          (item.type === 'ipRange' && !isValidCidrWithPort(item.value))
        ) {
          isValid = false
          messages.push(this.$t('v2.merakiTemplates.invalidPieChartValueMessage').replace('{row_number}', (index + 1) + ''))
        }
      })

      if (!isValid) {
        this.displayValidationFailureMessages(this.$t('v2.merakiTemplates.trafficAnalysis'), messages)
      }

      return isValid
    },

    validate_syslog_servers (settings) {
      let isValid = true

      settings.forEach((item, index) => {
        if (
          !(!!item.host && !!item.port && !!item.roles && item.roles.length > 0) ||
          !isValidPort(item.port) ||
          !isValidIpAddress(item.host)
        ) {
          isValid = false
        }
      })

      if (!isValid) {
        this.displayValidationFailureMessages(this.$t('v2.merakiTemplates.syslogServers'))
      }

      return isValid
    },

    validate_snmp_settings (settings) {
      let isValid = true
      const messages = []

      if (!settings.access) {
        isValid = false
      }

      if (settings.access === 'community' && !settings.communityString) {
        isValid = false
        messages.push(this.$t('v2.merakiTemplates.snmpNoCommunityStringMessage'))
      }

      if (settings.access === 'users') {
        if (!settings.users || settings.users.length === 0) {
          isValid = false
          messages.push(this.$t('v2.merakiTemplates.snmpNoUsersMessage'))
        } else {
          // Check that required fields are filled for users
          if (settings.users.filter(user => {
            return !(!!user.username && !!user.passphrase)
          }).length > 0) {
            isValid = false
          }
        }
      }

      if (!isValid) {
        this.displayValidationFailureMessages(this.$t('v2.merakiTemplates.snmp'), messages)
      }

      return isValid
    },

    validate_net_flow_settings (settings) {
      let isValid = true

      if (
        (settings.reportingEnabled === null) ||
        (settings.reportingEnabled === true && !isValidIpAddress(settings.collectorIp)) ||
        (settings.reportingEnabled === true && !isValidPort(settings.collectorPort))
      ) {
        isValid = false
      }

      if (!isValid) {
        this.displayValidationFailureMessages(this.$t('v2.merakiTemplates.netFlow'))
      }

      return isValid
    },

    validate_http_servers (settings) {
      let isValid = true
      const messages = []

      settings.forEach((item) => {
        if (
          !(!!item.name && !!item.url) ||
          !isValidUrl(item.url)
        ) {
          isValid = false
        } else if (item.url.substring(0, 8) !== 'https://') {
          isValid = false
          messages.push(this.$t('v2.merakiTemplates.httpServerNonHttpsMessage'))
        }
      })

      if (!isValid) {
        this.displayValidationFailureMessages(this.$t('v2.merakiTemplates.webhooks'), messages)
      }

      return isValid
    },

    validate_vlans (settings) {
      let isValid = true

      settings.forEach((item) => {
        if (
          !(!!item.subnet && !!item.id && !!item.name && !!item.applianceIp) ||
          !isValidCidr(item.subnet) ||
          !isValidIpAddress(item.applianceIp) ||
          !isValidNonNegativeInteger(item.id)
        ) {
          isValid = false
        }
      })

      if (!isValid) {
        this.displayValidationFailureMessages(this.$t('v2.merakiTemplates.vlans'))
      }

      return isValid
    },

    validate_static_routes (settings) {
      let isValid = true

      settings.forEach((item) => {
        if (
          !(!!item.subnet && !!item.name && !!item.gatewayIp) ||
          !isValidCidr(item.subnet) ||
          !isValidIpAddress(item.gatewayIp)
        ) {
          isValid = false
        }
      })

      if (!isValid) {
        this.displayValidationFailureMessages(this.$t('v2.merakiTemplates.staticRoutes'))
      }

      return isValid
    },

    validate_uplink_settings (settings) {
      let isValid = true

      const upLinks = ['wan1', 'wan2', 'cellular']
      upLinks.forEach(uplink => {
        if (settings.bandwidthLimits && settings.bandwidthLimits.hasOwnProperty(uplink)) {
          if ((settings.bandwidthLimits[uplink].limitUp && !isValidNonNegativeInteger(settings.bandwidthLimits[uplink].limitUp))) {
            isValid = false
          }

          if ((settings.bandwidthLimits[uplink].limitDown && !isValidNonNegativeInteger(settings.bandwidthLimits[uplink].limitDown))) {
            isValid = false
          }
        }
      })

      if (!isValid) {
        this.displayValidationFailureMessages(this.$t('v2.merakiTemplates.uplinkConfiguration'))
      }

      return isValid
    },

    validate_mr_l3_firewall_rules (settings) {
      let isValid = true

      settings.forEach((item) => {
        if (
          !(!!item.policy && !!item.protocol && !!item.destPort && !!item.destCidr) ||
          !(isValidCidr(item.destCidr) || item.destCidr.toLowerCase() === 'any' || item.destCidr.toLowerCase() === 'local lan') ||
          !(isValidPort(item.destPort) || isValidPortRange(item.destPort) || item.destPort.toLowerCase() === 'any')
        ) {
          isValid = false
        }
      })

      return isValid
    },

    validate_mx_l3_firewall_rules (settings) {
      let isValid = true

      settings.forEach((item) => {
        const destCidrValues = (item.destCidr || '').split(',').map(value => {
          return value.trim()
        })
        const srcCidrValues = (item.srcCidr || '').split(',').map(value => {
          return value.trim()
        })

        if (
          !(!!item.policy && !!item.protocol && !!item.destPort && !!item.destCidr && !!item.srcPort && !!item.srcCidr) ||
          !(destCidrValues.filter(destCidr => {
            return !(isValidCidr(destCidr) || isValidHostname(destCidr) || isValidPolicyObjectOrGroup(destCidr) || destCidr.toLowerCase() === 'any')
          }).length === 0) ||
          !(isValidPort(item.destPort) || isValidPortRange(item.destPort) || isValidPortList(item.destPort) || item.destPort.toLowerCase() === 'any') ||
          !(srcCidrValues.filter(srcCidr => {
            return !(isValidCidr(srcCidr) || isValidPolicyObjectOrGroup(srcCidr) || srcCidr.toLowerCase() === 'any')
          }).length === 0) ||
          !(isValidPort(item.srcPort) || isValidPortRange(item.srcPort) || isValidPortList(item.srcPort) || item.srcPort.toLowerCase() === 'any')
        ) {
          isValid = false
        }
      })

      if (!isValid) {
        this.displayValidationFailureMessages(this.$t('v2.merakiTemplates.layer3OutboundRules'))
      }

      return isValid
    },

    validate_mx_cellular_firewall_rules (settings) {
      let isValid = true

      settings.forEach((item) => {
        const destCidrValues = (item.destCidr || '').split(',').map(value => {
          return value.trim()
        })
        const srcCidrValues = (item.srcCidr || '').split(',').map(value => {
          return value.trim()
        })

        if (
          !(!!item.policy && !!item.protocol && !!item.destPort && !!item.destCidr && !!item.srcPort && !!item.srcCidr) ||
          !(destCidrValues.filter(destCidr => {
            return !(isValidCidr(destCidr) || isValidPolicyObjectOrGroup(destCidr) || destCidr.toLowerCase() === 'any')
          }).length === 0) ||
          !(isValidPort(item.destPort) || isValidPortRange(item.destPort) || isValidPortList(item.destPort) || item.destPort.toLowerCase() === 'any') ||
          !(srcCidrValues.filter(srcCidr => {
            return !(isValidCidr(srcCidr) || isValidPolicyObjectOrGroup(srcCidr) || srcCidr.toLowerCase() === 'any')
          }).length === 0) ||
          !(isValidPort(item.srcPort) || isValidPortRange(item.srcPort) || isValidPortList(item.srcPort) || item.srcPort.toLowerCase() === 'any')
        ) {
          isValid = false
        }
      })

      if (!isValid) {
        this.displayValidationFailureMessages(this.$t('v2.merakiTemplates.cellularFailOverRules'))
      }

      return isValid
    },

    validate_l7_firewall_rules (settings) {
      let isValid = true

      settings.forEach((item) => {
        if (
          !(!!item.policy && !!item.type && !!item.value) ||
          (item.type === 'applicationCategory' && !(!!item.value.id && /meraki:layer7\/category\/\d+/.test(item.value.id))) ||
          (item.type === 'application' && !(!!item.value.id && /meraki:layer7\/application\/\d+/.test(item.value.id))) ||
          (item.type === 'host' && !(isValidHostname(item.value) || item.value.toLowerCase() === 'any')) ||
          (item.type === 'port' && !(isValidPort(item.value) || isValidPortRange(item.value) || item.value.toLowerCase() === 'any')) ||
          (item.type === 'ipRange' && !(isValidCidrWithPortRange(item.value) || item.value.toLowerCase() === 'any'))
        ) {
          isValid = false
        }
      })

      return isValid
    },

    validate_mx_l7_firewall_rules (settings) {
      const isValid = this.validate_l7_firewall_rules(settings)

      if (!isValid) {
        this.displayValidationFailureMessages(this.$t('v2.merakiTemplates.layer7FirewallRules'))
      }

      return isValid
    },

    validate_mx_port_forwarding_rules (settings) {
      let isValid = true

      settings.forEach((item) => {
        if (
          !(!!item.uplink && !!item.protocol && !!item.publicPort && !!item.lanIp && !!item.localPort && (!!item.allowedIps && item.allowedIps.length > 0)) ||
          !(isValidPort(item.publicPort) || isValidPortRange(item.publicPort)) ||
          !(isValidPort(item.localPort) || isValidPortRange(item.localPort)) ||
          !(isValidIpAddress(item.lanIp)) ||
          item.allowedIps.filter(allowedIp => {
            return !(isValidIpAddress(allowedIp) || allowedIp.toLowerCase() === 'any')
          }).length > 0
        ) {
          isValid = false
        }
      })

      if (!isValid) {
        this.displayValidationFailureMessages(this.$t('v2.merakiTemplates.portForwardingRules'))
      }

      return isValid
    },

    validate_mx_1_to_1_nat_rules (settings) {
      let isValid = true

      settings.forEach((item) => {
        if (
          !(!!item.name && !!item.uplink && !!item.lanIp && !!item.publicIp) ||
          !(isValidIpAddress(item.lanIp)) ||
          !(isValidIpAddress(item.publicIp))
        ) {
          isValid = false
        }

        if (!!item.allowedInbound && item.allowedInbound.length > 0) {
          item.allowedInbound.forEach(inboundItem => {
            if (
              !(!!inboundItem.protocol && (!!inboundItem.destinationPorts && inboundItem.destinationPorts.length > 0) && (!!inboundItem.allowedIps && inboundItem.allowedIps.length > 0)) ||
              inboundItem.allowedIps.filter(allowedIp => {
                return !(isValidIpAddress(allowedIp) || allowedIp.toLowerCase() === 'any')
              }).length > 0 ||
              inboundItem.destinationPorts.filter(destinationPort => {
                return !isValidPort(destinationPort)
              }).length > 0
            ) {
              isValid = false
            }
          })
        }
      })

      if (!isValid) {
        this.displayValidationFailureMessages(this.$t('v2.merakiTemplates.oneToOneNatRules'))
      }

      return isValid
    },

    validate_mx_1_to_many_nat_rules (settings) {
      let isValid = true
      const messages = []

      settings.forEach((item) => {
        if (
          !(!!item.uplink && !!item.publicIp) ||
          !(isValidIpAddress(item.publicIp))
        ) {
          isValid = false
        }

        if (!(!!item.portRules && item.portRules.length > 0)) {
          messages.push(this.$t('v2.merakiTemplates.oneToManyNoPortRuleMessage'))
          isValid = false
        } else {
          item.portRules.forEach(portRule => {
            if (
              !(!!portRule.name && !!portRule.protocol && !!portRule.localPort && !!portRule.localIp && !!portRule.publicPort && (!!portRule.allowedIps && portRule.allowedIps.length > 0)) ||
              !(isValidPort(portRule.localPort)) ||
              !(isValidPort(portRule.publicPort)) ||
              !(isValidIpAddress(portRule.localIp)) ||
              portRule.allowedIps.filter(allowedIp => {
                return !(isValidIpAddress(allowedIp) || allowedIp.toLowerCase() === 'any')
              }).length > 0
            ) {
              isValid = false
            }
          })
        }
      })

      if (!isValid) {
        this.displayValidationFailureMessages(this.$t('v2.merakiTemplates.oneToManyNatRules'), messages)
      }

      return isValid
    },

    validate_traffic_shaping_rules (settings, target) {
      let isValid = true

      settings.forEach((item) => {
        if (
          !((!!item.definitions && item.definitions.length > 0) && !!item.perClientBandwidthLimits) ||
          !(item.perClientBandwidthLimits.settings)
        ) {
          isValid = false
        }

        item.definitions.forEach(definition => {
          if (
            !(!!definition.type && !!definition.value) ||
            (definition.type === 'applicationCategory' && !(!!definition.value.id && /meraki:layer7\/category\/\d+/.test(definition.value.id))) ||
            (definition.type === 'application' && !(!!definition.value.id && /meraki:layer7\/application\/\d+/.test(definition.value.id))) ||
            (definition.type === 'host' && !(isValidHostname(definition.value))) ||
            (definition.type === 'port' && !(isValidPort(definition.value))) ||
            (definition.type === 'ipRange' && !(isValidCidrWithPort(definition.value)))
          ) {
            isValid = false
          }
        })

        if (target === 'mx') {
          // Run validations for extra fields for mx
          if (
            !(item.priority)
          ) {
            isValid = false
          }
        }
      })

      return isValid
    },

    validate_traffic_shaping_settings (settings) {
      let isValid = true

      if (
        _.isNil(settings.defaultRulesEnabled) ||
        ((!!settings.rules && settings.rules.length > 0) && !this.validate_traffic_shaping_rules(settings.rules, 'mx'))
      ) {
        isValid = false
      }

      if (!isValid) {
        this.displayValidationFailureMessages(this.$t('v2.merakiTemplates.trafficShaping'))
      }

      return isValid
    },

    validate_site_to_site_vpn_settings (settings) {
      let isValid = true
      const messages = []

      if (
        !(settings.mode) ||
        (settings.hubs && settings.hubs.filter(hub => !hub.hubId).length > 0)
      ) {
        isValid = false
      }

      if (settings.mode === 'spoke' && !(!!settings.hubs && settings.hubs.length > 0)) {
        isValid = false
        messages.push(this.$t('v2.merakiTemplates.siteToSiteVpnNoHubsMessage'))
      }

      if (!isValid) {
        this.displayValidationFailureMessages(this.$t('v2.merakiTemplates.siteToSiteVpn'), messages)
      }

      return isValid
    },

    validate_firewalled_services (settings) {
      let isValid = true

      settings.forEach((item) => {
        if (
          !((!!item.service && !!item.access)) ||
          (item.access === 'restricted' && !(!!item.allowedIps && item.allowedIps.length > 0)) ||
          ((!!item.allowedIps && item.allowedIps.length > 0) && item.allowedIps.filter(allowedIp => {
            return !(isValidIpAddress(allowedIp) || isValidCidr(allowedIp))
          }).length > 0)
        ) {
          isValid = false
        }
      })

      if (!isValid) {
        this.displayValidationFailureMessages(this.$t('v2.merakiTemplates.securityApplianceServices'))
      }

      return isValid
    },

    validate_switch_acl_rules (settings) {
      let isValid = true

      settings.forEach((item) => {
        if (
          !(!!item.policy && !!item.ipVersion && !!item.protocol && !!item.srcPort && !!item.srcCidr && !!item.dstPort && !!item.dstCidr && !!item.vlan) ||
          !(isValidCidr(item.dstCidr) || item.dstCidr.toLowerCase() === 'any') ||
          !(isValidPort(item.dstPort) || item.dstPort.toLowerCase() === 'any') ||
          !(isValidCidr(item.srcCidr) || item.srcCidr.toLowerCase() === 'any') ||
          !(isValidPort(item.srcPort) || item.srcPort.toLowerCase() === 'any') ||
          !(isValidVlan(item.vlan) || item.vlan.toLowerCase() === 'any')
        ) {
          isValid = false
        }
      })

      if (!isValid) {
        this.displayValidationFailureMessages(this.$t('v2.merakiTemplates.aclRules'))
      }

      return isValid
    },

    validate_switch_qos_rules (settings) {
      let isValid = true

      settings.forEach((item) => {
        if (
          !(!!item.protocol && !!item.srcPort && !!item.dstPort && (!_.isNil(item.dscp))) ||
          !(isValidPort(item.dstPort) || item.dstPort.toLowerCase() === 'any') ||
          !(isValidPort(item.srcPort) || item.srcPort.toLowerCase() === 'any') ||
          (!!item.vlan && !(isValidVlan(item.vlan) || item.vlan.toLowerCase() === 'any'))
        ) {
          isValid = false
        }
      })

      if (!isValid) {
        this.displayValidationFailureMessages(this.$t('v2.merakiTemplates.qualityOfService'))
      }

      return isValid
    },

    validate_switch_port_schedules (settings) {
      let isValid = true

      if (settings.filter(scheduleItem => {
        return !scheduleItem.name
      }).length > 0) {
        isValid = false
      }

      if (!isValid) {
        this.displayValidationFailureMessages(this.$t('v2.merakiTemplates.switchPortSchedules'))
      }

      return isValid
    },

    validate_switch_settings (settings) {
      let isValid = true

      if (
        !(!!settings.vlan && !_.isNil(settings.useCombinedPower)) ||
        !(isValidVlan(settings.vlan))
      ) {
        isValid = false
      }

      if (!isValid) {
        this.displayValidationFailureMessages(this.$t('v2.merakiTemplates.generalSwitchSettings'))
      }

      return isValid
    },

    validate_switch_multicast_settings (settings) {
      let isValid = true

      if (
        !(settings.defaultSettings && !_.isNil(settings.defaultSettings.igmpSnoopingEnabled) && !_.isNil(settings.defaultSettings.floodUnknownMulticastTrafficEnabled))
      ) {
        isValid = false
      }

      if (!isValid) {
        this.displayValidationFailureMessages(this.$t('v2.merakiTemplates.generalSwitchSettings'))
      }

      return isValid
    },

    validate_alert_port_filter (filters) {
      return !!filters.selector
    },

    validate_alert_timeout_filter (filters) {
      return !!filters.timeout
    },

    validate_alert_usage_filter (filters) {
      return !!filters.period && !_.isNil(filters.threshold)
    },

    validate_alert_settings (settings) {
      let isValid = true
      const alertList = (settings.alerts ? settings.alerts : [])

      alertList.forEach(alert => {
        if (['applianceDown', 'gatewayDown', 'repeaterDown', 'portDown', 'switchDown'].indexOf(alert.type) > -1) {
          isValid &= this.validate_alert_timeout_filter(alert.filters || {})
        }

        if (['portDown', 'portError', 'portSpeed'].indexOf(alert.type) > -1) {
          isValid &= this.validate_alert_port_filter(alert.filters || {})
        }

        if (['usageAlert'].indexOf(alert.type) > -1) {
          isValid &= this.validate_alert_usage_filter(alert.filters || {})
        }
      })

      if (!isValid) {
        this.displayValidationFailureMessages(this.$t('v2.merakiTemplates.alertSettings'))
      }

      return isValid
    },

    validate_bonjour_forwarding_rules (settings, target) {
      let isValid = true

      settings.forEach((item) => {
        if (
          !(!!item.description && !!item.vlanId && (!!item.services && item.services.length > 0)) ||
          !isValidVlan(item.vlanId)
        ) {
          isValid = false
        }
      })

      return isValid
    },

    validate_single_group_policy (policyItem) {
      let isValid = true

      if (
        !(!!policyItem.name && !!policyItem.splashAuthSettings) ||
        (policyItem.bandwidth && policyItem.bandwidth.bandwidthLimits &&
          (!_.isNil(policyItem.bandwidth.bandwidthLimits.limitUp) && !isValidNonNegativeInteger(policyItem.bandwidth.bandwidthLimits.limitUp))) ||
        (policyItem.bandwidth && policyItem.bandwidth.bandwidthLimits &&
          (!_.isNil(policyItem.bandwidth.bandwidthLimits.limitDown) && !isValidNonNegativeInteger(policyItem.bandwidth.bandwidthLimits.limitDown))) ||
        (!_.isNil(policyItem.vlanTagging.vlanId) && !isValidVlan(policyItem.vlanTagging.vlanId)) ||
        (policyItem.firewallAndTrafficShaping && policyItem.firewallAndTrafficShaping.l3FirewallRules && !this.validate_mr_l3_firewall_rules(policyItem.firewallAndTrafficShaping.l3FirewallRules, 'mr')) ||
        (policyItem.firewallAndTrafficShaping && policyItem.firewallAndTrafficShaping.l7FirewallRules && !this.validate_l7_firewall_rules(policyItem.firewallAndTrafficShaping.l7FirewallRules)) ||
        (policyItem.firewallAndTrafficShaping && policyItem.firewallAndTrafficShaping.trafficShapingRules && !this.validate_traffic_shaping_rules(policyItem.firewallAndTrafficShaping.trafficShapingRules, 'mr')) ||
        (policyItem.bonjourForwarding && policyItem.bonjourForwarding.rules && !this.validate_bonjour_forwarding_rules(policyItem.bonjourForwarding.rules))
      ) {
        isValid = false
      }

      if (!isValid) {
        global.toastr['error'](this.$t('v2.merakiTemplates.groupPolicySettingsInvalidMessage').replace('{policy_name}', policyItem.name), this.$t('general.error'))
      }

      return isValid
    },

    validate_group_policies (settings) {
      let isValid = true

      if (settings.filter(policyItem => {
        return !policyItem.name
      }).length > 0) {
        isValid = false
        this.displayValidationFailureMessages(this.$t('v2.merakiTemplates.groupPolicies'))
      } else {
        settings.forEach(policyItem => {
          isValid &= this.validate_single_group_policy(policyItem)
        })
      }

      return isValid
    },

    validate_single_wireless_rf_profile (profileItem) {
      let isValid = true
      const messages = []

      if (
        !(!!profileItem.name && !!profileItem.bandSelectionType && !!profileItem.minBitrateType) ||
        (profileItem.twoFourGhzSettings && !(profileItem.twoFourGhzSettings.validAutoChannels && profileItem.twoFourGhzSettings.validAutoChannels.length > 0)) ||
        (profileItem.fiveGhzSettings && !(profileItem.fiveGhzSettings.validAutoChannels && profileItem.fiveGhzSettings.validAutoChannels.length > 0))
      ) {
        isValid = false
      }

      if (
        profileItem.twoFourGhzSettings && (
          (!_.isNil(profileItem.twoFourGhzSettings.minPower) && (profileItem.twoFourGhzSettings.minPower < 5 || profileItem.twoFourGhzSettings.minPower > 30)) ||
          (!_.isNil(profileItem.twoFourGhzSettings.maxPower) && (profileItem.twoFourGhzSettings.maxPower < 5 || profileItem.twoFourGhzSettings.maxPower > 30))
        )
      ) {
        isValid = false
        messages.push(this.$t('v2.merakiTemplates.wirelessRfProfile24PowerLimitsErrorMessage'))
      }

      if (
        profileItem.fiveGhzSettings && (
          (!_.isNil(profileItem.fiveGhzSettings.minPower) && (profileItem.fiveGhzSettings.minPower < 8 || profileItem.fiveGhzSettings.minPower > 30)) ||
          (!_.isNil(profileItem.fiveGhzSettings.maxPower) && (profileItem.fiveGhzSettings.maxPower < 8 || profileItem.fiveGhzSettings.maxPower > 30))
        )
      ) {
        isValid = false
        messages.push(this.$t('v2.merakiTemplates.wirelessRfProfile5PowerLimitsErrorMessage'))
      }

      if (!isValid) {
        global.toastr['error'](this.$t('v2.merakiTemplates.wirelessRfProfileSettingsInvalidMessage').replace('{profile_name}', profileItem.name), this.$t('general.error'))

        messages.forEach(message => {
          global.toastr['error'](message, this.$t('general.error'))
        })
      }

      return isValid
    },

    validate_wireless_rf_profiles (settings) {
      let isValid = true

      if (settings.filter(profileItem => {
        return !profileItem.name
      }).length > 0) {
        isValid = false
        this.displayValidationFailureMessages(this.$t('v2.merakiTemplates.wirelessRfProfiles'))
      } else {
        settings.forEach(profileItem => {
          isValid &= this.validate_single_wireless_rf_profile(profileItem)
        })
      }

      return isValid
    },

    validate_content_filtering_settings (settings) {
      let isValid = true

      if (
        (settings.hasOwnProperty('urlCategoryListSize') && !settings.urlCategoryListSize)
      ) {
        isValid = false
      }

      if (!isValid) {
        this.displayValidationFailureMessages(this.$t('v2.merakiTemplates.contentFiltering'))
      }

      return isValid
    },

    validate_malware_settings (settings) {
      let isValid = true

      if (
        (!settings.mode) ||
        (settings.allowedUrls && settings.allowedUrls.length > 0 && settings.allowedUrls.filter(item => {
          return !item.url
        }).length > 0) ||
        (settings.allowedFiles && settings.allowedFiles.length > 0 && settings.allowedFiles.filter(item => {
          return !item.sha256
        }).length > 0)
      ) {
        isValid = false
      }

      if (!isValid) {
        this.displayValidationFailureMessages(this.$t('v2.merakiTemplates.malwareProtection'))
      }

      return isValid
    },

    validate_intrusion_settings (settings) {
      let isValid = true

      if (
        (settings.protectedNetworks && settings.protectedNetworks.includedCidr &&
          settings.protectedNetworks.includedCidr.length > 0 && settings.protectedNetworks.includedCidr.filter(item => {
          return !(isValidCidr(item) || isValidIpAddress(item))
        }).length > 0) ||
        (settings.protectedNetworks && settings.protectedNetworks.excludedCidr &&
          settings.protectedNetworks.excludedCidr.length > 0 && settings.protectedNetworks.excludedCidr.filter(item => {
          return !(isValidCidr(item) || isValidIpAddress(item))
        }).length > 0)
      ) {
        isValid = false
      }

      if (!isValid) {
        this.displayValidationFailureMessages(this.$t('v2.merakiTemplates.intrusionDetection'))
      }

      return isValid
    },

    validate_single_switch_profile (profileItem) {
      let isValid = true
      let invalidPort = null

      for (let i = 0; i < profileItem.ports.length; i++) {
        const portItem = profileItem.ports[i]

        // Run field value validations
        if (
          !(isValidNonNegativeInteger(portItem.portId) && portItem.portId > 0) ||
          (portItem.vlan && !(isValidSwitchPortVlan(portItem.vlan))) ||
          (portItem.voiceVlan && !(isValidSwitchPortVlan(portItem.voiceVlan))) ||
          (portItem.hasOwnProperty('stickyMacAllowListLimit') && !(
            isValidNonNegativeInteger(portItem.stickyMacAllowListLimit) && portItem.stickyMacAllowListLimit > 0 && portItem.stickyMacAllowListLimit <= 20)
          )
        ) {
          invalidPort = portItem
          isValid = false
          break
        }

        if (portItem.allowedVlans && portItem.allowedVlans !== 'all') {
          const vlanElements = portItem.allowedVlans.split(',')
          for (let j = 0; j < vlanElements.length; j++) {
            const element = vlanElements[j]

            if (isValidSwitchPortVlan(element)) {
              // Valid, single vlan
              continue
            }

            if (/^[0-9]+-[0-9]+$/.test(element)) {
              const limits = element.split('-')
              const limitLow = parseInt(limits[0])
              const limitHigh = parseInt(limits[1])

              if (isValidSwitchPortVlan(limitLow) && isValidSwitchPortVlan(limitHigh) && (limitLow < limitHigh)) {
                // Valid, vlan range (like 1-10)
                continue
              }
            }

            // Doe not match any of the valid cases
            invalidPort = portItem
            isValid = false
            break
          }
        }

        // Run type / access policy value dependent field validations
        if (
          (portItem.type === 'trunk' && !portItem.allowedVlans) ||
          (portItem.type === 'access' && !portItem.vlan) ||
          (portItem.type === 'access' && portItem.accessPolicyType === 'MAC allow list' && _.isEmpty(portItem.macAllowList)) ||
          (portItem.type === 'access' && portItem.accessPolicyType === 'Sticky MAC allow list' && (!portItem.stickyMacAllowListLimit))
        ) {
          invalidPort = portItem
          isValid = false
          break
        }
      }

      if (!isValid) {
        global.toastr['error'](this.$t('v2.merakiTemplates.switchProfileSettingsInvalidMessage').replace('{profile_name}', profileItem.name).replace('{port_id}', invalidPort.portId), this.$t('general.error'))
      }

      return isValid
    },

    validate_switch_profiles (settings) {
      let isValid = true
      const messages = []

      if (settings.filter(profileItem => {
        return !profileItem.name || !profileItem.switch_model || profileItem.ports.length === 0 || profileItem.ports.filter(port => !port.portId).length > 0
      }).length > 0) {
        isValid = false
      }

      if (isValid) {
        settings.forEach(profileItem => {
          isValid &= this.validate_single_switch_profile(profileItem)
        })
      }

      if (!isValid) {
        this.displayValidationFailureMessages(this.$t('v2.merakiTemplates.switchProfiles'), messages)
        return false
      }

      return isValid
    },

    validate_ssids (settings) {
      // Perform global ssid validations first
      let isValid = true
      const messages = []

      if (settings.filter(ssid => {
        return !ssid.definition.name
      }).length > 0) {
        isValid = false
      }

      const ssidNames = settings.map(ssid => {
        return ssid.definition.name
      })
      if (
        (new Set(ssidNames)).size !== ssidNames.length
      ) {
        messages.push(this.$t('v2.merakiTemplates.ssidDuplicateNamesErrorMessage'))
        isValid = false
      }

      if (!isValid) {
        this.displayValidationFailureMessages(this.$t('v2.merakiTemplates.definedSSIDs'), messages)
        return false
      }

      // Now go over ssid settings for each ssid
      isValid = true
      settings.forEach(ssid => {
        Object.keys(ssid).forEach(fieldKey => {
          const validationMethodIdentifier = `validate_ssid_${fieldKey}`
          const ssidIdentifier = {
            name: ssid.definition.name
          }

          if (
            !!ssid[fieldKey] &&
            !_.isEmpty(ssid[fieldKey]) &&
            this.hasOwnProperty(validationMethodIdentifier)
          ) {
            isValid &= this[validationMethodIdentifier](ssid[fieldKey], ssidIdentifier)
          }
        })
      })

      return isValid
    },

    validate_ssid_access_control (settings, ssid) {
      let isValid = true
      const messages = []

      if (
        !(!!settings.authMode && !!settings.splashPage) ||
        ((settings.authMode === 'psk' || settings.authMode === 'wpa12') && !settings.psk) ||
        ((settings.authMode === 'psk' || settings.authMode === '8021x-meraki' || settings.authMode === '8021x-radius' || settings.authMode === 'ipsk-with-radius' || settings.authMode === 'ipsk-without-radius') && !settings.encryptionMode) ||
        (((settings.authMode === 'psk' || settings.authMode === '8021x-meraki' || settings.authMode === '8021x-radius' || settings.authMode === 'ipsk-with-radius' || settings.authMode === 'ipsk-without-radius') && (settings.encryptionMode === 'wpa' || settings.encryptionMode === 'wpa-eap')) && !settings.wpaEncryptionMode)
      ) {
        isValid = false
      }

      if (
        (settings.authMode === 'psk' && settings.encryptionMode === 'wep') &&
        !(/[0-9a-fA-F]{10}$/.test(settings.psk) || /[0-9a-fA-F]{26}$/.test(settings.psk))
      ) {
        messages.push(this.$t('v2.merakiTemplates.wepPskFormatErrorMessage'))
        isValid = false
      } else if (!!settings.psk && settings.psk.length < 8) {
        messages.push(this.$t('v2.merakiTemplates.pskMinLengthMessage'))
        isValid = false
      }

      if (
        (settings.authMode === 'open-with-radius' || settings.authMode === '8021x-radius' || settings.authMode === 'ipsk-with-radius' || settings.splashPage === 'Password-protected with custom RADIUS') &&
        !(settings.radiusServers && settings.radiusServers.length > 0)
      ) {
        messages.push(this.$t('v2.merakiTemplates.noRadiusErrorMessage'))
        isValid = false
      }

      if (
        settings.splashPage === 'Sponsored guest' &&
        (!settings.splashGuestSponsorDomains || settings.splashGuestSponsorDomains.length === 0)) {
        messages.push(this.$t('v2.merakiTemplates.noSplashSponsorDomainsErrorMessage'))
        isValid = false
      }

      if (!isValid) {
        this.displaySSIDValidationFailureMessages(this.$t('v2.merakiTemplates.networkAccess'), ssid.name, messages)
      }

      return isValid
    },

    validate_radius_server (serverData) {
      return (!!serverData.host && !!serverData.port && !!serverData.secret) &&
        (isValidIpAddress(serverData.host) || isValidHostname(serverData.host)) &&
        isValidPort(serverData.port)
    },

    validate_ssid_radius_settings (settings, ssid) {
      let isValid = true
      const messages = []

      if (
        (settings.radiusServers && settings.radiusServers.length > 0 && settings.radiusServers.filter(server => {
          return !this.validate_radius_server(server)
        }).length > 0) ||
        (settings.radiusAccountingServers && settings.radiusAccountingServers.length > 0 && settings.radiusAccountingServers.filter(server => {
          return !this.validate_radius_server(server)
        }).length > 0)
      ) {
        isValid = false
      }

      if ((settings.radiusAccountingEnabled && !(settings.radiusAccountingServers && settings.radiusAccountingServers.length > 0))) {
        messages.push(this.$t('v2.merakiTemplates.noRadiusAccountingServerErrorMessage'))
        isValid = false
      }

      if (!isValid) {
        this.displaySSIDValidationFailureMessages(this.$t('v2.merakiTemplates.radiusServers'), ssid.name, messages)
      }

      return isValid
    },

    validate_ssid_walled_garden_settings (settings, ssid) {
      let isValid = true
      const messages = []

      if (!!settings.walledGardenRanges && settings.walledGardenRanges.filter(walledGardenRange => {
        return !(isValidHostname(walledGardenRange) || isValidCidr(walledGardenRange) || isValidIpAddress(walledGardenRange) || isValidDomainWildcard(walledGardenRange))
      }).length > 0) {
        isValid = false
      }

      if ((settings.walledGardenEnabled && (!settings.walledGardenRanges || _.isEmpty(settings.walledGardenRanges)))) {
        messages.push(this.$t('v2.merakiTemplates.noWalledGardenRangesErrorMessage'))
        isValid = false
      }

      if (!isValid) {
        this.displaySSIDValidationFailureMessages(this.$t('v2.merakiTemplates.walledGarden'), ssid.name, messages)
      }

      return isValid
    },

    validate_ssid_traffic_settings (settings, ssid) {
      let isValid = true
      const messages = []

      if (
        (!!settings.defaultVlanId && !isValidVlan(settings.defaultVlanId)) ||
        (settings.apTagsAndVlanIds && settings.apTagsAndVlanIds.length > 0 && settings.apTagsAndVlanIds.filter(item => {
          return !(!!item.tags && item.tags.length > 0 && !!item.vlanId && isValidVlan(item.vlanId))
        }).length > 0)
      ) {
        isValid = false
      }

      if ((settings.useVlanTagging && !settings.defaultVlanId)) {
        messages.push(this.$t('v2.merakiTemplates.noDefaultVlanIdErrorMessage'))
        isValid = false
      }

      if (!isValid) {
        this.displaySSIDValidationFailureMessages(this.$t('v2.merakiTemplates.addressingAndTraffic'), ssid.name, messages)
      }

      return isValid
    },

    validate_ssid_availability_settings (settings, ssid) {
      let isValid = true
      const messages = []

      if ((settings.availableOnAllAps === false && !(settings.availabilityTags && settings.availabilityTags.length > 0))) {
        messages.push(this.$t('v2.merakiTemplates.noAvailabilityTagsErrorMessage'))
        isValid = false
      }

      if (!isValid) {
        this.displaySSIDValidationFailureMessages(this.$t('v2.merakiTemplates.availability'), ssid.name, messages)
      }

      return isValid
    },

    validate_ssid_definition (settings, ssid) {
      return this.validate_ssid_access_control(settings, ssid) &&
        this.validate_ssid_radius_settings(settings, ssid) &&
        this.validate_ssid_walled_garden_settings(settings, ssid) &&
        this.validate_ssid_traffic_settings(settings, ssid) &&
        this.validate_ssid_availability_settings(settings, ssid)
    },

    validate_ssid_splash_page_settings (settings, ssid) {
      let isValid = true

      if (
        (!!settings.splashUrl && !isValidUrl(settings.splashUrl)) ||
        (!!settings.redirectUrl && !isValidUrl(settings.redirectUrl))
      ) {
        isValid = false
      }

      if (!isValid) {
        this.displaySSIDValidationFailureMessages(this.$t('v2.merakiTemplates.networkAccess'), ssid.name)
      }

      return isValid
    },

    validate_ssid_mr_l3_firewall_rules (settings, ssid) {
      const isValid = this.validate_mr_l3_firewall_rules(settings)

      if (!isValid) {
        this.displaySSIDValidationFailureMessages(this.$t('v2.merakiTemplates.layer3OutboundRules'), ssid.name)
      }

      return isValid
    },

    validate_ssid_traffic_shaping_settings (settings, ssid) {
      let isValid = true

      if (
        !(!_.isNil(settings.trafficShapingEnabled) && !_.isNil(settings.defaultRulesEnabled)) ||
        ((!!settings.rules && settings.rules.length > 0) && !this.validate_traffic_shaping_rules(settings.rules, 'mr'))
      ) {
        isValid = false
      }

      if (!isValid) {
        this.displaySSIDValidationFailureMessages(this.$t('v2.merakiTemplates.trafficShaping'), ssid.name)
      }

      return isValid
    },

    validate_ssid_identity_psks (settings, ssid) {
      let isValid = true
      const messages = []

      settings.forEach((item) => {
        if (
          !(!!item.name && !!item.passphrase && !!item.groupPolicyId)
        ) {
          isValid = false
        }

        if (item.passphrase.length < 8 || item.passphrase.length > 63) {
          messages.push(this.$t('v2.merakiTemplates.wpa2PskLengthRangeMessage'))
          isValid = false
        }
      })

      if (!isValid) {
        this.displaySSIDValidationFailureMessages(this.$t('v2.merakiTemplates.identityPsks'), ssid.name, messages)
      }

      return isValid
    },

    validate_ssid_bonjour_forwarding_rules (settings, ssid) {
      let isValid = true

      const rules = settings.rules || []
      rules.forEach((rule) => {
        if (!isValidVlan(rule.vlanId) || !(!!rule.services && rule.services.length > 0)) {
          isValid = false
        }
      })

      if (!isValid) {
        this.displaySSIDValidationFailureMessages(this.$t('v2.merakiTemplates.bonjourForwarding'), ssid.name)
      }

      return isValid
    }
  }
}
