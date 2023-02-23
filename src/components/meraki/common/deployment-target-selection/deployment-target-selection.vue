<template lang="pug">
  .deployment-target-selection
    .deployment-target-selection__header
      h3.deployment-target-selection__header__title
        | {{ title }}
      .deployment-target-selection__header__description
        | {{ description }}

    .deployment-target-selection__content
      deployment-target-entity-selection(
        v-if="currentStep.key === 'parent_organization_selection'"
        v-model="workspaceParentOrganizations"
        :target-type="targetTypes.organization"
        key="parent_organization_selection"
      )

      deployment-target-entity-selection(
        v-if="currentStep.key === 'target_selection'"
        :value="value"
        @input="onTargetsInput"
        :target-type="targetType"
        :filter-organizations="workspaceParentOrganizations.map(organizationTarget => organizationTarget.organization)"
        :target-creation-enabled="targetCreationEnabled"
        :query-fields="queryFields || []"
        key="target_selection"
      )

      .deployment-target-selection__content__confirmation-step(
        v-if="currentStep.key === 'confirmation'"
      )
        v-layout(row wrap)
          v-flex(xs12 lg6)
            .deployment-target-selection__content__confirmation-step__preview
              slot(name="preview")

          v-flex(xs12 lg6)
            deployment-target-entity-selection(
              :value="value"
              :target-type="targetType"
              :is-fixed="true"
              key="confirmation"
            )

    .deployment-target-selection__footer
      .deployment-target-selection__footer__message-area
        slot(name="message-area")

      .deployment-target-selection__footer__actions
        .deployment-target-selection__footer__actions__left-actions
          base-button.base-button--green--negative.deployment-target-selection__footer__actions__action(
            v-show="currentStepNumber > 0"
            @click="onPreviousClick"
          ) {{ $t('general.previous') }}

        .deployment-target-selection__footer__actions__right-actions
          .deployment-target-selection__footer__actions__right-actions__action-area(
            v-if="currentStepNumber === steps.length - 1"
          )
            slot(name="action-area")

          base-button.base-button--green.deployment-target-selection__footer__actions__action(
            :disabled="!isValid"
            v-show="currentStepNumber < steps.length - 1"
            @click="onNextClick"
          ) {{ $t('general.next') }}
          base-button.base-button--green.deployment-target-selection__footer__actions__action(
            v-show="currentStepNumber === steps.length - 1"
            @click="onDeployClick"
          ) {{ $t('v2.merakiTemplates.deploy') }}

</template>

<script>
import _ from 'lodash'
import BaseButton from '@/components/v2/base-button/base-button'
import DeploymentTargetEntitySelection from './deployment-target-entity-selection'

export default {
  name: 'deployment-target-selection',
  components: {
    DeploymentTargetEntitySelection,
    BaseButton
  },
  props: {
    value: {
      type: Array,
      required: true
    },
    targetType: {
      type: String,
      required: true
    },
    targetCreationEnabled: {
      type: Boolean,
      default: false
    },
    queryFields: {
      type: Array,
      required: false
    }
  },
  data: function () {
    return {
      targetTypes: {
        organization: 'organization',
        networkBase: 'network_base', // Both network and config template
        network: 'network',
        tag: 'tag'
        // Will be added as needed
        // device: 'device'
      },
      currentStepNumber: 0,
      workspaceParentOrganizations: []
    }
  },
  computed: {
    steps () {
      const steps = [
        {
          key: 'target_selection',
          title: this.$t('v2.merakiCommon.selectTargets'),
          description: this.$t('v2.merakiCommon.selectTargetsDescription')
        },
        {
          key: 'confirmation',
          title: this.$t('v2.merakiCommon.confirmChanges'),
          description: this.$t('v2.merakiCommon.confirmChangesDescription')
        }
      ]

      // Add organization selection step
      steps.splice(0, 0, {
        key: 'parent_organization_selection',
        title: this.$t('v2.merakiCommon.selectOrganizations'),
        description: this.$t('v2.merakiCommon.selectOrganizationsDescription')
      })

      return steps
    },
    currentStep () {
      return this.steps[this.currentStepNumber]
    },
    title () {
      return this.currentStep.title
    },
    description () {
      return this.currentStep.description
    },
    isValid () {
      if (this.currentStep.key === 'parent_organization_selection') {
        if ((_.isNil(this.workspaceParentOrganizations) || _.isEmpty(this.workspaceParentOrganizations))) {
          return false
        }
      }

      if (this.currentStep.key === 'target_selection') {
        if ((_.isNil(this.value) || _.isEmpty(this.value))) {
          return false
        }
      }

      return true
    }
  },
  watch: {
    workspaceParentOrganizations: {
      handler: function (value) {
        // If parent organization list changes, remove any targets belonging to removed organizations from value
        if (value && value.length > 0) {
          const parentOrganizationIds = value.map(target => target.organization)
          this.$emit('input', this.value.filter(
            target => parentOrganizationIds.indexOf(target.organization) > -1)
          )
        }
      },
      deep: true
    }
  },
  methods: {
    onTargetsInput (value) {
      this.$emit('input', value)
    },
    onNextClick () {
      this.currentStepNumber++
    },
    onDeployClick () {
      this.$emit('deployClick')
    },
    onPreviousClick () {
      this.currentStepNumber--
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .deployment-target-selection {
    display: flex;
    flex-flow: column;
    height: 100%;

    &__header {
      flex: 0 1 auto;
      text-align: center;

      &__description {
        margin-top: 20px;
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 24px;
        color: $text-medium;
      }
    }

    &__content {
      flex: 1 1 auto;
      display: flex;
      flex-flow: column;
      overflow-y: auto;
      margin-top: 40px;
    }

    &__footer {
      flex: 0 1 auto;
      margin-top: 20px;

      &__actions {
        overflow: hidden;

        &__left-actions {
          float: left;

          .deployment-target-selection__footer__actions__action:not(:last-child) {
            margin-right: 10px;
          }
        }

        &__right-actions {
          float: right;

          .deployment-target-selection__footer__actions__action:not(:first-child) {
            margin-left: 10px;
          }

          &__action-area {
            display: inline-block;
            margin-right: 20px;
          }
        }
      }
    }
  }

  @media only screen and (min-width: 1264px) {
    .deployment-target-selection {
      height: 100%;

      &__content {
        &__confirmation-step {
          height: 100%;

          .layout, .flex {
            height: 100%;
          }

          &__preview {
            margin-right: 30px;
            height: 100%;
            overflow: hidden;
          }
        }
      }
    }
  }

  @media only screen and (max-width: 1263px) {
    .deployment-target-selection {
      &__content {
        &__confirmation-step {
          &__preview {
            margin-right: 30px;
          }
        }
      }
    }
  }
</style>
