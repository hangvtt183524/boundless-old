<template lang="pug">
  .compliance-check-detail
    .compliance-check-detail__header
      .compliance-check-detail__header__back-link-container
        v-icon.compliance-check-detail__header__back-link-container__back-icon(
        @click="onBackClick"
        ) keyboard_backspace
      h4.compliance-check-detail__header__page-title
        | {{ complianceCheck.meraki_network ? complianceCheck.meraki_network.name : '' }} - {{ $t('v2.securityCompliance.missingRules') }}
      .compliance-check-detail__header__actions
        base-button.base-button--danger.compliance-check-detail__header__actions__action(
          v-if="!complianceCheck.is_dismissed"
          @click="onDismissClick"
        ) {{ $t('tags.dismiss') }}

    .compliance-check-detail__body
      perfect-scrollbar.compliance-check-detail__body__scroll-area
        .compliance-check-detail__setting-item(
          v-for="field of nonCompliantFieldsInOrder"
          :key="field.field"
        )
          .compliance-check-detail__setting-item__tab-headers(
            v-if="fieldComponents[field.field].is_ssid_field"
          )
            v-layout(row wrap)
              v-flex(xs6 md4 lg3 xl2)
                label {{ $t('general.ssid') }}
              v-flex(xs6 md4 lg3 xl2)
                base-select(
                  :items="getFieldSSIDOptions(field.field)"
                  :value="getSelectedSSIDForField(field.field)"
                  @input="onFieldSSIDSelect(field.field, $event)"
                )

          component(
            v-if="isComponentRenderEnabled(fieldComponents[field.field].key)"
            v-bind:is="settingComponents[fieldComponents[field.field].key]"
            :value="comparisonValue"
            :originalValue="comparisonValue"
            operation-mode="compliance"
            :is-fixed="true"
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
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import _ from 'lodash'

export default {
  name: 'compliance-check-detail',
  components: { BaseSelect, BaseButton },
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
      complianceCheck: {},
      fieldComponents: {
        content_filtering_settings: {
          key: 'content-filtering', order: 0, is_ssid_field: false
        },
        malware_settings: {
          key: 'malware-protection', order: 1, is_ssid_field: false
        },
        intrusion_settings: {
          key: 'intrusion-detection-protection', order: 2, is_ssid_field: false
        },
        firewalled_services: {
          key: 'firewalled-services', order: 3, is_ssid_field: false
        },
        mx_l3_firewall_rules: {
          key: 'mx-l3-firewall-rules', order: 4, is_ssid_field: false
        },
        mx_cellular_firewall_rules: {
          key: 'mx-cellular-firewall-rules', order: 5, is_ssid_field: false
        },
        mx_l7_firewall_rules: {
          key: 'mx-l7-firewall-rules', order: 6, is_ssid_field: false
        },
        mx_port_forwarding_rules: {
          key: 'mx-port-forwarding-rules', order: 7, is_ssid_field: false
        },
        mx_1_to_1_nat_rules: {
          key: 'mx-1-to-1-nat-rules', order: 8, is_ssid_field: false
        },
        mx_1_to_many_nat_rules: {
          key: 'mx-1-to-many-nat-rules', order: 9, is_ssid_field: false
        },
        mr_l3_firewall_rules: {
          key: 'mr-l3-firewall-rules', order: 10, is_ssid_field: true
        }
      },
      settingComponents: {},
      selectedSSIDs: {}
    }
  },
  mounted () {
    this.retrieveSecurityComplianceCheck()
  },
  computed: {
    nonCompliantFields () {
      return this.complianceCheck.non_compliant_fields ? this.complianceCheck.non_compliant_fields : []
    },
    nonCompliantFieldsInOrder () {
      // Return non-compliant fields in the order they are displayed in rule set detail screen, to be able to
      // display them in the same order here
      const fields = _.clone(this.nonCompliantFields)
      fields.sort((first, second) => {
        const firstOrder = this.fieldComponents[first.field].order
        const secondOrder = this.fieldComponents[second.field].order

        return firstOrder > secondOrder ? 1 : (secondOrder > firstOrder ? -1 : 0)
      })

      return fields
    },
    comparisonValue () {
      const comparisonValue = {}

      this.nonCompliantFields.forEach(field => {
        if (this.fieldComponents[field.field].is_ssid_field) {
          comparisonValue[field.field] = field.comparison.ssids.filter(fieldSSID => {
            return fieldSSID.name === this.getSelectedSSIDForField(field.field)
          })[0].rule_set
        } else {
          comparisonValue[field.field] = field.comparison.rule_set
        }
      })

      return comparisonValue
    }
  },
  methods: {
    ...mapActions('workspace/network', ['retrieveMerakiSecurityComplianceCheck', 'updateMerakiSecurityComplianceCheck']),
    retrieveSecurityComplianceCheck () {
      this.loading = true
      this.retrieveMerakiSecurityComplianceCheck({
        workspaceId: this.workspaceId,
        complianceCheckId: this.complianceCheckId
      }).then(response => {
        this.$set(this, 'complianceCheck', JSON.parse(JSON.stringify(response.data.data)))

        // Load setting components
        this.nonCompliantFields.forEach(field => {
          this.loadSettingComponent(this.fieldComponents[field.field].key)
        })
      }).finally(() => {
        this.loading = false
      })
    },
    onDismissClick () {
      this.loading = true
      this.updateMerakiSecurityComplianceCheck({
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
    getFieldSSIDOptions (field) {
      return this.nonCompliantFields.filter(fieldItem => {
        return fieldItem.field === field
      })[0].comparison.ssids.map(ssid => {
        return {
          key: ssid.name,
          name: ssid.name
        }
      })
    },
    getSelectedSSIDForField (field) {
      if (!this.selectedSSIDs.hasOwnProperty(field)) {
        // If no previous entry for SSID selection, select first SSID by default
        this.$set(this.selectedSSIDs, field, this.nonCompliantFields.filter(fieldItem => {
          return fieldItem.field === field
        })[0].comparison.ssids[0].name)
      }

      return this.selectedSSIDs[field]
    },
    onFieldSSIDSelect (field, ssidName) {
      this.$set(this.selectedSSIDs, field, ssidName)
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
