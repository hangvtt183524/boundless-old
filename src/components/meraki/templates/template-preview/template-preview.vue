<template lang="pug">
  .template-preview
    .template-preview__header
      .template-preview__header__title
        | {{ template.name }}

    perfect-scrollbar.template-preview__content
      .template-preview__content__category(
        v-for="category of configuredSettings"
        :key="category.key"
      )
        .template-preview__content__category__title
          | {{ $t('v2.merakiTemplates.settingCategories.' + category.key) }}
        .template-preview__content__category__settings
          .template-preview__content__category__setting(
            v-for="setting of category.settings"
            :key="setting.key"
          )
            | {{ $t('v2.merakiTemplates.settings.' + setting.key) }}
            .template-preview__content__category__setting__warning(
              v-if="setting.overwrite"
            ) {{ setting.hasValue ? $t('v2.merakiTemplates.overwriteSettingsPreviewWarning') : $t('v2.merakiTemplates.clearSettingsPreviewWarning') }}

</template>

<script>
import _ from 'lodash'
import NetworkSettingsPageMixin from '@/mixins/network-settings-page.mixin'

export default {
  name: 'template-preview',
  mixins: [
    NetworkSettingsPageMixin
  ],
  props: {
    template: {
      type: Object,
      required: true
    },
    assignSwitchProfiles: {
      type: Boolean
    }
  },
  data: function () {
    return {
      settingMap: {
        'traffic-analysis': ['traffic_analysis_settings'],
        'syslog-servers': ['syslog_servers'],
        'snmp': ['snmp_settings'],
        'net-flow': ['net_flow_settings'],
        'alert-settings': ['alert_settings'],
        'http-servers': ['http_servers'],
        'group-policies': ['group_policies'],
        'vlans': ['vlans', 'vlans_state'],
        'static-routes': ['static_routes'],
        'mx-l3-firewall-rules': ['mx_l3_firewall_rules'],
        'mx-cellular-firewall-rules': ['mx_cellular_firewall_rules'],
        'firewalled-services': ['firewalled_services'],
        'mx-l7-firewall-rules': ['mx_l7_firewall_rules'],
        'mx-port-forwarding-rules': ['mx_port_forwarding_rules'],
        'mx-1-to-1-nat-rules': ['mx_1_to_1_nat_rules'],
        'mx-1-to-many-nat-rules': ['mx_1_to_many_nat_rules'],
        'site-to-site-vpn': ['site_to_site_vpn_settings'],
        'uplink-configuration': ['uplink_settings'],
        'traffic-shaping': ['traffic_shaping_settings'],
        'content-filtering': ['content_filtering_settings'],
        'switch-acl-rules': ['switch_acl_rules'],
        'switch-port-schedules': ['switch_port_schedules'],
        'switch-settings': ['switch_settings', 'switch_stp_settings', 'switch_multicast_settings', 'switch_mtu_settings'],
        'switch-qos-rules': ['switch_qos_rules'],
        'switch-profiles': ['switch_profiles'],
        'ssids': ['ssids'],
        'wireless-rf-profiles': ['wireless_rf_profiles']
      },
      switchProfilesSettingField: 'switch_profiles'
    }
  },
  computed: {
    configuredSettings () {
      const configuredSettings = []

      this.visibleCategories.forEach(category => {
        category.sections.forEach(categorySection => {
          categorySection.settings.forEach(settingKey => {
            if (!(this.settingMap.hasOwnProperty(settingKey))) {
              // Not in map, skip settings
              return
            }

            let hasValue = false
            let overwrite = false
            for (let settingField of this.settingMap[settingKey]) {
              if (!_.isEmpty(this.template[settingField]) && !_.isNil(this.template[settingField])) {
                // Setting defined and not empty.
                hasValue = true
              }

              if (this.template.customizations.filter(item => item.setting === settingKey).length > 0) {
                // We have a customization for setting
                hasValue = true
              }

              if ((settingField === this.switchProfilesSettingField) && !this.assignSwitchProfiles) {
                // Even if settings defined, if assign switch is set to false for switch profiles, revert state.
                hasValue = false
              }

              if (this.template.settings_to_overwrite.indexOf(settingField) > -1) {
                overwrite = true
              }
            }

            if (hasValue || overwrite) {
              // Setting has value, or set to overwrite. Add corresponding entry.
              let categoryObject = configuredSettings.find(item => item.key === category.key)
              if (!categoryObject) {
                categoryObject = {
                  key: category.key,
                  settings: []
                }
                configuredSettings.push(categoryObject)
              }

              categoryObject.settings.push({
                key: settingKey,
                hasValue: hasValue,
                overwrite: overwrite
              })
            }
          })
        })
      })

      return configuredSettings
    }
  }
}
</script>

<style src="./template-preview.scss" lang="scss" scoped></style>
