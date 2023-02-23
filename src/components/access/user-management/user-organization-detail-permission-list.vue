<template lang="pug">
  .user-organization-detail-permission-list
    base-table.user-organization-detail-permission-list__table(
      :items="detailPermissions"
      :headers="headers"
      :item-key="entity"
    )

</template>

<script>
import BaseTable from '@/components/v2/base-table/base-table'

export default {
  name: 'user-organization-detail-permission-list',
  components: {
    BaseTable
  },
  props: {
    organizationUser: {
      type: Object,
      required: true
    },
    tagsOnly: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      headers: [
        {
          text: this.tagsOnly ? this.$t('general.tags') : this.$t('v2.access.tagsOrNetworks'),
          value: 'entity'
        },
        {
          text: this.$t('v2.access.privileges'),
          value: 'access',
          formatter: (value) => {
            return value.charAt(0).toUpperCase() + value.slice(1) // Capitalized
          }
        }
      ],
      detailPermissions: [] // Aggregated list of network / tag level permissions
    }
  },
  mounted () {
    this.setAggregatedDetailPermissions(this.organizationUser.networks, this.organizationUser.tags)
  },
  methods: {
    setAggregatedDetailPermissions (networks, tags) {
      // Method to construct aggregated detail permission from network / tag level permissions
      this.detailPermissions = (networks.concat(tags)).map(permissionItem => {
        return {
          entity: permissionItem.meraki_network ? permissionItem.meraki_network_name : permissionItem.tag_name,
          access: permissionItem.access
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.user-organization-detail-permission-list {

}

</style>
