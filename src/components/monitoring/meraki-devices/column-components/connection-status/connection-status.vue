<template lang="pug">
  .connection-status-cell(
    :class="[{'connection-status-cell--online': value.last_status === statusNames.online}, {'connection-status-cell--offline': value.last_status === statusNames.offline && !!value.last_seen}]"
  )
    v-tooltip(
      right
      :color="'#223d70'"
      light
    )
      template(v-slot:activator="{ on }")
        v-icon(
          :icon-color="color"
          v-on="on"
        ) circle
      span {{ tooltip }}
</template>

<script>
import { dateTimeFormatter } from '@/utils/global-cell-formatters'

export default {
  name: 'connection-status',
  props: {
    value: {
      required: true,
      type: Object
    },
    item: {
      type: Object
    }
  },
  data: function () {
    return {
      statusNames: {
        online: 'online',
        offline: 'offline'
      }
    }
  },
  computed: {
    color () {
      if (this.value.last_status === this.statusNames.online) {
        return '#108112'
      }

      if (this.value.last_seen) {
        return '#eb5757'
      }

      return '#c8cdd5'
    },
    tooltipColor () {
      if (this.value.last_status === this.statusNames.online) {
        return '#108112'
      }

      if (this.value.last_seen) {
        return '#eb5757'
      }

      return '#223d70'
    },
    tooltip () {
      if (this.value.last_status === this.statusNames.online) {
        return this.$t('general.online')
      }

      if (this.value.last_seen) {
        return this.$t('general.lastOnlineAt') + ': ' + dateTimeFormatter(this.value.last_seen)
      }

      return this.$t('general.neverSeen')
    }
  }
}
</script>

<style lang="scss" src="./connection-status.scss"></style>
