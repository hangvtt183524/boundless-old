<template lang="pug">
  .user-organization-permissions-form
    v-layout(row wrap)
      v-flex(
        :class="['xs6', {'md4': !isFullScreen}, {'lg2': !isFullScreen}, {'xl2': !isFullScreen}]"
      )
        base-select(
          :value="value.access"
          @input="onOrganizationAccessInput"
          :items="organizationAccessOptions"
          :label="$t('v2.access.organizationAccess')"
        )

    v-layout.user-organization-permissions-form__detail-permissions(row wrap)
      v-flex(
        :class="['xs12', {'lg9': !isFullScreen}, {'xl6': !isFullScreen}]"
      )
        base-table.user-organization-permissions-form__detail-permissions__table(
          :items="detailPermissionsTableItems"
          :headers="detailPermissionsHeaders"
          :always-editable="true"
          :actions="detailPermissionsTableActions"
          @actionClick="onTableActionClick"
          @itemInput="onTableItemInput"
          :actions-label="$t('general.remove')"
          generate-keys
        )

        span.user-organization-permissions-form__detail-permissions__add-item-trigger(
          @click="addNewDetailPermission"
        ) + {{ $t('general.addNew') }}

</template>

<script>
import _ from 'lodash'
import { mapActions } from 'vuex'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import BaseSelect from '@/components/v2/base-select/base-select'
import BaseTable from '@/components/v2/base-table/base-table.vue'

export default {
  name: 'user-organization-permissions-form',
  components: {
    BaseSelect,
    BaseTable
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  props: {
    value: {
      type: Object,
      required: true
    },
    ownerOrganizationId: {
      type: Number,
      required: false
    },
    isFullScreen: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      accessTypes: {
        full: 'full',
        readOnly: 'read-only',
        enterprise: 'enterprise',
        none: 'none'
      },
      organizationAccessOptions: ['full', 'read-only', 'enterprise', 'none'].map(option => {
        return {
          key: option,
          name: option.charAt(0).toUpperCase() + option.slice(1) // Capitalized
        }
      }),
      detailAccessOptions: ['full', 'read-only', 'guest-ambassador', 'monitor-only'].map(option => {
        return {
          key: option,
          name: option.charAt(0).toUpperCase() + option.slice(1) // Capitalized
        }
      }),
      networkOptions: null,
      tagOptions: null,
      detailPermissions: [], // Aggregated list of network / tag level permissions
      detailPermissionsTableActions: [
        {
          icon: '$vuetify.icons.delete',
          type: 'remove',
          tooltip: this.$t('v2.access.removeAccess')
        }
      ],
      computeCounter: 0
    }
  },
  mounted () {
    this.setAggregatedDetailPermissions(this.value.networks, this.value.tags)

    // Fetch all organization networks and tags
    if (this.ownerOrganizationId) {
      this.fetchNetworkOptions()
    }

    this.fetchTagOptions()
  },
  computed: {
    detailPermissionEntityOptions () {
      // Construct tag options to contain already-added tags
      const tagOptions = (this.tagOptions || []).concat(
        (this.value.tags || []).map(userTag => {
          return {
            name: userTag.tag_name
          }
        })
      )

      return [
        {
          name: this.$t('wifi.networks'),
          children: (this.networkOptions || []).map(network => {
            return {
              key: `N__${network.id}`,
              name: network.name
            }
          }).sort((first, second) => {
            if (first.name.toLowerCase() > second.name.toLowerCase()) {
              return 1
            } else if (second.name.toLowerCase() > first.name.toLowerCase()) {
              return -1
            }

            return 0
          })
        },
        {
          name: this.$t('general.tags'),
          children: _.uniqBy(tagOptions, 'name').map(tag => {
            return {
              key: `T__${tag.name}`,
              name: tag.name
            }
          }).sort((first, second) => {
            if (first.name.toLowerCase() > second.name.toLowerCase()) {
              return 1
            } else if (second.name.toLowerCase() > first.name.toLowerCase()) {
              return -1
            }

            return 0
          })
        }
      ]
    },
    detailPermissionsHeaders () {
      return [
        {
          text: this.ownerOrganizationId ? this.$t('v2.access.tagsOrNetworks') : this.$t('general.tags'),
          value: 'entity',
          editable: true,
          type: String,
          options: this.detailPermissionEntityOptions,
          optionsSearchEnabled: true,
          validations: {
            required: true
          }
        },
        {
          text: this.$t('v2.access.privileges'),
          value: 'access',
          editable: true,
          type: String,
          options: this.detailAccessOptions,
          validations: {
            required: true
          }
        }
      ]
    },
    isValid () {
      // If there are any detail permission entities with in-filled fields
      return this.detailPermissions.filter(permission => permission.access === null || permission.entity === null).length === 0
    },
    isDetailPermissionsEmpty () {
      return _.isNil(this.detailPermissions) || _.isEmpty(this.detailPermissions)
    },
    detailPermissionsTableItems () {
      // eslint-disable-next-line no-unused-expressions
      this.computeCounter

      return !this.isDetailPermissionsEmpty ? this.detailPermissions : [this.getEmptyDetailPermission()]
    }
  },
  watch: {
    isValid: {
      handler (newValue) {
        this.$emit('validStateChange', newValue)
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions('organization/meraki', ['fetchNetworks']),
    ...mapActions('workspace/network', ['fetchTags']),
    fetchNetworkOptions () {
      this.fetchNetworks({
        organizationId: this.ownerOrganizationId,
        page_size: 0,
        page: 1
      }).then(response => {
        this.networkOptions = response.data.data
      })
    },
    fetchTagOptions () {
      const filters = {
        workspaceId: this.workspaceId,
        page_size: 0,
        page: 1
      }

      // Add organization filter if provided
      if (this.ownerOrganizationId) {
        filters.organization = this.ownerOrganizationId
      }

      this.fetchTags(filters).then(response => {
        this.tagOptions = response.data.data
      })
    },
    setAggregatedDetailPermissions (networks, tags) {
      // Method to construct aggregated detail permission from network / tag level permissions
      this.detailPermissions = (networks.concat(tags)).map(permissionItem => {
        return {
          entity: permissionItem.meraki_network ? `N__${permissionItem.meraki_network}` : `T__${permissionItem.tag_name}`,
          access: permissionItem.access
        }
      })
    },
    setDetailPermissionsFromAggregatedPermissions () {
      // Method to construct network / tag level permissions on organizationUser object from aggregated permissions,
      // to be called on updates to aggregated permissions
      if (!this.isValid) {
        // Do not proceed if permissions is not valid
        return
      }

      this.$emit('input', {
        ...this.value,
        networks: this.detailPermissions.filter(
          permissionItem => permissionItem.entity.substring(0, 3) === 'N__'
        ).map(permissionItem => {
          const networkId = parseInt(permissionItem.entity.substring(3))
          return {
            meraki_network: networkId,
            meraki_network_name: this.networkOptions.find(network => network.id === networkId).name,
            access: permissionItem.access
          }
        }),
        tags: this.detailPermissions.filter(
          permissionItem => permissionItem.entity.substring(0, 3) === 'T__'
        ).map(permissionItem => {
          return {
            tag_name: permissionItem.entity.substring(3),
            access: permissionItem.access
          }
        })
      })
    },
    getEmptyDetailPermission () {
      return {
        entity: null,
        access: null
      }
    },
    normalizeOrganizationLevelAccess () {
      // Set organization level permissions to 'none' when a detail permission is added and organization level
      // permissions set to 'full' or 'enterprise'
      if (this.value.access === this.accessTypes.full ||
        this.value.access === this.accessTypes.enterprise) {
        this.$emit('input', {
          ...this.value,
          access: this.accessTypes.none
        })
      }
    },
    addNewDetailPermission () {
      if (this.isDetailPermissionsEmpty) {
        // Do twice if the list is already empty, as one item is displayed as placeholder already
        setTimeout(() => {
          this.detailPermissions.push(this.getEmptyDetailPermission())
        }, 50)
      }

      this.detailPermissions.push(this.getEmptyDetailPermission())

      this.normalizeOrganizationLevelAccess()
    },
    onTableItemInput (tableItem, field, value) {
      // If inputted a value for placeholder item, add it to the list of items first
      if (this.isDetailPermissionsEmpty) {
        this.detailPermissions.push(tableItem)
        this.normalizeOrganizationLevelAccess()
      }

      this.$set(tableItem, field, value)

      if (this.isValid) {
        this.setDetailPermissionsFromAggregatedPermissions()
      }
    },
    onTableActionClick (action, tableItem) {
      if (action === 'remove') {
        if (this.isDetailPermissionsEmpty) {
          this.computeCounter += 1 // Force re-compute of table items so that row re-renders
        } else {
          this.detailPermissions = this.detailPermissions.filter(permissionItem => permissionItem !== tableItem)
        }

        if (this.isValid) {
          this.setDetailPermissionsFromAggregatedPermissions()
        }
      }
    },
    onOrganizationAccessInput (value) {
      this.$emit('input', {
        ...this.value,
        access: value
      })

      // If organization-level access is set to 'full' or 'enterprise', clear detail permissions
      if (value === this.accessTypes.full || value === this.accessTypes.enterprise) {
        setTimeout(() => {
          this.detailPermissions = []
          this.setDetailPermissionsFromAggregatedPermissions()
        }, 50)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.user-organization-permissions-form {
  &__detail-permissions {
    margin-top: 40px;

    &__table {
      height: auto;
    }

    &__add-item-trigger {
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
}
</style>
