<template lang="pug">
  .security-compliance-rule-set-detail
    .security-compliance-rule-set-detail__header
      .security-compliance-rule-set-detail__header__back-link-container
        v-icon.security-compliance-rule-set-detail__header__back-link-container__back-icon(
        @click="onBackClick"
        ) keyboard_backspace
      h4.security-compliance-rule-set-detail__header__page-title
        | {{ isExistingRuleSet ? originalRuleSet.name : $t('v2.securityCompliance.newRuleSet') }}
      .security-compliance-rule-set-detail__header__actions
        base-button.base-button--green.security-compliance-rule-set-detail__header__actions__action(
          @click="onSaveClick"
          :disabled="!(isValid && isValueChanged)"
        ) {{ $t('general.saveChanges') }}
        base-button.base-button--green--negative.security-compliance-rule-set-detail__header__actions__action(
          @click="onResetClick"
          :disabled="!isValueChanged"
        ) {{ $t('builder.reset') }}

    .security-compliance-rule-set-detail__body
      perfect-scrollbar.security-compliance-rule-set-detail__body__scroll-area

        .security-compliance-rule-set-detail__field-row
          v-layout(row wrap)
            v-flex(xs6 md4 lg3 xl2)
              label {{ $t('v2.securityCompliance.complianceRuleName') }}
            v-flex(xs6 md4 lg3 xl2)
              base-text-input(
                v-model="ruleSet.name"
                :validations="{required: true}"
                :show-validation-state="submitted"
              )

        .security-compliance-rule-set-detail__field-row
          v-layout(row wrap)
            v-flex(xs6 md4 lg3 xl2)
              label {{ $t('v2.securityCompliance.whichOrganizationsToAudit') }}
            v-flex(xs6 md8 lg9 xl10)
              meraki-workspace-target-selection(
                v-model="ruleSet.targets"
                :target-types="['network', 'tag']"
              )

        .security-compliance-rule-set-detail__setting-item(
          v-for="setting of settings"
          :key="setting"
        )
          component(
            v-if="isComponentRenderEnabled(setting)"
            v-bind:is="settingComponents[setting]"
            :value="ruleSet"
            :original-value="originalRuleSet"
            operation-mode="compliance"
            :submitted="submitted"
            @settingInput="onSettingInput"
            @itemInput="onSettingItemInput"
          )

    .security-compliance-rule-set-detail__loading-indicator(
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
import MerakiOrganizationTargetSelection from '../../common/target-selection/meraki-organization-target-selection'
import MerakiWorkspaceTargetSelection from '../../common/target-selection/meraki-workspace-target-selection'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'security-compliance-rule-set-detail',
  components: {
    MerakiWorkspaceTargetSelection,
    MerakiOrganizationTargetSelection,
    BaseTextInput,
    BaseButton
  },
  mixins: [
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
      settings: ['content-filtering', 'malware-protection', 'intrusion-detection-protection',
        'firewalled-services', 'mx-l3-firewall-rules', 'mx-cellular-firewall-rules', 'mx-l7-firewall-rules',
        'mx-port-forwarding-rules', 'mx-1-to-1-nat-rules', 'mx-1-to-many-nat-rules', 'mr-l3-firewall-rules'],
      settingComponents: {},
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
    this.settings.forEach(setting => {
      this.loadSettingComponent(setting)
    })

    if (this.ruleSetId) {
      // Retrieve rule set
      this.retrieveSecurityComplianceRuleSet()
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
    ...mapActions('workspace/network', ['retrieveMerakiSecurityComplianceRuleSet', 'createMerakiSecurityComplianceRuleSet',
      'updateMerakiSecurityComplianceRuleSet']),
    getInitialTargets () {
      // Default is empty list
      return []
    },
    getEmptyRuleSet () {
      return {
        name: null,
        targets: this.getInitialTargets()
      }
    },
    retrieveSecurityComplianceRuleSet () {
      this.loading = true
      this.retrieveMerakiSecurityComplianceRuleSet({
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

      let saveMethod
      if (this.isExistingRuleSet) {
        // Updating an existing role
        saveMethod = this.updateMerakiSecurityComplianceRuleSet
      } else {
        // Creating a new role
        saveMethod = this.createMerakiSecurityComplianceRuleSet
      }

      this.loading = true
      saveMethod({
        workspaceId: this.workspaceId,
        ...this.ruleSet
      }).then(response => {
        this.$set(this, 'ruleSet', JSON.parse(JSON.stringify(response.data.data)))
        this.$set(this, 'originalRuleSet', JSON.parse(JSON.stringify(response.data.data)))

        global.toastr['success'](this.$t('v2.securityCompliance.complianceRuleSetSaveSuccess'), this.$t('general.success'))
      }).catch(() => {
        global.toastr['error'](this.$t('v2.securityCompliance.complianceRuleSetSaveFailure'), this.$t('general.error'))
      }).finally(() => {
        this.loading = false
      })

      EventTracker.sendEvent(EVENT_NAMES.SECURITY_COMPLIANCE_RULE_SAVED)
    },
    onResetClick () {
      this.$set(this, 'ruleSet', JSON.parse(JSON.stringify(this.originalRuleSet)))
      this.submitted = false
    },
    loadSettingComponent (componentKey) {
      import(`../../templates/template-setting-items/${componentKey}.vue`).then(component => {
        this.$set(this.settingComponents, componentKey, component.default)
      })
    },
    isComponentRenderEnabled (componentKey) {
      return this.settingComponents.hasOwnProperty(componentKey)
    },
    onSettingInput (field, value) {
      this.$set(this.ruleSet, field, value)
    },
    onSettingItemInput (item, field, value) {
      this.$set(item, field, value)
    },
    onBackClick () {
      this.$router.go(-1)
    }
  }
}
</script>

<style src="./security-compliance-rule-set-detail.scss" lang="scss" scoped></style>
