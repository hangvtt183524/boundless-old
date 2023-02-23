<template lang="pug">
  .compliance-check-detail
    .compliance-check-detail__header
      .compliance-check-detail__header__back-link-container
        v-icon.compliance-check-detail__header__back-link-container__back-icon(
        @click="onBackClick"
        ) keyboard_backspace
      h4.compliance-check-detail__header__page-title
        | {{ complianceCheck.name }} - {{ $t('v2.nameCompliance.failingRules') }}
      .compliance-check-detail__header__actions
        base-button.base-button--danger.compliance-check-detail__header__actions__action(
          v-if="!complianceCheck.is_dismissed"
          @click="onDismissClick"
        ) {{ $t('tags.dismiss') }}

    .compliance-check-detail__body
      perfect-scrollbar.compliance-check-detail__body__scroll-area
        .compliance-check-detail__body__rules
          name-compliance-rule(
            v-for="(rule, index) of nonCompliantRules"
            :key="index"
            :value="rule"
            :is-fixed="true"
          )

        .compliance-check-detail__body__list-description(
          v-if="nonCompliantRules.length === 0"
        ) {{ $t('v2.nameCompliance.listFailureDescription') }}

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
import NameComplianceRule from '../name-compliance-rule/name-compliance-rule'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

export default {
  name: 'compliance-check-detail',
  components: { NameComplianceRule, BaseButton },
  mixins: [
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
      complianceCheck: {}
    }
  },
  mounted () {
    this.retrieveNameComplianceCheck()
  },
  computed: {
    nonCompliantRules () {
      return this.complianceCheck.non_compliant_rules ? this.complianceCheck.non_compliant_rules : []
    }
  },
  methods: {
    ...mapActions('workspace/network', ['retrieveMerakiNameComplianceCheck', 'updateMerakiNameComplianceCheck']),
    retrieveNameComplianceCheck () {
      this.loading = true
      this.retrieveMerakiNameComplianceCheck({
        workspaceId: this.workspaceId,
        complianceCheckId: this.complianceCheckId
      }).then(response => {
        this.$set(this, 'complianceCheck', JSON.parse(JSON.stringify(response.data.data)))
      }).finally(() => {
        this.loading = false
      })
    },
    onDismissClick () {
      this.loading = true
      this.updateMerakiNameComplianceCheck({
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
    onBackClick () {
      this.$router.go(-1)
    }
  }
}
</script>

<style src="./compliance-check-detail.scss" lang="scss" scoped></style>
