<template lang="pug">
  .template-deployment-page
    .template-deployment-page__target-selection-container
      deployment-target-selection(
        v-model="targets"
        target-type="network_base"
        :target-creation-enabled="true"
        :query-fields="queryFields"
        @deployClick="onDeployClick"
      )
        template(
          v-slot:preview
        )
          template-preview(
            v-if="template"
            :template="template"
            :assign-switch-profiles="assignSwitchProfiles"
          )

        template(
          v-if="hasPolicyBasedFirewallRules && hasOtherOrganizationTargets"
          v-slot:message-area
        )
          .template-deployment-page__target-selection-container__warnings
            | {{ $t('v2.merakiTemplates.policyBasedRuleDeploymentWarnings') }}

        template(
          v-if="template.switch_profiles && template.switch_profiles.length > 0"
          v-slot:action-area
        )
          base-check-box.template-deployment-page__target-selection-container__switch-profile-state(
            v-model="assignSwitchProfiles"
            :label="$t('v2.merakiTemplates.assignSwitchProfiles')"
          )

    job-tracking-modal(
      :persistent="true"
      display-post-run-messages
      ignore-warnings-for-status
      :message-info-formatter="jobMessageInfoFormatter"
      ref="jobTrackingModal"
    )

</template>

<script>
import { mapActions } from 'vuex'
import DeploymentTargetSelection from '../../common/deployment-target-selection/deployment-target-selection'
import TemplatePreview from '../template-preview/template-preview'
import JobTrackingModal from '@/components/v2/job-tracking-modal/job-tracking-modal.vue'
import BaseCheckBox from '@/components/v2/base-check-box/base-check-box.vue'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import NetworkDeploymentScreenMixin from '@/mixins/network-deployment-screen.mixin'
import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'template-deployment',
  components: {
    TemplatePreview,
    DeploymentTargetSelection,
    JobTrackingModal,
    BaseCheckBox
  },
  mixins: [
    CurrentNodeSelectionsMixin,
    NetworkDeploymentScreenMixin
  ],
  props: {
    templateId: {
      type: Number,
      required: true
    }
  },
  data: function () {
    return {
      loading: false,
      submitted: false,
      template: null,
      targets: [],
      assignSwitchProfiles: null
    }
  },
  mounted () {
    this.fetchTemplate()
  },
  computed: {
    queryFields () {
      const queryFields = ['network_base', 'tag']
      queryFields.push('organization')

      return queryFields
    },
    hasPolicyBasedFirewallRules () {
      return this.template &&
        ([...(this.template.mx_l3_firewall_rules || []), ...(this.template.mx_cellular_firewall_rules || [])]).filter(rule => {
          const regex = /(OBJ|GRP)\(\d+\)/
          return regex.test(rule.destCidr) || regex.test(rule.srcCidr)
        }).length > 0
    },
    hasOtherOrganizationTargets () {
      // Returns true if template has a source organization, and any target selected for another organization
      return this.template && this.template.source_organization &&
        this.targets.filter(target => target.organization !== this.template.source_organization).length > 0
    }
  },
  methods: {
    ...mapActions('workspace/network', ['fetchMerakiTemplate']),
    ...mapActions('workspace/network', ['deployMerakiTemplate']),
    fetchTemplate () {
      this.loading = true
      this.fetchMerakiTemplate({
        workspaceId: this.workspaceId,
        templateId: this.templateId
      }).then(response => {
        this.template = response.data.data

        this.$set(this, 'assignSwitchProfiles', this.template.assign_switch_profiles)
      }).finally(() => {
        this.loading = false
      })
    },
    onDeployClick () {
      const deploymentData = {
        targets: this.targets,
        assign_switch_profiles: this.assignSwitchProfiles
      }

      this.deployMerakiTemplate({
        workspaceId: this.workspaceId,
        templateId: this.template.id,
        ...deploymentData
      }).then(response => {
        // Start tracking job
        this.$refs.jobTrackingModal.open(
          response.data.data.id,
          this.$t('v2.merakiTemplates.deploymentProgressTitle'),
          this.$t('v2.merakiTemplates.deploymentProgressDescription')
        ).then(success => {
          if (success) {
            global.toastr['success'](this.$t('v2.merakiTemplates.deploymentSuccess'), this.$t('general.success'))

            // Go back to template listing page
            this.$router.push({ name: 'TemplateList' })
          } else {
            global.toastr['error'](this.$t('v2.merakiTemplates.deploymentFailure'), this.$t('general.error'))
          }
        })
      }).catch(() => {
        global.toastr['error'](this.$t('v2.merakiTemplates.deploymentFailure'), this.$t('general.error'))
      })

      EventTracker.sendEvent(EVENT_NAMES.FLEXTEMPLATE_DEPLOYED, {
        target_type: this.targetMode,
        target_count: deploymentData.targets.length
      })
    }
  }
}
</script>

<style src="./template-deployment.scss" lang="scss" scoped></style>
