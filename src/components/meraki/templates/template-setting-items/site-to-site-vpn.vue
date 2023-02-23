<template lang="pug">
  template-setting-item.site-to-site-vpn(
    :title="$t('v2.merakiTemplates.siteToSiteVpn')"
    :operation-mode="operationMode"
    :customizations="customizations"
    :setting-fields="[field_key]"
    customizations-enabled
    @customizationsClick="$emit('customizationsClick', $event)"
  )
    template(v-slot:default)
      v-layout(row wrap).template-setting-item__content__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.mode') }}
        v-flex(xs6 md4 lg3 xl2)
          base-select(
            :items="modes"
            :value="settingValue.mode"
            @input="onModeInput"
            :validations="{required: true}"
            :show-validation-state="showFieldValidationState"
            :disabled="isFixed"
            clearable
          )

      v-layout(row wrap).template-setting-item__content__row(
        v-show="settingValue.mode === 'hub' || settingValue.mode === 'spoke'"
      )
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.hubs') }}
        v-flex(xs6 md8 lg8 xl6)
          base-table(
            :items="hubsTableItems"
            :headers="hubsTableHeaders"
            :actions="hubsTableActions"
            @actionClick="onHubsActionClick"
            @itemInput="onHubsItemInput"
            @itemReOrder="onHubsItemReorder"
            :show-indices="true"
            :draggable="operationMode === operationModes.template"
            :sortable="false"
            :always-editable="true"
            :show-field-validation-state="showFieldValidationState"
            :suppress-field-validation-state-display="isEmpty"
            :is-fixed="isFixed"
          )
          span.site-to-site-vpn__add-chart-item-trigger(
            v-if="!isFixed"
            @click="onAddHubClick"
          ) + {{ $t('general.addNew') }}

      v-layout(row wrap).template-setting-item__content__row(
        v-show="settingValue.mode === 'hub' || settingValue.mode === 'spoke'"
      )
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.localNetworks') }}
        v-flex(xs6 md8 lg8 xl6)
          base-table(
            :items="localNetworkTableItems"
            :headers="localNetworkTableHeaders"
            @itemInput="onLocalNetworkItemInput"
            :always-editable="true"
            :is-fixed="isFixed"
          )

</template>

<script>
import _ from 'lodash'
import { mapActions } from 'vuex'
import TemplateSettingItem from './template-setting-item'
import NetworkTemplateSettingItemMixin from '@/mixins/network-template-setting-item.mixin'
import BaseSelect from '@/components/v2/base-select/base-select'
import BaseTable from '@/components/v2/base-table/base-table'

export default {
  name: 'site-to-site-vpn',
  mixins: [
    NetworkTemplateSettingItemMixin
  ],
  components: { BaseTable, BaseSelect, TemplateSettingItem },
  data: function () {
    return {
      field_key: 'site_to_site_vpn_settings',
      modes: [
        {
          key: 'none',
          name: this.$t('v2.merakiTemplates.off')
        },
        {
          key: 'hub',
          name: this.$t('v2.merakiTemplates.hub')
        },
        {
          key: 'spoke',
          name: this.$t('v2.merakiTemplates.spoke')
        }
      ],
      hubsTableActions: [
        {
          icon: '$vuetify.icons.delete',
          type: 'remove'
        }
      ],
      localNetworkTableHeaders: [
        {
          text: this.$t('general.name'),
          value: 'name',
          editable: false
        },
        {
          text: this.$t('v2.merakiTemplates.subnet'),
          value: 'localSubnet',
          editable: false
        },
        {
          text: this.$t('v2.merakiTemplates.participatesInVpn'),
          value: 'useVpn',
          editable: true,
          type: Boolean
        }
      ]
    }
  },
  computed: {
    hubsTableHeaders () {
      return [
        {
          text: this.$t('v2.merakiTemplates.hubHeader'),
          value: 'hubId',
          editable: true,
          validations: {
            required: true
          },
          placeholder: this.$t('v2.merakiTemplates.enterNetworkNameOrId'),
          componentProps: {
            title: this.$t('v2.merakiTemplates.enterNetworkNameOrId'),
            suggestions: (value) => {
              return new Promise((resolve, reject) => {
                if (!value || value.length < 2) {
                  resolve([])
                }

                this.fetchMerakiTargetSuggestions({
                  workspaceId: this.workspaceId,
                  query: value,
                  target_types: ['network']
                }).then(response => resolve(_.uniq(response.data.data.map(item => item.name))))
                  .catch(err => reject(err))
              })
            }
          }
        },
        {
          text: this.$t('v2.merakiTemplates.defaultRoute'),
          value: 'useDefaultRoute',
          editable: true,
          type: Boolean
        }
      ]
    },
    hubsTableItems () {
      return this.settingValue.hubs || []
    },
    localNetworkTableItems () {
      const vlanList = (this.value.vlans ? this.value.vlans : [])
      const staticRouteList = (this.value.static_routes ? this.value.static_routes : [])

      const availableSubnets = vlanList.concat(staticRouteList).map(networkItem => {
        return {
          name: networkItem.name,
          subnet: networkItem.subnet
        }
      })

      const vpnSubnets = []
      availableSubnets.forEach(subnetItem => {
        const existingVpnSubnetItem = ((this.settingValue && this.settingValue.subnets) ? this.settingValue.subnets : []).filter(vpnSubnetItem => {
          return vpnSubnetItem.localSubnet === subnetItem.subnet
        })[0]

        if (existingVpnSubnetItem) {
          vpnSubnets.push({
            ...existingVpnSubnetItem,
            name: subnetItem.name
          })
        } else {
          vpnSubnets.push({
            localSubnet: subnetItem.subnet,
            name: subnetItem.name,
            useVpn: false
          })
        }
      })

      return vpnSubnets
    },
    nonConfiguredValue () {
      return {}
    }
  },
  methods: {
    ...mapActions('workspace/network', ['fetchMerakiTargetSuggestions']),
    getEmptyHub () {
      return {
        hubId: '',
        useDefaultRoute: false
      }
    },
    onModeInput (mode) {
      this.$emit('settingInput', this.field_key, {
        ...this.settingValue,
        mode: mode
      })
    },
    onAddHubClick () {
      this.$emit('settingInput', this.field_key, {
        ...this.settingValue,
        hubs: [
          ...this.hubsTableItems,
          this.getEmptyHub()
        ]
      })
    },
    onHubsActionClick (action, tableItem) {
      if (action === 'remove') {
        const itemIndex = this.hubsTableItems.indexOf(tableItem)
        this.$emit('settingInput', this.field_key, {
          ...this.settingValue,
          hubs: this.hubsTableItems.filter((item, index) => index !== itemIndex)
        })
      }
    },
    onHubsItemInput (item, field, value) {
      this.$emit('itemInput', item, field, value)
    },
    onHubsItemReorder (oldIndex, newIndex) {
      // Create a shallow clone of hubs array first
      let hubs = _.clone(this.hubsTableItems)

      // Now move the items in this array
      const movedItem = hubs.splice(oldIndex, 1)[0]
      hubs.splice(newIndex, 0, movedItem)

      this.$emit('settingInput', this.field_key, {
        ...this.settingValue,
        hubs: hubs
      })
    },
    onLocalNetworkItemInput (item, field, value) {
      const subnets = (this.settingValue.subnets ? this.settingValue.subnets : [])
      const isSubnetDefined = subnets.filter(subnetTableItem => {
        return subnetTableItem.localSubnet === item.localSubnet
      }).length > 0

      if (isSubnetDefined) {
        this.$emit('settingInput', this.field_key, {
          ...this.settingValue,
          subnets: subnets.map(subnetTableItem => {
            if (subnetTableItem.localSubnet === item.localSubnet) {
              return {
                ...subnetTableItem,
                [field]: value
              }
            }

            return subnetTableItem
          })
        })
      } else {
        this.$emit('settingInput', this.field_key, {
          ...this.settingValue,
          subnets: subnets.concat({
            ...item,
            [field]: value
          })
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
  @import "styles/v2/colors.scss";

  .site-to-site-vpn {
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
