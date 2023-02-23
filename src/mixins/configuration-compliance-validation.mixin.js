// Mixin providing validation methods for Meraki network settings, in the context of compliance rule sets
import _ from 'lodash'
import NetworkTemplateValidationMixin from '@/mixins/network-template-validation.mixin'
import { isValidPort, isValidCidr, isValidCidrWithPort, isValidHostname, isValidIpAddress, isValidVlan,
  isValidDomainWildcard, isValidUrl } from '@/utils/form-fields-validation-rules'

export default {

  mixins: [
    NetworkTemplateValidationMixin
  ],

  methods: {
    validate () {
      let validationResult = true

      Object.keys(this.ruleSet).forEach(fieldKey => {
        const validationMethodIdentifier = `validate_${fieldKey}`
        if (
          !!this.ruleSet[fieldKey] &&
          !_.isEmpty(this.ruleSet[fieldKey]) &&
          this.hasOwnProperty(validationMethodIdentifier)
        ) {
          validationResult &= this[validationMethodIdentifier](this.ruleSet[fieldKey])
        }
      })

      return validationResult
    },

    validate_net_flow_settings (settings) {
      let isValid = true

      if (
        (!!settings.collectorIp === true && !isValidIpAddress(settings.collectorIp)) ||
        (!!settings.collectorPort === true && !isValidPort(settings.collectorPort))
      ) {
        isValid = false
      }

      if (!isValid) {
        this.displayValidationFailureMessages(this.$t('v2.merakiTemplates.netFlow'))
      }

      return isValid
    },

    validate_snmp_settings (settings) {
      let isValid = true

      if (settings.access === 'users') {
        if (!_.isEmpty(settings.users) && settings.users.filter(user => {
          return !(!!user.username && !!user.passphrase)
        }).length > 0) {
          isValid = false
        }
      }

      return isValid
    },

    validate_site_to_site_vpn_settings (settings) {
      return true
    },

    validate_firewalled_services (settings) {
      let isValid = true

      settings.forEach((item) => {
        if (
          !((!!item.service && !!item.access)) ||
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

    validate_traffic_shaping_rules (settings, target) {
      let isValid = true

      settings.forEach((item) => {
        if (
          !(item.perClientBandwidthLimits && item.perClientBandwidthLimits.settings)
        ) {
          isValid = false
        }

        if (!_.isEmpty(item.definitions)) {
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
        }
      })

      return isValid
    },

    validate_mx_1_to_1_nat_rules (settings) {
      let isValid = true

      settings.forEach((item) => {
        if (
          !(!!item.uplink && !!item.lanIp && !!item.publicIp) ||
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
              !(!!portRule.protocol && !!portRule.localPort && !!portRule.localIp && !!portRule.publicPort && (!!portRule.allowedIps && portRule.allowedIps.length > 0)) ||
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

    validate_ssid_access_control (settings, ssid) {
      let isValid = true
      const messages = []

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

      if (!isValid) {
        this.displaySSIDValidationFailureMessages(this.$t('v2.merakiTemplates.networkAccess'), ssid.name, messages)
      }

      return isValid
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

      if (!isValid) {
        this.displaySSIDValidationFailureMessages(this.$t('v2.merakiTemplates.addressingAndTraffic'), ssid.name, messages)
      }

      return isValid
    },

    validate_http_servers (settings) {
      let isValid = true
      const messages = []

      settings.forEach((item) => {
        if (
          !(item.url && isValidUrl(item.url))
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
    }

  }

}
