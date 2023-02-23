<template lang="pug">
  .compliance-check-detail
    v-layout(row wrap)
      v-flex(xs12 lg3)
        .compliance-check-detail__section.compliance-check-detail__category-selection
          .compliance-check-detail__section__header
            .compliance-check-detail__category-selection__header__back-link-container
              v-icon.compliance-check-detail__category-selection__header__back-link-container__back-icon(
                @click="onBackClick"
              ) keyboard_backspace
            .compliance-check-detail__category-selection__header__title
              | {{ checkTitle }}

          .compliance-check-detail__section__content
            perfect-scrollbar.compliance-check-detail__section__content__scroll-area
              template-setting-category-list-item(
                v-for="(category, index) of visibleCategories"
                :key="category.key"
                :category="category"
                :selected-section="selectedSection"
                :initially-expanded="index === 0"
                @sectionSelect="onSectionSelect"
              )

      v-flex(xs12 lg9)
        .compliance-check-detail__section.compliance-check-detail__template-management
          .compliance-check-detail__section__header.compliance-check-detail__template-management__header
            .compliance-check-detail__template-management__header__back-link-container(
              v-if="isSettingDetailView"
            )
              v-icon.compliance-check-detail__template-management__header__back-link-container__back-icon(
                @click="onSettingBackClick"
              ) keyboard_backspace
            .compliance-check-detail__template-management__header__title
              |  {{ (isSettingDetailView && !!settingDetailTitle) ? settingDetailTitle : $t('v2.merakiTemplates.settingCategories.' + selectedSection.key) }}
            .compliance-check-detail__template-management__header__actions
              base-button.base-button--danger.compliance-check-detail__header__actions__action(
                v-if="!complianceCheck.is_dismissed"
                @click="onDismissClick"
              ) {{ $t('tags.dismiss') }}

          .compliance-check-detail__section__content
            perfect-scrollbar.compliance-check-detail__section__content__scroll-area(
              id="template-detail-content-scroll-area"
            )
              .compliance-check-detail__section__content__setting-item(
                v-for="setting of selectedSection.settings"
                :key="setting"
              )
                component(
                  v-if="isComponentRenderEnabled(setting)"
                  v-bind:is="settingComponents[setting]"
                  :value="comparisonValue"
                  :original-value="comparisonValue"
                  operation-mode="compliance"
                  :is-fixed="true"
                  @detailViewToggle="onSettingDetailViewToggle"
                  :ref="`setting_${setting}`"
                )

    .compliance-check-detail__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )
</template>

<script>
import { mapActions } from 'vuex'
import BaseButton from '@/components/v2/base-button/base-button'
import BaseSelect from '@/components/v2/base-select/base-select'
import NetworkSettingsPageMixin from '@/mixins/network-settings-page.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import TemplateSettingCategoryListItem
  from '@/components/meraki/templates/template-setting-category-list-item/template-setting-category-list-item'
import categories from '@/components/meraki/templates/template-detail/setting-categories'

export default {
  name: 'compliance-check-detail',
  components: { BaseSelect, BaseButton, TemplateSettingCategoryListItem },
  mixins: [
    NetworkSettingsPageMixin,
    CurrentNodeSelectionsMixin
  ],
  props: {
    complianceCheckId: {
      type: Number,
      required: true
    }
  },
  data: function () {
    return {
      loading: false,
      complianceCheck: {},
      settingComponents: {},
      fieldComponents: {
        traffic_shaping_settings: 'traffic-shaping',
        content_filtering_settings: 'content-filtering',
        malware_settings: 'malware-protection',
        intrusion_settings: 'intrusion-detection-protection',
        firewalled_services: 'firewalled-services',
        group_policies: 'group-policies',
        http_servers: 'http-servers',
        mx_1_to_1_nat_rules: 'mx-1-to-1-nat-rules',
        mx_1_to_many_nat_rules: 'mx-1-to-many-nat-rules',
        mx_cellular_firewall_rules: 'mx-cellular-firewall-rules',
        mx_l3_firewall_rules: 'mx-l3-firewall-rules',
        mx_l7_firewall_rules: 'mx-l7-firewall-rules',
        mx_port_forwarding_rules: 'mx-port-forwarding-rules',
        net_flow_settings: 'net-flow',
        wireless_rf_profiles: 'wireless-rf-profiles',
        snmp_settings: 'snmp',
        static_routes: 'static-routes',
        switch_acl_rules: 'switch-acl-rules',
        switch_qos_rules: 'switch-qos-rules',
        switch_port_schedules: 'switch-port-schedules',
        switch_settings: 'switch-settings',
        switch_stp_settings: 'switch-settings',
        switch_multicast_settings: 'switch-settings',
        switch_mtu_settings: 'switch-settings',
        syslog_servers: 'syslog-servers',
        traffic_analysis_settings: 'traffic-analysis',
        uplink_settings: 'uplink-configuration',
        vlans_state: 'vlans',
        vlans: 'vlans',
        site_to_site_vpn_settings: 'site-to-site-vpn',
        alert_settings: 'alert-settings',
        ssids: 'ssids'
      }
    }
  },
  mounted () {
    this.retrieveConfigurationComplianceCheck()
  },
  computed: {
    checkSettings () {
      // Return setting components for current check
      return [
        ...(new Set(this.nonCompliantFields.filter(field => {
          return !!this.fieldComponents[field.field]
        }).map(field => {
          return this.fieldComponents[field.field]
        })))
      ]
    },
    visibleCategories () {
      // Return categories / sections / settings that exist in current check only

      return categories.filter(category => {
        return category.sections.filter(section => {
          return section.settings.filter(setting => {
            return this.checkSettings.indexOf(setting) > -1
          }).length > 0
        }).length > 0
      }).map(category => {
        return {
          ...category,
          sections: category.sections.filter(section => {
            return section.settings.filter(setting => {
              return this.checkSettings.indexOf(setting) > -1
            }).length > 0
          }).map(section => {
            return {
              ...section,
              settings: section.settings.filter(setting => {
                return this.checkSettings.indexOf(setting) > -1
              })
            }
          })
        }
      })
    },
    checkTitle () {
      if (this.complianceCheck && this.complianceCheck.meraki_network) {
        return `${this.complianceCheck.meraki_network.name} - ${this.$t('v2.securityCompliance.missingRules')}`
      }

      return this.$t('v2.securityCompliance.missingRules')
    },
    nonCompliantFields () {
      return this.complianceCheck.non_compliant_fields ? this.complianceCheck.non_compliant_fields : []
    },
    comparisonValue () {
      const comparisonValue = {}

      this.nonCompliantFields.forEach(field => {
        comparisonValue[field.field] = field.comparison.rule_set
      })

      return comparisonValue
    }
  },
  methods: {
    ...mapActions('workspace/network', ['retrieveMerakiConfigurationComplianceCheck', 'updateMerakiConfigurationComplianceCheck']),
    retrieveConfigurationComplianceCheck () {
      this.loading = true
      this.retrieveMerakiConfigurationComplianceCheck({
        workspaceId: this.workspaceId,
        complianceCheckId: this.complianceCheckId
      }).then(response => {
        this.$set(this, 'complianceCheck', JSON.parse(JSON.stringify(response.data.data)))

        // Select first section by default,
        this.$set(this, 'selectedSection', this.visibleCategories[0].sections[0])
      }).finally(() => {
        this.loading = false
      })
    },
    onDismissClick () {
      this.loading = true
      this.updateMerakiConfigurationComplianceCheck({
        workspaceId: this.workspaceId,
        complianceCheckId: this.complianceCheckId,
        is_dismissed: true
      }).then(response => {
        global.toastr['success'](this.$t('v2.securityCompliance.complianceCheckDismissSuccess'), this.$t('general.success'))

        this.$set(this, 'complianceCheck', JSON.parse(JSON.stringify(response.data.data)))
      }).catch(() => {
        global.toastr['error'](this.$t('v2.securityCompliance.complianceCheckDismissFailure'), this.$t('general.error'))
      }).finally(() => {
        this.loading = false
      })
    },
    loadSettingComponent (componentKey) {
      import(`../../templates/template-setting-items/${componentKey}.vue`).then(component => {
        this.$set(this.settingComponents, componentKey, component.default)
      })
    },
    isComponentRenderEnabled (componentKey) {
      return this.settingComponents.hasOwnProperty(componentKey)
    },
    onBackClick () {
      this.$router.go(-1)
    }
  }
}
</script>

<style src="./compliance-check-detail.scss" lang="scss" scoped></style>
