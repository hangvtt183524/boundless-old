<template lang="pug">
  .user-removal-list
    base-table(
      :items="value"
      :headers="tableHeaders"
      :sortable="false"
    )

</template>

<script>
import BaseTable from '@/components/v2/base-table/base-table'

export default {
  name: 'user-removal-list',
  components: {
    BaseTable
  },
  props: {
    value: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      tableHeaders: [
        {
          text: this.$t('v2.access.removingFollowingUsers'),
          value: 'name',
          formatter: (value, item) => {
            return `${item.name} <${item.email}>`
          }
        }
      ]
    }
  }
}
</script>
