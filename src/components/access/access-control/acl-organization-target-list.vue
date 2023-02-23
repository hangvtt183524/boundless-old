<template lang="pug">
  .acl-organization-target-list
    base-table(
      :items="targets"
      :headers="tableHeaders"
    )

</template>

<script>
import BaseTable from '@/components/v2/base-table/base-table'

export default {
  name: 'acl-organization-target-list',
  components: {
    BaseTable
  },
  props: {
    targets: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      tableHeaders: [
        {
          text: this.$t('wifi.type'),
          value: 'target_type',
          formatter: (value, item) => {
            const effectiveTargetType = item.network_type ? item.network_type : value
            return this.$t(`v2.merakiCommon.targetTypes.${effectiveTargetType}`)
          }
        },
        {
          text: this.$t('general.name'),
          value: 'name'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.acl-organization-target-list {
  background-color: $white;
  position: relative;
  min-height: 100px;
}
</style>
