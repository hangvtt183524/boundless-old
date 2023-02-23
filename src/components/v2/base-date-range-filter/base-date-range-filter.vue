<template lang="pug">
  .base-date-range-filter(
    v-click-outside="onClickOutside"
  )
    .base-date-range-filter__selected-range(
      @click="fixedOptionSelectorExpanded = true"
    )
      span {{ selectedRange ? selectedRange.name : $t('v2.merakiClients.selectDateRange') }}
      v-icon arrow_drop_down
    transition(name='slide')
      .base-date-range-filter__dropdown(v-show="fixedOptionSelectorExpanded")
        .base-date-range-filter__dropdown__body
          .base-date-range-filter__dropdown__body__item(
            v-for="item in items"
            :key="item.name"
            :class="[{'base-date-range-filter__dropdown__body__item--selected': isSelected(item) }]"
            @click="onChangeFilterItem(item)"
          ) {{ item.name }}
</template>

<script>
import { formatDateTime } from '@/utils/date-time'
export default {
  name: 'base-date-range-filter',
  props: {
  },
  data: function () {
    return {
      fixedOptionSelectorExpanded: false,
      selectedRange: null,
      items: [
        { name: this.$t('v2.merakiClients.lastHour'), beforeInHours: 1 },
        { name: this.$t('v2.merakiClients.last24Hour'), beforeInHours: 24 },
        { name: this.$t('v2.merakiClients.lastWeek'), beforeInHours: 7 * 24 },
        { name: this.$t('v2.merakiClients.lastMonth'), beforeInHours: 30 * 24 },
        { name: this.$t('v2.merakiClients.lifeTime'), beforeInHours: -1 }
      ]
    }
  },
  mounted () {
    this.selectedRange = this.items[this.items.length - 1]
  },
  computed: {
  },
  methods: {
    isSelected (item) {
      return this.selectedRange && item.name === this.selectedRange.name
    },
    onChangeFilterItem (item) {
      this.selectedRange = item
      this.fixedOptionSelectorExpanded = false

      if (item.beforeInHours !== -1) {
        let now = new Date()
        let after = new Date()
        after.setTime(after.getTime() - (item.beforeInHours * 60 * 60 * 1000))
        this.$emit('change', {
          date_range_after: formatDateTime(after),
          date_range_before: formatDateTime(now)
        })
      } else {
        this.$emit('change', {
          date_range_after: ''
        })
      }
    },
    onClickOutside () {
      this.fixedOptionSelectorExpanded = false
    }
  }
}
</script>

<style src="./base-date-range-filter.scss" lang="scss" scoped></style>
