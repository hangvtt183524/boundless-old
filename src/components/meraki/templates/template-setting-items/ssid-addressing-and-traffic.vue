<template lang="pug">
  template-setting-item.ssid-addressing-and-traffic(
    :title="$t('v2.merakiTemplates.addressingAndTraffic')"
    :operation-mode="operationMode"
  )
    template(v-slot:default)
      v-layout(row wrap).template-setting-item__content__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.clientIpAssigment') }}
        v-flex(xs6 md4 lg4 xl3)
          base-select(
            :items="ipAssignmentModeOptions"
            :value="settingValue.ipAssignmentMode"
            @input="onFieldInput('ipAssignmentMode', $event)"
            :disabled="isFixed"
            clearable
          )

      v-layout(row wrap).template-setting-item__content__row(
        v-show="settingValue.ipAssignmentMode === 'Layer 3 roaming with a concentrator' || settingValue.ipAssignmentMode === 'VPN'"
      )
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.concentrator') }}
        v-flex(xs6 md4 lg4 xl3)
          base-select(
            :items="mxNetworkOptions"
            :value="settingValue.concentratorNetworkId"
            @input="onFieldInput('concentratorNetworkId', $event)"
            :disabled="isFixed"
            clearable
          )

      v-layout(row wrap).template-setting-item__content__row(
        v-show="settingValue.ipAssignmentMode === 'Bridge mode' || settingValue.ipAssignmentMode === 'Layer 3 roaming'"
      )
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.useVlanTagging') }}
        v-flex(xs6 md4 lg3 xl2)
          base-switch(
            :value="settingValue.useVlanTagging"
            @input="onFieldInput('useVlanTagging', $event)"
            :disabled="isFixed"
          )

      v-layout(row wrap).template-setting-item__content__row(
        v-show="settingValue.ipAssignmentMode === 'Bridge mode' || settingValue.ipAssignmentMode === 'Layer 3 roaming' && settingValue.useVlanTagging"
      )
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.defaultVlanId') }}
        v-flex(xs6 md3 lg2 xl1)
          base-text-input(
            :value="settingValue.defaultVlanId"
            @input="onFieldInput('defaultVlanId', $event)"
            v-bind="vlanInputProps"
            :placeholder="$t('v2.merakiTemplates.basicVlanIdPlaceholder')"
            :validations="defaultVlanIdValidations"
            :show-validation-state="showFieldValidationState"
            :disabled="isFixed"
          )

      v-layout(row wrap).template-setting-item__content__row(
        v-show="settingValue.ipAssignmentMode === 'Bridge mode' || settingValue.ipAssignmentMode === 'Layer 3 roaming' && settingValue.useVlanTagging"
      )
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.tagVlans') }}
        v-flex(xs6 md8 lg8 xl6)
          base-table(
            :items="vlanTableItems"
            :headers="vlanTableHeaders"
            :actions="vlanTableActions"
            @actionClick="onVlanActionClick"
            @itemInput="onVlanItemInput"
            :always-editable="true"
            :show-field-validation-state="showFieldValidationState"
            :suppress-field-validation-state-display="isTableEmpty"
            :is-fixed="isFixed"
            :generate-keys="true"
          )
          span.ssid-addressing-and-traffic__add-chart-item-trigger(
            v-if="!isFixed"
            @click="onAddVlanItemClick"
          ) + {{ $t('general.addNew') }}

</template>

<script>
import { mapActions } from 'vuex'
import NetworkTemplateSettingItemMixin from '@/mixins/network-template-setting-item.mixin'
import TemplateSettingItem from './template-setting-item'
import BaseSwitch from '@/components/v2/base-switch/base-switch'
import BaseSelect from '@/components/v2/base-select/base-select'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import BaseTable from '@/components/v2/base-table/base-table'
import { isValidVlan } from '@/utils/form-fields-validation-rules'
import { VLAN_INPUT_PROPS } from '@/constants/form-fields'
import _ from 'lodash'

export default {
  name: 'ssid-addressing-and-traffic',
  mixins: [
    NetworkTemplateSettingItemMixin
  ],
  components: { BaseSwitch, BaseSelect, BaseTextInput, BaseTable, TemplateSettingItem },
  data: function () {
    return {
      field_key: 'definition',
      ipAssigmentModes: ['NAT mode', 'Bridge mode', 'Layer 3 roaming', 'Layer 3 roaming with a concentrator', 'VPN'],
      mxNetworks: [],
      vlanTableHeaders: [
        {
          text: this.$t('v2.merakiTemplates.apTags'),
          value: 'tags',
          type: Array,
          editable: true,
          validations: {
            required: true
          },
          placeholder: this.$t('v2.placeholders.separateByCommas')
        },
        {
          text: this.$t('v2.merakiTemplates.vlanId'),
          value: 'vlanId',
          editable: true,
          placeholder: this.$t('v2.placeholders.vlanId'),
          validations: {
            required: true,
            methods: [{
              method: isValidVlan
            }]
          },
          componentProps: VLAN_INPUT_PROPS
        }
      ],
      vlanTableActions: [
        {
          icon: '$vuetify.icons.delete',
          type: 'remove'
        }
      ],
      defaultVlanIdValidations: {
        required: false,
        methods: [{
          method: isValidVlan
        }]
      },
      computeCounter: 0,
      vlanInputProps: VLAN_INPUT_PROPS
    }
  },
  computed: {
    walledGardenRangesValue () {
      return this.settingValue.walledGardenRanges ? this.settingValue.walledGardenRanges : []
    },
    ipAssignmentModeOptions () {
      const mxDependentModes = ['Layer 3 roaming with a concentrator', 'VPN']
      return this.ipAssigmentModes.filter(mode => {
        return this.mxNetworks.length > 0 ? true : mxDependentModes.indexOf(mode) === -1
      }).map(mode => {
        return {
          key: mode,
          name: mode
        }
      })
    },
    mxNetworkOptions () {
      return this.mxNetworks.map(network => {
        return {
          key: network.meraki_id,
          name: network.name
        }
      })
    },
    isTableEmpty () {
      return _.isNil(this.settingValue.apTagsAndVlanIds) || _.isEmpty(this.settingValue.apTagsAndVlanIds)
    },
    vlanTableItems () {
      // eslint-disable-next-line no-unused-expressions
      this.computeCounter

      return !this.isTableEmpty ? this.settingValue.apTagsAndVlanIds : [this.getEmptyTableItem()]
    }
  },
  methods: {
    ...mapActions('organization/meraki', ['fetchNetworks']),
    fetchMxNetworks () {
      this.fetchNetworks({
        organizationId: this.$route.params.orgId,
        has_mx_device: true
      }).then(response => {
        this.$set(this, 'mxNetworks', response.data.data.results)
      })
    },
    getEmptyTableItem () {
      return {
        tags: [],
        vlanId: null
      }
    },
    addTableItem (tableItem) {
      this.$emit('settingInput', this.field_key, {
        ...this.settingValue,
        apTagsAndVlanIds: [
          ...(this.settingValue.apTagsAndVlanIds ? this.settingValue.apTagsAndVlanIds : []),
          tableItem
        ]
      })
    },
    onFieldInput (field, value) {
      this.$emit('settingInput', this.field_key, {
        ...this.settingValue,
        [field]: value
      })
    },
    onVlanActionClick (action, tableItem) {
      if (action === 'remove') {
        if (this.isTableEmpty) {
          this.computeCounter += 1 // Force re-compute of table items so that row re-renders
          return
        }

        const itemIndex = this.vlanTableItems.indexOf(tableItem)
        this.$emit('settingInput', this.field_key, {
          ...this.settingValue,
          apTagsAndVlanIds: this.settingValue.apTagsAndVlanIds.filter((item, index) => {
            return index !== itemIndex
          })
        })
      }
    },
    onVlanItemInput (tableItem, field, value) {
      // If inputted a value for placeholder item, add it to the list of items first
      if (this.isTableEmpty) {
        this.addTableItem(tableItem)
      }

      this.$emit('itemInput', tableItem, field, value)
    },
    onAddVlanItemClick () {
      if (this.isTableEmpty) {
        // Do twice if the list is already empty, as one item is displayed as placeholder already
        setTimeout(() => {
          this.addTableItem(this.getEmptyTableItem())
        }, 50)
      }

      this.addTableItem(this.getEmptyTableItem())
    }
  }
}
</script>

<style scoped lang="scss">
  @import "styles/v2/colors.scss";

  .ssid-addressing-and-traffic {
    .base-table {
      height: auto;
    }

    &__add-chart-item-trigger {
      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 15px;
      line-height: 35px;
      text-decoration-line: underline;
      color: $green-medium;
      cursor: pointer;
    }
  }

</style>
