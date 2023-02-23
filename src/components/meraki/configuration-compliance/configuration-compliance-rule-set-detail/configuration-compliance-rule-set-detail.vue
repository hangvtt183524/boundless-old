<template lang="pug">
  .configuration-compliance-rule-set-detail
    .configuration-compliance-rule-set-detail__definition
      .configuration-compliance-rule-set-detail__header
        .configuration-compliance-rule-set-detail__header__back-link-container
          v-icon.configuration-compliance-rule-set-detail__header__back-link-container__back-icon(
          @click="onBackClick"
          ) keyboard_backspace
        h4.configuration-compliance-rule-set-detail__header__page-title
          | {{ isExistingRuleSet ? originalRuleSet.name : $t('v2.securityCompliance.newRuleSet') }}
        .configuration-compliance-rule-set-detail__header__actions
          base-button.base-button--green.configuration-compliance-rule-set-detail__header__actions__action(
            @click="onSaveClick"
            :disabled="!(isValid && isValueChanged)"
          ) {{ $t('general.saveChanges') }}
          base-button.base-button--green--negative.configuration-compliance-rule-set-detail__header__actions__action(
            @click="onResetClick"
            :disabled="!isValueChanged"
          ) {{ $t('builder.reset') }}

      .configuration-compliance-rule-set-detail__body
        .configuration-compliance-rule-set-detail__field-row
            v-layout(row wrap)
              v-flex(xs6 md4 lg3 xl2)
                label {{ $t('v2.securityCompliance.complianceRuleName') }}
              v-flex(xs6 md4 lg3 xl2)
                base-text-input(
                  v-model="ruleSet.name"
                  :validations="{required: true}"
                  :show-validation-state="submitted"
                )

        .configuration-compliance-rule-set-detail__field-row
          v-layout(row wrap)
            v-flex(xs6 md4 lg3 xl2)
              label {{ $t('v2.securityCompliance.whichOrganizationsToAudit') }}
            v-flex(xs6 md8 lg9 xl10)
              meraki-workspace-target-selection(
                v-model="ruleSet.targets"
                :target-types="['network', 'tag']"
              )

    .configuration-compliance-rule-set-detail__configuration.configuration-section
      v-layout(row wrap)
        v-flex(xs12 lg3)
          .configuration-section__section.configuration-section__category-selection
            .configuration-section__section__header
              .configuration-section__category-selection__header__title
                | {{ $t('v2.merakiTemplates.rules') }}

            .configuration-section__section__content
              perfect-scrollbar.configuration-section__section__content__scroll-area
                template-setting-category-list-item(
                  v-for="(category, index) of visibleCategories"
                  :key="category.key"
                  :category="category"
                  :selected-section="selectedSection"
                  :initially-expanded="index === 0"
                  @sectionSelect="onSectionSelect"
                )

        v-flex(xs12 lg9)
          .configuration-section__section.configuration-section__template-management
            .configuration-section__section__header.configuration-section__template-management__header
              .configuration-section__template-management__header__back-link-container(
                v-if="isSettingDetailView"
              )
                v-icon.configuration-section__template-management__header__back-link-container__back-icon(
                  @click="onSettingBackClick"
                ) keyboard_backspace
              .configuration-section__template-management__header__title
                |  {{ (isSettingDetailView && !!settingDetailTitle) ? settingDetailTitle : $t('v2.merakiTemplates.settingCategories.' + selectedSection.key) }}

            .configuration-section__section__content
              perfect-scrollbar.configuration-section__section__content__scroll-area
                .configuration-section__section__content__setting-item(
                  v-for="setting of selectedSection.settings"
                  :key="setting"
                )
                  component(
                    v-if="isComponentRenderEnabled(setting)"
                    v-bind:is="settingComponents[setting]"
                    :value="ruleSet"
                    :original-value="originalRuleSet"
                    :submitted="submitted"
                    operation-mode="compliance"
                    @settingInput="onSettingInput"
                    @itemInput="onSettingItemInput"
                    @detailViewToggle="onSettingDetailViewToggle"
                    :ref="`setting_${setting}`"
                  )

    .configuration-compliance-rule-set-detail__loading-indicator(
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
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import _ from 'lodash'
import TemplateSettingCategoryListItem
  from '@/components/meraki/templates/template-setting-category-list-item/template-setting-category-list-item'
import NetworkSettingsPageMixin from '@/mixins/network-settings-page.mixin'
import ConfigurationComplianceValidationMixin from '@/mixins/configuration-compliance-validation.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import MerakiOrganizationTargetSelection from '../../common/target-selection/meraki-organization-target-selection'
import MerakiWorkspaceTargetSelection from '../../common/target-selection/meraki-workspace-target-selection'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'configuration-compliance-rule-set-detail',
  components: {
    MerakiWorkspaceTargetSelection,
    MerakiOrganizationTargetSelection,
    TemplateSettingCategoryListItem,
    BaseTextInput,
    BaseButton
  },
  mixins: [
    NetworkSettingsPageMixin,
    ConfigurationComplianceValidationMixin,
    CurrentNodeSelectionsMixin
  ],
  props: {
    ruleSetId: {
      type: Number,
      required: false
    }
  },
  data: function () {
    return {
      loading: false,
      ruleSet: {
        name: null,
        targets: []
      },
      originalRuleSet: {
        name: null,
        targets: []
      },
      submitted: false
    }
  },
  mounted () {
    // Select first section by default,
    this.$set(this, 'selectedSection', this.visibleCategories[0].sections[0])

    if (this.ruleSetId) {
      // Retrieve rule set
      this.retrieveConfigurationComplianceRuleSet()
    } else {
      this.$set(this, 'ruleSet', this.getEmptyRuleSet())
      this.$set(this, 'originalRuleSet', this.getEmptyRuleSet())
    }
  },
  computed: {
    isValid () {
      let isValid = true

      isValid = !!this.ruleSet.name && this.ruleSet.targets.length > 0

      return isValid
    },
    isValueChanged () {
      return !_.isEqual(this.ruleSet, this.originalRuleSet)
    },
    isExistingRuleSet () {
      return this.ruleSet && this.ruleSet.id
    }
  },
  watch: {
    selectedOrganization: {
      handler: function () {
        if (!this.ruleSetId) {
          this.$set(this, 'ruleSet', this.getEmptyRuleSet())
          this.$set(this, 'originalRuleSet', this.getEmptyRuleSet())
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('workspace/network', ['retrieveMerakiConfigurationComplianceRuleSet', 'createMerakiConfigurationComplianceRuleSet',
      'updateMerakiConfigurationComplianceRuleSet']),
    getInitialTargets () {
      // Default is empty list
      return []
    },
    getEmptyRuleSet () {
      return {
        name: null,
        targets: this.getInitialTargets(),
        traffic_shaping_settings: {},
        content_filtering_settings: {},
        firewalled_services: [],
        group_policies: [],
        http_servers: [],
        mx_1_to_1_nat_rules: [],
        mx_1_to_many_nat_rules: [],
        mx_cellular_firewall_rules: [],
        mx_l3_firewall_rules: [],
        mx_l7_firewall_rules: [],
        mx_port_forwarding_rules: [],
        net_flow_settings: {},
        wireless_rf_profiles: [],
        snmp_settings: {},
        static_routes: [],
        switch_acl_rules: [],
        switch_qos_rules: [],
        switch_port_schedules: [],
        switch_settings: {},
        switch_stp_settings: {},
        switch_multicast_settings: {},
        switch_mtu_settings: {},
        syslog_servers: [],
        traffic_analysis_settings: {},
        uplink_settings: {},
        vlans_state: {},
        vlans: [],
        site_to_site_vpn_settings: {},
        alert_settings: {}
      }
    },
    retrieveConfigurationComplianceRuleSet () {
      this.loading = true
      this.retrieveMerakiConfigurationComplianceRuleSet({
        workspaceId: this.workspaceId,
        id: this.ruleSetId
      }).then(response => {
        this.$set(this, 'ruleSet', JSON.parse(JSON.stringify(response.data.data)))
        this.$set(this, 'originalRuleSet', JSON.parse(JSON.stringify(response.data.data)))
      }).finally(() => {
        this.loading = false
      })
    },
    onSaveClick () {
      // Set submitted flag to true so that we display invalid fields
      this.submitted = true

      // Run validations
      if (!this.validate()) {
        return false
      }

      let saveMethod
      if (this.isExistingRuleSet) {
        // Updating an existing role
        saveMethod = this.updateMerakiConfigurationComplianceRuleSet
      } else {
        // Creating a new role
        saveMethod = this.createMerakiConfigurationComplianceRuleSet
      }

      this.loading = true
      saveMethod({
        workspaceId: this.workspaceId,
        ...this.ruleSet
      }).then(response => {
        this.$set(this, 'ruleSet', JSON.parse(JSON.stringify(response.data.data)))
        this.$set(this, 'originalRuleSet', JSON.parse(JSON.stringify(response.data.data)))

        global.toastr['success'](this.$t('v2.configurationCompliance.complianceRuleSetSaveSuccess'), this.$t('general.success'))
      }).catch(() => {
        global.toastr['error'](this.$t('v2.configurationCompliance.complianceRuleSetSaveFailure'), this.$t('general.error'))
      }).finally(() => {
        this.loading = false
      })

      EventTracker.sendEvent(EVENT_NAMES.CONFIGURATION_COMPLIANCE_RULE_SAVED)
    },
    onSettingInput (field, value) {
      this.$set(this.ruleSet, field, value)
    },
    onSettingItemInput (item, field, value) {
      this.$set(item, field, value)
    },
    onResetClick () {
      this.$set(this, 'ruleSet', JSON.parse(JSON.stringify(this.originalRuleSet)))
      this.submitted = false
    },
    onBackClick () {
      this.$router.go(-1)
    }
  }
}
</script>

<style src="./configuration-compliance-rule-set-detail.scss" lang="scss" scoped></style>
