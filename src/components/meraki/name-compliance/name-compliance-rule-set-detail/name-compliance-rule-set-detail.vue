<template lang="pug">
  .name-compliance-rule-set-detail
    .name-compliance-rule-set-detail__header
      .name-compliance-rule-set-detail__header__back-link-container
        v-icon.name-compliance-rule-set-detail__header__back-link-container__back-icon(
          @click="onBackClick"
        ) keyboard_backspace
      h4.name-compliance-rule-set-detail__header__page-title
        | {{ isExistingRuleSet ? originalRuleSet.name : $t('v2.securityCompliance.newRuleSet') }}
      .name-compliance-rule-set-detail__header__actions
        base-button.base-button--green.name-compliance-rule-set-detail__header__actions__action(
          @click="onSaveClick"
          :disabled="!(isValid && isValueChanged)"
        ) {{ $t('general.saveChanges') }}
        base-button.base-button--green--negative.name-compliance-rule-set-detail__header__actions__action(
          @click="onResetClick"
          :disabled="!isValueChanged"
        ) {{ $t('builder.reset') }}

    .name-compliance-rule-set-detail__body
      perfect-scrollbar.name-compliance-rule-set-detail__body__scroll-area

        .name-compliance-rule-set-detail__row
          v-layout(row wrap)
            v-flex(xs6 md4 lg3 xl2)
              label {{ $t('v2.securityCompliance.complianceRuleName') }}
            v-flex(xs6 md4 lg3 xl2)
              base-text-input(
                v-model="ruleSet.name"
                :validations="{required: true}"
                :show-validation-state="submitted"
              )

        .name-compliance-rule-set-detail__row
          v-layout(row wrap)
            v-flex(xs6 md4 lg3 xl2)
              label {{ $t('v2.securityCompliance.whichOrganizationsToAudit') }}
            v-flex(xs6 md8 lg9 xl6)
              base-multi-select(
                :items="workspaceTargetOptions"
                :value="targetSelections"
                @input="onWorkspaceTargetInput"
                :validations="{required: true}"
              )

        .name-compliance-rule-set-detail__row
          v-layout(row wrap)
            v-flex(xs6 md4 lg3 xl2)
                label {{ $t('v2.nameCompliance.appliesTo') }}
            v-flex(xs6 md8 lg9 xl6)
              name-compliance-rule-set-target-selection(
                v-model="ruleSet.entity_types"
              )

        .name-compliance-rule-set-detail__row
          v-layout(row wrap)
            v-flex(xs6 md4 lg3 xl2)
              label {{ $t('v2.merakiTemplates.rules') }}
            v-flex(xs6 md8 lg9 xl10)
              .name-compliance-rule-set-detail__rules
                name-compliance-rule(
                  v-for="rule of ruleSet.rules"
                  :key="getItemKey(rule)"
                  :value="rule"
                  @fieldInput="onFieldInput(rule, ...arguments)"
                  @deleteClick="onRuleDeleteClick(rule)"
                )
                .name-compliance-rule-set-detail__rules__add-rule-button
                  base-button.base-button--blue(
                    @click="onNewRuleClick"
                  ) {{ $t('v2.nameCompliance.newRule') }}

    .name-compliance-rule-set-detail__loading-indicator(
      v-if="loading || isUploadingFile"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )
</template>

<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import BaseButton from '@/components/v2/base-button/base-button'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import BaseMultiSelect from '@/components/v2/base-multi-select/base-multi-select'
import NameComplianceRule from '../name-compliance-rule/name-compliance-rule'
import NameComplianceRuleSetTargetSelection from '../name-compliance-rule-set-target-selection/name-compliance-rule-set-target-selection'
import { isValidNonNegativeInteger } from '@/utils/form-fields-validation-rules'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'name-compliance-rule-set-detail',
  components: {
    NameComplianceRule,
    NameComplianceRuleSetTargetSelection,
    BaseMultiSelect,
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
      submitted: false,
      ruleSet: {
        name: null,
        targets: [],
        entity_types: []
      },
      originalRuleSet: {
        name: null,
        targets: []
      },
      itemKeys: new WeakMap(),
      currentItemKey: 0,
      uploadFileCount: 0,
      allOrganizationsOptionKey: 'all_organizations',
      targetSelections: []
    }
  },
  mounted () {
    if (this.ruleSetId) {
      // Retrieve rule set
      this.retrieveNameComplianceRuleSet()
    } else {
      this.$set(this, 'ruleSet', this.getEmptyRuleSet())
      this.$set(this, 'originalRuleSet', this.getEmptyRuleSet())
    }
  },
  computed: {
    ...mapGetters('layout', ['userWorkspaceOrganizations']),
    isValid () {
      return !!this.ruleSet.name && this.targetSelections.length > 0 &&
        this.ruleSet.rules && this.ruleSet.rules.length > 0 && this.ruleSet.rules.filter(rule => {
        return (rule.operator !== 'in_list' && !rule.value) ||
          (rule.operator === 'matches_regex' && !this.isValidRegex(rule.value)) ||
          (rule.operator === 'matches_pattern' && (
            !rule.pattern_elements || rule.pattern_elements.length === 0 || rule.pattern_elements.filter(patternElement => {
              return !patternElement.name ||
                (!/^[a-zA-Z_][a-zA-Z_0-9]*$/.test(patternElement.name)) ||
                (patternElement.mode === 'dynamic' && patternElement.character_sets.length === 0) ||
                (patternElement.min_length && !isValidNonNegativeInteger(patternElement.min_length)) ||
                (patternElement.max_length && !isValidNonNegativeInteger(patternElement.max_length))
            }).length > 0
          ))
      }).length === 0
    },
    isValueChanged () {
      const originalRuleSetTargetIds = this.ruleSet.targets.map(target => target.id)
      return !_.isEqual(this.ruleSet, this.originalRuleSet) ||
        !(_.isEqual(this.targetSelections, originalRuleSetTargetIds) ||
          (originalRuleSetTargetIds === [] && (this.targetSelections === [] || this.targetSelections === [this.allOrganizationsOptionKey])))
    },
    isExistingRuleSet () {
      return this.ruleSet && this.ruleSet.id
    },
    isUploadingFile () {
      return this.uploadFileCount > 0
    },
    workspaceTargetOptions () {
      // Valid options are those with Meraki integration set up.
      const targetOptions = this.userWorkspaceOrganizations.filter(workspaceOrganization => {
        return !!workspaceOrganization.meraki_organization
      }).map(workspaceOrganization => {
        return {
          key: workspaceOrganization.meraki_organization.id,
          name: workspaceOrganization.name
        }
      })

      // Add "All organizations" option to the beginning of the list
      targetOptions.splice(0, 0, {
        key: this.allOrganizationsOptionKey,
        name: this.$t('tags.allOrganizations'),
        highlighted: true
      })

      return targetOptions
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
    ...mapActions('workspace/network', ['retrieveMerakiNameComplianceRuleSet', 'createMerakiNameComplianceRuleSet',
      'updateMerakiNameComplianceRuleSet', 'uploadMerakiNameComplianceRuleOptions',
      'uploadMerakiNameComplianceRulePatternElementOptions']),
    getEmptyRuleSet () {
      return {
        name: null,
        targets: [],
        entity_types: [],
        rules: []
      }
    },
    getEmptyRule () {
      return {
        operator: null,
        value: null
      }
    },
    getItemKey (item) {
      // Returns a unique key for each rule
      if (!this.itemKeys.has(item)) {
        this.itemKeys.set(item, ++this.currentItemKey)
      }
      return this.itemKeys.get(item)
    },
    onWorkspaceTargetInput (value) {
      const addedItem = value.filter(target => !this.targetSelections.includes(target))[0]

      if (addedItem === this.allOrganizationsOptionKey) {
        // Clear target selection on "All organizations select"
        this.$set(this, 'targetSelections', [this.allOrganizationsOptionKey])
        return
      }

      // Selected regular organization. Filter out "All organization" option from value, if exists.
      this.$set(this, 'targetSelections', value.filter(target => target !== this.allOrganizationsOptionKey))
    },
    retrieveNameComplianceRuleSet () {
      this.loading = true
      this.retrieveMerakiNameComplianceRuleSet({
        workspaceId: this.workspaceId,
        id: this.ruleSetId
      }).then(response => {
        this.$set(this, 'ruleSet', JSON.parse(JSON.stringify(response.data.data)))
        this.$set(this, 'originalRuleSet', JSON.parse(JSON.stringify(response.data.data)))

        this.$set(this, 'targetSelections', this.ruleSet.targets.length > 0
          ? this.ruleSet.targets.map(target => target.id) : [this.allOrganizationsOptionKey])
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
        saveMethod = this.updateMerakiNameComplianceRuleSet
      } else {
        // Creating a new role
        saveMethod = this.createMerakiNameComplianceRuleSet
      }

      // Skip file fields for each rule. We'll upload files manually after save complete
      const ruleSetUpdateData = {
        ...this.ruleSet,
        targets: (this.targetSelections.length === 1 && this.targetSelections[0] === this.allOrganizationsOptionKey)
          ? [] : this.targetSelections.map(targetId => {
            const targetOrganization = this.userWorkspaceOrganizations.find(workspaceOrganization => {
              return !!workspaceOrganization.meraki_organization &&
                workspaceOrganization.meraki_organization.id === targetId
            })

            return {
              id: targetOrganization.meraki_organization.id,
              name: targetOrganization.meraki_organization.name
            }
          }),
        rules: this.ruleSet.rules.map(rule => {
          const filteredRule = _.pickBy(rule, (value, key) => {
            return key !== 'file'
          })

          if (filteredRule.pattern_elements) {
            filteredRule.pattern_elements = filteredRule.pattern_elements.map(patternElement => _.pickBy(patternElement, (value, key) => {
              return key !== 'file'
            }))
          }

          return filteredRule
        })
      }

      this.loading = true
      saveMethod({
        workspaceId: this.workspaceId,
        ...ruleSetUpdateData
      }).then(response => {
        // After save is complete, upload any rule or pattern element name option files
        this.ruleSet.rules.filter((rule, index) => {
          // Get corresponding rule object from response, that contains ids
          const responseRule = response.data.data.rules[index]

          if (rule.file) {
            this.uploadNameListFile(response.data.data.id, responseRule.id, rule.file)
          }

          (rule.pattern_elements || []).filter(patternElement => !!patternElement.file).forEach(patternElement => {
            const responsePatternElement = responseRule.pattern_elements.find(item => item.name === patternElement.name)
            if (responsePatternElement) {
              this.uploadPatternElementListFile(response.data.data.id, responsePatternElement.id, patternElement.file)
            }
          })
        })

        this.$set(this, 'ruleSet', JSON.parse(JSON.stringify(response.data.data)))
        this.$set(this, 'originalRuleSet', JSON.parse(JSON.stringify(response.data.data)))

        this.$set(this, 'targetSelections', this.ruleSet.targets.length > 0
          ? this.ruleSet.targets.map(target => target.id) : [this.allOrganizationsOptionKey])

        global.toastr['success'](this.$t('v2.nameCompliance.complianceRuleSetSaveSuccess'), this.$t('general.success'))
      }).catch(() => {
        global.toastr['error'](this.$t('v2.nameCompliance.complianceRuleSetSaveFailure'), this.$t('general.error'))
      }).finally(() => {
        this.loading = false
      })

      EventTracker.sendEvent(EVENT_NAMES.NAME_COMPLIANCE_RULE_SAVED)
    },
    uploadNameListFile (ruleSetId, ruleId, file) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('rule', ruleId)

      this.performNameListUpload(this.uploadMerakiNameComplianceRuleOptions, ruleSetId, formData)
    },
    uploadPatternElementListFile (ruleSetId, patternElementId, file) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('pattern_element', patternElementId)

      this.performNameListUpload(this.uploadMerakiNameComplianceRulePatternElementOptions, ruleSetId, formData)
    },
    performNameListUpload (method, ruleSetId, formData) {
      this.uploadFileCount += 1
      method({
        workspaceId: this.workspaceId,
        id: ruleSetId,
        formData: formData
      }).then(response => {
        this.$set(this, 'ruleSet', JSON.parse(JSON.stringify(response.data.data)))
        this.$set(this, 'originalRuleSet', JSON.parse(JSON.stringify(response.data.data)))

        global.toastr['success'](this.$t('v2.nameCompliance.nameOptionFileUploadSuccess'), this.$t('general.success'))
      }).catch(() => {
        global.toastr['error'](this.$t('v2.nameCompliance.nameOptionFileUploadFailure'), this.$t('general.error'))
      }).finally(() => {
        this.uploadFileCount -= 1
      })
    },
    onNewRuleClick () {
      this.$set(this.ruleSet, 'rules', [...this.ruleSet.rules, this.getEmptyRule()])
    },
    onFieldInput (rule, field, value) {
      this.$set(rule, field, value)
    },
    onRuleDeleteClick (deletedRule) {
      this.$set(this.ruleSet, 'rules', this.ruleSet.rules.filter(rule => {
        return rule !== deletedRule
      }))
    },
    onResetClick () {
      this.$set(this, 'ruleSet', JSON.parse(JSON.stringify(this.originalRuleSet)))
      this.$set(this, 'targetSelections', this.ruleSet.targets.length > 0
        ? this.ruleSet.targets.map(target => target.id) : [this.allOrganizationsOptionKey])

      this.submitted = false
    },
    onBackClick () {
      this.$router.go(-1)
    },
    isValidRegex (value) {
      try {
        RegExp(value)
        return true
      } catch (e) {
        return false
      }
    }
  }
}
</script>

<style src="./name-compliance-rule-set-detail.scss" lang="scss" scoped></style>
