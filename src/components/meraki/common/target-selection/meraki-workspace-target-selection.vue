<template lang="pug">
  .meraki-workspace-target-selection
    v-layout.meraki-workspace-target-selection__organization-selection-row(row wrap)
      v-flex(
        xs6
        :class="[{'md4': !fullWidth, 'lg3': !fullWidth, 'xl2': !fullWidth, }]"
      )
        base-select(
          v-model="selectedTargetOrganizationId"
          :items="organizationOptions"
          :placeholder="$t('v2.merakiTemplates.selectOrganization')"
        )
      v-flex(
        xs6
        :class="[{'md4': !fullWidth, 'lg3': !fullWidth, 'xl2': !fullWidth, }]"
      )
        base-button.base-button--blue(
          @click="onAddTargetOrganizationClick"
        ) {{ $t('general.add') }}

    .meraki-workspace-target-selection__organizations
      .meraki-workspace-target-selection__organizations__organization(
        v-for="organization of targetOrganizations"
        :key="organization.id"
      )
        .meraki-workspace-target-selection__organizations__organization__title
          | {{ organization.name }}
        v-layout(row wrap)
          v-flex(xs10 md11)
            meraki-organization-target-selection(
              :value="getOrganizationTargets(organization)"
              @input="onOrganizationTargetInput(organization, ...arguments)"
              :organization="organization"
              :target-types="targetTypes"
              :placeholder="placeholder"
              :full-access-label="fullAccessLabel"
            )
          v-flex.meraki-workspace-target-selection__organizations__organization__actions(xs2 md1)
            v-icon.meraki-workspace-target-selection__organizations__organization__actions__action(
              @click="onRemoveTargetOrganizationClick(organization)"
            ) close

</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import BaseSelect from '@/components/v2/base-select/base-select'
import BaseMultiSelect from '@/components/v2/base-multi-select/base-multi-select'
import BaseButton from '@/components/v2/base-button/base-button'
import MerakiOrganizationTargetSelection from './meraki-organization-target-selection'

export default {
  name: 'meraki-workspace-target-selection',
  components: {
    MerakiOrganizationTargetSelection,
    BaseButton,
    BaseSelect,
    BaseMultiSelect
  },
  props: {
    value: {
      type: Array,
      required: true
    },
    targetTypes: {
      type: Array,
      required: true
    },
    placeholder: {
      type: String,
      required: false
    },
    fullAccessLabel: {
      type: String,
      required: false
    },
    fullWidth: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      selectedTargetOrganizationId: null,
      targetOrganizations: [],
      allOrganizationsOptionKey: 'all_organizations'
    }
  },
  mounted () {
    this.setTargetOrganizations()
  },
  computed: {
    ...mapGetters('layout', ['userWorkspaceOrganizations']),
    selectableOrganizations () {
      // Valid options are those with Meraki integration set up. Exclude already selected organizations
      const merakiOrganizationIds = _.uniq(this.value.map(target => {
        return target.meraki_organization
      }))

      return this.userWorkspaceOrganizations.filter(workspaceOrganization => {
        return !!workspaceOrganization.meraki_organization &&
          merakiOrganizationIds.indexOf(workspaceOrganization.meraki_organization.id) === -1
      })
    },
    organizationOptions () {
      let organizationOptions = this.selectableOrganizations.map(workspaceOrganization => {
        return {
          key: workspaceOrganization.id,
          name: workspaceOrganization.name
        }
      })

      // If there are still organizations to select, add "All organizations" option at the top
      if (organizationOptions.length > 0) {
        organizationOptions = [{
          key: this.allOrganizationsOptionKey,
          name: this.$t('tags.allOrganizations'),
          highlighted: true
        }, ...organizationOptions]
      }

      return organizationOptions
    },
    selectedTargetOrganization () {
      const workspaceOrganization = this.userWorkspaceOrganizations.find(workspaceOrganization => {
        return workspaceOrganization.id === this.selectedTargetOrganizationId
      })

      return workspaceOrganization || null
    }
  },
  watch: {
    value: {
      handler: function () {
        this.setTargetOrganizations()
      },
      deep: true
    },
    userWorkspaceOrganizations: {
      handler: function (newValue, oldValue) {
        this.setTargetOrganizations()
      },
      deep: true
    }
  },
  methods: {
    setTargetOrganizations () {
      // Go over current target selections. If an organization is not in the list of currently visible target
      // organizations, add it to the list
      const merakiOrganizationIds = _.uniq(this.value.map(target => {
        return target.meraki_organization
      }))

      return this.userWorkspaceOrganizations.filter(workspaceOrganization => {
        return workspaceOrganization.meraki_organization &&
          merakiOrganizationIds.indexOf(workspaceOrganization.meraki_organization.id) > -1
      }).forEach(workspaceOrganization => {
        if (!this.targetOrganizations.find(targetOrganization => {
          return targetOrganization.id === workspaceOrganization.id
        })) {
          this.targetOrganizations.push(workspaceOrganization)
        }
      })
    },
    getOrganizationTargets (organization) {
      return this.value.filter(target => {
        return target.meraki_organization === organization.meraki_organization.id
      })
    },
    onAddTargetOrganizationClick () {
      let organizationsToSelect = []
      if (this.selectedTargetOrganizationId === this.allOrganizationsOptionKey) {
        // Select all organizations
        organizationsToSelect = this.selectableOrganizations.map(workspaceOrganization => {
          return {
            id: workspaceOrganization.meraki_organization.id,
            name: workspaceOrganization.meraki_organization.name,
            target_type: 'organization',
            meraki_organization: workspaceOrganization.meraki_organization.id
          }
        })
      } else {
        organizationsToSelect = [{
          id: this.selectedTargetOrganization.meraki_organization.id,
          name: this.selectedTargetOrganization.meraki_organization.name,
          target_type: 'organization',
          meraki_organization: this.selectedTargetOrganization.meraki_organization.id
        }]
      }

      this.$emit('input', [
        ...this.value,
        ...organizationsToSelect
      ])

      // Re-set selected organization
      this.selectedTargetOrganizationId = null
    },
    onRemoveTargetOrganizationClick (organization) {
      this.$emit('input', this.value.filter(target => {
        return target.meraki_organization !== organization.meraki_organization.id
      }))

      this.targetOrganizations = this.targetOrganizations.filter(targetOrganization => {
        return targetOrganization.id !== organization.id
      })
    },
    onOrganizationTargetInput (organization, targets) {
      this.$emit('input', [
        ...this.value.filter(target => {
          return target.meraki_organization !== organization.meraki_organization.id
        }),
        ...targets
      ])
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .meraki-workspace-target-selection {
    &__organization-selection-row {
      .base-button {
        margin-left: 20px;
        margin-top: 2px;
      }
    }

    &__organizations {
      &__organization {
        margin-top: 20px;

        &__title {
          font-family: Fira Sans;
          font-style: normal;
          font-weight: normal;
          font-size: 14px;
          line-height: 41px;
          color: $text-medium;
        }

        &__actions {
          text-align: right;

          &__action {
            cursor: pointer;
            margin-top: 9px;
          }
        }
      }
    }
  }
</style>
