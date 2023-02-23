<template lang='pug'>
  .security-compliance-rule-set-list.page-content(
  data-test="user-list"
  )
    .security-compliance-rule-set-list__header
      search-input.base-text-input--small.security-compliance-rule-set-list__header__search-input(
        :placeholder="$t('general.search')"
        v-model="search"
      )
      .security-compliance-rule-set-list__header__actions
        base-button.base-button--blue.security-compliance-rule-set-list__header__actions__download-button(
          @click="onNewRuleSetClick"
        )
          | {{ $t('v2.securityCompliance.newRuleSet') }}

    .security-compliance-rule-set-list__content
      base-table.security-compliance-rule-set-list__content__rule-set-table(
        :items="merakiSecurityComplianceRuleSets"
        :headers="tableHeaders"
        :actions="tableActions"
        :is-external-sort="true"
        :is-expandable="true"
        @actionClick="onTableActionClick"
        @loadMore="onScrollEnd"
        @sortOrderChange="onSortOrderChange"
        @rowExpand="onRowExpand"
      )
        template(
          v-slot:row-expand-area='props'
        )
          .security-compliance-rule-set-list__content__rule-set-table__checks
            compliance-check-list(
              :rule-set-id="props.props.item.id"
            )

    .security-compliance-rule-set-list__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
      :size="50"
      indeterminate
      color="#15ac2f"
      )

    confirm-modal(
      ref="confirmModal"
    )
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import EmptyOrganizationListCheckMixin from '@/mixins/empty-organization-list-check.mixin'

import BaseTable from '@/components/v2/base-table/base-table.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'

import { dateTimeFormatter } from '@/utils/global-cell-formatters'
import SearchInput from '@/components/v2/search-input/search-input'
import ConfirmModal from '@/components/v2/confirm-modal/confirm-modal'
import ComplianceCheckList from '../compliance-check-list/compliance-check-list'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'security-compliance-rule-set-list',
  mixins: [
    UserPermissionsMixin,
    CurrentNodeSelectionsMixin,
    EmptyOrganizationListCheckMixin
  ],
  components: {
    ComplianceCheckList,
    ConfirmModal,
    SearchInput,
    BaseTable,
    BaseButton
  },
  data () {
    return {
      search: '',
      loading: false,
      tableActions: [
        {
          icon: '$vuetify.icons.edit',
          type: 'edit'
        },
        {
          icon: 'file_copy',
          type: 'duplicate',
          tooltip: this.$t('general.duplicate')
        },
        {
          icon: '$vuetify.icons.delete',
          type: 'remove'
        }
      ],
      page: 1,
      pageSize: 50,
      ordering: null
    }
  },
  mounted () {
    this.fetchRuleSets()
  },
  computed: {
    ...mapGetters('workspace/network', ['merakiSecurityComplianceRuleSets', 'merakiSecurityComplianceRuleSetsCount']),
    pageCount () {
      return Math.ceil(this.merakiSecurityComplianceRuleSetsCount / this.pageSize)
    },
    tableHeaders () {
      const headers = [
        {
          text: this.$t('general.name'),
          value: 'name'
        },
        {
          text: this.$t('v2.securityCompliance.alerts'),
          value: 'check_count'
        },
        {
          text: this.$t('wifi.createdOn'),
          value: 'created_at',
          formatter: dateTimeFormatter
        }
      ]

      // If we have any row with legacy_organization_name field set, add corresponding header
      if (this.merakiSecurityComplianceRuleSets.find(item => !!item.legacy_organization_name)) {
        headers.splice(1, 0, {
          text: this.$t('general.organization'),
          value: 'legacy_organization_name'
        })
      }

      return headers
    }
  },
  watch: {
    search: {
      handler: function () {
        // Reset page number
        this.page = 1

        // Re-fetch rule sets after search change
        this.fetchRuleSets()
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('workspace/network', ['fetchMerakiSecurityComplianceRuleSets', 'deleteMerakiSecurityComplianceRuleSet',
      'createMerakiSecurityComplianceRuleSet']),
    fetchRuleSets () {
      let filters = {
        page_size: this.pageSize,
        page: this.page,
        search: this.search,
        workspaceId: this.workspaceId
      }

      if (this.ordering) {
        filters.ordering = this.ordering
      }

      this.loading = true
      this.fetchMerakiSecurityComplianceRuleSets(filters).finally(() => {
        this.loading = false
      })
    },
    onScrollEnd () {
      if (this.page < this.pageCount && !this.loading) {
        this.$set(this, 'page', this.page + 1)
        this.fetchRuleSets()
      }
    },
    onSortOrderChange (ordering) {
      this.ordering = ordering

      // Reset page number
      this.page = 1

      this.fetchRuleSets()
    },
    onTableActionClick (actionType, item) {
      if (actionType === 'edit') {
        this.$router.push({ name: 'SecurityComplianceRuleSetDetail', params: { ruleSetId: item.id } })
      } else if (actionType === 'remove') {
        this.removeRuleSet(item)
      } else if (actionType === 'duplicate') {
        this.duplicateRuleSet(item)
      }
    },
    onNewRuleSetClick () {
      this.$router.push({ name: 'NewSecurityComplianceRuleSet' })

      EventTracker.sendEvent(EVENT_NAMES.SECURITY_COMPLIANCE_RULE_STARTED)
    },
    removeRuleSet (ruleSet) {
      this.$refs.confirmModal.open(
        this.$t('errors.warning'),
        this.$t('v2.securityCompliance.complianceRuleSetDeleteConfirmation')
      ).then(confirm => {
        if (confirm) {
          this.deleteMerakiSecurityComplianceRuleSet({
            workspaceId: this.workspaceId,
            id: ruleSet.id
          }).then(response => {
            // Re-fetch rule sets
            this.fetchRuleSets()

            global.toastr['success'](this.$t('v2.securityCompliance.complianceRuleSetDeleteSuccess'), this.$t('general.success'))
          }).catch(() => {
            global.toastr['error'](this.$t('v2.securityCompliance.complianceRuleSetDeleteFailure'), this.$t('general.error'))
          })

          EventTracker.sendEvent(EVENT_NAMES.SECURITY_COMPLIANCE_RULE_DELETED)
        }
      })
    },
    duplicateRuleSet (ruleSet) {
      this.$refs.confirmModal.open(
        this.$t('errors.warning'),
        this.$t('v2.merakiTemplates.templateDuplicateConfirmation').replace('{template_name}', '<b>' + ruleSet.name + '</b>')
      ).then(confirm => {
        if (confirm) {
          this.loading = true
          const duplicate = {
            ...ruleSet,
            workspaceId: this.workspaceId,
            name: `Copy of ${ruleSet.name}`
          }
          delete duplicate.id

          this.createMerakiSecurityComplianceRuleSet(duplicate).then(() => {
            // Re-fetch roles
            this.fetchRuleSets()

            global.toastr['success'](this.$t('v2.merakiTemplates.duplicateTemplateSuccess'), this.$t('general.success'))
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    onRowExpand () {
      EventTracker.sendEvent(EVENT_NAMES.SECURITY_COMPLIANCE_VIOLATIONS_VIEWED)
    }
  }
}
</script>

<style src="./security-compliance-rule-set-list.scss" lang="scss" scoped></style>
